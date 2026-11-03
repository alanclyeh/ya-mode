---
name: node-best-practices
description: Node.js runtime best practices. Use when writing or changing Node.js server, CLI, worker, or script code.
---

# Node.js best practices

Types follow the **typescript-best-practices** skill. Apply the **principle-boundary-discipline** and **principle-make-operations-idempotent** principle skills. Where the repo already has a convention or library for a rule below, follow the repo.

| Rule | Summary |
|------|---------|
| Validate every input | HTTP bodies, query strings, env, queue messages, and files go through the repo's schema library at the edge. |
| Config once at startup | Parse `process.env` into a typed config object at boot and fail fast on a missing value. Nothing else reads `process.env`. |
| No floating promises | Every promise is awaited, returned, or handled. Turn on the lint for floating promises. One central error handler per process. On `unhandledRejection`, log and crash so the supervisor restarts it; never swallow. |
| Keep the event loop free | No sync fs, crypto, or compression on a request path. Move CPU-heavy work to `worker_threads` or a job queue. |
| Timeouts and cancellation | Every outbound call (fetch, DB, queue) has a timeout, and an `AbortSignal` where the API takes one. |
| Graceful shutdown | On `SIGTERM`: stop accepting work, drain in-flight requests, close pools, then exit. |
| Idempotent handlers | Webhooks, jobs, and retried requests converge to the same state when they run twice. |
| Streams with `pipeline` | Use `stream/promises` `pipeline()` so backpressure and errors propagate. |
| Structured logs | The repo's logger with a request id. No `console.log` in shipped code. Never log secrets or tokens. |
| Security basics | Parameterized queries only. No `eval`, and no `child_process` with user input in a shell string. Secrets come from env or a secret manager, never source. |
| Module system per repo | Follow the repo's ESM or CJS choice. Import builtins with the `node:` prefix. |
| Real tests | The repo's runner (`node:test`, vitest, jest). Hit a real in-process server for HTTP. Use a real database (Testcontainers) where SQL behavior matters. Mock only third-party network. |

## Examples

```ts
import { z } from "zod";

const Config = z.object({
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().url(),
});
export const config = Config.parse(process.env);
```

```ts
process.on("SIGTERM", async () => {
  await new Promise((done) => server.close(done));
  await pool.end();
  process.exit(0);
});
```
