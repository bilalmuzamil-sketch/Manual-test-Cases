"""Build the Dashboard Currency Check V2 sheet contents (14 Oct 2026).

"Before" columns are copied word for word from the case snapshots taken before anything else (snapshots-before/).
Output: sheet-data.json = {tab name: [rows]} for the QA file and the PO file.
"""
import json, os

D = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(D, "cases-text.json")))

SPEC = "https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard"
SLACK_TABLE = "https://shopview.slack.com/archives/C0C45KCLS92/p1791898668424119"
SLACK_FLAT = "https://shopview.slack.com/archives/C0C45KCLS92/p1791501415388399"
SLACK_VLAD = "https://shopview.slack.com/archives/C0C45KCLS92/p1791363351987959"
SLACK_TRACKS = "https://shopview.slack.com/archives/C0C45KCLS92/p1790938002887259"
SQUAD_MODEL = "https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/439746561/Feature+Squad+Development+Model"
RELNOTES = "https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=931069964"
JIRA = "https://shopview.atlassian.net/browse/"
TR = "https://shopview.testrail.io/index.php?/cases/view/"
FOLDER = "https://shopview.testrail.io/index.php?/suites/view/1&group_id=12166"
DESIGN = "https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge"


def steps(cid):
    return [l for l in C[cid]["steps"].split("\n") if l.strip()]


def exp(cid):
    return [l for l in C[cid]["exp"].split("Source —")[0].split("\n") if l.strip() and l.strip() != "Expected results"]


def numbered(lines, only=None):
    return "\n".join(f"{i+1}. {s}" for i, s in enumerate(lines) if only is None or i + 1 in only)


def link(cid):
    return f'=HYPERLINK("{TR}{cid}","C{cid}")'


def pick(cid, starts):
    out = [e for e in exp(cid) if any(e.startswith(s) for s in starts)]
    assert len(out) == len(starts), (cid, starts, out)
    return "\n".join(out)


WHEN_TABLE = ("Dashboard spec, version 44, Story 8 (rules S8-R5a and S8-N1a), added on 13 Oct 2026 by Chris Ward. "
              "The spec's change log is empty, so the date comes from his Slack message of 13 Oct: \"The table should "
              "follow the filter too … I've added it to the PRD (v44)\". Before that (version 42, 7 Oct) the spec said "
              "only that the chart reloads.")

ATM = {3: "Yes (automated)", 4: "Waiting to be automated", 1: "No (manual)"}

update_rows = []

# C88619 — technician filter
s = steps("88619")
assert s[5].startswith("Close the list and read the chart's legend and lines")
update_rows.append([
    link("88619"), C["88619"]["title"], ATM[C["88619"]["atm"]],
    "The table under a technician chart must now follow the Technician filter too.",
    "After keeping two technicians, the table under the chart lists only those two. Before, only the chart narrowed.",
    WHEN_TABLE,
    pick("88619", ["Steps 6 and 8:"]),
    "Steps 6 and 8: After keeping two technicians the chart reloads and shows only those two: the legend names only them and only two lines are drawn. (unchanged)\n"
    "Steps 6 and 8: The table under the chart now lists only those two technicians: every other technician's row is gone. (new)",
    numbered(s, only={6, 8}),
    "6. Close the list and read the chart's legend and lines, and the table under the chart.\n"
    "8. Repeat the last four steps on the Technician Utilization chart. (unchanged)",
    "The rest of the case is unchanged. Vladimir's C499827 already checks this for Technician Efficiency only; this case covers both technician charts.",
    f'=HYPERLINK("{SPEC}","Dashboard spec, Story 8")',
])

# C88620 — untick every technician
s = steps("88620")
assert s[4].startswith("Close the list and look at where the chart was")
update_rows.append([
    link("88620"), C["88620"]["title"], ATM[C["88620"]["atm"]],
    "When every technician is unticked, the table under the chart must now be hidden as well.",
    "With no technician ticked, the Technician Efficiency table disappears together with the chart. Before, only the chart had to disappear.",
    WHEN_TABLE,
    pick("88620", ["Step 5:", "Step 6:"]),
    "Step 5: With no technician ticked the chart is hidden and the table under it is hidden too: no empty chart box, no empty axes, and no table with no rows.\n"
    "Step 6: As soon as one technician is ticked again the chart comes back with that technician's line, and the table comes back listing that technician.",
    numbered(s, only={5, 6}),
    "5. Close the list and look at where the chart and the table under it were.\n"
    "6. Tick one technician again (any one in the list). (unchanged)",
    "The spec's own summary in section 7 (\"User Feedback Summary\") still mentions only the chart; rule S8-N1a is the newer, more exact text. We have asked Chris Ward to tidy this (question 14).",
    f'=HYPERLINK("{SPEC}","Dashboard spec, Story 8")',
])

# C351717 — advisor filter
s = steps("351717")
update_rows.append([
    link("351717"), C["351717"]["title"], ATM[C["351717"]["atm"]],
    "The Advisor Analysis table under the Billing Efficiency chart must now follow the Advisor filter too.",
    "With one advisor chosen, the Advisor Analysis table lists only that advisor; with no advisor chosen it lists every advisor. Before, only the chart changed.",
    WHEN_TABLE,
    pick("351717", ["Step 3: Before anything", "Step 7:", "Step 8:"]),
    "Step 3: Before anything is chosen, the chart shows every advisor (the legend lists all of them) and the Advisor Analysis table under it lists every advisor.\n"
    "Step 7: With one advisor chosen the chart reloads and shows only that advisor's line, and the Advisor Analysis table lists only that advisor.\n"
    "Step 8: With the choice cleared, all advisors show again, in the chart and in the table.",
    numbered(s, only={3, 7, 8}),
    "3. Read the filter button at the top right of the Billing Efficiency chart, the chart's legend, and the Advisor Analysis table under the chart.\n"
    "7. Read the chart's legend and lines, and the Advisor Analysis table.\n"
    "8. Clear the advisor choice so no advisor is chosen, then read the chart and the table again.",
    "The rest of the case is unchanged.",
    f'=HYPERLINK("{SPEC}","Dashboard spec, Story 8")',
])

# C88632 — release note
s = steps("88632")
assert len(s) == 14
update_rows.append([
    link("88632"), C["88632"]["title"], ATM[C["88632"]["atm"]],
    "The release notes are now published, and their wording differs from what step 14 expects.",
    "The published note names both corrections but does not say that a voided-then-reinvoiced figure can move up, so step 14 would fail on correct notes.",
    "Release notes page on Confluence, written by Chris Ward and published 10 Oct 2026. Before that, the only source for "
    "the note's content was the developers' tech plan (16 Sep), which asked it to \"call out the void-then-reinvoice case\". "
    "The Dashboard spec (all versions) says only that the change \"ships with a release note\".",
    pick("88632", ["Step 14:"]),
    "Step 14: The release notes carry one plain-language note naming both corrections. The published note reads: \"Sales report totals can drop for some past dates. Voided invoices are no longer counted, and invoices with no customer attached are now included. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect questions about this.\"",
    numbered(s, only={14}),
    f"14. Open the release notes page on Confluence ({RELNOTES}) and find the Dashboard note about the Sales and Service Advisor Analysis corrections.",
    "Whether the note must also say that a voided-then-reinvoiced figure can move up is a question for Chris Ward (question 2). Until he answers, check only what the published note says.",
    f'=HYPERLINK("{RELNOTES}","Release notes, 10 Oct 2026")',
])

new_rows = [
    ["Unticking every technician on the Technician Utilization chart hides the chart and its table",
     "The spec now says the table hides with the chart (S8-N1a). C88620 checks this on Technician Efficiency only, and no case unticks every technician on Technician Utilization.",
     WHEN_TABLE,
     "Signed in as a user whose role has the Reports permission (for example Admin).\nA desktop browser window at least 1024 pixels wide.\nA location with at least two technicians who have clocked time on invoiced work orders this month.",
     "1. Click Dashboard in the top bar.\n2. On the Technician Utilization tile, click View details.\n3. Click the Technician filter button.\n4. Untick every technician.\n5. Close the list and look at where the chart and the table were.\n6. Tick one technician again.",
     "Step 5: The Technician Utilization chart is hidden and the table under it is hidden too: no empty chart box, no empty axes, no table with no rows, and no message.\nStep 6: The chart comes back with that technician's line, and the table comes back listing that technician.",
     link("88620"), ""],
    ["The table still follows a remembered technician or advisor choice on your next visit",
     "The dashboard remembers each chart's technician or advisor choice between visits (S8-R6), and the table under the chart must now follow that choice (S8-R5a). C351718 checks only the chart on the next visit.",
     WHEN_TABLE,
     "Signed in as a user whose role has the Reports permission (for example Admin).\nA desktop browser window at least 1024 pixels wide, the same browser throughout.\nA location with at least two technicians and two service advisors with invoiced work this month.",
     "1. Click Dashboard in the top bar.\n2. On Technician Efficiency click View details, and in the Technician filter keep only one technician.\n3. On Billing Efficiency click View details, and in the Advisor filter choose one advisor.\n4. Close the browser tab, open the site again in the same browser, and click Dashboard.\n5. Open Technician Efficiency's details and read the chart and the table.\n6. Open Billing Efficiency's details and read the chart and the Advisor Analysis table.",
     "Step 5: The chart and the table show only the technician you kept.\nStep 6: The chart and the Advisor Analysis table show only the advisor you chose.",
     link("351718"), ""],
    ["On the Revenue tile, days with no sales between two sales days are drawn at $0, not as a gap",
     "The spec now says in so many words that, on Revenue and the count tiles, a period with no sales is a point at 0, and only a ratio tile's \"-\" leaves a gap (S4-R11a). No case has a month with sales on two days and nothing in between. The build was drawing a broken line here (Jira SV-11076).",
     "Dashboard spec, Story 4, rule S4-R11a, added between 9 and 13 Oct 2026 (version 43 or 44). The change log is empty. The date comes from Chris Ward's comment on Jira SV-11076, 9 Oct 2026: \"A day with no sales is a real $0 on Revenue, not a missing value … I'm adding a line to the PRD to make this explicit (S4-R11a).\"",
     "Signed in as a user whose role has the Reports permission (for example Admin).\nA location with invoices on exactly two days this month (for example the 3rd and the 9th) and no invoices on the days between, with today after the second sales day.",
     "1. Click Dashboard in the top bar (Revenue on This Month).\n2. Look at the Revenue tile's trend line between the two sales days.",
     "Step 2: The trend line is one continuous line: it drops to the bottom ($0) on the days with no sales and rises again on the second sales day. It does not break into separate pieces or dots, and it does not show the empty-chart outline.",
     link("351709"), "C351709 checks a month with sales on one day only; this test needs two sales days with empty days between them."],
]

hold_rows = [
    ["Flat trend line: where it sits in the tile", "Question 1", "When a tile's trend line is flat (for example Technician Utilization at 100% every day), is it drawn along the bottom of the trend area or at its real level?", f'=HYPERLINK("{SLACK_FLAT}","Slack, 9 Oct 2026")', ""],
    ["\"Today\" and a custom date range on a tile", "Question 3", "Whether the tile's date picker should offer \"Today\" and a custom range as well as the nine presets in the spec.", f'=HYPERLINK("{JIRA}SV-11255","Jira SV-11255")', link("557284")],
    ["At Risk table: 12-month revenue opens the Sales report", "Question 4", "Whether clicking a customer's 12-month revenue in the At Risk table should open the Sales report filtered to that customer.", f'=HYPERLINK("{TR}540783","TestRail C540783")', link("540783")],
    ["Expanded Revenue chart shows monthly bars", "Question 5", "Whether the expanded Revenue chart always shows one bar per month for the last twelve months.", f'=HYPERLINK("{JIRA}SV-10886","Jira SV-10886")', link("88612")],
    ["Expanded charts: months with no value", "Question 6", "Whether, in an expanded chart, a month with no value leaves a gap or is joined by a dashed line, as the design shows.", f'=HYPERLINK("{DESIGN}","Claude design")', ""],
    ["Report link on the technician tiles when they have no data", "Question 7", "Whether the Technician Efficiency and Technician Utilization tiles keep their report link (the spec) or lose it (the approved empty-state design).", f'=HYPERLINK("{DESIGN}","Claude design, row 15")', link("88623")],
    ["At Risk at zero customers: the line under the number", "Question 9", "What the line under the At Risk number should read when no customer is at risk.", f'=HYPERLINK("{DESIGN}","Claude design")', link("351714")],
    ["Legend hover: the average shown", "Question 12", "Whether hovering a name in a chart legend should show an average, and over which period.", f'=HYPERLINK("{DESIGN}","Claude design")', link("351723")],
]

po_rows = [
    ["Trend line on a tile", "When a tile's trend line is flat (for example Technician Utilization at 100% on every day), where should it sit?\n(a) Along the bottom of the small trend area, as the build draws it today.\n(b) At its real level, so 100% does not look like 0%.\n(c) Should we add your answer to the spec, so the tests can follow it?",
     "Ayesha asked this in Slack on 9 Oct and you answered that the line \"should read as a flat\". The spec does not say where a flat line sits, and the squad's working rules say a decision only counts once it is in the spec.",
     "", f'=HYPERLINK("{SLACK_FLAT}","Slack #fs-dashboard, 9 Oct 2026")'],
    ["Release note for the Sales and Service Advisor Analysis reports", "The published release note says totals can drop. When an invoice is voided and then invoiced again for more, the figures can go up.\n(a) Should the note also say that a figure can go up in that case?\n(b) Or is the note complete as published?",
     "The developers' tech plan (16 Sep) asked the note to mention this case. Your published note (10 Oct) does not.",
     "", f'=HYPERLINK("{RELNOTES}","Release notes, 10 Oct 2026")'],
    ["Date choices on a tile", "The spec lists nine date choices for a tile (This Month, Last Month, and so on). The build also offers \"Today\" and a calendar to pick any range.\n(a) Should a tile offer \"Today\"?\n(b) Should a tile offer a custom range from the calendar?",
     "Recent bug reports and one of Vladimir's test cases use \"Today\" and the calendar on the tiles. The spec and the release notes list the nine choices only.",
     "", f'=HYPERLINK("{JIRA}SV-11255","Jira SV-11255 and SV-11245")'],
    ["At Risk Customers table", "In the expanded At Risk Customers table, should a customer's 12-month revenue be a link that opens the Sales report filtered to that customer?\n(a) Yes, it should be a link.\n(b) No, it is plain text.",
     "One test case expects a link. We found no sentence about it in the spec, the stories, the release notes, the comments or Slack.",
     "", f'=HYPERLINK("{TR}540783","TestRail C540783")'],
    ["Expanded Revenue chart", "When you open the details of the Revenue tile, should the chart always show one bar per month for the last twelve months, whatever date range the tile is set to?\n(a) Yes, always twelve monthly bars.\n(b) No, it should follow the tile's date range.",
     "A bug report expected monthly bars and was fixed on 9 Oct. The spec describes the small trend line on the tile, but not the bars in the expanded chart.",
     "", f'=HYPERLINK("{JIRA}SV-10886","Jira SV-10886")'],
    ["Expanded charts with an empty month", "In the expanded Billing Efficiency, Technician Efficiency and Technician Utilization charts, what should a month with no value look like?\n(a) A gap in the line.\n(b) A dashed line joining the months either side, as the design shows.",
     "The spec says how the small trend line on a tile handles an empty period (a gap), and that the expanded charts are \"unchanged\". It does not say what an empty month looks like in an expanded chart.",
     "", f'=HYPERLINK("{DESIGN}","Claude design: expanded chart boards")'],
    ["Report link on the technician tiles with no data", "The approved drawing for tiles with no data shows no report link (the small arrow) on the Technician Efficiency and Technician Utilization tiles. The spec says every tile keeps its report link and the empty state \"changes nothing else on the tile\".\n(a) Keep the report link on those two tiles (the spec).\n(b) Remove it when the tile has no data (the drawing).",
     "Revenue, Billing Efficiency and Sales by Customer keep their arrow in the same drawing.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, row 15 (approved 7 Oct)")'],
    ["How At Risk measures revenue", "The design's note says the At Risk card measures revenue \"the way Sales By Customer does\". The spec says it is measured \"the way the Revenue tile measures revenue\" (subtotals before discount and tax, minus credit memos).\n(a) Like the Revenue tile (the spec).\n(b) Like Sales by Customer (the design note).",
     "The two ways can give different figures for the same customer, so the At Risk tests depend on the answer.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, board 02 note")'],
    ["At Risk with no customers at risk", "When no customer is at risk, what should the line under the At Risk number read?\n(a) \"$0.00 (12mo) · 0 customers\", as the design shows.\n(b) Something else (please write it).\n(c) No line at all.",
     "The spec covers one customer and more than one customer, but not zero.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, empty-tiles board")'],
    ["At Risk inactivity choice", "The design shows two places to choose the inactivity period: the pill on the tile and an \"Inactive for\" box inside the expanded panel. The spec mentions one control.\n(a) One control only (which one?).\n(b) Both, always showing the same value.",
     "Raised in our design review on 7 Oct; the design still shows both.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, board 09")'],
    ["\"Last updated\" line", "The design shows a line such as \"Last updated: 3 minutes ago\" at the bottom of the dashboard. The spec does not mention it.\n(a) It should be there.\n(b) It should not be there.",
     "Raised in our design review on 7 Oct; the design still shows it.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, dashboard boards")'],
    ["Hovering a name in a chart legend", "The design shows, on hover, a person's latest figure and an average (for example \"120% · Aug 2026 · avg 107%\").\n(a) Should the average be shown?\n(b) If yes, an average over which period?",
     "The spec does not describe the legend hover. The average in the design does not match the table on the same screen.",
     "", f'=HYPERLINK("{DESIGN}","Claude design, legend boards")'],
    ["Screen layout fixes", "Eight layout problems were raised as bugs between 5 and 13 Oct (for example: the date panel must not jump, table rows must stay visible under a chart, the date picker must be fully dark in dark mode, and a phone must not scroll sideways). Seven are fixed; the phone one is still being worked on. Are all eight the behaviour you want, so testers can check them as requirements?\n(a) Yes, all eight.\n(b) Yes, except (please list).",
     "The spec says nothing about most of these. Low priority.",
     "", f'=HYPERLINK("{JIRA}SV-10891","Jira SV-10891, 10933, 10934, 10936, 11242, 11245, 11246, 11255")'],
    ["Two small tidy-ups in the spec", "(a) Section 7 (\"User Feedback Summary\") still says only the chart hides when every technician is unticked. The newer rule in Story 8 now says the table hides too. Could section 7 say so as well?\n(b) The spec's header still points to the old test site (sv8311), but the squad tests on sv490. Could the header be updated?",
     "Neither changes what testers check; they only avoid confusion.",
     "", f'=HYPERLINK("{SPEC}","Dashboard spec, version 44")'],
]

json.dump({"update": update_rows, "new": new_rows, "hold": hold_rows, "po": po_rows}, open(os.path.join(D, "sheet-data.json"), "w"), indent=1, ensure_ascii=False)
print(len(update_rows), len(new_rows), len(hold_rows), len(po_rows))
