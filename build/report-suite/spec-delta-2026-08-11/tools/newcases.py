#!/usr/bin/env python3
import sys
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools")
sys.path.insert(0, "/tmp/testrail")
from testrail_add_case import add_case_payload
sys.path.insert(0, "/home/user/Manual-test-Cases/build/report-suite/spec-delta-2026-08-11/tools")
from refs_guard import check

PROV_SBC = ("This is the expected behaviour as per epic SV-8582, read on 11 August 2026, and the "
 "Sales By Customer report specification version 17 (S3-R6a, S3-R2, S17-R1), read on 11 August 2026.")
PROV_WIP = ("This is the expected behaviour as per epic SV-8582, read on 11 August 2026, and the "
 "Work In Progress report specification version 11 (the Key Decision on fixed-price valuation added "
 "on 2026-08-10 per SV-9028, SV-9035, SV-9040 and SV-9044), read on 11 August 2026.")
PROV_CORE = ("This is the expected behaviour as per epic SV-8582, read on 11 August 2026, and the "
 "Work In Progress report specification version 11 (the Key Decision on core charges added on "
 "2026-08-10 per SV-9057 and SV-9058), read on 11 August 2026.")

def exp(body, prov):
    # Rule 54 sentence 1 ONLY -- no build was observed in this pass, so no sentence 2 (Rule 12).
    return body.rstrip() + "\n\n---\n" + prov + "\n\nAUTOMATION: READY"

CASES = [
 dict(internal="SBC-TYPE-04", section=4291,
  title="Clear all leaves neither Product Type toggle on and shows the empty state",
  refs=check("SV-8602 (SBC spec v17 2026-08-10 Story 3 S3-R6a — new in v17: with neither toggle "
    "selected after \"Clear all\" the report shows the Story 17 empty state until a toggle is "
    "selected; S3-R2 pins the two action rows; S17-R1 gives the message)","SBC-TYPE-04"),
  preconds=("1. You are on the Sales By Customer report with a date range that normally returns "
    "rows, so you can tell an empty result from a genuinely empty range.\n"
    "2. The Product Type filter is at its default with both toggles selected."),
  steps=('1. Open the "Product Type" filter and read the two action rows at the top.\n'
    '2. Choose "Clear all" and read the table body.\n'
    '3. Read the toolbar and check the filter still opens.\n'
    '4. Switch the "Parts" toggle back on and read the table body again.\n'
    '5. Choose "All products" and read the table body once more.'),
  expected=exp(
    '1. The filter pins two action rows at the top — "All products" and "Clear all" — above the '
    '"Parts" and "Services" toggles.\n'
    '2. After "Clear all" neither toggle is selected and the table body shows the empty-state '
    'message "No sales data found for the selected filters."\n'
    '3. The empty state is shown in the table body only — the toolbar stays usable and the filter '
    'still opens.\n'
    '4. Switching "Parts" back on brings rows back straight away, limited to invoices whose number '
    'starts with P.\n'
    '5. "All products" selects both toggles again and the full set of rows returns.\n'
    'Note for the tester: an empty report here is the correct result of clearing both toggles, not '
    'a fault — it stays empty until you switch a toggle back on.', PROV_SBC)),

 dict(internal="WIP-CALC-11", section=4354,
  title="A fixed-price line is valued at its fixed amount, not at picked parts or hours",
  refs=check("SV-8660 (WIP spec v11 2026-08-10 §3 Key Decisions — fixed-price lines are valued at "
    "the fixed amounts the customer is billed rather than underlying picked parts or an hourly "
    "derivation; added 2026-08-10 per SV-9028; SV-9035; SV-9040; SV-9044)","WIP-CALC-11"),
  preconds=("1. You are signed in to the ShopView App on a desktop browser.\n"
    "2. A ZZAUTOTEST open work order exists with an approved line priced as a fixed labor total — "
    "for example a fixed $500.00 — where the hourly rate multiplied by the quoted hours would give "
    "a different number.\n"
    "3. A second ZZAUTOTEST open work order exists with an approved line carrying a fixed line "
    "total split into a labor portion and a parts portion, where the parts actually picked for it "
    "are worth a different amount."),
  steps=("1. Open the Work In Progress report and find the first work order's row.\n"
    "2. Read its Labor Earned, Labor Remaining and Total, and compare them against the line's fixed "
    "labor amount.\n"
    "3. Find the second work order's row and read its Parts Earned and Parts Remaining.\n"
    "4. Compare those against the fixed parts portion, and separately against the sell value of the "
    "parts actually picked for the line."),
  expected=exp(
    "1. The first work order's money comes from the line's fixed labor amount — the figure the "
    "customer is billed — not from the quoted hours multiplied by an hourly rate.\n"
    "2. Labor Earned plus Labor Remaining for that line adds up to the fixed amount.\n"
    "3. The second work order's parts money comes from the fixed parts portion of the line total, "
    "not from the sell value of the parts picked against it.\n"
    "4. Parts Earned plus Parts Remaining for that line adds up to the fixed parts portion.\n"
    "Note for the tester: on a fixed-price line the customer pays the agreed figure whatever is "
    "actually picked or clocked, so the report is expected to show the agreed figure. A difference "
    "between the report and the underlying parts or hours is correct here, not a fault.", PROV_WIP)),

 dict(internal="WIP-CALC-12", section=4354,
  title="A fixed-price line with no invoiced hours earns all at once when it is completed",
  refs=check("SV-8660 (WIP spec v11 2026-08-10 §3 Key Decisions — with no invoiced hours the full fixed "
    "amount stays in Remaining until the line is completed then moves entirely to Earned; a "
    "completed WO never leaves value in Remaining; per SV-9028; SV-9035)","WIP-CALC-12"),
  preconds=("1. You are signed in to the ShopView App on a desktop browser.\n"
    "2. A ZZAUTOTEST open work order exists with an approved fixed-price line and NO invoiced hours "
    "recorded against it.\n"
    "3. You are able to mark that line completed."),
  steps=("1. Open the Work In Progress report and read the work order's Earned, Remaining and Total.\n"
    "2. Mark the fixed-price line completed.\n"
    "3. Reload the Work In Progress report and read the same figures again.\n"
    "4. Check the work order's Remaining once every line on it is completed."),
  expected=exp(
    "1. Before the line is completed the whole fixed amount sits in Remaining and Earned shows "
    "nothing for it — it does not creep up in stages.\n"
    "2. After the line is completed the whole fixed amount has moved to Earned and Remaining shows "
    "nothing for it.\n"
    "3. Total is unchanged throughout — the money moves between Earned and Remaining rather than "
    "appearing or disappearing.\n"
    "4. Once every line is completed the work order has no value left in Remaining.\n"
    "Note for the tester: this all-at-once move is expected when there are no invoiced hours to "
    "measure progress with. A fixed-price line that DOES have invoiced hours is shared between "
    "Earned and Remaining in proportion instead, and that is a different test.", PROV_WIP)),

 dict(internal="WIP-CALC-13", section=4354,
  title="Core charges count in parts value and a core decision never moves the figures",
  refs=check("SV-8660 (WIP spec v11 2026-08-10 §3 Key Decisions — a core charge counts in Parts "
    "Remaining and Parts Earned at every stage; marking a returned core OK or Not OK never moves "
    "the report's figures; added 2026-08-10 per SV-9057; SV-9058)","WIP-CALC-13"),
  preconds=("1. You are signed in to the ShopView App on a desktop browser.\n"
    "2. A ZZAUTOTEST open work order exists with an approved parts line for a part that carries a "
    "core charge, and the part has been received so its value has been earned.\n"
    "3. The returned core is waiting to be marked OK or Not OK."),
  steps=("1. Open the Work In Progress report and write down the work order's Parts Earned, Parts "
    "Remaining, Earned, Remaining and Total.\n"
    "2. Mark the returned core OK.\n"
    "3. Reload the Work In Progress report and read the same five figures again.\n"
    "4. On a second work order in the same state, mark the returned core Not OK, reload and read "
    "the same five figures again."),
  expected=exp(
    "1. The core charge is counted in the work order's parts money — Parts Earned once the part is "
    "received, and Parts Remaining while it is still outstanding.\n"
    "2. After marking the core OK all five figures are exactly as they were before.\n"
    "3. After marking the core Not OK all five figures are again exactly as they were before.\n"
    "Note for the tester: deciding a core is handled when the invoice is raised, which is outside "
    "this report, so this report is expected not to move at all. If a figure changes when you mark "
    "a core, that is a fault worth reporting.", PROV_CORE)),
]
