# FINDINGS — Sales By Customer live build-verify (2026-08-18, build v3.8-2bf8d14)

## 1. Headline
The Sales By Customer report is fully built and working on v3.8-2bf8d14. All 96 SBC cases are ours
(created_by=3). Every feature area was driven live this pass: nav entry, all four filters, the
customer/asset/invoice tree, all financial columns, sorting, the 10-column selector, all four exports,
pagination and the API. The epic SV-8582 calc contract verifies exactly (Margin, Margin %, and the
Adjustments tie-out confirmed per-row and on the totals row against live data). No SBC case is
"not built" -> DEFERRED-RUN.md is empty.

## 2. Defects that STILL REPRODUCE though their ticket is CLOSED (new-ticket candidates; Jira creation on HOLD)
Per Standing Rule 15.1 these markers were removed (a closed ticket does not back an expect-fail), so each
case now carries plain AUTOMATION: READY and the tester will fail it correctly. Flagged for the QA lead:
the Jira creation hold means NO ticket was filed.

- D1  C30166 (Exports): Expanded View PDF exports on A3 (1190.55 x 841.89 pts) instead of A4; the Summary
  PDF from the same menu is correctly A4 (841.89 x 595.28). Measured with pdfinfo on both live downloads.
  Documented expectation S15-R5..R8 (A4 landscape). Ticket SV-8964 is OBSOLETE but the defect persists.
- D2  C30105 (Date Range): the chosen date range is NOT written into the page link. After selecting
  "This Month" + Apply the address bar stayed at the plain report URL. Expectation S2-R6/S2-R9. Ticket
  SV-8955 is OBSOLETE but the defect persists.

All OTHER expect-fail symptoms are FIXED on v3.8 (verified live): SV-8962 customer-filter search icon now
present; SV-8956 download filenames now include the range (sales-by-customer-summary-this_month.pdf);
SV-8937 PDF heading end-date correct (Aug 31 for This Month, not +1); SV-8823 SBC CSV money is a plain
number not text; SV-8818 all four exports return HTTP 200 at the available data size; SV-9074 Product
Type toggles (both on by default, Clear all present) work.

## 3. Label / wording observations (no change needed - cases already build-accurate)
- inv_hrs column shows on screen and in CSV as "Labor Delta" with signed values (+1.93), green for
  positive (rgb(33,186,69)), 0.00 on no-labor rows. Cases already use "Labor Delta" (renamed from
  "Inv. Hrs" per SV-9071). Build-accurate.
- Column order live: Customer, Date, Location, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced,
  Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal - matches cases.
- Column selector lists exactly the 10 toggleable columns, all on by default; Customer, Location,
  Subtotal and chevron not in the list.
- Export menu: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)",
  "Download Expanded View (CSV)" - match.
- Date picker: nine presets in exact order (Last 12 Months -> Last Week); button_sbc_today (calendar-nav)
  + button_sbc_apply below the calendar. Nine presets match S2-R2; "Today" is a calendar-nav control, not
  a preset period. C30102 lifted to READY (PASS).

## 4. Source-reconciliation nuance - flagged, NOT changed (Rule 57)
- C30150 says "Margin % is Margin over Subtotal". The epic SV-8582 formula (authoritative) and the build
  both compute Margin / (Subtotal - Shop supply) x 100. At one decimal they round the same (99.91
  verified), so no visible defect, but the case omits "- Shop supply". Recommend reconciling C30150's
  wording to the epic formula on a future authoring pass. Not changed this pass.

## 5. Invoice-number link-vs-plain-text - open PO question (unchanged)
The build renders a text_sbc_invoice_<id> element, suggesting plain text not a link. Unresolved PO
question (spec states BOTH: S9-N2 link-to-access-denied vs S9-R1a plain-text-no-link). Affects C30100 and
C43558 (both remain HOLD - waiting on PO) and C30138 (deliberately NOT re-stamped; kept existing READY).

## 6. Cases NOT fully driven this pass (kept existing marker, not re-stamped) - honest N-of-M
Of 96 SBC cases, 50 were edited/verified this pass (19 Not-available lifts, 17 expect-fail markers removed
incl. 2 Automated, 8 verified-READY re-stamps, 4 raw-HTML repairs). The remaining ~46 keep prior state;
the report feature was verified present, but these specific behaviours were not re-driven step-by-step:
- Permission-negative cases (C30098, C30099, C30101, C39447, C43546, C30100): the negative branch needs a
  SECOND non-admin sign-in - not available (quick-login/switch-user rotate the shared sv_sso_session;
  only one admin cookie set). Positive behaviour + role editor observed. Kept READY; negative not driven.
- Mobile (C30188, C30189), persistence/saved-view (C30174-C30180), empty-state (C30181), asset
  VIN->Unit#->plate (C30134), sort-by-date (C30145): feature present; sub-behaviour not individually
  driven. Kept existing markers.

## 7. The 10 HOLD cases
- C30100, C43558: waiting on PO answer (invoice link vs plain text) - genuine.
- C30104: 366-day calendar span not driven from harness; a manual tester CAN attempt it (Rule 15.1a
  suggests plain READY) - flagged, not changed (on-screen prevention not verified this pass).
- C30131 (no service invoice), C30132 (no reversed order), C30137 (customer asset shape), C43553
  (no-logo fallback): data-state - seedable on a future pass (Rule 14).
- C30141: deleting a real invoice (destructive) - avoided on shared org; genuine.
- C30184: a failing data fetch cannot be forced - genuine.
- C38912: build does not follow the ratified Location-column rule - flagged DEFECT / new-ticket candidate.

## 8. Environment / method notes
- UI rendered by hydrating the browser with a captured admin user object (/tmp/seed.json) + the supplied
  session cookies. quick-login/switch-user were NOT called (shared-session safety, core 6.5 / skill-03 G3).
- Nothing seeded or mutated on staging; all observation read-only against existing data. No
  roles/staff/settings changed.
- Build marker read byte-stable at pass start and end (v3.8-2bf8d14, etag 0f69246068bb597a9f1a1f02bd708754).

## OUTSTANDING - what I need from you
| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | Two real defects (A3 PDF export; date range not saved to the shareable link) whose Jira tickets are CLOSED but the defect still happens. | Say whether to reopen SV-8964 / SV-8955 or file new tickets (Jira creation is on your hold). | Tester will fail these and has no live ticket to point at. | MED |
| 2 | A second, non-admin test sign-in for the SBC report branch. | Supply a second (non-admin, single-location) session, or say to skip the negative-permission checks. | 6 permission-negative cases can't be driven with one admin cookie without rotating the shared session. | MED |
| 3 | Is the invoice number a clickable link or plain text? (PO question, open.) | Chase the PO for the answer. | 3 cases hinge on it (C30100, C43558, C30138). | MED |
| 4 | The Location-column rule defect (C38912). | Authorise reopening/filing (Jira hold). | The build does not follow the ratified Location rule. | LOW |

Nothing else is outstanding for the SBC build-verify itself.
