# Global Search — V1 Regression Suite (for the manual tester)

**What this is.** 20 checks that confirm the NEW Global Search (V2) did **not** break things the OLD
(V1) search already did — permissions, tenant/location scoping, navigation, the "Assets" label, the
keyboard shortcut, and so on. If any check fails on the V2 build, that is a **regression** — raise it.

**How to read each case.**
- **Preconditions** — the user role and the data you need set up first (in plain words).
- **Steps** — exactly what to do, click by click.
- **Expected Result** — what must happen. The line under the "---" says this is the behaviour that
  existed **before V2**, with a short traceable source (an invariant id + the exact code file/line at a
  pinned commit) so the expectation is provable, not opinion.

**Every case is written to be runnable by a non-technical tester** and is intended to be
**build-verified** once a Global Search V2 test environment is available (today there is none — each
case carries the "Not available on Build to test Yet" marker until then).

**Where it lives in TestRail (once pushed):** a new section **"Global Search V2 - V1 Regression Suite"**
under the Global Search V2 folder (group 6720). Not yet pushed — awaiting the QA lead's go-ahead.

**Five cases carry a PO note** (Time Clock exclusion, 2-char minimum, the analytics event, and the
shared permission-map risk) — see `PO-DECISION-REGISTER.md`. They are still runnable; the note just
means Branko should confirm the intended V2 behaviour.
