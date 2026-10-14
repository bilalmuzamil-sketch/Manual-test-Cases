"""Convert TestRail case HTML (or steps_separated) to plain lines. Shared by the follow-up scripts."""
import json, re, html, glob, os
def lines_of(h):
    if not h or h == "None": return []
    h = re.sub(r'<br\s*/?>', '\n', h)
    h = re.sub(r'</(li|p|h\d|tr|div)>', '\n', h)
    h = re.sub(r'<[^>]+>', '', h)
    return [html.unescape(x).strip() for x in h.split('\n') if html.unescape(x).strip()]
def load(d="snapshots-after-answers"):
    out = {}
    for f in glob.glob(os.path.join(d, "C*.json")):
        c = json.load(open(f)); cid = str(c["id"])
        ss = c.get("custom_steps_separated")
        if isinstance(ss, str):
            try: ss = json.loads(ss)
            except Exception: ss = None
        if ss:
            steps = [lines_of(x.get("content", "")) and " ".join(lines_of(x.get("content", ""))) or "" for x in ss]
            exp = [f"Step {i+1}: " + " ".join(lines_of(x.get("expected", ""))) for i, x in enumerate(ss)]
            plain = exp
        else:
            steps = lines_of(c.get("custom_steps"))
            exp = lines_of(c.get("custom_expected"))
            plain = []
            for l in exp:
                if l.startswith("Source") or l.startswith("Exact quotes"): break
                if l != "Expected results": plain.append(l)
        out[cid] = {"title": c["title"], "pre": lines_of(c.get("custom_preconds")), "steps": steps, "exp_all": exp,
                    "exp_plain": plain, "atm": c.get("custom_atmstatus"), "cb": c.get("created_by"), "ub": c.get("updated_by"),
                    "section": c.get("section_id"), "refs": c.get("refs"), "sep": bool(ss)}
    return out
