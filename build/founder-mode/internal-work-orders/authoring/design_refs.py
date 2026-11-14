"""References from Design (Rule 117 tenth amendment), round 2b (12 Nov 2026).
Design: "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794484794-2031, read and rendered
12 Nov 2026 by the design worker (design-2026-11-12/, owner of ../DESIGN-DIVERGENCE-REGISTER.json).
- Design cases D-01..: design_refs_design.json, written by make_cases_design.py from the design worker's drafts.
- PRD cases: a case gets a block only when its PRIMARY PRD code (the first requirement code or User Feedback row it quotes: the screen
  the case is about) is SHOWN or DIFFERENT on a board in the spec-to-design table (design-2026-11-12/SPEC-TO-DESIGN-2026-11-12.json); a
  later code never brings in boards of another screen. The boards for that code are (1) the boards of the design cases that quote that code and
  (2) the boards the table's "design" text names (these first) ("Flow 0 08", "Flow 1 2b/2b2", "(Flow 4 05, 06)"). Pictures come from
  DESIGN-FIGURES-2026-11-12.json (images/, at most 4 per case). The design's own words are taken from those design cases, on those boards,
  where each was checked word for word by the design worker and is checked again by build.py. A DIFFERENT code adds the difference with its
  register id and how it is closed (the PRD sentence that settles it, or the PO question number), so a later ruling finds every affected
  case by search. A case whose screen no board draws, and every API case, gets no heading at all. API cases test no screen."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); DD = f"{P}/design-2026-11-12"
CANVAS = ('Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026)')
_DJ = f"{D}/design_refs_design.json"
DREFS = json.load(open(_DJ)) if os.path.exists(_DJ) else {}
FIGS = json.load(open(f"{DD}/DESIGN-FIGURES-2026-11-12.json"))["list"]
import design_v3; design_v3.apply(FIGS)   # round 4: the 15 redrawn boards take their v3 title and picture
BYFILE = {f["file"].replace(".dc.html", ""): f for f in FIGS}
BYLABEL = {(f["page"], f["board_title"].split()[0]): f["file"].replace(".dc.html", "") for f in FIGS}
for (_pg, _lb), _f in list(BYLABEL.items()):      # "02b" is also written "2b" in the spec-to-design table
    if _lb[:1] == "0" and len(_lb) > 2: BYLABEL.setdefault((_pg, _lb[1:]), _f)
S2D = {r["code"]: r for r in json.load(open(f"{DD}/SPEC-TO-DESIGN-2026-11-12.json"))["table"]}
REG = {d["id"]: d for d in json.load(open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json"))["differences"]}
# open register rows -> merged question slug (po_questions.py); IWO-D50 is a named ruling (po_questions.DROPPED)
OPEN = {}   # round 3 (12 Nov 2026): every design question answered by Milos Vasic and carried in PRD v1.1; the register rows are closed
RULING_D50 = ("IWO-D50 (two reviewer remarks left in a board's file, not visible on the canvas) is closed by a named ruling: PRD Final v1.0 is "
              "newer and its header says \"Where a frame and this text disagree, the text wins\"; no verdict depends on the remarks.")


def _scode(k):
    if not re.match(r"UFS-\d\d$", k): return k
    n = int(k[4:])   # the spec-to-design table uses PRD v1.0's row numbers; v1.3 rows 16-18 and 27 are new (no table row)
    if n <= 15: return "§8-%02d" % n
    if n <= 18 or n == 27: return "§8-v1.3-%02d" % n
    return "§8-%02d" % (n - 2 if n <= 26 else n - 3)


def boards_named(text):
    """Board files a spec-to-design 'design' text names: after "Flow N" (or "Happy"), every label of that page that follows
    ("Flow 0 08", "Flow 1 2b/2b2", "(Flow 0 04) and header (05, 07, 08)", "Flow 2 07 (...), 7b portal estimate")."""
    out, page = [], None
    for m in re.finditer(r"Flow (\d)|Happy(?: flow)?|\b(\d{2}[a-z]?\d?|\d[a-z]\d?)\b", text):
        if m.group(1): page = "flow" + m.group(1); continue
        if m.group(0).startswith("Happy"): page = "happy"; continue
        f = BYLABEL.get((page, m.group(2))) if page else None
        if f and f not in out: out.append(f)
    return out


PLAIN = {"TERM": "Terminology", "KD": "Key Decisions", "OOS": "Out of Scope", "OV": "Feature Overview"}


def _notes(r, notes, QN):
    """One note per register difference on this code: how it is closed (a PRD sentence, a PO question, or the named ruling)."""
    for rid in re.findall(r"IWO-D\d\d", r.get("register") or ""):
        d = REG.get(rid)
        if not d: continue
        src = " / ".join(PLAIN.get(x.strip(), x.strip()) for x in (d.get("prd_code_v1.1") or d.get("prd_code") or "").split("/"))
        if rid in OPEN: how = f"asked in question {QN[OPEN[rid]]} of the PO sheet; this case follows the PRD meanwhile"
        elif rid == "IWO-D50": how = RULING_D50
        elif d["outcome"].startswith("CLOSED") and "outcome_before_v1.3" in d: how = f"closed: the redrawn design (version 1794510020-d4ec) matches PRD v1.3 ({src})"
        elif d["outcome"].startswith("CLOSED"): how = f"closed: the design matches PRD v1.1 ({src})"
        elif "outcome_before_v1.3" in d: how = f"narrowed for PRD v1.3 and settled by the PRD ({src}); this case follows the PRD"
        elif "outcome_before_v1.1" in d: how = f"settled by PRD v1.1 ({src}), which carries Milos Vasic's answer; this case follows the PRD"
        else: how = f"settled by the PRD ({src}); this case follows the PRD"
        n = f"Difference {rid} on {r['code']} ({d['kind']}): {how}."
        if n not in notes: notes.append(n)


_BYCODE = None
SECONDARY = set()   # (design case, code) pairs quoted only as backing: they never bring that case's boards to a PRD case (round 4)
def _design_cases_by_code():
    global _BYCODE
    if _BYCODE is None:
        import iwo_lib as L
        _BYCODE = {}
        for c in L.CASES:
            if c["sec"] != "DESIGN" or c["key"] not in DREFS: continue
            for x in c["q"]:
                k = x if isinstance(x, str) else x[0]
                if (c["key"], k) in SECONDARY: continue
                _BYCODE.setdefault(_scode(k), []).append(c["key"])
    return _BYCODE


def for_codes(codes, max_pics=4):
    from po_questions import QN
    bycode = _design_cases_by_code()
    boards, words, notes = [], [], []
    prim = next((k for k in codes if re.match(r"(S\d+-[RNE]\d+[a-z]?|UFS-\d\d)$", k)), None)
    r0 = S2D.get(_scode(prim)) if prim else None
    if not r0 or r0["verdict"] not in ("SHOWN", "DIFFERENT"): return None
    for code in codes:
        r = S2D.get(_scode(code))
        if not r or r["verdict"] not in ("SHOWN", "DIFFERENT"): continue
        if code != prim:
            _notes(r, notes, QN); continue
        cand = boards_named(r.get("design") or "")
        for dk in bycode.get(_scode(code), []):
            for b in DREFS[dk]["boards"]:
                if b not in cand: cand.append(b)
        for b in cand:
            if b not in boards and len(boards) < max_pics: boards.append(b)
        for dk in bycode.get(_scode(code), []):
            if set(DREFS[dk]["boards"]) & set(boards):
                for w in DREFS[dk]["words"]:
                    if w not in words and len(words) < 3: words.append(w)
        _notes(r, notes, QN)
    if not boards: return None
    figs = [BYFILE[b] for b in boards]
    head = (CANVAS + ": board" + ("s " if len(figs) > 1 else " ") + ", ".join(f'"{f["board_title"]}" (page "{f["page_name"]}")' for f in figs)
            + ". Compare the screen with the pictures; the expected results come from the PRD.")
    return {"pages": head, "pictures": [f["picture"].split("/")[-1] for f in figs], "words": words, "notes": notes, "boards": boards}


def for_case(c):
    if c["key"] in DREFS: return DREFS[c["key"]]
    if c["api"] or c["sec"] == "API": return None
    codes = []
    for x in c["q"]:
        if isinstance(x, str) and not x.startswith("TP-"): codes.append(x)
        elif isinstance(x, tuple) and re.match(r"S\d+-[RNE]\d+", x[0]): codes.append(x[0])
    return for_codes(codes)


# ---- 14 Nov 2026: design version 1794565397-7f4c for the v1.4 named set (PER CASE, never global) -----------------------------------
# po-answers-2026-11-12/V1.4-IMPACT.md section 3: of 172 files, 2 changed (WO-Detail-Artboard-v6.dc.html: NC_LINE_TEXT 'No Charge ·
# Warranty' became 'No Charge'; canvas.json: three notes). The render of all 167 boards shows 6 changed boards, all the same edit (the chip
# text); 161 are pixel-identical. New pictures: design-2026-11-12/images/*-v14.png. A case carrying c["design"] == "v14" (cases_zzzzz_v14.py)
# gets: the canvas line below, the -v14 picture of each changed board, and the board's v1.4 words ("No Charge"). Every other case keeps
# CANVAS and its pictures exactly as before.
CANVAS14 = ('Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794565397-7f4c '
            '(read and rendered 14 Nov 2026: from version 1794561577-f903 one string changed, the chip of a no-charge line now reads "No Charge" '
            'on 6 boards; the other 161 boards are pixel-identical)')
V14_BOARDS = {"flow6-3", "flow6-4", "hf-32", "hf-33", "rv-6-3", "rv-6-4"}
V14_PIC = {"iwo-flow6-03-03-line-marked-no-charge-0-00.png": "iwo-flow6-03-03-line-marked-no-charge-0-00-v14.png",
           "iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png": "iwo-flow6-04-04-line-menu-change-category-mark-as-billable-v14.png",
           "iwo-happy-32-32-line-marked-no-charge-0-00.png": "iwo-happy-32-32-line-marked-no-charge-0-00-v14.png",
           "iwo-happy-33-33-line-menu-change-category-mark-as-billable.png": "iwo-happy-33-33-line-menu-change-category-mark-as-billable-v14.png",
           "iwo-review-25-6-3-32-line-marked-no-charge-0-00.png": "iwo-review-25-6-3-32-line-marked-no-charge-0-00-v14.png",
           "iwo-review-26-6-4-33-line-menu-change-category-mark-as-billable.png": "iwo-review-26-6-4-33-line-menu-change-category-mark-as-billable-v14.png"}
V14_WORDS = {"No Charge · Warranty": "No Charge"}     # the only text the 6 boards changed (v5-text-diff.json: removed / added)
V5 = f"{DD}/v5-1794565397-7f4c"


def v14(d):
    """A copy of a References from Design block for design version 1794565397-7f4c."""
    if CANVAS not in d.get("pages", ""): raise SystemExit("design_refs.v14: a pages line without the canvas line: " + d.get("pages", "")[:80])
    out = dict(d)
    out["pages"] = d["pages"].replace(CANVAS, CANVAS14)
    out["pictures"] = [V14_PIC.get(x, x) for x in d.get("pictures") or []]
    out["words"] = list(dict.fromkeys(V14_WORDS.get(w, w) for w in d.get("words") or []))
    out["notes"] = list(d.get("notes") or []); out["boards"] = list(d.get("boards") or [])
    return out


def hay14(b):
    """v5 rendered text and file of a changed board (for the design-words gate of a v14 case)."""
    t = json.load(open(f"{V5}/render/v5-text-diff.json"))["boards"][b + ".dc.html"]
    return " ".join(t["v3"].get("text", [])) + " " + open(f"{V5}/files/project/{b}.dc.html", encoding="utf-8").read()
