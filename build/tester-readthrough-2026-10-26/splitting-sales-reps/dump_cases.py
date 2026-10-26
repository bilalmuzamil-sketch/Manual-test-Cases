#!/usr/bin/env python3
"""Plain-text dump of every remaining Splitting Sales Representatives case for the tester read-through (26 Oct 2026).
python3 dump_cases.py <source: live|draft> <outdir>   live = applied/C<id>-after.json; draft = authoring/proposals.json + DR-PATTERN.json"""
import sys, os, json, csv, re, html
H = os.path.dirname(os.path.abspath(__file__)); B = os.path.dirname(os.path.dirname(H)); P = f"{B}/build/splitting-sales-reps" if os.path.isdir(f"{B}/build") else f"{os.path.dirname(os.path.dirname(H))}/splitting-sales-reps"
P = os.path.join(os.path.dirname(os.path.dirname(H)), "splitting-sales-reps")
def txt(s): return html.unescape(re.sub(r"<[^>]+>", "", s))
def fields(src):
    m = list(csv.DictReader(open(f"{P}/testrail-id-map.csv")))
    if src == "live": return [(r["key"], r["case_id"], json.load(open(f"{P}/applied/C{r['case_id']}-after.json"))) for r in m]
    prop = json.load(open(f"{P}/authoring/proposals.json")); dr = json.load(open(f"{P}/pattern-format-2026-10-26/DR-PATTERN.json"))
    return [(r["key"], r["case_id"], (dr[r["key"]] if r["key"].startswith("DR-") else prop[r["key"]])["fields"]) for r in m]
def tester_text(f, quotes=True):
    out = [f"TITLE: {f['title']}", "PRE:"]
    out += ["  - " + txt(x) for x in re.findall(r"<li>(.*?)</li>", f["custom_preconds"], re.S)]
    out.append("STEPS:")
    out += [f"  {i}. " + txt(x) for i, x in enumerate(re.findall(r"<li>(.*?)</li>", f["custom_steps"], re.S), 1)]
    ex = f["custom_expected"]; head, tail = ex.split("<p></p>", 1)
    for n, ul in re.findall(r"<p>Step (\d+):</p><ul>(.*?)</ul>", head, re.S):
        out.append(f"  R{n}:"); out += ["     * " + txt(x) for x in re.findall(r"<li>(.*?)</li>", ul, re.S)]
    if quotes:
        out.append("BELOW:")
        for blk in re.findall(r"<p>(.*?)</p>|<li>(.*?)</li>", tail, re.S):
            t = txt(blk[0] or blk[1]).strip()
            if t: out.append("   | " + t)
    return "\n".join(out)
if __name__ == "__main__":
    src, od = sys.argv[1], sys.argv[2]; os.makedirs(od, exist_ok=True)
    allc = fields(src); chunk, n = [], 0
    for i, (k, cid, f) in enumerate(allc):
        chunk.append(f"===== {k} C{cid}\n" + tester_text(f))
    s = "\n".join(chunk); open(f"{od}/all-{src}.txt", "w").write(s); print(len(allc), "cases", len(s), "chars")
