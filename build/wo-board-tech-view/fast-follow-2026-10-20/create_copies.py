#!/usr/bin/env python3
"""Check and (--apply) create the release copies (QA lead, 20 Oct 2026: "1. Yes"; "2. With Suffix and the title should clearly
tell in 80 characters as to what we are testing"). Adds them to run 498 (union only) and reads everything back."""
import sys, json, re, html, glob
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PRD = re.sub(r"\s+", " ", open("../prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md").read().replace("**", ""))
orig = {c["id"]: c for c in json.load(open("before/wo-cases-2026-10-20.json"))}
WANT = {96963, 96973, 154889, 368133, 368135, 368136, 368140, 581891, 581892, 581893, 97002, 97007, 97008, 97009, 368144, 97028}
BAD = ["Lead technician updated", "Lead technician removed", "assigned to", "Undo", "moved to Unassigned", "Assign lead technician",
       "Reassign lead technician", "seconds", "Assignment undone", "lead technician set to"]
txt = lambda h: html.unescape(re.sub(r"<[^>]+>", " ", h or ""))
C = {}
for f in sorted(glob.glob("copies-*.json")): C.update({int(k.lstrip("C")): v for k, v in json.load(open(f)).items()})
probs = {}
for i, v in C.items():
    p = []; o = orig[i]
    if v.get("section_id") != o["section_id"]: p.append("section differs from the original's")
    t = v["title"]
    if not t.endswith(" (release)") or len(t) > 80 or ";" in t or t == o["title"]: p.append(f"title: {t} ({len(t)})")
    e = v["custom_expected"]; et = txt(e)
    if re.findall(r"AUTOMATION: [^\n<]*", e) != ["AUTOMATION: READY"] or not e.rstrip().endswith("AUTOMATION: READY</p>"): p.append("AUTOMATION line")
    if re.search(r"Known problem[^.]*SV-1152[24]", et): p.append("SV-11522/24 known problem left")
    if f"C{i}" not in et or "p1792455057423139" not in e: p.append("release-copy paragraph missing")
    for code, q in re.findall(r"(S\d+-[RNE]\d+[a-z]?)\s*:?\s*[“\"]((?:[^”]|”(?!\s*(?:</|$)))+?)”(?=\s*(?:<|$|\n| S\d|\.|\)|,|;))", e.replace("&ldquo;", "“").replace("&rdquo;", "”")):
        for part in [x.strip(" .") for x in re.split(r"\s*(?:…|\.\.\.)\s*", re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", q)))) if len(x.strip()) > 12]:
            if part not in PRD and part.replace("'", "’") not in PRD: p.append(f"quote not in v68: {code} {part[:50]}")
    res = et.split("Release copy of")[0]
    res_unq = re.sub(r"“[^”]*”|\"[^\"]*\"", "", res)
    steps_t = txt(v["custom_steps"]).replace("Assigned to me", "")
    res_unq = res_unq.replace("Assigned to me", "")
    for w in BAD:
        if w.lower() in res_unq.lower() or w.lower() in steps_t.lower(): p.append(f"fast-follow words left: {w}")
    n = len(re.findall(r"<li", v["custom_steps"])); r = re.findall(r"Step (\d+):", res)
    if [int(x) for x in r] != list(range(1, n + 1)): p.append(f"Step N results {r} vs {n} steps")
    if p: probs[i] = p
print(len(C), "copies of", len(WANT), "; missing:", sorted(WANT - set(C)), "; extra:", sorted(set(C) - WANT))
for i, p in probs.items(): print(f"C{i}:", p[:5])
if probs or set(C) != WANT or "--apply" not in sys.argv: sys.exit(1 if probs or set(C) != WANT else 0)
n_ = lambda x: re.sub(r"\s+", " ", txt(x)).strip(); log = []
for i, v in sorted(C.items()):
    o = orig[i]
    body = {k: v[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected")}
    body.update(template_id=o["template_id"], type_id=o["type_id"], priority_id=o["priority_id"], refs=v.get("refs") or o["refs"], custom_atmstatus=1)
    if o.get("custom_automation_type") is not None: body["custom_automation_type"] = o["custom_automation_type"]
    nc = api(f"add_case/{v['section_id']}", body); st = LAST["status"]; a = api(f"get_case/{nc['id']}")
    ok = all(n_(a[k]) == n_(body[k]) for k in ("custom_preconds", "custom_steps", "custom_expected")) and a["title"] == body["title"] and a["section_id"] == v["section_id"]
    json.dump(a, open(f"applied-copies/C{a['id']}-after.json", "w"), indent=1, ensure_ascii=False)
    log.append(dict(original=i, copy=a["id"], http=st, readback_ok=ok, title=a["title"], section=a["section_id"])); print(i, "->", a["id"], ok)
def tests():
    out, off = [], 0
    while True:
        d = api(f"get_tests/498&limit=250&offset={off}"); out += d["tests"]
        if not d["_links"]["next"]: return out
        off += 250
b = tests(); bi = {t["case_id"] for t in b}; bs = {t["case_id"]: (t["id"], t["status_id"]) for t in b}
new = {l["copy"] for l in log}
api("update_run/498", {"include_all": False, "case_ids": sorted(bi | new)}); st = LAST["status"]
a = tests(); ai = {t["case_id"] for t in a}; as_ = {t["case_id"]: (t["id"], t["status_id"]) for t in a}
r = dict(http=st, before=len(bi), after=len(ai), dropped=sorted(bi - ai), changed=[x for x in bi if as_.get(x) != bs[x]])
for l in log: l["test"] = as_.get(l["copy"], (None,))[0]
print(r); json.dump({"cases": log, "run": r}, open("applied-copies/log.json", "w"), indent=1, ensure_ascii=False)
