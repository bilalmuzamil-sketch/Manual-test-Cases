#!/usr/bin/env python3
"""Part Lifecycle full update, 13 Oct 2026 (QA lead "Yes"; Rule 122 full pass), in the Rule 117 layout as amended 8 Oct 2026:
Preconditions field = link "Setup (manual QA tester and Claude session)" + "Preconditions" (plain sentences, {Name-A}
placeholders, numbered {Line-1}/{Work-order-1}, every example "(for example …)"); no Setup block in TestRail; Steps =
actions only; every expected result starts "Step N:"; Source, verbatim quotes, marker. The setup lives in one public
Google Doc per case (Part 1 manual QA tester, Part 2 Claude session).
  python3 apply_pl_update.py --anchors             build anchor-quotes-current.json and feedback-table-current.json
  python3 apply_pl_update.py [--only FILE]         check proposals (all, or one file); exit 1 on any problem
  python3 apply_pl_update.py --docs                write the doc HTML files to docs/ (after a clean check)
  python3 apply_pl_update.py --apply               write to TestRail (needs doc-ids-*.jsonl for every case)
Only OUR cases (created_by 3) are touched, and only if unchanged since the 13 Oct snapshot (edit lock)."""
import sys, json, re, os, glob, html
sys.path.insert(0, "build/maintenance-reminder-v2")
H = "build/founder-mode/part-lifecycle/update-2026-10-13"
S = "build/founder-mode/part-lifecycle/sources"
PRDF = f"{S}/CONFLUENCE-829227015-PartLifecycle-2026-10-13.md"
MARKER = "AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified"
LINK = "Setup (manual QA tester and Claude session)"
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()

if "--anchors" in sys.argv:
    anch, fb = {}, {}
    for line in open(PRDF):
        m = re.match(r"^\s*[-*]\s+\*\*(S\d+-[A-Z]+\d+[a-z]?):\*\*\s*(.*)$", line.rstrip("\n"))
        if m: anch[m.group(1)] = ws(m.group(2))
    sec8 = open(PRDF).read().split("## 8. User Feedback Summary", 1)[1].split("\n## ", 1)[0]
    for row in sec8.splitlines():
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if len(cells) == 3 and not set(cells[0]) <= set("-: ") and "Trigger" not in cells[0]:
            fb["Feedback: " + ws(cells[0])] = ws(cells[1]) + " | " + ws(cells[2])
    json.dump(anch, open(f"{H}/anchor-quotes-current.json", "w"), indent=1, ensure_ascii=False)
    json.dump(fb, open(f"{H}/feedback-table-current.json", "w"), indent=1, ensure_ascii=False)
    print(len(anch), "requirement codes ·", len(fb), "feedback rows"); sys.exit()

from mr_lib import api
PRD = ws(open(PRDF).read())
TP = ws(open(f"{S}/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md").read())
JIRA = ws(open(f"{S}/jira-2026-10-13/STORIES-2026-10-13.md").read())
ANCH = json.load(open(f"{H}/anchor-quotes-current.json"))
def esc(t): return html.escape(t, quote=False)
def ul(x, tag="ul"): return f"<{tag}>" + "".join(f"<li>{esc(re.sub(r'^\d+\.\s+', '', i.strip()))}</li>" for i in x) + f"</{tag}>"
def preconds(p, doc): return (f'<p><strong><a href="{doc}">{LINK}</a></strong></p><p></p>'
                              "<p><strong>Preconditions</strong></p>" + ul(p["preconditions"]))
def expected(p):
    out = "<p><strong>Expected results</strong></p>" + ul(p["results"])
    out += f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{esc(p['source'])}</p>"
    out += "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>" + "".join(
        f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q.replace('**', ''))}&rdquo;</li>" for a, q in p["quotes"]) + "</ul>"
    return out + f"<p>{esc(p['marker'])}</p>"

SHORT = re.compile(r"\b(S\d+-[RNE]\d+[a-z]?|parity|normali[sz]ed|endpoint|payload|anchor|route|Rule \d+|delta)\b|;", re.I)
BAD = ("ask the qa lead", "ask your qa lead", "devtools", "curl ", "postman", "database", "the api ", " via api",
       "conditions in s", "in this test it is called", "needs:", "e.g.")
PH = re.compile(r"\{([^{}]+)\}")
PH_OK = re.compile(r"^(?:(?:Line|Work-order)-\d+|(?!Line-|Work-order-)[A-Z][a-z]+(?:-[a-z]+)*-[A-Z])(?: id)?$")
problems, plans, news, retires = [], [], [], []
covered = {}
files = [sys.argv[sys.argv.index("--only") + 1]] if "--only" in sys.argv else sorted(glob.glob(f"{H}/proposals-*.json"))
for f in files:
    d = json.load(open(f))
    for a, ks in d.get("anchors_covered", {}).items(): covered.setdefault(a, set()).update(map(str, ks))
    retires += d.get("retire", [])
    for kind, items in (("upd", d.get("updates", [])), ("new", d.get("new", []))):
        for p in items:
            k = str(p.get("case_id") or p.get("key")); t = p.get("title", "")
            if len(t) > 80: problems.append(f"{k}: title {len(t)} chars")
            if SHORT.search(t): problems.append(f"{k}: title shorthand/semicolon: {t}")
            for part in ("preconditions", "steps", "results", "quotes", "doc_part1", "doc_part2"):
                if not p.get(part): problems.append(f"{k}: empty {part}")
            if p.get("doc_part1") and not p["doc_part1"][-1].lstrip("0123456789. ").startswith("Check the setup worked"):
                problems.append(f"{k}: doc_part1 lacks the final 'Check the setup worked'")
            for r in p.get("results", []):
                if not re.match(r"^Steps? \d", r): problems.append(f"{k}: result not tied to a step: {r[:70]}")
            if p.get("marker") != MARKER: problems.append(f"{k}: marker")
            for a, q in p.get("quotes", []):
                src = TP if a.lower().startswith("tech plan") else JIRA if a.startswith("SV-") else PRD
                if a in ANCH and ws(q) != ws(ANCH[a]): problems.append(f"{k}: quote {a} differs from the anchor map")
                if ws(q) not in src: problems.append(f"{k}: quote {a} not verbatim in its source: {q[:80]}")
            tester = " ".join(p.get("preconditions", []) + p.get("steps", []) + p.get("results", []))
            alltext = tester + " " + " ".join(p.get("doc_part1", []) + p.get("doc_part2", []))
            for b in BAD:
                if b in tester.lower(): problems.append(f"{k}: tester text contains '{b.strip()}'")
            if re.search(r"\[(?:[A-Z][\w-]*-\d|[A-Z][\w-]*-[A-Z])\]", alltext): problems.append(f"{k}: square-bracket placeholder")
            for ph in set(PH.findall(alltext)):
                if not PH_OK.match(ph) and not re.fullmatch(r"(part number|n|description)", ph):
                    problems.append(f"{k}: placeholder name {{{ph}}} not Name-A / Line-1 style")
            defined = set(PH.findall(" ".join(p.get("preconditions", []))))
            for ph in set(PH.findall(" ".join(p.get("steps", []) + p.get("results", [])))):
                if ph not in defined and not re.fullmatch(r"(part number|n|description)", ph) and not ph.endswith(" id"):
                    problems.append(f"{k}: {{{ph}}} used in steps/results but not named in the preconditions")
            if re.search(r"\bS\d+-[RNE]\d+", tester): problems.append(f"{k}: requirement code in tester text")
            if re.search(r"\b(?:Data|Must hold|User)\s*:", " ".join(p.get("preconditions", []))): problems.append(f"{k}: precondition starts with a bare label")
            payload = {"title": t, "custom_steps": ul(p.get("steps", []), "ol"), "custom_expected": expected(p) if p.get("quotes") else ""}
            if kind == "upd": plans.append((int(p["case_id"]), p, payload))
            else: news.append((p["key"], p["section_id"], p, payload))
live = {c["id"]: c for c in json.load(open(f"{H}/snapshots-before/live-cases.json"))}
ids = [c for c, _, _ in plans] + [int(r["case_id"]) for r in retires]
if len(ids) != len(set(ids)): problems.append("a case is proposed twice (or both updated and retired)")
keys = [k for k, *_ in news]
if len(keys) != len(set(keys)): problems.append("duplicate new-case key")
for c in ids:
    if c not in live or live[c]["created_by"] != 3: problems.append(f"C{c}: not ours or unknown")
if "--only" not in sys.argv:
    missing = sorted(c for c in live if c not in ids)
    if missing: problems.append(f"our cases in no proposal: {missing}")
    uncov = sorted(a for a in ANCH if not covered.get(a))
    if uncov: problems.append(f"requirement codes not covered: {uncov}")
print(f"updates {len(plans)} · new {len(news)} · retire {len(retires)} · codes covered {sum(1 for a in ANCH if covered.get(a))}/{len(ANCH)}")
for p in problems: print("PROBLEM", p)
if problems: sys.exit(1)

def doc_html(key, title, p):
    case = f"C{key}" if str(key).isdigit() else "(new case)"
    link = f'<a href="https://shopview.testrail.io/index.php?/cases/view/{key}">{case}</a>' if str(key).isdigit() else case
    par = lambda items, num: "".join(f"<p>{n}. {esc(re.sub(r'^\d+\.\s+', '', i))}</p>" if num else f"<p>• {esc(i)}</p>"
                                     for n, i in enumerate(items, 1))
    return ("<html><body>" f"<h1>Setup: {esc(title)}</h1>"
            f"<p>Test case: {link}, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude "
            "session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.</p>"
            "<p>How to read this document: a name in braces, such as {Part-A} or {Line-1}, stands for a record you create or pick. "
            "Every brace name is defined before it is used. Wherever a value is given \"for example\", you may use any other value: "
            "the example is not a record that already exists in the app. Write down the real value you used for each brace name, "
            "because the test steps refer to it.</p>"
            "<h2>What the setup creates (the test case's Preconditions)</h2>" + par(p["preconditions"], False) +
            "<h1>Part 1. Setup for manual QA tester</h1>" + par(p["doc_part1"], True) +
            "<h1>Part 2. Setup for Claude session</h1>" + par(p["doc_part2"], False) +
            open(f"{H}/part2-common.html").read() + "</body></html>")
if "--docs" in sys.argv:
    os.makedirs(f"{H}/docs", exist_ok=True); lst = []
    for cid, p, pay in plans:
        open(f"{H}/docs/C{cid}.html", "w").write(doc_html(cid, p["title"], p)); lst.append(f"C{cid}\tSetup (manual QA tester and Claude session) - C{cid} {p['title']}")
    for key, sec, p, pay in news:
        open(f"{H}/docs/{key}.html", "w").write(doc_html(key, p["title"], p)); lst.append(f"{key}\tSetup (manual QA tester and Claude session) - {p['title']}")
    open(f"{H}/docs/LIST.tsv", "w").write("\n".join(lst) + "\n"); print(len(lst), "doc files written")
if "--apply" in sys.argv:
    docs = {}
    for f in glob.glob(f"{H}/doc-ids-*.jsonl"):
        for line in open(f):
            if line.strip(): r = json.loads(line); docs[str(r["id"])] = f"https://docs.google.com/document/d/{r['doc']}/edit"
    need = [f"C{c}" for c, _, _ in plans] + [k for k, *_ in news]
    lacking = [k for k in need if k not in docs]
    if lacking: sys.exit(f"no doc yet for {len(lacking)}: {lacking[:10]}")
    os.makedirs(f"{H}/applied", exist_ok=True); log = open(f"{H}/applied/apply-log.jsonl", "a")
    done = {json.loads(l).get("case") or json.loads(l).get("key") for l in open(f"{H}/applied/apply-log.jsonl")} if os.path.getsize(f"{H}/applied/apply-log.jsonl") else set()
    def L(**k): log.write(json.dumps(k) + "\n"); log.flush(); print(k)
    for cid, p, pay in plans:
        if f"C{cid}" in done: continue
        pay = dict(pay, custom_preconds=preconds(p, docs[f"C{cid}"]))
        c = api(f"get_case/{cid}")
        if c["created_by"] != 3 or c["updated_on"] != live[cid]["updated_on"] or c.get("updated_by") != 3:
            L(op="skip", case=f"C{cid}", why="changed since the 13 Oct snapshot or not ours"); continue
        json.dump(c, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", pay); a = api(f"get_case/{cid}")
        json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1)
        L(op="update_case", case=f"C{cid}", ok=all((a.get(x) or "") == v for x, v in pay.items()) and a["section_id"] == c["section_id"], why=p.get("change_summary", ""))
    for key, sec, p, pay in news:
        if key in done: continue
        pay = dict(pay, custom_preconds=preconds(p, docs[key]))
        r = api(f"add_case/{sec}", dict(pay, custom_automation_type=2, custom_atmstatus=1)); a = api(f"get_case/{r['id']}")
        json.dump(a, open(f"{H}/applied/C{r['id']}-new.json", "w"), indent=1)
        L(op="add_case", key=key, case=f"C{r['id']}", doc=docs[key], section=sec, ok=all((a.get(x) or "") == v for x, v in pay.items()), why=p.get("why", ""))
    for r in retires:
        L(op="retire_proposed_not_applied", case=f"C{r['case_id']}", why=r["why"])
