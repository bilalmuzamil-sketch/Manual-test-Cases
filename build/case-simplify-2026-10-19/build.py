#!/usr/bin/env python3
"""Render and check the three corrected cases; with --apply write ONLY custom_preconds and custom_steps (edit lock on updated_on),
read back, and prove custom_expected is byte-identical to the before-copy."""
import sys, json, re, html
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
from cases import CASES, SETUP_LINK, BLOCKED
e = lambda s: html.escape(s, quote=False)
def render(c):
    pre = SETUP_LINK + "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"] + [(BLOCKED, None)]) + "</ul>"
    return {"custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>"}
txt = lambda h: html.unescape(re.sub(r"<[^>]+>", " ", h))
probs = []
for cid, c in CASES.items():
    b = json.load(open(f"before/C{cid}.json")); exp = b["custom_expected"]
    refs = {int(n) for n in re.findall(r"Steps? (\d+)", txt(exp))} | {int(n) for n in re.findall(r"Steps \d+ and (\d+)", txt(exp))}
    old_n = txt(b["custom_steps"]).count("") and len(re.findall(r"<li>|<p>", b["custom_steps"]))
    if refs and max(refs) > len(c["steps"]): probs.append(f"C{cid}: expected points to step {max(refs)}, only {len(c['steps'])} steps")
    defined = set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(a for a, _ in c["pre"])))
    used = set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(c["steps"]) + txt(exp)))
    if used - defined: probs.append(f"C{cid}: placeholders not defined in preconditions: {used - defined}")
    for a, x in c["pre"]:
        if x and not x.startswith("For example:"): probs.append(f"C{cid}: example line")
    if "[" in " ".join(c["steps"]) or "ZZAUTOTEST" in " ".join(c["steps"]): probs.append(f"C{cid}: old placeholder or hard-coded record in steps")
    print(f"C{cid}: {len(c['pre'])+1} preconditions (was {txt(b['custom_preconds']).count('•') or b['custom_preconds'].count('<li>')} lines), {len(c['steps'])} steps (was {b['custom_steps'].count('<li>') or b['custom_steps'].count('<p>')}); expected points to steps {sorted(refs)}")
for p in probs: print("PROBLEM", p)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
log = open("applied/apply-log.jsonl", "a"); bad = 0
for cid, c in CASES.items():
    b = json.load(open(f"before/C{cid}.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != b["updated_on"]: log.write(json.dumps({"op": "refused_edit_lock", "case": f"C{cid}"}) + "\n"); bad += 1; continue
    f = render(c); api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    ok = all(a.get(k) == v for k, v in f.items()); same = a["custom_expected"] == b["custom_expected"] and a["title"] == b["title"]
    bad += not (ok and same)
    json.dump(a, open(f"applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "case": f"C{cid}", "http": st, "fields": list(f), "readback_ok": ok, "expected_and_title_unchanged": same, "custom_atmstatus_at_write": live.get("custom_atmstatus")}) + "\n"); log.flush()
print("problems:", bad)
