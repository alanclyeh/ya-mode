### Refactoring

Resolve the driver skill through [ya-mode's Non-negotiables](../SKILL.md#non-negotiables).

**You own the contract. The structure changes. The behavior does not.** Distinct from Feature, which adds behavior, and Bug fix, which corrects it.

If the cleanup reveals a missing feature or a real bug, split it out and ship the structural change first against the pinned contract. A redesign is allowed, but name it and route to Feature.

1. Run **Plan**. Name the structure the code is missing per **principle-model-the-domain**, and the target shape: what the module layout, types, and call graph should be if built today. Boring code stays when the shape is already clear and local. The reshape must delete branches or invalid states, not add indirection.
2. Pin the behavior contract first. Write a characterization test, snapshot, or equivalence harness that captures current behavior before any structure moves. Type check and lint are not a pin.
3. Subtract before you add. Delete dead code, collapse one-caller wrappers, drop redundant validators, and remove orphan references before introducing the new shape (**principle-subtract-before-you-add**). The smallest change that reaches the target shape ships (**principle-laziness-protocol**). A speculative cleanup that "might help" gets reverted.
4. Move in small behavior-preserving steps per **Implement** and **Tests**, each keeping the pin green. For API reshapes, migrate every caller and delete the old API in the same wave (**principle-migrate-callers-then-delete-legacy-apis**). No compatibility shims, no parallel old-and-new paths. Spot-check every rename against the actual files. Renames silently miss usages in strings, prose, and back-references.
5. Prove behavior is unchanged on the real artifact, not "it compiles" (**principle-prove-it-works**). For larger reshapes, run an equivalence check: a script that diffs old-vs-new outputs, a recorded baseline replayed against the new code, or a smoke run on the matching surface via the relevant driver skill.
6. Confirm the change is worth keeping. The success measure is reduced reader load (**principle-minimize-reader-load**). If the diff does not lower reader load somewhere, revert it.
7. Run **Gates**, then **Review**.
8. Commit a subtraction, then the reshape, then any follow-on cleanup, each slice green (**principle-sequence-verifiable-units**).
9. Run **Opening a PR**.

**Reply:** the structure that changed, the pin you held it against, the equivalence proof, the reader-load delta, the review result, what shipped and what got reverted. No new behavior.
