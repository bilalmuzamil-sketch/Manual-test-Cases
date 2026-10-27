#!/usr/bin/env python3
"""27 Oct 2026, What/Why full pass ("OK now we do the same for WHy and WHY what you did for Parts life cycle"). Appends questions 9-14
to the What/Why question doc for Chris Ward (1QcT7FRZ…), at the bottom, in the doc's own shape (Heading 2 "N. title", bold labels,
"Answer:"), new headings in green (Rule 131: the doc's only colour so far is link blue). Writes requests.json; Chris's person chip
goes in a second call at the start of the intro paragraph. python3 build_requests.py <end_index> <revisionId>"""
import sys, json
END, REV = int(sys.argv[1]), sys.argv[2]
BLUE = {"color": {"rgbColor": {"red": 0.110, "green": 0.490, "blue": 0.220}}}  # green; name kept from the Parts Lifecycle builder
QS = [  # (doc no., our id, title, [(label, text)...])
 (9, "Q9", "The message for a Title that is too long", [("What the page says:", "the only message named for the Title box is \"Title is a required field\" (S1-R6), and the line window's checks are otherwise unchanged (S1-R7)."), ("What the developer's note says (19 October):", "a Title over 255 characters shows \"Title cannot be longer than 255 characters\" from the 256th character, and the line cannot be saved while it shows."), ("Question:", "(a) Is \"Title cannot be longer than 255 characters\" the message testers should expect? (b) Did the window show a length message before this change (for example \"Line Name cannot be longer than 255 characters\"), so this is only the new name?")]),
 (10, "Q10", "The Invoices import messages still use the old words", [("What the page says:", "the two fields are called Title and Description everywhere a person reads them (Feature Overview, first point)."), ("What the developer's note says (8 October):", "the Invoices import's messages for a row keep the old words: an empty *Line Title still gives \"Line name cannot be empty.\", and the length message mentions \"line description\"."), ("Question:", "(a) Should those import messages use the new names (Line Title and Line Description, or Title and Description) after this change? (b) Or are they left for a later release, so testers should expect the old words?")]),
 (11, "Q11", "A Title starting with =, +, - or @ in the downloaded report", [("What the page says:", "the values are carried as they were written (S3-R8, S3-R9)."), ("What the developer's note says (8 October):", "the downloaded Customer Invoice report has never protected against spreadsheet formulas. Now that a line no longer starts with \"What are you doing?: \", a Title that starts with =, +, - or @ opens as a formula in Excel."), ("Question:", "is that acceptable for this release, or should testers expect such a Title to open as plain text?")]),
 (12, "Q12", "An imported invoice in the Customer Invoice report", [("What the design shows:", "the \"Awkward inputs\" board lists a line \"Imported from a previous system\" among the texts that reach the books, reading \"Replace tie rod - excessive play\"."), ("What the page says:", "an imported invoice never reaches the live QuickBooks sync, and its text is unaffected whatever the import wrote (S3-R12)."), ("Question:", "(a) Does an imported invoice appear in the downloaded Customer Invoice report? (b) If it does, should its line read \"Title - Description\" like any other line, as the board shows? (c) If not, what should the report show for it? One test waits for your answer.")]),
 (13, "Q13", "How an empty ShopCoach cell looks", [("What the developer's note says:", "in the ShopCoach line builder, an emptied title or description cell shows \"What are you doing?\" or \"Why are you doing it?\" in grey italic letters."), ("What the page and the design say:", "nothing about how the empty cell looks."), ("Question:", "should testers expect grey italic letters there, or is the look of the empty cell not part of this change?")]),
 (14, "Q14", "The \"Scope of work\" heading when a line has no tech story", [("What the page says:", "on the modern invoice the tech story prints under a \"Scope of work\" heading (section 3). When a line has no tech story, or it reads \"Tech story missing.\", the tech story is left out."), ("Question:", "is the \"Scope of work\" heading left out as well, so nothing prints under the description?")]),
]
paras = []  # (text, kind, bold_prefix_len)
paras.append(("New questions, 27 October 2026", "H2", 0))
paras.append(("Dear Sir, thank you for your answers of 14 October; we have used all eight. We have now checked every What/Why test case again against your page (version 15, 14 October), the four stories, the design and the engineering plan. These points are still open. Each one decides what a tester marks as pass or fail, and one test waits for your answer. Could you please write your answer under each question? A short answer is perfect. The new questions have green headings.", "P", 0))
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
