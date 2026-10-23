"""Every quoted string in PRD v3 with the requirement code (or §8 row / section) it sits in. Used by make_inventory.py."""
import re
PRD = "/home/user/Manual-test-Cases/build/credit-terms/sources/CONFLUENCE-963346440-v3-2026-10-23.md"
def load():
    lines = open(PRD, encoding="utf-8").read().replace("\\$", "$").splitlines()
    out = []; code = "§1"; sec = "§1"
    for i, l in enumerate(lines, 1):
        m = re.match(r"^## (\d+)\.", l)
        if m: sec = "§" + m.group(1); code = sec
        m = re.search(r"\*\*(S\d+-[RNE]\d+[a-z]?):\*\*", l)
        if m: code = m.group(1)
        if l.startswith("### Story"): code = sec + " " + l[4:40]
        if "Error Handling" in l and l.startswith("**Error"): code = code.split("-")[0] + " Error Handling" if code.startswith("S") else code
        if l.startswith("| ") and sec == "§8":
            cells = [c.strip() for c in l.strip("|").split("|")]
            rowcode = "§8 row \"" + cells[0] + "\""
        else:
            rowcode = None
        if l.startswith("| ") and sec == "§7":  # S2-R1 / S12-R3 tables
            rowcode = code + " table row \"" + l.strip("|").split("|")[0].strip()[:40] + "\""
        for q in re.findall(r'"([^"]+)"', l):
            out.append(dict(q=q, code=rowcode or code, line=i))
    return out, lines
def template_re(q):
    parts = re.split(r"(\{[^}]+\})", q)
    rx = "".join(".+?" if p.startswith("{") else re.escape(p) for p in parts)
    return re.compile("^" + rx + "$")
if __name__ == "__main__":
    qs, _ = load(); print(len(qs))
    for x in qs[:20]: print(x)
