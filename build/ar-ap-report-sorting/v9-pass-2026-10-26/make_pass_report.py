#!/usr/bin/env python3
"""Full pass against PRD version 9 and Chris Ward's answers 1 to 16, 26 Oct 2026 (Rules 122, 134): render PASS-REPORT.md.
Every case gets one verdict. The per-part record (title, preconditions, "For example" lines, steps, results, notes, quotes, From lines, build
line, References from Design, marker, refs, setup recipe, run membership) is computed, not asserted: each part of the case as it stood before
this pass (git commit 70ebead7e, after the Rule 136 pass of 22 Oct 2026) is compared with the part as it stands now. CONFIRMED means
byte-identical.
Verdicts: CONFIRMED = every part identical except the "From:" line, which is re-stamped (PRD version 9, read 26 Oct 2026) because every quote was
re-checked word for word against version 9 and is unchanged · CHANGE = any other part differs (reason given) · NEW CASE · DELETED (QA lead's
go-ahead, 26 Oct 2026; snapshots in deleted/).
python3 make_pass_report.py   (run authoring/build.py and authoring/render_setup.py first)"""
import os, sys, re, json, csv, subprocess, importlib
from collections import Counter
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); A = f"{P}/authoring"
sys.path.insert(0, A)
import ar_lib as L
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(m)
import design_data as DD
BEFORE = "70ebead7e"
REPO = os.path.dirname(os.path.dirname(P))
def git(path): return subprocess.run(["git", "-C", REPO, "show", f"{BEFORE}:build/ar-ap-report-sorting/{path}"], capture_output=True, text=True, check=True).stdout
old = json.loads(git("authoring/proposals.json")); new = json.load(open(f"{A}/proposals.json"))
def recipes(t):
    return {m.group(1): m.group(0) for m in re.finditer(r"^### SETUP-(\S+) — .*?(?=^### SETUP-|^## 6\.)", t, re.S | re.M)}
old_rec = recipes(git("AR-AP-SETUP-FILE.md")); new_rec = recipes(open(f"{P}/AR-AP-SETUP-FILE.md").read())
CID = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
BY = {c["key"]: c for c in L.CASES}

def parts(f):
    pre, exp = f["custom_preconds"], f["custom_expected"]
    items = re.findall(r"<li>(.*?)</li>", pre)
    state = [i.split("<br>")[0] for i in items]; exm = [i.split("<br>", 1)[1] for i in items if "<br>" in i]
    res_html = exp.split("<p><strong>Exact quotes")[0]
    res = re.findall(r"<li>(.*?)</li>", res_html.split("</ul>")[0])
    notes = re.findall(r"<p>(.*?)</p>", res_html.split("</ul>", 1)[1]) if "</ul>" in res_html else []
    q = exp.split("<p><strong>Exact quotes from the source (for reproducibility)</strong></p>")[1].split("<p></p><p><strong>References from Design")[0]
    return {"title": f["title"], "preconditions": state, "for-example lines": exm, "steps": re.findall(r"<li>(.*?)</li>", f["custom_steps"]),
            "results": res, "notes": notes, "quotes": re.findall(r"<li>(.*?)</li>", q), "From lines": re.findall(r"<p>(From: .*?)</p>", q),
            "build line": re.findall(r"<p>((?:The build|Last checked)[^<]*)</p>", q),
            "References from Design": exp.split("<p><strong>References from Design</strong></p>")[1].rsplit("<p>AUTOMATION", 1)[0],
            "marker": re.findall(r"<p>(AUTOMATION: [^<]*)</p>$", exp), "refs": f["refs"]}
ORDER = ["title", "preconditions", "for-example lines", "steps", "results", "notes", "quotes", "From lines", "build line",
         "References from Design", "marker", "refs", "setup recipe", "run membership"]
def in_run(marker): return not (marker.startswith("AUTOMATION: HOLD - waiting on the PO") or marker == L.DESIGN_HOLD)

# ---- the reasons: explicit for every case whose content was rewritten; the automatic parts (which quote changed, which design difference was
# closed, Title Case headings, scrolling) are added to every changed case from the comparison itself
WHY = {
 "S1-01": "S1-R8 (answer 5): the next customers load as you scroll, no page buttons; step 2's \"use the page controls\" became \"scroll down until they load\".",
 "S1-02": "As S1-01 (A/P Summary).",
 "S1-07": "PRD v9 S1-R4 now carries the example (Chris Ward's answer 1): \"Emile's Towing\" before \"Émile's Towing\". The case uses the PRD's names, its question note is gone (question 1 answered) and the result says the unaccented name comes first in the plain lower-cased name.",
 "S1-10": "PRD v9 S1-R6 and S2-R4 (answers 12 and 14): same-day rows in document-number order whatever the time of day. The precondition now asks for the higher-numbered invoice to be invoiced earlier that day, so time order and number order differ; a note says the current build orders by time of day (a build bug, no ticket number known). Twin of the deleted design version D-79.",
 "S1-11": "As S1-10 (A/P Unpaid Invoices; bills entered at different times).",
 "S1-12": "A/R Detail's opening column is \"Customer Full Name\" (Title Case, S2-R4a).",
 "S1-16": "RELEASED. PRD v9 S1-R2 adds this very example (\"#1 Diesel\", \"-1 Diesel\", \"10 Trucking\", \"@Home Towing\"; Chris Ward's answer 16): the case already expected it. Hold marker replaced by the normal one; the note now says the build may follow the tech plan's order until engineering matches the PRD (no ticket number known).",
 "S2-10": "PRD v9 S2-R2 and S2-R4 (answers 2 and 3): ID opens smallest number first, the second click largest first, and tied rows keep smallest number first in both directions. Step 1 now names the direction, and a fourth step reverses the date sort to check that the tie order does not reverse. The question note is gone.",
 "S2-14": "As S2-10 (A/R Collection).", "S2-18": "As S2-10 (A/P Detail, No.).", "S2-22": "As S2-10 (A/P Unpaid Invoices, No.).",
 "S2-29": "S1-R8 (answer 5): \"Go to the next page (or scroll ...)\" became \"Scroll down until the next 30 customers load\"; the title says scrolling; S1-R8 quoted; the question 5 note is gone.",
 "S2-30": "Title says scrolling (S2-R7 v9: \"loading more rows by scrolling\"); A/R Detail headings in Title Case (\"Open Balance\").",
 "S2-31": "As S2-29 (A/R Collection; \"Open Balance\" in Title Case).", "S2-32": "As S2-29 (A/P Summary).",
 "S2-33": "Title says scrolling (S2-R7 v9).", "S2-34": "As S2-29 (A/P Unpaid Invoices).",
 "S2-35": "RELEASED. PRD v9 S2-R7 (Chris Ward's answer 6): changing the Past due filter keeps the sort. Hold marker and question note removed; the starting screen now has the customer's group open so step 1 can be seen; step 2 says every group collapses (S4-N1, quoted); the precondition asks for two invoices 31 to 60 days past due with different balances so the kept sort is visible; \"Open Balance\" in Title Case.",
 "S3-09": "PRD v9 S3-R8 (answer 7): the CSV starts with the filter lines, each in its own row, in the order As of, Locations, Past due, Customers, then the heading row; step 6 now says so and S3-R8 is quoted.",
 "S3-10": "As S3-09 (A/R Detail).", "S3-11": "As S3-09 (A/R Collection).", "S3-12": "As S3-09 (A/P Summary).", "S3-13": "As S3-09 (A/P Detail).",
 "S3-14": "As S3-09 (A/P Unpaid Invoices).",
 "S3-15": "PRD v9 S3-R8: the CSV's As of, Locations and Customer rows each on their own row, then the heading row; step 5 says so; S3-R8 quoted.",
 "S3-16": "As S3-15 (A/P Detail).",
 "S3-17": "PRD v9 S3-R5 (Chris Ward's answer 7): several ticked locations are listed in the Location menu's A to Z order, separated by a comma and a space. The case (which followed the tech plan's tick order) now expects {Location-A} then {Location-C}; title and results rewritten; the note says the build may follow the plan's tick order (no ticket number known).",
 "S3-18": "PRD v9 S3-R8 and S3-R8b (answer 8): the CSV starts with the As of and Locations rows, and the heading row reads the on-screen headings letter for letter; S3-R8b quoted.",
 "S3-19": "As S3-18 (A/P Summary).",
 "S3-20": "PRD v9 S3-R8b (answer 8): the CSV headings are named (\"Aging Bucket\", \"Customer Full Name\") and the bucket values are the screen's bucket names; S3-R8 (filter rows first). The precondition now gives each document's bucket (31-60 and 1-30 days past due) and the date as an example; the question 8 note is gone.",
 "S3-21": "As S3-20 (A/R Collection: \"Customer\" column).", "S3-22": "As S3-20 (A/P Detail: \"Aging Bucket\", \"Vendor Name\").",
 "S3-23": "As S3-20 (A/P Unpaid Invoices: \"Vendor Name\").",
 "S4-05": "S1-R8 (answer 5): later groups load as you scroll; step 2 no longer offers a next page; S1-R8 quoted; the question 5 note is gone.",
 "S4-06": "As S4-05 (A/P Unpaid Invoices).",
 "S4-13": "S1-R8 (answer 5): no page buttons, so \"paging\" became scrolling: title, precondition (\"among the first 30\"), both steps and results rewritten; S1-R8 quoted; the question 5 note is gone.",
 "S4-14": "As S4-13 (A/P Unpaid Invoices).",
 "S5-29": "PRD v9 S5-R13 now says the vendor search box shows only above 8 vendors: the precondition quotes the PRD's rule and the tech plan quote (D18) is dropped (TP-30 now CONFIRM).",
 "S5-30": "Rule 135: step 4 ticked two ranges at once; now one tick per step (\"Past due: 3 ranges\", then \"Past due: 4 ranges\"). The old step 5 (untick all four, a bundled action) is left out: \"Past due: Any\" in the resting style is checked by S5-01 to S5-06 and the ticked \"Any\" row by step 1.",
 "S5-31": "As S5-30 (A/P Summary).",
 "S6-01": "PRD v9 S2-R4a and Out of Scope (answer 4): \"Customer Full Name\" keeps its name in Title Case; the old parenthesis about today's spelling is gone.",
 "S7-02": "\"Open Balance\" in Title Case (S2-R4a).",
 "S7-03": "PRD v9 S7-R3 (answer 11): the prompt's buttons are \"Cancel\" on the left and \"Switch location\" (small l) on the right, with a close × at the top right; step 1's result says so; a note says the current build writes \"Switch Location\" with a capital L (answer 11: a build bug, no ticket number known). Twin of the deleted design version D-76.",
 "S7-04": "As S7-03 (part sale message).",
 "DATA-01": "S1-R8 (answer 5): 30 at a time, more as you scroll, no page buttons. Title, steps 3 to 5 and 7 rewritten to scrolling; the Past due step that ticked two ranges is now two steps (Rule 135); results renumbered (10 steps, kept whole: every step checks the list built by the earlier ones, Rule 136); the question 5 note is gone.",
 "DATA-02": "As DATA-01 (A/P Summary).", "DATA-03": "As DATA-01 (A/R Collection).", "DATA-04": "As DATA-01 (A/P Unpaid Invoices).",
 "DATA-01b": "S1-R8: title and step 4 say scrolling (\"not only those loaded\"); S1-R8 quoted; the question 5 note is gone.",
 "DATA-02b": "As DATA-01b.", "DATA-03b": "As DATA-01b.", "DATA-04b": "As DATA-01b.",
 "DATA-09": "\"Open Balance\" in Title Case (A/R Detail).", "DATA-10": "\"Open Balance\" in Title Case (A/R Collection).",
 "DATA-14": "RELEASED and rewritten (Rule 116). PRD v9 S5-R18a (Chris Ward's answer 9): with Past due on Any, A/R Summary's Totals equal A/R Detail's Open Balance totals bucket by bucket; the Amount column is not compared. New exact data (two customers, five invoices, one partly paid, at two locations), both sides computed: $1,000.00 / $300.00 / $900.00 / $0.00 / $250.00, Total $2,450.00, then $2,150.00 with one location. Hold marker removed.",
 "DATA-15": "As DATA-14 (A/P Summary and A/P Detail, bills).",
 "DATA-22": "PRD v9 S5-R18b (answer 9) now states the freshness rule: the case quotes it instead of the tech plan (TP-04 now CONFIRM); the note about question 9 and production lag is replaced by why the case reloads (going away and back within 30 seconds can show the earlier figures).",
 "D-04": "A/R Detail headings in Title Case (S2-R4a, quoted); the question 4 note is gone (DD-06 closed); step 5 says \"Transaction Type\".",
 "D-07": "As D-04 (A/R Collection).", "D-04b": "Title and steps: \"Open Balance\" (Title Case); question 4 note gone.", "D-07b": "As D-04b (A/R Collection).",
 "D-01": "S2-R4a quoted (step 3 reads the headings letter for letter).", "D-10": "S2-R4a quoted.", "D-13": "S2-R4a quoted.", "D-16": "S2-R4a quoted.",
 "D-32": "PRD v9 S5-R13 (more than 8 vendors) replaces the tech plan quote; the precondition quotes the PRD's rule.",
 "D-39": "PRD v9 S7-R3 (answer 11): \"Cancel\" left, \"Switch location\" right, close × top right; step 1 result rewritten; the capital-L build note added.",
 "D-40": "As D-39 (part sale).",
 "D-56": "A/R Collection headings now checked letter for letter in Title Case (S2-R4a); \"Open Balance\".",
 "D-63": "A/R Detail headings now checked letter for letter in Title Case.",
 "D-64": "PRD v9 S7-R3 (answer 11): the dialog's button order and × match the picture; only the capital L differs, and the PRD's small l is right; the capital-L build note added.",
 "D-67": "A/R Detail header row in Title Case.",
 "D-68": "DD-03 ruled (answer 13): no Totals row; the picture will be corrected.",
 "D-73": "DD-02 settled by PRD v9 S5-R13 (\"Search vendors\", box only above 8 vendors); tech plan quote dropped; the result names the picture's \"Search vendor\" as wrong.",
 "D-81": "RELEASED as a normal design case (Chris Ward's answer 4, PRD v9 S2-R4a: Title Case, as the design shows). Retitled \"... are in Title Case\"; one action per step (open A/R Collection, then read); quotes S2-R4a, WC-11, S2-R1 and Out of Scope from version 9; normal marker; joins the run.",
}
NEW_WHY = {
 "S2-40": ("S2", "PRD v9 S2-R4a, S3-R8b, What changes (WC-11): A/R Detail headings in Title Case on screen, in the PDF and in the CSV."),
 "S2-41": ("S2", "As S2-40 (A/R Collection; CSV adds \"Customer\" and \"Phone\")."),
 "S2-42": ("S2", "As S2-40 (A/P Detail: the A/P headings, and the PDF the A/P reports gain)."),
 "S5-39": ("S5", "PRD v9 S5-R13 (question 12): the Vendor menu has no search box with 8 vendors or fewer (the other half of the more-than-8 rule)."),
 "S7-20": ("S7", "PRD v9 S7-R3 and S7-R5 (Chris Ward's answer 11): the close × closes the prompt like Cancel and leaves the report exactly as it was."),
 "DATA-23": ("DATA", "PRD v9 S5-R18a (answer 9, Rule 116): with a Past due filter A/R Summary and A/R Detail Totals differ, by exactly what the Detail leaves out ($2,300.00 vs $750.00, difference $1,550.00 itemised)."),
 "DATA-24": ("DATA", "As DATA-23 (A/P Summary and A/P Detail)."),
}
DELETED = {"D-76": ("C715558", "the design's switch prompt (\"Switch Location\" with a capital L); lost to answer 11 / PRD v9 S7-R3. Twins: S7-03, S7-04, S7-20, D-39, D-40, D-64."),
           "D-77": ("C715559", "the design's \"Search vendor\" placeholder; lost to PRD v9 S5-R13 (\"Search vendors\"). Twins: S5-29, D-32, D-73, S5-39."),
           "D-78": ("C715560", "the design's $0.00 Totals row with No locations; lost to answer 13 (no Totals row). Twins: S5-14, D-68, S3-24, S6-03."),
           "D-79": ("C715561", "same-day invoices in time order; lost to answers 12 and 14 / PRD v9 S1-R6, S2-R4 (number order). Twins: S1-10, S1-11."),
           "D-80": ("C715562", "links at regular weight; lost to answer 15 (semi-bold, S7-R7). Twins: D-01c, D-04c, D-07c, D-10c, D-13c, D-16c and the dark-theme cases.")}

def labels(qs): return {re.sub(r"</?strong>", "", x).split(":", 1)[0]: x for x in qs}
def auto(o, n):
    out = []
    lo, ln = labels(o["quotes"]), labels(n["quotes"])
    ch = sorted(k for k in set(lo) & set(ln) if lo[k] != ln[k])
    add = sorted(set(ln) - set(lo)); rem = sorted(set(lo) - set(ln))
    if ch: out.append("quote re-taken from PRD v9: " + " · ".join(ch))
    if add: out.append("quote added: " + " · ".join(add))
    if rem: out.append("quote removed: " + " · ".join(rem))
    if o["References from Design"] != n["References from Design"]:
        ids = sorted(set(re.findall(r"Difference from the PRD \((DD-0\d)\), closed", n["References from Design"])))
        out.append("References from Design: " + (", ".join(ids) + " now closed with Chris Ward's ruling (Rule 130 item 3)" if ids else "rewritten"))
    t_o = " ".join(o["steps"] + o["results"] + [o["title"]]); t_n = " ".join(n["steps"] + n["results"] + [n["title"]])
    if re.search(r"Open balance|Due date|Transaction type|Customer full name", t_o) and not re.search(r"Open balance|Due date|Transaction type|Customer full name", t_n):
        out.append("A/R headings in Title Case (S2-R4a)")
    if o["refs"] != n["refs"]: out.append(f"refs {o['refs']} → {n['refs']} (stories of the quotes)")
    return "; ".join(out)

rows = []
for c in L.CASES:
    k = c["key"]; n = parts(new[k]["fields"]); mk = c["marker"]
    if k not in old:
        rows.append((k, "—", "NEW CASE", NEW_WHY[k][1], None)); continue
    o = parts(old[k]["fields"])
    rec = {p: ("CHANGED" if o[p] != n[p] else "CONFIRMED") for p in o}
    rec["setup recipe"] = "CHANGED" if old_rec.get(k) != new_rec.get(k) else "CONFIRMED"
    rec["run membership"] = "CHANGED" if in_run(o["marker"][0]) != in_run(mk) else "CONFIRMED"
    content = [p for p in ORDER if rec.get(p) == "CHANGED" and p not in ("From lines", "setup recipe")]
    v = "CHANGE" if content else "CONFIRMED"
    a = auto(o, n)
    if v == "CHANGE":
        why = (WHY.get(k, "") + (" " if k in WHY and a else "") + (("[" + a + "]") if a else "")).strip()
        if not why: raise SystemExit(f"{k} changed without a reason")
    else:
        if k in WHY: raise SystemExit(f"{k} has a reason but nothing changed")
        why = "Re-read whole against PRD v9 and the answers; nothing changes. From line re-stamped (version 9, read 26 Oct 2026); quotes word for word unchanged."
    rows.append((k, CID.get(k, "—"), v, why, rec))
for k in DELETED: rows.append((k, DELETED[k][0][1:], "DELETED", DELETED[k][1], None))
cnt = Counter(r[2] for r in rows)
released = [k for k in ("S1-16", "S2-35", "DATA-14", "DATA-15", "D-81")]
link = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})" if cid != "—" else "not in TestRail yet"

W = ["# Full pass against PRD version 9 and Chris Ward's answers — every case, one verdict, a per-part record (26 Oct 2026, Rules 122, 134)", "",
     "QA lead, 26 Oct 2026: Chris Ward answered all 16 questions (23 Oct 2026); \"Full pass\" chosen (Rule 122 as amended). Drafted only: nothing was written "
     "to TestRail, Jira, Slack or Google, and nothing was committed. The five deletions below were done by the coordinator with the QA lead's go-ahead.", "",
     "## Reading coverage (Rule 119)", "", "| Source | Size | Read |", "|---|---|---|"]
def fsz(p):
    return os.path.getsize(p), sum(1 for _ in open(p, encoding="utf-8", errors="replace"))
for p, what, how in [
    (f"{P}/sources/CONFLUENCE-947650561-v9-2026-10-26.md", "PRD \"A/R and A/P Report Sorting, Export and Location Filter\", Confluence 947650561, version 9 (23 Oct 2026 15:26 UTC)", "100%: every line read in full, in three chunks (lines 1–200, 200–420, 420–612), 26 Oct 2026"),
    (f"{P}/questions-2026-10-22/chris-answers-2026-10-26.json", "Chris Ward's answers 1 to 16 (sheet column E, rows 6–23)", "100%"),
    (f"{P}/sources/PRD-DIFF-v5-to-v9.json", "Script diff of the requirement lines, v5 → v9 (15 changed, 4 new, 0 removed)", "100%"),
    (f"{P}/sources/CONFLUENCE-947650561-v5-2026-10-22.md", "PRD version 5 (what the cases quoted before)", "compared with v9 by script, line by line, including every non-requirement line (below)"),
    (f"{P}/questions-2026-10-22/QUESTION-SHEET-2026-10-22.md", "Our question-to-case mapping", "100%")]:
    sz, ln = fsz(p); W.append(f"| {what} (`{os.path.relpath(p, P)}`) | {sz:,} bytes, {ln} lines | {how} |")
W += ["| Every case module (`authoring/cases_s1.py` … `cases_design.py`, `common.py`, `ar_lib.py`, `design_data.py`, `tech_plan.py`) | 356 cases now | 100%: every case read whole before its verdict |",
      "| Rules: `LESSONS-REGISTER.md` (L-01 to L-09); `RULES-61-96.md` Rules 113, 114, 115, 116, 117 (all twelve amendments), 122, 130, 134, 135, 136; `IDEAL-TEST-CASE-STANDARD.md`; `TOKEN-DISCIPLINE-CHARTER.md` | repo | 100% of those sections |",
      "| Tech plan (`sources/Tech-Plan-AR-AP-2026-10-22-upload.md`) | unchanged since it was read in full on 22 Oct 2026 (same file in git) | not re-read; its 84 statements re-checked against PRD v9 (`authoring/tech_plan.py`, V9 block); every quote still verified word for word by the build |",
      "| Design canvas (`design-2026-10-22/`) | unchanged since it was driven on 22 Oct 2026 | not re-driven (brief: \"already driven\"); text inventory re-run (794 texts, 0 unclassified), visual inventory rows for DD-01 to DD-06 updated, `spec_to_design_check.py` re-run on PRD v9: 37 PRD words not drawn, 0 open in the register |",
      "| Jira stories SV-11531 … SV-11539 | — | not re-read in this pass (Chris Ward's answer 10: the PRD wins; the stories will be brought in line). Open point below. |", "",
      "## The non-requirement text of version 9 (diffed by script against version 5)", "",
      "- Status line: \"Ready for tech plan - 2026-10-19\" → \"Ready for development - 2026-10-22\" (no case effect).",
      "- What changes for existing users: one new bullet, \"The A/R column headings change to Title Case, as on the A/P reports and the other reports: …\" — now named item WC-11 in `ar_lib.py`, quoted by S2-40, S2-41 and D-81.",
      "- Out of Scope: \"Renaming columns other than Location.\" now reads \"Only the capitals change (S2-R4a): A/R keeps \"ID\" and \"Customer Full Name\" …\" — OOS-3 re-quoted (S6-01, S6-02, D-81).",
      "- S2-R1's column sub-bullets for A/R Detail and A/R Collection are in Title Case — SUB quotes re-taken.",
      "- Change Log: 11 new rows of 23 Oct 2026, one per answered question; they restate the requirement changes and are never quoted (the parser takes each requirement line itself, first occurrence: checked, every code's quote starts with the requirement's own words).",
      "- User Feedback Summary, Business Case, Feature Overview, Goals, Key Decisions, Terminology, Assumptions: unchanged.", "",
      "## Counts", "", "| Verdict | Cases |", "|---|---|"]
for v in ("CONFIRMED", "CHANGE", "NEW CASE", "DELETED"): W.append(f"| {v} | {cnt.get(v, 0)} |")
W += [f"| of which RELEASED (held before, normal marker now) | {len(released)} |",
      f"| **Cases now** | **{len(L.CASES)}** (355 before − 5 deleted + {cnt.get('NEW CASE', 0)} new) |", "",
      "CONFIRMED means nothing in the case changes except its \"From:\" line, which every case carries and which now names version 9 and the 26 Oct read date: "
      "each quote was re-checked word for word against version 9 and is unchanged. A TestRail write of the pass therefore touches every case (the From line), and the "
      "changed cases also in their content.", "",
      "## Released cases", "", "| Key | C-id | What changed |", "|---|---|---|"]
for k in released: W.append(f"| {k} | {link(CID[k])} | {WHY[k]} |")
W += ["", "## Deleted (QA lead's go-ahead, 26 Oct 2026; done by the coordinator; snapshots in `deleted/`)", "", "| Key | C-id | Why | PRD-side twin checked |", "|---|---|---|---|"]
for k, (cid, why) in DELETED.items(): W.append(f"| {k} | {link(cid[1:])} | {why.split(' Twins: ')[0]} | {why.split(' Twins: ')[1]} — each present and expecting the PRD's version (read in this pass) |")
W += ["", "## New cases", "", "| Key | Section | Title | Marker | Source |", "|---|---|---|---|---|"]
for k, (sec, why) in NEW_WHY.items(): W.append(f"| {k} | {sec} | {BY[k]['title']} | `{BY[k]['marker']}` | {why} |")
W += ["", "S3-R8b needed no separate new case: the four CSV cases S3-20 to S3-23 were rewritten to check its headings and bucket values, and S2-40 to S2-42 check "
      "the CSV heading row in Title Case. S5-R18b is covered by DATA-22, rewritten to quote it. S2-R4a is quoted by S2-40 to S2-42, D-81 and the six 1440 px look cases (D-01, D-04, D-07, D-10, D-13, D-16).", "",
      "## Changed cases — the per-part record", "",
      "| Key | C-id | Why | " + " | ".join(ORDER) + " |", "|---|---|---|" + "---|" * len(ORDER)]
for k, cid, v, why, rec in rows:
    if v == "CHANGE": W.append(f"| {k} | {link(cid)} | {why} | " + " | ".join(rec[p] for p in ORDER) + " |")
W += ["", "## Every case", "", "| Key | C-id | Verdict | Reason |", "|---|---|---|---|"]
for k, cid, v, why, rec in rows: W.append(f"| {k} | {link(cid)} | {v} | {why} |")
open(f"{HERE}/PASS-REPORT.md", "w").write("\n".join(W) + "\n")
print("pass report:", dict(cnt), "| released", len(released))
