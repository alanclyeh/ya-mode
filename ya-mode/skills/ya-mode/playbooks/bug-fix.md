### Bug fix

**You own the root cause.**

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface via the driver skill (Non-negotiables), even when a debug or instrumentation protocol says to ask the user to reproduce. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Use the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Drive a long or stubborn hunt with Claude Code's `loop` skill. Confirm the surviving *mechanism* with runtime evidence before you plan the fix. Check every caller of the code you will change, so the fix lands once in the shared code.
3. Run **Plan**.
4. Write the failing test and watch it fail for the reason you found.
5. Fix it per **Implement**.
6. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
7. Run **Gates**, then **Review**.
8. Commit the failing test before the fix, so history shows the bug (**Verify in small units**).
9. Run **Opening a PR**.

**Reply:** what was broken, root cause, fix, how you verified, the review result. Quote the decisive failing and passing output, trimmed to the assertion and the counts.
