#!/usr/bin/env python3
"""27 Oct 2026, QA lead: "Yes and tag chris ward in the sheet". Appends questions 13-27 to the Part Lifecycle question doc for
Chris Ward (1pkAPGqW…), at the bottom, in the doc's own shape (Heading 2 "N. title", bold "What the page says:" / "Question:" /
"Answer:" labels), new headings in blue (Rule 131: a colour not used there before). Writes requests.json; the person chip for Chris
is inserted in a second call at the start of the intro paragraph. python3 build_requests.py <end_index> <revisionId>"""
import sys, json
END, REV = int(sys.argv[1]), sys.argv[2]
BLUE = {"color": {"rgbColor": {"red": 0.067, "green": 0.333, "blue": 0.8}}}
QS = [  # (doc no., our id, title, [(label, text)...])
 (13, "Q1", "Opening a core's own Part History page", [("What the page says:", "a core's name and history show on \"the core's own Part History page\" (S5-E3). A core has no row on the Inventory list, in Export or on the Part Library list, so we have not found a screen that opens that page."), ("Question:", "(a) How does a user open a core's own Part History page? (b) Does the search box in the top bar list a core (\"Core for …\"), with the grey Inactive tag and \"Not Tracked\" like any other part?")]),
 (14, "Q2", "A part with no bin location at all", [("What the page says:", "turning tracking on for a part with no bin location gives it the location's default bin (S5-R7). But the part window never lets the last bin be removed (Story 4 note), and the import puts a part with no bin into an \"Unassigned\" bin (S7-N10)."), ("Question:", "how does a part end up with no bin location at all, so we can test S5-R7?")]),
 (15, "Q3", "The Delete button in an open \"Edit Library Part\" window", [("What the page says:", "Delete in the \"Edit Library Part\" window is disabled while a part uses the entry (S11-R3c)."), ("Question:", "if the last part using the entry is deleted in another tab while that window is open, does its Delete button become enabled without a reload?")]),
 (16, "Q4", "Parts added by the parts import", [("What the page says:", "the import adds new parts and updates stocked ones (S7-N7 to S7-N10), but it doesn't say whether a new part is tracked."), ("Question:", "(a) Is a part the import adds tracked or untracked? (b) Is the import template's \"name\" column the part's description?")]),
 (17, "Q6", "Where Bin Locations is", [("What the page says:", "Bin Locations is under \"Administration\" (S5-E2, and your answer 5). On screen it is under Settings."), ("Question:", "which name should the tests use?")]),
 (18, "Q7", "\"5 Available\" or \"3 Available\"", [("What the page says:", "SV-10380 keeps the shop-floor availability calculation unchanged."), ("Question:", "for a part with bins of +5 and −2, should the Inventory list's badge read \"5 Available\" (positive bins only, as today) or \"3 Available\" (net)?")]),
 (19, "Q8", "The close X on status confirmations", [("What the design shows:", "every status confirmation (Deactivate part?, Activate part?, Deactivate parts?, Activate parts?) has a close X at the top right."), ("What the page says:", "the confirmation has a title, a message, an optional note, Cancel and a confirm button (section 4), with no X."), ("Question:", "(a) Should the X be there? (b) If yes, does clicking it do the same as Cancel?")]),
 (20, "Q9", "The note on design board 7.2", [("What the design shows:", "the note on board 7.2 says a Part Library entry \"can be edited and deleted\" on its page. The board's picture shows no Delete."), ("What the page says:", "the page has no Delete button; Delete is in the \"Edit Library Part\" window (S11-R3), as your answer 12 confirmed."), ("Question:", "can you confirm the note on board 7.2 is out of date? Our tests follow the page.")]),
 (21, "Q10", "Long Part History entries", [("What the design shows:", "board 2.6 wraps a long event (for example a part number change ending \"| Changed at: <location>\") onto a second line. The engineering plan cuts it off with \"...\" instead. The page doesn't say."), ("Question:", "should a long entry (a) wrap onto more lines, or (b) be cut off with \"...\"? If (b), how does the user read the full entry?")]),
 (22, "Q11", "Who can open Parts → Returns today", [("What the page says:", "opening Parts → Returns and starting a vendor return \"keep the access today's 'Vendor Order Management' settings give\" (S9-N3a), without naming that access."), ("Question:", "(a) Can a role with no Vendor Order Management permission open Parts → Returns? (b) Can a role with Vendor Order Management → View, but not Create & Edit, start a vendor return? (c) Can any role reach a return's or a vendor credit's part search without Part Library & Inventory → View, so the access error of S9-N3 can be seen?")]),
 (23, "Q12", "Renaming a part to a look-alike at the same location", [("What the page says:", "Story 7 refuses a look-alike part number at this location with \"AB-100 already exists at this location.\" (S7-N3, S7-N5b). The new S13-N1a refuses a rename that matches a part at any location that stocks the part with \"AB-100 already exists at {location}.\""), ("Question:", "when a part is renamed to a look-alike of another part at the same location (for example ab 100 when AB-100 is stocked here), which message shows?")]),
 (24, "Q13", "When the other Part Library messages show", [("What the page says:", "six messages that name the shared list are renamed (S12-R11). We can reach \"This Part Library entry is in use and cannot be deleted.\" and \"Part Library entry not found.\" on screen."), ("Question:", "which screen action, if any, shows the others: (a) \"Part Library entry not found\" (no full stop); (b) \"Part Library entry not found for ID: {id}.\" and \"... for part number: {part number}.\"; (c) \"Part Library entry missing category.\"; (d) \"A part from the Part Library must have Vendor as its source.\"?")]),
 (25, "Q14", "Where a special order's cost shows", [("What the page says:", "a special-order result from two vendors uses the most recent delivery's vendor and cost (S12-R14b)."), ("Question:", "after picking the result in New Part Request, is the Cost field where its cost shows?")]),
 (26, "Q15", "A renamed part on an open work order line", [("What the page says:", "renaming keeps the line (S13-R18) and lists the open work that takes the new number: purchase order lines, part requests, canned jobs and returns (S13-R19). Work order part lines are not in that list, and the engineering plan leaves them unchanged."), ("Question:", "after a rename, does a work order line that already holds the part show the old number or the new one?")]),
 (27, "Q16", "A page opened before a role change", [("What the page says:", "without \"Part Library & Inventory → Delete\", status changes, deleting and tracking changes are refused (S8-N1 to S8-N3)."), ("Question:", "if an Admin removes that permission from a user's role while the user has the part page open, does the open page keep showing its old controls (Delete Part, Part Status, the tracking switch) until it is reloaded, with the save then refused?")]),
]
paras = []  # (text, kind, bold_prefix_len)
paras.append(("New questions, 27 October 2026", "H2", 0))
paras.append(("Dear Sir, thank you for your answers of 14 October. We have now updated all the Part Lifecycle test cases to your page as you edited it on 23 October (version 33), and checked the whole design again. These points are still open. Each one decides what a tester marks as pass or fail, and some tests wait for your answer. Could you please write your answer under each question? A short answer is perfect. The new questions have blue headings.", "P", 0))
for n, qid, title, rows in QS:
    paras.append((f"{n}. {title}", "H2", 0))
    for lab, txt in rows: paras.append((f"{lab} {txt}", "P", len(lab)))
    paras.append(("Answer:", "P", len("Answer:")))
paras.append(("Thank you very much, Sir.", "P", 0)); paras.append(("Bilal Muzamil", "P", 0))
def u16(s): return len(s.encode("utf-16-le")) // 2
text = "".join("\n" + p[0] for p in paras)
at = END - 1
reqs = [{"insertText": {"location": {"index": at}, "text": text}}]
start = at + 1; total = u16(text)
reqs.append({"updateParagraphStyle": {"range": {"startIndex": start, "endIndex": at + total}, "paragraphStyle": {"namedStyleType": "NORMAL_TEXT"}, "fields": "namedStyleType"}})
reqs.append({"updateTextStyle": {"range": {"startIndex": start, "endIndex": at + total}, "textStyle": {}, "fields": "bold,italic,foregroundColor"}})
pos = start; intro_at = None
for t, kind, bl in paras:
    L = u16(t)
    if kind == "H2":
        reqs.append({"updateParagraphStyle": {"range": {"startIndex": pos, "endIndex": pos + L}, "paragraphStyle": {"namedStyleType": "HEADING_2"}, "fields": "namedStyleType"}})
        reqs.append({"updateTextStyle": {"range": {"startIndex": pos, "endIndex": pos + L}, "textStyle": {"foregroundColor": BLUE}, "fields": "foregroundColor"}})
    elif bl:
        reqs.append({"updateTextStyle": {"range": {"startIndex": pos, "endIndex": pos + u16(t[:bl])}, "textStyle": {"bold": True}, "fields": "bold"}})
    if t.startswith("Dear Sir, thank you"): intro_at = pos
    pos += L + 1
out = {"requests": reqs, "writeControl": {"requiredRevisionId": REV}, "intro_at": intro_at,
       "map": {str(n): qid for n, qid, *_ in QS}}
json.dump(out, open(sys.argv[3] if len(sys.argv) > 3 else "requests.json", "w"), ensure_ascii=False, indent=1)
print("requests", len(reqs), "| chars", total, "| intro at", intro_at)
