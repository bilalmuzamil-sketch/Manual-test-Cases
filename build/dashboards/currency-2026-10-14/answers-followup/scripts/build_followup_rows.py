"""Follow-up rows after Chris Ward's 15 answers (14 Oct 2026). Same row shapes as notify/sheet-data.json.
"Before" columns are copied word for word by script from snapshots-after-answers/ (identical to snapshots-before/:
0 of 106 cases changed between the two snapshots)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from case_text import load
C = load("snapshots-after-answers")
OLD = json.load(open("notify/sheet-data.json"))

SPEC = "https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard"
DIFF = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions={}&selectedPageVersions={}"
D45, D44, D43 = DIFF.format(44, 45), DIFF.format(43, 44), DIFF.format(42, 43)
QSHEET = "https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit"
RN = "https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=931069964"
RNDIFF = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=931069964&selectedPageVersions=5&selectedPageVersions=7"
TR = "https://shopview.testrail.io/index.php?/cases/view/"
ATM = {3: "Yes (automated)", 4: "Waiting to be automated", 1: "No (manual)"}

def link(cid): return f'=HYPERLINK("{TR}{cid}","C{cid}")'
def spec(story): return f'=HYPERLINK("{SPEC}","Dashboard spec, {story}")'
def exp(cid, starts):
    out = [e for e in C[cid]["exp_plain"] if any(e.startswith(s) for s in starts)]
    assert len(out) == len(starts), (cid, starts, out)
    return "\n".join(out)
def steps(cid, nums):
    s = C[cid]["steps"]
    return "\n".join(f"{n}. {s[n-1]}" for n in nums)
def when(story, codes, q):
    return (f"Dashboard spec, {story}, {codes}, added in version 45 on 14 Oct 2026 by Chris Ward, in answer to our "
            f"question {q} of 14 Oct (his answer sheet, same day). The spec's change log, filled in later the same day "
            f"(version 46), lists it under 2026-10-14. Page change: {D45}")
WHEN_TABLE_NEW = ("Dashboard spec, version 44, Story 8 (rules S8-R5a and S8-N1a), saved on 13 Oct 2026 (13:37 UTC) by Chris Ward with the "
                  "note \"the table follows the chart filter (Ayesha)\". The spec's change log, filled in on 14 Oct (version 46), lists it "
                  f"under 2026-10-13. Page change: {D44}. Before that (version 42, 7 Oct) the spec said only that the chart reloads.")

update = []
# 1 C88628 — one inactivity control
update.append([link("88628"), C["88628"]["title"], ATM[C["88628"]["atm"]],
 "The At Risk Customers panel no longer has its own \"Inactive for\" box. The only inactivity control is the pill on the At Risk Customers tile, and the table follows it.",
 "A correct build shows no \"Inactive for\" box at the top right of the At Risk Customers panel. Today's expected result asks for that box, so it would fail a correct build.",
 when("Story 5", "rule S5-N3", 10),
 exp("88628", ["At Risk Customers: a table titled"]),
 "At Risk Customers: a table titled \"At Risk Customers\" with columns Customer, Last Invoice Date, Lifetime Invoices, Revenue (12 Mo). There is no \"Last Work (Days)\" column. (unchanged)\n"
 "At Risk Customers: the panel has no inactivity control of its own: no \"Inactive for\" box at its top right or anywhere else in the panel. The days are chosen only with the pill on the At Risk Customers tile. (new)",
 steps("88628", [5]),
 "5. Read the panel title and the column headings, and look for any control in the panel for choosing the number of days.",
 "That the table follows the tile's pill is already checked by C88609 (\"Changing the window updates … the open table together\"). The rest of this case is unchanged.",
 spec("Story 5")])

# 2 C351714 — At Risk at zero
update.append([link("351714"), C["351714"]["title"], ATM[C["351714"]["atm"]],
 "The spec now says what the line under the At Risk number reads when no customer is at risk: \"$0.00 (12mo) · 0 customers\". The line never disappears.",
 "Today the case only asks the tester to write down the line, so a build that drops the line or shows other words would still pass. The tester now checks the exact words.",
 when("Story 5", "rule S5-R9 (reworded)", 9),
 exp("351714", ["Step 2: The supporting lines do not change"]),
 "Step 2: The At Risk Customers supporting line reads exactly \"$0.00 (12mo) · 0 customers\". It is not empty and not hidden.\n"
 "Step 2: The Sales by Customer supporting line is not changed by the outline: write down what you see. (unchanged)",
 steps("351714", [2]), "2. Read both headlines and their supporting lines. (unchanged)",
 "The rest of the case is unchanged.", spec("Story 5")])

# 3 C351723 — dashboard legend hover, no average
update.append([link("351723"), C["351723"]["title"], ATM[C["351723"]["atm"]],
 "Hovering a name in a chart legend now shows that person's most recent value and its month only. There is no average.",
 "A correct build shows, for example, \"120% · Aug 2026\" with no \"avg\". Today's case expects an average, so it would fail a correct build and pass the build as it is now (which still shows \" · avg\", per Chris Ward on 14 Oct).",
 when("Story 9", "rule S9-R10", 12),
 exp("351723", ["Step 4: The box shows", "Step 7:", "Steps 4 and 6:"]),
 "Step 4: The box shows the person's name, their most recent value and the month it is from (for example the advisor's name, 120%, Aug 2026). It shows no average: no \"avg\" figure anywhere in the box.\n"
 "Step 7: The same box, with no average, appears for names on the Technician Efficiency and Technician Utilization legends.\n"
 "(Remove the old \"Steps 4 and 6\" result: there is no average to compare with the table any more.)",
 steps("351723", [6]),
 "6. (Remove this step: there is no average to compare with the table.)",
 "The title should lose \"and average\", for example \"Hovering a name in a dashboard chart legend shows the latest value and month\". The result for steps 4 and 5 (the value and month match the last point) is unchanged. Chris Ward asked for a bug about the average the build shows today; that is with the QA lead.",
 spec("Story 9")])

# 4 C351734 — report legend hover, no average
update.append([link("351734"), C["351734"]["title"], ATM[C["351734"]["atm"]],
 "Hovering a name in a report chart legend now shows that person's most recent value and its month only. There is no average.",
 "Same change as on the dashboard charts: the box reads, for example, \"120% · Aug 2026\" with no \"avg\". Today's case expects an average, so it would fail a correct build.",
 when("Story 9", "rule S9-R10 (it covers every chart legend; the report pages show the same charts)", 12),
 exp("351734", ["Step 2: The box shows", "Steps 4 and 5:", "Steps 2 to 5:"]),
 "Step 2: The box shows the person's name, their most recent value and the month it is from (for example the advisor's name, 120%, Aug 2026). It shows no average.\n"
 "Steps 4 and 5: The same box, with no average, appears on the Technician Efficiency and Technician Utilization report charts (for example the technician's name, 70%, Aug 2026).\n"
 "(Remove the old \"Steps 2 to 5\" result: there is no average to write down or compare.)",
 steps("351734", [2]), "2. Hover one advisor's name in the legend above the chart (any advisor in the list) and read the box that appears. (unchanged)",
 "The title should lose \"and average\". The result for step 3 is unchanged.", spec("Story 9")])

# 5 C88606 — no 731/732-day custom range on a tile
update.append([link("88606"), C["88606"]["title"], ATM[C["88606"]["atm"]],
 "A tile's calendar now allows a custom range of at most 366 days, so the 731-day and 732-day ranges in step 4 cannot be picked on a tile.",
 "On a correct build the calendar will not accept 731 or 732 days, so step 4 cannot be done and the case would fail or stall on a correct build.",
 when("Story 7", "rule S7-R2a", 3),
 exp("88606", ["731 days still draws"]),
 "(Remove this result. The switch from weekly to monthly points is still checked at 182 and 183 days in step 3. The switch to quarterly points can no longer be reached from a tile.)",
 steps("88606", [4]),
 "4. (Remove this step: a tile's calendar allows at most 366 days.)",
 "The preconditions ask for invoices over the last two years \"for the long custom ranges\"; one year is now enough. The rest of the case is unchanged.",
 spec("Story 7")])

# 6 C88647 — same, manual twin
update.append([link("88647"), C["88647"]["title"], ATM[C["88647"]["atm"]],
 "A tile's calendar now allows a custom range of at most 366 days, so the 731-day and 732-day ranges in step 4 cannot be picked on a tile.",
 "On a correct build the calendar will not accept 731 or 732 days, so step 4 cannot be done.",
 when("Story 7", "rule S7-R2a", 3),
 exp("88647", ["Step 4:"]),
 "(Remove this result. The switch to monthly points is still checked at 183 days in step 3; the switch to quarterly points can no longer be reached from a tile.)",
 steps("88647", [4]),
 "4. (Remove this step: a tile's calendar allows at most 366 days.)",
 "The note \"Steps 1 to 4: If the trend line shows no dates…\" then covers steps 1 to 3. The preconditions' \"more than two years of invoices\" can become one year. The rest is unchanged.",
 spec("Story 7")])

# 7 C351729 — custom range always reachable now
update.append([link("351729"), C["351729"]["title"], ATM[C["351729"]["atm"]],
 "The tile's date picker now officially offers a calendar for a custom range, and a report opened from a tile on a custom range shows \"Custom\".",
 "Today the case lets the tester mark it Blocked if the tile calendar does not let them pick their own days. Picking your own days is now required, so a build without it must fail, not be Blocked.",
 when("Story 7", "rule S7-R2a", 3),
 exp("351729", ["Steps 1 to 4:"]),
 "Steps 1 to 4: The tile's calendar lets you pick your own start day and end day (any range up to 366 days). If it does not, the case fails.",
 steps("351729", [4]),
 "4. Open the Revenue tile's calendar, pick a start day and an end day yourself (for example Aug 3, 2026 to Aug 17, 2026) and click Apply. Do this whatever steps 1 to 3 found.",
 "The step 6 results (same dates, the Date control shows Custom) are unchanged and are now stated in the spec in so many words.",
 spec("Story 7")])

# 8 C351708 — expanded Revenue chart on This Month, empty location
update.append([link("351708"), C["351708"]["title"], ATM[C["351708"]["atm"]],
 "The expanded Revenue chart now follows the tile's date range: on This Month it shows one bar per day, not months. An expanded chart with nothing to show reads \"No data for selected date range\".",
 "Today's step 4 expects \"month labels\" under the chart. On This Month a correct build shows days, not months, so the case would fail a correct build. What the chart shows for a location with no sales at all is not yet clear (see note).",
 "Dashboard spec, Story 6 rule S6-R3a and Story 9 rule S9-R11, both added in version 45 on 14 Oct 2026 by Chris Ward (answers to our questions 5 and 15). Change log row 2026-10-14 (version 46). Page change: " + D45,
 exp("351708", ["Step 4:"]),
 "Step 4: The Revenue chart in the expanded panel does not turn into the dashed outline with the chart icon. (unchanged)\n"
 "Step 4: It covers This Month day by day: it does not show month labels. (new)\n"
 "Step 4: Whether it shows an empty day-by-day chart or the words \"No data for selected date range\" is waiting on Chris Ward (new question). Until he answers, write down which one you see and do not fail on it.",
 steps("351708", [4]), "4. Click View details on the Revenue tile and look at the Revenue chart that opens. (unchanged)",
 "The rest of the case is unchanged.", spec("Story 6")])

# ---------- new tests ----------
SIGNED = "Signed in as a user whose role has the Reports permission (for example Admin).\nA desktop browser window at least 1024 pixels wide, at 100% zoom."
new = []
new.append(["A tile's trend line that never changes is drawn flat along the bottom",
 "The spec now says a tile's trend line shows direction, not level: each tile scales its line between its own lowest and highest point, so a figure that never changes is a flat line along the bottom, whatever the figure is. No case checks this.",
 when("Story 4", "rule S4-R11b", 1),
 SIGNED + "\nA location where, this month, every technician's clocked time is on work orders only (no internal time) on at least two different days, so Technician Utilization is 100% on every day with clocked time (for example ZZAUTOTEST Flat Shop).\nThe same location has invoices this month on at least two days with different totals (for example $100.00 on one day and $400.00 on another).",
 "1. Click Dashboard in the top bar (all tiles on This Month).\n2. Read the Technician Utilization headline.\n3. Look at the Technician Utilization trend line.\n4. Look at the Revenue trend line.",
 "Step 2: The headline reads 100.00%.\nStep 3: The trend line is drawn as a flat line along the bottom of the trend area, not in the middle and not at the top. It is not the dashed empty-chart outline.\nStep 4: The Revenue line uses the whole height of the trend area: its lowest day touches the bottom and its highest day touches the top.",
 link("351709"), "The value scale of the expanded charts (starting at 0) does not apply to the small trend line on a tile."])
new.append(["A tile's date picker offers a custom range of up to 366 days and Today in the calendar",
 "The spec now says the tile uses the reports' date picker: the nine presets, plus a calendar for a custom range of up to 366 days with a Today button inside the calendar (not a tenth preset). A custom range is not remembered between visits. No case checks Today, the 366-day limit or that a custom range is forgotten.",
 when("Story 7", "rule S7-R2a", 3),
 SIGNED + "\nAny location with Reports data (for example the location you normally test in).",
 "1. Click Dashboard in the top bar.\n2. Click the Revenue tile's date pill and read the list of presets.\n3. Find the Today button and click it, then click Apply.\n4. Read the Revenue pill and headline.\n5. Open the Revenue pill again, pick a start day and an end day 366 days apart (the readout at the bottom reads \"Range: 366 days\") and click Apply.\n6. Open the pill again and try to pick a range one day longer (\"Range: 367 days\").\n7. Close the browser tab, open the site again in the same browser and click Dashboard.\n8. Read the Revenue pill.",
 "Step 2: The presets are the nine named ones (Last 12 Months to Last Week). Today is not one of them.\nStep 3: The Today button sits inside the calendar.\nStep 4: The pill shows today's date only (for example \"Oct 14, 2026 - Oct 14, 2026\") and the headline equals the Sales report total for today.\nStep 5: The 366-day range is accepted and the tile shows it.\nStep 6: A range longer than 366 days cannot be applied.\nStep 8: The pill reads This Month again: the custom range was not remembered.",
 link("88617"), "C88617 checks the nine presets and C351729 checks that a report opened on a custom range shows Custom. C557284 already uses Today on a phone."])
new.append(["At Risk table: a customer's revenue link opens a Sales report with the same total",
 "The spec now says a customer's twelve-month revenue in the At Risk Customers table is a link to the Sales report for that customer over the same twelve months, so the report total equals the amount, and that a walk-in row or a $0.00 amount is plain text. C540783 checks the link and the customer filter, but not the total or the plain-text rows.",
 when("Story 6", "rule S6-R8a", 4),
 SIGNED + "\nA location with at-risk customers on the 120-day window, including:\n- a customer with Revenue (12 Mo) above $0.00 (for example ZZAUTOTEST Risk Fleet at $1,250.00), called {Customer-A};\n- a customer with Revenue (12 Mo) of $0.00 and two or more lifetime invoices, called {Customer-B};\n- if your location has one, the walk-in (no company) row.",
 "1. Click Dashboard in the top bar and click View details on At Risk Customers.\n2. Write down {Customer-A}'s Revenue (12 Mo).\n3. Click {Customer-A}'s Revenue (12 Mo) amount.\n4. Read the Sales report's customer filter, its dates and its Totals row Subtotal.\n5. Go back to the Dashboard and open the At Risk Customers details again.\n6. Point at and click {Customer-B}'s $0.00 amount.\n7. Point at and click the walk-in row's amount, if there is one.",
 "Step 4: The Sales report is filtered to {Customer-A} only, over the twelve months the amount covers (from the 1st of the month eleven months back to today), and its Totals row Subtotal equals the amount from step 2, to the cent.\nStep 6: The $0.00 amount is plain text: the pointer does not change to a hand and clicking does nothing.\nStep 7: The walk-in amount is plain text in the same way. If your location has no walk-in row, write 'walk-in row not reachable by hand' in the result comment.",
 link("540783"), "Which twelve months the amount covers is taken from the spec's \"Last 12 months\" window, which every report the dashboard links to uses."])
new.append(["The expanded Revenue chart follows the Revenue tile's date range",
 "The spec now says the expanded Revenue chart covers the tile's own date range, with one bar per day, week, month or quarter by the same rule as the trend line: This Month shows daily bars, Last 12 Months twelve monthly bars. No case checks a range other than Last 12 Months.",
 when("Story 6", "rule S6-R3a", 5),
 SIGNED + "\nA location with invoices on several days this month, last quarter and over the last twelve months.",
 "1. Click Dashboard in the top bar (Revenue on This Month) and click View details on Revenue.\n2. Read the labels along the bottom of the Revenue chart and count the bars.\n3. Set the Revenue pill to Last Quarter.\n4. Read the chart's labels and count the bars.\n5. Set the Revenue pill to Last 12 Months.\n6. Read the chart's labels and count the bars.",
 "Step 2: One bar per day of this month, labelled by day, not by month.\nStep 4: One bar per week (about 13 bars) for the three months of last quarter.\nStep 6: Twelve bars, one per month, from the 1st of the month eleven months back to this month (for example Nov 2025 to Oct 2026).\nSteps 2, 4 and 6: The bars always add up to the Revenue headline for the same range.",
 link("88612"), "C88612 and C351724 use Last 12 Months only; C88650 already adds up the This Month bars."])
new.append(["An expanded chart joins the months either side of an empty month with a dashed line",
 "The spec now says that in an expanded chart a month with no value is drawn as a dashed line joining the points either side of it. A gap is only for the small trend line on a tile. No case checks an empty month in an expanded chart.",
 when("Story 9", "rule S9-R9", 6),
 SIGNED + "\nA location where one technician (for example ZZAUTOTEST Tech Gap) has clocked time on invoiced work in two months of the last twelve with no clocked time in the month between (for example July and September, nothing in August).",
 "1. Click Dashboard in the top bar.\n2. Set the Technician Efficiency pill to Last 12 Months and click View details.\n3. Find that technician's line and look at it across the empty month.",
 "Step 3: A dashed line joins the technician's points either side of the empty month. The line does not break and does not drop to zero at that month.",
 link("88606"), "C88606 and C88647 check the gap on the small trend line, which stays a gap."])
new.append(["An expanded chart with nothing to show reads \"No data for selected date range\"",
 "The spec now says an expanded chart with nothing to show reads \"No data for selected date range\", and that the dashed empty-chart outline is only for the small trend line on a tile. No case checks an expanded dashboard chart with no data.",
 when("Story 9", "rule S9-R11", 15),
 SIGNED + "\nA location with no clocked time and no invoices (for example ZZAUTOTEST Empty Shop).",
 "1. Click Dashboard in the top bar with that location selected.\n2. Click View details on Technician Efficiency and read the chart area.\n3. Click View details on Billing Efficiency and read the chart area.",
 "Steps 2 and 3: The chart area reads \"No data for selected date range\". It does not show the dashed outline with the chart icon, and it shows no error.",
 link("433976"), "C433976 and C137997 already expect the same words on the report pages. For the Revenue chart see C351708 (waiting on Chris Ward)."])
new.append(["Technician tiles with no data keep their report link",
 "Chris Ward confirmed on 14 Oct that every tile keeps its report link, with or without data, and that the empty-tile drawing without the link is wrong. No case checks the report link on a tile that has no data.",
 "Dashboard spec, Story 10 and Story 4 (rules S10-R1 and S4-R18), unchanged since version 42 (7 Oct 2026); confirmed by Chris Ward's answer 7 on our question sheet, 14 Oct 2026: \"No PRD change: every tile keeps its report link with or without data\".",
 SIGNED + "\nA location with no clocked time this month (for example ZZAUTOTEST Empty Shop).",
 "1. Click Dashboard in the top bar with that location selected.\n2. Look beside the names of the Technician Efficiency and Technician Utilization tiles.\n3. Point at the report icon on Technician Efficiency and read the tooltip, then click it.\n4. Go back and do the same on Technician Utilization.",
 "Step 2: Both tiles show the grey \"-\" and the dashed outline, and both still show the report icon beside their name.\nSteps 3 and 4: The tooltip names the report and clicking opens it: Technician Efficiency and Technician Utilization.",
 link("88623"), "C88623 checks the report links on tiles with data."])
new.append(["The dashboard shows no \"Last updated\" line",
 "The spec now says the dashboard shows no \"Last updated\" line or any other sign of how fresh the figures are, because they are never behind the reports. The design still shows such a line, so a build could add it. No case checks this.",
 when("Story 3", "rule S3-N2", 11),
 SIGNED,
 "1. Click Dashboard in the top bar and wait for all six tiles to load.\n2. Read the whole page, from the top bar to below the last tile, and open View details on any tile.",
 "Step 2: Nowhere on the page is there a \"Last updated\" line, a time such as \"3 minutes ago\", or any other note about when the figures were refreshed.",
 link("88652"), ""])
LAY = "Dashboard spec, Story 12, rule {} (one rule per defect ticket {}), added in version 45 on 14 Oct 2026 by Chris Ward, in answer to our question 13 of 14 Oct. Change log row 2026-10-14 (version 46). Page change: " + D45
new.append(["A report opened from a tile shows its Date filter panel once, with no jump",
 "The spec now makes the fix for ticket SV-10891 a rule: a report opened from a tile opens its Date filter panel once, in its final position, the same as from the Reports menu. No case checks it.",
 LAY.format("S12-R6", "SV-10891"), SIGNED,
 "1. Click Dashboard in the top bar.\n2. Click the report icon beside Revenue and watch the Date filter panel as the Sales report opens.\n3. Click Reports in the top bar, click Sales, and watch the Date filter panel as it opens.",
 "Step 2: The Date filter panel appears once, already in its final place. It does not appear somewhere else first and then jump.\nStep 3: It behaves the same way as in step 2.",
 "", ""])
new.append(["On a 1536 x 864 screen a report shows table rows under its chart, and only the rows scroll",
 "The spec now makes the fixes for tickets SV-10933 and SV-10934 rules: at 1536 x 864 and 100% zoom a report showing its chart still shows table rows and lets you scroll through them, and scrolling the table moves only the rows. C433976 checks the space under the chart at a smaller window, but not the scrolling.",
 LAY.format("S12-R7 and S12-R8", "SV-10933 and SV-10934"),
 "Signed in as a user whose role has the Reports permission (for example Admin).\nA browser on a 1536 x 864 screen at 100% zoom, window maximised.\nA location with more Technician Efficiency rows this month than fit on the screen.",
 "1. Click Reports in the top bar, then Technician Efficiency, with the chart shown (the control reads Hide chart).\n2. Look under the chart.\n3. Scroll the table with the pointer over its rows.",
 "Step 2: Table rows are visible under the chart, without zooming out or hiding the chart.\nStep 3: Only the table rows move. The chart and the filters stay where they are.",
 link("433976"), ""])
new.append(["An open date picker on a tile stays with its tile",
 "The spec now makes the fix for ticket SV-10936 a rule: an open tile date picker never floats away from its tile, and scrolling with the pointer over it does not scroll the page. No case checks it.",
 LAY.format("S12-R9", "SV-10936"), SIGNED,
 "1. Click Dashboard in the top bar.\n2. Click the Revenue tile's date pill so the picker opens.\n3. With the pointer over the open picker, scroll the mouse wheel up and down.",
 "Step 3: The page does not scroll, and the picker stays attached under the Revenue tile's pill.",
 "", ""])
new.append(["A chart filter list that opens upward never covers the top menu bar",
 "The spec now makes the fix for ticket SV-11242 a rule: a chart filter list that opens upward stays below the top menu bar, for example by being shorter and scrolling inside. No case checks it.",
 LAY.format("S12-R10", "SV-11242"),
 "Signed in as a user whose role has the Reports permission (for example Admin).\nA browser on a 1536 x 864 screen at 100% zoom.\nA location with at least ten technicians with clocked time this month.",
 "1. Click Dashboard in the top bar and click View details on Technician Efficiency.\n2. Scroll the page until the chart's Technician filter button is near the bottom of the window.\n3. Click the filter button so the list opens upward.",
 "Step 3: The list stays below the top menu bar and does not cover any of it. If it is too tall it is shorter and scrolls inside.",
 link("88619"), ""])
new.append(["In the dark theme the tile date picker is fully dark",
 "The spec now makes the fix for ticket SV-11245 a rule: in the dark theme the whole tile date picker is dark, with near-white presets, range text and buttons, like the report date filters. C351736 checks the tile text only, not the open picker.",
 LAY.format("S12-R11", "SV-11245"),
 SIGNED + "\nThe dark theme switched on (profile icon > dark theme switch).",
 "1. Click Dashboard in the top bar.\n2. Click the Revenue tile's date pill.\n3. Look at the whole picker: presets, calendar, range text and buttons.\n4. Click Reports > Sales and open its Date filter for comparison.",
 "Step 3: Every part of the picker is dark, with near-white presets, range text and buttons. No white panel or dark-on-dark text.\nStep 4: The tile picker looks the same as the report's date filter.",
 link("351736"), ""])
new.append(["On a phone every tile's date button opens its picker after scrolling",
 "The spec now makes the fix for ticket SV-11246 a rule: on a small screen every tile's date button opens its picker however far the page is scrolled. No case checks it.",
 LAY.format("S12-R12", "SV-11246"),
 "Signed in as a user whose role has the Reports permission (for example Admin).\nA phone, or a browser window narrower than 1024 pixels (for example 390 x 844).",
 "1. Open the Dashboard.\n2. Scroll down to the Sales by Customer tile and tap its date button.\n3. Close the picker, scroll back up to the Revenue tile and tap its date button.",
 "Steps 2 and 3: Each time the picker opens, next to the tile, wherever the page was scrolled.",
 link("557284"), "C557284 already covers the last layout rule (no sideways scrolling on a phone, SV-11255)."])

# ---------- resolved hold rows ----------
H = {r[0]: r for r in OLD["hold"]}
resolved = [
 ["Flat trend line: where it sits in the tile", "Answer 1", "new test",
  "The spec now says a flat line sits along the bottom whatever the figure (changed in the spec on 14 Oct). No case expects it at its real level, so no case changes; a new test checks it."],
 ["\"Today\" and a custom date range on a tile", "Answer 3", "moved to update + new test",
  "Both are now in the spec (changed in the spec on 14 Oct). C557284 needs no change. C351729 must stop allowing Blocked; C88606 and C88647 cannot pick 731/732 days any more (limit 366). A new test checks Today, the 366-day limit and that a custom range is forgotten."],
 ["At Risk table: 12-month revenue opens the Sales report", "Answer 4", "new test",
  "Now in the spec (changed in the spec on 14 Oct). C540783 already matches and needs no change. A new test checks that the report total equals the amount and that $0.00 and walk-in amounts are plain text."],
 ["Expanded Revenue chart shows monthly bars", "Answer 5", "moved to update + new test",
  "The chart follows the tile's range (changed in the spec on 14 Oct): twelve monthly bars on Last 12 Months, daily bars on This Month. C88612 sets Last 12 Months first, so it needs no change. C351708 expects month labels on This Month and moves to update. A new test checks other ranges."],
 ["Expanded charts: months with no value", "Answer 6", "new test",
  "A dashed line joins the months either side (changed in the spec on 14 Oct). No case checks an expanded chart's empty month; the tile trend-line gap cases stay as they are."],
 ["Report link on the technician tiles when they have no data", "Answer 7", "new test",
  "No spec change: every tile keeps its report link with or without data; the drawing is wrong. C88623 needs no change. A new test checks the link on the two technician tiles with no data."],
 ["At Risk at zero customers: the line under the number", "Answer 9", "moved to update",
  "The line reads \"$0.00 (12mo) · 0 customers\" (changed in the spec on 14 Oct). C351714 moves to update."],
 ["Legend hover: the average shown", "Answer 12", "moved to update",
  "No average (changed in the spec on 14 Oct). C351723 and C351734 move to update."],
 ["\"No data for selected date range\" on report charts", "Answer 15", "no change needed + new test",
  "Now in the spec for report charts and expanded charts (14 Oct). C433976 and C137997 already expect these words and need no change. A new test checks an expanded dashboard chart with no data."],
]
for r in resolved[:8]: assert r[0] in H, r[0]

# ---------- corrections to rows already sent ----------
old_upd = {r[0]: r for r in OLD["update"]}
old_new = {r[0]: r for r in OLD["new"]}
L88632 = '=HYPERLINK("https://shopview.testrail.io/index.php?/cases/view/88632","C88632")'
L88620 = '=HYPERLINK("https://shopview.testrail.io/index.php?/cases/view/88620","C88620")'
NEWQUOTE = ("\"Sales report totals can change for some past dates. Voided invoices are no longer counted, which lowers a total, and invoices "
            "with no customer attached are now included, which raises one. A voided invoice that was invoiced again counts only the new "
            "amount. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect "
            "questions about this.\"")
corr = []
o = old_upd[L88632]
corr.append(["Test cases to update", "C88632", "What a tester now sees differently", o[4],
 "The published note now says totals \"can change\": voided invoices lower a total, invoices with no customer raise one, and a voided invoice that was invoiced again counts only the new amount. Step 14 should check these points.",
 f"Chris Ward changed both release-notes pages on 14 Oct 2026 (15:07 UTC), in answer to our question 2. Page change: {RNDIFF}"])
corr.append(["Test cases to update", "C88632", "Where this comes from, and when it changed", o[5],
 "Release notes page on Confluence, written by Chris Ward: first published 9 Oct 2026 (10 Oct local time); the Dashboard note was changed on 14 Oct 2026 (15:07 UTC) after our question 2. The Dashboard spec (all versions) says only that the change \"ships with a release note\". Page change: " + RNDIFF,
 "The note we quoted was replaced the same afternoon."])
corr.append(["Test cases to update", "C88632", "Expected behaviour now", o[7],
 "Step 14: The release notes carry one plain-language note naming both corrections. It says totals can change, that voided invoices are no longer counted (which lowers a total), that invoices with no customer are now included (which raises one), and that a voided invoice that was invoiced again counts only the new amount. The published note reads: " + NEWQUOTE,
 "The quoted words in the row we sent are no longer on the page."])
corr.append(["Test cases to update", "C88632", "Note", o[10],
 "Chris Ward answered question 2 on 14 Oct: the note now covers totals going up as well as down. Only the \"Release notes\" part of the page changed; the pre-release and release-day email copy on the same page still say only that totals will be lower, which step 14 does not check.",
 "The question is answered."])
o = old_upd[L88620]
corr.append(["Test cases to update", "C88620", "Note", o[10],
 "Section 7 of the spec (\"User Feedback Summary\") now says the chart and the table under it are hidden together (changed 14 Oct 2026, version 45, after our question 14).",
 "Chris Ward made the tidy-up on 14 Oct."])
for cid in ["88619", "88620", "351717"]:
    o = old_upd[f'=HYPERLINK("{TR}{cid}","C{cid}")']
    corr.append(["Test cases to update", f"C{cid}", "Where this comes from, and when it changed", o[5], WHEN_TABLE_NEW,
                 "The spec's page history and its change log (filled in on 14 Oct) now give the exact date, so the Slack message is no longer the only source for it."])
for title in ["Unticking every technician on the Technician Utilization chart hides the chart and its table",
              "The table still follows a remembered technician or advisor choice on your next visit"]:
    o = old_new[title]
    corr.append(["New test cases needed", title, "Where this comes from, and when it changed", o[2], WHEN_TABLE_NEW, "Same as above."])
t = "On the Revenue tile, days with no sales between two sales days are drawn at $0, not as a gap"
o = old_new[t]
corr.append(["New test cases needed", t, "Where this comes from, and when it changed", o[2],
 "Dashboard spec, Story 4, rule S4-R11a, added in version 43 on 9 Oct 2026 (15:41 UTC) by Chris Ward with the note \"no-sales bucket is a 0 point (SV-11076)\". The change log (filled in on 14 Oct, version 46) lists it under 2026-10-09. Chris Ward's comment on Jira SV-11076, 9 Oct 2026: \"A day with no sales is a real $0 on Revenue, not a missing value … I'm adding a line to the PRD to make this explicit (S4-R11a).\" Page change: " + D43,
 "The exact version and date are now known from the page history (we had \"version 43 or 44\")."])
corr.append(["Need product decision first", "all 9 rows", "whole tab", "9 possible tests waiting on Chris Ward",
 "Every row is answered: see \"resolved_hold\" for what each one becomes.", "Chris Ward answered all 15 questions on 14 Oct 2026."])

po_new = [["Expanded Revenue chart when there are no sales at all",
 "When a location has no sales at all in the Revenue tile's range (for example an empty location on This Month) and you open the Revenue details, what should the chart show?\n(a) The words \"No data for selected date range\", like the other expanded charts with nothing to show.\n(b) An empty day-by-day chart (the axis and day labels, with no bars), because $0.00 is a real amount on Revenue.",
 "The new rule for expanded charts says a chart \"with nothing to show\" reads \"No data for selected date range\". Another rule says a day with no sales is a real $0 on Revenue. We cannot tell which applies when every day is $0.00. One test case (C351708) waits on this.",
 "", f'=HYPERLINK("{SPEC}","Dashboard spec, version 46, Story 6 and Story 9")']]

out = {"update": update, "new": new, "resolved_hold": resolved, "corrections": corr, "po_new": po_new}
json.dump(out, open("answers-followup/followup-rows.json", "w"), indent=1, ensure_ascii=False)
print({k: len(v) for k, v in out.items()})
# verbatim check of "before" columns against the original before-snapshot conversion
B = load("snapshots-before")
for r in update:
    cid = r[0].split('","C')[1].rstrip('")')
    for line in r[6].split("\n"): assert line in B[cid]["exp_plain"], (cid, line)
    for line in r[8].split("\n"):
        n, txt = line.split(". ", 1); txt = txt.replace(" (unchanged)", "")
        assert B[cid]["steps"][int(n)-1] == txt, (cid, line)
print("before-columns verbatim: OK", len(update))
