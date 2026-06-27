#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal \u2014 GitHub fetcher.
 * Fetches skill files from raw.githubusercontent.com (or a configured mirror).
 * Built on node:https \u2014 zero extra deps.
 *
 * Honors:
 *   SYNARC_OFFLINE=1      \u2014 skip all network calls, return null
 *   SYNARC_GH_REF=<ref>   \u2014 override the default ref (default: main)
 *   SYNARC_GH_OWNER=...   \u2014 override the owner (default: upflame-labs)
 *   SYNARC_GH_REPO=...    \u2014 override the repo   (default: synarc)
 *   HTTPS_PROXY=...       \u2014 use a proxy
 *   SYNARC_FETCH_TIMEOUT  \u2014 timeout in ms (default: 10000)
 *
 * @module synarc/fetcher
 */

const https = require("node:https");
const http  = require("node:http");
const { URL } = require("node:url");

const DEFAULTS = {
  owner: "upflame-labs",
  repo:  "synarc",
  ref:   "main",
  timeout: 10000,
  retries: 2,
  userAgent: "synarc (+https://github.com/upflame-labs/synarc)",
};

function config() {
  return {
    owner:   process.env.SYNARC_GH_OWNER || DEFAULTS.owner,
    repo:    process.env.SYNARC_GH_REPO  || DEFAULTS.repo,
    ref:     process.env.SYNARC_GH_REF   || DEFAULTS.ref,
    timeout: Number(process.env.SYNARC_FETCH_TIMEOUT) || DEFAULTS.timeout,
    retries: Number(process.env.SYNARC_FETCH_RETRIES) || DEFAULTS.retries,
  };
}

function isOffline() {
  return process.env.SYNARC_OFFLINE === "1";
}

/**
 * Fetch a single file from raw.githubusercontent.com.
 * @param {string} relPath  e.g. "synarc-universal/skills/foo/SKILL.md"
 * @param {object} [opts]
 * @param {string} [opts.ref]
 * @param {number} [opts.timeout]
 * @param {function} [opts.onProgress]  ({ received, total }) => void
 * @returns {Promise<{ content: string, bytes: number, status: number, url: string, duration: number }>}
 */
async function fetchRaw(relPath, opts = {}) {
  if (isOffline()) {
    const err = new Error("offline mode (SYNARC_OFFLINE=1)");
    err.code = "OFFLINE";
    throw err;
  }
  const cfg = { ...config(), ...opts };
  const url = `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.ref}/${relPath}`;

  const start = Date.now();
  const { content, bytes, status } = await fetchUrl(url, cfg, opts.onProgress);
  return { content, bytes, status, url, duration: Date.now() - start };
}

function fetchUrl(urlStr, cfg, onProgress) {
  return new Promise((resolve, reject) => {
    let url;
    try { url = new URL(urlStr); } catch (e) { return reject(new Error("bad URL: " + urlStr)); }
    const lib = url.protocol === "https:" ? https : http;
    const reqOpts = {
      method: "GET",
      hostname: url.hostname,
      port:     url.port || (url.protocol === "https:" ? 443 : 80),
      path:     url.pathname + url.search,
      headers: {
        "User-Agent": DEFAULTS.userAgent,
        "Accept":     "application/vnd.github.raw",
      },
    };

    // Honor HTTPS_PROXY
    if (process.env.HTTPS_PROXY && url.protocol === "https:") {
      try {
        const proxy = new URL(process.env.HTTPS_PROXY);
        reqOpts.hostname = proxy.hostname;
        reqOpts.port     = proxy.port || 443;
        reqOpts.path     = urlStr;
        reqOpts.headers.Host = url.host;
      } catch (e) { /* bad proxy URL, ignore */ }
    }

    const req = lib.request(reqOpts, (res) => {
      // Handle redirects (raw.githubusercontent.com doesn't usually, but be safe)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetchUrl(res.headers.location, cfg, onProgress));
      }
      if (res.statusCode === 404) {
        res.resume();
        const e = new Error("not found: " + urlStr);
        e.code = "NOT_FOUND";
        e.status = 404;
        return reject(e);
      }
      if (res.statusCode >= 400) {
        res.resume();
        const e = new Error("HTTP " + res.statusCode + " for " + urlStr);
        e.code = "HTTP_" + res.statusCode;
        e.status = res.statusCode;
        return reject(e);
      }

      const chunks = [];
      let received = 0;
      const total = Number(res.headers["content-length"]) || 0;
      res.on("data", (chunk) => {
        chunks.push(chunk);
        received += chunk.length;
        if (onProgress) {
          try { onProgress({ received, total }); } catch { /* swallow callback errors */ }
        }
      });
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve({ content: buf.toString("utf-8"), bytes: buf.length, status: res.statusCode });
      });
      res.on("error", reject);
    });
    req.setTimeout(cfg.timeout, () => {
      req.destroy(new Error("timeout after " + cfg.timeout + "ms"));
    });
    req.on("error", (err) => {
      err.url = urlStr;
      reject(err);
    });
    req.end();
  });
}

/**
 * Fetch with retries and exponential backoff.
 * @param {string} relPath
 * @param {object} [opts]  see fetchRaw + onAttempt({ attempt, max, error, delay })
 */
async function fetchWithRetry(relPath, opts = {}) {
  const cfg = { ...config(), ...opts };
  const max = cfg.retries + 1;
  let lastErr;
  for (let attempt = 1; attempt <= max; attempt++) {
    try {
      const r = await fetchRaw(relPath, opts);
      if (opts.onAttempt) opts.onAttempt({ attempt, max, ok: true });
      return r;
    } catch (err) {
      lastErr = err;
      // 4xx (except 408/429) are not retryable
      const status = err.status || 0;
      if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
        if (opts.onAttempt) opts.onAttempt({ attempt, max, error: err });
        throw err;
      }
      if (attempt === max) break;
      const delay = Math.min(2000, 200 * Math.pow(2, attempt - 1));
      if (opts.onAttempt) opts.onAttempt({ attempt, max, error: err, delay });
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

/**
 * Fetch a JSON file from GitHub.
 * Convenience wrapper that parses the content.
 */
async function fetchJson(relPath, opts = {}) {
  const r = await fetchWithRetry(relPath, opts);
  try {
    return { ...r, data: JSON.parse(r.content) };
  } catch (e) {
    e.message = "JSON parse failed for " + relPath + ": " + e.message;
    throw e;
  }
}

/**
 * Check whether the network is reachable.
 * Returns { ok, duration, error? }
 */
async function ping(timeout = 5000) {
  const start = Date.now();
  try {
    await fetchRaw("README.md", { timeout, retries: 0 });
    return { ok: true, duration: Date.now() - start };
  } catch (err) {
    return { ok: false, duration: Date.now() - start, error: err.message };
  }
}

module.exports = {
  config,
  isOffline,
  fetchRaw,
  fetchWithRetry,
  fetchJson,
  ping,
  DEFAULTS,
};
