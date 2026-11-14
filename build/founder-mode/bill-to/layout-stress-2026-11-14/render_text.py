#!/usr/bin/env python3
"""Plain-text view of the layout stress cases (new keys and the six extended held cases) from authoring/proposals.json, for NEW-CASES.md and
for reading in full. python3 render_text.py [--tester] > out.txt"""
import json, os, re, html, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/authoring")
PROP = json.load(open(f"{P}/authoring/proposals.json"))
EXT = ["S3-32", "D-66", "D-67", "S16-02", "S14-13", "S9-06"]
def txt(s):
    s = re.sub(r"<li>", "\n- ", s or ""); s = re.sub(r"</p>|</ul>|</ol>|<br ?/?>", "\n", s); s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\n\s*\n+", "\n", html.unescape(s)).strip()
def steps(s):
    return "\n".join(f"{i}. {html.unescape(x)}" for i, x in enumerate(re.findall(r"<li>(.*?)</li>", s), 1))
def one(k, tester=False):
    v = PROP[k]; f = v["fields"]; e = f["custom_expected"]
    if tester: e = e.split("<p><strong>Exact quotes")[0]
    return (f"### {k} · {f['title']}\n\nFolder: {v['section_name']} · refs {f['refs']} · held: {'yes' if v['held'] else 'no'}\n\n"
            f"**Preconditions**\n{txt(f['custom_preconds']).replace('Preconditions', '', 1).strip()}\n\n**Steps**\n{steps(f['custom_steps'])}\n\n"
            f"{txt(e).replace('Expected Result', '**Expected Result**', 1)}\n")
if __name__ == "__main__":
    keys = [k for k in PROP if re.fullmatch(r"D-(7[1-9]|[89]\d|10[0-3])|S19-09", k)]
    tester = "--tester" in sys.argv
    for k in keys + EXT: print(one(k, tester))
