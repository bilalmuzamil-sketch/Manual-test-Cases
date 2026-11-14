"""14 Nov 2026: which cases quote or depend on a requirement changed between PRD v11 and v13, and which quotes are not word for word in v13.
Two sides: the library model (authoring/, quotes by code resolved against v11 as the 10 Nov write did) and the LIVE text (read 14 Nov:
quotes block parsed, HTML stripped and unescaped). Dependence candidates by keyword are listed with the matching lines for a human read."""
import sys, os, re, json, html, csv, importlib
from collections import defaultdict
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); os.chdir(f"{B}/authoring")
import ar_lib as L
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design", "cases_v11", "cases_demo_2026_11_13"]:
    importlib.import_module(m)
V13MD = open(L.PRD13_FILE).read().split("<!-- Saved")[0]
V13W = L.ws(L.md_to_text(V13MD)); V13RAW = L.ws(re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", V13MD))
V11W, V11RAW = L.PRDW, L.PRD_RAWW
CHANGED = {"S1-R8", "S4-R1", "S5-E3", "S8-R3"}; NEW = {"S3-R7b", "S5-R10b"}
mp = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
live = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14.json"))["cases"]}
DEMO = {c["key"] for c in L.CASES if c["key"] >= "D-82" and c["key"] <= "D-95" and c["key"].startswith("D-")}
def in_src(label, t):
    t = L.ws(t)
    if label.startswith("Chris Ward's answer"): return t in L.ws(L.ANS[int(label.split()[-1])])
    if label.startswith("Tech plan"): return t in L.TPW or t in L.TP_RAWW
    if label.startswith("Jira SV-"): return t in L.JIRAW
    if label.startswith("Slack, Chris Ward"): return t in L.SLACKW
    return None   # a PRD quote: judged against v13 by the caller
def strip(h): return L.ws(re.sub(r"<[^>]+>", " ", h or ""))
def live_quotes(e):
    q = []
    part = (e or "").split("Exact quotes from the source")[-1].split("References from Design")[0]
    for li in re.findall(r"<li>(.*?)</li>", part, re.S):
        m = re.match(r"\s*<strong>(.*?):</strong>\s*(.*)$", li, re.S)
        if not m: continue
        lab = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        t = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
        t = re.sub(r'^[“"]|[”"]$', "", t.strip())
        q.append((lab, t))
    return q
KW = {
 "S1-R8": r"next 100|first 100|100 documents|load(s|ed)? (more|as)|as you scroll|scroll(ing)? down|30 customers|30 vendors|paging|next 30",
 "S3-R7b": r"Subtotal|subtotal|Total for|total row for|closes each|ends with a row",
 "S4-R1": r"Collapse all|Expand all|chevron",
 "S5-E3": r"as-of date|As of date|as of date",
 "S5-R10b": r"after today|tomorrow|future|later day|day after|capped|cannot pick|greyed|D20|today's date|a later date",
 "S8-R3": r"1440|sideways|scroll bar|wrap|pinned to the right|78 characters|long vendor name|very long",
}
out = {"changed": {}, "new": {}, "not_verbatim_v13": {}, "candidates": defaultdict(list)}
lib = {}
for c in L.CASES:
    k = c["key"]
    if k in DEMO: continue
    qs = L.quotes(c); codes = L.codes_of(c)
    bad_lib = []
    for lab, t in qs:
        r = in_src(lab, t)
        if r is None: r = (L.ws(t) in V13W or L.ws(t) in V13RAW)
        if not r: bad_lib.append(lab)
    cid = mp.get(k); lv = live.get(cid) if cid else None
    lq = live_quotes(lv["custom_expected"]) if lv else []
    bad_live = []
    for lab, t in lq:
        r = in_src(lab, t)
        if r is None: r = (L.ws(t) in V13W or L.ws(t) in V13RAW)
        if not r: bad_live.append(lab)
    lib[k] = dict(case=cid, codes=sorted(codes), bad_lib=bad_lib, bad_live=bad_live, live_labels=[l for l, _ in lq])
    for x in CHANGED | NEW:
        lab_hit = any(l.split(" ")[0] == x for l, _ in lq)
        if x in codes or lab_hit: out["changed" if x in CHANGED else "new"].setdefault(x, []).append(k)
    if bad_lib or bad_live: out["not_verbatim_v13"][k] = {"library": bad_lib, "live": bad_live}
    text_lib = " | ".join([c["title"]] + [a for a, _ in c["pre"]] + c["steps"] + c["res"] + [c["note"], c["known"]])
    text_live = " | ".join(strip(lv.get(f)) for f in ("title", "custom_preconds", "custom_steps")) + " | " + strip((lv or {}).get("custom_expected", "").split("Exact quotes from the source")[0]) if lv else ""
    for x, pat in KW.items():
        hits = sorted(set(re.findall(r"[^|.]{0,90}(?:%s)[^|.]{0,90}" % pat, text_lib + " || " + text_live)))
        if hits: out["candidates"][x].append({"key": k, "case": cid, "hits": hits[:6]})
json.dump(out, open(f"{W}/affected-raw.json", "w"), indent=1, ensure_ascii=False)
json.dump(lib, open(f"{W}/quote-check-raw.json", "w"), indent=1, ensure_ascii=False)
print("library cases checked", len(lib), "(demo D-82..D-95 excluded:", len(DEMO), ")")
for x in sorted(CHANGED | NEW):
    print(x, "quoted by", len(out["changed" if x in CHANGED else "new"].get(x, [])), sorted(out["changed" if x in CHANGED else "new"].get(x, [])))
print("not verbatim in v13:", {k: v for k, v in out["not_verbatim_v13"].items()})
for x in KW: print("candidates", x, len(out["candidates"][x]))
