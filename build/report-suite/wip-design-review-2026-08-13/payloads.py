# WIP Story-5 design-review reconciliation payloads. <br> interim form (hazard #6).
PROV_S1 = ("This is the expected behaviour as per epic SV-8582, the Work In Progress report design "
 "review of 13 August 2026 (https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e), "
 "and the Work In Progress report specification.")
PROV_S2 = "Last checked against build v3.8-d0e135e on 8/20/2026."

def br(items): return "<br>".join(items)
def exp(items, divergence=None):
    tail = "<br><br>---<br>" + PROV_S1 + "<br>" + PROV_S2
    if divergence: tail += "<br>" + divergence
    tail += "<br><br>AUTOMATION: READY"
    return br(items) + tail

ORDER = ("Completed Work on Open Work Orders, Work Orders Ready to Invoice, Total Completed Work, "
 "Work Orders Not Started, Remaining Work on Open Work Orders, Remaining Work, and Estimates")

RENAME_ALL = ("The figure names above are the 13 August 2026 design-review names; they replace the "
 "earlier specification names (Total Earned, Total Remaining, Not Started, Started - Earned, "
 "Started - Remaining, Ready to Invoice), and we have taken the latest design review as prevailing.")

CASES = {}

CASES[30487] = dict(
 title="The summary strip shows seven figures in a fixed order as US dollars",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The Work In Progress report is open with rows loaded."],
 steps=["1. Read the summary strip across the top of the report, left to right.",
        "2. Read each figure's number format."],
 expected=exp([
  "1. The strip shows seven figures, grouped as two equations with the Estimates figure apart, in this left-to-right order: " + ORDER + ".",
  "2. Every figure shows US-dollar currency with a leading \"$\", two decimals, and thousands separators."],
  divergence=RENAME_ALL),
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - seven summary figures + grouped math order + US currency; supersedes the v22 figure names)")

CASES[30489] = dict(
 title="Work Orders Not Started + Remaining Work on Open Work Orders = Remaining Work",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The report shows jobs in the \"Approved - Not Started\" and \"Approved - Partially Completed\" tabs with non-zero remaining values."],
 steps=["1. Add the Work Orders Not Started figure to the Remaining Work on Open Work Orders figure.",
        "2. Compare the sum to the Remaining Work figure."],
 expected=exp([
  "1. Remaining Work equals Work Orders Not Started plus Remaining Work on Open Work Orders, to the cent."],
  divergence="The figure names above are the 13 August 2026 design-review names, replacing the earlier 'Total Remaining', 'Not Started' and 'Started - Remaining'; we have taken the latest design review as prevailing."),
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - grouped math: Work Orders Not Started + Remaining Work on Open Work Orders = Remaining Work)")

CASES[30490] = dict(
 title="Each per-stage figure equals the matching tab's money total",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. All four tabs contain at least one job with non-zero money.",
           "3. The Earned and Remaining columns are visible."],
 steps=["1. In the \"Approved - Not Started\" tab, add up each job's Earned + Remaining (its approved value) and compare to the Work Orders Not Started figure.",
        "2. In the \"Approved - Partially Completed\" tab, compare the tab's total Earned to the Completed Work on Open Work Orders figure and the tab's total Remaining to the Remaining Work on Open Work Orders figure.",
        "3. In the \"Completed\" tab, compare the tab's total Earned to the Work Orders Ready to Invoice figure."],
 expected=exp([
  "1. Work Orders Not Started equals the total approved value (earned + remaining) of the jobs in the \"Approved - Not Started\" tab.",
  "2. Completed Work on Open Work Orders equals the total Earned of the jobs in the \"Approved - Partially Completed\" tab, and Remaining Work on Open Work Orders equals that tab's total Remaining.",
  "3. Work Orders Ready to Invoice equals the total Earned of the jobs in the \"Completed\" tab."],
  divergence="The figure names above are the 13 August 2026 design-review names, replacing the earlier 'Not Started', 'Started - Earned', 'Started - Remaining' and 'Ready to Invoice'; we have taken the latest design review as prevailing. Tab names are unchanged this wave."),
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - per-stage figures tie to their tab totals; tab names unchanged this wave)")

CASES[30491] = dict(
 title="The Estimates figure is the Estimates tab total, shown at full opacity",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The Estimates tab contains at least one estimate line that has not yet been approved, with a non-zero value."],
 steps=["1. Compare the Estimates figure to the total value of the unapproved estimate lines, including any lines awaiting authorization on open work orders.",
        "2. Look at how the Estimates figure is styled compared to the other figures.",
        "3. Check whether the Estimates amount is included in Total Completed Work or Remaining Work (their component figures should not contain it)."],
 expected=exp([
  "1. The Estimates figure equals the total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders (counted per line, not per work order).",
  "2. It is shown at full opacity (un-greyed) - not muted.",
  "3. The Estimates figure is excluded from Total Completed Work and from Remaining Work."],
  divergence="The earlier specification wording had this figure shown muted and counted per work order; the 13 August 2026 design review changed it to full opacity and counted per line (including lines awaiting authorization on open work orders), and we have taken the latest design review as prevailing."),
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - Estimates counted per line incl. lines awaiting authorization; now shown un-greyed / full opacity)")

CASES[30493] = dict(
 title="Each summary figure's information icon reveals its plain explanation",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The Work In Progress report is open with the summary strip visible."],
 steps=["1. Hover (or focus, or tap) the small information icon next to each of the seven summary figures, one at a time.",
        "2. Read each revealed explanation and compare it word-for-word to the expected text."],
 expected=exp([
  "1. Total Completed Work: \"The total value of all completed work order lines that have not yet been invoiced, including completed lines on work orders that are still in progress and work orders where all work is complete.\"",
  "2. Remaining Work: \"The total value of all approved work that has not yet been completed, including work orders that have not started and incomplete work order lines on work orders already in progress.\"",
  "3. Work Orders Not Started: \"The total value of approved work orders where no work has started yet.\"",
  "4. Completed Work on Open Work Orders: \"The total value of completed work order lines on work orders that are still in progress.\"",
  "5. Remaining Work on Open Work Orders: \"The total value of incomplete work order lines on work orders where work has already started.\"",
  "6. Work Orders Ready to Invoice: \"The total value of work orders where all work order lines are completed and the work order is ready to be invoiced.\"",
  "7. Estimates: \"The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders.\"",
  "8. Each explanation appears on hover, on keyboard focus, and on tap."],
  divergence="The earlier specification gave shorter plain-language explanations for these figures; the 13 August 2026 design review locked the wording above (Fabian signed off the Remaining Work text in the review call), and we have taken the latest design review as prevailing."),
 refs="SV-8661 (WIP Story 5; WIP report design review 2026-08-13 - seven summary-figure tooltips locked verbatim; Fabian signed off Remaining Work; Estimates tooltip locked)")

CASES[43818] = dict(
 title="The summary strip shows seven figures and no Adjustments figure",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. Open work orders with work-order-level fees or discounts appear on the report."],
 steps=["1. Open the Work In Progress report.",
        "2. Read the summary strip at the top of the report."],
 expected=exp([
  "1. The summary strip shows exactly seven figures, in this order: " + ORDER + ".",
  "2. There is no Adjustments figure in the summary strip.",
  "3. Work-order-level fees and discounts are carried only by the Adjustments column and the per-tab Totals row, not by a summary figure."],
  divergence=RENAME_ALL),
 refs="SV-9282 (WIP Story 5; WIP report design review 2026-08-13 - seven summary figures in grouped order, no Adjustments tile in the strip)")

CASES[30520] = dict(
 title="The summary strip shows two grouped equations above the tabs, Estimates apart",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The Work In Progress report is open with rows loaded."],
 steps=["1. Look at where the summary strip sits relative to the four tabs.",
        "2. Look at how the figures are grouped and joined."],
 expected=exp([
  "1. The summary strip appears above the tabs.",
  "2. The figures are shown as two boxed equations joined by \"+\" and \"=\" signs: Completed Work on Open Work Orders + Work Orders Ready to Invoice = Total Completed Work; and Work Orders Not Started + Remaining Work on Open Work Orders = Remaining Work.",
  "3. The Estimates figure sits apart from the two equations."],
  divergence="The earlier specification described the strip as a bold band ruled top and bottom; the 13 August 2026 design review changed it to two grouped equations joined by + and = signs with Estimates apart, and we have taken the latest design review as prevailing."),
 refs="SV-8666 (WIP Story 10; WIP report design review 2026-08-13 - summary strip is two grouped +/= equations above the tabs, Estimates apart)")

CASES[30524] = dict(
 title="Each summary figure's info icon is keyboard-reachable and screen-read",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. Part of this test checks what a blind user would hear, so you need a screen reader. On Windows install NVDA - it is free, from nvaccess.org. On a Mac use VoiceOver, which is already built in (Cmd+F5 turns it on and off). Alternatively the browser's developer tools (F12) have an \"Accessibility\" panel that shows the same names without you having to listen to anything."],
 steps=["1. Using only the keyboard, move focus to each summary figure's information icon.",
        "2. Check that the explanation is revealed on focus (not hover alone).",
        "3. With the screen reader or accessibility inspector, check that the explanation text is exposed to assistive technology."],
 expected=exp([
  "1. Each information icon is reachable by keyboard focus.",
  "2. Its explanation is revealed on focus, not by hover alone.",
  "3. The explanation text is exposed to assistive technology."]),
 refs="SV-8666 (WIP Story 10 S10-R7 - summary-figure info icons keyboard-reachable and exposed to assistive tech; WIP report design review 2026-08-13)")

# sanity: no forbidden chars other than <br>
import re
for cid,c in CASES.items():
    blob = c['title'] + "".join(c['preconds']) + "".join(c['steps']) + c['expected']
    stripped = blob.replace("<br>","")
    for bad in ["&","<",">","—"]:
        if bad in stripped:
            raise SystemExit("FORBIDDEN char %r in C%d"%(bad,cid))
    if len(c['title'])>80: print("WARN title >80 (%d): C%d %r"%(len(c['title']),cid,c['title']))
    for r in [c['refs']]:
        for part in r.split(','):
            if len(part.strip())>248: raise SystemExit("refs entry >248 in C%d"%cid)
print("payloads OK, %d cases"%len(CASES))
for cid,c in CASES.items(): print("  C%d title(%d): %s"%(cid,len(c['title']),c['title']))

CASES[30488] = dict(
 title="Total Completed Work is the hero total equal to its two completed-work figures",
 preconds=["1. You are signed in to the ShopView App on a desktop browser.",
           "2. The report shows jobs in the \"Approved - Partially Completed\" tab and the \"Completed\" tab with non-zero completed values."],
 steps=["1. Look at how the Total Completed Work figure is presented compared to the other figures.",
        "2. Add the Completed Work on Open Work Orders figure to the Work Orders Ready to Invoice figure.",
        "3. Compare the sum to the Total Completed Work figure."],
 expected=exp([
  "1. Total Completed Work is the headline (hero) total that the completed-work equation resolves to: Completed Work on Open Work Orders + Work Orders Ready to Invoice = Total Completed Work.",
  "2. Total Completed Work equals Completed Work on Open Work Orders plus Work Orders Ready to Invoice, to the cent."],
  divergence="The figure names above are the 13 August 2026 design-review names, replacing the earlier 'Total Earned', 'Started - Earned' and 'Ready to Invoice'; the earlier 'larger figure with a coloured underline' hero styling is replaced by the grouped-equation layout in which Total Completed Work is the total the completed-work equation resolves to. We have taken the latest design review as prevailing."),
 refs="SV-8661 (WIP Story 5; WIP design review 13 Aug 2026 - Total Completed Work hero = Completed Work on Open Work Orders + Work Orders Ready to Invoice; epic SV-8582)")

import re as _re
_c=CASES[30488]
_blob=_c['title']+"".join(_c['preconds'])+"".join(_c['steps'])+_c['expected']
for _bad in ["&","<",">","—"]:
    if _bad in _blob.replace("<br>",""): raise SystemExit("FORBIDDEN %r in C30488"%_bad)
print("C30488 added, title(%d): %s"%(len(_c['title']),_c['title']))
