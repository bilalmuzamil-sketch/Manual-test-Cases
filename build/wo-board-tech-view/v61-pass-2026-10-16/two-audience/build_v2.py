#!/usr/bin/env python3
"""Apply the approved C97021 shape to the other 20 cases (QA lead, 16 Oct 2026) and gate them.
  python3 build_v2.py            build + check → v2-fields.json (TestRail fields) and v2-pre.json (setup-file precondition lines + placeholder maps)
  python3 build_v2.py --apply    write the 20 cases (edit lock: unchanged since this pass's last write), read back, log
Checks: quotes verbatim (PRD v61, design package, tech plan, QA handoff); every {placeholder} in steps/results defined in the
preconditions; no hard-coded record (ZZAUTOTEST name, unit) in the tester's state lines, steps or results; no how-to in the
preconditions; one "Step N:" result per step; ≤ 6 preconditions; marker a Rule 61 literal and last; below the results: Source,
divergence, Exact quotes, marker, as the case had them."""
import sys, os, re, json, html, importlib.util, base64, urllib.request
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.argv_saved = list(sys.argv); sys.argv = ["x"]
spec = importlib.util.spec_from_file_location("bc", f"{D}/build_check.py"); bc = importlib.util.module_from_spec(spec); spec.loader.exec_module(bc)
sys.argv = sys.argv_saved
sys.path.insert(0, D)
from cases_v2 import V2, NEW_SRC
OLDB = {int(k): v for k, v in json.load(open(f"{D}/old-below-expected.json")).items()}
OLDQ = {int(k): v for k, v in json.load(open(f"{D}/existing-quotes.json")).items()}
NEW = json.load(open(f"{D}/applied/new-ids.json"))
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
PRD_NAME = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 61 (16 Oct 2026, Chris Ward)'
SHEET = "Product owner answers: Chris Ward, WO Board and Tech View question sheet (https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU)"
CHANGED = ", before the expected results changed on 16 Oct 2026; the changed results have not yet been checked against a build."
HOWTO = re.compile(r'New Staff Member|New Customer|Create Work Order|Save & Close|"Save"|quick-login|click the pin|type "grease"|Lead Technician" dropdown|Edit Line|Mark Reviewed|Create Invoice')
PH = re.compile(r"\{([^{}]+)\}")
e = lambda s: html.escape(s, quote=False)


def join_codes(labels):
    parts = []
    for l in labels:
        if re.fullmatch(r"S\d+-[A-Z]+\d+[a-z]?", l): parts.append(l)
        elif l in ("Goals", "Out of Scope", "Story 11 user story") or l.startswith("Decisions"): parts.append(("the " if l == "Story 11 user story" else "") + l)
    parts = list(dict.fromkeys(parts))
    return parts[0] if len(parts) == 1 else ", ".join(parts[:-1]) + " and " + parts[-1]


fields, v2pre, problems = {}, {}, []
for c in bc.built:
    key = c.get("case_id") or c["key"]
    if key == 97021: continue
    v = V2[key]; k = c["k"]; cid = c.get("case_id") or NEW[c["key"]]
    reps = sorted(v["rep"].items(), key=lambda kv: -len(kv[0]))
    def R(s):
        for _ in range(3):
            for a, b in reps: s = s.replace(a, b)
        return s
    steps = [R(s) for s in c["steps"]]; res = [R(r) for r in c["exp"]]
    pre = v["pre"]; pre_text = [a + (" " + b if b else "") for a, b in pre]
    # source sentence
    labels = [t["label"] for t in c["trace_resolved"]]
    if v.get("src"): source = v["src"]
    else:
        stories = v.get("stories") or NEW_SRC[c["key"]][0]
        source = f"Epic SV-10043; {stories}; {PRD_NAME}, {join_codes(labels)}, read 16 Oct 2026."
        if v.get("design"):
            source += (' Claude Design project "Work Orders" (Branko Cicovic), export of 14 Oct 2026, board "Work Orders.dc.html" (the design '
                       "pictures named in the preconditions were rendered from it), read 14 Oct 2026.")
        if v.get("extra"): source += " " + v["extra"]
        if not c.get("case_id"): source += " " + NEW_SRC[c["key"]][1]
        if v.get("tickets"): source += f" Related tickets: {v['tickets']}."
        if v.get("answers"): source += f" {SHEET}, {v['answers']}, read 15 Oct 2026."
        source += " Source-verified 16 October 2026."
        lc = (OLDQ.get(key) or {}).get("last_checked") if c.get("case_id") else None
        if lc:
            lc = re.sub(r", before the expected results changed.*$", "", lc).rstrip(".")
            source += " " + lc + (CHANGED if c["expected_changed"] else ".")
    # divergence
    if "div" in v: div = v["div"]
    else:
        div = list(OLDB.get(key, {}).get("divergence", []))
        for a, b in v.get("div_fix", []):
            hit = [i for i, p in enumerate(div) if a in p]
            if not hit: problems.append(f"{k}: divergence fix not found: {a[:60]}")
            for i in hit: div[i] = div[i].replace(a, b)
        div += v.get("div_add", [])
    # quotes (from the trace, unique, in order)
    quotes, seen = [], set()
    for t in c["trace_resolved"]:
        if (t["label"], t["quote"]) in seen: continue
        seen.add((t["label"], t["quote"])); quotes.append((t["label"], t["quote"]))
    known = v.get("known", [])
    # ---- checks
    if len(pre) > 6: problems.append(f"{k}: {len(pre)} preconditions")
    if len(res) != len(steps): problems.append(f"{k}: results {len(res)} vs steps {len(steps)}")
    for i, r in enumerate(res, 1):
        if not r.startswith(f"Step {i}: "): problems.append(f"{k}: result {i} not 'Step {i}:'")
    defined = set(PH.findall(" ".join(pre_text)))
    for x in set(PH.findall(" ".join(steps + res + known))):
        if x not in defined: problems.append(f"{k}: {{{x}}} used but not defined in the preconditions")
    tester_state = [a for a, b in pre] + steps + res
    hard = [m.group(0) for s in tester_state for m in re.finditer(r'ZZAUTOTEST[^".,;)]*|units? "[^"]+"|"(?:C\d{5,6}|N\d)-[A-Z]\d+"', s)]
    if hard: problems.append(f"{k}: hard-coded value in tester text: {hard[:3]}")
    if HOWTO.search(" ".join(pre_text)): problems.append(f"{k}: how-to in preconditions: {HOWTO.search(' '.join(pre_text)).group(0)}")
    for ph_ in defined:
        if ph_ not in {p.strip("{}") for p in v["ph"]}: problems.append(f"{k}: {{{ph_}}} has no value in the setup-file map")
    for l, q in quotes:
        src, name = bc.source_of(l)
        if bc.ws(q) not in src and "(element as the design names it)" not in l: problems.append(f"{k}: quote {l} not verbatim in {name}")
    if re.search(r"\bS\d+-[RNE]\d+", " ".join(tester_state)): problems.append(f"{k}: requirement code in tester text")
    # ---- render
    pre_html = (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>")
    exp_html = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>"
                + "".join(f"<p>{e(x)}</p>" for x in known)
                + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p>"
                + "".join(f"<p>{e(d)}</p>" for d in div)
                + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
                + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in quotes) + "</ul>"
                + f"<p>{e(c['marker'])}</p>")
    f = {"title": c["title"], "custom_preconds": pre_html, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>",
         "custom_expected": exp_html}
    if c.get("refs"): f["refs"] = c["refs"]
    fields[f"C{cid}"] = f
    v2pre[k] = {"pre": pre_text, "placeholders": v["ph"]}
print(f"built {len(fields)} cases")
for p in problems: print("PROBLEM", p)
if problems: sys.exit(1)
json.dump(fields, open(f"{D}/v2-fields.json", "w"), indent=1, ensure_ascii=False)
json.dump(v2pre, open(f"{D}/v2-pre.json", "w"), indent=1, ensure_ascii=False)

if "--apply" in sys.argv:
    C = json.load(open("/tmp/testrail/creds.json")); AU = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
    def api(ep, d=None):
        r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(d).encode() if d is not None else None,
                                   headers={"Authorization": "Basic " + AU, "Content-Type": "application/json"})
        x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
    os.makedirs(f"{D}/applied-v2", exist_ok=True); log = open(f"{D}/applied-v2/apply-log.jsonl", "a")
    for k, f in fields.items():
        cid = int(k[1:]); after = json.load(open(f"{D}/applied/C{cid}-after.json"))
        st, live = api(f"get_case/{cid}")
        if live["updated_on"] != after["updated_on"]:
            r = {"op": "refused_edit_lock", "case": k}; log.write(json.dumps(r) + "\n"); print(r); continue
        json.dump(live, open(f"{D}/applied-v2/{k}-before.json", "w"), indent=1)
        st, _ = api(f"update_case/{cid}", f); st2, a = api(f"get_case/{cid}")
        json.dump(a, open(f"{D}/applied-v2/{k}-after.json", "w"), indent=1)
        ok = {x: (a.get(x) or None) == (y or None) for x, y in f.items()}
        un = [x for x in a if x not in f and x not in ("updated_on", "updated_by", "version") and a.get(x) != live.get(x)]
        r = {"op": "update_case", "case": k, "http": st, "fields_ok": all(ok.values()), "bad": [x for x, y in ok.items() if not y],
             "untouched_changed": un, "marker_last": a["custom_expected"].rstrip().endswith("</p>") and a["custom_expected"].count("AUTOMATION:") == 1}
        log.write(json.dumps(r) + "\n"); print(r["case"], r["http"], "OK" if r["fields_ok"] and not un and r["marker_last"] else r)
