---
name: react-best-practices
description: React best practices. Use when reading or editing React components, hooks, or their tests (.tsx or .jsx).
paths: ["**/*.tsx", "**/*.jsx"]
---

# React best practices

Types follow the **typescript-best-practices** skill. Where the repo already has a convention or library for a rule below, follow the repo.

| Rule | Summary |
|------|---------|
| Derive, don't sync | Compute values from props and state during render. Never copy props into state or keep two states in step with an effect. |
| Effects only for external systems | `useEffect` syncs with something outside React (a subscription, a socket, a non-React widget). Data transforms belong in render, and responses to a user action belong in the event handler. |
| Server state in its library | Fetch through the repo's data layer (TanStack Query, SWR, framework loaders or server components), not `useState` plus a fetching `useEffect`. |
| UI state as a union | Model `idle`, `loading`, `error`, `success` as a discriminated union, not a set of booleans that allows impossible mixes. |
| State at its lowest owner | Keep state in the lowest component that needs it. Lift it only when siblings share it. Context is for values many layers read, not to avoid two props. |
| Pure components | Rendering never mutates props, state, or module variables. Updates are immutable. |
| Stable keys | List keys are stable ids, never the array index for reorderable or filterable lists. |
| Memoize on evidence | Add `useMemo`, `useCallback`, or `memo` only for a slowdown you measured, unless the repo uses the React Compiler, which does it for you. |
| Accessible by default | Semantic elements, labelled inputs, working keyboard focus. A `div` with `onClick` is a bug. |
| Test as the user | Testing Library queries by role and label, `user-event` for interaction. Never assert on state, props, or hook internals. Mock the network at its edge (MSW), not your own hooks. |
| Prove it in a browser | A component change is verified in a running build per **principle-prove-it-works**, not only by a unit test. |
| Styling per repo | Use the repo's styling system and design tokens. Never add a second one. |

## Examples

```tsx
// Derive: no state, no effect.
function Cart({ items }: { items: readonly Item[] }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return <p>Total {formatMoney(total)}</p>;
}
```

```tsx
type Load<T> =
  | { kind: "loading" }
  | { kind: "error"; error: Error }
  | { kind: "ready"; data: T };
```

```tsx
// Test what the user sees and does.
await user.click(screen.getByRole("button", { name: "Add to cart" }));
expect(screen.getByText("Total $12.00")).toBeVisible();
```
