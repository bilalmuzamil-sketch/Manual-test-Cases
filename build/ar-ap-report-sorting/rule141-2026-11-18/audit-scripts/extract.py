import json, re, html, csv
SUITES = ["ar-ap-report-sorting", "tiered-pricing", "founder-mode/bill-to", "founder-mode/internal-work-orders", "splitting-sales-reps",
          "technician-toggle", "founder-mode/what-why", "founder-mode/part-lifecycle", "credit-terms"]
B = "/home/user/Manual-test-Cases/build/"
def txt(h):
    h = re.sub(r"</(li|p|ol|ul)>", "\n", h or ""); h = re.sub(r"<[^>]+>", "", h); return html.unescape(h)
out = {}
for s in SUITES:
    d = json.load(open(B + s + "/authoring/proposals.json"))
    idm = {}
    for r in csv.DictReader(open(B + s + "/testrail-id-map.csv")): idm[r["key"]] = r["case_id"]
    for k, v in d.items():
        f = v["fields"]; ex = txt(f.get("custom_expected", ""))
        cut = min([i for i in (ex.find("Exact quotes from the source"), ex.find("AUTOMATION:"), ex.find("References from Design")) if i >= 0] or [len(ex)])
        out[f"{s}|{k}"] = dict(suite=s, key=k, cid=str(v.get("case_id") or idm.get(k) or ""), title=f["title"], sec=v.get("sec"),
                              section_name=v.get("section_name", ""), held=v.get("held"), pre=txt(f.get("custom_preconds", "")),
                              steps=txt(f.get("custom_steps", "")), res=ex[:cut], below=ex[cut:])
json.dump(out, open("cases.json", "w"))
print(len(out))
