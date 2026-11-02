"""The Technician Toggle question sheet for Chris Ward, 2 Nov 2026. Same layout as the Credit terms sheet (15S4Giqs...): title, greeting,
colour guide, header, one row per question. Rows come from ../PO-QUESTIONS-DRAFT.md questions 1-8 (1-4 from the PRD, stories and tech
plan; 5-8 from the design)."""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
MD = open(f"{P}/PO-QUESTIONS-DRAFT.md").read()
TITLE = "Technician Toggle – questions for Chris Ward (2 Nov 2026)"
GREET = ("Hi Chris, we are writing the Technician Toggle test cases from the feature spec (version 17, 2 Nov), its Jira stories (SV-11879 to "
         "SV-11884) and the design canvas \"Technician Toggle\", and found the points below that only you can decide. Please write your "
         "answer in the yellow column (a letter such as (a) is enough).")
WHERE = ["PRD v17 Story 1 Error Handling and S5-N1; Jira SV-11879 (Story 1), SV-11883 (Story 5)",
         "PRD v17 S1-R8 and Key Decisions; Jira SV-11879 (Story 1)",
         "PRD v17 S3-R10 and S3-R3; Jira SV-11881 (Story 3)",
         "PRD v17 S3-R3 and S3-N1; Jira SV-11881 (Story 3)",
         "PRD v17 S1-R5; design page 3 \"When Technician can't be turned on\", picture \"Time Clock off\"; design page 2; Jira SV-11879",
         "PRD v17 S3-R8; Jira SV-11881; design page 6 \"Technician dropdowns on a work order\", picture \"Add Technician on a line\"",
         "PRD v17 S3-R10; the ShopView design system's empty-state rule (components.css) used by the design canvas; Jira SV-11881",
         "PRD v17 S1-R3; design page 2 \"Turn Technician on for a staff member\", New Staff Member pictures (Save & Add Next button)"]
ROWS = []


parts = re.split(r"\n## Question (\d+)\n", MD)
for i in range(1, len(parts), 2):
    n, b = int(parts[i]), parts[i + 1].split("\n## QA-only")[0].split("\n# ")[0]
    g = lambda lab: re.search(r"- \*\*" + re.escape(lab) + r":\*\* (.*)", b).group(1).strip()
    feat = g("Project / feature").split("— ", 1)[1]
    opts = [l[2:].strip() for l in b.splitlines() if re.match(r"- \([a-c]\) ", l)]
    q = g("The question"); q = q[0].upper() + q[1:]
    ROWS.append([n, "Technician Toggle: " + feat, q + "\n" + "\n".join(opts), g("What the PRD says now"), WHERE[n - 1]])
assert [r[0] for r in ROWS] == list(range(1, 9)), [r[0] for r in ROWS]
def values():
    v = [[TITLE, "", "", "", "", ""], [GREET, "", "", "", "", ""],
         ["Colour guide:", "Yellow = please write your answer here", "Blue = the topic", "Grey = where we found it", "", ""],
         ["", "", "", "", "", ""], ["#", "Topic", "Question for you", "What we know today", "Your answer", "Where we found it"]]
    return v + [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS]
if __name__ == "__main__":
    json.dump(values(), open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    for r in ROWS: print(r[0], r[1], "|", r[2][:90].replace("\n", " / "))
