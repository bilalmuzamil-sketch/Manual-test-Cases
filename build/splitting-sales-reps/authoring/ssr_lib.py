"""Splitting Sales Representatives — case model, quote lookup, checks and TestRail rendering (19 Oct 2026).
Shape: Rule 117 ninth amendment (two-audience), WITHOUT the setup-file link (QA lead, 19 Oct 2026: "do not attach that claude file …
but keep it prepared"). Every expected result comes from a verbatim source sentence (Rules 57, 113); the build is not yet available."""
import os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PRD_TXT = open(f"{P}/sources/CONFLUENCE-919928833-v8-2026-10-19.txt").read()
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
PRDW = ws(PRD_TXT)
TPW = ws(open(f"{P}/sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md").read())
TP_NAME = "Tech plan \"Splitting Sales Representatives — Technical Implementation Plan\" (dated 14 Oct 2026, uploaded 19 Oct 2026)"
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m: CODE[m.group(1)] = m.group(2).strip()
def prd_line(start):
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^-\s*", "", line).strip()
        if t.startswith(start): return t
    raise KeyError(start)
STORY = {1: ("SV-11265", "Story 1, Give a work order its sales representative"),
         2: ("SV-11266", "Story 2, Give a work order a separate Labor and Parts representative"),
         3: ("SV-11267", "Story 3, Set the representatives on a phone"),
         4: ("SV-11268", "Story 4, Give a customer default representatives"),
         5: ("SV-11269", "Story 5, Credit each side on the invoice and in Sales By Representative"),
         6: ("SV-11270", "Story 6, Print both representatives on the work order"),
         7: ("SV-11271", "Story 7, Record representative changes in the work order log"),
         8: ("SV-11272", "Story 8, Filter both sales reports by Sales Type")}
PRD_NAME = 'PRD "Splitting Sales Representatives", Confluence 919928833, version 8 (14 Oct 2026, Chris Ward)'
NOBUILD = "The build is not yet available to check this case against."
MARKER = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
CASES = []

def C(key, sec, title, pre, steps, res, q, stories=None, extra_src="", note="", marker=None, known=""):
    """pre: list of str or (state, example). res: one 'Step N:' line per step. q: list of PRD codes or ('label', 'verbatim text')."""
    CASES.append(dict(key=key, sec=sec, title=title, pre=[p if isinstance(p, tuple) else (p, None) for p in pre] + [(BLOCKED, None)],
                      steps=steps, res=res, q=q, stories=stories, extra_src=extra_src, note=note, marker=marker or MARKER, known=known))

def quotes(c):
    out = []
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        else: out.append((x, CODE[x]))
    return out

def story_nums(c):
    if c["stories"]: return c["stories"]
    return sorted({int(re.match(r"S(\d+)-", x).group(1)) for x in c["q"] if isinstance(x, str)})

def source(c):
    st = story_nums(c)
    sto = "; ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in st)
    codes = [x for x in c["q"] if isinstance(x, str)]
    other = [x[0] for x in c["q"] if isinstance(x, tuple)]
    refs = ", ".join(codes + other)
    s = f"Epic SV-10890; {sto}; {PRD_NAME}, {refs}, read 19 Oct 2026."
    if any(l.startswith("Tech plan") for l in other): s += f" {TP_NAME}, " + ", ".join(l for l in other if l.startswith("Tech plan")) + ", read 19 Oct 2026."
    if c["extra_src"]: s += " " + c["extra_src"]
    return s + " Source-verified 19 October 2026. " + NOBUILD

e = lambda s: html.escape(s, quote=False)
def render(c):
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
           + (f"<p>{e(c['known'])}</p>" if c["known"] else "")
           + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source(c))}</p>"
           + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
           + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in quotes(c)) + "</ul>"
           + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY[n][0] for n in story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

PH = re.compile(r"\{([A-Z][^{}]*)\}")
def check(c, extra_sources=None):
    p, k = [], c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: p.append(f"{k}: title {len(c['title'])}")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    for i, r in enumerate(c["res"], 1):
        if not r.startswith(f"Step {i}: "): p.append(f"{k}: result {i} does not start 'Step {i}: '")
    defined = set(PH.findall(" ".join(a for a, _ in c["pre"])))
    for x in set(PH.findall(" ".join(c["steps"] + c["res"] + [c["known"]]))):
        if x not in defined: p.append(f"{k}: {{{x}}} not defined in preconditions")
    for a, b in c["pre"]:
        if b and not b.startswith("For example:"): p.append(f"{k}: example line must start 'For example:'")
    tester = " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"])
    if "ZZAUTOTEST" in tester: p.append(f"{k}: hard-coded record in tester text")
    if re.search(r"\bS\d+-[RNE]\d+", tester): p.append(f"{k}: requirement code in tester text")
    for l, t in quotes(c):
        src = TPW if l.startswith("Tech plan") else (PRDW if not (extra_sources and l in extra_sources) else ws(extra_sources[l]))
        if ws(t) not in src: p.append(f"{k}: quote {l} not verbatim")
    if len(c["pre"]) > 7: p.append(f"{k}: {len(c['pre'])} preconditions")
    if len(c["steps"]) > 10: p.append(f"{k}: {len(c['steps'])} steps (over 10: ask before splitting, Rule 127)")
    return p
