"""The Bill To question sheet for Chris Ward, 10 Nov 2026. Same layout as the Technician Toggle sheet (1nLKkg...): title, greeting,
colour guide, header, one row per question. Rows come from ../PO-QUESTIONS-DRAFT.md questions 1-15 (1-3 from the PRD and stories,
4-15 from the design)."""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
MD = open(f"{P}/PO-QUESTIONS-DRAFT.md").read().split("\n## Points checked")[0]
TITLE = "Bill To – questions for Chris Ward (10 Nov 2026)"
GREET = ("Hi Chris, we are writing the Bill To test cases from the feature spec (version 0.5, 6 Nov), its Jira stories (SV-12303 to "
         "SV-12321) and the design \"Bill To design\", and found the points below that only you can decide. Please write your "
         "answer in the yellow column (a letter such as (a) is enough).")
TOPIC = ["Locked Bill To, a user with only one of the two permissions", "Credit Hold banner on an invoiced work order",
         "Credit Hold and Over Limit badges on a part sale", "Order of the Bill To list", "Close button on the locked Bill To message",
         "Cancel button in the Bill Invoices To window", "Button order in \"Remove as default Bill To\"", "Phone number on legacy invoices",
         "Long Bill To name on the work order", "Bill To column width on the asset's Work Orders tab", "Where the locked Bill To tooltip appears",
         "Lists that open over the top bar", "Where the Credit Hold banner sits", "Bill To column, \"loaded row\" or \"at least one row\"",
         "AccountingHub change"]
WHERE3 = ["PRD v0.5 Story 5 (SV-12307), S5-N1 and S5-N2; S1-N2 for the \"or\" wording",
          "PRD v0.5 Story 7 (SV-12309), S7-N1, S7-N4 and S7-R11",
          "PRD v0.5 Story 7 (SV-12309), S7-R6 and S7-R11"]
ROWS = []
for m in re.finditer(r"\n## (\d+)\. Bill To, ([^\n]*)\n(.*?)(?=\n## \d+\. |\Z)", MD, re.S):
    n, head, body = int(m.group(1)), m.group(2), m.group(3)
    q = head.split(": ", 1)[1]; q = q[0].upper() + q[1:]
    know = re.search(r"\*\*What the PRD says now:\*\* (.*)", body).group(1).strip()
    where = WHERE3[n - 1] if n <= 3 else know.split(" Where: ", 1)[1]
    know = know.split(" Where: ", 1)[0]; where = where.replace(". the design", ". The design")
    opts = [l[2:].strip() for l in body.splitlines() if re.match(r"- \([a-c]\) ", l)]
    assert len(opts) >= 2, n
    ROWS.append([n, "Bill To: " + TOPIC[n - 1], q + "\n" + "\n".join(opts), know, where])
assert [r[0] for r in ROWS] == list(range(1, 16)), [r[0] for r in ROWS]
def values():
    v = [[TITLE, "", "", "", "", ""], [GREET, "", "", "", "", ""],
         ["Colour guide:", "Yellow = please write your answer here", "Blue = the topic", "Grey = where we found it", "", ""],
         ["", "", "", "", "", ""], ["#", "Topic", "Question for you", "What we know today", "Your answer", "Where we found it"]]
    return v + [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS]
if __name__ == "__main__":
    json.dump(values(), open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    for r in ROWS: print(r[0], r[1], "|", r[2][:80].replace("\n", " / "), "|", r[4][:60])
