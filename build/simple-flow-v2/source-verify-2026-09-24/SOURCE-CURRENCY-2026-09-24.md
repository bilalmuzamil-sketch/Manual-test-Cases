# Simple Flow V2 — source verification (2026-09-24)

**Ordered by the QA lead: "Source verify."** Skill 02. Read-only on TestRail (no case writes this pass).
Prior source pass: 2026-09-09 (against the 8 September 2026 spec revision).

## 1 · Currency of the spec (checked LIVE 2026-09-24)
- **Page:** Confluence **771391574** "Simple Flow V2", space PM, author Milos Vasic, status `current`.
- **Last modified: 11 September 2026** — the page **moved** after our 2026-09-09 pass (which read the 8 Sep revision).
- **Change Log:** the newest entry is **2026-09-08** ("QA handoff folded in…"). There is **no change-log entry for
  09-09, 09-10, or 09-11.** A child page **"Simple Flow V2 — Release Notes" (881262593)** was last edited 2026-09-22.
- Full Sep-11 body saved verbatim: `CONFLUENCE-771391574-2026-09-11-body-read-2026-09-24.md`.

## 2 · Did the 11-Sep edit change any requirement? — NO (content unchanged since 8 Sep)
Method (Rule 31(a): do not trust the version integer / change-log alone — read the body):
- Harvested the **verbatim spec sentences** our 2026-09-08 and 2026-09-09 diffs had quoted from the 8-Sep revision and
  confirmed they are still present in the Sep-11 body (after HTML/entity normalization).
- Directly confirmed every **marquee 8-Sep addition** is intact in the Sep-11 body:
  create-a-vendor / "a full vendor record, not a placeholder" ✓ · "tax rate required" ✓ · "Deselect all" ✓ ·
  "core charge" / "core follows the parent" ✓ · "Received later" ✓ · "Create invoice is refused" while a line is in
  "Needs Approval" ✓ · "Vendor missing" ✓.
- Confirmed the **C44604 crux** is unchanged: the spec still says a reorder **"drop is confirmed and can be undone."**

**Verdict:** the 2026-09-11 modification is **non-substantive** (no story/requirement/change-log change detectable).
The live spec's requirement content is the same 8-September content our suite was verified against on 2026-09-09.

## 3 · Reconciliation to the cases
- **No case content change is required** by this source-verify — the requirement text has not moved.
- **C44604 stays HELD (Rule 58):** the live spec still mandates the reorder Undo, so the case's "Undo removed on user
  request 2026-09-04" text still conflicts with the source and remains an unsourced case-vs-spec conflict →
  **PO question for Milos** (unchanged from 2026-09-09).
- **Provenance stamp is stale (Rule 59/91):** all 64 of our cases cite "…revised 8 September 2026 … read on 9 September
  2026." The current page is the 11-September state (same content). The stamp should be refreshed to record this
  2026-09-24 check — **but see the blocker below before any write.**

## 4 · Currency of the other sources (live)
- **Epic SV-8683** and the per-story children (SV-9247…SV-9267) are short pointers to this spec page (unchanged pattern).
- **Permission map SV-8183** — unchanged mapping (last matched 2026-09-09).
- **Designs / tech plan** — no new versions surfaced; tech plan folded into the spec (per PROJECT-STATE).

## 5 · Blocker on writing the re-stamp (carried from APPRAISAL-2026-09-24)
The provenance re-stamp would rewrite the same paragraph that currently contains **"Last checked against build
v26.35.9-5700a76 on 9/9/2026"** and sits under an **`AUTOMATION: READY`** marker — while PROJECT-STATE records the
project as **source-verified-only, "no QA build exists yet."** Writing a refreshed stamp without resolving that
contradiction would either propagate a build claim the record says never happened, or silently flip it. **Need the QA
lead's answer first:** was Simple Flow V2 ever build-verified (v26.35.9), or is it source-verified-only? That decides
whether the refreshed provenance keeps/drops the build line and whether the 64 markers stay `READY` or become `HOLD`.

## Outstanding
1. **Answer the build question** (§5) so the provenance re-stamp can be written correctly in one honest pass.
2. **Milos:** C44604 reorder-Undo conflict (still open).
3. On go-ahead, re-stamp all 64 to "spec 771391574, current revision as of 11 Sep 2026, re-verified 24 Sep 2026 —
   requirement content unchanged since the 8 Sep revision" (and, if approved separately, the Rule-113/114 layout pass).
