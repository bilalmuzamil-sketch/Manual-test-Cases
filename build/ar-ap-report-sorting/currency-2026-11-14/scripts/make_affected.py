"""Writes currency-2026-11-14/AFFECTED.json: each changed or new requirement (PRD v11 -> v13) -> the cases that quote it or whose steps or
results depend on it, with the verdict and the reason; every case whose quote was not word for word in v13 (before the pass: library and live;
after: quote-check.json); the candidates found by keyword and read, judged not dependent, with the reason."""
import json, csv, re, sys, os
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); import v13_layout as V
MAP = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
RAW = json.load(open(f"{W}/affected-raw.json")); QC = json.load(open(f"{W}/quote-check.json"))
v11 = open(f"{B}/sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.md").read(); v13 = open(f"{B}/sources/CONFLUENCE-947650561-v13-read-2026-11-13.md").read()
def line(md, code):
    m = re.search(r"^- \*\*" + re.escape(code) + r":\*\* (.*)$", md, re.M); return m.group(1) if m else None
def C(k): cid = MAP.get(k); return {"key": k, "case": f"C{cid}" if cid else "new, no C-id yet", "link": f"https://shopview.testrail.io/index.php?/cases/view/{cid}" if cid else None}
BEHAV = {
 "S1-21": "title and steps 3-4 say the next invoices SHOW as you scroll (v13: the rule sets only how many are shown at a time)",
 "S1-22": "title and steps 3-4 say the next bills SHOW as you scroll (same reason)", "DATA-27": "step 3: the 101st bill shows (same reason)",
 "D-25": "steps 1-2: the header chevron is blue, the same blue as the group chevrons", "D-26": "same as D-25", "D-27": "same as D-25", "D-28": "same as D-25",
 "D-52": "step 2: the header chevron is blue (the live case already says so, changed 12 Nov on the QA lead's instruction; kept)",
 "D-56": "step 1: the header chevron is blue", "D-59": "step 2: the header chevron is blue",
 "D-16": "vendor A's name bounded to 41-78 characters (step 4 expects no sideways scroll); step 5 adds: the group row does not wrap; new vendor B with & \" ' < > and step 7 (design checklist line 9)",
 "D-18": "vendor name bounded to 41-78 characters (step 3 expects no sideways scroll at 1536 px)",
 "D-58": "name bounded to 41-78 characters; step 2: bill rows wrap, the pinned group row stays on one line",
 "D-62": "names bounded to 41-78 characters; step 5 adds: each group row shows the whole name on one line",
 "S5-37": "rewritten top to bottom: it checked that a day after today cannot be picked (tech plan D20); v13 S5-R10b allows it. Now: A/P Detail, a bill due today moves to 1-30 days past due with Past Due 10 when the day 10 days after today is picked"}
WHAT = {"S1-R8": "Adds: the documents of an open customer or vendor may all arrive from the server in one request; the rule sets only how many are shown at a time.",
        "S4-R1": "Adds: the header chevron is blue, the same as each group's own chevron (S4-R5).",
        "S5-E3": "Adds: if none of the ticked locations is in the new list and the new list holds only one location, the chip is hidden (S5-N1) instead of reading \"Location: All locations\".",
        "S8-R3": "Adds one exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels."}
out = {"pass": "PRD v11 (5 Nov 2026) -> v13 (13 Nov 2026), 14 Nov 2026", "diff": "currency-2026-11-14/PRD-DIFF-v11-to-v13.txt (25 lines, read in full)",
       "changed": {}, "new": {}, "rewrite_set": sorted(V.REWRITE), "restamp_set": None}
for code in ["S1-R8", "S4-R1", "S5-E3", "S8-R3"]:
    rows = []
    for k in sorted(RAW["changed"].get(code, [])):
        rows.append(dict(C(k), verdict="CHANGE (rewritten top to bottom)", how="quotes it (full requirement line, now the v13 line)",
                         tester_text=BEHAV.get(k, "confirmed: no step or result depends on the added sentence; quote, From line and (where it cited the 22 Oct design read) the design read line changed")))
    out["changed"][code] = {"what_changed": WHAT[code], "v11": line(v11, code), "v13": line(v13, code), "cases": rows}
out["changed"]["S5-E3"]["new_case_for_added_clause"] = [dict(C("S5-41b"), why="the added clause (one location left, chip hidden) had no case; Rule 136 split part of S5-41")]
out["new"]["S3-R7b"] = {"v13": line(v13, "S3-R7b"), "already_covered_by": [dict(C("D-95"), note="Demo Day case (A/R Collection PDF, 120-letter no-space name); not changed")],
                        "new_cases": [C(k) for k in ["S3-33", "S3-34", "S3-35", "S3-36"]],
                        "depending_existing_cases": "none: no existing case states what a grouped PDF's total rows read (S3-18 to S3-23 are CSV cases; S4-09 to S4-12, D-56, D-62, D-63 are the screen's rows)"}
out["new"]["S5-R10b"] = {"v13": line(v13, "S5-R10b"), "depending_existing_cases": [dict(C("S5-37"), verdict="CHANGE (contradicted: rewritten top to bottom)", tester_text=BEHAV["S5-37"])],
                         "another_authors_cases_not_touched": [{"case": "C1078980", "title": "SV-12545 - A future as-of date can be picked to see coming aging"},
                                                               {"case": "C1078981", "title": "SV-12545 - A saved link with a future as-of date opens on that date"}],
                         "new_cases": [dict(C("S5-43"), why="the chip, PDF and CSV show the picked day: the PDF and CSV part is in no case (the chip part is in C1078980 and S5-37)")]}
out["not_word_for_word_in_v13"] = {"before_this_pass": RAW["not_verbatim_v13"], "after_this_pass": QC["fails"],
                                   "after_quotes_checked": QC["quotes"], "after_cases_checked": QC["cases"]}
out["candidates_read_not_dependent"] = {
 "S3-R7b": {"S3-18..S3-23": "CSV cases: 'no group header or subtotal row' is the CSV, not the PDF", "S4-09..S4-12": "the screen's pinned label", "DATA-20": "PDF row counting, unchanged", "D-56, D-62, D-63": "the screen's Total for rows, unchanged"},
 "S5-R10b": {"REL-03": "today's date in the evening (time zone), not a later day", "S1-17..S1-19": "an earlier date and the day after it, never after today", "S1-20": "a bill due after today, at today's as-of date"},
 "S5-E3": {"S5-10c, S5-11c": "the Location list narrows with the date (S5-R3); no ticked location leaves the list", "S3-09..S3-14, S5-26, S5-27, S5-32, S5-33, S5-34, S8-09": "an as-of date is set but no ticked location leaves the list"},
 "S8-R3 (not quoting, A/P Unpaid Invoices layout)": {"D-44, D-45": "PDF/CSV heading on one line", "D-49": "narrow-screen sideways scroll, unchanged"},
 "S8-R3 (quoting, tester text confirmed)": {"D-17": "dark theme: no sideways-scroll or wrap claim", "D-16b": "Open Balance pinned and bold only", "S4-12b": "a 1200 px window scrolls sideways anyway"},
 "S4-R1 (quoting, tester text confirmed)": {"S4-01..S4-06": "what the chevron does; its colour is checked in D-25..D-28, D-52, D-56, D-59"},
 "S1-R8": {"S1-01, S1-02, S3-03..S3-08, S4-23": "keyword hits only ('as', 'load' in other senses)"}}
P = json.load(open(f"{B}/authoring/proposals.json"))
out["restamp_set"] = sorted(k for k in P if k in MAP and k not in V.REWRITE and not ("D-82" <= k <= "D-95" and k.startswith("D-")))
out["counts"] = {"rewritten": len(V.REWRITE), "behaviour_changed_in_tester_text": len(BEHAV), "quote_only_rewrites": len(V.REWRITE) - len(BEHAV),
                 "restamped": len(out["restamp_set"]), "new": 6, "demo_day_untouched": 14}
json.dump(out, open(f"{W}/AFFECTED.json", "w"), indent=1, ensure_ascii=False)
print(out["counts"]); print({c: len(v["cases"]) for c, v in out["changed"].items()})
