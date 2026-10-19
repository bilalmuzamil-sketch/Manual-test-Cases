"""SV-11522 (Tech View) and SV-11524 (Board View), 19 Oct 2026: new WO Board cases from PRD v66 (Chris Ward, 19 Oct 2026 15:33 UTC,
"SV-11522 / SV-11524: assign wording, dialog, toast with Undo"). Written from the rules (Rule 117 ninth, tenth and eleventh
amendments), not copied from another case (QA lead, 19 Oct 2026: "do not copy anything rather create the test cases based on what
have been told you"). {N} is replaced by the case's own number."""
import re
D = __import__("os").path.dirname(__import__("os").path.abspath(__file__))
PRD = open(f"{D}/CONFLUENCE-845185030-v66-2026-10-19.md").read()
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", PRD, re.M).group(1).replace("**", "").strip()
LOG_MENU = "S3-R14, S4-R4: the menu item and dialog read “Assign lead technician” on a work order with no lead and “Reassign lead technician” on one with a lead. v66."
LOG_TOAST = ("S4-R5, S4-R16, new S4-R32: the lead-change toast is the design’s toast, “{work order number} assigned to {technician name}” / “{work order number} unassigned”, "
             "with Undo; 8 seconds, held while hovered; Undo restores the lead, the order position and any cleared shifts (was: standard toast “Lead technician updated” / "
             "“Lead technician removed”, no Undo; reverses the SV-11396 call for these two toasts). v66.")
LOG_DIALOG = ("S4-R12, S4-R13, S4-R30: Unassigned is no longer offered in the dialog (Unassign stays in the menu, S11-R9); clicking a technician assigns at once, "
              "no Reassign button; clicking the current lead closes with no change. v66.")
ADMIN = ('You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
TECHS = ('Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on.',
         "For example: {Technician-A} is ZZAUTOTEST C{N} Ana and {Technician-B} is ZZAUTOTEST C{N} Ben.")
START = ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', None)
def known(ticket, today):
    return (f"Known problem ({ticket}, open; seen on staging by the designer on 19 Oct 2026): {today} (1) If you see exactly that, mark this test Failed and raise "
            "nothing new. (2) If it fails in a different way, that is a new problem: report it. (3) If it behaves as the expected results say, the change has shipped: "
            "mark it Passed and tell the QA lead.")
NO_UNDO = "the message reads \"Lead technician updated\" (or \"Lead technician removed\") and has no Undo button."
TOAST_NOTE = ("The PRD's messages table and its Story 4 example still read \"Lead technician updated\" and \"Lead technician removed\". S4-R5 was changed on "
              "19 Oct 2026 to the new wording and the change log says it replaces those two messages, so this case follows S4-R5; the difference is on the "
              "product owner's question list.")
S3 = (3, "SV-10046", "Story 3, Board View — board by lead technician"); S4 = (4, "SV-10047", "Story 4, Reassign or unassign the lead technician from the board or grouped table")
CASES = [
dict(key="N1", title="More actions reads Assign lead technician when a work order has no lead", stories=[S3, S4],
  pre=[ADMIN, ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on.', "For example: {Technician-A} is ZZAUTOTEST C{N} Ana."),
       ("Customer {Customer-A} has two Approved work orders: {Work-order-1} with no lead technician, and {Work-order-2} led by {Technician-A}.",
        "For example: {Customer-A} is ZZAUTOTEST C{N} Assign Wording, and {Work-order-1} and {Work-order-2} are S2-37401 and S2-37402."), START],
  steps=['Open the "More actions" (…) menu on the card for {Work-order-1} in "Unassigned".', 'Click "Assign lead technician".', 'Click "Cancel".',
         "Open the \"More actions\" (…) menu on the card for {Work-order-2} in {Technician-A}'s column.", 'Click "Reassign lead technician".', 'Click "Cancel".',
         'Click "Tech View" in the display switcher.', 'Open the "More actions" (…) menu on the row for {Work-order-1} in "Unassigned".', 'Click "Assign lead technician".', 'Click "Cancel".'],
  res=['Step 1: the menu offers "Assign lead technician". It does not say "Reassign lead technician".', 'Step 2: a dialog titled "Assign lead technician" opens.',
       "Step 3: the dialog closes and {Work-order-1} stays in \"Unassigned\".", 'Step 4: the menu offers "Reassign lead technician".',
       'Step 5: a dialog titled "Reassign lead technician" opens.', "Step 6: the dialog closes and {Work-order-2} stays in {Technician-A}'s column.",
       "Step 7: Tech View shows {Work-order-1} in \"Unassigned\" and {Work-order-2} in {Technician-A}'s group.",
       'Step 8: the menu offers "Assign lead technician". It does not say "Reassign lead technician".', 'Step 9: a dialog titled "Assign lead technician" opens.',
       "Step 10: the dialog closes and {Work-order-1} stays in \"Unassigned\"."],
  known=known("SV-11522 and SV-11524", 'the menu on a work order with no lead says "Reassign lead technician".'),
  q=[("S3-R14", code("S3-R14")), ("S4-R4", code("S4-R4")), ("PRD change log, 19 Oct 2026", LOG_MENU)], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
dict(key="N2", title="The lead technician dialog offers no Unassigned and assigns on one click", stories=[S4],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has an Approved work order {Work-order-1} led by {Technician-A}, with no shift booked for it on the Schedule.",
        "For example: {Customer-A} is ZZAUTOTEST C{N} One Click and {Work-order-1} is S2-37411."), START],
  steps=["Open the \"More actions\" (…) menu on the card for {Work-order-1} in {Technician-A}'s column.", 'Click "Reassign lead technician".',
         "Read the dialog's list from the top.", "Read the dialog's buttons.", "Click {Technician-A} in the list.",
         'Open the "More actions" (…) menu on the card for {Work-order-1} again.', 'Click "Reassign lead technician".', "Click {Technician-B} in the list."],
  res=['Step 1: the menu offers "Reassign lead technician".', 'Step 2: the "Reassign lead technician" dialog opens.',
       'Step 3: a "Search technicians" box, then one list of technicians at {Location-A} with no grouping, each with an avatar and an "N open" count. '
       '{Technician-A} and {Technician-B} are in it. There is no "Unassigned" row.',
       'Step 4: the only button is "Cancel". There is no "Reassign" or other confirm button.',
       "Step 5: the dialog closes and nothing changes: {Work-order-1} stays in {Technician-A}'s column and no message shows.",
       'Step 6: the menu offers "Reassign lead technician".', 'Step 7: the "Reassign lead technician" dialog opens.',
       "Step 8: the dialog closes at once, with no other click, and {Work-order-1} moves to {Technician-B}'s column. The message \"{Work-order-1} assigned to {Technician-B}\" shows."],
  known=known("SV-11522 and SV-11524", 'the dialog lists "Unassigned" at the top, and choosing a technician needs a click on a "Reassign" button.'),
  note=TOAST_NOTE,
  q=[("S4-R12", code("S4-R12")), ("S4-R13", code("S4-R13")), ("S4-N4", code("S4-N4")), ("S4-R5", code("S4-R5")), ("PRD change log, 19 Oct 2026", LOG_DIALOG)],
  marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
dict(key="N3", title="A lead change message names the work order and technician, with Undo", stories=[S4], pictures=["DC-21-toast-light-1440.png"],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has three Approved work orders: {Work-order-1} with no lead technician, and {Work-order-2} and {Work-order-3} led by "
        "{Technician-A}. None has a shift booked on the Schedule.", "For example: {Customer-A} is ZZAUTOTEST C{N} Toast Words, and {Work-order-1} to {Work-order-3} are S2-37421 to S2-37423."),
       ("The design picture DC-21-toast-light-1440.png is attached to this case.", None), START],
  steps=["Drag the card for {Work-order-1} from \"Unassigned\" onto {Technician-A}'s column and let go.",
         "Compare the message at the bottom right with the attached picture DC-21-toast-light-1440.png.",
         "Open the \"More actions\" (…) menu on the card for {Work-order-2}.", 'Click "Unassign".', "Read the message at the bottom right.",
         'Click "Tech View" in the display switcher.', 'Open the "More actions" (…) menu on the row for {Work-order-3}.', 'Click "Reassign lead technician".',
         "Click {Technician-B} in the list.", "Read the message at the bottom right."],
  res=["Step 1: {Work-order-1} moves into {Technician-A}'s column.",
       'Step 2: a white message box at the bottom right, with a round green check icon, reads "{Work-order-1} assigned to {Technician-A}" and has an "Undo" button and a close (×) button, laid out as in the picture. '
       'It does not read "Lead technician updated".',
       'Step 3: the menu offers "Unassign".', 'Step 4: {Work-order-2} moves to "Unassigned".',
       'Step 5: the message reads "{Work-order-2} unassigned" and has an "Undo" button. It does not read "Lead technician removed".',
       "Step 6: Tech View shows {Work-order-3} in {Technician-A}'s group.", 'Step 7: the menu offers "Reassign lead technician".',
       'Step 8: the "Reassign lead technician" dialog opens.', "Step 9: the dialog closes and {Work-order-3} moves to {Technician-B}'s group.",
       'Step 10: the message reads "{Work-order-3} assigned to {Technician-B}" and has an "Undo" button.'],
  known=known("SV-11524", NO_UNDO), note=TOAST_NOTE,
  q=[("S4-R5", code("S4-R5")), ("PRD change log, 19 Oct 2026", LOG_TOAST)], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)",
  design=dict(ref='Claude Design project "Work Orders" (Branko Cicovic), file "Work Orders.dc.html", export of 14 Oct 2026, read 19 Oct 2026: the lead-change '
                  'toast with Undo (the picture to compare against at step 2).',
              diff="The picture's words come from the design's example data (\"S1-702 lead technician set to Ralph Edwards\"; the design also says \"moved to "
                   "Unassigned\"). The wording to check is the PRD's S4-R5 (19 Oct 2026, later than the design); the picture is used for the look only.",
              quotes=[("Design — Work Orders.dc.html, the toast with Undo",
                       '<div role="status" style="position: fixed; right: 24px; bottom: 24px; z-index: 300; width: 400px;'),
                      ("Design — Work Orders.dc.html, the toast's Undo button", 'font-size: 14px; font-weight: 600; color: var(--sv-text-primary);" style-hover="background: var(--sv-surface-hover); border-color: var(--sv-border-strong);">Undo</button>'),
                      ("Design — Work Orders.dc.html, the toast's close button", 'aria-label="Dismiss"')])),
dict(key="N4", title="The lead change message stays while hovered and closes after 8 seconds", stories=[S4],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has two Approved work orders, {Work-order-1} and {Work-order-2}, both led by {Technician-A}. Neither has a shift booked on the Schedule.",
        "For example: {Customer-A} is ZZAUTOTEST C{N} Toast Timing, and {Work-order-1} and {Work-order-2} are S2-37431 and S2-37432."),
       ("You have a stopwatch, for example on your phone.", None), START],
  steps=["Drag the card for {Work-order-1} from {Technician-A}'s column onto {Technician-B}'s column, let go and start the stopwatch.",
         "Keep the pointer away from the message and watch it.",
         "Drag the card for {Work-order-2} from {Technician-A}'s column onto {Technician-B}'s column and let go.",
         "Move the pointer onto the message and keep it there for 15 seconds.", "Move the pointer away from the message and watch it.",
         "Drag the card for {Work-order-1} from {Technician-B}'s column onto {Technician-A}'s column and let go.", 'Click "Undo" on the message.'],
  res=["Step 1: {Work-order-1} moves to {Technician-B}'s column and the message \"{Work-order-1} assigned to {Technician-B}\" shows, with \"Undo\".",
       "Step 2: the message closes on its own about 8 seconds after you let go.",
       "Step 3: the message \"{Work-order-2} assigned to {Technician-B}\" shows.", "Step 4: the message stays open for the whole 15 seconds.",
       "Step 5: the message closes on its own after you move away.",
       "Step 6: {Work-order-1} moves to {Technician-A}'s column and the message \"{Work-order-1} assigned to {Technician-A}\" shows.",
       "Step 7: the message closes at once and {Work-order-1} goes back to {Technician-B}'s column."],
  known=known("SV-11524", NO_UNDO), note=TOAST_NOTE,
  q=[("S4-R16", code("S4-R16")), ("S4-R5", code("S4-R5")), ("S4-R32", code("S4-R32"))], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
dict(key="N5", title="Undo puts the work order back with its old lead and in its old place", stories=[S4],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has three Approved work orders led by {Technician-A}, shown in that column in this order from the top: {Work-order-1}, "
        "{Work-order-2}, {Work-order-3}. It also has an Approved work order {Work-order-4} with no lead technician. None has a shift booked on the Schedule.",
        "For example: {Customer-A} is ZZAUTOTEST C{N} Undo Place, and {Work-order-1} to {Work-order-4} are S2-37441 to S2-37444."), START],
  steps=["Drag the card for {Work-order-2} from {Technician-A}'s column onto {Technician-B}'s column and let go.", 'Click "Undo" on the message.',
         "Read the order of the cards in {Technician-A}'s column.", "Drag the card for {Work-order-4} from \"Unassigned\" onto {Technician-A}'s column and let go.",
         'Click "Undo" on the message.', "Click the card for {Work-order-2} to open the work order.",
         'Click ⋮ at the top right (next to "New Line"), then "Audit Log".', 'Read the two newest "Lead tech changed" entries in the Work Order Log.'],
  res=["Step 1: {Work-order-2} moves to {Technician-B}'s column and the message \"{Work-order-2} assigned to {Technician-B}\" shows, with \"Undo\".",
       "Step 2: the message closes and {Work-order-2} goes back to {Technician-A}'s column. No new message and no question about scheduled shifts appear.",
       "Step 3: the cards read {Work-order-1}, {Work-order-2}, {Work-order-3}, from the top, as before.",
       "Step 4: {Work-order-4} moves into {Technician-A}'s column and the message \"{Work-order-4} assigned to {Technician-A}\" shows.",
       "Step 5: the message closes and {Work-order-4} goes back to \"Unassigned\". No new message appears.",
       "Step 6: the work order page opens and Lead Technician reads {Technician-A}.", "Step 7: the Work Order Log opens.",
       "Step 8: the newest entry is the Undo, {Technician-B} → {Technician-A}, and the one before it is {Technician-A} → {Technician-B}. Both show your user and the time."],
  known=known("SV-11524", NO_UNDO),
  q=[("S4-R32", code("S4-R32")), ("S4-R9", code("S4-R9"))], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
dict(key="N6", title="Undo brings back the shifts that a lead change cleared", stories=[S4],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has an Approved work order {Work-order-1} with one approved line, led by {Technician-A}.",
        "For example: {Customer-A} is ZZAUTOTEST C{N} Undo Shifts and {Work-order-1} is S2-37451."),
       ("On the Schedule, {Technician-A} has two \"Entire work order\" shifts on {Work-order-1}: {Shift-A} today, which started an hour ago and ends later today, "
        "and {Shift-B} tomorrow.", "For example: {Shift-A} is today 9:00 to 15:00 and {Shift-B} is tomorrow 8:00 to 12:00."), START],
  steps=["Drag the card for {Work-order-1} from {Technician-A}'s column onto {Technician-B}'s column and let go.", 'Click "Clear shifts".',
         'Click "Undo" on the message.', 'Click "Schedule" in the top menu.', "Look at {Technician-A}'s row today.", "Go to tomorrow.",
         "Look at {Technician-A}'s row."],
  res=["Step 1: the question \"Clear {Technician-A}'s scheduled shifts?\" opens, with \"Keep shifts\", \"Clear shifts\" and \"Cancel\".",
       "Step 2: {Work-order-1} moves to {Technician-B}'s column and the message \"{Work-order-1} assigned to {Technician-B}\" shows, with \"Undo\".",
       "Step 3: the message closes and {Work-order-1} goes back to {Technician-A}'s column. No question about scheduled shifts and no new message appear.",
       "Step 4: the Schedule opens on today.", "Step 5: {Shift-A} is there with its original end time (for example 15:00), not cut short.",
       "Step 6: the Schedule shows tomorrow.", "Step 7: {Shift-B} is back, as it was (for example 8:00 to 12:00)."],
  known=known("SV-11524", NO_UNDO + " The cleared shifts stay cleared."),
  q=[("S4-R32", code("S4-R32")), ("S4-R29", code("S4-R29"))], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
dict(key="N7", title="Undo cannot move back a work order that was invoiced in the meantime", stories=[S4],
  pre=[ADMIN, TECHS, ("Customer {Customer-A} has a work order {Work-order-1} led by {Technician-A}, with status Complete (all lines complete and reviewed, not invoiced) "
        "and no shift booked on the Schedule.", "For example: {Customer-A} is ZZAUTOTEST C{N} Undo Invoiced and {Work-order-1} is S2-37461."),
       ("Two browser windows are open side by side, both signed in as you: window 1 on the starting screen below, window 2 on {Work-order-1}'s \"Finance\" tab.", None), START],
  steps=["In window 1, drag the card for {Work-order-1} from {Technician-A}'s column onto {Technician-B}'s column and let go.",
         'Straight away, in window 2, click "Create Invoice" and leave the "New Customer Payment" window open (closing it takes the invoice back off).',
         'Before the message closes (about 8 seconds), in window 1 click "Undo".', "Refresh window 1.", "Look at the card for {Work-order-1}."],
  res=["Step 1: {Work-order-1} moves to {Technician-B}'s column and the message \"{Work-order-1} assigned to {Technician-B}\" shows, with \"Undo\".",
       "Step 2: the work order is invoiced (window 2 shows it as Invoiced).",
       "Step 3: the Undo is refused: {Work-order-1} does not go back to {Technician-A}'s column. If a message shows, write down its words.",
       "Step 4: the board reloads.", "Step 5: {Work-order-1} is in {Technician-B}'s column."],
  known=known("SV-11524", NO_UNDO),
  q=[("S4-R32", code("S4-R32")), ("S4-N2", code("S4-N2"))], marker="AUTOMATION: READY - EXPECT FAIL (SV-11524)"),
]
