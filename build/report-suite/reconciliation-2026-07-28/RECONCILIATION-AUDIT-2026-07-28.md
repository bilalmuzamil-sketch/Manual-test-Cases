# Report Suite — Reconciliation Adversarial Audit (Phase 4) — 2026-07-28

**Auditor:** independent Phase-4 worker (Rule 15 adversarial self-audit — calls independently
re-derived from the canonical current spec + Chris's answer sheet + the video-deltas, then diffed
against what Phase 2 produced).
**Scope:** the Phase-2 Report Suite spec-relevance reconciliation
(`Report-Suite_Spec-Reconciliation_ChangeList_2026-07-28.md/.xlsx`, commit `16485ca`).
**Read-only w.r.t. cases.** NO TestRail writes. NO case edits.
**Final verdict: CLEAN** (no defect required a fix; two minor advisory recommendations recorded below).

---

## Verdict table (per audit check)

| # | Check | Result | Evidence summary |
|---|---|---|---|
| 1 | Edits correctness (SBR-DEACT-04/05) | **PASS** | Both now say Esc does NOT dismiss (Cancel + X only); matches Chris Q1=B verbatim; overrides current spec S13-R8; plain wording; titles 78 / 67 chars ≤80; refs = ticket + spec anchor. No over/under-edit. |
| 2 | Classification correctness (6 PENDING-CHRIS themes) | **PASS** | Current spec independently confirmed to still contradict all 6 video-intent themes (exact spec lines quoted). No PENDING item is actually already spec-confirmed. 1 minor tag nuance (P31). |
| 3 | Completeness (Rule 17 keyword sweep) | **PASS** | Q1 Esc scope complete (only 2 cases exist, both edited); no missed APPLIED-NOW edit; all delta keywords accounted for. |
| 4 | Q2 untouched | **PASS** | No case contains "normal reports access"; git diff shows no permission case file changed; discrepancy note exists + referenced, not applied. |
| 5 | Deliverable hygiene | **PASS** | id-map 515/515 C-ids, 0 blank, 0 dup; import header byte-identical to Filters import; VIU/flag-word-free; 29 API cases in "— API" sections; per-report split sums to 515. |
| 6 | No TestRail writes | **PASS** | No write calls / no HTTP client in gen scripts; no R359 reference anywhere in the reconciliation dir. |
| 7 | Change-list quality (Rules 8 / 25) | **PASS** | md + xlsx carry C-id + link + driving-source + plain "what needs to be done"; all spot-checked C-ids match id-map; deviation rows cite spec anchors (several verbatim). |

---

## Check 1 — Edits correctness (SBR-DEACT-04 / SBR-DEACT-05) — PASS

**Source of the PO decision (verbatim, `chris-answers-2026-07-28/answers-ingested.md:28-29`):**
> "B) No - pressing \"Esc\" should NOT close it (matches the app's general house rule); use only the Cancel and X buttons." … Chris's answer: **"B."**

**Current spec being overridden (verbatim, `spec-current-2026-07-28/Sales-By-Representative-Report-current.md:476`):**
> **S13-R8:** … "It dismisses (without deactivating) on Cancel, X, or **Escape**. Clicking outside the dialog does **not** dismiss it. …"

**What the edited cases now say** (`cases/cases-sbr-C-...json`):
- **SBR-DEACT-04 (C30255)** expected #3: "Pressing the \"Esc\" key does NOT close the dialog - it stays open (the app's general rule is that pop-ups do not close with the Esc key)." + #2 Cancel/X close, #4 clicking-outside does not close. → **Matches Chris Q1=B and correctly overrides spec S13-R8.**
- **SBR-DEACT-05 (C30256)** expected #1: "…pressing the \"Esc\" key never closes the dialog at any time." → consistency edit, correct.

- **Wording (Rule 9):** plain, layman; uses the on-screen control names "Cancel", "X", "Esc". PASS.
- **Titles ≤80:** DEACT-04 = 78 chars, DEACT-05 = 67 chars. PASS.
- **Refs (Rule 20):** DEACT-04 `spec_ref` = "SV-8630 (specs/sbr-sales-by-representative.md Story 13 S13-R8)" — ticket **SV-8630** + spec anchor **S13-R8**. DEACT-05 = "SV-8630 (… S13-R9; S13-R10; S13-E1)". Both carry ticket + spec anchor. PASS.
- **No over/under-edit:** `git show 16485ca` on the case file touches ONLY DEACT-04 and DEACT-05; no other case in the file changed. DEACT-04's rewrite (split steps + explicit clicking-outside line) stays within the dialog-dismissal behaviour and remains consistent with the spec's "clicking outside does not dismiss". PASS.
- **Notes** document the override + "VIU-confirm on the QA branch before finalizing" (appropriately hedged; case left `VIU-Pending`).

*Process note (not a defect):* `answers-ingested.md` RULING 2 originally queued the Q1 edit ("NOT edited now … STATUS: ON HOLD"). Phase 2 IS that reconciliation pass and applied it locally only (no TestRail write, case left VIU-Pending pending live confirm) — consistent with RULING 2's plan to apply during the reconciliation pass.

---

## Check 2 — Classification correctness (Rule 15 verbatim truth-table) — PASS

Each PENDING-CHRIS theme independently re-checked against the CURRENT spec file; the spec genuinely
still contradicts the video intent in every case (so "do not edit yet" is correct):

| Theme (video pt) | Case(s) | Current-spec line (verbatim) | Still contradicts? |
|---|---|---|---|
| Serial-number identifier (P24) — SBC | SBC-LBL-01 (C30134) | S8-R8: "…(1) \" · Unit \{unit\}\"; else (2) \" · \{plate\}\"; else (3) \" · VIN …\"" | YES — unit-first, not serial |
| Serial-number identifier (P24) — WIP | WIP-COL-05 (C30470) | S4-R7: "…the **unit number** on the first line in bold, and the vehicle identification number on the second line…" | YES — unit, not serial |
| Remove SBC Print (P25) | SBC-EXP-01/13 (C30159/C30171) | Story 16 fully present: S16-R1 "Print is started from the \"Print\" item…"; S16-R2 "reads \"Print.\"" | YES — Print still specced |
| SBC compressed download (P21) | new (no C-ID) | SBC export is nested/expanded only (Stories 14/15 CSV/PDF); no compressed/summary export in spec | YES — not in spec |
| Per-row location label (P10) | SBC-LOC-03 (C30111) +4 | No per-row/section location label specced on the 5 non-WIP reports (WIP alone has a Location column, S4-R1) | YES — not in spec |
| Catalogue rename (P31) | PV-FILT-01 (C30328) | Spec uses "Catalogue" throughout (S3-R1a row-model, S5, columns) | YES — spec says "Catalogue" |
| Location-filter hide ≤1 loc (P33) | SBR-LOC-04, TU-LOC-05, IV-LOC-04, PV-FILT-13 (C30216/C30446/C30577/C30340) | S21-N1 "A single-location user still sees the filter…"; S9-N1 / S7-N1 / S2-E4 all say the same | YES — spec says one-loc user STILL sees filter |

No PENDING-CHRIS item is actually already spec-confirmed (none should have been APPLIED); none of the
APPLIED-NOW edits should have been held. **Classification is correct.**

**Minor advisory (not action-affecting, no fix applied):** PV-FILT-01 (Catalogue rename, P31) is
tagged **PENDING-CHRIS** in the change-list, but `video-deltas-2026-07-28.md` classifies P31 as an
**OPEN DECISION** ("maybe we do rename it… we'll have to truncate" — not firm intent). The PENDING-CHRIS
definition is "firm video intent"; the Catalogue rename is not firm. The net action is identical (case
not changed now) and the row text is honest ("the rename is not decided"), so this is a cosmetic tag
nuance, not a defect. **Recommend** re-tagging P31 to OPEN-DECISION on the next authorized regeneration
(would shift the counts to 10 PENDING / 5 OPEN); left as-is here because it is a judgement nuance, not a
clear defect, and editing would desync the counts already cited in PROJECT-STATE.

---

## Check 3 — Completeness (Rule 17 keyword sweep over all 515 cases) — PASS

- **Q1 (Esc) scope:** "Esc"/"Escape" appears in exactly ONE case file (SBR-C) and only in SBR-DEACT-04
  and SBR-DEACT-05 — both edited. No other dialog case references Esc. **No missed APPLIED-NOW edit.**
- **"All Time" / "All-Time":** 7 cases matched; every one asserts the option is **NOT offered**
  (IV-C "…does not offer \"All Time\"…"; PV-A "There is NO 'All Time' option"; SBC-A "no \"All Time\"
  option"; SBR-A same; WIP-C "\"All Time\" is NOT offered"). The TU/PV "all-time history" hits are the
  Last-Sale look-back metric, not the date filter. Matches STEP-1(a).
- **"Associate":** only appears as "associated work order" / "associated part sale" (SBC-B) — the report
  name is never "Sales by Associate". Matches STEP-1(b).
- **Snapshot "X days ago" label:** none. The only "snapshot" hit (TU-C) is "a fixed snapshot taken at
  load" (a value, not an age label). Matches STEP-1(c).
- **TU column selector:** none in any TU case file. Matches STEP-1(e).
- **Print in other reports:** SBC only (Story 16 is SBC-scoped, P25 is SBC-only). The one TU "print" hit
  is "the spec's printed strings" (not a Print export item).

**Minor advisory (advisory only — item is PENDING, no edit made):** the "also touches" list for the
Catalogue rename names 4 PV cases, but "catalog(ue)" as a concept appears in ~14 PV cases
(PV-CALC-02/03/06/14/15, PV-ROW-02, PV-FILT-02, PV-EXP-04/07, PV-COL-06, etc.). The rename would only
touch user-facing LABEL cases (Type filter option, Type column value, tooltips, export label), so the
4-case list is a reasonable label-scope subset; the exhaustive touch-list should be finalized when Chris
ratifies the rename.

---

## Check 4 — Q2 permission model untouched — PASS

- Grep for "normal reports access" across all 27 case files = **0 hits** → no permission case was
  reworded to Chris's Q2=B answer. (User RULING 1: keep the shipped MIXED model.)
- `git show 16485ca --name-only` = the only case file changed is `cases-sbr-C-…` (the 2 Esc edits); no
  permission-case file (SBC-A/SBR-A/PV-A/TU-A/WIP-E/IV-A) was touched.
- The discrepancy is captured, not applied: `chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`
  exists and is referenced in the change-list ("Q2 permission model" section, line 63) and answers-ingested.

---

## Check 5 — Deliverable hygiene — PASS

- **id-map:** 515 data rows; **0 blank** `testrail_case_id`; **0 duplicate** C-ids.
- **Duplicate titles:** 4 title strings recur, but each pair/triple spans **different reports/sections**
  (SBC-TYPE-01 vs SBR-TYPE-01; PV-FILT-13 / TU-LOC-05 / IV-LOC-04; WIP-COL-01 vs IV-COL-01; WIP-EXP-01
  vs IV-EXP-01). **Zero within-section duplicates** — legitimate per-report repetition of the same
  behaviour. PASS.
- **Import header byte-identical** to `filters-v1-testrail-import.csv`:
  `Title,Section,Type,Priority,Preconditions,Steps,Expected Result,References,,` (diff = empty).
- **Row count:** 515. **Per-report split:** SBC 99 + SBR 127 + PV 70 + TU 59 + WIP 83 + IV 77 = **515**.
- **VIU-word-free + flag-word-free:** grep for VIU / viu_status / feature-flag variants = 0 hits.
- **API placement (Rule 4):** 29 cases in "— API" titled sections. A broad regex flagged 4–5 rows
  outside API sections, but all are false positives — "inclusive endpoints" (range concept), "default
  weight (400)" (font weight), "400 days" (date range), "$400 quoted"/"$400" (money). No true API/HTTP
  content sits outside an API section.

---

## Check 6 — No TestRail writes — PASS

- `gen_changelist.py` imports only `os` (+ openpyxl for xlsx), uses the TestRail URL only to build
  read-only `/cases/view/<id>` links, and writes only local md/xlsx/csv files. No `requests`, no
  `api/v2`, no `add_case`/`update_case`/`delete_case`/`add_result`/`add_run`.
- `gen_import.py` likewise has no write calls.
- **R359 (the not-ours execution run) is not referenced anywhere** in the reconciliation directory.

---

## Check 7 — Change-list quality (Rules 8 / 25) — PASS

- **Columns (md + xlsx):** Internal ID · TestRail Case ID · TestRail link · Report · Driving source ·
  Classification · **What needs to be done (plain)**. Rule 8 (C-id + clickable link) satisfied in both
  formats.
- **C-id accuracy:** all 12 spot-checked change-list C-ids match the id-map exactly (SBR-DEACT-04=C30255,
  DEACT-05=C30256, SBC-LBL-01=C30134, WIP-COL-05=C30470, PV-FILT-01=C30328, SBR-LOC-04=C30216,
  TU-LOC-05=C30446, IV-LOC-04=C30577, PV-FILT-13=C30340, SBC-EXP-01=C30159, SBC-EXP-13=C30171,
  SBC-LOC-03=C30111).
- **Driving-source per row:** present on every row (e.g. "PO answer Q1 = B", "Video P24 - serial-number
  identifier").
- **Rule 25 (cite spec/ticket ref + wording):** every spec-contradiction row cites the exact spec
  anchor; several quote verbatim ('· Unit {unit}'; the Print video line "this should not exist… cut out
  of the spec"; WIP-CALC-08 quotes BOTH video P14 clocked-vs-invoiced AND spec S4-R23 quoted-minus-worked).
  **Minor advisory:** a few rows paraphrase the spec sentence (e.g. WIP-COL-05, the S*-N1 location rows)
  rather than quoting it verbatim, though each gives the precise anchor. Recommend adding the verbatim
  spec sentence on the next regeneration for full Rule-25 rigor; not a defect (these are spec-vs-video
  reconciliation notes, not build-deviation bug calls — nothing is flagged as a bug).

---

## Discrepancies found

| # | Severity | Finding | Fix |
|---|---|---|---|
| D1 | Minor (advisory) | PV-FILT-01 (Catalogue rename, P31) tagged PENDING-CHRIS; the video source classifies P31 as OPEN DECISION (rename not firm). Net action identical, row text honest. | **Recommended**, not applied (judgement nuance, counts already cited in PROJECT-STATE). |
| D2 | Minor (advisory) | A few Rule-25 rows paraphrase the spec sentence instead of quoting it verbatim (anchor always given). | **Recommended** for next regeneration. |
| D3 | Minor (advisory) | Catalogue-rename "also touches" list is a label-scope subset (~14 PV cases carry the term). Item is PENDING (no edit). | Finalize exhaustive touch-list when Chris ratifies. |

No clear defect required a fix; no deliverable was modified by this audit.

---

## Final verdict: **CLEAN**

Phase 2's reconciliation is accurate and honest: the 2 APPLIED-NOW edits correctly implement Chris
Q1=B and override spec S13-R8; all 11 PENDING-CHRIS rows are genuinely still contradicted by the current
spec; Q2 was correctly left untouched (mixed model kept, discrepancy raised not applied); the delta-keyword
sweep surfaced no missed edit; and every deliverable-hygiene, no-TestRail-write, and change-list-quality
requirement passes. Three minor advisory recommendations recorded (D1–D3); none is a defect.
