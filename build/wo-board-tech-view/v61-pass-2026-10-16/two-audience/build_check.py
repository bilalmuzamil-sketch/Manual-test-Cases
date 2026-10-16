#!/usr/bin/env python3
"""Build and gate the 21 two-audience cases and the WO Board setup file (16 Oct 2026).
  python3 build_check.py                 check only (exit 1 on any problem)
  python3 build_check.py --render DOCURL write payloads.json (TestRail fields, the case link pointing at DOCURL) and setup-file.html
Checks (the pre-handoff gate plus the six safeguards): every quote verbatim in its source (PRD v61, design package, tech plan,
QA handoff); preconditions ≤ 6 and ending with the Blocked line; steps ≤ 10 (existing cases over 10 are listed, not split);
exactly one "Step N:" line per step, in order; no citations, codes, versions or placeholders in the tester's fields; marker a
Rule 61 literal, last; every name and unit in the Preconditions and Steps is made by the case's recipe; titles ≤ 80, no ';'."""
import sys, os, re, json, html, glob
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D); REPO = os.path.abspath(os.path.join(V, "../../.."))
sys.path.insert(0, D)
from cases import K, BLOCKED
from recipes import PROC, RECIPES, RESET
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "").replace("`", "")).strip()
A = json.load(open(f"{V}/anchor-quotes-current.json"))
PRD = ws(open(f"{V}/CONFLUENCE-845185030-v61-2026-10-16.md").read())
B = f"{REPO}/build/wo-board-tech-view/sources"
TP = ws(open(f"{B}/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md").read())
QA = ws(open(f"{B}/dev-regression-2026-10-08/QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md").read())
DES = []
for root, _, fs in os.walk(f"{B}/design-2026-10-14-upload"):
    for f in sorted(fs):
        if f.rsplit(".", 1)[-1].lower() in ("html", "js", "jsx", "css", "md", "json", "txt"):
            DES.append(open(os.path.join(root, f), encoding="utf-8", errors="replace").read())
DES = ws("\n".join(DES))
OLD = {int(k): v for k, v in json.load(open(f"{D}/existing-quotes.json")).items()}
PICS = f"{REPO}/build/wo-board-tech-view/design-look-2026-10-14/compare"
problems, over10, quote_log = [], [], []


def source_of(label):
    if label.startswith("Design — "): return DES, "design package (export of 14 Oct 2026)"
    if label.lower().startswith("tech plan"): return TP, "tech plan (upload of 8 Oct 2026)"
    if label.startswith("QA handoff"): return QA, "QA handoff test plan (8 Oct 2026)"
    return PRD, "PRD Confluence 845185030 version 61 (16 Oct 2026)"


def resolve(k, cid, label):
    """All verbatim quotes for a trace label: a PRD code from the v61 anchor map; anything else from the case's own existing
    quotes with that label, kept only while still verbatim in its source (a removed line drops out)."""
    if re.fullmatch(r"S\d+-[A-Z]+\d+[a-z]?", label):
        if label not in A: problems.append(f"{k}: code {label} not in PRD v61"); return []
        return [A[label]]
    olds = [q for l, q in OLD.get(cid, {}).get("quotes", []) if l == label] if cid else []
    src, _ = source_of(label)
    keep = [q for q in olds if (ws(q) in src) or (label.startswith("Design — ") and "(element as the design names it)" in label)]
    if not keep: problems.append(f"{k}: no verbatim quote left for label {label}")
    return keep


TESTER_BAD = re.compile(r"\bS\d+-[RNE]\d+|\bPRD\b|\bversion \d|\bspec\b|Source|\{[^}]*\}|\(for example|Exact quote|Story \d|Out of Scope", re.I)
built = []
for c in K:
    k = f"C{c['case_id']}" if c.get("case_id") else c["key"]
    t, pre, steps, exp = c["title"], c["pre"], c["steps"], c["exp"]
    if len(t) > 80 or ";" in t: problems.append(f"{k}: title length {len(t)} or ';'")
    if len(pre) > 6: problems.append(f"{k}: {len(pre)} preconditions (max 6)")
    if pre[-1] != BLOCKED: problems.append(f"{k}: last precondition is not the Blocked line")
    if not any(p.startswith("Starting screen:") or "Starting screen:" in p for p in pre): problems.append(f"{k}: no starting screen")
    if '"Admin" role' not in pre[0]: problems.append(f"{k}: first precondition does not name the role")
    if len(steps) > 10:
        (over10 if c.get("case_id") else problems).append(f"{k}: {len(steps)} steps")
    if len(exp) != len(steps): problems.append(f"{k}: {len(exp)} expected lines for {len(steps)} steps")
    for i, e in enumerate(exp, 1):
        if not e.startswith(f"Step {i}: "): problems.append(f"{k}: expected line {i} does not start 'Step {i}: '")
    for part in pre + steps + exp + ([c["known"]] if c.get("known") else []):
        m = TESTER_BAD.search(part)
        if m and not part.startswith("Known problem"): problems.append(f"{k}: tester text has '{m.group(0)}': {part[:70]}")
    if not re.fullmatch(r"AUTOMATION: (READY|READY - EXPECT FAIL \(SV-\d+\)|HOLD - [^\n]{5,200})", c["marker"]):
        problems.append(f"{k}: marker")
    if "EXPECT FAIL" in c["marker"] and not c.get("known"): problems.append(f"{k}: EXPECT FAIL without a known-problem line")
    for pic in re.findall(r'"(DC-[^"]+\.png)"', " ".join(pre)):
        if not os.path.exists(os.path.join(PICS, pic)): problems.append(f"{k}: picture {pic} not found")
    # traceability: every quote verbatim
    trace = []
    for st, label in c["trace"]:
        for n in re.findall(r"\d+", st):
            if not 1 <= int(n) <= len(steps): problems.append(f"{k}: trace step {n} out of range")
        for q in resolve(k, c.get("case_id"), label):
            src, name = source_of(label)
            ok = ws(q) in src or (label.startswith("Design — ") and "(element as the design names it)" in label)
            if not ok: problems.append(f"{k}: quote {label} not verbatim in {name}")
            trace.append({"steps": st, "label": label, "quote": q, "source": name})
            quote_log.append({"case": k, "label": label, "verbatim": ok})
    covered = {int(n) for st, _ in c["trace"] for n in re.findall(r"\d+", st)} | (set(range(1, len(steps) + 1)) if any(s == "all" for s, _ in c["trace"]) else set())
    nav = [i for i in range(1, len(steps) + 1) if i not in covered]
    # every quoted name or unit in the tester text is made by the case's recipes
    rtext = json.dumps([RECIPES.get(r) for r in c["recipes"]], ensure_ascii=False)
    for r in c["recipes"]:
        if r not in RECIPES: problems.append(f"{k}: recipe {r} missing")
    names = set(re.findall(r'"((?:ZZAUTOTEST|C\d{5,6}-|N\d-)[^"]*)"', " ".join(pre + steps)))
    for n in names:
        if n.startswith("ZZAUTOTEST") and n not in rtext and n.split(" ")[-1] not in rtext and not n.startswith("ZZAUTOTEST Empty"):
            problems.append(f"{k}: name {n} not made by its recipe")
        if re.match(r"(C\d+|N\d)-", n) and n not in rtext and not re.search(r"\d+ to", n): problems.append(f"{k}: unit {n} not made by its recipe")
    built.append(dict(c, k=k, trace_resolved=trace, navigation_steps=nav))
print(f"cases {len(built)} · quotes {len(quote_log)} (verbatim {sum(q['verbatim'] for q in quote_log)})")
for o in over10: print("OVER 10 STEPS (existing case, not split; needs the QA lead's decision):", o)
for p in problems: print("PROBLEM", p)
json.dump(quote_log, open(f"{D}/quote-log.json", "w"), indent=1, ensure_ascii=False)
if problems: sys.exit(1)

if "--render" in sys.argv:
    DOC = sys.argv[sys.argv.index("--render") + 1]
    e = lambda s: html.escape(s, quote=False)
    def ul(xs, tag="ul"): return f"<{tag}>" + "".join(f"<li>{e(x)}</li>" for x in xs) + f"</{tag}>"
    pay = {}
    for c in built:
        pre = (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
               "<p><strong>Preconditions</strong></p>" + ul(c["pre"]))
        exp = "".join(f"<p>{e(x)}</p>" for x in c["exp"])
        if c.get("known"): exp += f"<p>{e(c['known'])}</p>"
        exp += f"<p>{e(c['marker'])}</p>"
        pay[c["k"]] = {"title": c["title"], "custom_preconds": pre, "custom_steps": ul(c["steps"], "ol"), "custom_expected": exp,
                       "refs": c.get("refs") or None, "section_id": c["section_id"], "expected_changed": c["expected_changed"],
                       "summary": c["summary"], "recipes": c["recipes"]}
    json.dump(pay, open(f"{D}/payloads.json", "w"), indent=1, ensure_ascii=False)
    print("payloads.json written:", len(pay))
