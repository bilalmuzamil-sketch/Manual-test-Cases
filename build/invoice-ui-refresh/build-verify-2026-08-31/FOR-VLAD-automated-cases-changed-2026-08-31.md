# For Vladimir Tomovic — Automated cases changed on 2026-08-31 (Rule 65)

**Vlad — 5 cases you have flagged Automated in TestRail were edited today.** Standing rule: you get told whenever that happens.

**Authorised by Bilal Muzamil (QA lead) on 2026-08-31**, per case, after each was build verified on QA branch **sv8218**, build `v26.35.5-8c3cc21`. `custom_atmstatus` is **unchanged (still 3 = Automated)** on every one — the flag was never touched, and neither were the titles, sections or references.

| Case | Title | Marker now | atm |
|---|---|---|---|
| [C44919](https://shopview.testrail.io/index.php?/cases/view/44919) | Authorizer is selected in the work order customer contact card | `AUTOMATION: READY - EXPECT FAIL (SV-9599)` | 3 |
| [C44920](https://shopview.testrail.io/index.php?/cases/view/44920) | Authorizer is optional and can be cleared with 'No authorizer' | `AUTOMATION: READY` | 3 |
| [C44921](https://shopview.testrail.io/index.php?/cases/view/44921) | Authorizer's phone shows below the name when the contact has one | `AUTOMATION: READY` | 3 |
| [C44922](https://shopview.testrail.io/index.php?/cases/view/44922) | Authorizer is locked once the work order is invoiced | `AUTOMATION: READY` | 3 |
| [C44985](https://shopview.testrail.io/index.php?/cases/view/44985) | Parts sale receives the Authorizer treatment (net-new) | `AUTOMATION: READY` | 3 |

## What changed in each, and nothing else

1. The automation marker was lifted from `AUTOMATION: Not available on Build to test Yet` to **`AUTOMATION: READY`** — each case passes all five runnability checks on the build.
2. A build-check sentence was added: *"Last checked against build v26.35.5-8c3cc21 on 8/31/2026."*
3. The three text fields were re-saved as plain text so they **display correctly**. Before today they showed raw `<ol><li>` markup on screen to anyone who opened them.

**⚠️ One of them carries an EXPECT FAIL marker.** [C44919](https://shopview.testrail.io/index.php?/cases/view/44919) is marked `AUTOMATION: READY - EXPECT FAIL (SV-9599)`. It asserts the Authorizer row appears *"in the same label-and-value style"* as Contact and Phone, and [SV-9599](https://shopview.atlassian.net/browse/SV-9599) (filed by Chris Ward, In Progress) reports the field rendering inside a visible rectangle and misaligned. **So the automated run should FAIL on that case today** — the case body spells out all three outcomes so a failure is not mistaken for a new bug.

## What did NOT change

The expected behaviour, and the source/provenance line — carried byte-for-byte and verified unaltered after every write. Expectations come from the specification, the epic and the stories, never from the build.

## Two caveats worth your time

1. **"Build verified" here means RUNNABLE, not PASSING.** The five checks prove a tester or a script can execute every step and find every control and label where the case says it is. Whether the document is *correct* is test execution, which has not run — TestRail run **R417** still has 0 graded results.
2. **All 21 children of SV-8218 are In Progress; none is Done.** Under Rules 49 and 60 every layout verdict on this branch is **PROVISIONAL** until the stories close.

*Per-case audit log: `TESTRAIL-EXECUTION-LOG-markers-2026-08-31.md`. Generated 2026-08-31.*
