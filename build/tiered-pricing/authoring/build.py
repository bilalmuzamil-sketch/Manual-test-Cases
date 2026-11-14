#!/usr/bin/env python3
"""Build and check every Tiered Pricing case.   python3 build.py   (exit 1 on any PROBLEM line)

Loads every authoring/cases_*.py (so parallel authors add files without touching this one), then gates:
 format    title <= 80, no ';', "Design: " exactly on design cases; steps = results; one UI action per step (Rule 135); preconditions are
           plain bullets (no {placeholder}, "For example:" line, Scenario, Blocked line, who-to-ask, setup file); the rendered Expected Result
           is "Step N:" + bullets, a blank line, then ONLY the AUTOMATION line (no quotes, no From:, no References from Design: answer NO);
 sources   every plain result bullet has >= 1 source, every quote word for word in its saved source (tp_lib.check_src); every case cites a
           PRD requirement row; a design quote only on a row whose story has a design page; a tech-plan quote only with its TPX row;
 coverage  every requirement row of requirements.json has a verdict: cited by a case, NOT_TESTABLE with reason, HELD on a named question,
           or PENDING (a story outside the phase's scope, listed in the summary, never inside it); every tech-plan row of an in-scope story
           likewise; every in-scope design board is attached to at least one case or listed in UNUSED_BOARDS with a reason;
 refs      present, ticket + story/requirement, < 250 chars, no comma inside an anchor;
 lists     a closed list ("only", "exactly", "no other", "nothing else") rests on a source that itself closes the list;
 negatives every "does not / never / no ..." bullet has a positive bullet (a visible control) in the same step result;
 checklist §6d line 9 stress cases and line 10 movement cases registered per in-scope surface; Rule 116 number cases show arithmetic;
 held      a held-on-question case names a question on po_questions.py; non-design held cases go to the waiting folder; every candidate
           question holds a case; the divergence register's in-scope rows are closed (precedence/source) or held with a case that exists;
 pictures  every named picture exists; a case has pictures or a nopic reason; design cases have pictures.
Writes proposals.json (one entry per case, IWO shape plus pictures, held_on, sources)."""
import sys, os, json, re, glob, importlib
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import tp_lib as L
import design_refs as DR
from po_questions import QUESTIONS, ANSWERED, CANDIDATE
from verdicts import NOT_TESTABLE, HELD, IN_SCOPE_STORIES, UNUSED_BOARDS, STRESS, MOVEMENT, NUMBERS, PARTIAL

MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in MODS: importlib.import_module(m)
probs = []
P = probs.append

# ---- one-action check (Rule 135) -------------------------------------------------------------------------------------------------
VERBS = (r"(click|open|select|choose|type|enter|press|tick|untick|check|uncheck|hover|point|save|close|clear|switch|sign|reload|refresh|pick|set|"
         r"change|delete|create|move|go|scroll|drag|upload|send|wait|edit|cancel|confirm|search|remove|turn|add|start|print|export|tap|expand|"
         r"take|split|reopen|invoice|archive|reactivate|restore|download|rename|duplicate|put|leave|write|note|count|look|narrow|widen|focus|tab)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW = re.compile(r"(Save & Close|Create & Edit|Keep Editing|Discard Changes|Manage Customers|Remove Customers|Add Customers|Set Rule|"
                   r"Create Tier|Create Matrix|New Tier|New Matrix|Change All|Turn Off|Add Range|Reactivate Tier|Audit Log|Fixed Rules|"
                   r"Work Order Matrix|Part Sale Matrix|Work Orders and Part Sales|work orders and Part Sales|Edit Customer|Settings — Parts|"
                   r"Customers — Create & Edit|Customers — View|See Financial Data|Price Part Simulator|Separate Part Sale pricing|Shift\+Tab|Alt\+Down|"
                   r"Tax Exempt|Fees & Discounts|cost and category|Archive and Delete)", re.I)
def two_actions(s):
    if re.search(r"\b(from|in) (its|tier [A-Z]'s|the page's|matrix [A-Z]'s) three-dot menu", s): return True
    t = ALLOW.sub("X", s); t = re.sub(r'"[^"]*"', '"Q"', t); t = re.sub(r"\([^)]*\)", "", t)
    if TWO.search(t): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", t) if x.strip()]
    return len([x for x in sents if re.match(VERBS, x, re.I)]) > 1

# ---- bundled data entry (Rule 135; LIB request 4): "Add a … in its dialog", "Add a part to line 1 with category A and cost 100.00" open, fill
# and save in one step. The work order Quick Add is split by expand.py (labels on design board 10.6); flows no source draws stay whole,
# each listed here with the reason, because splitting them would invent field labels (Rule 57).
DATA_STEP = re.compile(r"^(Add|Create|Make|Fill|Set up|Enter|Give|Invoice|Return|Put)\b")
def bundled(s):
    if re.search(r"^(Add|Create|Set|Make|Fill|Give|Put)\b.*\bin (its|the|that) (dialog|window|modal|form)\b", s): return "opens a dialog, fills it and saves in one step"
    if DATA_STEP.match(s):
        b = re.sub(r"\([^)]*\)", "", s)
        if re.search(r"\bwith\b", b) or re.search(r", (cost|category|sell price|quantity|no cost)", b) or re.search(r"\b(at) (a |an )?(cost|price)", b) or re.search(r"\$\d", b):
            return "opens a form, fills several values and saves in one step"
    return None
KEEP_WHOLE = [
    (r"to Part Sale \d|to the Part Sale|Add a part with category [A-Z] and cost [\d.]+\.$|Add a part with a cost of \$[\d.]+ in category [A-Z]\.$",
     "a Part Sale's add-part row: no source draws its fields"),
    (r"in Tech View", "Tech View's add-part flow: no source draws its fields"),
    (r"part request modal", "the part request modal: no source draws its fields"),
    (r"special-order part \(Source: Vendor\)", "a special-order part's Source field: no source draws it"),
    (r"^Return ", "returning units from a Part Sale: today's return flow, which no source draws"),
    (r"credit memo|goodwill credit", "today's credit flow, which no source draws"),
    (r"^Invoice a new work order", "making and invoicing a work order with today's flow, which no source draws"),
    (r"^Create a new (category|customer) from", "making a record from a picker with today's flow, which no source draws"),
    (r"^Create a new work order", "making a work order with today's flow, which no source draws"),
    (r"to the new work order", "a work order made in the steps, whose line no source sets up: today's flow"),
]
def keep_whole(s):
    for rx, why in KEEP_WHOLE:
        if re.search(rx, s): return why
    return None
KEPT_WHOLE = []

KEYRX = re.compile(r"\b(S\d{1,2}|D|DATA|REL|INV|RPT|DR)-\d{1,3}[a-e]?\b|\bC\d{5,6}\b")
JARGON = re.compile(r"\b(HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON|payload|backend|server|API|webhook|409|422)\b")
VAGUE = re.compile(r"\bnative\b|as described\b|looks right|the same style\b|as designed\b|as in the layout being checked", re.I)
BANNED_PRE = [(r"[{}]", "a placeholder brace"), (r"(?m)^\s*For example:", "a 'For example:' line"), (r"Scenario:", "a Scenario line"),
              (r"mark this test Blocked|setup not done|If you cannot set up|If any record above is missing", "the Blocked line"),
              (r"QA lead|ask your|set aside", "who-to-ask or generic wording"), (r"ZZAUTOTEST", "an example record name"),
              (r"setup file|docs\.google", "a setup-file mention")]
PRE_START = re.compile(r"^(Sign in|Use |Have |Make sure|Before |Note |Open |Keep |Start )")
NEG = re.compile(r"\b(does not|doesn't|is not|isn't|never|no longer|nothing|not shown|not listed|no [a-z]+ (?:is|are|shows|appears)|cannot|can't|is gone|unchanged)\b", re.I)
CLOSE = re.compile(r"\b(only|exactly|no other|nothing else)\b", re.I)
CLOSE_SRC = re.compile(r"\b(only|no other|just|never|no |lists|in order|nothing|not |can't|isn't|without|neither)\b", re.I)
STORY_DESIGN = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}   # stories with a design page (16-19 have none)

keys = [c["key"] for c in L.CASES]
for k in sorted({k for k in keys if keys.count(k) > 1}): P(f"duplicate key {k}")
titles = [c["title"] for c in L.CASES]
for t in sorted({t for t in titles if titles.count(t) > 1}): P(f"duplicate title {t!r}")

for c in L.CASES:
    k, t = c["key"], c["title"]
    if c["sec"] not in L.SECS: P(f"{k}: section {c['sec']} unknown")
    want = r"D-\d{2,3}[b-e]?$" if c["sec"] == "DESIGN" else (r"INV-\d{2,3}[b-e]?$" if c["sec"] == "INV" else re.escape(c["sec"]) + r"-\d{2,3}[b-e]?$")
    if not re.match(want, k): P(f"{k}: key does not match section {c['sec']}")
    if len(t) > 80 or ";" in t: P(f"{k}: title {len(t)} chars or has a semicolon")
    if (c["sec"] == "DESIGN") != t.startswith("Design: "): P(f"{k}: 'Design: ' titles belong exactly to the design folder")
    if not c["steps"]: P(f"{k}: no steps")
    if len(c["res"]) != len(c["steps"]): P(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    for i, s in enumerate(c["steps"], 1):
        if two_actions(s): P(f"{k}: step {i} has two UI actions: {s!r}")
        why = bundled(s)
        if why:
            kw = keep_whole(s)
            if kw: KEPT_WHOLE.append((k, i, s, kw))
            else: P(f"{k}: step {i} {why}: {s!r}")
    # Rule 137: an Admin sign-in line lists exactly the permissions the case uses (perms.py, from the PRD Permissions table)
    import perms as PM
    adm = [x for x in c["pre"] if PM.ADMIN_RX.match(x) or x == "Sign in as an Admin."]
    if len(adm) > 1: P(f"{k}: two Admin sign-in lines")
    if adm:
        rest = [x for x in c["pre"] if x not in adm]
        want = PM.line(PM.needed(rest, c["steps"], [b.t for b in L.bullets(c)]))
        if adm[0] != want: P(f"{k}: the Admin sign-in line asks for other permissions than the case uses: {adm[0]!r} (wants {want!r})")
    for x in c["pre"]:
        if x.startswith("Use a desktop browser window") and c["sec"] != "DESIGN" and "exactly" in x and " so " not in x:
            P(f"{k}: an exact window size on a behaviour case without saying why: {x!r}")
    if not c["pre"]: P(f"{k}: no preconditions")
    for x in c["pre"]:
        for rx, what in BANNED_PRE:
            if re.search(rx, x): P(f"{k}: {what} in the preconditions: {x[:70]!r}")
        if not PRE_START.match(x): P(f"{k}: precondition does not start as a plain setup line: {x[:60]!r}")
    # Rule 137 (a): every labelled record in the preconditions is used in the steps or results, or by another needed record, or says why
    LAB = re.compile(r"\b((?i:tier|matrix|category|customer|work order|Part Sale|client)) ([A-Z]|\d)\b")
    later = " ".join(c["steps"] + [b.t for b in L.bullets(c)] + [c["note"]])
    used = {m.group(0).lower() for m in LAB.finditer(later)}
    grow = True
    while grow:
        grow = False
        for x in c["pre"]:
            labs = {m.group(0).lower() for m in LAB.finditer(x)}
            if labs & used and not labs <= used: used |= labs; grow = True
    for x in c["pre"]:
        for m in LAB.finditer(x):
            if m.group(0).lower() not in used and " so " not in x: P(f"{k}: precondition record '{m.group(0)}' is not used in the steps or results and does not say why")
    # Rule 137 (b): a record the case relies on is made fresh for this test (pre-existing release data is named as such: "on staging", "before the release")
    for x in c["pre"]:
        if re.match(r"Have (a|an|two|three) ", x) and LAB.search(x) and "for this test" not in x and "staging" not in x and "before the release" not in x.lower():
            P(f"{k}: a precondition record not said to be made for this test: {x[:70]!r}")
    tester = [t] + c["pre"] + c["steps"] + [b.t for b in L.bullets(c)] + [c["note"]]
    for x in tester:
        if KEYRX.search(x): P(f"{k}: a case id in tester text: {KEYRX.search(x).group(0)} in {x[:60]!r}")
        if re.search(r"\bS\d+-[RNE]\d+|\bTPX-\d+", x): P(f"{k}: a requirement code in tester text: {x[:60]!r}")
        if JARGON.search(x): P(f"{k}: technical term in tester text: {JARGON.search(x).group(0)}")
        if VAGUE.search(re.sub(r'"[^"]*"', '""', x)): P(f"{k}: vague look word: {x[:70]!r}")
        if re.search(r"[{}]", x): P(f"{k}: a placeholder brace in tester text")
    # sources
    for i, r in enumerate(c["res"], 1):
        if not r: P(f"{k}: step {i} has no result bullet")
        for b in r:
            if not isinstance(b, L.B): P(f"{k}: step {i} result is not built with B()/R(): {b!r}"); continue
            if not b.src: P(f"{k}: step {i} bullet has no source: {b.t[:60]!r}")
            for s in b.src:
                m = L.check_src(s)
                if m: P(f"{k}: step {i}: {m}")
            if CLOSE.search(b.t) and not any(CLOSE_SRC.search(s.text or L.ROWS.get(s.row, {}).get("text", "")) for s in b.src if s.kind != "plan" or s.text):
                P(f"{k}: step {i} closed list without a closing source: {b.t[:70]!r}")
        _uq = lambda t: re.sub(r'"[^"]*"', '""', t)
        if any(NEG.search(_uq(b.t)) for b in r if isinstance(b, L.B)) and not any(not NEG.search(_uq(b.t)) for b in r if isinstance(b, L.B)):
            P(f"{k}: step {i} has only 'does not / never' results, no visible control in the same step")
    if not L.rows_of(c): P(f"{k}: tied to no PRD requirement row (every case needs one)")
    if c["sec"] != "DESIGN" and not any(s.kind in ("row", "prd") for b in L.bullets(c) for s in b.src): P(f"{k}: no PRD sentence behind any result (a behaviour case rests on the PRD)")
    for x in re.findall(r"\bSteps? (\d+)", " ".join(b.t for b in L.bullets(c)) + c["note"]):
        if int(x) > len(c["steps"]): P(f"{k}: text points at step {x}; the case has {len(c['steps'])} steps")
    # refs
    f = L.render(c); refs = f["refs"]
    if not refs or "SV-" not in refs or not re.search(r"S\d+-[A-Z]+\d+|TPX-\d+|PERM-\d+", refs): P(f"{k}: refs without ticket and requirement: {refs!r}")
    if len(refs) >= 250: P(f"{k}: refs {len(refs)} chars")
    for a in re.findall(r"\(([^)]*)\)", refs):
        if "," in a: P(f"{k}: a comma inside a refs anchor")
    # render layout
    h = f["custom_expected"]
    if not h.startswith("<p><strong>Expected Result</strong></p><p>Step 1:</p><ul>"): P(f"{k}: Expected does not open with Step 1")
    if h.count("AUTOMATION: ") != 1 or not h.endswith(f"<p>{L.e(c['marker'])}</p>"): P(f"{k}: AUTOMATION line not single and last")
    if re.search(r"Exact quotes|From: |References from Design", h): P(f"{k}: quotes or design references in the case text (this suite answered NO)")
    if "<p></p>" not in h: P(f"{k}: no blank line before the AUTOMATION line")
    if not c["marker"].startswith("AUTOMATION: "): P(f"{k}: marker")
    # pictures
    for pid in c["pics"]:
        try: DR.picture(pid)
        except KeyError as x: P(f"{k}: picture {pid}: {x}")
    if not c["pics"] and not c["nopic"]: P(f"{k}: no design picture and no reason")
    if c["sec"] == "DESIGN" and not c["pics"]: P(f"{k}: a design case without a picture")
    for b_ in L.bullets(c):
        for s_ in b_.src:
            if s_.kind in ("look", "design") and s_.where not in c["pics"]: P(f"{k}: cites design board {s_.where} but does not attach its picture")
    # held
    if c["held_on"]:
        if c["held_on"] not in QUESTIONS: P(f"{k}: held on {c['held_on']}, which is not in po_questions.py")
        if c["held_on"] in ANSWERED: P(f"{k}: held on answered question {c['held_on']}")
    if "design-version" in c["flags"] and not (c["sec"] == "DESIGN" and c["held_on"]): P(f"{k}: a design-version case must be a held design case")
    if "numbers" in c["flags"] and not any(re.search(r"[=×÷]|\d\s[+−-]\s\$?\d", b.t) for b in L.bullets(c)): P(f"{k}: a number case with no arithmetic shown")

# ---- questions: every candidate holds a case ------------------------------------------------------------------------------------
held_q = Counter(c["held_on"] for c in L.CASES if c["held_on"])
for q in QUESTIONS:
    if q in ANSWERED: continue
    if q in CANDIDATE and not held_q.get(q): P(f"question {q} holds no case (a question must decide a verdict)")
for q in HELD.values():
    if q not in QUESTIONS: P(f"verdicts.HELD names {q}, not in po_questions.py")

# ---- coverage of requirement rows --------------------------------------------------------------------------------------------------
cited = {}
for c in L.CASES:
    for rid in L.rows_of(c): cited.setdefault(rid, []).append(c["key"])
tpx_cited = {}
for c in L.CASES:
    for t in L.tpx_of(c): tpx_cited.setdefault(t, []).append(c["key"])
def in_scope(rid):
    r = L.ROWS[rid]
    return not rid.startswith("RPT-") and (r["story"] in IN_SCOPE_STORIES or str(r["story"]) in map(str, IN_SCOPE_STORIES))
pending = []
own = {}
for c in L.CASES:
    for rid in L.rows_of(c):
        st = L.ROWS[rid]["story"]
        pages = {int(DR.BOARD[p]["page"][1:]) for p in c["pics"] if p in DR.BOARD}
        if (c["sec"] in (f"S{st}", "RPT" if rid.startswith("RPT-") else "-", "INV") or (c["sec"] == "WAIT" and c["key"].startswith(f"S{st}-"))
                or (c["sec"] == "DESIGN" and (st in pages or (rid.startswith("RPT-") and 20 in pages)))):
            own.setdefault(rid, []).append(c["key"])
for rid, r in L.ROWS.items():
    v = [x for x in ((rid in cited) if in_scope(rid) else (rid in own), rid in NOT_TESTABLE, rid in HELD) if x]
    if rid in NOT_TESTABLE and rid in cited: P(f"{rid}: listed as not testable but cited by {cited[rid]}")
    if not v:
        if in_scope(rid): P(f"requirement {rid} (story {r['story']}) has no verdict: no case, not NOT_TESTABLE, not HELD")
        else: pending.append(rid)
for t, r in L.TPX.items():
    rel = [x.strip() for x in r["related_prd"].split(",") if x.strip() in L.ROWS]
    if rel and all(in_scope(x) for x in rel) and t not in tpx_cited and t not in NOT_TESTABLE and t not in HELD:
        P(f"tech-plan row {t} (related {r['related_prd']}) has no verdict")
for k in list(NOT_TESTABLE) + list(HELD):
    if k not in L.ROWS and k not in L.TPX: P(f"verdicts names {k}, which is not a requirement or tech-plan row")

# ---- design boards of the in-scope pages: each attached or explained --------------------------------------------------------
used_pics = Counter(p for c in L.CASES for p in c["pics"])
for bid, b in DR.BOARD.items():
    if int(b["page"][1:]) in IN_SCOPE_STORIES and bid not in used_pics and bid not in UNUSED_BOARDS:
        P(f"design board {bid} of an in-scope page is attached to no case and not in UNUSED_BOARDS")
for pid in [p for p in used_pics if p.startswith("today:")]: pass

# ---- checklist registries ----------------------------------------------------------------------------------------------------------
cmap = {c["key"]: c for c in L.CASES}
for surf, k in STRESS.items():
    c = cmap.get(k)
    if not c: P(f"stress surface {surf!r} names missing case {k}"); continue
    txt = " ".join(c["pre"] + c["steps"])
    if not all(x in txt for x in ("long name with spaces", "long name with no spaces", "& \" ' < >")): P(f"{k}: stress case without all three stress names")
    if "stress" not in c["flags"]: P(f"{k}: stress case not flagged")
for mv, k in MOVEMENT.items():
    c = cmap.get(k)
    if not c: P(f"movement {mv!r} names missing case {k}"); continue
    if "movement" not in c["flags"]: P(f"{k}: movement case not flagged")
    if not re.search(r"screenshot|same place|same left|does not move|stay(s)? in place|keep(s)? (its|their) place", " ".join(c["steps"] + [b.t for b in L.bullets(c)])):
        P(f"{k}: movement case has no before-and-after comparison")
for n, k in NUMBERS.items():
    if k not in cmap: P(f"number {n} names missing case {k}")
    elif "numbers" not in cmap[k]["flags"]: P(f"{k}: number case not flagged")

# ---- divergence register: in-scope rows closed or held --------------------------------------------------------------------------
RJ = f"{L.P}/DESIGN-DIVERGENCE-REGISTER.json"
reg = json.load(open(RJ))["differences"] if os.path.exists(RJ) else []
if not reg: P("DESIGN-DIVERGENCE-REGISTER.json missing or empty")
for r in reg:
    for ck in r.get("cases", []):
        if ck not in cmap: P(f"register {r['id']}: names case {ck}, which does not exist")
    if not r.get("in_scope"): continue
    o = r.get("outcome", "")
    if o.startswith(("CLOSED", "SETTLED", "NO-DIFFERENCE")):
        if not r.get("closed_by"): P(f"register {r['id']}: closed without a closed_by source")
    elif o.startswith("PO-CANDIDATE"):
        hc = cmap.get(r.get("held_case"))
        if not hc or not hc["held"] or hc["held_on"] != r.get("question"): P(f"register {r['id']}: held case {r.get('held_case')} missing or not held on {r.get('question')}")
    else: P(f"register {r['id']}: in-scope row with outcome {o[:40]!r} (must be CLOSED / NO-DIFFERENCE or PO-CANDIDATE with a held case)")

# ---- folders and output ---------------------------------------------------------------------------------------------------------
def folder(c):
    if c["sec"] != "DESIGN" and c["held_on"]: return "WAIT"
    return c["sec"]
out = {}
for c in L.CASES:
    f = L.render(c); sec = folder(c)
    out[c["key"]] = {"sec": sec, "story_sec": c["sec"], "section_name": L.SECS[sec]["name"], "section_id": L.SECS[sec]["id"],
                     "title": c["title"], "refs": f["refs"], "rows": L.rows_of(c), "tpx": L.tpx_of(c), "automation": c["marker"],
                     "held": c["held"], "held_on": c["held_on"], "pictures": list(c["pics"]), "picture_files": [], "flags": sorted(c["flags"]), "fields": f,
                     "sources": [[[s.kind, s.row, s.text, s.where] for s in b.src] for b in L.bullets(c)]}
    pf = []
    for p in c["pics"]:
        try: pf.append(os.path.relpath(DR.picture_path(p), L.P))
        except KeyError: pass
    out[c["key"]]["picture_files"] = pf
json.dump(out, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)

by = Counter(folder(c) for c in L.CASES)
scope_rows = [r for r in L.ROWS if in_scope(r)]
print("modules", MODS)
print("cases", len(L.CASES), "| by folder", dict(sorted(by.items())), "| held", sum(c["held"] for c in L.CASES))
print("in-scope stories", sorted(IN_SCOPE_STORIES), "| rows", len(scope_rows), "| cited", sum(r in cited for r in scope_rows),
      "| not testable", sum(r in NOT_TESTABLE for r in scope_rows), "| held", sum(r in HELD for r in scope_rows),
      "| partial", sum(r in PARTIAL for r in scope_rows))
print("pending rows (stories outside phase scope, for the next batches):", len(pending))
print("questions", len(QUESTIONS), "| holding cases", dict(held_q))
print("register rows", len(reg), "| in scope", sum(1 for r in reg if r.get("in_scope")), "| for later batches", sum(1 for r in reg if not r.get("in_scope")))
print("Admin sign-in lines narrowed or widened to the permissions the case uses:", sum(1 for c in L.CASES if c.get("orig_admin") and c["orig_admin"] not in c["pre"]),
      "of", sum(1 for c in L.CASES if c.get("orig_admin")))
print("Quick Add steps split into one action per step:", sum(c.get("expanded", 0) for c in L.CASES), "in", sum(1 for c in L.CASES if c.get("expanded")), "cases")
print("bundled steps kept whole (flows no source draws):", len(KEPT_WHOLE), dict(Counter(w for *_, w in KEPT_WHOLE)))
json.dump([{"case": k, "step": i, "text": s, "why": w} for k, i, s, w in KEPT_WHOLE], open(f"{D}/kept-whole-steps.json", "w"), indent=1, ensure_ascii=False)
print("markers", dict(Counter(re.sub(r" - .*", "", c["marker"]) if c["marker"].startswith("AUTOMATION: HOLD") else c["marker"] for c in L.CASES)))
for p in probs: print("PROBLEM", p)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
