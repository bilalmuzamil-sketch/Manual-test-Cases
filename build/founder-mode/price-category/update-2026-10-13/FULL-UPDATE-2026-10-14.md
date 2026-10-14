# Price/Category — full update, 13–14 Oct 2026 (Rule 122 full pass)

**Order (QA lead, 13 Oct):** "See if the existing test cases need to be updated / new needs to be created / existing need to be modified — do them", and "Make sure you do NOT skip running the design thoroughly as needed."
**Folder:** TestRail Founder Mode → Price/Category, section [20438](https://shopview.testrail.io/index.php?/suites/view/1&group_id=20438) (S1 20465 · S2 20466 · S3 20467). **Epic:** SV-11258 (now "Ready for Development").

## Sources (all read in full)
| Source | State |
|---|---|
| PRD Confluence 578781186 | **version 21** (changed overnight 13→14 Oct; status "Locked for build - 2026-10-13"). 67 codes: 4 added (S1-R6a, S1-R11a, S2-R6a, S3-R5a, "no third state"), 4 reworded (S3-R4, S3-R5, S3-R8, S3-R9: **Fixed price now opens on the highest price**). Re-checked unchanged immediately before the writes. `../SOURCE-CHECK-2026-10-14.md` |
| PRD comments | no new comments since 23 Sep |
| Jira | SV-10134/10135/10136 re-synced to v21 on 13 Oct 15:39; other 7 issues unchanged; verify task SV-10396 still says lowest first |
| Tech plan | "Parts Settings Sorting" (13 Oct). FR-018/FR-020 still say Fixed price first click lowest first: **conflicts with PRD v21; the PRD (newer) wins**, divergence sentence in C154742, C154745, C154747, C154749, C573696 |
| "Default Sorting" decision cited by v21 | not found in Confluence, Jira or Slack; the PRD states both rules in full |
| Design | artifact UMNdojKWhYhRyJrjdgZa4P, re-read 14 Oct: 6 files byte-identical to 13 Oct. `DESIGN-COVERAGE-2026-10-14.md` |
| QA build | none yet; not signed into anything |

## What was written (every write read back and matched; `applied/apply-log.jsonl`)
- **26 cases rewritten in full** (Rule 117 with all eight amendments), marker `AUTOMATION: HOLD - no Price/Category QA build exists yet, not build-verified`.
- **11 new cases, C573687–C573697**, added first so each setup doc carries its case number, then linked: Categories back to Name A to Z on a fresh open (C573687), Default category in search (C573688), failed QuickBooks check (C573689), no Settings - Parts permission (C573690), Name sort covers every category (C573691), Pricing matrices back to name A to Z (C573692), and C573693–C573697 (Pricing matrices and Fixed rules: search, every row has a category, sort kept after add/edit, back to Part Number A to Z).
- **Substance changed by v21:** C154742 (first click on each header, then flips on every click; third clicks), C154745 (highest price first, then lowest), C154747 and C154749 and C573696 (one click now gives highest first), C154727 / C154728 / C154737 (third and fourth clicks: no third state).
- **37 new setup docs**, one per case (public folder). The 22 setup docs of 9 Oct are replaced (list `docs/OLD-DOCS-TO-DELETE.md`; QA lead: ignore).
- **Coverage:** 67/67 codes (`COVERAGE-2026-10-14.md`). **Retired:** none. **Nobody else had edited any Price/Category case.**
- **Display check:** 37/37 "RESULT OK", none repaired (`render-0.log`).
- **Test runs:** no dedicated run; all 37 are in the newest open Nightly run, 539.

## Questions for Product (no quotable source) — send AFTER build verification (Rule 66) unless the QA lead says now
1. After the first Fixed price click (highest first), should the arrow point down? The PRD says down means descending but does not name the direction of "highest first".
2. Hovering a sortable column that is not sorted fades its arrow in (SV-10394, tech plan D17). The PRD says only the sorted column shows an arrow. Is the hover arrow acceptable?
3. Switching between the Pricing matrices and Fixed rules tabs: does each tab keep its sort (SV-10395, tech plan D6)? The PRD does not say.
4. Switching location: is the sort kept (tech plan D13)? And if the QuickBooks column disappears while sorted, does the list fall back to Name A to Z?
5. A browser refresh: is it a fresh open (sort resets) as the tech plan says?
6. One Search box shared by both Pricing tabs (tech plan D10): a term typed on Fixed rules also filters Pricing matrices. Is that acceptable, given "Pricing Matrices search keeps working exactly as it does today"?
7. QuickBooks check failures other than a server error (session expiry, 401, 409): one message only, as S1-N5 says, or their own messages (tech plan D8)?
8. Clicking Name while the QuickBooks column is sorted: which direction does Name take?
9. Can a shop have no categories (S1-N2) or no pricing matrices (S2-N1) at all, given the Default category always exists?
10. A fixed rule with no category (S3-R12b): can it exist at all after the release?
FYI for Product: verify task SV-10396 and the tech plan still say Fixed price sorts lowest first.

## Other differences recorded (cases follow the PRD) — full list in `proposals-A.json` notes
Design board 2.1 shows the first QuickBooks click descending; "Part" vs "Parts" in the QuickBooks cells; label capitals ("Part Number", "Fixed Price"); "$1.4" price formatting (bug SV-10387). Epic description vs S3-R12b (rules with no category are not listed in this release).
