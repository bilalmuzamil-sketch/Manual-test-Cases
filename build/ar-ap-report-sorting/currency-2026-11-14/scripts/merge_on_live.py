"""14 Nov 2026: build each case's PRD v13 body ON ITS LIVE TEXT, so nothing edited outside our library is undone.

Three sides per field (title, custom_preconds, custom_steps, custom_expected, refs):
  base   = our last written body (currency-2026-11-10/applied/C<id>-after.json, the read-back of 10 Nov 2026)
  ours   = the library's v13 body (authoring/proposals.json, built by build.py)
  theirs = the live text read 14 Nov 2026 (live-before/live-2026-11-14.json)
ours == base -> theirs (nothing of ours to change); theirs == base -> ours; otherwise a line merge (git merge-file --diff3, one HTML
paragraph or list item per line) where every conflict is settled by a NAMED rule, or listed as unresolved:
  R1 From line   theirs' line with the PRD name, version and read date taken from ours (version 13); the rest of their line kept
  R2 build line  ours where v13_layout.BUILD gives the case its own line (a result no build has shown), else theirs
  R3 marker      ours where v13_layout.MARKER sets one (S5-37), else theirs
  R4 quote line  ours (the v13 sentence, proved word for word by quote_check.py); theirs only re-encoded or re-quoted the same item
  R5 tester line where the rewrite changed the same line theirs changed (D-52 header chevron, D-16 note): ours, listed in the pass report
Output: currency-2026-11-14/proposals-v13-on-live.json ({key: {"case": id, "fields": {...}, "changed": [...], "rules": [...]}}) and
merge-report.json. Read-only: no TestRail call."""
import json, csv, re, os, sys, subprocess, tempfile
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring")
import v13_layout as V13L
PROP = json.load(open(f"{B}/authoring/proposals.json"))
LIVE = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14.json"))["cases"]}
MAP = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
DEMO = {f"D-{n}" for n in range(82, 96)}
F = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
SPLIT = re.compile(r"(</p>|</li>|<ul>|</ul>|<ol>|</ol>)")
def lines(s): return [x for x in SPLIT.sub(r"\1\n", s or "").split("\n") if x != ""]
PRDNAME = re.compile(r'PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version \d+ \([^)]*\), read [^&<]*?(?= &middot;|</p>| ·)')
def kind(l):
    if l.startswith("<p>From: "): return "from"
    if l.startswith(("<p>Not yet checked", "<p>Last checked", "<p>Partly checked")): return "build"
    if l.startswith("<p>AUTOMATION:"): return "marker"
    if re.match(r"<li><strong>[^<]*:</strong>", l): return "quote"
    return "other"
R5_OURS = {"D-16"}        # the tech-plan note: theirs only renamed "S8-R3" to "its layout rules"; ours keeps their wording and adds the v13 point
THEIRS_TESTER = {"D-52"}  # live already makes the v13 change (blue header chevron) "on the QA lead's instruction" (12 Nov 2026): keep theirs
import difflib
def resolve(key, o, t, bb):
    """One conflict hunk, aligned line by line (difflib). A line only one side has is that side's addition unless base had it (then the other
    side deleted it, and the deletion stands). A replaced pair follows its kind: From R1, quote R4 (ours), build line R2, marker R3, tester line
    R5 (ours only for R5_OURS; theirs for everything else, listed). Returns (lines, rules, notes)."""
    out, rules, notes = [], [], []
    sm = difflib.SequenceMatcher(None, o, t, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        oo, tt = o[i1:i2], t[j1:j2]
        if tag == "equal": out += oo; continue
        if tag in ("delete", "replace") and not tt:
            for x in oo:
                if x in bb: rules.append("their deletion kept")
                else: out.append(x); rules.append("our addition")
            continue
        if tag == "insert":
            for x in tt:
                if x in bb: rules.append("our deletion kept")
                else: out.append(x); rules.append("their addition")
            continue
        # replace: pair by position, leftovers as additions/deletions
        n = max(len(oo), len(tt))
        for i in range(n):
            a = oo[i] if i < len(oo) else None; b = tt[i] if i < len(tt) else None
            if a is None: (rules.append("our deletion kept") if b in bb else (out.append(b), rules.append("their addition"))); continue
            if b is None: (rules.append("their deletion kept") if a in bb else (out.append(a), rules.append("our addition"))); continue
            ka, kb = kind(a), kind(b)
            if ka != kb or (ka == "other" and difflib.SequenceMatcher(None, a, b).ratio() < 0.5):   # not the same line: two additions (or deletions)
                if a not in bb: out.append(a); rules.append("our addition")
                else: rules.append("their deletion kept")
                if b not in bb: out.append(b); rules.append("their addition")
                else: rules.append("our deletion kept")
                continue
            if ka == kb == "from":
                m = PRDNAME.search(a)
                if m and PRDNAME.search(b): out.append(PRDNAME.sub(m.group(0).replace("\\", "\\\\"), b, count=1)); rules.append("R1"); continue
                out.append(a); rules.append("R1 ours (no PRD name in theirs)"); continue
            if ka == kb == "quote": out.append(a); rules.append("R4"); continue
            if ka == kb == "build": out.append(a if key in V13L.BUILD else b); rules.append("R2 " + ("ours" if key in V13L.BUILD else "theirs")); continue
            if ka == kb == "marker": out.append(a if key in V13L.MARKER else b); rules.append("R3 " + ("ours" if key in V13L.MARKER else "theirs")); continue
            if b in bb:                      # theirs kept the base line here: ours replaced it
                out.append(a); rules.append("ours (theirs unchanged)"); continue
            if a in bb:                      # ours kept the base line: theirs replaced it
                out.append(b); rules.append("theirs (ours unchanged)"); continue
            if key in R5_OURS and key not in THEIRS_TESTER: out.append(a); rules.append("R5 ours"); notes.append({"ours": a, "theirs": b})
            else:
                # both changed the same tester line: keep both, ours first? no: keep theirs and list ours for the QA lead
                out.append(b); rules.append("R5 theirs"); notes.append({"ours_not_applied": a, "theirs": b})
    return out, rules, notes
def merge3(key, base, ours, theirs):
    with tempfile.TemporaryDirectory() as d:
        for n, v in (("o", ours), ("b", base), ("t", theirs)): open(f"{d}/{n}", "w").write("\n".join(lines(v)) + "\n")
        r = subprocess.run(["git", "merge-file", "-p", "--diff3", "-L", "ours", "-L", "base", "-L", "theirs", f"{d}/o", f"{d}/b", f"{d}/t"],
                           capture_output=True, text=True)
    out, rules, bad = [], [], []
    st, o, bb, t = None, [], [], []
    for l in r.stdout.split("\n"):
        if l.startswith("<<<<<<< "): st = "o"; o, bb, t = [], [], []; continue
        if l.startswith("||||||| ") and st == "o": st = "b"; continue
        if l == "=======" and st in ("o", "b"): st = "t"; continue
        if l.startswith(">>>>>>> ") and st == "t":
            res, rr, notes = resolve(key, o, t, set(bb))
            rules += rr
            if notes: bad.append({"ours": o, "base": bb, "theirs": t, "why": "R5", "notes": notes})
            out += res; st = None; continue
        if st == "o": o.append(l)
        elif st == "b": bb.append(l)
        elif st == "t": t.append(l)
        elif l != "": out.append(l)
    return "".join(out), rules, bad
res, rep = {}, Counter(); unresolved = {}; r5 = {}
R6 = {"DATA-13": ("ZZAUTOTEST OVERPAID C715462 Cust A", "ZZAUTOTEST OVERPAID Cust A")}
for key, cid in sorted(MAP.items()):
    if key in DEMO or key not in PROP or cid not in LIVE: continue
    ap = f"{B}/currency-2026-11-10/applied/C{cid}-after.json"
    base = json.load(open(ap)); lv = LIVE[cid]; ours = PROP[key]["fields"]
    merged, changed, rules = {}, [], []
    for f in F:
        b, o, t = base.get(f) or "", ours.get(f) or "", lv.get(f) or ""
        if f == "refs": b, o, t = b.replace(" ", ""), o.replace(" ", ""), t.replace(" ", "")
        if o == b: m = t
        elif t == b: m = o; rules.append(f"{f}:ours")
        elif f in ("title", "refs"): m = t; unresolved.setdefault(key, []).append({"field": f, "ours": o, "theirs": t, "why": "both changed"})
        else:
            m, rr, bad = merge3(key, b, o, t); rules += [f"{f}:{x}" for x in rr]
            for x in bad:
                (r5.setdefault(key, []) if x["why"] == "R5" else unresolved.setdefault(key, [])).append(dict(x, field=f))
        if f == "refs": m = (lv.get("refs") or "") if m == t else m
        merged[f] = m
        if (m or "") != (lv.get(f) or ""): changed.append(f)
    # R6 (QA lead, 14 Nov 2026, "Apply on top, + SV-12723"): DATA-13's live preconditions (written outside our library) name the record
    # "ZZAUTOTEST OVERPAID C715462 Cust A"; a case id in tester text fails the readiness check (Rule 138). Only the id is dropped, nothing else.
    if key in R6:
        a, b = R6[key]
        assert merged["custom_preconds"].count(a) == 1, key
        merged["custom_preconds"] = merged["custom_preconds"].replace(a, b); rules.append("custom_preconds:R6 case id dropped")
        if "custom_preconds" not in changed: changed.insert(0, "custom_preconds")
    res[key] = {"case": cid, "fields": merged, "changed": changed, "rules": rules, "section_live": lv["section_id"]}
    rep["cases"] += 1; rep["with changes"] += bool(changed)
json.dump(res, open(f"{W}/proposals-v13-on-live.json", "w"), indent=1, ensure_ascii=False)
json.dump({"counts": rep, "unresolved": unresolved, "r5_same_line_changed_by_both": r5}, open(f"{W}/merge-report.json", "w"), indent=1, ensure_ascii=False)
print(dict(rep), "| unresolved cases:", len(unresolved), sorted(unresolved)[:20])
print("rules used:", Counter(r.split(":", 1)[1] for v in res.values() for r in v["rules"]))
print("R5 (same tester line changed by both):", {k: [n for x in v for n in x["notes"]] for k, v in r5.items()})
print("changed field sets:", Counter("+".join(v["changed"]) for v in res.values()))
