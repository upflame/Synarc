"use strict";
/**
 * Synarc Universal — event bus + hooks
 * SDK consumers register hooks to react to events in the install pipeline.
 *
 * Hooks are async functions. They are awaited in registration order.
 * A hook that throws does not abort the pipeline (errors are logged).
 *
 * Built-in events:
 *   beforeInstall, afterInstall
 *   beforeVerify, afterVerify
 *   beforeRemove, afterRemove
 *   beforeDoctor, afterDoctor
 *   onError
 *
 * @module synarc-universal/lib/events
 */

const { EventEmitter } = require("node:events");

class HookBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Register a hook. Returns an unsubscribe function.
   */
  on(event, handler) {
    if (typeof handler !== "function") {
      throw new TypeError(`hook for "${event}" must be a function, got ${typeof handler}`);
    }
    super.on(event, handler);
    return () => super.off(event, handler);
  }

  /**
   * Fire an event. Returns the results of all handlers.
   * Errors are caught and emitted on the onError channel; they never abort the pipeline.
   */
  async emit(event, payload) {
    const listeners = this.listeners(event);
    if (listeners.length === 0) return [];
    const results = [];
    for (const fn of listeners) {
      try {
        const r = await fn(payload);
        results.push({ ok: true, value: r });
      } catch (err) {
        results.push({ ok: false, error: err });
        // Re-emit on onError so SDK consumers can observe
        try { this.emit("onError", { event, payload, error: err }); } catch { /* */ }
      }
    }
    return results;
  }
}

const globalBus = new HookBus();

// Default hook names (for documentation + auto-completion)
const EVENTS = Object.freeze([
  "beforeInstall",
  "afterInstall",
  "beforeVerify",
  "afterVerify",
  "beforeRemove",
  "afterRemove",
  "beforeDoctor",
  "afterDoctor",
  "onError",
]);

module.exports = { HookBus, globalBus, EVENTS };
