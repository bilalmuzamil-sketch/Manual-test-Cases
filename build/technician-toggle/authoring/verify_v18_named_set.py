#!/usr/bin/env python3
"""Named-set proof for PRD v18 (QA lead 2 Nov 2026: "Named set"). Exit 1 on any failure.
 (a) every quote of every named-set and new case is word for word in PRD v18 (or Chris's answers / the saved tickets / tech plan),
     and no such case names PRD version 17 or the old design version;
 (b) every mapped case OUTSIDE the set renders exactly like its TestRail read-back (applied/C<id>-after.json): title, preconditions,
     steps, expected and refs — nothing outside the set changes, not even version stamps;
 (c) every mapped case's v17 quotes are also word for word in v18 (so an unchanged case is still true to v18);
 (d) the Rule 134 record: for each named-set case, each part CHANGED or CONFIRMED against its read-back. Writes v18-named-set-record.json."""
import sys, os, json, csv, re, glob, importlib
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import tt_lib as L
for m in sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py")): importlib.import_module(m)
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{L.P}/testrail-id-map.csv"))}
NO_MANUAL = L.NO_MANUAL
F = ("title", "custom_preconds", "custom_steps", "custom_expected")
fail, rec = [], {}
keys = {c["key"] for c in L.CASES}
for k in L.NAMED_SET:
    if k not in keys: fail.append(f"named-set key {k} is not in the library")
for k in L.DELETED:
    if k in keys: fail.append(f"deleted case {k} is still in the library")
for c in L.CASES:
    k = c["key"]; f = L.render(c); v18 = L.on_v18(c)
    if v18:
        for lab, t in L.quotes(c):
            src = L.JIRAW if lab.startswith("Jira") else L.PLANW if lab.startswith("Tech plan") else L.ANSW if lab.startswith("Answer ") else None
            ok = (L.ws(t) in src) if src is not None else L._in18(t)
            if not ok: fail.append(f"{k}: quote {lab} not word for word in its source (v18 set)")
        if re.search(r"version 17\b", f["custom_expected"]) or "1793629882-06f7" in f["custom_expected"]: fail.append(f"{k}: set/new case names PRD v17 or the old design version")
    if k not in ids: continue
    a = json.load(open(f"{L.P}/applied/C{ids[k]}-after.json"))
    diff = [x for x in F if a.get(x) != f[x]] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if k in L.NAMED_SET:
        rec[k] = {"case": f"C{ids[k]}", **{x: ("CHANGED" if x in diff else "CONFIRMED") for x in F + ("refs",)},
                  "quotes_from": "PRD v18" + (" + Chris's answers" if any(l.startswith("Answer ") for l, _ in L.quotes(c)) else ""),
                  "automation": c["marker"], "held": c["held"]}
    elif diff: fail.append(f"{k} (C{ids[k]}): outside the named set but renders differently from its read-back: {diff}")
    else:
        for lab, t in L.quotes(c):
            if not (lab.startswith(("Jira", "Tech plan", "Answer "))) and not L._in18(t): fail.append(f"{k}: v17 quote {lab} is not word for word in v18 (needs the set)")
new = sorted(k for k in keys if k not in ids and k not in NO_MANUAL)
json.dump({"named_set": rec, "new_cases": new, "deleted": L.DELETED}, open(f"{D}/v18-named-set-record.json", "w"), indent=1)
print(f"named set {len(L.NAMED_SET)} (in TestRail {len(rec)}) | changed parts: " +
      str({x: sum(1 for r in rec.values() if r[x] == 'CHANGED') for x in F + ('refs',)}) +
      f" | outside the set and mapped: {len([k for k in ids if k not in L.NAMED_SET and k in keys])} checked identical | new {new} | deleted {sorted(L.DELETED)}")
for x in fail: print("FAIL", x)
print("failures:", len(fail)); sys.exit(1 if fail else 0)
