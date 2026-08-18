# KNOWN FAILURES / BUGS to re-check at the build-verify sync — Aug-5 review — 2026-08-18

The Aug-5 design review filed 3 bugs. Build verification is DEFERRED this pass, so **no EXPECT-FAIL
marker is set now** (Rule 15.1 — an expect-fail must have live backing observed on the build; the
sync decides). This file records the bug→case association as **case metadata for the sync** (the same
mechanism as `fabian-review-2026-08-17/KNOWN-FAILURES-FOR-SYNC.md`). It is deliberately NOT written
into `refs` — the currency generator (`currency-2026-08-17/cur.py`) parses SV-keys in `refs` as
*owning stories* and would inject a bug key into the provenance line. **No case was edited.**

**Nothing below is asserted as a current build fact** — each is a previously-filed item to re-verify
on the running build.

| Bug | Live status (2026-08-18) | Covering case(s) whose expectation it violates | Action at the build-verify sync |
|---|---|---|---|
| **SV-8917** (B5) — conflict label reads "working hours" instead of "business hours" | **TESTING QA (open/live)** | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** (primary — asserts *"in the spirit of 'Starts before business hours' … the shop's business hours"*); also SCH-CONF-02 = C30024, SCH-CONF-08 = C43798, tooltip SCH-TIP-02 = C30035, modal banner SCH-MODAL-07 = C30014 | Build-verify the conflict-label wording. If the build still reads "working hours" → set **`READY - EXPECT FAIL (SV-8917)`** on SCH-CONF-03 with the symptom + 3 outcomes (Rule 61). If fixed → `READY`. (SV-8917 is a live ticket, so no creation-hold issue.) |
| **SV-8916** (B4) — "Add Existing Work Order" button missing | **Blocked** — superseded by **SV-9242** (Assign work order modal) | **SCH-REAS-08 = [C43811](https://shopview.testrail.io/index.php?/cases/view/43811)** (body already notes SV-8916) + SCH-REAS-03 = C30054 | Build-verify the "Assign work order" menu item + modal. Set marker per observation. The old button's absence is expected (re-specified as the menu item). |
| **SV-8915** (B1) — view opens at midnight not first business hour | **OBSOLETE / Done (CLOSED)** | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** + SCH-START-09 = C43795 (auto-scroll to resolved working-day start; 30–60 min buffer) | **No expect-fail** — a closed ticket does not back a marker (Rule 15.1/57). Build-verify the auto-scroll behaviour normally; tester runs and records. |

**No ticket was created or closed this pass** (Jira creation hold active, Rule 62 + 2026-08-10 hold).
