"""Consolidated findings — dashboard + reports full pass, 28 Oct 2026 (build v26.43.2-f8698cb).

One row per finding. `status` decides the workbook tab:
  READY      — passed the ten-check gate; draft ticket written; waits only for the QA lead's per-ticket go-ahead
  HELD       — draft written, but the written source can be read two ways / is silent → PO question first
  KNOWN      — already reported in Jira; still reproduces; not re-filed
  QA-LEAD    — previously raised, closed (Obsolete), still on screen → QA lead decides
  NOT-TICKET — Rule 24 (screen blocks, only the API allows), rounding, or an observation
Paths are relative to build/dashboard-verify-2026-10-28/.
"""

D = 'defect-pack-2026-10-28/'
W1 = 'reports/W1-labor-wip/'
W3 = 'reports/W3-parts/'
W4 = 'reports/W4-finance-accounting-comms/'
W2 = 'reports/W2-sales-advisor-tax/'

FINDINGS = [
    # ---------------- READY TO FILE ----------------
    dict(id='AP1', area='Reports', report='A/P Aging Detail · A/P Unpaid Invoices', status='READY',
         finding='Past Due is one day short for every bill not yet due (due tomorrow shows 0, due in 10 days shows -9).',
         evidence='481/481 not-yet-due bills on 29 Oct (HD), 985/985, 1,098/1,098, 906/906 on older dates, 449/491 Lethbridge; screen-proven at two locations. Coordinator re-checked live: 482/482 at Lethbridge.',
         source='AP reports PRD, Confluence 265093124 v13 (2026-03-18)', question='—',
         files=W4 + 'defects/TICKET-AP1-ap-past-due-one-day-short.wiki'),
    dict(id='PV-D1', area='Reports', report='Parts Velocity', status='READY',
         finding='A special-order part billed with "Receive later" shows 0 sold, $0.00 revenue and Demand 0.',
         evidence='Seeded ZZAUTOTEST-SO1-10282011 (DVI Test): billed, report 0/0/$0; SO2 received normally shows 1/1/$80.00. Coordinator re-read live.',
         source='Parts Velocity spec, Confluence 620888066 v12 (2026-09-14)', question='—',
         files=W3 + 'defects/TICKET-D1-pv-receive-later-special-order-not-counted.wiki'),
    dict(id='PV-D2', area='Reports', report='Parts Velocity', status='READY',
         finding='Demand counts a work order twice after the invoice is reversed and created again.',
         evidence='Seeded ZZAUTOTEST-PV1-10282011: Demand 5 for 4 work orders after one Reverse + Create Invoice. Spec S5-R4: "A transaction counts once however many times it is invoiced, reversed or re-invoiced"; spec change log 20 Aug says the build then showed Demand 1 → regression. Coordinator re-read live.',
         source='Parts Velocity spec, Confluence 620888066 v12 (2026-09-14), S5-R4', question='—',
         files=W3 + 'defects/TICKET-D2-pv-demand-counts-reinvoice-twice.wiki'),

    # ---------------- HELD FOR PO ----------------
    dict(id='F2', area='Dashboard', report='Technician Efficiency tile (and report)', status='HELD',
         finding='Technician time on lines the customer declined still counts in "Invoiced Tech Hrs".',
         evidence='Reproduced 3 times (S1-38195, S1-38198, S1-38199 screen-only): only line 1 billed, technician shows 2.00 Invoiced Tech Hrs / 133.33 %.',
         source='Dashboard PRD v53, Confluence 788430850 (2026-10-22)', question='DQ-1',
         files=D + 'TICKET-F2-tech-efficiency-counts-declined-lines.wiki'),
    dict(id='F4', area='Dashboard', report='Revenue tile (and Sales report)', status='HELD',
         finding='Revenue is after a work-order discount; the PRD says "before any discount".',
         evidence='Reproduced twice (S1-38196, S1-38200 screen-only): $135.00 labor with $20.00 discount counts as $115.00.',
         source='Dashboard PRD v53, Confluence 788430850', question='DQ-2',
         files=D + 'TICKET-F4-revenue-after-discount.wiki'),
    dict(id='WIP-D1', area='Reports', report='Work In Progress', status='HELD',
         finding='"Days Open" counts calendar dates: a work order 10 hours old shows "1 days" (spec: whole 24-hour periods).',
         evidence='3,977 of 4,061 HD rows one day high at 00:45 local; S2-38105 created 3:19 PM shows "1 days" ten hours later. Spec S4-R12 quote confirmed verbatim by coordinator.',
         source='WIP spec, Confluence 703660034 v28 (2026-08-24), S4-R12', question='WQ-1',
         files=W1 + 'defects/TICKET-W1-D1-wip-days-open-calendar-days.wiki'),
    dict(id='TU-D2', area='Reports', report='Technician Utilization', status='HELD',
         finding='Utilization % shows two decimals (85.71%); the spec says one (85.7%).',
         evidence='Every row. Conflicts with SV-9059 (Done, asked for two) and SV-9407 (same symptom, closed Obsolete).',
         source='TU spec, Confluence 641400833 v9 (2026-08-13), S2-R7', question='WQ-2',
         files=W1 + 'defects/TICKET-W1-D2-tu-utilization-two-decimals.wiki'),
    dict(id='WIP-D3', area='Reports', report='Work In Progress', status='HELD',
         finding='Negative amounts show as "(-$3.13)"; the spec shows "-$1,234.56".',
         evidence='Totals row on screen.', source='WIP spec v28, S4-R14', question='WQ-3',
         files=W1 + 'defects/DEFECT-CANDIDATE-wip-negative-amounts-in-brackets.md'),
    dict(id='AR1', area='Reports', report='A/R Aging Collection', status='HELD',
         finding='A credit created on the chosen date is listed as 1 day past due; the PRD says 0-day items are not shown.',
         evidence='CM2-4462, CM2-4463 (30 Sep), CM1-4535 (28 Oct). SV-5606 (Done) asked for exactly this behaviour.',
         source='AR PRD, Confluence 82083852 v25 (2026-02-19)', question='RQ-1',
         files=W4 + 'defects/TICKET-AR1-ar-collection-same-day-credit.wiki'),
    dict(id='DEP1', area='Reports', report='A/R Aging', status='HELD',
         finding='A deposit on an invoiced part sale is not taken off the part sale\'s balance in A/R Aging.',
         evidence='P2-2352: Invoices tab $443.43, A/R Aging $543.43 ($100 deposit "Held"); P2-2439 $21 vs $16. Proposed as a comment on SV-11690.',
         source='AR PRD v25 / SV-11690', question='RQ-2',
         files=W4 + 'defects/DEFECT-CANDIDATE-ar-aging-part-sale-held-deposit.md'),
    dict(id='IBS1', area='Reports', report='IBS Batches · Sent', status='HELD',
         finding='A Sent batch Total ($9,473.35) is not the sum of its 9 invoices ($9,183.29).',
         evidence='Lethbridge batch of 2 Oct 2026; the batch\'s own export says $9,183.29. Cause not re-created.',
         source='No PRD (Jira SV-2144)', question='RQ-3',
         files=W4 + 'defects/TICKET-IBS1-sent-batch-total-not-sum-of-invoices.wiki'),
    dict(id='NOTES1', area='Reports', report='Notes Report', status='HELD',
         finding='The Notes Report never shows more than 100 notes, with no way to see the rest.',
         evidence='All: 100 of 2,545; Last Week 100 of 255; Author 100 of 1,105.',
         source='No written source', question='RQ-4',
         files=W4 + 'defects/TICKET-NOTES1-notes-report-stops-at-100.wiki'),

    # ---------------- ALREADY REPORTED ----------------
    dict(id='F1', area='Dashboard + Reports', report='Technician Utilization', status='KNOWN',
         finding='Never-clocked-out timesheets count as 24 h a day.', evidence='HD: 3 technicians ≈ 673 h this month; also Lethbridge Grace Smith 662 h (not named in the ticket).',
         source='SV-11688 (Ready to Fix)', question='—', files=D + 'NOT-FILED.md'),
    dict(id='TA-N4', area='Reports', report='Timesheet Activities', status='KNOWN',
         finding='Rows do not add up to the footer when a clock has run since an earlier day.', evidence='HD this month 2,913.04 vs 1,468.29.',
         source='SV-10698 (Blocked)', question='—', files=W1 + 'defects/NOT-FILED.md'),
    dict(id='TA-N5', area='Reports', report='Timesheet Activities', status='KNOWN',
         finding='On a daylight-saving day a 23-hour day row reads 24.00 h.', evidence='Lethbridge, Craig Moore, 8 Mar 2026.',
         source='SV-10701 (Blocked)', question='—', files=W1 + 'defects/NOT-FILED.md'),
    dict(id='AR-L2', area='Reports', report='A/R Aging', status='KNOWN',
         finding='4 invoices open in A/R but settled on the customer account.', evidence='S2-8650, S2-8771, S2-8092, S3-8848 ($9,264.44).',
         source='SV-11691 (In Progress)', question='—', files=W4 + 'RESULTS.md'),
    dict(id='PV-K1', area='Reports', report='Parts Velocity', status='KNOWN',
         finding='Vendor/Category never show "Multiple" on multi-vendor rows.', evidence='SUBLET, FREIGHT.',
         source='SV-10080 (Code Review, not on staging)', question='—', files=W3 + 'RESULTS.md'),
    dict(id='IV-K1', area='Reports', report='Inventory Value', status='KNOWN',
         finding='Negative bins are ignored.', evidence='22 parts with mixed bins overstate cost value by $1,730.14; 19 negative-only parts left out.',
         source='SV-10380 (Testing QA, fix not on staging)', question='—', files=W3 + 'RESULTS.md'),
    dict(id='AR-K2', area='Reports', report='A/R & A/P (all six)', status='KNOWN',
         finding='Rows in no set order; Totals ignore the Customer/Vendor filter; label wording.', evidence='Observed on screen.',
         source='SV-11315 epic (Ready for Development) — scheduled', question='—', files=W4 + 'RESULTS.md'),

    # ---------------- QA LEAD DECISION ----------------
    dict(id='IV-O1', area='Reports', report='Inventory Value', status='QA-LEAD',
         finding='First visit shows Margin and Total Sell (spec: hidden by default).', evidence='Fresh browser, 28 Oct.',
         source='SV-8927 (closed Obsolete)', question='Reopen?', files=W3 + 'RESULTS.md'),
    dict(id='IV-O2', area='Reports', report='Inventory Value', status='QA-LEAD',
         finding='Totals row reads "Totals" (spec: "Total").', evidence='Screen.', source='SV-8926 (closed Obsolete)', question='Reopen?', files=W3 + 'RESULTS.md'),
    dict(id='IV-O3', area='Reports', report='Inventory Value', status='QA-LEAD',
         finding='Empty-state wording differs from the spec; header "Qty" vs "Qty on Hand".', evidence='Screen.',
         source='SV-8930 (closed Obsolete)', question='Reopen?', files=W3 + 'RESULTS.md'),

    # ---------------- NOT A TICKET ----------------
    dict(id='F3/F5', area='Dashboard', report='Billing Efficiency / Sales', status='NOT-TICKET',
         finding='Lines added to Paid/Invoiced work orders after invoicing change hours and the pending invoice.',
         evidence='Only possible through the API (no New Line button on screen) → Rule 24 pass; API-hardening note.',
         source='—', question='—', files=D + 'NOT-FILED.md'),
    dict(id='W1-N1/N2', area='Reports', report='WIP / Shop Efficiency', status='NOT-TICKET',
         finding='Fixed price + hourly rate valued at hours × rate; void invoice hours counted.',
         evidence='Only reachable through the API → Rule 24.', source='—', question='WQ-9', files=W1 + 'defects/NOT-FILED.md'),
]

CHECKS = [
    ['Dashboard — self-consistency (17 figures × 4 locations × 16 date ranges)', 1185, 1181, 4, '4 = API accepts 367 days; picker blocks it (Rule 24 pass)'],
    ['Dashboard — tile equals its report', 2592, 2592, 0, ''],
    ['Dashboard — recompute from raw invoices / lines / clocks', 53748, None, None, 'all pass except F2, F3 (API-only), 4 × 1-cent rounding'],
    ['Dashboard — screen equals server, expanded panels, chart filters', 1314, 1314, 0, ''],
    ['Dashboard — seeded known data (12 scenarios)', 12, 8, 4, 'F2, F4 held; F3, F5 API-only'],
    ['Work In Progress', 246694, 246675, 19, 'Days Open (WIP-D1, held)'],
    ['Technician Utilization', 3028, 2739, 134, 'SV-11688 open clocks; decimals (TU-D2, held)'],
    ['Timesheet Activities', 119979, 119892, 51, 'all = SV-10698 / SV-10701 or deleted-WO clocks'],
    ['Parts Velocity', 2034770, 2034573, 197, '168 = PV-D1; rest explained (deleted parts PQ-6, collation, inconclusive slices); seeded data → PV-D1, PV-D2'],
    ['Inventory Value', 800233, 800226, 7, 'collation / unrounded ties — invisible on screen'],
    ['A/R, A/P, IBS, QB Unexported, Exports, Notes, Reminders', 824, 756, 68, '1 ready, 4 held, 2 known'],
]
