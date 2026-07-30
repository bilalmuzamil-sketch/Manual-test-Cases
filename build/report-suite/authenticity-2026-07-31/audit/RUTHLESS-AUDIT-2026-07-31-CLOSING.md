# Report Suite — Ruthless Usefulness Audit, CLOSING PASS 2026-07-31 (Standing Rule 28)

**Scope: ALL 474 active cases, on all THREE dimensions, no sampling (Rule 17).** This is the
mandatory final gate on the closing authenticity pass (Rule-20 traceability backfill + the 2 new
QuickBooks precision cases + 294 rewritten titles). Dimension 2b — the cross-case consistency
sweep — is by definition suite-wide.

Suite after this pass: **474 active** (SBR 111 · SBC 83 · WIP 79 · PV 71 · IV 70 · TU 60).
Per-case verdicts: `per-case-verdicts-2026-07-31.csv` (474 rows, both verdict sets + all three
dimensions) · raw sweep: `consistency-sweep-raw-2026-07-31.txt` · re-runnable:
`consistency_sweep.py`, `gen_verdicts.py` · repairs applied: `repair-log-2026-07-31.md` (14).

**Why the title rewrites make this pass critical:** 294 titles changed. A title is what a reviewer
and a tester read FIRST, so a stale title mis-sells a case before anyone reaches the steps —
exactly the miss that created Stage 2b. Every one of the 474 titles was therefore re-checked
against its own steps and expected results this pass.

---

## Headline tally — 474 / 474

| Dimension | Result |
|---|---|
| **1 — USEFUL** | **KEEP 424** · **WEAK-KEEP 50** (flagged, all user-retained) · MERGE 0 · **CUT 0** |
| **2a — MAKES SENSE (cold read)** | **SENSIBLE 474** · FIX-WORDING **0 remaining** (1 found and repaired this pass) · **NONSENSE 0** |
| **2b — CROSS-CASE CONSISTENCY** | **CONTRADICTION 0 — and 0 PENDING.** 33 mechanical flags raised (18 keyword-pair groups + 13 title-vs-expected + 2 same-anchor clusters), **all 33 adjudicated and cleared**; 5 real defects found and repaired |
| **3 — GENUINE + LAYMAN-RUNNABLE** | traceability **474/474** · plain tester language **474/474** (**8 spec-anchor leaks found and repaired** this pass) |
| **KEEP-but-NONSENSE (the embarrassment check)** | **empty** |
| Titles over 80 chars | **0** (was 288) |
| Duplicate titles | **0** (was 2 groups / 6 cases) |

### Is the critic right?

**No — on both halves of the claim, and here is the honest arithmetic.**

- **"More than 70% of the test cases are useless" → waste is 0% CUT and 10.5% WEAK-KEEP.**
  424 of 474 (89.5%) are KEEP: each asserts a distinct observable behaviour whose failure is a
  real, reportable bug. **50 (10.5%) are WEAK-KEEP** — legitimate, traceable and runnable, but low
  incremental value; they are flagged in the CSV so the QA lead can trim them at will. **0 are CUT.**
  That is not because the suite was always clean: **the 2026-07-28 audit cut/merged 57 cases out of
  515** (41 merge groups + 2 outright cuts), which is a real 11% of slop found and removed. The
  suite is at 0% CUT today *because* the gate has already run, not because nothing was ever wrong.
- **"Some tests just do not make sense" → 0% makes-no-sense, after repairs.** 474/474 SENSIBLE.
  Again honestly: the 2026-07-28 audit found **9 FIX-WORDING** defects (all repaired and pushed
  the same day), and **this pass found 14 more real defects in our own work before delivery** —
  1 non-actionable expected line, 8 spec-anchor jargon leaks in tester-facing text, 3 titles that
  stopped naming their own report after trimming, and 2 deliberately-failing cases missing the
  tester note that explains the failure. That is the gate doing its job on a *fresh* pass, not a
  clean first draft.
- **"Genuine + runnable by a non-technical tester" → 474/474.** Every case carries a Jira ticket
  AND a spec anchor in its References field (Rule 20 — 114/472 before this pass, 474/474 after),
  and no case's tester-facing words contain a ticket key, a `§`-number, a spec anchor, an
  `ROLE_*` atom, an HTTP status code or a feature-flag name.

---

## Dimension 1 — USEFUL (424 KEEP / 50 WEAK-KEEP / 0 MERGE / 0 CUT)

Carried forward for the 458 cases the full 2026-07-28 audit scored; **freshly scored here for the
16 cases authored since**. Every one of the 16 earns KEEP:

| Case | TestRail | Why it is load-bearing |
|---|---|---|
| PV-PREC-01 | new — no C-ID yet | Fractional Units Sold survives a round-trip un-truncated. Closes the ONE genuine gap in epic SV-8582; failure = the live truncation bug. |
| PV-PREC-02 | new — no C-ID yet | The QuickBooks journal amount from that fractional movement is exact. Different system from PV-PREC-01; failure = real customer-ledger corruption. |
| IV-LOC-06 | C38917 | IV's Location column: after Vendor, NEVER "Multiple", not in the selector. |
| PV-FILT-14 | C38914 | PV's Location column: leftmost before Type, and "Multiple" **does** appear on the merged special-order row — the opposite of IV/WIP. |
| SBC-LOC-04 | C38912 | SBC's: after Date, "Multiple" on a customer/asset row spanning locations — a roll-up rule no other report has. |
| SBR-LOC-05 | C38913 | SBR's: after Status, "Multiple" on a rep summary row — a different roll-up level. |
| TU-LOC-06 | C38915 | TU's: the Summary row's Location cell is BLANK — asserted nowhere else. |
| WIP-FLT-09 | C38916 | WIP's: between VIN and Advisor, never "Multiple", exported under the header "Branch" — a real screen-vs-export naming difference. |
| PV-EXP-11 | C38885 | Over-cap export refusal for PV. |
| TU-EXP-09 | C38887 | Over-cap export refusal for TU. |
| WIP-EXP-10 | C38918 | Over-cap export refusal for WIP. |
| SBC-EXP-16 | C38856 | The four-item Summary/Expanded × PDF/CSV menu + the Summary file's exact ten-column order. |
| IV-DATE-09 | C38892 | A recorded day keeps the category/vendor NAMES it was captured with after a rename or delete — historical-integrity contract. |
| SBR-CALC-09 | C38894 | A clock edit after invoicing moves worked hours but must never rewrite billed sell values. |
| TU-COL-01 | C38859 | The whole TU column selector in ONE case, not one per toggle. |
| WIP-CALC-10 | C38890 | A RUNNING clock counts toward Labor Earned and is still capped at the quote. |

### Slop patterns hunted — and the two clusters I had to rule on honestly

| Slop pattern | Verdict |
|---|---|
| **Near-duplicates across areas — the 6 per-row Location columns** | **KEEP all 6, not slop.** Every report's contract genuinely differs: position (after Date / after Status / leftmost before Type / after Vendor / between VIN and Advisor), the "Multiple" rule (SBC/SBR/PV **do** show it; IV/WIP/TU never do; TU's Summary cell is blank), and WIP alone exports it as "Branch". One case per report covering visibility + value + position + selector + filter width — deliberately NOT one case per aspect. |
| **Near-duplicates across areas — the 4 single-table over-cap export cases (IV/PV/TU/WIP)** | **KEEP, on engineering evidence rather than gut.** SV-8591 says verbatim the guard *"Takes a count callable/query per report (SBC counts customers + invoices — two-level)"* — a **per-report** count callable, so each report's cap can fail independently. Had the guard been one shared count, these four would have collapsed to one WEAK-KEEP; the story text is what earns them KEEP. |
| Sort-direction / per-column explosions | None created this pass. |
| Per-column display filler | None created. |
| Tooltip present-vs-text splits | None created. |
| Empty-state triplets | None created. |
| Permission cases reducing to one gate | The opposite: Chris's Q4=A ruling **collapses** SBC to the same single gate the other five use. |
| Export pairs duplicating a whole filter matrix | None; each over-cap case is a single negative, not a matrix. |

**The 50 WEAK-KEEP** are carried unchanged from the 2026-07-28 audit, which the QA lead reviewed
before authorising the "Push ALL" consolidation — they are **deliberately retained**, and they stay
flagged in the CSV (`d1_useful = WEAK-KEEP`) so they can be trimmed on demand. This pass recommends
no further cuts: churning cases the user has already ruled on would be noise, not quality.

---

## Dimension 2a — MAKES SENSE, cold read (474 SENSIBLE / 0 NONSENSE)

Scored against the six fail conditions. **1 FIX-WORDING found and repaired:**

- **PV-EXP-05 = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379)** — the expected
  result told the tester *"fallback behaviour when no logo is set is confirmed in the build"*. That
  is not something a tester can check — fail condition 6, "not actionable". Repaired to a definite
  check: with no uploaded logo the PDF shows the bundled ShopView default logo, the same as the
  rest of the suite. **Honesty:** the PV spec v4 is SILENT on the fallback; the wording follows the
  **shared** organisation-logo resolver the TU spec pins verbatim (S7-R11: *"the shared
  organization-logo resolver ... otherwise the bundled ShopView default logo"*) and the 2026-07-29
  changelog (*"org logo → bundled ShopView default → none"*). That provenance is recorded in the
  case's notes as a VIU-confirm, not asserted as fact.

The 9 cases the 2026-07-28 audit marked FIX-WORDING were all repaired and pushed the same day
(`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`) and are SENSIBLE now; each row
in the CSV still carries the original finding so the history is not lost.

---

## Dimension 2b — CROSS-CASE CONSISTENCY SWEEP (mandatory; suite-wide)

All three mechanical helpers were run over all 474 cases. **33 flags raised, 33 adjudicated,
0 contradictions remaining, 0 left PENDING.**

### (i) Opposite-assertion keyword-pair sweep — 18 groups flagged, 18 cleared

| Flagged group | Ruling |
|---|---|
| **PDF logo — PV-EXP-05 (C30379) vs TU-EXP-06 (C30439)** | **Not a contradiction, but it exposed a real defect.** TU pins the bundled-ShopView fallback; PV left it open with a non-actionable phrase. They never asserted opposite outcomes. **Repaired** (see Dimension 2a). |
| **Est. Lost Labor — TU-ELL-04 (C30407) vs TU-SUM-04 (C30417)** | Not a contradiction. Row-level: em-dash when no rate exists. Summary-level: em-dash **only when EVERY visible technician is em-dash**. TU-SUM-04's own expected lines 2–3 reconcile the two explicitly. |
| **Est. Lost Labor — TU-ELL-05 (C30408) / TU-EXP-05 (C30438) vs TU-HRS-02 (C30401)** | Not a contradiction. Unrated hours are **excluded from the dollar amount** and **included in the Internal Hours column** — TU-HRS-02 expected 4 and TU-ELL-05 expected 1–2 state exactly that, in agreement. |
| **Column selection — WIP-PERS-01 (C30506) vs TU-ELL-02 (C30405)** | Not a contradiction: different reports, different columns. WIP's **Total** is not offered at all; TU's **Est. Lost Labor** can be toggled off (its own 2026-07-29 spec change). |
| **Location filter — SBC-LOC-04 (C38912) / SBR-LOC-05 (C38913) vs PV-FILT-10 (C30337) / WIP-FLT-06 (C30503)** | Regex over-grouping: the first two are the per-row **Location column**, the last two are the **Location filter control**. Different things. |
| **Reports permission gate — 3 negatives vs 7 positives** | Complementary by design: permitted users see the entry, unpermitted users do not. |
| **`Type` / column-selection / Sales-Representative-label groups (the remaining 12)** | Regex over-grouping — the control patterns (`\bType\b`, `Column Selection`, `Sales Rep`) match unrelated cases across six reports. Each pair was opened and read; no two assert opposite outcomes for the same control. |
| **The export-cap toast string — checked explicitly, because the SPECS disagree** | **Already resolved, verified this pass.** The SBC spec §7 and the SBR spec still read *"This export is too large to generate."* while the IV spec S10-R12 reads *"This report is too large to export."* Chris Ward's **Q2 = A** ruling (2026-07-31) settled on ONE message suite-wide, the IV string. **All 6 cap cases** — IV-EXP-07 (C30593), PV-EXP-11 (C38885), SBC-EXP-14 (C30172), SBR-EXP-15 (C30290), TU-EXP-09 (C38887), WIP-EXP-10 (C38918) — assert the winning string **consistently**. The stale SBC/SBR spec text is a Chris edit already tracked on `SPEC-WATCH-2026-07-28.md`; per Rule 33 the PO ruling outranks the un-updated prose. |

### (ii) TITLE vs EXPECTED, every single case — 13 flagged, 13 cleared, 3 repaired

All 13 flags are **regex synonym misses**, not contradictions — each title's assertion IS echoed
in its own steps/expected, in different words: *"is absent from the navigation"* vs expected
*"does not appear in the navigation"*; *"appears under the Parts group"* vs *"the navigation lists
a report labeled …"*; *"never reads Multiple"* vs *"NO row ever shows \"Multiple\""*. Verified by
reading all 13 in full.

**But the check earned its keep — 3 real defects found in this pass's own title rewrites:** three
trimmed titles had stopped naming their own report, so they no longer read sensibly standing alone.

| Case | TestRail | Was (after trimming) | Repaired to |
|---|---|---|---|
| SBR-PERM-01 | [C30198](https://shopview.testrail.io/index.php?/cases/view/30198) | Anyone who can see another Performance report also sees **this report** | Sales By Representative is visible to anyone who sees another Performance report |
| WIP-PERM-02 | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Without the permission **the report** is absent from the reports navigation | Without the permission **Work In Progress** is absent from the reports navigation |
| TU-NAV-07 | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Without the timesheet-reports permission **the report** is absent from the **nav** | Without the timesheet-reports permission **Technician Utilization** is hidden |

### (iii) Same-anchor clustering — 2 clusters flagged, 2 cleared

Grouped by the `refs` spec anchor (now possible on 100% of cases for the first time, since the
Rule-20 backfill this pass gave every case an anchor).

- **SBR S10-N1 and S10-R5 — SBR-TOT-02 (C30238) vs SBR-TOT-01 (C30237) / SBR-TOT-03 (C30239) /
  SBR-MOB-02 (C30303).** Not a contradiction. Desktop = a **Totals row inside the table**, sticky
  at the bottom, hidden during loading and in the empty state (that "hidden" is the flag's source).
  Mobile = a **simplified external totals bar below the table, outside the scroll container**. All
  four agree that Subtotal is pinned right on every row type. Complementary viewport behaviours.

---

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE (474 / 474)

- **Traceability (Rule 20): 474/474.** Every case's References field is `<TICKET> (<spec-anchor>)`
  with both halves present — up from **114/472** at the start of this pass. Per-story precision,
  sourced from the live SV-8582 epic ingest; the 5 cases with no single owning story say so in the
  ref text (details in `../TRACEABILITY-AUDIT.md`).
- **Plain tester language (Rules 7/9): 474/474 — after repairing 8 real leaks.** A spec anchor in
  the words a manual tester reads is a Rule-20 breach, and the push script's `clean()` strips
  internal case IDs but **not** spec anchors, so all 8 of these would have gone live:

| Case | TestRail | Leak removed from tester-facing text |
|---|---|---|
| PV-CALC-04 | [C30362](https://shopview.testrail.io/index.php?/cases/view/30362) | "(per S3-N1)" |
| PV-ROW-10 | [C30350](https://shopview.testrail.io/index.php?/cases/view/30350) | "excluded per S3-N1 (Demand alone is not a keep-criterion)" |
| PV-VIS-01 | [C30385](https://shopview.testrail.io/index.php?/cases/view/30385) | "(consistency goal, §1)" |
| SBR-BADGE-01 | [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | "The mapping matches §3:" |
| TU-SUM-04 | [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | "(S2-E4)" |
| TU-TECH-04 | [C30426](https://shopview.testrail.io/index.php?/cases/view/30426) | "(per S1-R8)" |
| WIP-API-03 | [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | "(Earned per S4-R19, Remaining per S4-R20)" |
| WIP-API-06 | [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | "the on-screen S4-E1 behavior" |

  In every case only the anchor was deleted — the assertion is untouched, and the anchor still
  lives in that case's References field.
- **9 cases mention another case's internal ID** in an authoring cross-reference (e.g. "see
  PV-EXP-08"). These are **stripped automatically** on the way to TestRail by `clean()` in the push
  script and by `gen_import.py`, so no tester ever sees them; they are kept in the local authoring
  source on purpose. Listed in the CSV column `d3_internal_id_in_tester_text`.

---

## The 3 deliberately-failing permission cases — CHECKED, and 2 were missing their note

Chris Ward ruled (2026-07-31, **Q4 = A**, verbatim: *"A - the intention is to not hide these from
normal reports access. These were specced before CRP was built :)"*) that every report in the suite
opens on the ordinary reports access. **The build still ships a dedicated Sales By Customer
permission atom**, so all three SBC access cases fail against today's build **by design** — which
is why each needs a plain note telling the tester to mark it Failed rather than "fix" the case.

| Case | TestRail | Carried the note before this pass? | Now |
|---|---|---|---|
| SBC-PERM-01 | [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | **YES** — expected line 4 | unchanged |
| SBC-PERM-02 | [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | **NO** | **note ADDED** |
| SBC-NAV-01 | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | **NO** | **note ADDED** |

Verified against **live TestRail**, not the local copy. The note added is word-for-word the one
C30098 already carries: *"Note for the tester: the product owner has ruled that every report in
this suite opens with the ordinary reports access. If the build still demands a separate Sales By
Customer permission, mark this test Failed and report it as the known pending change — do not
change the test."* The dev-facing side of this is already written up in
`../chris-answers-2026-07-31/Q4-permission-dev-note-2026-07-31.md`.

---

## Honesty statement (Rule 12)

- **Nothing in this audit is live-build-observed.** The Report Suite QA branch still does not
  exist, every case is `VIU-Pending`, and this pass made no live check (Rule 22: no step here
  needed one — it is a traceability / wording / coherence audit against Jira and the specs). No
  verdict below claims build-verified behaviour.
- **The audit only RECOMMENDS on Dimension 1.** No merge, cut or delete is executed without the
  user's authorisation (Rule 6). This pass recommends **0 cuts and 0 merges**.
- **14 real defects were found in our own work before delivery** — 1 non-actionable expected line,
  8 spec-anchor leaks, 3 titles that lost their subject, 2 missing tester notes. That is the point
  of the gate.
- **Two items remain PO-blocked and are not silently decided:** the SBR Escape-key conflict
  (SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) asserts
  Escape does NOT dismiss, per Golden Rule #9, while spec S13-R8 wants it to — engineering
  escalated it as an open decision) and the SBC permission-bundle question. Both sit on
  `../PO-Questions-Chris-ReportSuite-2026-07-27.md` awaiting Chris Ward. Neither is a
  contradiction *within* our suite, so neither blocks delivery under Stage 2b.
