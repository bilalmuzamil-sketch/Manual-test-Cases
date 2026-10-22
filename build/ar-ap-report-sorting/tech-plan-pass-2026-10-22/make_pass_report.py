#!/usr/bin/env python3
"""Tech plan pass, 22 Oct 2026 (Rule 134): render PASS-REPORT.md and TECH-PLAN-STATEMENTS.md.
Every case gets one verdict. The per-part record (title, preconditions, "For example" lines, steps, results, quotes, From lines, build
line, References from Design, notes, marker, refs, setup recipe, run membership) is computed, not asserted: each part of the case as it
stood before this pass (git commit 5f10e1005, the design pass) is compared with the part as it stands now. CONFIRMED means byte-identical.
python3 make_pass_report.py   (run authoring/build.py and authoring/render_setup.py first)"""
import os, sys, re, json, csv, subprocess, html
from collections import Counter
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); A = f"{P}/authoring"
sys.path.insert(0, A)
import importlib
import ar_lib as L
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(m)
import tech_plan as TP
BEFORE = "5f10e1005"
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
    froms = re.findall(r"<p>(From: .*?)</p>", q)
    quotes = re.findall(r"<li>(.*?)</li>", q)
    build = re.findall(r"<p>((?:The build|Last checked)[^<]*)</p>", q)
    design = exp.split("<p><strong>References from Design</strong></p>")[1].rsplit("<p>AUTOMATION", 1)[0]
    marker = re.findall(r"<p>(AUTOMATION: [^<]*)</p>$", exp)
    return {"title": f["title"], "preconditions": state, "for-example lines": exm, "steps": re.findall(r"<li>(.*?)</li>", f["custom_steps"]),
            "results": res, "quotes": quotes, "From lines": froms, "build line": build, "References from Design": design, "notes": notes,
            "marker": marker, "refs": f["refs"]}
ORDER = ["title", "preconditions", "for-example lines", "steps", "results", "quotes", "From lines", "build line", "References from Design",
         "notes", "marker", "refs", "setup recipe", "run membership"]
def in_run(marker): return not (marker.startswith("AUTOMATION: HOLD - waiting on the PO") or marker == L.DESIGN_HOLD)

WHY = {
 "S1-07": "TP-21 (D4): the tech plan says how two names that tie are ordered (lower-cased names as written, so Emile before Émile); PRD silent, no contradiction, so the case follows the plan (QA lead's ruling of 12 Aug 2026) and leaves the hold; question 1 stays open.",
 "S2-29": "TP-65: \"Go to the next page\" only; the paging cases already say \"or scroll until the next ones load\" and question 5 is open: same wording, so the step works either way (runnability, Rule 114).",
 "S2-31": "TP-65: on A/R Collection later groups arrive as the user scrolls (Phase 3 verification); step 3 now allows scrolling.",
 "S2-32": "TP-65: as S2-29 (A/P Summary).",
 "S2-34": "TP-65: as S2-31 (A/P Unpaid Invoices).",
 "S3-17": "TP-41 (D30): the tech plan says several locations keep the order they were ticked; PRD silent (question 7, part 1), no contradiction: the case now ticks two locations in a known order and checks it.",
 "S4-09": "TP-33 (D21, manual checklist 3): what the pinned row shows (chevron and label, no amounts) and a fast scroll that must not overlap the headings or the Totals row.",
 "S4-10": "TP-33 (D21, manual checklist 3): as S4-09, plus the pinned customer row carries \"Phone:\" and \"Credit term:\" (precondition for the AP/AR switch added).",
 "S4-11": "TP-33: as S4-09 (A/P Detail).",
 "S4-12": "TP-33: as S4-09 (A/P Unpaid Invoices).",
 "S5-16": "TP-11 (Q2, D13): a vendor has no single \"own location\"; the precondition now says where each bill was received, and the result compares two bills.",
 "S5-17": "TP-11 (Q2, D13): the credit that is not from a return is now said to be entered at {Location-A}; result wording says why it shows that location.",
 "S5-20": "TP-40 (D30): the address writes each location as its own \"locationIds=\" entry holding a code, not a name; the old step (add a location name with a comma) could not be done. Steps rewritten to get the codes and build a comma list.",
 "S5-21": "TP-39/TP-55 (D29, Phase 1 tests): the step now names where the location code sits; added the all-unknown link, which opens on All locations.",
 "S5-22": "TP-28 (D16): the step now names where the Past due value sits (\"pastDue=\") and what it reads (31-60).",
 "S5-24": "TP-42 (D31, API): the Customer menu lists at most 50 customers until you search, from all the organization's customers; the precondition now asks for that.",
 "S5-26": "TP-59/TP-60 (Phase 2 and 3): the reports are delivered family by family; a note tells the tester what a build with only the Summaries updated shows (Blocked, not Failed).",
 "S5-27": "TP-59/TP-60: as S5-26 (A/P).",
 "S5-29": "TP-30 (D18): the Vendor menu shows its search box only above 8 vendors; precondition added.",
 "S5-30": "TP-48 (Phase 1, fullSelectionNarrows): the \"Any\" row is ticked only while no range is; checked with none and with all four ticked.",
 "S5-31": "TP-48: as S5-30 (A/P Summary).",
 "S7-02": "TP-58 (Phase 3): the whole-row click, hand pointer and blue row text are removed on A/R Collection; hover step added.",
 "S7-05": "TP-50 (Phase 1): Cancel closes the prompt with no message; result added.",
 "DATA-05": "TP-68 (Phase 4): re-sorting keeps the bucket expanded and starts it again from its first 100 lines; the old step's \"expand it if it closed\" contradicted PRD S4-R8 and the plan.",
 "DATA-06": "TP-68: as DATA-05 (A/P Detail).",
 "DATA-20": "TP-79/TP-76: a 2,000-row PDF takes about 30 seconds, and a site may lack the PDF generator; result and note added.",
 "REL-03": "TP-26 (D9): the as-of line uses the location's time zone and writes the day without a leading zero; the evening condition and the result now say so.",
 "D-32": "TP-30 (D18): precondition of more than 8 vendors (search box).",
 "D-73": "TP-30 (D18): as D-32.",
 "D-77": "TP-30 (D18): as D-32 (held design-version case; stays held on question 12).",
}
NEW_WHY = {
 "S1-16": "TP-22 (DIVERGE): names that start with a punctuation mark; follows the PRD, held on question 16.",
 "S3-28": "TP-38 (D28): A/R Detail export with every bucket closed still downloads every row.",
 "S3-29": "TP-38 (D28): A/P Detail, the same.",
 "S3-30": "TP-81 (§9 Security): a name starting with \"=\" opens in the CSV as text, not as a formula.",
 "S5-35": "TP-39 (D29): an unknown customer in a link is ignored.",
 "S5-36": "TP-39 (D29): an unknown vendor in a link is ignored.",
 "S5-37": "TP-32 (D20): the As of date cannot be later than today.",
 "S5-38": "TP-08/TP-54 (NFR-005, D5): ticking several customers quickly ends with the rows for all of them.",
 "DATA-22": "TP-04 (NFR-001, D1, replica lag): a payment shows on reload (Rule 116 freshness).",
 "REL-11": "TP-40/TP-59 (D30, Phase 2): an old drill-down link (customerId / vendorId) still opens on its customer or vendor.",
 "REL-12": "TP-56 (regression re-runs): other reports keep or forget their filters as before.",
 "REL-13": "TP-56, TP-48: Sales By Customer's filter menus behave as before.",
}
TPS_FOR = {}
for st in TP.S:
    for k in st["cases"]: TPS_FOR.setdefault(k, []).append(st["id"])

rows, changed, confirmed = [], [], []
for c in L.CASES:
    k = c["key"]; n = parts(new[k]["fields"]); mk = c["marker"]
    if k not in old:
        rows.append((k, "—", "NEW CASE", NEW_WHY.get(k, ""), None)); continue
    o = parts(old[k]["fields"])
    rec = {p: ("CHANGED" if o[p] != n[p] else "CONFIRMED") for p in o}
    rec["setup recipe"] = "CHANGED" if old_rec.get(k) != new_rec.get(k) else "CONFIRMED"
    om = o["marker"][0]; rec["run membership"] = "CHANGED" if in_run(om) != in_run(mk) else "CONFIRMED"
    v = "CHANGE" if "CHANGED" in rec.values() else "CONFIRMED"
    if v == "CHANGE" and k not in WHY: raise SystemExit(f"{k} changed without a recorded reason")
    if v == "CONFIRMED" and k in WHY: raise SystemExit(f"{k} has a change reason but no part changed")
    why = WHY.get(k) or ("Re-read whole against the tech plan; nothing in it changes this case." + (" Confirmed by " + ", ".join(TPS_FOR[k]) + "." if k in TPS_FOR else ""))
    rows.append((k, CID.get(k, "—"), v, why, rec))
cnt = Counter(r[2] for r in rows)
link = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})" if cid != "—" else "not in TestRail yet"
W = []
W.append("# Tech plan pass — every case, one verdict, a per-part record (22 Oct 2026, Rule 134)")
W.append("")
W.append("Sources the cases were re-checked against: PRD v5 (Confluence 947650561, 21 Oct 2026, Chris Ward) · tech plan \"A/R and A/P Report Sorting, "
         "Export and Location Filter — Technical Implementation Plan\" (2026-10-21, uploaded 22 Oct 2026; read in full, READING-RECORD.md) · design canvas "
         "(read 22 Oct 2026) · Jira epic SV-11315 and stories (read 22 Oct 2026) · PO answers: none yet (questions 1 to 10 sent, 11 to 16 drafted).")
W.append("")
W.append(f"Before = the cases as committed after the design pass (git `{BEFORE}`); after = `authoring/proposals.json` and `AR-AP-SETUP-FILE.md` now. "
         "Each part below is compared by script (`make_pass_report.py`): CONFIRMED means byte-identical, CHANGED means rewritten. Every case was read whole "
         "(all case sources, 289 + 12); the parts marked CONFIRMED in a changed case were re-read against all current sources and needed no change.")
W.append("")
W.append("## Counts")
W.append("")
W.append("| Verdict | Cases |"); W.append("|---|---|")
for v in ("CONFIRMED", "CHANGE", "RETIRE", "NEW CASE"): W.append(f"| {v} | {cnt.get(v, 0)} |")
W.append(f"| **Total now** | **{len(rows)}** (289 before + {cnt.get('NEW CASE', 0)} new) |")
W.append("")
W.append("**RETIRE: none.** No statement of the tech plan proves a case wrong. Three held design-version cases (D-76, D-78, D-79) are contradicted by the "
         "tech plan as well as by the PRD; they stay held until Chris Ward answers questions 11, 13 and 14, as Rule 130 item 5 says.")
W.append("")
W.append("## Changed cases — the per-part record")
W.append("")
W.append("| Key | C-id | Why | " + " | ".join(ORDER) + " |")
W.append("|---|---|---|" + "---|" * len(ORDER))
for k, cid, v, why, rec in rows:
    if v == "CHANGE": W.append(f"| {k} | {link(cid)} | {why} | " + " | ".join(rec[p] for p in ORDER) + " |")
W.append("")
W.append("Run membership: S1-07 leaves the hold and joins run 549 when the QA lead approves the write (it was held out on question 1); every other changed "
         "case keeps its place (in the run, or held out: D-77).")
W.append("")
W.append("## New cases")
W.append("")
W.append("| Key | Section | Title | Marker | In run 549 | Why |"); W.append("|---|---|---|---|---|---|")
for k, cid, v, why, rec in rows:
    if v == "NEW CASE":
        c = BY[k]; W.append(f"| {k} | {c['sec']} | {c['title']} | `{c['marker']}` | {'yes' if in_run(c['marker']) else 'no (held)'} | {why} |")
W.append("")
W.append("## Every case")
W.append("")
W.append("| Key | C-id | Verdict | Reason |"); W.append("|---|---|---|---|")
for k, cid, v, why, rec in rows: W.append(f"| {k} | {link(cid)} | {v} | {why} |")
open(f"{HERE}/PASS-REPORT.md", "w").write("\n".join(W) + "\n")

# ---- TECH-PLAN-STATEMENTS.md
T = ["# Tech plan — every testable statement, its verdict and its cases (22 Oct 2026)", "",
     "Source: `sources/Tech-Plan-AR-AP-2026-10-22-upload.md` — \"A/R and A/P Report Sorting, Export and Location Filter — Technical Implementation Plan\", "
     "dated 2026-10-21, written against PRD v4 (20 Oct 2026); uploaded by the QA lead 22 Oct 2026. Read in full (READING-RECORD.md). Quotes are word for "
     "word as the page reads (markdown marks removed) and are checked against the file by `authoring/tech_plan.py` and `authoring/build.py`.", "",
     "Verdicts: CONFIRM (already a case) · ADD (new case cited to the plan) · CHANGE (an existing case changes) · DIVERGE (conflicts with PRD v5: the case "
     "follows the PRD and a question goes to Chris Ward) · EXCLUDED (not something a manual tester can observe, with the reason). The plan informs and never "
     "overrules the PRD (Rule 30); where the PRD is silent and nothing contradicts it, it sources a case on its own (QA lead's ruling, 12 Aug 2026).", "",
     "| Verdict | Statements |", "|---|---|"]
for v, n in Counter(st["verdict"] for st in TP.S).most_common(): T.append(f"| {v} | {n} |")
T += ["", "| Id | Where | Statement (verbatim) | Verdict | Cases | Reason |", "|---|---|---|---|---|---|"]
for st in TP.S:
    esc = lambda x: x.replace("|", "\\|")
    T.append(f"| {st['id']} | {esc(st['where'])} | \"{esc(st['quote'])}\" | {st['verdict']} | {', '.join(st['cases']) or '—'} | {esc(st['reason'])} |")
T += ["", "## Contradictions with PRD v5, for the QA lead (Rule 30: he asked to be told every one)", "",
      "1. **Names that start with a punctuation mark (TP-22).** PRD S1-R2: \"plain character order: digits and punctuation compare as characters\". The plan: "
      "\"punctuation sorts below digits and punctuation marks order among themselves differently from ASCII (e.g. - before #)\". Cases follow the PRD; "
      "question 16 drafted; held case S1-16.",
      "2. **Vendor menu search box (TP-30), seeming only.** PRD S5-R13: \"The menu has a search box\"; the plan: \"searchable over 8 (as Inventory Value)\". "
      "PRD S5-R13 also says the Vendor filter is \"exactly as Inventory Value's\", so our own sources settle it; no question; the four vendor-menu cases ask "
      "for more than 8 vendors.", "",
      "## Where the plan answers an open question (engineering's answer, not the PO's; the questions stay open, earlier sheet rows untouched, Rule 131)", "",
      "| Question | What the plan says | Effect on the cases |", "|---|---|---|",
      "| 1 (tie order of accented names) | D4: ties by the lower-cased name compared as written, so \"Emile\" before \"Émile\" | S1-07 follows it and leaves the hold (QA lead may keep it held instead) |",
      "| 2 (first click on ID / No.) | only money and Past due are named as largest first; ID / No. not stated | none (cases pass either way) |",
      "| 5 (next 30 by buttons or scrolling) | A/R Collection and A/P Unpaid Invoices: later groups arrive as the user scrolls; Summaries not stated | S2-29, S2-31, S2-32, S2-34 allow scrolling |",
      "| 7 (export lines) | part 1: tick order (D30); part 2: the CSV carries \"As of: …\", \"Locations: …\", \"Customers: …\" (E2E test 7) | S3-17 checks tick order; S3-09 to S3-14 already check the CSV lines |",
      "| 9 (totals agree; figures current) | part 1 not stated; part 2: reports read a copy about a second behind in production, the main data on staging and QA | new DATA-22 (on a test site, at once) |",
      "| 11 (dialog buttons) | \"switch dialog (lazy BaseDialog, exact copy)\": the PRD's words | none; held D-76 stays held |",
      "| 13 (Totals row with No locations) | D27: no totals | none; held D-78 stays held |",
      "| 14 (same-day invoices) | rows ordered by date, then document number | none; held D-79 stays held |",
      "", "## Other findings for the QA lead", "",
      "- The developers plan to add 7 TestRail cases in section \"Reports\" and to edit C27260–C27264, C26553–C26560 and C29451 (not ours, Rule 38), and say "
      "C26553–C26560 wrongly describe the reports as gated by the A/R and A/P permissions (they are gated by \"Reports → Page Access\").",
      "- Empty aging bucket: the plan's data always carries five buckets; whether an empty bucket's row shows on screen is stated nowhere. No case depends on it; not asked.",
      "- 17 open production bills have no delivery (plan Q9c); a tester cannot create one; not a case.",
      "- Test-site facts now in the setup file: PDF generator not set up on every site; a 2,000-row PDF takes about 30 seconds; enrolling the shared Admin "
      "elsewhere changes other reports' Location chip; the address keys and their codes; custom roles for permission splits."]
open(f"{HERE}/TECH-PLAN-STATEMENTS.md", "w").write("\n".join(T) + "\n")
print("pass report:", dict(cnt), "| statements:", len(TP.S))
