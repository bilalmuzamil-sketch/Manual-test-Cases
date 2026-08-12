# Schedule finish5 — changes made

**Build `v3.5-65d6500`.** Everything below is inside **Schedule group 4254**. Nothing in Filters,
the Report Suite or any other project was read or written.

## TESTRAIL — 4 `update_case`, nothing else

| Case | What changed | Why |
|---|---|---|
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | Rule-54 sentence 2 re-stamped · **step 2 now names a real field to change** | walked this pass; the step as written led a tester to a 400 where the expected result predicts a 404 |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | Rule-54 sentence 2 re-stamped | walked this pass |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Rule-54 sentence 2 re-stamped | walked this pass |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | Rule-54 sentence 2 re-stamped | walked this pass |
| [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) | **nothing — deliberate no-op** | walked this pass, but already carried the running build and needed no step fix |

**The only wording change to any case is C38875's step 2**, quoted in full on both sides in
`DIVERGENCES.md` §1. **No expected result was altered on any case** — expectations come from the
documents, and none of the documents moved.

**Zero** `add_case` · `delete_case` · section · `update_run` · result · Jira operations.

## THE BRANCH — test data created, nothing deleted

The QA lead's standing instruction on these branches: *"Dont worry about deleting anything, and
dont waste time restoring what you have deleted if that is not needed. Any data added in these
branches is just the test data."* So this pass **seeded freely and restored nothing**. It also
**deleted nothing and pressed no destructive control anywhere** — no `DELETE` call was made and
the shift-detail Delete button was never touched.

| What | Where | Why |
|---|---|---|
| **1 shift** on S-15874 · Roridge Holdings, technician Daniel Padilla, 20 Aug | **Staging Lethbridge - 4310** | C38875's own precondition — Lethbridge held 0 shifts, so nothing foreign existed to request |
| **1 series, 59 shifts**, 20 Aug → 10 Nov, on S-15681 | Heavy Duty | C38865's clock-change window and C38863's acknowledged long series |
| **1 series, 62 shifts**, driven through the interface | Heavy Duty | C38863 step 3 — pressing *"Create 62 shifts anyway"* |
| **2 series, 4 + 3 shifts**, S-15761 on two technicians | Heavy Duty | C29986's two-technician comparison |
| **2 events**, 7 Sep, technician Brittany Rodriguez | Heavy Duty | C30615's capacity and conflict measurements |

Both events are titled **`ZZAUTOTEST …`**. The seeded shifts inherit their work order's name and
carry no free-text field this pass could tag; they are listed above by work order, technician and
date so they are identifiable.

**No role definition, staff record or setting was touched** — that is the change class that killed
the Technician session on this branch, and the four cases needing it were left alone.

## SESSION

One administrator session, alive from start to finish. `quick-login` and `switch-user` were
**never called**. Cookies were read from `/tmp` only, `chmod 600`, and **never written into the
repository** — which is public.
