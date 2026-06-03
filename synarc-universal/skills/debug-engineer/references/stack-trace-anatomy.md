# Stack Trace Anatomy

How to read a stack trace by language. The first non-framework frame is almost always where the bug is. Framework frames are the path the request took; they are not the cause.

## JavaScript / TypeScript (Node and browser)

```text
TypeError: Cannot read properties of undefined (reading 'id')
    at getUserId (/app/src/services/user.js:42:18)
    at processRequest (/app/src/handlers/request.js:17:24)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:144:13)
    at Route.dispatch (/app/node_modules/express/lib/router/route.js:114:3)
    ...
```

Read bottom-up. The bottom is the entry point (Express, Koa, the test runner). The top is where the throw happened. Ignore frames in `node_modules/`. The first non-`node_modules` frame is `/app/src/services/user.js:42` — that is where to look.

For async traces, look for the `at async` lines. The error was thrown in a promise; the rejection propagated through the async chain. The first async frame in your code is the real site.

## Python

```text
Traceback (most recent call last):
  File "/app/services/user.py", line 42, in get_user_id
    return user.id
AttributeError: 'NoneType' object has no attribute 'id'
```

Read top-down. The last frame is where the exception was raised. The frames above are the call chain. Skip frames in site-packages, stdlib, and your web framework. The first frame in your code is where to look.

For Django/Flask/FastAPI, the request middleware adds 3-5 frames. The first frame in your view or service is the real site.

## Go

```text
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x4a3b2e]

goroutine 1 [running]:
main.processUser(0xc0000a0000)
	/app/main.go:42 +0x6e
main.handleRequest(0xc0000a0180, 0xc0000a0200)
	/app/main.go:87 +0x1f3
net/http.HandlerFunc.ServeHTTP(0xc0000a02a0, 0x1234abc, 0xc0000a0300)
	/usr/local/go/src/net/http/server.go:2042 +0x2f
```

The first frame in `/app/` is where to look. The panic value (`nil pointer dereference`) tells you what kind of bug — a nil check is missing somewhere up the call chain.

## Rust

```text
thread 'main' panicked at 'called `Option::unwrap()` on a `None` value', src/services/user.rs:42:5
stack backtrace:
   0: rust_begin_unwind
             at /rustc/.../library/std/src/panicking.rs:584:5
   1: core::panicking::panic_fmt
             at /rustc/.../library/core/src/panicking.rs:142:14
   2: <core::panic::PanicInfo as core::fmt::Display>::fmt
   3: user_service::get_user_id
             at /app/src/services/user.rs:42:5
   4: user_service::process_request
             at /app/src/services/user.rs:17:1
```

Read from frame 3. The `unwrap()` on a `None` is the symptom. The cause is upstream: where did the `None` come from? Trace the Option back.

## JVM (Java, Kotlin, Scala)

```text
java.lang.NullPointerException: Cannot invoke "User.getId()" because "user" is null
    at com.example.service.UserService.getUserId(UserService.java:42)
    at com.example.handler.RequestHandler.processRequest(RequestHandler.java:17)
    at com.example.framework.Router.dispatch(Router.java:88)
    ...
```

The first frame in `com.example.*` (your code, not the framework) is where the NPE happened. The line is where the dereference occurred; the cause is that `user` was null. Trace where `user` came from.

For Spring, skip `org.springframework.*` and `sun.*` frames. For Netty, skip `io.netty.*`.

## .NET (C#)

```text
System.NullReferenceException: Object reference not set to an instance of an object.
   at UserService.GetUserId(User user) in /app/Services/UserService.cs:line 42
   at RequestHandler.ProcessRequest(Request req) in /app/Handlers/RequestHandler.cs:line 17
   at Microsoft.AspNetCore.Routing.EndpointMiddleware.Invoke(HttpContext context)
   ...
```

The first frame in `/app/` is where to look. The NRE line is where the dereference failed; the cause is upstream.

## Caused by chains

Many JVM and .NET traces include `Caused by: ... at ...` sections. The outermost exception is the symptom; the innermost `Caused by` is the root cause. Read the chain in order: outer → inner. Fix the inner one. The outer will usually disappear.

Example:

```text
java.lang.RuntimeException: Order processing failed
    Caused by: java.sql.SQLException: Connection timed out
        Caused by: java.net.SocketTimeoutException: connect timed out
```

Fix the connection timeout. The `RuntimeException` is just the wrapper.

## Common anti-patterns in traces

- **`at <unknown>`** — the code was minified, or the source map is missing. Get the source map.
- **`at native`** — the call was a JVM intrinsic or a C library call. Look at the calling Java code.
- **No stack trace at all** — the error was logged but not thrown. Add a throw or a debug log with the call site.
- **Truncated trace** — the log line was clipped. Increase the log buffer; re-run.
- **Same line in every frame** — infinite recursion. The cause is usually missing base case.
