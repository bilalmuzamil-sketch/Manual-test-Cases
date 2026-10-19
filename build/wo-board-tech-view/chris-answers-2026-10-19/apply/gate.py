"""Independent gate on the v68 proposals: quotes verbatim in v68, no old words outside quotes, one AUTOMATION line, last (or above an author note),
unchanged; Step N references exist; title <= 80; only allowed fields; HTML tags balanced."""
import json, re, html, sys, glob
from html.parser import HTMLParser
V = "../../prd-v68-2026-10-19/"
PRD = open(V + "CONFLUENCE-845185030-v68-2026-10-19.md").read()
PRDn = re.sub(r"\s+", " ", PRD.replace("**", ""))
cases = {c["id"]: c for c in json.load(open(V + "wo-cases-2026-10-19-evening.json"))}
OLD = ["Lead technician updated", "Lead technician removed", "8 seconds", "can’t be changed once a work order is Invoiced or Paid", "no new toast", "Reassign dialog"]
ALLOWED = {"title", "custom_preconds", "custom_steps", "custom_expected", "why", "questions", "no_change"}
def txt(h): return html.unescape(re.sub(r"<[^>]+>", " ", h or ""))
class Bal(HTMLParser):
    def __init__(s): super().__init__(); s.st = []; s.bad = 0
    def handle_starttag(s, t, a):
        if t not in ("br", "hr", "img"): s.st.append(t)
    def handle_startendtag(s, t, a): pass
    def handle_endtag(s, t):
        if t in ("br", "hr", "img"): return
        if s.st and s.st[-1] == t: s.st.pop()
        else: s.bad += 1
out = {}
for f in sorted(glob.glob("proposals-*.json")):
    P = json.load(open(f))
    for k, v in P.items():
        i = int(k.lstrip("C")); c = cases[i]; probs = []
        if v.get("no_change"): out[k] = (f, "no change", []); continue
        if set(v) - ALLOWED: probs.append(f"fields {set(v)-ALLOWED}")
        new = {x: v.get(x, c[x]) for x in ("title", "custom_preconds", "custom_steps", "custom_expected")}
        if len(new["title"]) > 80: probs.append("title > 80")
        e = new["custom_expected"]; et = txt(e)
        # quotes after a requirement code
        for code, q in re.findall(r"(S\d+-[RNE]\d+[a-z]?)\s*:?\s*[“\"]((?:[^”]|”(?!\s*(?:</|$)))+?)”(?=\s*(?:<|$|\n| S\d|\.|\)|,|;))", e.replace("&ldquo;", "“").replace("&rdquo;", "”")):
            qq = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", q))).replace("**", "").strip()
            parts = [p.strip(" .") for p in re.split(r"\s*(?:…|\.\.\.)\s*", qq) if len(p.strip()) > 12]
            for p in parts:
                if p not in PRDn and p.replace("'", "’") not in PRDn: probs.append(f"quote not in v68: {code} {p[:70]}")
        # old words outside quotes
        # a dated record of an earlier build's symptom ("What you should see today (build ...)") is not an expected result
        e_nodated = re.sub(r"<p>(?:(?!</p>).)*What you should see today(?:</strong>)? \(build(?:(?!</p>).)*</p>", "", e, flags=re.S)
        e_nodated = re.sub(r"<p>(?:(?!</p>).)*Known problem(?:(?!</p>).)*</p>", "", e_nodated, flags=re.S)  # the build's current symptom (Rule 61)
        for row in re.findall(r"(\| 2026-10-\d\d \| Chris Ward \|[^\n]*)", PRD):  # verbatim change-log rows may hold old words
            cell = row.split(" | ")[2] if row.count(" | ") >= 2 else ""
            if cell and cell[:60] in html.unescape(e_nodated): e_nodated = html.unescape(e_nodated).replace(cell, "")
        unq = re.sub(r"“[^”]*”", "", txt(e_nodated))
        for w in OLD:
            if w.lower() in unq.lower(): probs.append(f"old words outside a quote: {w}")
        am = re.findall(r"AUTOMATION: [A-Z]+[^\n<]*", e); om = re.findall(r"AUTOMATION: [A-Z]+[^\n<]*", c["custom_expected"] or "")
        if len(am) != 1 or am != om: probs.append(f"AUTOMATION line {am} vs {om}")
        nsteps = len(re.findall(r"<li", new["custom_steps"] or ""))
        refs = [int(n) for n in re.findall(r"Steps? (\d+)", et)]
        if refs and max(refs) > nsteps: probs.append(f"Step {max(refs)} > {nsteps} steps")
        for x in ("custom_preconds", "custom_steps", "custom_expected"):
            b = Bal(); b.feed(new[x] or "")
            if b.bad or b.st: probs.append(f"{x} unbalanced HTML")
        out[k] = (f, "change", probs)
bad = {k: v for k, v in out.items() if v[2]}
print(len(out), "cases;", sum(1 for v in out.values() if v[1] == "no change"), "no change;", len(bad), "with problems")
for k, (f, _, p) in bad.items(): print(k, f, p[:4])
sys.exit(1 if bad else 0)
