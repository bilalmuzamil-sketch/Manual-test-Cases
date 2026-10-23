"""The Credit terms question sheet for Chris Ward, 23 Oct 2026. Same layout as the A/R and A/P sheet (11_3z_TpKk...) and the Splitting
Sales Representatives sheet: title, greeting, colour guide, header, one row per question. Questions 1-7 come from the PRD
(authoring/po_questions.py, 8 dropped as answered by our own sources), questions 8-12 from the design
(design-2026-10-23/NEW-QUESTIONS.py design questions 1-5, renumbered; 5 dropped as settled by PRD v3)."""
import json, os, re, runpy, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/authoring"); from po_questions import QUESTIONS
DES = runpy.run_path(f"{P}/design-2026-10-23/NEW-QUESTIONS.py")["ROWS"]
T = "Credit terms: "
TITLE = "Credit terms – questions for Chris Ward (23 Oct 2026)"
GREET = ("Hi Chris, we are writing the Credit terms test cases from the feature spec (version 3, 22 Oct), its Jira stories (SV-11670 to "
         "SV-11681) and the design canvas \"Default Credit Terms\", and found the points below that only you can decide. Please write your "
         "answer in the yellow column (a letter such as (a) is enough).")
TOPIC = ["release day: a missing requirement number", "the order of \"any other term\" in the list",
         "a term renamed by someone else while my page is open", "\"(Inactive)\" on other screens",
         "Move Customers note for a deactivated term", "Move Customers note for an old spelling such as \"NET 30\"",
         "which term a changed invoice date uses"]
WHERE = ["PRD v3 (22 Oct 2026) Story 11, S11-R14 and S11-R16; Jira SV-11680 (Story 11)",
         "PRD v3 S1-R5; Jira SV-11670 (Story 1)",
         "PRD v3 S2-E2 and Story 2 Error Handling; Jira SV-11671 (Story 2)",
         "PRD v3 S5-R8; Jira SV-11674 (Story 5)",
         "PRD v3 S4-R11, S4-N3, S12-R3; Jira SV-11673 (Story 4), SV-11681 (Story 12)",
         "PRD v3 S4-R11, S11-E2; Jira SV-11673 (Story 4), SV-11680 (Story 11)",
         "PRD v3 S7-R7, S7-R8; Jira SV-11676 (Story 7)"]
def opt(o): return re.sub(r"^([A-Z])\)\s*", lambda m: f"({m.group(1).lower()}) ", o)
ROWS = []
for i, q in enumerate(QUESTIONS):
    _id, question, know, options, _qa = q
    ROWS.append([i + 1, T + TOPIC[i], question + "\n" + "\n".join(opt(o) for o in options), know.replace(chr(92) + chr(34), chr(34)), WHERE[i]])
for j, r in enumerate(DES):
    n, topic, question, know, where = r[0], r[1], r[2], r[3], r[4]
    ROWS.append([len(QUESTIONS) + j + 1, topic, question, know, where])
DESIGN_RENUMBER = {r[0]: len(QUESTIONS) + j + 1 for j, r in enumerate(DES)}  # design question N -> sheet question
def values():
    v = [[TITLE, "", "", "", "", ""], [GREET, "", "", "", "", ""],
         ["Colour guide:", "Yellow = please write your answer here", "Blue = the topic", "Grey = where we found it", "", ""],
         ["", "", "", "", "", ""], ["#", "Topic", "Question for you", "What we know today", "Your answer", "Where we found it"]]
    return v + [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS]
if __name__ == "__main__":
    json.dump(values(), open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    print(len(values()), "rows", DESIGN_RENUMBER)
