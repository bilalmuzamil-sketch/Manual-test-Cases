#!/usr/bin/env python3
"""PHASE 3a — trim every TestRail case title to <= 80 characters.

Standing instruction: a title must display in full on the TestRail case page (~<=80
chars) and must still make sense on its own. The distinguishing detail is never lost —
it either already lives in the case's Expected Results / Steps, or it is MOVED there.

Method per over-length title:
  1. COMPRESS — meaning-preserving substitutions only (", and " -> "; ", "the report
     remembers" -> "The report remembers", etc.). No invented words.
  2. CUT at the last natural clause boundary at or before 80 chars.
  3. Reject a cut that leaves a dangling connective, ends mid-quote, or drops below
     30 chars — those fall through to the hand-written HAND map.
  4. VERIFY the dropped tail: every significant word (>=5 chars, not a stop word) in
     the removed text must already appear in the case's Steps or Expected. Where it
     does not, the case is listed for a targeted Expected-Results addition instead of
     a silent loss.
  5. Titles must stay UNIQUE across the whole suite.

LOCAL ONLY. No TestRail writes.
"""
import json, re, os, glob, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "authenticity-2026-07-31")
CAP = 80

files = sorted(glob.glob(os.path.join(ROOT, "cases", "cases-*.json")))
data = {f: json.load(open(f, encoding="utf-8")) for f in files}
cases = {c["id"]: c for lst in data.values() for c in lst
         if not str(c.get("viu_status", "")).startswith("Retired")}

# ---------------------------------------------------------------- 1. compression
COMPRESS = [
 (r"^The report remembers ", "Remembers "),
 (r"^The user can ", "User can "),
 (r"^A user with ", "User with "),
 (r"^Every one of the ", "Every "),
 (r", and ", "; "),
 (r" and then ", "; then "),
 (r", plus ", " + "),
 (r", with ", "; "),
 (r", while ", "; "),
 (r", but ", "; "),
 (r", so ", "; "),
 (r", then ", "; "),
 (r"assistive-technology", "screen-reader"),
 (r"assistive technology", "screen reader"),
 (r" work order's ", " WO's "),
 (r" work orders ", " WOs "),
 (r" work order ", " WO "),
 (r"^Work order ", "WO "),
 (r"reconciliation exception", "reconcile exception"),
 (r" percentage ", " percent "),
 (r" organization ", " org "),
]
# ONLY strong boundaries: a cut at a weak comma or an opening bracket leaves a
# dangling fragment, so those are not accepted and the title is hand-written instead.
BOUND = re.compile(r"(?: — | - |: |; |\. )")
STOP = set("""the a an and or of to in on for with per its it is are was were be been being that this these those
from by at as not no never only every each any all both one two into over under out up down off then than when
while where which who whom whose what how why do does did done can could may might must shall should will would
same other another such very more most less least own so if but because although though unless until after before
during without within between across through about above below again once here there also just even still yet""".split())
def sig(txt):
    return {w for w in re.findall(r"[a-zA-Z][a-zA-Z%\-\.']{4,}", txt.lower()) if w not in STOP}

# ---------------------------------------------------------------- hand-written
# Only where the mechanical cut would read badly or lose the subject. Every one of
# these keeps the case's distinguishing subject AND its key assertion.
HAND = {
 "IV-API-06": "Thinned history still served by the closest-recorded-day rule",
 "IV-API-01": "Nightly snapshot records one row per in-stock non-core part per location",
 "IV-API-02": "A recorded snapshot day equals what the live report showed that day",
 "IV-VIS-02": "Toolbar layout: menu leftmost then Column Selection; then the 5 filters",
 "IV-EXP-03": "Export number formats: money to 2 decimals; Margin % to 1 with em-dash",
 "IV-PERS-03": "The report remembers all filters; columns and sort per browser",
 "IV-DATE-06": "A Custom range values stock as of the picked end date; capped at today",
 "IV-DATE-05": '"As of" indicator names the day shown; hidden when it matches the ask',
 "IV-DATE-08": "History accrues forward only; a pre-first-recording date is not shown",
 "IV-EXP-04": "PDF header shows report name; org; period and an as-of line; logo if set",
 "SBC-API-01": "Asset and invoice rows are fetched on first expand; one call per customer",
 "SBC-API-03": "The Customer type-ahead queries the server instead of loading every name",
 "SBC-TREE-13": "Every row type renders the same columns in the same order",
 "SBC-PERS-07": "Customer filter restore: all-customers stays all; an id set is intersected",
 "SBC-PERS-01": "Filters; sort and visible columns are restored on the next visit",
 "SBC-SORT-04": "Sorting by Date orders customers by their most recent invoice date",
 "SBR-DEACT-08": "A deactivation failure shows the error toast and leaves the status alone",
 "SBR-DEACT-03": "Type-YES gate: auto-focus; case-insensitive match; Enter submits",
 "SBR-STATE-03": "Loading shows a centered spinner over the data area and hides the Totals",
 "SBR-STATE-04": "A load failure shows the inline could-not-load message with a Retry",
 "SBR-LINK-04": "Invoice links use theme-primary; customer links use the body color",
 "SBR-LINK-05": "An unavailable link destination shows the standard not-found state",
 "SBR-TOT-02": "Desktop Totals row merges the identifier columns and sticks to the bottom",
 "SBR-SORT-03": "First header click sorts ascending; second descending; no third state",
 "SBR-ROW-01": "A rep row appears only when the rep has a matching non-reversed invoice",
 "SBR-EXP-03": "Summary PDF: one rolled-up row per rep with a recomputed grand totals row",
 "TU-LINK-04": "Reconcile exception (a): an open clock is snapshotted at each load instant",
 "TU-ELL-04": "Internal hours with no default labor rate anywhere show an em-dash",
 "TU-ELL-05": "Internal hours split across rated and unrated locations show a part value",
 "TU-ELL-01": "Est. Lost Labor values internal hours at each location's default rate",
 "TU-NAV-05": "The loading indicator shows on load and reload; rows swap only on data",
 "TU-TECH-02": "Deselecting a technician hides the row and recalculates the Summary",
 "TU-API-01": "The per-day breakdown is fetched only when a technician row is expanded",
 "WIP-CALC-06": "Earned + Remaining make Total; not the WO's grand total",
 "WIP-CALC-08": "Inv. Hrs shows quoted minus worked hours; signed to one decimal",
 "WIP-CALC-02": "Labor Earned is the clocked share of each approved line's quoted value",
 "WIP-FLT-02": 'Customer filter is a type-ahead multi-select reading "All customers"',
 "WIP-FLT-05": "The date range filters on the WO's created date and reloads on change",
 "WIP-API-04": "Nightly snapshot spans every location with no user location filter",
 "WIP-API-02": "Each snapshot row captures the WO; status; money; location and the date",
 "WIP-API-03": "Captured Earned and Remaining use the same maths as the on-screen report",
 "WIP-SCOPE-01": "Every open service WO at a selected location appears in the report",
 "WIP-SCOPE-04": "While loading the standard indicator shows and old rows stay until data",
 "WIP-PERM-01": "The Work In Progress reports permission covers opening and downloading",

 "IV-API-04": "Nightly snapshot: a re-run records today's truth; it cannot rebuild a past day",
 "IV-DATE-01": "Date range offers the standard presets plus Custom; no All Time option",
 "IV-DATE-03": "A window reaching today with today not yet recorded values live stock",
 "IV-EXP-05": "Downloaded files are named inventory-value-report.pdf and .csv",
 "IV-FLT-01": "Category and Vendor multi-selects reload the report to matching parts only",
 "IV-FLT-04": "Part search matches part number or description on the server; case-insensitive",
 "IV-NAV-03": "First visit defaults to the current calendar month and the active location",
 "IV-PERM-02": "Without the permission Inventory Value is absent from the reports navigation",
 "IV-VIS-01": "All-white table with no row shading on the standard report backdrop",
 "IV-VIS-04": "Long Description; Category and Vendor truncate on hover; Part # never does",
 "PV-API-03": "Header-click sorting re-queries the server; nulls first asc and last desc",
 "PV-API-04": "The backend denies report data AND export without Inventory Reports View",
 "PV-COL-04": "Filters; columns and sort are remembered per browser before the first fetch",
 "PV-COL-05": "A saved value that is no longer valid falls back to that setting's default",
 "PV-FILT-08": "The Bin multi-select limits the table to parts stocked in those bins",
 "PV-NAV-03": "A loading indicator shows and old rows are replaced only when data returns",
 "PV-PERM-03": "Reports access without Inventory Reports View: entry shows; data denied",
 "PV-ROW-01": "A part stocked at two selected locations shows as two per-location rows",
 "PV-ROW-07": "Description; Category and Vendor truncate on hover; Part # never does",
 "PV-VIS-03": "Dark mode is supported and the grey info icon keeps 3:1 contrast in both",
 "SBC-API-04": "Customer rows are server-paginated; the totals row is server-computed",
 "SBC-CALC-01": "Financial columns run in the specified order with Subtotal and Margin rules",
 "SBC-CALC-03": "Inv. Hrs heading is verbatim; value shows +green / -red / 0.0 on every row",
 "SBC-CUST-06": "Changing the customer selection narrows the table and refreshes the totals",
 "SBC-DATE-04": "Changing the date range writes it into the page link for sharing",
 "SBC-EXP-15": "A no-match export still downloads headers and a zero totals row",
 "SBC-LINK-03": "Customer name is plain text; the invoice link never turns visited-purple",
 "SBC-LINK-04": "An invoice deleted after load shows the not-found state and back returns",
 "SBR-API-03": "Grand totals are server-computed over the full filtered set",
 "SBR-CALC-03": "No-labor-no-time invoices show 0.0; clocked-unbilled work shows negative",
 "SBR-LINK-03": "Browser back from a drilldown restores expansion and scroll; no reload",
 "SBR-NAV-03": "The nav entry fits the full Sales By Representative label; no truncation",
 "SBR-PERS-01": "All filter and view settings are restored before the first data fetch",
 "SBR-PERS-03": "A stale saved value falls back to its default and never errors",
 "SBR-SORT-04": "Sorting reorders rep rows only; Unassigned stays pinned on top",
 "SBR-STAT-01": "Invoice Status offers exactly four options; All Statuses is the default",
 "SBR-TREE-06": "The header chevron expands every visible rep and its glyph tracks state",
 "TU-LINK-06": "A day row's Total Hours links to that technician's single-day timesheet",
 "TU-NAV-02": "One row per technician who clocked time in the range at those locations",
 "TU-NAV-07": "Without the timesheet-reports permission the report is absent from the nav",
 "TU-SORT-05": "Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0",
 "TU-SUM-04": "Summary Est. Lost Labor sums rated contributions; em-dash only if all are",
 "TU-TECH-01": "Filter by Technician starts with every technician selected on a first visit",
 "TU-TECH-04": "Previously deselected technicians stay deselected on the next visit",
 "WIP-API-06": "Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped",
 "WIP-EXP-04": "Inv. Hrs green/red coloring appears on screen and in the PDF; not the CSV",
 "WIP-PERS-04": "A saved setting that is no longer valid falls back to its default",
 "WIP-SCOPE-02": "Invoiced; Paid; Declined and part-sale work orders never appear",
 "WIP-SORT-04": "Sorting reorders only the active tab's rows; Totals stays at the bottom",
 "WIP-TAB-02": "Four tabs in a fixed order with the partially-completed tab selected",
 "WIP-VIS-05": "The WO # link is keyboard-focusable and opens the work order",
 "WIP-VIS-06": "Each summary figure's info icon is keyboard-reachable and screen-read",
 "SBR-PERM-01": "Anyone who can see another Performance report also sees this report",
 "WIP-PERM-02": "Without the permission the report is absent from the reports navigation",
 "IV-CALC-02": "With no fixed sell price Unit Sell is the category's pricing-matrix markup",
 "IV-CALC-05": "Margin is Total Sell minus Total Cost for the whole on-hand quantity",
 "IV-CALC-06": "Margin % is Margin over Total Sell to one decimal; em-dash when Sell <= 0",
 "IV-COL-01": "With every column on they appear in the fixed order with the set alignment",
 "IV-COL-02": "Value formats: Qty on Hand to two decimals; money as US-dollar currency",
 "IV-COL-03": "Total Cost is bold and pinned far right; it stays put on sideways scroll",
 "IV-DATE-04": "For a past date the report replays the closest recorded day on or before it",
 "IV-EXP-07": "An over-cap set produces no file and shows the too-large-to-export message",
 "IV-NAV-02": "One row per in-stock part at the selected locations valued at the resolved date",
 "IV-SCOPE-02": "A part stocked at two selected locations shows as two rows; never merged",
 "IV-SORT-01": "Rows are sorted by Total Cost highest first on load and after any reload",
 "IV-SORT-02": "Header clicks sort ascending then descending; no third state; page 1 returns",
 "IV-TOT-03": "Totals-row Margin % is recomputed from the totals; not an average of rows",
 "IV-VIS-06": "Each sortable header exposes its sort state and shows the direction",
 "IV-VIS-07": "The icon-only download and Column Selection buttons carry accessible names",
 "PV-COL-08": "All 20 columns can be hidden; the empty selection is never restored",
 "PV-EXP-01": "The overflow button opens Download (PDF) then Download (CSV) in that order",
 "PV-EXP-06": "CSV is named velocity-report.csv and holds full untruncated text values",
 "PV-FILT-04": "A Custom date range needs valid dates and rejects a span over 366 days",
 "PV-FILT-12": "Parts with no category; vendor or bin are excluded when that filter is on",
 "PV-PERM-01": "A user with Inventory Reports View can load the report and export it",
 "PV-PERM-02": "Without the Manager or Office User role the report entry is not shown",
 "PV-ROW-10": "A sale invoiced then fully reversed shows Demand 1 with Units Sold 0.00",
 "SBC-API-05": "Exports are server-generated and the 10,000-row cap is counted first",
 "SBC-CALC-02": "Margin % is Margin over Subtotal to one decimal; em dash when Subtotal <= 0",
 "SBC-CALC-04": "Inv. Hrs is never blank: no-labor rows and near-zero values both show 0.0",
 "SBC-CALC-05": "Invoice subtotals sum to their asset row and asset subtotals to the customer",
 "SBC-CALC-06": "Subtotal is the rightmost column; pinned on scroll and bold everywhere",
 "SBC-CALC-07": "The totals row covers the whole filtered set; not just the current page",
 "SBC-COL-01": "Column selector is its own toolbar button with nine toggles all on",
 "SBC-EMPTY-04": "A failed data fetch shows the error toast which fades after 5 seconds",
 "SBC-EXP-04": "CSV formats: Margin % plain; dates mm-dd-yyyy; currency plain; no color",
 "SBC-EXP-05": "CSV and PDF hold exactly the customers matching the active filters and sort",
 "SBC-LINK-02": "Browser back from an invoice restores filters; sort and columns; rows shut",
 "SBC-MOB-01": "On a phone every toolbar control works on touch; the toolbar splits in two",
 "SBC-PERM-03": "Opening an invoice you lack permission for shows access-denied; back works",
 "SBC-PERS-03": "A saved value that is no longer valid is dropped and falls back to default",
 "SBC-PERS-06": "When a saved view and a page-link range clash the saved view wins",
 "SBC-TREE-01": "Each customer gets one summary row with its invoice count in parentheses",
 "SBC-TREE-04": "Expanding an asset reveals its invoice rows with number link and date",
 "SBC-TREE-06": "Asset rows order A to Z with the Parts Sales bucket always last",
 "SBC-TREE-12": "Reversed and voided invoices are excluded from every row; count and total",
 "SBC-VIS-03": "Dark mode darkens every surface while the PDF always renders light",
 "SBR-BADGE-02": "Badge colors use the canonical payment-status tokens in light and dark",
 "SBR-CALC-01": "Inv. Hrs is hours invoiced minus hours worked; half-up to one decimal",
 "SBR-CALC-05": "Margin % to one decimal; em dash when Subtotal <= 0; recomputed on rollups",
 "SBR-CALC-07": "Negative dollar values render in accounting parentheses; money columns only",
 "SBR-COL-03": "Toggling a column applies at once to summary; detail and Totals rows",
 "SBR-DATE-02": "A Custom range uses the date-picker and holds a 366-day maximum span",
 "SBR-DATE-04": "An invoice sits in the range by its own invoice date; endpoints included",
 "SBR-EXP-04": "Expanded View PDF: one page-block per rep with its own totals; no grand",
 "SBR-LOC-01": "Location filter is the rightmost control with an All Locations option",
 "SBR-MOB-02": "On a phone the table scrolls sideways with Subtotal pinned outside it",
 "SBR-PERM-03": "Without staff-administration access the deactivation flow is unreachable",
 "SBR-ROW-03": "A toggled-off or deleted contributor still appears; tagged (Inactive)",
 "SBR-SORT-05": "Ties keep the A to Z order and an em-dash Margin % sorts as zero",
 "SBR-TOT-03": "Mobile shows a simplified totals bar below the table; Subtotal at right",
 "SBR-TREE-05": "Expanding a rep loads its invoices on demand with a row-level spinner",
 "SBR-TREE-07": "Each invoice appears under exactly one rep or the Unassigned row",
 "SBR-TREE-09": "Detail rows run newest first with a numeric invoice-number tie-break",
 "SBR-VIS-01": "Layout: white toolbar; blue-grey page; separator; edge-to-edge white table",
 "SBR-VIS-04": "Chevrons and sortable headers are keyboard-operable and expose their state",
 "TU-DAY-03": "Day rows use the same columns and formats as the technician rows",
 "TU-DAY-04": "One control in the table header expands or collapses all technician rows",
 "TU-EXP-05": "Downloads always order rows Technician A to Z; the on-screen sort is ignored",
 "TU-EXP-08": "A starting download notifies; a failed one shows the failure message",
 "TU-HRS-03": "Utilization % is WO hours over total hours from unrounded values",
 "TU-LINK-02": "The Total Hours link opens Timesheet Activities in the same tab",
 "TU-LOC-04": "Deselecting every location falls back to the active location",
 "TU-SORT-01": "On load rows sort by Technician A to Z with the ascending indicator",
 "TU-SUM-03": "Summary Utilization % is the weighted rate; not an average of the rows",
 "WIP-API-01": "Nightly snapshot records one row per then-open job per calendar date",
 "WIP-CALC-01": "Money columns show US dollars to two decimals with thousands separators",
 "WIP-CALC-03": "Labor Remaining is the approved labor's quoted value minus Labor Earned",
 "WIP-CALC-05": "Parts Remaining values the not-yet-received quantity at its sell price",
 "WIP-CALC-09": "An open estimate with no approved work shows $0.00 in every money column",
 "WIP-COL-04": "Status shows as a color-coded badge whose label text is always present",
 "WIP-COL-07": "Days Open shows whole days since creation and reads 0 days / 1 days",
 "WIP-COL-08": "Last Activity shows Today; Xd ago; or an em-dash when there is none",
 "WIP-EXP-05": "Days Open in a download is frozen at the moment the file is generated",
 "WIP-FLT-01": "The Advisor filter lists the advisors in the loaded jobs; screen only",
 "WIP-FLT-04": "The date range offers the presets plus Custom; This Week default; no All Time",
 "WIP-SCOPE-03": "Each qualifying work order appears exactly once in exactly one tab",
 "WIP-SUM-01": "The summary strip shows seven figures in a fixed order as US dollars",
 "WIP-SUM-07": "Each summary figure's information icon reveals its plain explanation",
 "WIP-TAB-03": "Each tab label shows its work-order count in parentheses",
 "WIP-VIS-02": "The summary strip is a bold band ruled top and bottom above the tabs",
 "WIP-VIS-03": "The Total column is bold and stays pinned right on sideways scroll",
 "WIP-VIS-04": "The Totals row stays visible while only the active tab's body scrolls",
 "IV-COL-04": "On a first visit the default columns show and the rest stay available",
 "IV-SORT-03": "Money and numeric columns sort by value; text columns sort as text",
 "IV-SCOPE-05": "There is no dead-stock exclusion - a slow-moving part still appears",
 "PV-ROW-06": "Info icons sit on Units Sold; Demand and Turns / Yr with descriptions",
 "PV-VIS-02": "Toolbar and table detail styling matches the suite paddings and borders",
 "SBC-API-02": "Sorting is applied on the server and re-fetches the first page",
 "SBC-CUST-09": "A subset customer selection reconciles on a filter change; kept if present",
 "SBC-LINK-01": "The invoice number opens the invoice in the same browser tab",
 "SBC-MOB-02": "On touch the table scrolls sideways with Subtotal pinned and chevrons work",
 "SBC-VIS-01": "Page and toolbar match the suite theme in padding; surface and alignment",
 "SBC-VIS-02": "Row surfaces alternate by tree level; header and totals rows stay white",
 "SBR-API-02": "Sorting is performed server-side and returns the first page",
 "SBR-EXP-16": "An empty-data export still generates with zeroed Summary PDF totals",
 "TU-TECH-03": "Select all and Clear all controls set every technician on or off",
 "TU-LOC-03": "The saved location selection restores defensively; bad ones are dropped",
 "WIP-TOT-02": "The Totals row sums each visible money column and the Inv. Hrs column",
 "WIP-SUM-02": "Total Earned is the hero figure and equals the started-stage figures summed",
 "WIP-SUM-04": "Each per-stage figure equals the matching tab's money total",
 "WIP-VIS-07": "In dark mode every table; strip; link and coloring stays legible",
}


# ---------------------------------------------------------------- 0. de-duplication
# Two duplicate-title groups already existed in the suite (identical titles on 6 cases
# in different report sections) and 2 more would have collided after trimming. A title
# has to make sense on its own, so the report name distinguishes them.
DEDUP = {
 "IV-LOC-04":  "Inventory Value: the Location filter is hidden for a one-location user",
 "PV-FILT-13": "Parts Velocity: the Location filter is hidden for a one-location user",
 "SBR-LOC-04": "Sales By Representative: Location filter hidden for a one-location user",
 "TU-LOC-05":  "Technician Utilization: Location filter hidden for a one-location user",
 "IV-EXP-01":  "Inventory Value: a three-dot menu holds Download (PDF) and Download (CSV)",
 "WIP-EXP-01": "Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV)",
 "IV-PERS-01": "Column Selection toggles columns; Total Cost cannot be turned off",
 "WIP-PERS-01": "Column Selection toggles columns; Total is not offered at all",
}
dedup_log = []
for iid, new in DEDUP.items():
    assert len(new) <= 80, (iid, len(new))
    dedup_log.append({"id": iid, "before": cases[iid]["title"], "after": new,
                      "how": "de-duplicated (identical title on another report's case)",
                      "before_len": len(cases[iid]["title"]), "after_len": len(new),
                      "lost_words": []})
    cases[iid]["title"] = new

log, needs_expected, dups = [], [], []
for iid in sorted(cases):
    c = cases[iid]
    t0 = c["title"]
    if len(t0) <= CAP:
        continue
    if iid in HAND:
        new = HAND[iid]
        how = "hand-written"
    else:
        s = t0
        for pat, rep in COMPRESS:
            s = re.sub(pat, rep, s)
        s = re.sub(r"\s{2,}", " ", s).strip()
        if len(s) <= CAP:
            new, how = s, "compressed"
        else:
            cut = None
            for m in BOUND.finditer(s):
                if 30 <= m.start() <= CAP:
                    cut = m.start()
            if cut is None:                       # no boundary: last word before the cap
                cut = s.rfind(" ", 0, CAP + 1)
            cand = s[:cut].rstrip(" ,;:-—.")
            # reject a dangling connective / unbalanced quote
            last = cand.split()[-1].lower().strip('"()')
            if last in STOP or cand.count('"') % 2 or len(cand) < 30:
                cand = None
            assert cand, "%s needs a HAND entry: %s" % (iid, t0)
            new, how = cand, "clause-cut"
    assert len(new) <= CAP, (iid, len(new))
    assert len(new) >= 30, (iid, len(new))
    # the dropped detail must survive somewhere the tester reads
    dropped = sig(t0) - sig(new)
    body = " ".join(c.get("steps", []) + c.get("expected", []) + c.get("preconditions", []))
    lost = sorted(w for w in dropped if w not in body.lower())
    if lost:
        needs_expected.append({"id": iid, "before": t0, "after": new, "lost": lost})
    log.append({"id": iid, "before": t0, "after": new, "how": how,
                "before_len": len(t0), "after_len": len(new), "lost_words": lost})
    c["title"] = new

# uniqueness across the WHOLE suite
seen = collections.defaultdict(list)
for iid, c in cases.items():
    seen[c["title"].strip().lower()].append(iid)
dups = {k: v for k, v in seen.items() if len(v) > 1}
assert not dups, dups

for f, lst in data.items():
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")
json.dump(dedup_log + log, open(os.path.join(OUT, "title-trim-log.json"), "w"), indent=1, ensure_ascii=False)
json.dump(needs_expected, open(os.path.join(OUT, "title-trim-detail-check.json"), "w"), indent=1, ensure_ascii=False)
print("titles trimmed:", len(log))
print(" by method:", collections.Counter(e["how"] for e in log))
print("longest title now:", max(len(c["title"]) for c in cases.values()))
print("titles still > 80:", sum(1 for c in cases.values() if len(c["title"]) > CAP))
print("cases whose dropped words are NOT already in steps/expected:", len(needs_expected))
for e in needs_expected[:40]:
    print("   ", e["id"], e["lost"], "|", e["after"])
