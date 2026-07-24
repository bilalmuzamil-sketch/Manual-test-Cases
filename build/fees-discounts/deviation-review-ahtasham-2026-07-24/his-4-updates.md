# Ahtasham's 4 TestRail case edits — live TestRail content vs our local (read-only GET, 2026-07-24)

He says he edited **4 cases** in TestRail: C28460, C30618, C28489, C28526.
I pulled all 4 live from TestRail (`get_case`, read-only) and diffed against our local case JSONs.

**HEADLINE FINDING:** 3 of the 4 edits are LIVE in TestRail. **The 4th (C30618 / FD-WO-017) is NOT** — TestRail still shows the OLD "LEFT" wording. Its `updated_on` is **2026-07-23 07:00 UTC** (that is our 2026-07-22/23 authoring), which is BEFORE his review session (the other three were updated **2026-07-24 ~17:00–18:00 UTC**). So his intended LEFT→RIGHT edit to C30618 did not land.

TestRail case links: https://shopview.testrail.io/index.php?/cases/view/<id>

---

## 1. C28460 = FD-STATS-002 — "Stats fee/discount row names its target"
- TestRail link: https://shopview.testrail.io/index.php?/cases/view/28460
- TestRail `updated_on`: **2026-07-24 17:02 UTC** (his session) → EDIT LANDED.
- **What he changed:**
  - Title → "Verify the Statistics tab lists each fee/discount as its own row with name, percent and amount".
  - Expected reworded to match build: (1) each adjustment on its own row with name, percent, amount + Total; (2) rows show **name and amount only — NO per-row target line/clickable link** (matched to build). Dropped the old "target is a clickable link" expectation and the zero-value line.
- **Our local (FD-STATS-002, VIU-Deviation):** old title "…row names its target"; expected still has 3 items incl. "3. The target is a link you can click to jump to that line/part."
- **Verdict: LOCAL NEEDS UPDATING to match his TestRail edit** (title + expected reworded; status Deviation → Verified/matched-to-build).

## 2. C28489 = FD-CUST-005 — "picker lists only not-yet-added templates; Processing Fee shows as 'Fee'"
- TestRail link: https://shopview.testrail.io/index.php?/cases/view/28489
- TestRail `updated_on`: **2026-07-24 17:28 UTC** (his session) → EDIT LANDED.
- **What he changed:** Expected #1 → "The picker is **multi-select** — each template row has a checkbox (or chip) and the user may select more than one at once (SV-8280 / spec S9-R20)". (#2–#4 unchanged.)
- **Our local (FD-CUST-005, VIU-Deviation):** Expected #1 = "The picker is a single-select dropdown."
- **Verdict: LOCAL NEEDS UPDATING** (single-select → multi-select; status Deviation → Verified). Note: our local notes still carry the old "PO Q6=A accepts single-select" reasoning — that is now superseded by S9-R20 multi-select; the notes should be updated too.

## 3. C28526 = FD-PROC-008 — "Processing Fee on a WO can be removed but not edited"
- TestRail link: https://shopview.testrail.io/index.php?/cases/view/28526
- TestRail `updated_on`: **2026-07-24 17:59 UTC** (his session) → EDIT LANDED.
- **What he changed:** Expected #1 → "The menu shows **'Remove' only — there is no 'Edit' option** for a Processing Fee (it cannot be edited on the work order)." (Dev removed the old dead 'Edit'.)
- **Our local (FD-PROC-008, VIU-Deviation):** Expected #1 = "The menu shows 'Edit' and 'Remove'; 'Edit' does nothing for a Processing Fee…".
- **Verdict: LOCAL NEEDS UPDATING** (Edit+Remove → Remove-only; status Deviation → Verified).

## 4. C30618 = FD-WO-017 — "labor fee/discount entry point three-dot menu placement"
- TestRail link: https://shopview.testrail.io/index.php?/cases/view/30618
- TestRail `updated_on`: **2026-07-23 07:00 UTC** — NOT his 2026-07-24 session.
- **He CLAIMS:** flipped menu placement LEFT → RIGHT in steps, expected result and References ("already edited in TestRail"). PO (Chris Ward) accepted right-side placement in SV-8479 (Done 22 Jul).
- **TestRail actually shows NOW:** title, steps AND expected ALL still say **LEFT** ("three-dot menu to the LEFT of the first technician… not to the right"). No RIGHT wording present.
- **Our local (FD-WO-017, VIU-Deviation):** also LEFT (build shows RIGHT → recorded as a deviation).
- **Verdict: HIS EDIT DID NOT LAND. TestRail == our local (both LEFT).** So "local matches TestRail" right now — but NEITHER matches his stated verdict (match-to-build = RIGHT). If the user accepts his verdict, this still needs a real TestRail write (LEFT→RIGHT) AND the matching local edit + status flip. **This is the one item where a TestRail write is still outstanding** (analysis only for now — no writes made).

---

## Sync summary
| C-id | Internal | His edit landed in TestRail? | Local vs TestRail now | Action needed |
|------|----------|------------------------------|-----------------------|---------------|
| 28460 | FD-STATS-002 | YES (2026-07-24) | OUT OF SYNC | Update local to match TestRail |
| 28489 | FD-CUST-005 | YES (2026-07-24) | OUT OF SYNC | Update local to match TestRail |
| 28526 | FD-PROC-008 | YES (2026-07-24) | OUT OF SYNC | Update local to match TestRail |
| 30618 | FD-WO-017 | NO (still LEFT) | Local MATCHES TestRail (both LEFT) | Decide: apply LEFT→RIGHT to BOTH TestRail + local (his intended edit is missing) |
