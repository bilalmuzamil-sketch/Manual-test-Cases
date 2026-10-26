"""Dump every case's tester text (title, preconditions, steps, results, note) plus its quote labels and quotes, from proposals.json, for the read-through."""
import json, csv, re, html, sys
P = "/home/user/Manual-test-Cases/build/credit-terms"
prop = json.load(open(f"{P}/authoring/proposals.json"))
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
def li(h): return [html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
out = []
for k, v in prop.items():
    f = v["fields"]; ex = f["custom_expected"]
    head, rest = ex.split("<p></p>", 1)
    out.append(f"=== {k} C{ids.get(k,'-')} [{v['sec']}] {v['title']}")
    out.append("PRE: " + " | ".join(li(f["custom_preconds"])))
    for i, s in enumerate(li(f["custom_steps"]), 1): out.append(f"  {i}. {s}")
    for m in re.finditer(r"<p>(Step \d+:)</p><ul>(.*?)</ul>", head, re.S):
        out.append(f"  {m.group(1)} " + " / ".join(li(m.group(2))))
    note = rest.split("<p><strong>Exact quotes")[0]
    if note.strip(): out.append("NOTE: " + html.unescape(re.sub(r"<[^>]+>", " ", note)).strip())
    q = rest.split("<p><strong>Exact quotes")[1].split("References from Design")[0]
    if "--q" in sys.argv:
        for x in li(q): out.append("  Q " + re.sub(r"<[^>]+>", "", x)[:400])
    out.append("MARK: " + v["automation"].replace("AUTOMATION: ", ""))
open(sys.argv[1], "w").write("\n".join(out) + "\n")
