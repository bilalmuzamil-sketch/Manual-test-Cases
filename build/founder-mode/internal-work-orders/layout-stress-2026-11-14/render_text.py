"""Plain-text view of the new layout-stress cases (14 Nov 2026), from ../authoring/proposals.json.   python3 render_text.py [--short]
--short leaves out the quote bodies (each is a whole PRD requirement line, checked word for word by build.py)."""
import json, re, sys, html, os
H = os.path.dirname(os.path.abspath(__file__)); A = f"{H}/../authoring"
P = json.load(open(f"{A}/proposals.json"))
STRESS_NEW = dict(re.findall(r'^[DP]\("([A-Z0-9-]+)", "(I-[PS]\d+[a-c]?)"', open(f"{A}/cases_zzzz_stress.py").read(), re.M))
def txt(h):
    h = h.replace("</p>", "\n").replace("<li>", " - ").replace("</li>", "\n").replace("<ul>", "\n").replace("</ul>", "")
    return html.unescape(re.sub(r"<[^>]+>", "", h)).replace("\n\n\n", "\n\n").strip()
def case(k, short=False):
    v = P[k]; f = v["fields"]
    exp = f["custom_expected"]
    if short:
        exp = re.sub(r"&ldquo;.*?&rdquo;", "&ldquo;…&rdquo;", exp)
    steps = [html.unescape(re.sub(r"<[^>]+>", "", s)) for s in re.findall(r"<li>(.*?)</li>", f["custom_steps"])]
    out = [f"### {k} · {v['title']}", "", f"Scan proposal {STRESS_NEW[k]} · folder {v['section_name']} ({v['section_id']}) · refs {v['refs']} · held: {'yes' if v['held'] else 'no'}", "",
           "**Preconditions**", "", txt(f["custom_preconds"]).replace("Preconditions\n", "").strip(), "", "**Steps**", ""]
    out += [f"{i}. {s}" for i, s in enumerate(steps, 1)] + ["", "**Expected Result**", "", txt(exp).replace("Expected Result\n", "").strip(), ""]
    return "\n".join(out)
if __name__ == "__main__":
    short = "--short" in sys.argv
    print("\n".join(case(k, short) for k in STRESS_NEW))
