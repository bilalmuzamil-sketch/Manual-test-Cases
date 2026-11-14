"""PRD v1.4 / design 1794565397-7f4c impact (14 Nov 2026, read-only): which cases in authoring/proposals.json are touched.
Touched = quotes a changed requirement or message row (S12-R3, S2-R22, S12-E8, User Feedback Summary row 35 "No-charge line"),
or names the chip text in steps/results ("No Charge · ..." chip, "No Charge · Warranty", "No Charge · [category ...]"),
or references a changed board (flow6-3, flow6-4, hf-32, hf-33, rv-6-3, rv-6-4) by its picture.   python3 impact_v14.py"""
import json, re, csv, html, os
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(os.path.dirname(H))
PROP = json.load(open(f"{P}/authoring/proposals.json"))
MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
NEW = dict(re.findall(r'^[DP]\("([A-Z0-9-]+)", "(I-[PS]\d+[a-c]?)"', open(f"{P}/authoring/cases_zzzz_stress.py").read(), re.M))
CODES = {"S12-R3", "S2-R22", "S12-E8", "UFS-35"}
QUOTE_LABEL = re.compile(r'<li><strong>(S12-R3|S2-R22|S12-E8):</strong>|No-charge line \| &quot;No Charge · \[category\]|No-charge line \| "No Charge · \[category\]')
PICS = {"iwo-flow6-03-03-line-marked-no-charge-0-00.png": "flow6-3", "iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png": "flow6-4",
        "iwo-happy-32-32-line-marked-no-charge-0-00.png": "hf-32", "iwo-happy-33-33-line-menu-change-category-mark-as-billable.png": "hf-33",
        "iwo-review-25-6-3-32-line-marked-no-charge-0-00.png": "rv-6-3", "iwo-review-26-6-4-33-line-menu-change-category-mark-as-billable.png": "rv-6-4"}
FILTERCHIP = r"Classification|Status chip|Internal work orders|Technician Efficiency|remove control|picker|[A-C].s chip|shows as a (second )?chip|chips? (offers|need)|chip.s values|chip on Show all|chip to \"|chip reads \"Only|chip still reads|filter chips|same chip|Hover the chip|chip with customer|no chip covers them"
CHIP = re.compile(r"No Charge · |No Charge &middot; |No Charge ·|chip", re.I)
NOTE = {"S12-33": "the Issue Credit line 'Under the part's name it reads \"No Charge · Goodwill\"' has no PRD sentence of its own (S12-E7 is silent); it followed the chip text, so check its basis when rewriting"}
def text(h): return html.unescape(re.sub(r"<[^>]+>", " ", h or ""))
out = {"existing": [], "new": []}
for k, v in PROP.items():
    f = v["fields"]; exp = f["custom_expected"]
    tester = text(f["custom_preconds"]) + " " + text(f["custom_steps"]) + " " + text(exp.split("Exact quotes")[0])
    design = exp.split("References from Design", 1)[1] if "References from Design" in exp else ""
    why = []
    codes = sorted(set(v["codes"]) & CODES)
    if codes: why.append("quotes " + ", ".join(codes))
    chips = sorted(set(m.group(0) for m in re.finditer(r'(?<!\] · )"?No Charge · [^"]{0,40}"?', tester)))   # not the journal memo "WO #[number] · No Charge · [category]" (S7-R2)
    if chips: why.append("tester text names the chip text: " + " | ".join(c.strip()[:70] for c in chips[:3]))
    # the no-charge line's chip named without its text (filter chips and turn-on chips are other things and are left out)
    gen = [s.strip() for s in re.split(r"(?<=[.;])\s+", tester) if re.search(r"\bchip\b", s) and not re.search(FILTERCHIP, s) and "No Charge · " not in s]
    if gen: why.append("tester text names the line chip without its text: " + " | ".join(g[:90] for g in gen[:2]))
    boards = sorted({b for p, b in PICS.items() if p in design})
    if boards: why.append("references changed board(s) " + ", ".join(boards))
    words = sorted(set(re.findall(r"&ldquo;(No Charge · [^&]*)&rdquo;", design)))
    if words: why.append("design words " + ", ".join(words))
    if not why: continue
    w = " ".join(why)
    if "chip text" in w: verdict = "CHANGE: expects the old chip text \"No Charge · [category]\"; v1.4 chip reads \"No Charge\", category in the tooltip"
    elif re.search(r"quotes .*S12-R3|UFS-35", w): verdict = "CHANGE: quotes the changed chip sentence"
    elif re.search(r"quotes .*(S12-E8|S2-R22)", w): verdict = "RE-QUOTE: quotes a requirement whose chip words changed; the part this case tests is unchanged"
    elif "changed board" in w: verdict = "DESIGN REFERENCE: the attached picture and design words show the old chip; refresh to the v5 picture"
    else: verdict = "CONFIRM: names the chip without its text; still true in v1.4"
    rec = {"key": k, "title": v["title"], "held": v["held"], "why": why, "verdict": verdict, "note": NOTE.get(k, ""), "automation": v["automation"][:60]}
    if k in NEW: rec["scan"] = NEW[k]; out["new"].append(rec)
    elif k in MAP and not v["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up"):
        rec["cid"] = MAP[k]["case_id"]; rec["link"] = MAP[k]["link"]; out["existing"].append(rec)
    else: out.setdefault("library_only", []).append(rec)
json.dump(out, open(f"{H}/impact-v14.json", "w"), indent=1, ensure_ascii=False)
for g in out: print(g, len(out[g]))
for g in out:
    for r in out[g]: print(g, r["key"], r.get("cid", r.get("scan", "")), "|", r["title"][:70], "|", r["verdict"][:40], "|", " ; ".join(r["why"])[:200])
