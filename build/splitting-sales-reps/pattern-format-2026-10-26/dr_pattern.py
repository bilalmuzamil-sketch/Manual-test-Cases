#!/usr/bin/env python3
"""26 Oct 2026, Rule 117 fourteenth amendment (QA lead: "Yes, permanent, all suites"), DRAFT ONLY, nothing written to TestRail.
The six design-recheck cases live outside the library. Their fields before the pattern are before-dr.json (live bodies from
design-recheck-2026-10-20/applied/C<id>-after.json with the 26 Oct Scenario Preconditions of scenario-preconditions-2026-10-26/DR-PROPOSALS.json).
For each: the QA lead's pattern, built the same way as the library (authoring/pattern_lib.py): plain precondition bullets with the
Blocked line last, steps and results with the placeholders turned into plain names, each result as bullets, a blank paragraph, then
everything that sat below the results, byte for byte. Title, refs and every other field unchanged. Output: DR-PATTERN.json."""
import os, sys, re, json, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/authoring")
import pattern_lib as PL
from pattern_lib import ADMIN_P, REPS2_P, CUST_P, PICS
e = lambda s: html.escape(s, quote=False)
OLD = json.load(open(f"{D}/before-dr.json"))
SBR_WIN = "Open Reports > Sales By Representative in that browser window, with the date range set to today and Show Unassigned on."
SPLIT_AB = '"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B'
PAT = {
 "DR-01": dict(pre=[ADMIN_P, REPS2_P, f"Have a first work order with {SPLIT_AB}, and invoice it.",
                    "Have a second work order, open and not invoiced.", PICS, "Open the first work order in that browser window."],
               r={1: ['The labels read "Lead technician" and "Service advisor" (small second word, as on an invoiced card today).',
                      'Then come "Sales Representative - Labor" and "Sales Representative - Parts", with capital letters.',
                      "Each name sits below its label as plain text, as in the picture."]}),
 "DR-02": dict(pre=[ADMIN_P, REPS2_P, CUST_P, "Have an open, uninvoiced part sale for that customer.", PICS, "Open the part sale in that browser window."],
               r={1: ['The label reads "Sales representative", with a small "r" (not "Sales Representative").', "There is one field.",
                      "There is no + or remove x beside it."],
                  2: ["The hover look is the part sale field's own (box and arrow across the full width of the card, as in the picture).",
                      "No + or remove x appears."],
                  3: ["The field reads sales rep A.", 'Its label still reads "Sales representative".', "There is still no + and no remove x."]}),
 "DR-03": dict(pre=[ADMIN_P, REPS2_P, CUST_P,
                    "Have a part sale for that customer with Sales Representative set to sales rep A, one part and no labor, and invoice it today.",
                    PICS, SBR_WIN[:-1] + " and the Sales Type column turned on."],
               r={1: ['The part sale shows as one row with Sales Type "Part Sales".',
                      'In the Labor Delta, Labor Invoiced and Labor Margin columns each cell shows a dash ("—"), as in the picture (today\'s report, board 4.3, shows 0.00 and $0.00 there).']}),
 "DR-04": dict(pre=[ADMIN_P, REPS2_P, CUST_P,
                    f"Have a work order for that customer with one labor line, one part, {SPLIT_AB}, and invoice it today.", PICS, SBR_WIN]),
 "DR-06": dict(pre=[ADMIN_P, "Have a second location open to you, and select both locations in the Location filter so that the report shows its Location column.",
                    REPS2_P, f"Have a work order at the test location with {SPLIT_AB}, and invoice it today.", PICS, SBR_WIN],
               r={1: ["A Sales Type column appears.",
                      "Read from Status to the first money column, the headings read Status, Sales Type, Location, in that order (the picture of board 4.9 shows Sales Type straight after Status)."]}),
 "DR-07": dict(pre=[ADMIN_P, REPS2_P, CUST_P,
                    f"Have a work order for that customer with labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00, {SPLIT_AB}, and invoice it today.",
                    PICS, SBR_WIN],
               r={1: ["The work order's invoice shows one Labor row under sales rep A.", "Its Adjustments reads ($30.00) (600 ÷ 1,000 × 50).",
                      "The $30.00 shop supplies sit on the Labor row."],
                  2: ["The work order's invoice shows one Parts row under sales rep B.",
                      "Its Adjustments reads ($20.00) (400 ÷ 1,000 × 50): each row shows only its own share."],
                  3: ["The CSV shows the same two shares under Adjustments.", "The $30.00 discount share is on the Labor row and the $20.00 share on the Parts row."]}),
}
def old_parts(f):
    pre = [tuple((html.unescape(x.replace("<br>", "\n")).split("\n") + [None])[:2]) for x in re.findall(r"<li>(.*?)</li>", f["custom_preconds"], re.S)]
    steps = [html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", f["custom_steps"], re.S)]
    ul = f["custom_expected"].split("<ul>", 1)[1].split("</ul>", 1)[0]
    res = [html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", ul, re.S)]
    return pre, steps, res
out, probs = {}, []
for k, v in OLD.items():
    f = v["fields"]; pre0, steps0, res0 = old_parts(f); L = PAT[k]
    names = PL.default_names(" ".join([a for a, _ in pre0] + steps0 + res0))
    steps = [PL.sub(x, names) for x in steps0]
    res = [L.get("r", {}).get(i) or PL.split_bullets(PL.sub(x[len(f"Step {i}: "):], names)) for i, x in enumerate(res0, 1)]
    pre = []
    for x in L["pre"]: pre += PL.pics_p(pre0) if x == PICS else [x]
    pre.append(PL.BLOCKED_P)
    new = dict(f)
    new["custom_preconds"] = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in pre) + "</ul>"
    new["custom_steps"] = "<ol>" + "".join(f"<li>{e(x)}</li>" for x in steps) + "</ol>"
    tail = f["custom_expected"].split("</ul>", 1)[1]
    new["custom_expected"] = ("<p><strong>Expected Result</strong></p>"
                              + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(res, 1))
                              + "<p></p>" + tail)
    out[k] = {"case_id": v["case_id"], "fields": new, "names": names,
              "why": "Rule 117 fourteenth amendment (26 Oct 2026): the QA lead's pattern. Preconditions, steps and expected results rewritten; everything below the results byte for byte as before; title and refs unchanged."}
json.dump(out, open(f"{D}/DR-PATTERN.json", "w"), indent=1, ensure_ascii=False)
print("design-recheck cases in the pattern:", len(out))
