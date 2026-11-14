"""Tiered Pricing — case model, source check, refs, pictures and TestRail rendering (phase 1, 14 Nov 2026).

Pattern: build/founder-mode/internal-work-orders/authoring/iwo_lib.py (case model, one-action steps, Rule 137 gates), changed for the
QA lead's answer to the Rule 117 sixteenth amendment for this suite (14 Nov 2026: NO): the Expected Result ends, a blank line follows, then
ONLY the AUTOMATION line. No "Exact quotes", no "From:" lines, no "References from Design" in the case text. Instead:
  * every plain result bullet carries the source sentence(s) it rests on (kept here, never printed), and check() proves each one is word
    for word in the saved source (PRD v37, reports PRD v21, the two tech plans, the saved Jira copies, the design's own board texts);
  * every case carries its design pictures (attached by the write script; board ids resolved by design_refs.py);
  * the References field (refs) holds the ticket(s) and the PRD story / requirement numbers, e.g. "SV-11694 (Story 2 S2-R3 S2-R15)".
Precedence (QA lead, 14 Nov 2026): PRD > PO answers > design (for the look where the PRD is silent) > tech plan (informs). Never the build.

Authors add cases in cases_<name>.py files only (see AUTHORING-GUIDE.md); this file is the shared engine."""
import os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
TODAY = "11/14/2026"
MARKER = f"AUTOMATION: Not available on Build to test Yet - Last checked {TODAY}"


def HOLD(reason): return "AUTOMATION: HOLD - " + reason


def ws(s):
    s = html.unescape(s or "").replace("**", "").replace("\\", "").replace("`", "")
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


def _plain(md):
    t = re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", md)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    t = re.sub(r"(?m)^\s*#+\s*", "", t)
    t = re.sub(r"(?m)^\s*[-*]\s+", "", t)
    t = re.sub(r"(?<![\w*])\*(\S[^*]*?)\*(?![\w*])", r"\1", t)
    t = t.replace("|", " ")
    return ws(t)


SRC = f"{P}/sources"
DOCS = {
    "PRD": ("Tiered Pricing PRD, Confluence 938213378 page v37", f"{SRC}/CONFLUENCE-938213378-v37-read-2026-11-14.md"),
    "RPT": ("Sales by Tier and Sales by Category PRD, Confluence 968687617 page v21", f"{SRC}/CONFLUENCE-968687617-v21-read-2026-11-14.md"),
    "TP1": ("Tiered Pricing tech plan (2026-11-11, rev 9)", f"{SRC}/TECH-PLAN-Tiered-Pricing-upload-2026-11-14.md"),
    "TP2": ("Sales by Tier and Sales by Category tech plan (2026-11-11, rev 8)", f"{SRC}/TECH-PLAN-Sales-by-Tier-and-Sales-by-Category-upload-2026-11-14.md"),
}
_TXT = {}
def doc_text(k):
    if k not in _TXT:
        if k == "JIRA":
            import glob
            _TXT[k] = " ".join(_plain(open(f).read()) for f in sorted(glob.glob(f"{SRC}/jira/*.md") + glob.glob(f"{SRC}/jira/linked/*.md")))
        else:
            raw = open(DOCS[k][1]).read()
            if k == "PRD": raw = raw.split("## 9. Change Log")[0]      # the Change Log states no requirement
            _TXT[k] = _plain(raw)
    return _TXT[k]


REQ = json.load(open(f"{P}/requirements.json"))
ROWS = {r["id"]: r for r in REQ["prd_rows"]}
TPX = {r["id"]: r for r in REQ["tech_plan_rows"]}
for _r in ROWS.values(): _r["_ws"] = ws(_r["text"].replace("\n", " "))


def row_id(x):
    """'S2-R3' -> 'TP-S2-R3'; 'RPT-S1-R3', 'TP-PERM-1', 'TP-S2-EH1' kept."""
    if x in ROWS: return x
    if "TP-" + x in ROWS: return "TP-" + x
    raise KeyError(f"unknown requirement row {x!r}")


# ---- source items -------------------------------------------------------------------------------------------------------------
class Src:
    __slots__ = ("kind", "row", "text", "where")
    def __init__(self, kind, row=None, text=None, where=None): self.kind, self.row, self.text, self.where = kind, row, text, where
    def __repr__(self): return f"Src({self.kind},{self.row},{(self.text or '')[:30]!r},{self.where})"


def S(row, text=None):
    """A PRD requirement row (whole row, or one verbatim sentence or phrase of it): S("S2-R3"), S("S2-R3", "The field stops accepting characters at 50.")."""
    return Src("row", row_id(row), text)


def QP(text, row):
    """Verbatim PRD text outside a requirement row (User Feedback Summary, Terminology, Key Decisions), tied to the requirement row it serves."""
    return Src("prd", row_id(row), text)


def QT(text, tpx, doc="TP1"):
    """Verbatim tech-plan text, tied to its tech-plan row (TPX-nn). Informs; never overrules the PRD."""
    return Src("plan", tpx, text, doc)


def QD(text, board, row):
    """Verbatim design text on a named board ("2.24"), for the look where the PRD is silent, tied to the PRD row of the screen."""
    return Src("design", row_id(row), text, board)


def QL(board, row, what=""):
    """A visual attribute the design draws with no words of its own (colour, icon, order, position), sourced to the named board picture
    (Rule 126 point 5: where the PRD is silent the design is the source of the look). The tester compares with that picture at 100% zoom."""
    return Src("look", row_id(row), what or None, board)


def QI(text, inv, doc="TP1"):
    """Verbatim text of a saved source (doc: "TP1"/"TP2" tech plan, "PRD", "RPT" or "JIRA") stating today's behaviour for an invariant row
    of INVARIANTS.md that the PRD is silent on (Rule 96: silence defaults to "must not change"). Checked word for word in that source;
    the INV row must exist. It ties to no PRD row, so the case still needs a PRD-sourced bullet (consolidation, 14 Nov 2026; LIB request 3)."""
    return Src("inv", inv, text, doc)


def QJ(text, ticket, row):
    """Verbatim text of a saved Jira copy (sources/jira/...), tied to a PRD row."""
    return Src("jira", row_id(row), text, ticket)


def _norm_src(x):
    if isinstance(x, Src): return x
    if isinstance(x, str): return S(x)
    raise TypeError(f"source must be Src or a row id, got {x!r}")


class B:
    """One plain result bullet with the source(s) it rests on."""
    __slots__ = ("t", "src")
    def __init__(self, t, *src):
        self.t = t; self.src = [_norm_src(s) for s in src]


def R(src, *texts):
    """Bullets that all rest on the same source(s). src: one source or a list. Returns a list; join several with +."""
    src = src if isinstance(src, (list, tuple)) else [src]
    return [B(t, *src) for t in texts]


# ---- cases ------------------------------------------------------------------------------------------------------------------------
CASES = []
SECS = json.load(open(f"{D}/sections.json"))["sections"]


def C(key, sec, title, pre, steps, res, pics=None, nopic=None, marker=None, held_on=None, note="", flags=(), stories=None, extra_refs=()):
    """key: unique (S2-07, D-12 ...). sec: a sections.json key. pre: precondition bullets. steps: one action each. res: one list of B per step.
    pics: design board ids ("2.24", "today:2.1"). nopic: reason when no board draws the screen. marker: AUTOMATION line (default MARKER).
    held_on: PO question id ("Q2") — the case is held and goes to the waiting folder (non-design) or stays in Design (design version).
    flags: "stress", "movement", "numbers", "design-version". stories: override the story list for refs. extra_refs: extra tickets."""
    import expand as _X, perms as _PM, design_refs as _DR
    first_row = next((x.row for r_ in res for b_ in r_ for x in b_.src if x.kind in ("row", "prd")), None)
    pre, steps, res, pics, n_exp = _X.expand(list(pre), list(steps), [list(r_) for r_ in res], list(pics or []), first_row, B, QD)
    adm = [x for x in pre if _PM.ADMIN_RX.match(x)]
    orig_admin = adm[0] if adm else None
    if adm:
        rest = [x for x in pre if x not in adm]
        need = _PM.needed(rest, steps, [b_.t for r_ in res for b_ in r_])
        new_line = _PM.line(need)
        pre = [new_line if x == adm[0] else x for x in pre if not (x in adm[1:])]
        if "View and Manage AP/AR Data" in need: pre = [x for x in pre if x != "Sign in with 'View and Manage AP/AR Data' too."]
    pics = list(pics or [])
    for p_ in list(pics):
        if p_ in _DR.FULL and f"full:{p_}" not in pics: pics.insert(pics.index(p_) + 1, f"full:{p_}")
    if held_on and not marker:
        marker = HOLD(f"waiting on the PO ({held_on})") if sec != "DESIGN" else HOLD("the design differs from the PRD, waiting on the PO")
    CASES.append(dict(key=key, sec=sec, title=title, pre=list(pre), steps=list(steps), res=[list(r) for r in res], pics=list(pics or []),
                      nopic=nopic, marker=marker or MARKER, held_on=held_on, note=note, flags=set(flags), stories=stories,
                      extra_refs=list(extra_refs), held=bool(held_on) or (marker or MARKER).startswith("AUTOMATION: HOLD"),
                      expanded=n_exp, orig_admin=orig_admin))


def bullets(c): return [b for r in c["res"] for b in r]


def rows_of(c):
    out = []
    for b in bullets(c):
        for s in b.src:
            if s.kind in ("row", "prd", "design", "jira", "look") and s.row not in out: out.append(s.row)
    return out


def tpx_of(c): return sorted({s.row for b in bullets(c) for s in b.src if s.kind == "plan"})


def story_of_row(rid):
    r = ROWS[rid]
    return ("RPT" if rid.startswith("RPT-") else "TP"), r["story"], r.get("ticket")


def refs_of(c):
    """ "SV-11694 (Story 2 S2-R3 S2-R15)" per ticket; reports rows "SV-11718 (Reports Story 1 S1-R3)"; tech-plan rows add their TPX id. """
    groups = {}
    for rid in rows_of(c):
        doc, st, tk = story_of_row(rid)
        r = ROWS[rid]; code = rid.replace("TP-", "") if "-PERM-" in rid else (r.get("prd_id") or rid.replace("TP-", ""))
        label = ("Reports Story " if doc == "RPT" else "Story ") + str(st)
        groups.setdefault(tk, {}).setdefault(label, [])
        if code not in groups[tk][label]: groups[tk][label].append(code)
    for t in tpx_of(c):
        rel = [x.strip() for x in TPX[t]["related_prd"].split(",") if x.strip() in ROWS]
        tk = ROWS[rel[0]]["ticket"] if rel else "SV-11692"
        groups.setdefault(tk, {}).setdefault("tech plan", []).append(t)
    for inv in sorted({s.row for b in bullets(c) for s in b.src if s.kind == "inv"}):
        groups.setdefault("SV-11692", {}).setdefault("tech plan", []).append(inv)
    parts = []
    for tk, labs in groups.items():
        inner = " ".join(f"{lab} " + " ".join(codes) if lab != "tech plan" else " ".join(codes) for lab, codes in labs.items())
        parts.append(f"{tk} ({inner})")
    for t in c["extra_refs"]:
        if t not in groups: parts.append(t)
    return ", ".join(parts)


e = lambda s: html.escape(s, quote=False)


def render(c):
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(b.t)}</li>" for b in r) + "</ul>" for i, r in enumerate(c["res"], 1))
           + "<p></p>" + (f"<p>{e(c['note'])}</p>" if c["note"] else "") + f"<p>{e(c['marker'])}</p>")
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs_of(c), "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre,
            "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}


# ---- the source check (word for word) ------------------------------------------------------------------------------------------
def check_src(s):
    """None when the quoted text is word for word in its saved source; else the problem."""
    if s.kind == "row":
        if s.text is None: return None
        if ws(s.text) not in ROWS[s.row]["_ws"]: return f"not word for word in requirement {s.row}: {s.text[:70]!r}"
        return None
    if s.kind == "prd":
        doc = "RPT" if s.row.startswith("RPT-") else "PRD"
        return None if ws(s.text) in doc_text(doc) else f"not word for word in the {doc}: {s.text[:70]!r}"
    if s.kind == "plan":
        if s.row not in TPX: return f"unknown tech-plan row {s.row}"
        return None if ws(s.text) in doc_text(s.where) else f"not word for word in {s.where}: {s.text[:70]!r}"
    if s.kind == "inv":
        if not re.search(rf"^\| {re.escape(s.row)} \|", open(f"{P}/INVARIANTS.md").read(), re.M): return f"unknown invariant row {s.row}"
        return None if ws(s.text) in doc_text(s.where) else f"not word for word in {s.where}: {s.text[:70]!r}"
    if s.kind == "jira":
        return None if ws(s.text) in doc_text("JIRA") else f"not word for word in the saved Jira copies: {s.text[:70]!r}"
    if s.kind == "design":
        from design_refs import board_text
        try: hay = board_text(s.where)
        except KeyError as x: return str(x)
        return None if ws(s.text) in hay else f"design words not on board {s.where}: {s.text[:70]!r}"
    if s.kind == "look":
        from design_refs import BOARD
        return None if s.where in BOARD else f"look source names unknown board {s.where}"
    return f"unknown source kind {s.kind}"
