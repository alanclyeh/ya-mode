---
name: python-best-practices
description: Python best practices. Use when reading or editing any .py file.
paths: ["**/*.py"]
---

# Python best practices

Apply the [Model the domain](../ya-mode/references/principles.md#model-the-domain) and [Guard the boundaries](../ya-mode/references/principles.md#guard-the-boundaries) principles first. Where the repo already has a convention or tool for a rule below, follow the repo.

| Rule | Summary |
|------|---------|
| Type hints on every public signature | Run the repo's checker (mypy or pyright) on touched files. No `Any` leaks; external data is `object` until parsed. Never silence the checker with `# type: ignore` without a reason in the same line. |
| Variants as tagged types | Model alternatives as dataclasses or `TypedDict`s with a `Literal` tag, dispatch with `match`, and end with `assert_never(x)` so a new variant fails the type check. No bags of optional fields. |
| Parse at the boundary | HTTP bodies, env, files, and queue messages go through the repo's schema library (pydantic, msgspec, attrs) into a domain type once. A raw `dict` stops at that parse. |
| Distinct ids | `NewType` for ids and units so a `UserId` can't be passed as an `OrderId`. |
| Immutable values | `@dataclass(frozen=True)` for value objects. No mutable default arguments. |
| Specific errors | Raise a specific exception type. No bare `except:` and no `except Exception: pass`. Catch only where the code can act on it, usually at the boundary. |
| Resources with `with` | Files, locks, connections, and temp dirs open in a context manager. |
| No import-time work | Importing a module performs no I/O and reads no config. Read config once at the entry point into a typed object. |
| Async discipline | Never block the event loop with sync I/O. Use `asyncio.TaskGroup` for fan-out and `asyncio.timeout` on outbound calls. |
| Structured logging | The repo's logger with context fields. No `print` in shipped code, and never log secrets. |
| Real tests | pytest with real objects over mocks; `tmp_path` for files; `@pytest.mark.parametrize` for tables. Mock only the network you can't run. Use hypothesis for parsers and invariants. |
| Repo tooling before done | Run the repo's linter, formatter (ruff or its equivalent), type checker, and tests on the touched paths. |
| One dependency manager | Use the project's manager and lockfile (uv, poetry, pip-tools). No ad-hoc `pip install`. |

## Examples

```python
from dataclasses import dataclass
from typing import Literal, NewType, assert_never

UserId = NewType("UserId", str)

@dataclass(frozen=True)
class Pending:
    kind: Literal["pending"]

@dataclass(frozen=True)
class Paid:
    kind: Literal["paid"]
    receipt_id: str

Payment = Pending | Paid

def label(p: Payment) -> str:
    match p:
        case Pending():
            return "waiting"
        case Paid(receipt_id=rid):
            return f"paid {rid}"
        case _:
            assert_never(p)
```

```python
# Boundary: parse once, trust the type inside.
class SignupRequest(BaseModel):
    email: EmailStr
    name: str

def handle(body: bytes) -> UserId:
    req = SignupRequest.model_validate_json(body)
    return create_user(req)
```
