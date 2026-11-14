"""Writes currency-2026-11-14/CHANGE-LIST.md for the QA lead (plain words): per case C-id + link, title and what changes (one line), grouped by
changed requirement; the new cases; the outside edits kept; the replacements per case; the dry-run results (live reads). Read-only."""
import json, csv, re, html, sys
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); import v13_layout as V; import cases_v13 as V13C
MAP = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
M = json.load(open(f"{W}/proposals-v13-on-live.json")); P = json.load(open(f"{B}/authoring/proposals.json"))
AFF = json.load(open(f"{W}/AFFECTED.json")); OE = json.load(open(f"{W}/live-before/outside-edits-2026-11-14.json"))
INV = json.load(open(f"{W}/merge-invariant.json")); LIVE = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14b.json"))["cases"]}
SEC = {s["id"]: s["name"] for s in json.load(open(f"{W}/live-before/live-2026-11-14b.json"))["sections"]}
lnk = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"
esc = lambda t: (t or "").replace("|", "/").replace("\n", " ")
def title(k): return esc(M[k]["fields"]["title"] if k in M else P[k]["fields"]["title"])
PLAIN = {"S1-R8": "The PRD now says an open customer's or vendor's documents may arrive all at once; it only sets how many show at a time.",
         "S4-R1": "The PRD now says the chevron at the top left of the table is blue, like each group's chevron. The design picture draws it grey (recorded; the PRD wins).",
         "S5-E3": "The PRD now says: after a new as-of date, if no ticked location is left and only one location is in the list, the Location chip is hidden.",
         "S8-R3": "The PRD now allows one exception on A/P Unpaid Invoices: a vendor's group row does not wrap, so a very long vendor name can push the table sideways at 1440 px (78 characters still fit)."}
L = []; A = L.append
A("# A/R and A/P Report Sorting — change list for PRD version 13 (14 Nov 2026)")
A("")
A("DRAFT: nothing has been written to TestRail yet. Your choice of 14 Nov 2026: **\"Apply on top, + SV-12723 (Recommended)\"**. Every change is written on top of each "
  "case's current TestRail text, so the edits made on 11-12 Nov (build lines, READY markers, Setup steps, reworded steps) all stay. Every case stays in its current folder.")
A("")
A("## At a glance")
A("")
A("| What | Count |"); A("|---|---|")
A(f"| Cases that would change | {len(M)} ({len(V.REWRITE)} rewritten for a changed requirement, {len(M) - len(V.REWRITE)} only re-stamped to PRD version 13) |")
PP = json.load(open(f"{W}/pass-parts.json"))
A(f"| ... of which what the tester does or sees changes | {sum(1 for r in PP if r['set']=='REWRITE' and any(r[p]=='CHANGED' for p in ('title','preconditions','steps','results')))} |")
A(f"| New cases | {len(V13C.NEW13)} (folder \"Setup needed before testing\"; added to run 557, assigned to Mudassir) |")
A("| Skipped because TestRail changed since our read | 0 (two full reads and a per-case read just now: no change) |")
A("| Main folder note (Rule 140) | \"Test cases are current as of 11/14/2026. …\" on folder 90418 (empty today) |")
A("")
A("Proof that no edit made on 11-12 Nov is lost: a script compares, line by line, the current TestRail text with what would be written. Every line added or changed "
  "on 11-12 Nov is still there, except the replacements listed in section 5 (each one is a line PRD version 13 itself changes, plus DATA-13's case id, as you chose). "
  "Nothing is added that is not part of the PRD version 13 change.")
A("")
A("## 1. Cases rewritten because a requirement changed")
for code in ["S1-R8", "S4-R1", "S5-E3", "S8-R3"]:
    A(""); A(f"### {code}: {PLAIN[code]}"); A("")
    A("| Case | Title | What changes |"); A("|---|---|---|")
    for c in AFF["changed"][code]["cases"]:
        k = c["key"]; t = c["tester_text"]
        if t.startswith("confirmed"): t = "Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes."
        A(f"| {lnk(MAP[k])} | {title(k)} | {esc(t)} |")
A(""); A("### S5-R10b (new): any as-of date can be picked, including a day after today"); A("")
A("| Case | Title | What changes |"); A("|---|---|---|")
A(f"| {lnk(MAP['S5-37'])} | {title('S5-37')} | Rewritten: it checked that a day after today could NOT be picked. Now: on A/P Detail, a bill due today moves to \"1-30 days past due\" with Past Due 10 when the day 10 days after today is picked. Its run 557 result (passed 11-12 Nov) was for the old expectation. |")
A("")
A("## 2. Cases only re-stamped (no requirement they use changed)")
A("")
A("What changes in each: the line above the quotes now names PRD version 13 (read 13 Nov, re-checked 14 Nov 2026). A script proved every quote in these cases is word for word in version 13.")
A("")
A("| Case | Title |"); A("|---|---|")
for k in AFF["restamp_set"]: A(f"| {lnk(MAP[k])} | {title(k)} |")
A("")
A("## 3. New cases (folder \"Setup needed before testing\", run 557, Mudassir)")
A("")
WHY = {"S3-33": "S3-R7b: the A/R Detail PDF ends each bucket with \"Total for <bucket>\", same totals as the screen, never \"Subtotal\".",
       "S3-34": "S3-R7b: the A/R Collection PDF ends each customer with \"Total for <name>\"; a long name with & \" ' < > prints exactly and wraps.",
       "S3-35": "S3-R7b: the A/P Detail PDF ends each bucket with \"Total for <bucket>\", never \"Subtotal\".",
       "S3-36": "S3-R7b: the A/P Unpaid Invoices PDF ends each vendor with \"Total for <name>\"; a long name with & \" ' < > prints exactly and wraps.",
       "S5-43": "S5-R10b: with an as-of date after today, the PDF and CSV print that day (not today).",
       "S5-41b": "S5-E3: after a new as-of date with no ticked location left and one location in the list, the Location chip is hidden.",
       "S2-51": "SV-12723 / S2-R6: on A/R Summary a blank bucket cell stays at the bottom both ways; long name with & \" ' < >; headings do not move.",
       "S2-52": "SV-12723 / S2-R6: the same on A/P Summary."}
A("| Key | Title | What it checks |"); A("|---|---|---|")
for k in V13C.NEW13: A(f"| {k} (no C-id yet) | {esc(P[k]['fields']['title'])} | {esc(WHY[k])} |")
A("")
A("Already covered elsewhere, not duplicated: D-95 (Demo Day; A/R Collection PDF Total row); C1078980 and C1078981 (another author's cases in run 557: picking a later date on A/R Summary, a saved link with a later date).")
A("")
A("## 4. Edits made on 11-12 Nov that are kept")
A("")
A("| Case | Live folder | What was edited on 11-12 Nov (kept) |"); A("|---|---|---|")
NAMES = {"build line": "build line", "marker": "AUTOMATION marker", "setup block": "Setup steps added", "other": "wording changed"}
for k in sorted(OE):
    cid = OE[k]["case"]; parts = []
    for f, x in OE[k]["fields"].items():
        fn = {"custom_expected": "expected result", "custom_preconds": "preconditions", "custom_steps": "steps", "title": "title", "refs": "refs"}[f]
        parts.append(fn + ": " + ", ".join(NAMES.get(kd, kd) for kd in x["kinds"]))
    A(f"| {lnk(cid)} | {esc(SEC.get(LIVE[cid]['section_id'], ''))} | {esc('; '.join(parts))} |")
A("")
A("## 5. Replacements: lines edited on 11-12 Nov that PRD version 13 itself changes")
A("")
RULE = {"R1 from": "line above the quotes now names PRD version 13 (the rest of that line kept)",
        "R2 build": "build line: this case gained a result no build has shown yet, so it now says \"Partly checked … not yet seen on that build: …\" (or, for S5-37, not checked in this form)",
        "R3 marker": "AUTOMATION marker: S5-37's expected behaviour reversed, so \"Not available on Build to test Yet - Last checked 11/14/2026\" instead of READY",
        "R4 quote": "quoted PRD sentence replaced by its version 13 wording",
        "R5 tester": "D-16's tech-plan note: your session's wording kept, the version 13 point added",
        "R6 case id dropped": "DATA-13: the case id C715462 dropped from the record name in the preconditions (now \"ZZAUTOTEST OVERPAID Cust A\"; the staging record keeps its full name, so search \"ZZAUTOTEST OVERPAID\")"}
A("| Case | What is replaced | The line as it reads today (start) |"); A("|---|---|---|")
for k in sorted(INV):
    for f, kd, txt in INV[k]["their_lines_replaced"]:
        A(f"| {lnk(INV[k]['case'])} | {esc(RULE[kd])} | {esc(html.unescape(re.sub('<[^>]+>', '', txt)))[:120]}… |")
A("")
A("D-52 already showed the blue header chevron (changed 12 Nov on your instruction): its tester line and note stay exactly as they are.")
A("")
A("## 6. Dry runs (live reads, 14 Nov 2026)")
A("")
for fn in ["dryrun-update-on-live-2026-11-14.txt", "dryrun-update-locked-2026-11-14.txt", "dryrun-create-sync-folder-2026-11-14.txt"]:
    A(f"`applied/{fn}`:"); A("```"); A(open(f"{W}/applied/{fn}").read().strip()); A("```"); A("")
A("Run order when you approve: `write/update_cases.py --on-live --apply`, `write/create_new.py --apply`, `write/sync_run_557.py --apply`, `write/folder_note.py --apply` "
  "(each runs the readiness check first and logs C-id, HTTP status and read-back).")
open(f"{W}/CHANGE-LIST.md", "w").write("\n".join(L) + "\n")
print("lines", len(L))
