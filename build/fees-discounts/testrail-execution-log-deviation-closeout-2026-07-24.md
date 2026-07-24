# Fees & Discounts — Deviation close-out audit log (2026-07-24)

**Authorization:** User ruling 2026-07-24 — all 10 VIU-Deviations + the 1 VIU-Pending
(FD-PART-005) = "no bug" → close them, based on Ahtasham's QA live review + our own
live SV-8421 spot-check. FD-WO-017 = match-to-build (kebab on the RIGHT; Chris Ward
accepted, SV-8479 DONE).

**TestRail writes made by THIS pass: ZERO.** (The FD-WO-017/C30618 LEFT→RIGHT edit was
applied MANUALLY by the user directly in TestRail on 2026-07-24; we only synced our
local record to match it — no `update_case`/`add_case`/`delete_case` from us, and NO run
touched.) All 3 of Ahtasham's landed edits were pulled READ-ONLY (`get_case`) and
mirrored into our local records. All viu_status flips are LOCAL-only (viu_status is not
a TestRail field).

TestRail case links: https://shopview.testrail.io/index.php?/cases/view/<id>

---

## 1. Synced from TestRail (READ-ONLY GET; local mirrored to match; NO write)

Ahtasham reworded these 3 cases live in TestRail on 2026-07-24; we pulled each via
`get_case` and updated our local case JSON (title/preconds/steps/expected + refs) to
match, then set viu_status = VIU-Verified.

| C-id | Internal | TestRail `updated_on` (his session) | What we mirrored locally |
|------|----------|--------------------------------------|--------------------------|
| C28460 | FD-STATS-002 | 2026-07-24 17:02 UTC | New title "…lists each fee/discount as its own row with name, percent and amount"; expected reworded to per-row name/percent/amount with a Total, and rows show name+amount only (no per-row target link); refs → "SV-8280 (§3 adjustments appear on the Statistics tab; §5-R9 oldest-first)". |
| C28489 | FD-CUST-005 | 2026-07-24 17:28 UTC | Expected #1 single-select → multi-select (checkbox/chip, spec S9-R20); supersedes the old PO Q6=A single-select note. |
| C28526 | FD-PROC-008 | 2026-07-24 17:59 UTC | Expected #1 "Edit and Remove (Edit does nothing)" → "Remove only, there is no Edit" (dev removed the dead Edit). |

Each carries the local note: "matched-to-build per Ahtasham QA review 2026-07-24;
synced from his TestRail edit." Honesty (Rule 12/22): accepted on Ahtasham's live QA
review — NOT re-observed by us this pass.

## 2. FD-WO-017 / C30618 — updated MANUALLY by the USER in TestRail (no write from us)

- The user manually edited C30618 in TestRail on 2026-07-24 (re-GET `updated_on`
  1784920296 = 2026-07-24) so the TITLE now reads "…three-dot menu to the RIGHT of the
  first technician…".
- We re-GET C30618 (READ-ONLY) and synced our local case JSON to MATCH the user's
  current TestRail wording verbatim (kebab on the RIGHT), then set viu_status =
  VIU-Verified.
- **before → after (our local, mirrored to the user's TestRail state):**
  - title: "…three-dot menu to the **LEFT**…" → "…three-dot menu to the **RIGHT**…"
  - steps #2 / expected #1: "…LEFT of the first assigned technician's name…" →
    "…RIGHT of the first assigned technician's name…"
  - (Note: the TestRail `refs` field + a residual descriptive phrase still say "LEFT"
    from the prior authoring — our local mirrors TestRail verbatim, so local == TestRail.)
- **re-GET check:** C30618 title/steps/expected now MATCH our local mirror. No write
  performed by us.
- local note: "match-to-build (kebab RIGHT), PO Chris Ward accepted, SV-8479 DONE;
  TestRail updated manually by the user 2026-07-24; local synced to match." Honesty
  (Rule 12/22): accepted on the user's manual edit + PO acceptance — not independently
  re-observed by us this pass.

## 3. Pass-as-written flips (LOCAL viu_status only; NO wording change; NO write)

Ahtasham passed these as written on his live QA review 2026-07-24 (no bug):

| C-id | Internal | Prior | New | Basis |
|------|----------|-------|-----|-------|
| C28456 | FD-INLINE-003 | VIU-Deviation | VIU-Verified | Ahtasham QA review (accepted, no bug) |
| C28462 | FD-STATS-004 | VIU-Deviation | VIU-Verified | Ahtasham QA review (accepted, no bug) |
| C28490 | FD-CUST-006 | VIU-Deviation | VIU-Verified | Ahtasham QA review (accepted, no bug) |
| C28511 | FD-TMPL-010 | VIU-Deviation | VIU-Verified | Ahtasham QA review (accepted, no bug) |
| C28450 | FD-PART-005 | VIU-Pending | VIU-Verified | Ahtasham QA review (accepted, was env-blocked only) |

Honesty (Rule 12/22): these 5 flips are accepted on Ahtasham's live QA review — NOT
re-observed by us this pass. Each carries that note.

## 4. Already-Verified by OUR OWN live spot-check (confirmed, NOT re-flipped)

These two were already flipped VIU-Deviation → VIU-Verified by our own LIVE SV-8421
spot-check on 2026-07-24 (commit 7020713); we confirmed they are already Verified and
did NOT double-flip — only added an Ahtasham-acceptance note.

| C-id | Internal | Status | Basis |
|------|----------|--------|-------|
| C28527 | FD-PROC-009 | VIU-Verified (already) | OUR live SV-8421 PF-base spot-check (PF unchanged at $13.92 after +$100 taxable whole-WO fee) + Ahtasham QA review |
| C28580 | FD-CALC-013 | VIU-Verified (already) | OUR live SV-8421 PF-base spot-check + Ahtasham QA review |

No wording change was needed for C28527/C28580 (spot-check said none) → NO TestRail write.

## 5. Tally

- Before: 199 active = 169 VIU-Verified / 8 VIU-Deviation / 21 VIU-Blocked-Env / 1
  VIU-Pending (PROC-009/CALC-013 already flipped by the spot-check).
- After: **199 active = 178 VIU-Verified / 0 VIU-Deviation / 21 VIU-Blocked-Env / 0
  VIU-Pending** (+2 dev-authored FD-PERM-012/013 = 201 case rows in the id-map that we
  manage; see note below).
- **0 Deviations, 0 Pending.**

### id-map note (pre-existing, out of scope)
The id-map has 203 data rows: 199 active + 2 dev-authored (FD-PERM-012/013) = 201 that
this session manages, PLUS 2 rows added by a concurrent session's authoring
(C30639 FD-PSALE-INV-01 / C30640 FD-PART-DISP-01, SV-8520/8521) that have no local case
body in our group files. Those 2 are left untouched (another worker's rows) and do not
appear in our deliverables (generators iterate the case JSONs, not the id-map). C-ids
preserved for all rows.

## 6. Deliverables regenerated over 199 active

- FeesDiscounts_Blockers_Tracker.xlsx/.md → READY 178 / DEVIATION 0 / ENV 21 / others 0.
- FeesDiscounts_V1_TestCases.xlsx/.csv (build_workbook.py).
- FeesDiscounts_FreshVIU_2026-07-24.xlsx/.csv → 178/0/0/21/0.
- testrail-import/fees-discounts-v1-testrail-import.csv/.xlsx → 199 rows, header
  byte-identical, 0 "viu", 0 "feature flag", no duplicate titles, no C-id column.
- whats_needed.py → all 11 now-Verified cases fall through to "No action needed —
  passed."; the 21 Blocked-Env rows keep their plain next-steps.
- Data-as-of stamp kept at 2026-07-24.
