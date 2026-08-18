# SBR-FINDINGS — Sales By Representative live build-verify (2026-08-18, build v3.8-bd246fd)

## 1. Headline
The **Sales By Representative report is fully built and working on `v3.8-bd246fd`.** Every feature area
was driven live this pass: nav entry (Performance → Sales, beside Sales By Customer), all four filters
(date / product type / invoice status / location), the Show Unassigned toggle, the rep/invoice tree
(expand-on-demand), all financial columns, payment-status badges, sorting headers, the 8-column
selector, all four exports (Summary/Expanded × PDF/CSV), and the API. **No SBR case tests a feature
that is absent from the build** → `DEFERRED-RUN.md` gets 0 SBR entries.

**The one wrinkle, and it is data, not a defect:** every invoice in this org is **Unassigned** (no
sales rep assigned), so the default view (assigned reps only) is empty. With **Show Unassigned** on
there are 88 invoices this month with real money — the report populates and the tree expands correctly.

## 2. Case counts (Rule 38 — two numbers)
- **Ours: 118** SBR cases (`created_by = 3`), all in the id-map, all live.
- **Live in SBR sections: 120** (ours 118 + 2 foreign).
- **Foreign: 2** — Vladimir Tomovic (id 1): **C38923** (atm=3, Location-column CSV) and **C43981**
  (atm=1, Invoice Status Clear all). HANDS-OFF (Rule 38), not touched, not counted in ours.

## 3. Marker split (live, read back at pass end)
| Marker | Count |
|---|---|
| `AUTOMATION: READY` | 110 |
| `AUTOMATION: READY - EXPECT FAIL (SV-8818)` | 2 (C30290, C30320) |
| `AUTOMATION: HOLD` | 5 |
| `AUTOMATION: Not available on Build to test Yet` | 1 (C30221 — Automated, HELD) |
| **Total** | **118** |

**Gate: READY + EXPECT-FAIL = 112; 118 − 5 HOLD − 1 NOT-AVAILABLE = 112.** Passes both ways.

## 4. Calc contract (epic SV-8582 / FORMULAS-SV-8582.md) — VERIFIED per-row AND on the group/totals row
Report totals shape: `inv_hrs, hours_worked, hours_invoiced, labor_invoiced, labor_margin,
parts_invoiced, parts_margin, adjustments, margin, subtotal, margin_pct`.

- **Margin = Labor Margin + Parts Margin + Adjustments** — exact on the group row and per invoice:
  - Group (Heavy Duty, cents): 216607 + 60343 + 50009239 = **50286189** = margin ✅
  - Invoice S9-25393: $522.35 + $246.91 + $499,979.11 = **$500,748.37** = margin ✅
  - Invoice P71-1268 (part sale): $0 + $5.00 + $0 = **$5.00** = margin ✅
  - Invoice S9-26574 (negative adj): $0 + $220.86 + (−$23.09) = **$197.77** = margin ✅
- **Labor Delta = hours invoiced − hours worked** — exact: 15 − 0.07 = **14.93** ✅ (signed, green for positive)
- **Margin % = Margin ÷ (Subtotal − Shop supply) × 100** — consistent per row: P71-1268 = 5/(10−0) = **50.00%** ✅;
  group 99.84% ties out with a small shop-supply (~$218) subtracted from subtotal.

The **corrected Part Margin formula (74830, latest-wins) is the authoritative one** and the build's
per-invoice Margin ties out exactly using it. No calc defect found.

## 5. FLAGGED DEFECTS (Jira creation on the QA lead's hold — NOTHING FILED)
Recorded with live evidence + recommendation. All are on `v3.8-bd246fd`.

- **F1 — SV-8973 STILL REPRODUCES (empty-state wording), C30298.** Live empty-state message reads
  **"No sales data found for the selected filters."** — which is exactly the wording the case's symptom
  called the defect (spec wants different wording). Ticket **OBSOLETE/Done** but the defect persists.
  Marker set to plain READY (tester will fail it correctly). **Recommend: reopen SV-8973 or file new.**
- **F2 — SV-8975 STILL REPRODUCES (icon-button accessible names), C30307.** Live aria-labels:
  three-dot export button = **"Export report"** (spec: "Report actions"); column button =
  **"Column Selection"** (spec: "Show/Hide columns"). Ticket **OBSOLETE/Done** but the names are still
  the "wrong" ones. Marker set to plain READY. **Recommend: reopen SV-8975 or file new.**
- **F3 — SV-8823 appears FIXED (SBR CSV money format), C30287.** Ticket still **TESTING QA (open)**,
  but the live Summary/Expanded CSV money is **plain numbers** ("2166.07", "+14.93", signed Labor
  Delta) — NOT "$…" text. Marker set to plain READY. **Recommend: close SV-8823 for SBR.**
- **F4 — Expanded PDF exports on A3, Summary PDF on A4 (cross-report with SBC D1 / SV-8964).** Measured
  live with pdfinfo: Summary PDF = **A4** (841.89 × 595.28 pts); Expanded PDF = **A3**
  (1190.55 × 841.89 pts). This matches the SBC pass's D1 finding on the same build. Touches C30279
  (SV-8981 says Expanded PDF should be A4 — the A3-paper aspect still reproduces) and the Exports set.
  **Recommend: one cross-report ticket for the A3 Expanded PDF.** (Grouping "one block per rep vs flat
  table" not separable here — only one group, Unassigned, exists.)

## 6. Source-reconciliation nuance — flagged, NOT changed (Rule 57)
- **Download filenames include a range word** (`sales-by-representative-summary-custom.csv`). Ticket
  SV-8982 (C30281) was OBSOLETE and its old expectation ("fixed names, no range word") is contradicted
  by the current build, which adds the range word — the SAME post-fix behaviour SBC recorded for
  SV-8956. Marker set to READY; **recommend reconciling C30281's expectation to the range-word naming
  on a future authoring pass.** Not rewritten this pass (Rule 25 — never take the expectation from the
  build).

## 7. Invoice link vs plain text — open PO question (same as SBC, unchanged)
The build renders `text_sbr_invoice_<id>` as a **SPAN (plain text, no href)** — not a link. The spec
states both (link-to-access-denied vs plain-text-no-link). This is the same open PO question as SBC.
Affects the SBR-LINK cases; left as-is (C43559 is HOLD on a related PO answer).

## 8. Cases NOT made bulletproof this pass — honest N-of-M (why)
- **Permission-negative cases (SBR-PERM):** the negative branch needs a SECOND non-admin sign-in.
  `quick-login`/`switch-user` rotate the shared `sv_sso_session` and were NOT called (shared-session
  safety, skill-03 G3). Positive nav visibility observed; negative not driven. Kept existing markers.
- **C30290, C30320 (SV-8818, over-cap Expanded PDF / API row-cap):** the > row-cap state is not
  reachable at 88 invoices; base PDF exports return HTTP 200. Ticket SV-8818 still **TESTING QA (open)**;
  neither reproduced nor disproved at this data size. **Markers LEFT UNCHANGED (EXPECT-FAIL SV-8818).**
- **C30293 (SV-8983, Sales Rep Assignments CSV BOM):** the assignments-export endpoint was not located
  from the report page (only the 4 report exports are on the ⋯ menu; guessed paths 404'd — not
  probed further to avoid a false-absence). Set READY (ticket OBSOLETE); assignments-export surface
  not driven. **A dedicated check of the assignments export is owed on a future pass.**
- **C30304 (touch-target px), C30305 (table colour), C30239 (mobile totals bar), C30273 (stale saved
  range), C30225 (same-day sort tie-break):** features present, tickets OBSOLETE/Done, sub-behaviour
  not measured/driven step-by-step this pass. Set READY (fix shipped; no contrary observation).
- **C30311 (SBR-WO-02) HOLD "this part of the report is not built yet":** the WO-sales-rep assignment
  path needs invoices with an assigned rep (none exist in this org). Left HOLD; **flagged for review —
  confirm whether the WO-rep-assignment UI is built (skill-03 G10: a HOLD on a runnable case disarms
  it).**

## 9. What WAS driven live and is build-verified this pass (51 cases carry a fresh v3.8 build-check)
17 deferred lifts + 21 expect-fail→READY (+3 raw-HTML repaired) + 12 plain-READY re-stamps = **51
cases carry `Last checked against build v3.8-bd246fd on 8/18/2026.`** The whole report's feature set
was driven live (nav, all filters, tree expand, calc per-row, columns, badges, exports ×4, empty-state,
API). The remaining ~63 plain-READY cases had their **feature verified present at report level** but
were **not individually sentence-2-stamped this pass** — reported honestly, not folded into the
build-verified count.

## 10. Automated cases (4) — HELD, verified live, NOT written
C30217, C30221, C30262, C30314 — see `SBR-HELD-AUTOMATED.md`. Only C30221 needs a marker change
(DEFERRED → READY, expand-tree verified present); recorded for the QA lead's ask-first ratification.

## 11. Environment / method
- UI hydrated from the supplied session cookies + `/tmp/seed.json` (no `quick-login`/`switch-user`).
- Location switched to Lethbridge briefly to probe for data, **restored to Staging Heavy Duty - 9919**
  (reversible session workplace switch; no role/staff/settings edit). Nothing seeded; all report
  observation read-only against existing data.
- Build marker **byte-stable** at pass start (20:10Z) and end (20:36Z): `v3.8-bd246fd`,
  last-modified 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc` — no redeploy under the pass.
- **Run 359 untouched** — 0 run/result writes (only `update_case`); include_all still False; test count
  unchanged. **0 Jira writes** (only GET for ticket status).

## OUTSTANDING — what I need from you
| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | Two SBR defects whose tickets are closed (Done) but still happen: the empty-state message wording (SV-8973) and three icon-button accessible names (SV-8975). | Say whether to reopen SV-8973 / SV-8975 or file new (Jira creation is on your hold). | The tester will fail these and has no live ticket to point at. | MED |
| 2 | The Expanded-View PDF prints on A3 paper while the Summary PDF is A4 — same across Sales By Customer and Sales By Representative. | Authorise one cross-report ticket (Jira hold). | Documented expectation is A4; the build ships A3. | MED |
| 3 | SV-8823 (CSV money-as-text) looks FIXED for SBR but its ticket is still "TESTING QA". | Confirm and close SV-8823 for the SBR part. | So the case has no stale open-ticket reference. | LOW |
| 4 | A second, non-admin test sign-in for the Report Suite branch. | Supply a second (non-admin) session, or say to skip permission-negative checks. | The SBR-PERM negative branches can't be driven with one admin cookie without rotating the shared session. | MED |
| 5 | Ratify lifting the Automated case C30221 (expand-tree, now built) to READY. | Say yes; I apply it coupled with the verification recorded, then hand the case number to Vlad. | Rule 71 — Automated cases are ask-first even for our own. | LOW |
| 6 | The invoice number is rendered as plain text (span), not a link, on SBR — same open PO question as SBC. | Chase the PO for the answer. | The SBR-LINK cases hinge on it. | LOW |

Nothing else is outstanding for the SBR build-verify itself.
