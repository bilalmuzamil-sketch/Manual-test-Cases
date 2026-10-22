#!/usr/bin/env python3
"""22 Oct 2026, QA lead "1. Yes do what is right to do" on Chris Ward's answers 39 and 40 (PRD v11):
- C690660 (DR-03, part sale labor columns dash): released. The design's dash is now PRD v11 S5-R15b (answer 39).
- C690658/659/661/663/664: PRD "From:" line moved to version 11 (their quotes are unchanged in v11, checked here).
- C690665 (DR-08, make a Lead Technician message show) is deleted by delete_dr08.py, not here.
python3 dr_apply.py [--apply]"""
import sys, os, json, re, html, urllib
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); A = f"{P}/design-recheck-2026-10-20/applied"
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, f"{P}/authoring"); import ssr_lib
OLD = "version 10 (19 Oct 2026, Chris Ward), read 20 Oct 2026"; NEW = "version 11 (21 Oct 2026, Chris Ward), read 22 Oct 2026"
def e(s): return html.escape(s, quote=False)
plan = {}
for cid in [690658, 690659, 690660, 690661, 690663, 690664]:
    a = json.load(open(f"{A}/C{cid}-after.json")); x = a["custom_expected"]
    assert x.count(OLD) <= 1, cid
    if OLD not in x and cid != 690661: raise SystemExit(cid)
    x = x.replace(OLD, NEW)
    # every PRD quote in the case must still be word for word in v11
    for code, q in re.findall(r"<li><strong>(S\d+-[RNE]\d+[a-z]?):</strong> &ldquo;(.*?)&rdquo;</li>", x):
        assert ssr_lib.ws(q) in ssr_lib.PRDW, (cid, code)
    if cid == 690660:
        s15b = ssr_lib.CODE["S5-R15b"]; a39 = ssr_lib.ANS[39]
        old_q = '<p>The build is not yet available to check this case against.</p>'
        assert x.count(old_q) == 1
        x = x.replace("&rdquo;</li></ul>" + old_q,
            f"&rdquo;</li><li><strong>S5-R15b:</strong> &ldquo;{e(s15b)}&rdquo;</li></ul>"
            f"<p>From: {e(ssr_lib.ANS_NAME)}, Google Sheet 17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ, tab \"Questions for Chris\", row 46, read 22 Oct 2026</p>"
            f"<ul><li><strong>Chris Ward's answer 39:</strong> &ldquo;{e(a39)}&rdquo;</li></ul>" + old_q)
        m = re.search(r"<p><strong>Where the design and the PRD differ:</strong>.*?</p>", x); assert m
        x = x.replace(m.group(0), "<p><strong>Where the design and the PRD differ:</strong> They agree now. On 21 Oct 2026 Chris Ward ruled for the design's dash and blank cells (answer 39, quoted above), and PRD version 11 added it as S5-R15b.</p>")
        assert x.endswith("<p>AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO</p>")
        x = x[: -len("<p>AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO</p>")] + "<p>AUTOMATION: HOLD - not yet build-verified (no build yet)</p>"
        refs = a["refs"]
    assert x.count("AUTOMATION:") == 1 and x.endswith("</p>") and x.rstrip("</p>").rsplit("<p>", 1)[1].startswith("AUTOMATION:")
    if x == a["custom_expected"] and cid != 690660: continue
    plan[cid] = (a, {"custom_expected": x} | ({"refs": a["refs"] + ", S5-R15b"} if cid == 690660 and "S5-R15b" not in (a["refs"] or "") else {}))
print({k: list(v[1]) for k, v in plan.items()})
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{D}/dr-apply-log.jsonl", "a")
for cid, (prev, f) in plan.items():
    live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]:
        log.write(json.dumps({"op": "refused_edit_lock", "case": f"C{cid}"}) + "\n"); print("LOCK", cid); continue
    json.dump(live, open(f"{D}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", f); st = LAST["status"]; b = api(f"get_case/{cid}")
    bad = [k for k, v in f.items() if b.get(k) != v]
    json.dump(b, open(f"{A}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "case": f"C{cid}", "http": st, "readback_ok": not bad, "bad": bad}) + "\n"); print(cid, st, bad)
