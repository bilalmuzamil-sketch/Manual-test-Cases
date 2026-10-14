"""Build the WO Board and Tech View Currency Check V2 sheet contents (14 Oct 2026).

"Before" columns are copied word for word from the case snapshots taken before anything else (snapshots-before/).
Output: sheet-data.json = {update, new, hold, po} rows.
"""
import json, os, re, html

D = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(D, "cases-text.json")))

SPEC = "https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Kanban+Tech+View+Display+Options+Draft+Spec"
DIFF = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions={a}&selectedPageVersions={b}"
REVIEW = "https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions"
RELNOTES = "https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=931069964"
SLACK_EMPTY = "https://shopview.slack.com/archives/C0C41RV3T3L/p1791497536300869"
SLACK_NAME = "https://shopview.slack.com/archives/C0C41RV3T3L/p1791816487158519"
SLACK_TEAMQA = "https://shopview.slack.com/archives/C08A245PFC1/p1791972460700409"
JIRA = "https://shopview.atlassian.net/browse/"
TR = "https://shopview.testrail.io/index.php?/cases/view/"
RUN = "https://shopview.testrail.io/index.php?/runs/view/498&group_by=cases:section_id&group_order=asc&display=subtree&group_id=13204"


def clean(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def lines(s):
    return [l for l in s.split("\n") if l.strip()]


def pre_line(cid, start):
    out = [l for l in lines(C[cid]["pre"]) if l.startswith(start)]
    assert len(out) == 1, (cid, start, out)
    return out[0]


def step(cid, n):
    return lines(C[cid]["steps"])[n - 1]


def exp_lines(cid):
    e = C[cid]["exp"].split("What you should see today")[0].split("Source —")[0]
    return [l for l in lines(e) if l.strip() != "Expected results"]


def exp_line(cid, start):
    out = [l for l in exp_lines(cid) if l.startswith(start)]
    assert len(out) == 1, (cid, start, out)
    return out[0]


def link(cid, label=None):
    return f'=HYPERLINK("{TR}{cid}","{label or "C" + cid}")'


ATM = {3: "Yes (automated)", 4: "Waiting to be automated", 1: "No (manual)"}
OWN = {3: "Bilal Muzamil", 1: "Vladimir Tomovic"}

WHEN_R28 = ("Spec, Story 4, rule S4-R28, version 47, changed by Chris Ward on 12 Oct 2026 (after Jira SV-11126). It now adds: "
            "\"A work-order-level shift is one that covers every current line of the work order, which is what the Schedule's "
            "Entire work order drop creates. A shift on only some lines does not show the prompt.\" Before (version 42, 7 Oct) "
            "the spec did not say what a work-order-level shift is. The change log is empty; the date is from the page history.")
NOTE_R28 = ("On the Schedule a work order with only one line is booked at once as a whole (no Entire work order / Choose lines "
            "window; recorded in C368178), and under the 12 Oct rule a shift on the only line covers every line. Giving the work "
            "order a second line makes the case runnable and keeps its meaning whatever Chris answers to question 1.")

update = []

# 1. C154648 — Imported tooltips
s4, s7, s9 = step("154648", 4), step("154648", 7), step("154648", 9)
update.append([
    link("154648"), C["154648"]["title"], ATM[C["154648"]["atm"]], OWN[C["154648"]["cb"]],
    "The spec now gives the exact words of both Imported tooltips.",
    "A tooltip with other words (or no tooltip) now fails. Before, any tooltip passed because the case only asked you to write its words down.",
    "Spec, Story 1, rules S1-R13a and S1-R13b, added in version 48 by Chris Ward on 12 Oct 2026. Before, the rule came only from the tech plan, which gave no tooltip words.",
    "\n".join([exp_line("154648", "Step 4:"), exp_line("154648", "Step 7:"), exp_line("154648", "Step 9:")]),
    "Step 4: while Imported is selected in List, Tech View and Board View are greyed out and cannot be chosen. Hovering them shows the tooltip \"Not available while Imported is selected.\" The List keeps showing the Imported work orders.\n"
    "Step 7: in Tech View the Imported option in Status is greyed out and cannot be ticked. Hovering it shows the tooltip \"Imported work orders open in List.\"\n"
    "Step 9: in Board View the Imported option is greyed out with the same tooltip, \"Imported work orders open in List.\"",
    "\n".join(["4. " + s4, "7. " + s7, "9. " + s9]),
    "4. " + s4 + " (unchanged)\n7. Click Status, hover the \"Imported\" option and read its tooltip. Try to tick it.\n9. Click Status, hover \"Imported\", read its tooltip and try to tick it.",
    "The case can now quote the spec instead of the tech plan.",
    f'=HYPERLINK("{DIFF.format(a=47, b=48)}","Spec change, version 48 (12 Oct)")',
])

# 2. C368133 — clear-shifts question only for unfinished shifts
update.append([
    link("368133"), C["368133"]["title"], ATM[C["368133"]["atm"]], OWN[C["368133"]["cb"]],
    "The spec now says a shift that covers every current line counts as a whole-work-order shift.",
    "Work order C has only one line, so its \"Line 1 only\" shift covers every line: the question should now open for C too. The case expects no question for C.",
    WHEN_R28,
    "\n".join(exp_lines("368133")),
    "Both results stay as they are, once work order C has two lines:\n" + "\n".join(exp_lines("368133")) + " (unchanged)",
    "Before you start: " + pre_line("368133", "Customer") + "\nBefore you start: " + pre_line("368133", "Shifts on the Schedule"),
    "Before you start: the same, but give work order C two lines, \"Line 1\" and \"Line 2\".\n"
    "Before you start: C's shift for [Tech-A] tomorrow 8:00–12:00 covers Line 1 only (on the Schedule: Choose lines, tick Line 1 only). Everything else is unchanged.",
    NOTE_R28,
    f'=HYPERLINK("{DIFF.format(a=46, b=47)}","Spec change, version 47 (12 Oct)")',
])

# 3. C96965 — Clear shifts removes only whole-work-order shifts
update.append([
    link("96965"), C["96965"]["title"], ATM[C["96965"]["atm"]], OWN[C["96965"]["cb"]],
    "The spec now says a shift that covers every current line counts as a whole-work-order shift.",
    "[WO-1] and [WO-2] have only one line, so the 13:00–15:00 \"Line 1\" shift covers every line and Clear shifts removes it on [WO-1]. The case expects it to stay.",
    WHEN_R28,
    exp_line("96965", "Esther Howard's 13:00"),
    "Esther Howard's 13:00–15:00 Line 1 shifts are still there on both work orders: the prompt never clears a shift on only some lines. (Valid once [WO-1] and [WO-2] have two lines.)",
    "Before you start: " + pre_line("96965", "Customer") + "\nBefore you start: " + pre_line("96965", "Shifts on the Schedule"),
    "Before you start: the same, but give [WO-1] and [WO-2] two lines each, \"Line 1\" and \"Line 2\".\n"
    "Before you start: the 13:00–15:00 shift covers Line 1 only (Choose lines, tick Line 1 only). Everything else is unchanged.",
    NOTE_R28 + " Vladimir already updated this case's source to version 47 on 12 Oct, but its work orders still have one line.",
    f'=HYPERLINK("{DIFF.format(a=46, b=47)}","Spec change, version 47 (12 Oct)")',
])

# 4–5. Vladimir's C236975 / C236976
for cid, last in (("236975", 5), ("236976", 6)):
    st = clean(step(cid, last))
    update.append([
        link(cid), C[cid]["title"], ATM[C[cid]["atm"]], OWN[C[cid]["cb"]],
        "The spec now says a shift that covers every current line counts as a whole-work-order shift.",
        "The work order has only one line, so the \"line-level\" shift covers every line and Clear shifts removes it too. The last step expects it to remain.",
        WHEN_R28,
        st.split("=>")[1].strip(),
        "The whole-work-order shift is gone and the shift on one line remains, once the work order has two lines and that shift covers one of them.",
        "Before you start: " + pre_line(cid, "A work order for a unique customer").rstrip(".") + "\nBefore you start: " + pre_line(cid, "A line-level shift").rstrip("."),
        "Before you start: a work order for a unique customer with lead technician A and two lines authorized for repair.\n"
        "Before you start: a line-level shift for A on one of the two lines only, tomorrow 07:00 shop time.",
        "Only the setup data changes. " + NOTE_R28.split(". ")[1] + ".",
        f'=HYPERLINK("{DIFF.format(a=46, b=47)}","Spec change, version 47 (12 Oct)")',
    ])

WHEN_EMPTY = ("Spec, Story 1, rules S1-N1 (reworded), S1-N1a and S1-N1b (added) in version 43 by Chris Ward on 8 Oct 2026, after "
              f"his Slack answer of 8 Oct (\"S1-N1's quoted wording is out of date\"). Before: \"No work orders match your filters\" with Clear filters.")

new = [
    ["With a filter on and nothing matching, Tech View and Board View show the List's filter message",
     "The spec now gives the exact empty-state words. The only case for it (C96918) was removed from TestRail, so nothing checks this today.",
     WHEN_EMPTY,
     "Signed in as an Owner/Admin user, desktop window at least 1024 px wide, at a location with work orders.",
     "1. Open Work Orders > All tab > Board View.\n2. Click Status and tick a status no work order has.\n3. Read the board.\n4. Type any text in Search as well and read the board again.\n5. Switch to Tech View and read the page.\n6. Click Clear all filters.",
     "Steps 3 to 5: instead of empty columns or groups, the page shows \"No work orders match these filters\", then \"Try removing a filter to widen your results.\", with a Clear all filters button, in both displays, with or without the search.\nStep 6: the filters are cleared and the work orders come back.",
     "", "The deleted case was C96918."],
    ["A search alone that matches nothing shows the search message with no button",
     "The spec now gives a separate message for a search with no filters. No case checks it.",
     WHEN_EMPTY,
     "Signed in as an Owner/Admin user, desktop window at least 1024 px wide, no filter ticked.",
     "1. Open Work Orders > All tab > Board View.\n2. Type text no work order has in Search (for example ZZNOMATCH123).\n3. Read the board.\n4. Switch to Tech View and read the page.",
     "Steps 3 and 4: the page shows \"No work orders match the search \"ZZNOMATCH123\".\" (with the text you typed) and no button, in both displays.",
     "", ""],
    ["A line held only through a Schedule shift follows the new lead",
     "The spec now says a technician who is on a line only because of a Schedule shift does not keep that line: the line follows the new lead, and the shift technician stays listed. No case has such a line at a lead change.",
     "Spec, Story 4, note under rule S4-R8, added in version 46 by Chris Ward on 12 Oct 2026, after Jira SV-11128. Before (version 42) the spec did not say how a Schedule-shift technician counts.",
     "Signed in as an Owner/Admin user, desktop window at least 1024 px wide. An Approved work order led by Technician A with two lines and no recorded time: Line 1 has no technician of its own and a Schedule shift for Technician B on Line 1 only (Choose lines, tick Line 1); Line 2 was given Technician C in Edit Line.",
     "1. Open Work Orders > Board View and find the work order in A's column.\n2. More actions > Reassign lead technician > choose Technician D > Reassign (click Keep shifts if asked).\n3. Open the work order's Lines tab and read Line 1 and Line 2.",
     "Step 3: Line 1 now follows Technician D, and Technician B is still listed on Line 1. Line 2 still shows Technician C.",
     link("96960"), "C96960 and C96961 check the other kinds of line; this adds the Schedule-shift kind."],
]

hold = [
    ["The clear-shifts question on a work order with one line", "Question 1",
     "Whether a shift on the only line of a one-line work order counts as a whole-work-order shift (and the other edge cases in question 1).",
     f'=HYPERLINK("{JIRA}SV-11126","Jira SV-11126")', link("368133")],
    ["Dropping work on a technician removed from this location", "Question 2",
     "Whether the column of a technician who is no longer at this location (but still leads work here) accepts drops, and what it shows.",
     f'=HYPERLINK("{DIFF.format(a=43, b=44)}","Spec change, version 44")', link("96970")],
    ["Estimated hours on a card", "Question 3",
     "Whether a card's estimated hours leave out declined lines, and whether they may differ from the work order page.",
     f'=HYPERLINK("{JIRA}SV-11106","Jira SV-11106")', link("96978")],
    ["Technician name on cards", "Question 4",
     "Whether cards and column headers show the account name or the staff record name used by the List.",
     f'=HYPERLINK("{SLACK_NAME}","Slack, 12 Oct 2026")', link("96978")],
    ["Board View opened with Imported already ticked", "Question 7",
     "What happens when a link or a saved filter opens Board View or Tech View with Imported already ticked.",
     f'=HYPERLINK("{DIFF.format(a=47, b=48)}","Spec change, version 48")', link("154648")],
]

po = [
    ["The \"Clear shifts\" question",
     "Since 12 Oct the spec says a shift counts as a whole-work-order shift when it \"covers every current line\".\n(a) A work order with only one line: does a shift on that line count as a whole-work-order shift?\n(b) A shift made with Choose lines that ticks every line: does it count?\n(c) Do lines that are not approved, or are declined, count as \"current lines\"?\n(d) If a line is added after an Entire work order shift was made, does that shift still count?",
     "On the Schedule a one-line work order is booked at once as a whole. Four test cases depend on (a).",
     "", f'=HYPERLINK("{JIRA}SV-11126","Spec change, version 47; Jira SV-11126")'],
    ["A technician removed from this location",
     "A pinned technician who is no longer at this location but still leads work here now appears as a normal, unpinned column holding that work.\n(a) Can work be dropped onto that column?\n(b) Does it show the inactive marker?\n(c) What does it show once it is empty?",
     "On 24 Sep Sasha said to treat such technicians like inactive ones. On 7 Oct a developer said a drop there is refused with \"This technician can't be assigned work orders.\"",
     "", f'=HYPERLINK("{DIFF.format(a=43, b=44)}","Spec change, version 44 (9 Oct)")'],
    ["Estimated hours on a card",
     "(a) Should a card's estimated hours leave out declined lines?\n(b) May the figure differ from the work order page by 0.1 hours?",
     "Only a developer has said so (12 Oct). The spec says estimated hours keep their existing meaning, and one test case expects the card to show the same figure as the List.",
     "", f'=HYPERLINK("{JIRA}SV-11106","Jira SV-11106")'],
    ["Technician name on cards",
     "Should cards and column headers show the person's account name while the List shows the staff record name?\n(a) Yes, they may differ.\n(b) No, they should match the List.",
     "Only a developer has said so (Slack, 12 Oct). One test case expects the card to match the List.",
     "", f'=HYPERLINK("{SLACK_NAME}","Slack #fs-board-tech-view, 12 Oct 2026")'],
    ["The Review Decisions page",
     "The Review Decisions page (29 Sep) still lists some points as open or with older answers (for example the Imported lock and the empty-state words).\n(a) Will it be refreshed?\n(b) Or should we treat the main spec as replacing it?",
     "The main spec has moved on since 29 Sep (versions 43 to 48).",
     "", f'=HYPERLINK("{REVIEW}","Review Decisions page")'],
    ["Release notes",
     "The release notes say the lead technician \"can't change on Invoiced, Paid or Imported work orders\". Since 12 Oct Imported work orders open only in List, and the rule names Invoiced and Paid only. Should the release notes be updated?",
     "Release 26.43.0; the notes are already published.",
     "", f'=HYPERLINK("{RELNOTES}","Release notes")'],
    ["Imported ticked from a link or saved filter",
     "If a link or a saved filter opens Board View or Tech View with \"Imported\" already ticked, what should happen?\n(a) The page opens in List instead.\n(b) The view opens and Imported is unticked.\n(c) Something else (please write it).",
     "The spec covers ticking Imported in List and the greyed option inside the views, but not this route.",
     "", f'=HYPERLINK("{DIFF.format(a=47, b=48)}","Spec change, version 48 (12 Oct)")'],
    ["The spec's header and change log",
     "The spec's status line still reads \"PRD v33\" and its Change Log table is empty, although the page is at version 48. Could they be brought up to date, so everyone can see what changed and when?",
     "We dated every change from the page history instead.",
     "", f'=HYPERLINK("{SPEC}","The spec")'],
]

json.dump({"update": update, "new": new, "hold": hold, "po": po}, open(os.path.join(D, "sheet-data.json"), "w"), indent=1, ensure_ascii=False)
print(len(update), len(new), len(hold), len(po))
