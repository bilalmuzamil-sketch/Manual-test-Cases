"""Per-case, per-part record for PASS-REPORT.md (Rule 134): for every case, each part CHANGED or CONFIRMED, and for a changed quote list
or design block the lines that left and arrived. Compares the 10 Nov 2026 live snapshot with authoring/proposals.json. Read-only."""
import json, re, html, csv
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-10"
P = json.load(open(f"{B}/authoring/proposals.json")); ST = json.load(open(f"{W}/stamp-diff.json"))
SNAP = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-cases-2026-11-10.json"))["cases"]}
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
def txt(h): h = re.sub(r"<li>", "\n- ", h or ""); h = re.sub(r"</p>|</ul>|<br\s*/?>", "\n", h); h = re.sub(r"<[^>]+>", "", h); return [l.strip() for l in html.unescape(h).split("\n") if l.strip()]
def split(e):
    a, _, rest = e.partition("<p><strong>Exact quotes"); q, _, d = rest.partition("References from Design"); return a, q, d
out = {}
for k, st in ST.items():
    if st["status"] == "GONE": out[k] = {"status": "RETIRE"}; continue
    f = P[k]["fields"]
    if st["status"] == "NEW": out[k] = {"status": "NEW"}; continue
    s = SNAP[ids[k]]; ra, rq, rd = split(s["custom_expected"]); na, nq, nd = split(f["custom_expected"])
    ql = lambda q: [l for l in txt(q) if l.startswith("- ")]
    oq, nq2 = ql(rq), ql(nq); od, nd2 = txt(rd), txt(nd)
    out[k] = {"status": "CHANGE" if st["status"] == "CHANGED" else "CONFIRMED (stamps only)", "parts": st["parts"],
              "quotes_left": [l[2:80] for l in oq if l not in nq2], "quotes_arrived": [l[2:80] for l in nq2 if l not in oq],
              "design_left": [l[:110] for l in od if l not in nd2], "design_arrived": [l[:110] for l in nd2 if l not in od]}
json.dump(out, open(f"{W}/pass-parts.json", "w"), indent=1, ensure_ascii=False)
print(len(out))
