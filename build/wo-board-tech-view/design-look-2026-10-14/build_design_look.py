#!/usr/bin/env python3
"""Classify the WO Board & Tech View visual inventory (Rule 126) and write the design-look deliverables.

    python3 -I build_design_look.py <run dir of design_visual_inventory.py> <library-rules.json>

Writes, next to this script: visual-inventory-classified.json, design-case-proposals.json, po-questions.json,
compare/*.png (copied from the run's screenshots) and VISUAL-INVENTORY-2026-10-14.md.
Classes: COVERED (C-id that checks THAT visible attribute) · CASE-NEEDED (proposal key) · SPEC-CONFLICT (question id) ·
OUT-OF-SCOPE (written source quoted) · DATA · SUPERSEDED (older copy of the same design; Rule 32) · PROBE-ABSENT (the tool
looked for an element that this state does not show — a tool row, not an observation). Zero unclassified is enforced.
"""
import json, pathlib, re, shutil, sys, collections

HERE = pathlib.Path(__file__).resolve().parent
RUN = pathlib.Path(sys.argv[1]).resolve()
LIB = pathlib.Path(sys.argv[2]).resolve()
PRD_FILE = HERE.parent / "po-defects-2026-10-14" / "CONFLUENCE-845185030-now-2026-10-14.md"
sys.path.insert(0, str(HERE))
import proposals_data as PDATA  # noqa: E402

prd = PRD_FILE.read_text(encoding="utf-8")
RULE = {m.group(1): m.group(2).strip() for m in re.finditer(r"- \*\*(S\d+-[A-Z]+\d+[a-z]?):\*\* (.+)", prd)}


def q(code):
    if code not in RULE:
        raise SystemExit("rule not in PRD v52: " + code)
    return f"{code}: “{RULE[code]}”"


GOALS_LIST = "PRD v52 §3 Goals: “List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher.”"
OOS_RANK = "PRD v52 Out of Scope: “Rank numbers (1, 2, 3, and so on) beside each Tech View row, as the design shows. The drag order already shows priority, and card position numbers were left out of Board View on 2026-10-01.”"
OOS_COLLAPSE = "PRD v52 Out of Scope: “Collapse all and Expand all controls for the technician groups. Groups collapse one at a time (S2-R5, S2-R13).”"
OOS_DEPT = "PRD v52 Out of Scope: “A Department filter. The design shows one, but a work order’s department is not shown or editable on any work order screen today, so users could not see why a work order matches. Revisit once the work order shows its department.”"
OOS_PEEK = "PRD v52 Out of Scope: “A Work order preview panel that opens a List row in a side panel. A List row opens the work order page, as in production (List is unchanged). A later idea, not in this release.”"
for s in (GOALS_LIST, OOS_RANK, OOS_COLLAPSE, OOS_DEPT, OOS_PEEK):   # the quotes must be verbatim in the PRD
    body = s.split("“", 1)[1].rstrip("”")
    if body not in prd:
        raise SystemExit("quote not verbatim in PRD v52: " + body[:80])

rows = json.loads((RUN / "visual-rows.json").read_text())
inv = json.loads((RUN / "visual-inventory.json").read_text())

STATE_CASE = [  # overlay / hover rows: which proposal the probing state belongs to
    ("hover-switch", "DC-02"), ("density-menu", "DC-01"), ("columns-menu", "DC-04"), ("all-columns", "DC-04"), ("count-tooltip", "DC-08"),
    ("lock-tooltip", "DC-05"), ("avatar-stack-hover", "DC-15"), ("row-hover", "DC-15"), ("group-header-hover", "DC-15"), ("card-hover", "DC-15"),
    ("row-menu", "DC-12"), ("card-menu", "DC-12"), ("reassign-dialog", "DC-20"), ("toast", "DC-21"), ("technician-chip", "DC-18"),
    ("technician-chosen", "DC-18"), ("status-chip", "DC-01"), ("assigned-to-me", "DC-18"), ("filtered-empty", "DC-13"), ("search-empty", "DC-13"),
    ("no-technicians", "DC-13"), ("no-work-orders", "DC-13"), ("nothing", "DC-13"), ("view-only", "DC-07"), ("no-financial", "DC-04"),
    ("pinned", "DC-10"), ("collapsed", "DC-08"), ("drag", "DC-14"), ("scrolled", "DC-22"), ("frame-columns", "DC-04"), ("frame-settings", "DC-04")]


def case_by_states(states):
    for sub, key in STATE_CASE:
        if any(sub in s for s in states):
            return key
    return None


def cls(r):
    v, cat, el, reg, view, attr = r["value"], r["category"], r["element"], r["region"], r["view"], r["attribute"]
    boards, themes, states = r["boards"], r["themes"], r["states"]
    # 0 · tool rows that record an absence
    if re.search(r"not on this screen|nothing to scroll|no scroller", v) or (cat == "frame" and attr == "found"):
        return "PROBE-ABSENT", None, "The probe's element is not part of this state (e.g. a Board element looked for in Tech View); nothing to see."
    if cat == "sticky" and ((el.startswith("Board") and view != "Board View") or (el.startswith("Tech View") and view != "Tech View")):
        return "PROBE-ABSENT", None, "Sticky probe meant for the other view; its selector matched a different element in this view."
    if cat == "size" and v == "none":
        return "PROBE-ABSENT", None, "Row type not present in this state."
    # 1 · older copy of the same board
    if boards == ["Work Orders -no page-fix-.dc.html"]:
        return "SUPERSEDED", None, "Seen only on \"Work Orders -no page-fix-.dc.html\", the pre-fix copy of the board (raw palette colours, no sticky board headers). \"Work Orders.dc.html\" is the fixed, newer board (Rule 32: latest wins); its rows are classified."
    # 2 · List
    if view == "List":
        if reg == "display switcher":
            return "CASE-NEEDED", "DC-01", q("S1-R9a")
        if any("frame-settings" in s for s in states):
            return "OUT-OF-SCOPE", None, GOALS_LIST + " (List's Columns panel review frame)"
        return "OUT-OF-SCOPE", None, GOALS_LIST + " " + q("S1-R9a").split(":")[0] + " also says “List’s icons are unchanged.”"
    # 3 · dark-only rows
    if themes == ["dark"]:
        return "SPEC-CONFLICT", "DC-16", "Dark theme: the design offers it, the PRD is silent — PO question W-15 (drafted 8 Oct, NOT SENT). Case DC-16 is held."
    # 4 · page chrome outside this feature
    if reg == "app header" or (cat == "icon" and el.startswith("unnamed svg") and "ShopView" in v):
        return "OUT-OF-SCOPE", None, GOALS_LIST
    if "Department" in v or el == "building-2":
        return "OUT-OF-SCOPE", None, OOS_DEPT
    # 5 · out-of-scope design elements
    if (cat == "icon" and "Collapse all" in v) or "Expand all" in v:
        return "OUT-OF-SCOPE", None, OOS_COLLAPSE
    if (cat == "icon" and "Priority" in v) or ('column "unnamed svg' in el) or ("Priority" in el):
        return "OUT-OF-SCOPE", None, OOS_RANK
    if cat == "columns":
        return "CASE-NEEDED", "DC-04", q("S5-R4") + " (design order differs: grip/collapse, rank, \"Unit #\", \"Assigned Tech\" — see DC-04 conflicts)"
    # 6 · overlays and hover rows, by the state that opened them
    if cat in ("overlay", "hover"):
        k = case_by_states(states)
        if k:
            if k == "DC-02":
                return "CASE-NEEDED", k, q("S1-R9b") + " Design: browser title only (\"Table\" / \"By Lead Tech\" / \"Board\")."
            return "CASE-NEEDED", k, "Design state " + ", ".join(sorted({s.split('__')[2] for s in states})[:3])
        if el == "[role=status]" or "toast" in v.lower():
            return "CASE-NEEDED", "DC-21", q("S4-R5")
        return "CASE-NEEDED", "DC-15", "Overlay in a base state (e.g. the board minimap or an open toast)"
    # 7 · icons by region
    if cat == "icon" and re.match(r"(\[role|\.sv-popover|div\[style|span\[style|#__open)", el):
        k = case_by_states(states)
        return "CASE-NEEDED", k or "DC-15", "Icons inside an overlay opened in state " + ", ".join(sorted({s.split('__')[2] for s in states})[:2])
    if cat == "icon":
        name = el
        if reg == "display switcher":
            return "CASE-NEEDED", "DC-01", q("S1-R9a")
        if reg == "toolbar" or reg == "open popover":
            if name == "wrench" or "Technician" in v:
                return "CASE-NEEDED", "DC-18", q("S1-R15")
            if name in ("row-height", "card-height", "columns-3"):
                return "CASE-NEEDED", "DC-01", q("S1-R9a")
            if name == "check":
                return "CASE-NEEDED", "DC-01", "Design: DensityMenu check icon on the selected option"
            return "SPEC-CONFLICT", "DC-01", "PQ-V01: are filter-chip / Search icons in Tech View and Board View the design's (S1-R9a “every other icon”) or List's production icons? " + q("S1-R9a")
        if "grip" in name:
            if reg.startswith("Board"):
                return "CASE-NEEDED", "DC-10", "Design: six-dot grip with title “Drag to reorder technicians”; " + q("S9-R2")
            return "CASE-NEEDED", "DC-07", q("S9-R1a")
        if reg.startswith("Tech View group header") or reg == "Tech View column header row":
            return "CASE-NEEDED", "DC-08", q("S1-R9a") + " / " + q("S2-R12")
        if reg.startswith("Board column header") or reg == "Board column":
            return "CASE-NEEDED", "DC-10", q("S1-R9a") + " / " + q("S3-R12")
        if name == "lock":
            return "CASE-NEEDED", ("DC-11" if reg == "Board card" else "DC-05"), q("S1-R9a") + " / " + q("S4-N7")
        if name == "ellipsis":
            return "CASE-NEEDED", "DC-12", q("S3-R13")
        if reg in ("Tech View work order row",):
            return "CASE-NEEDED", "DC-05", q("S2-R20")
        if reg == "Board card":
            return "CASE-NEEDED", "DC-11", "Design card layout"
        if reg in ("row menu", "dialog"):
            return "CASE-NEEDED", ("DC-12" if reg == "row menu" else "DC-20"), "Design menu / dialog icons"
        if reg == "toast":
            return "CASE-NEEDED", "DC-21", q("S4-R5")
        if reg == "drag drop line / refusal pill":
            return "CASE-NEEDED", "DC-14", q("S4-N7")
        if reg == "other" and name in ("clipboard-list", "user-round") or "unnamed svg" in name and reg == "other":
            return "CASE-NEEDED", "DC-13", q("S1-R9a") + " (empty states)"
        return "CASE-NEEDED", "DC-13", "Icon in an empty / first-run state"
    # 8 · Tech View table look
    if cat == "header-style":
        return "CASE-NEEDED", "DC-04" if "labels" in el else "DC-03", q("S2-R21") if "labels" in el else "Design: header row sticky, white, 1 px bottom border"
    if cat == "cell" or cat == "cell-style":
        if '"Status"' in el:
            return "CASE-NEEDED", "DC-06", q("S2-R19")
        if '"chevron-down"' in el:
            return "CASE-NEEDED", "DC-07", q("S9-R1a")
        if '"Clocked In"' in el:
            return "SPEC-CONFLICT", "DC-05", "W-16 (NOT SENT): design shows a time badge; " + q("S2-R20") + " keeps List's Clocked In display"
        return "CASE-NEEDED", "DC-05", q("S2-R20")
    if cat == "overlap" and el == "text" and attr == "overlapping text pairs" and v != "none":
        base = all(s.split("__")[0] in ("core", "widths") for s in states)
        if base:
            return "CASE-NEEDED", "DC-17", "TEXT COLLISION in a base state — " + q("S2-R21")
        k = case_by_states(states) or ("DC-09" if view == "Board View" else "DC-15")
        return "CASE-NEEDED", k, "Layering, not a collision: an open menu, dialog, tooltip, refusal message or the fixed Unassigned column covers text beneath it in state " + ", ".join(sorted({s.split('__')[2] for s in states})[:2]) + ". The look of that state is in the case named."
    if cat == "overlap":
        if "column header" in el:
            return "CASE-NEEDED", "DC-04", q("S2-R21")
        return "CASE-NEEDED", "DC-17", q("S2-R21") + " (no overlap anywhere at 1024–1920 px)"
    if cat == "sticky":
        if "Tech View 'Esther" in el or "Unassigned group header" in el:
            if v.startswith("no"):
                return "SPEC-CONFLICT", "DC-22", "PQ-V09: the design's group header scrolls away; " + q("S2-E1") + " " + q("S2-R18") + " Behaviour COVERED by C96935 and C368127."
        if "column header row" in el:
            return "CASE-NEEDED", "DC-22", "Design: Tech View column header row position sticky, top 0"
        if "Unassigned' column" in el:
            return "COVERED", "C96941", q("S3-R2")
        if "column header" in el:
            return "COVERED", "C96942", q("S3-R3")
    if cat == "frame":
        if el.startswith("Tech View"):
            return "CASE-NEEDED", "DC-03", q("S2-R22")
        if el.startswith("Board View"):
            return "CASE-NEEDED", "DC-09", q("S3-R23")
        if el == "Toolbar":
            return "CASE-NEEDED", "DC-01", "Design: toolbar row 16 × 24 px padding on white"
        if el == "Empty state block":
            return "CASE-NEEDED", "DC-13", q("S1-N1")
        if el == "page":
            return "CASE-NEEDED", "DC-09" if view == "Board View" else "DC-03", "Design page background"
    if cat in ("row-type", "row-style", "size"):
        e = el
        if e in ("Filter chip", "Toolbar button"):
            if "wrench" in v:
                return "CASE-NEEDED", "DC-18", q("S1-R15")
            return "CASE-NEEDED", "DC-01", "Design: 36 px toolbar buttons and chips (SKILL.md “Only one size is specified (36px)”)"
        if e == "Tech View group header":
            return "CASE-NEEDED", "DC-08" if cat != "size" else "DC-19", q("S2-R12") if cat != "size" else q("S6-R2")
        if e == "Tech View work order row":
            if "pill" in attr:
                return "CASE-NEEDED", "DC-06", q("S6-R2a")
            return "CASE-NEEDED", "DC-07" if cat == "row-type" else ("DC-19" if cat == "size" else "DC-15"), q("S9-R1a") if cat == "row-type" else q("S6-R2")
        if e == "Board column header":
            return "CASE-NEEDED", "DC-10", q("S3-R12")
        if e == "Board card":
            return "CASE-NEEDED", "DC-11", q("S5-R3") + " / " + q("S6-R6")
        if e.startswith("Empty"):
            return "CASE-NEEDED", "DC-13", q("S3-R20")
        if e == "pill/badge":
            if reg == "Tech View work order row":
                if v.startswith("16"):
                    return "SPEC-CONFLICT", "DC-06", "PQ-V04: design small pill renders 16 px; " + q("S6-R2a")
                return "CASE-NEEDED", "DC-06", q("S6-R2a")
            if reg == "Board card":
                return "SPEC-CONFLICT", "DC-11", "PQ-V13: Board card status badge — design's 22 px badge or List's production pill? (" + q("S2-R19").split(":")[0] + " names Tech View only; a ruling covers only what it names)"
            if reg in ("row menu", "dialog", "toast", "other", "Tech View group header", "Board column header", "toolbar", "open popover"):
                return "CASE-NEEDED", case_by_states(states) or "DC-01", "Pill/badge in an overlay or chrome state"
            return "CASE-NEEDED", "DC-06", q("S6-R2a")
        if e == "List row":
            return "OUT-OF-SCOPE", None, GOALS_LIST
    return None, None, None


classified = []
for r in rows:
    c, k, why = cls(r)
    if c is None and (r.get("view") == "" or r["view"] not in ("Tech View", "Board View", "List")):
        c, k, why = "CASE-NEEDED", case_by_states(r["states"]) or "DC-15", "State without a view tag"
    classified.append({"id": r["id"], "class": c or "UNCLASSIFIED", "case": k, "basis": why, "view": r["view"], "category": r["category"],
                       "region": r["region"], "element": r["element"], "attribute": r["attribute"], "value": r["value"],
                       "themes": r["themes"], "widths": r["widths"], "densities": [d for d in r["densities"] if d], "boards": r["boards"], "state_count": r["state_count"],
                       "states_sample": r["states"][:4]})
BOARD_SWAP = {"DC-08": "DC-10", "DC-05": "DC-11", "DC-07": "DC-10", "DC-03": "DC-09", "DC-04": "DC-10", "DC-06": "DC-11", "DC-19": "DC-11", "DC-22": "DC-09"}
for c in classified:   # a state key names the Tech View case; the same state in Board View belongs to the Board case
    if c["view"] == "Board View" and c["case"] in BOARD_SWAP:
        c["case"] = BOARD_SWAP[c["case"]]
uncl = [c for c in classified if c["class"] == "UNCLASSIFIED"]

# ----------------------------------------------------------------------------- library sentences
lib = json.loads(LIB.read_text())
LIB_RULES = [  # (pattern in the sentence, class, case/question, basis)
    (r"edge to edge on white", "CASE-NEEDED", "DC-03", "Tech View: " + q("S2-R22").split(":")[0] + "; Board View DC-09 (" + q("S3-R23").split(":")[0] + ")"),
    (r"filters\s*$|chips that open", "CASE-NEEDED", "DC-18", "Technician chip opens a dropdown (S1-R15)"),
    (r"Buttons trigger actions; links navigate", "CASE-NEEDED", "DC-05", "Number is a link that opens the work order (S2-R20)"),
    (r"One primary button per view", "CASE-NEEDED", "DC-01", "Toolbar has one solid blue button (New Work Order) — design chrome; PQ-V10"),
    (r"Labels are always visible", "CASE-NEEDED", "DC-18", "Chips keep their labels"),
    (r"Semantic colour always pairs|never colour alone|status shown as badge \+ word", "CASE-NEEDED", "DC-06", "Status pill shows the word, not only a colour"),
    (r"never grey for interactive elements except disabled", "CASE-NEEDED", "DC-10", "Only a disabled control looks grey/faded (pin controls at the pin limit, S3-R8); body text contrast via C96990"),
    (r"Minimum text size 12px|must meet 4.5:1", "COVERED", "C96990", q("S6-R4")),
    (r"Focus is always", "SPEC-CONFLICT", "W-12", "Keyboard focus look is Story 11 'design must define' — W-12 (NOT SENT)"),
    (r"Hover is a colour shift|never a shrink", "CASE-NEEDED", "DC-15", "Design hover rule"),
    (r"Never emoji\. Never a unicode glyph", "CASE-NEEDED", "DC-01", q("S1-R9a").split(":")[0] + " — outline SVG icons"),
    (r"Mobile layouts are not defined", "COVERED", "C154649", q("S1-R14")),
    (r"empty states are text only", "CASE-NEEDED", "DC-13", "Empty states: icon + text, no illustration"),
    (r"Dark greys, never pure black", "SPEC-CONFLICT", "W-15", "Dark theme in scope? W-15 (NOT SENT)"),
    (r"light-only — using one is a bug|bug that only shows up in dark mode|do not flip in dark mode|do \*\*not\*\* theme|do NOT theme|never themes", "SPEC-CONFLICT", "W-15", "Dark-mode token rule; matters only if Dark theme is in scope (W-15)"),
    (r"Only one size is specified \(36px\)", "CASE-NEEDED", "DC-01", "36 px toolbar buttons"),
    (r"pill only, 32px, radius 6|Selected is visually identical to hover", "SPEC-CONFLICT", "PQ-V10", "Design restyles the filter-view tabs; PRD says the page is unchanged except the switcher"),
    (r"danger rows recolour the text only", "CASE-NEEDED", "DC-12", "Red Unassign item: red text, no red hover background (design)"),
    (r"Approved` is \*\*teal\*\*|Two status vocabularies|Two of them, and they are not interchangeable|not interchangeable — a work order line", "SPEC-CONFLICT", "PQ-V13", "Status colours: S2-R19 keeps List's production pill in Tech View; Board card badge undecided (PQ-V13)"),
    (r"always-on columns|hideLocked", "SPEC-CONFLICT", "W-2", "Tech View column chooser hides locked columns / no Lead Technician — W-2 (NOT SENT)"),
    (r"always last", "CASE-NEEDED", "DC-04", q("S5-R4").split(":")[0] + " — Total price last"),
    (r"only amber in the row|green only", "OUT-OF-SCOPE", None, "Auth / Parts columns exist only in the design's review frame (prop frame=columns); not in " + q("S5-R4").split(":")[0] + " or S2-R4 (List's columns)"),
    (r"photo-capable|initials-only primitive", "CASE-NEEDED", "DC-08", "Initials avatar look (SV-11338)"),
    (r"must never be focusable|tabbing out of the panel|takes focus without a click", "SPEC-CONFLICT", "W-12", "Keyboard behaviour — Story 11 (W-12, NOT SENT)"),
    (r"Scope chips appear only|software keyboard|types that actually matched", "OUT-OF-SCOPE", None, "Global Search / mobile artboards — not on these screens; " + GOALS_LIST),
]
lib_rows = []
for i, s in enumerate(lib["sentences"], 1):
    t = s["text"]; hit = None
    for pat, c, k, why in LIB_RULES:
        if re.search(pat, t):
            hit = (c, k, why); break
    if not hit:
        hit = ("AUTHORING", None, "An instruction to designers / developers about how to write the design files (tokens, load order, bundling, copy tone, file roles, component reuse). It has no on-screen look of its own on these screens; where its result is visible it is checked through the case named on the matching visible row.")
    lib_rows.append({"id": f"L{i:03d}", "file": s["file"].split("design-2026-10-14-upload/")[-1], "line": s["line"], "text": t, "class": hit[0], "case": hit[1], "basis": hit[2]})

# ----------------------------------------------------------------------------- screenshots and uploads in the package
PKG = HERE.parent / "sources" / "design-2026-10-14-upload"
shots = sorted(str(p.relative_to(PKG)) for p in PKG.rglob("*") if p.suffix.lower() in (".png", ".jpg") and ("screenshots" in p.parts or "uploads" in p.parts))
img_rows = []
for f in shots:
    if f.startswith("screenshots/wo-details/"):
        c, why = "OUT-OF-SCOPE", "Work order page (Add Part) design-token migration captures. The only parts of that page this PRD changes are S7-R8 (Labor row names; covered by C368142) and S8-R1 (check mark removed; C97000). " + GOALS_LIST
    elif "details" in f:
        c, why = "SUPERSEDED", "Earlier 'Details' display (the board hides it: prop detailsView default false). " + q("S1-R1")
    elif f.endswith("06-no-fix.png"):
        c, why = "DATA", "Blank grey capture — nothing on screen."
    elif f.startswith("screenshots/"):
        c, why = "SUPERSEDED", "Branko's earlier progress capture at ~924 px of the same boards; the live board 'Work Orders.dc.html' (rendered in every state above) is newer and wins (Rule 32). Differences seen: older card footers with a technician name in text, 'Waiting on N parts' on cards (out of scope), filter chips greyed in an older dark build."
    elif re.search(r"(aaron|danny|jackie|mia)\.png$", f):
        c, why = "DATA", "Staff photo used for avatars."
    else:
        c, why = "SUPERSEDED", "Design-review capture of an earlier iteration (count tooltip, minimap, the row-height and card-height icons, the lock tooltip \"Invoiced · can’t be reassigned\", the Lines tab, the props panel). Each element shown is rendered from the live board and classified on its own row; the live board is newer (Rule 32)."
    img_rows.append({"file": f, "class": c, "basis": why})

# ----------------------------------------------------------------------------- proposals, compare pictures
cases = []
need = collections.defaultdict(list)
for c in classified:
    if c["case"] and c["case"].startswith("DC-"):
        need[c["case"]].append(c["id"])
(HERE / "compare").mkdir(exist_ok=True)
copied, missing = [], []
for p in PDATA.P:
    srcs = []
    for code in p["sources"]:
        label, ref = code
        if re.fullmatch(r"S\d+-[A-Z]+\d+[a-z]?", ref):
            srcs.append({"attribute": label, "source": f"PRD v52 {ref}", "quote": q(ref)})
        else:
            srcs.append({"attribute": label, "source": ref.split(":")[0], "quote": ref.split(":", 1)[1].strip() if ":" in ref else ref})
    comp = []
    for dst, sid in p["compare"]:
        sid0 = sid.split(" ")[0]
        shot = RUN / "shots" / (re.sub(r"[^A-Za-z0-9_.-]+", "_", sid0)[:150] + ".png")
        if shot.exists():
            shutil.copy(shot, HERE / dst); copied.append(dst)
        else:
            missing.append((dst, sid0))
        comp.append({"picture": "build/wo-board-tech-view/design-look-2026-10-14/" + dst, "design_state": sid,
                     "how_to_reach_it_in_the_design": "Open sources/design-2026-10-14-upload/Work Orders.dc.html in Claude Design (or served locally) — state id parts: <matrix>__<board>__<state>__<theme>__<width>"})
    cases.append({"key": p["key"], "title": p["title"], "title_length": len(p["title"]), "section": "Design — how it looks", "screen_and_state": p["screen"],
                  "tickets": p["tickets"], "compare_with": comp, "design_board": PDATA.DESIGN,
                  "preconditions": p["pre"], "steps": p["steps"], "expected": p["expected"], "sources": srcs, "spec_conflicts_and_notes": p["conflicts"],
                  "automation": p["automation"], "inventory_rows": len(need.get(p["key"], [])), "inventory_row_ids_sample": need.get(p["key"], [])[:12]})
long_titles = [c["key"] for c in cases if c["title_length"] > 80]

out = {"generated": "2026-10-14", "prd": PDATA.PRD, "design": PDATA.DESIGN,
       "rule": "Rule 126 / skill 21 §4b-§6b; Ideal-Test-Case Standard (Rule 117); runnable by a manual tester with the product UI and the named design picture at 100% zoom",
       "cases": cases}
(HERE / "design-case-proposals.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
(HERE / "visual-inventory-classified.json").write_text(json.dumps({"rows": classified, "library": lib_rows, "images": img_rows}, indent=1, ensure_ascii=False))

PQ = [
    ("PQ-V01", "Chris Ward / Sasha Grosman", "In Tech View and Board View, should the filter chips and Search use the design's icons too?",
     "The PRD says every other icon in Tech View and Board View is the design's icon, and List's icons are unchanged. The filter chips and Search are shared with List. In the design they show a spinner-like icon (Status), a clipboard (Assigned to me), a wrench (Technician) and a truck (Asset on site).",
     ["(a) Chips and Search keep production's icons in every view (only the icons S1-R9a lists change).", "(b) In Tech View and Board View the chips and Search use the design's icons; List keeps production's (the icons change when you switch view)."],
     [q("S1-R9a")], ["DC-01"], []),
    ("PQ-V02", "Chris Ward", "Is sideways scrolling in Tech View at 1440 px wide acceptable?",
     "With the design's 13 default columns the Tech View table needs about 1,790 px, so in the design itself it scrolls sideways at 1440 and 1536 px. SV-11317 lists \"at 1440px wide the table runs off the right edge\" as part of the defect.",
     ["(a) Yes — sideways scrolling is fine, as in the design.", "(b) No — the 13 default columns must fit at 1440 px without scrolling (the design needs narrower columns)."],
     [q("S5-R4")], ["DC-03", "DC-04", "DC-17"], ["SV-11317"]),
    ("PQ-V03", "Sasha Grosman", "Which header words ship for two Tech View columns: \"Unit\" / \"Assigned Techs\" or the design's \"Unit #\" / \"Assigned Tech\"?",
     "The PRD lists Unit and Assigned Techs; the design's header row reads Unit # and Assigned Tech.",
     ["(a) The PRD's words: Unit, Assigned Techs.", "(b) The design's words: Unit #, Assigned Tech."], [q("S5-R4"), q("S7-R7")], ["DC-04"], ["SV-11317"]),
    ("PQ-V04", "Chris Ward / Branko Cicovic", "Tech View status pill at Compact and Regular: 18 px (PRD) or 16 px (as the design draws it)?",
     "The PRD calls 18 px and 22 px \"the design's two badge sizes\". The design's small pill actually renders 16 px tall (22 px at Comfortable is right).",
     ["(a) 18 px as the PRD says (the design is updated).", "(b) 16 px as the design draws it (the PRD is updated)."], [q("S6-R2a")], ["DC-06"], ["SV-11318"]),
    ("PQ-V05", "Chris Ward", "Does a view-only user see the six-dot grip on Tech View group headers?",
     "The PRD shows the grip only to users who can drag, but a view-only user may still reorder technician groups. The design also shows the grips on rows to a view-only user.",
     ["(a) Group-header grips show to everyone who can reorder groups (view-only included); row grips only to users with Create & Edit.", "(b) No grips at all for a view-only user."],
     [q("S9-R1a"), q("S9-R2")], ["DC-07"], ["SV-11320"]),
    ("PQ-V06", "Branko Cicovic / Sasha Grosman", "Filtered-empty state icon: magnifier (as List and the design) or clipboard (S1-R9a)?",
     "S1-R9a says empty states use the clipboard icon; S1-N1 says the filtered-empty state is the same as List's. The design's filtered-empty state uses List's magnifier.",
     ["(a) Magnifier, same as List (S1-N1).", "(b) Clipboard icon (S1-R9a)."], [q("S1-R9a"), q("S1-N1")], ["DC-13"], ["SV-11319"]),
    ("PQ-V07", "Chris Ward", "At Comfortable the design adds the hours under the progress bar — allowed?",
     "The PRD says density never changes which values are shown. The design shows \"0.8 / 8.0 hrs\" under the progress bar only at its largest row size.",
     ["(a) No — the same values show at every density (the hours line is dropped or shown at every density).", "(b) Yes — Comfortable may add the hours line."], [q("S6-R6")], ["DC-19"], []),
    ("PQ-V08", "Branko Cicovic", "Is the 14 Oct Reassign dialog the final design?",
     "The PRD still lists the Reassign dialog's content, search, grouping, avatars and \"N open\" count as design work. The 14 Oct design has a dialog without an Unassigned row and without grouping.",
     ["(a) Yes — test the dialog as drawn (plus the PRD's Unassigned row).", "(b) No — hold the dialog look until the design is final."], [q("S4-R12")], ["DC-20"], []),
    ("PQ-V09", "Branko Cicovic", "The design's Tech View group headers scroll away; the PRD keeps them on screen. Update the design?",
     "S2-E1 and S2-R18 keep the group header (and Unassigned's header) visible while scrolling. In the design only the column header row stays at the top.",
     ["(a) Keep the PRD: group headers stay on screen (design to be updated).", "(b) Follow the design: only the column header row stays."], [q("S2-E1"), q("S2-R18")], ["DC-22"], []),
    ("PQ-V10", "Chris Ward", "Does the Work Orders page chrome take the design's look (pill tabs, two-row toolbar, \"New Work Order\")?",
     "The PRD says the only addition to the Work Orders page is the switcher. The design restyles the filter-view tabs as grey pills, puts the chips on a second row and names the button \"New Work Order\" (production: \"Create Work Order\").",
     ["(a) No — production's tabs, toolbar and button stay; only the switcher is added.", "(b) Yes — the page chrome follows the design."], [GOALS_LIST], ["DC-01"], []),
    ("PQ-V13", "Chris Ward", "Board View card status badge: the design's badge or List's production pill?",
     "S2-R19 makes Tech View's status the List's production pill with its red and blue counts. It names Tech View only. The design's Board card badge is a 22 px tinted pill with the design's colours (Approved teal) and no counts.",
     ["(a) Board cards use the same production pill as List and Tech View (with the counts).", "(b) Board cards keep the design's badge."], [q("S2-R19"), q("S3-R5")], ["DC-11"], []),
]
EXISTING = [("W-1", "switcher words"), ("W-2", "Tech View column chooser / locked columns"), ("W-5", "minimap and position numbers"), ("W-11", "13 px text at Compact"),
            ("W-12", "keyboard / focus look"), ("W-13", "search-only empty words"), ("W-15", "Dark theme in scope"), ("W-16", "Clocked In names vs time")]
SENT = [("AA-1", "Ahtasham Amjad, Slack, 14 Oct 2026", "PRD S2-R11 keeps pinning in Tech View, but the design's Tech View group header shows no pin icon — keep the pin as staging has it?", [q("S2-R11")], ["DC-08"]),
        ("AA-2", "Ahtasham Amjad, Slack, 14 Oct 2026", "On a Board card, More actions (hover / keyboard focus) covers part of the status badge; the design does not show this state — acceptable, or should the badge stay fully visible?", [q("S3-R13"), q("S3-R5")], ["DC-12"])]
pq_out = {"for": "Sasha Grosman (PRD owner), Chris Ward (PO), Branko Cicovic (design)", "format": "colour-coded PO question format (Rule 125) — main session builds the sheet",
          "new_questions_not_sent": [{"id": i, "for": who, "question": qq, "context": ctx, "options": opts, "spec_quotes": quotes, "cases": cs, "tickets": tk, "sent_on": None}
                                     for i, who, qq, ctx, opts, quotes, cs, tk in PQ],
          "existing_register_questions_not_sent": [{"id": i, "topic": t, "sent_on": None, "register": "build/OUTSTANDING-ITEMS-REGISTER.md (2026-10-08 WO block)"} for i, t in EXISTING],
          "already_sent": [{"id": i, "sent": s, "question": qq, "spec_quotes": qs, "cases": cs, "how_the_case_handles_it": ("case follows the PRD (pinning offered in Tech View) and names the divergence" if i == "AA-1" else "SPEC-CONFLICT / design-silent: no expected result is set for the covered badge")} for i, s, qq, qs, cs in SENT],
          "unsent_count": len(PQ) + len(EXISTING)}
(HERE / "po-questions.json").write_text(json.dumps(pq_out, indent=1, ensure_ascii=False))

cnt = collections.Counter(c["class"] for c in classified)
lcnt = collections.Counter(r["class"] for r in lib_rows)
icnt = collections.Counter(r["class"] for r in img_rows)
print("rows", len(classified), dict(cnt)); print("library", len(lib_rows), dict(lcnt)); print("images", len(img_rows), dict(icnt))
print("unclassified", len(uncl)); [print("  ", u["id"], u["view"], u["category"], u["region"], u["element"], u["attribute"], u["value"][:90]) for u in uncl[:30]]
print("compare copied", len(copied), "missing", missing); print("long titles", long_titles)
print("cases", len(cases), {c["key"]: c["inventory_rows"] for c in cases})

# ----------------------------------------------------------------------------- Markdown
TICKETS = [
    ("SV-11317", "Chris", "Tech View opens on the design's 13 columns", "Work Orders.dc.html, Tech View header row (states core…tech-*): Status, Waiting On Parts, Number, Customer, Unit #, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Tech, Created on, Total price (plus the design's collapse arrow and rank column, both PRD out of scope); the table needs ≈1,790 px", "S5-R4, S7-R7", "CASE-NEEDED", "DC-04 (+ DC-03, DC-17)", "C96927 / C96979 assert the OLD rule — rewrite"),
    ("SV-11318", "Chris", "Status pill 18 / 18 / 22 px by density", "Tech View Status cells: 16 px at Small and Medium, 22 px at Large (SV.Badge sm / md)", "S6-R2a, S2-R19", "CASE-NEEDED + SPEC-CONFLICT PQ-V04 (16 vs 18)", "DC-06 (+ DC-19)", "—"),
    ("SV-11319", "Chris", "Lucide icons in switcher and views", "switcher list / user-round / square-kanban 20 px; toolbar row-height, card-height, columns-3; headers chevron-down, user-round (Unassigned), clipboard-list (count); rows lock; Board pin (inline Lucide pin / pin-off); empty clipboard-list", "S1-R9a", "CASE-NEEDED (+ PQ-V01 chip icons, PQ-V06 empty icon)", "DC-01, DC-05, DC-08, DC-10, DC-13", "—"),
    ("SV-11320", "Chris", "Six-dot grip on every Tech View row and group header, Unassigned included", "inline six-circle grip on 100% of Tech View rows and group headers incl. Unassigned (row-type rows); title \"Drag to reorder technicians\" on header grips", "S9-R1a, S2-R8, S4-N1", "CASE-NEEDED (+ PQ-V05 view-only header grip)", "DC-07", "C96925 / C97003 use the grip as a tool only"),
    ("SV-11321", "Chris", "Header labels 12 px / 500 / secondary; no overlap", "Tech View header labels 12px / 500 / --sv-text-secondary at every density and theme; label gaps ≥ 4 px at 1440 and 1536, with all columns too", "S2-R21", "CASE-NEEDED", "DC-04, DC-17", "—"),
    ("SV-11322", "Chris", "Switcher tooltip opens above, never over the header row", "the design has only the browser's title text on the switcher (\"Table\" / \"By Lead Tech\" / \"Board\"); its own tooltips (counts, lock) open above the host", "S1-R9b", "CASE-NEEDED (rule from the PRD)", "DC-02", "—"),
    ("SV-11323", "Chris", "Board View full width, no grey rounded panel", "column strip starts at the left edge on the light-grey page; each column is its own white 12 px-radius card with elev-1 shadow, 16 px gaps; no wrapper panel", "S3-R23", "CASE-NEEDED", "DC-09", "—"),
    ("SV-11324", "Chris", "Tech View edge to edge on white, no gutter", "Tech View header row and group headers at gap 0 from the left edge, white (--sv-surface), no card/panel ancestor; library README \"runs edge to edge on white (never inside a card on grey)\"", "S2-R22", "CASE-NEEDED", "DC-03", "—"),
    ("SV-11325", "Chris", "Number link, Progress bar, advisor avatar", "Number accent blue (--sv-accent) 14/500; Progress bar 64×6 (48×4 Compact) + % in 12 px grey; Service Advisor avatar 24 px (20 / 32) before the name", "S2-R20", "CASE-NEEDED (+ W-16 Clocked In)", "DC-05", "—"),
    ("SV-11326", "Chris", "Technician filter in Tech View and Board View", "toolbar chip \"Technician\" with Lucide wrench after Assigned to me (Tech View and Board View; hidden in List); dropdown below the chip", "S1-R15, S1-R15a, S1-R15b", "CASE-NEEDED", "DC-18", "C96914 was wrongly counted as covering it in the text inventory (List-only ruling stretched)"),
    ("SV-11336", "Ahtasham", "Staff record name on headers, rows and cards", "names come from the same record everywhere in the design", "S5-R11b", "COVERED", "—", "C581895 (group header, column header, card lead name, card avatar names). Small gap: it does not hover the Tech View row's Assigned Techs avatars — one extra step proposed"),
    ("SV-11337", "Ahtasham", "Board card typography and density", "Board card: number 14/500 accent, customer 14/500, unit · asset 12/500 grey, total 14/500 — identical at both design card sizes; our render matches Chris Ward's own design screenshot D1-design-board_view-1440.png pixel for pixel", "(no PRD sentence) S6-R2, S6-R6", "CASE-NEEDED — but the ticket's 'design' sizes (15/16 px, weight 600) are NOT what the 14 Oct design shows", "DC-11", "—"),
    ("SV-11338", "Ahtasham", "Header avatar without photo: light-grey circle, dark initials; name size", "Tech View and Board headers: initials avatar on --sv-surface-sunken (light grey) with --sv-text-secondary initials (\"BM\"); header name 14 px / 600 at every density (not ~16 px)", "S2-R12, S3-R12 (no style sentence)", "CASE-NEEDED (avatar look); name-size claim does not match the design", "DC-08, DC-10", "C368161 checks only that initials show, not their look"),
]
BEYOND = [
    ("Tech View status pill height", "The design's small pill is 16 px, not the 18 px S6-R2a says the design uses", "PQ-V04", "DC-06"),
    ("Tech View width", "The design's 13 default columns need ≈1,790 px, so the design itself scrolls sideways at 1440 and 1536", "PQ-V02", "DC-03, DC-04"),
    ("Tech View group headers while scrolling", "Design: group headers scroll away (only the column header row is sticky); PRD S2-E1 / S2-R18 keep them on screen", "PQ-V09", "DC-22"),
    ("View-only grips", "Design shows row grips to a view-only user; the PRD shows them only to users who can drag; group-header grip for view-only undecided", "PQ-V05", "DC-07"),
    ("Board card status badge", "Design 22 px badge with design colours (Approved teal), no red/blue counts; S2-R19 covers Tech View only", "PQ-V13", "DC-11"),
    ("Filter chip icons", "Design chips: loader, clipboard, wrench, truck; S1-R9a 'every other icon' vs List unchanged", "PQ-V01", "DC-01"),
    ("Page chrome", "Design restyles tabs as grey pills, chips on a second row, 'New Work Order' (production 'Create Work Order')", "PQ-V10", "DC-01"),
    ("Column header words", "Design 'Unit #', 'Assigned Tech' vs PRD 'Unit', 'Assigned Techs'", "PQ-V03", "DC-04"),
    ("Comfortable adds hours under the bar", "Design shows '0.8 / 8.0 hrs' only at the largest row size; S6-R6 says density never changes what is shown", "PQ-V07", "DC-19"),
    ("Filtered-empty icon", "Design (and List) use a magnifier; S1-R9a says empty states use clipboard-list", "PQ-V06", "DC-13"),
    ("Reassign dialog", "PRD still lists the dialog as design work; design has no Unassigned row", "PQ-V08", "DC-20"),
    ("Board card More actions over the badge", "the button overlays the badge's right end on hover; focus state not drawn", "AA-2 (sent by Ahtasham)", "DC-12"),
    ("Tech View pin", "PRD S2-R11 keeps pinning in Tech View; design header has no pin", "AA-1 (sent by Ahtasham)", "DC-08"),
    ("Drag affordances", "40% fade, blue 3 px drop line, dark refusal pill with ban icon — no case checked the look", "—", "DC-14"),
    ("Hover looks", "row → light grey; card → darker border + shadow; dark name bubbles above avatars; never a scale", "—", "DC-15"),
    ("Toast look", "white bottom-right toast with green check icon, close X, auto-dismiss", "—", "DC-21"),
    ("Density sizes", "rows 36 / 48 / 64, headers 36 / 44 / 56, avatars 20 / 24 / 32, bars 48×4 / 64×6, 13 px text at Compact", "W-11", "DC-19"),
    ("No overlap at other widths", "1024, 1280, 1366, 1920 checked; toolbar wraps, names truncate with '…'", "—", "DC-17"),
    ("Dark theme", "full dark rendering exists in the design; PRD silent", "W-15 (unsent)", "DC-16 (held)"),
    ("Empty-state looks", "dashed drop box with grey icon circle; first-run and no-technician layouts", "register (texts)", "DC-13"),
    ("Pinned look", "pinned icon turns to pin-off in accent blue; at the limit other pins fade to 40%", "register (limit 5 vs 3)", "DC-10"),
]
FILES = [
    ("PRD v52 (Confluence 845185030), saved po-defects-2026-10-14/CONFLUENCE-845185030-now-2026-10-14.md", "75,806 B", "lines 1–688", "100% by eye, 4 chunks"),
    ("Chris Ward's tickets TICKETS-SV-11317-to-11326.md", "12,975 B", "all", "100% by eye"),
    ("Ahtasham Amjad's tickets TICKETS-SV-11336-to-11338-Ahtasham.md", "1,811 B", "all", "100% by eye"),
    ("Rule 126 (RULES-61-96.md lines 3101–3147), skill 21, LESSONS-REGISTER, INCIDENT-REVIEW", "7,470 + 1,545 + 8,046 B", "all", "100% by eye"),
    ("Work Orders.dc.html", "105,853 B", "lines 1–1411", "100% by eye (line 405 data-props parsed)"),
    ("Work Orders -no page-fix-.dc.html", "105,411 B", "diff vs the main board, 276 diff lines", "100% (identical lines read once)"),
    ("Work Orders Details.dc.html", "117,661 B", "diff vs the main board, 309 diff lines", "100% (identical lines read once)"),
    ("_ds/…/README.md, SKILL.md", "15,124 + 12,355 B", "all", "100% by eye"),
    ("_ds/…/_ds_bundle.js", "408,000 B / 12,085 lines", "by eye: 1–10 (header), 232–660 (badge, columns-dropdown), 1281–1330 (Tooltip), 3884–4013 (SVEmptyState, Popover), 5043–5198 (chip glyphs), 9899–12085 (work-orders.jsx); script: every line for always/never/must/should sentences; rendered: every component the boards use", "by eye ≈ 2,800 lines; script 100%; remaining sections (ai-agent-icon, design-canvas, filter-bar body, filter-dropdown, global-search, mobile-*, tweaks-panel, index.js, sv-components except Tooltip) read in full by the 14 Oct design drive (md5 unchanged), not re-read by eye in this pass"),
    ("_ds/…/components.css, colors_and_type.css, sv-components.jsx, tokens.js, index.js, theme-toggle.js, lucide-icons.js; top-level lucide-icons.js; support.js", "39,290 + 35,578 + 25,329 + 8,794 + 8,068 + 1,870 + 15,878 + 15,108 + 69,150 B", "script: every line (rule sentences, icon registries); theme-toggle.js and lucide-icons.js by eye", "script 100%; CSS values verified through the render"),
    ("screenshots/ (26 images)", "≈1.9 MB", "all", "100% viewed (7 contact sheets)"),
    ("uploads/ (11 screenshots + 4 photos) and assets/", "≈3.9 MB", "all", "100% viewed (contact sheet); photos identified by name"),
    ("Jira attachments (read-only, downloadJiraIssueAttachment)", "11 files", "all D* design images (D1 tech, D1 board, D2 row hover, D3 toolbars) + staging 02 tech, 02 board, 03 toolbar, 06 row hover, SV-11337 and SV-11338 images", "100% of the design pictures viewed; 5 staging-only pictures and the 45 MB SV-11336 video not downloaded (the build is never a source, Rule 57)"),
    ("Our cases", "258 (cases-text.json) + 8 newer (update-2026-10-14-v52 live snapshot)", "all", "script keyword search + by-eye reading of every candidate (C96925, C97003, C97004, C96935, C368127, C96941, C96942, C96944, C96964, C97009, C96990, C368141, C368161, C581895 …)"),
]


def md_table(head, rows):
    out = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in rows:
        out.append("| " + " | ".join(str(x).replace("|", "/").replace("\n", " ") for x in r) + " |")
    return out


nstates = len(inv); fatal = sum(1 for v in inv.values() if v.get("fatal"))
md = ["# WO Board & Tech View — visual inventory of the design (14 Oct 2026, Rule 126)", "",
      "**Why:** the PO filed 10 design defects (SV-11317–SV-11326) and Ahtasham Amjad 3 more (SV-11336–SV-11338) that our 258 cases would not have caught — we covered the design's words, not its look (L-01). This file is the look-coverage proof for the design export of 14 Oct 2026 (`sources/design-2026-10-14-upload/`, the same design Chris Ward compared: our render matches his D1 screenshots pixel for pixel apart from anti-aliasing).",
      "**Spec:** PRD v52. **Tool:** `build/testing-tools/design_visual_inventory.py` (new, project-agnostic) with `wo-visual-config.json`; classification `build_design_look.py`. Nothing was written to TestRail, Jira, Confluence, Slack or Google; no QA or staging build was opened.", "",
      "## 1 · Result", "",
      f"- **States rendered:** {nstates} ({fatal} failed) — 3 boards × List / Tech View (Compact, Regular, Comfortable) / Board View (Detailed, Compact) × light and dark × 1440 and 1536; 5 more widths (768, 1024, 1280, 1366, 1920); {sum(1 for k in inv if k.startswith('states__'))//2} interaction states × light and dark (+ {sum(1 for k in inv if k.startswith('states1536__'))} at 1536) (menus, tooltips, hovers, chips, Technician chosen, empty / filtered / search / no-technician states, view-only, no financial, pinned, pin limit, collapsed, drags allowed and refused, scrolled, reassign dialog, toast, review frames).",
      f"- **Distinct visual observations:** {len(classified)} — " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()) + f". **Unclassified: {len(uncl)}.**",
      f"- **Design-library always / never / must / should sentences:** {len(lib_rows)} — " + ", ".join(f"{k} {v}" for k, v in lcnt.most_common()) + ". No blanket OUT-OF-SCOPE; each sentence has its own row (section 7).",
      f"- **Images in the package:** {len(img_rows)} — " + ", ".join(f"{k} {v}" for k, v in icnt.most_common()) + ".",
      f"- **Design case proposals:** {len(cases)} (`design-case-proposals.json`), one per screen-and-state group, each with a design picture in `compare/` ({len(copied)} pictures).",
      f"- **PO / design questions:** {len(PQ)} new (not sent) + {len(EXISTING)} existing register questions still unsent + 2 already sent by Ahtasham Amjad on Slack. **Unsent count: {len(PQ) + len(EXISTING)} — must reach 0 before the suite is called complete (Rule 126 point 6).**", "",
      "Classes: COVERED (a case that checks that visible attribute) · CASE-NEEDED (proposal key) · SPEC-CONFLICT (question id) · OUT-OF-SCOPE (the written source is quoted on the row) · DATA · SUPERSEDED (an older copy of the same board or an earlier capture; the newer board wins, Rule 32) · PROBE-ABSENT (the tool looked for an element this state does not show — a tool row, not something on screen) · AUTHORING (library sentences that instruct the people writing design files and have no look of their own). Every row with its basis: `visual-inventory-classified.json`; readable table: `VISUAL-INVENTORY-ROWS-2026-10-14.md`.", "",
      "## 2 · Ticket → case map (Chris Ward's 10, Ahtasham Amjad's 3)", ""]
md += md_table(["Ticket", "By", "What", "Design evidence (14 Oct export, rendered)", "PRD v52", "Inventory class", "Design case proposal", "Existing case"], TICKETS)
md += ["", "**Two ticket claims do not match the design (Rule 110 — tried to break them):** SV-11337 says the design card number is ~15 px, customer 15–16 px weight 600, unit · asset ~13 px, total ~16 px weight 600. The 14 Oct design renders 14 / 14 / 12 / 14 px at weight 500 — exactly the values the ticket reports for the build — and our render matches Chris Ward's own design screenshot of Board View pixel for pixel. SV-11338's avatar part is right (light-grey circle, dark initials) but its \"design name ~16 px\" is 14 px semibold in the design. DC-11 and DC-08 state the design's real values; the QA lead should ask Ahtasham what he measured against (a zoomed 2x capture would explain it) before those parts are treated as defects.", "",
       "## 3 · Beyond the tickets — what a reviewer could still raise", ""]
md += md_table(["Area", "What the design shows", "Question", "Case"], BEYOND)
md += ["", "## 4 · Design case proposals", ""]
md += md_table(["Key", "Title", "Tickets", "Rows", "Automation"], [(c["key"], c["title"], ", ".join(c["tickets"]) or "—", c["inventory_rows"], c["automation"]) for c in cases])
md += ["", "## 5 · PO / design questions", "", "New (in `po-questions.json`, plain words, (a)/(b) options, verbatim PRD quotes):", ""]
md += md_table(["Id", "For", "Question", "Options"], [(i, who, qq, " / ".join(opts)) for i, who, qq, _, opts, _, _, _ in PQ])
md += ["", "Existing register questions still unsent (8 Oct): " + ", ".join(f"{i} ({t})" for i, t in EXISTING) + ".",
       "Already sent (count as sent, 14 Oct 2026, Ahtasham Amjad on Slack): AA-1 Tech View pin (case follows PRD S2-R11 and names the divergence); AA-2 More actions covering the badge (no expected result invented).", "",
       "## 6 · Corrections for the text inventory of 14 Oct", "",
       "- \"Technician\" chip was classified COVERED by C96914 — that case is about filters applying the same way in every display, the List-only ruling stretched to the new views (L-01 point 5). It is now CASE-NEEDED (DC-18, S1-R15).",
       "- Column headings \"Unit #\" / \"Assigned Tech\" were COVERED by C96927 / C96979, which assert the old S5-R4. They are CASE-NEEDED (DC-04) with question PQ-V03.", "",
       "## 7 · Design-library sentences", ""]
md += md_table(["Id", "File:line", "Sentence", "Class", "Case / question", "Basis"], [(r["id"], f'{r["file"]}:{r["line"]}', r["text"][:160], r["class"], r["case"] or "—", r["basis"][:160]) for r in lib_rows])
md += ["", "## 8 · Images in the package", ""]
md += md_table(["File", "Class", "Basis"], [(r["file"], r["class"], r["basis"][:200]) for r in img_rows])
md += ["", "## 9 · Reading coverage (Rule 119)", ""]
md += md_table(["Source", "Size", "Lines / parts", "Coverage"], FILES)
md += ["", "## 10 · How to re-run", "", "```bash", "python3 build/testing-tools/design_visual_inventory.py --design build/wo-board-tech-view/sources/design-2026-10-14-upload \\",
       "  --config build/wo-board-tech-view/design-look-2026-10-14/wo-visual-config.json --out <run dir> --resume \\",
       "  --library build/wo-board-tech-view/sources/design-2026-10-14-upload/_ds build/wo-board-tech-view/sources/design-2026-10-14-upload/lucide-icons.js",
       "python3 -I build/wo-board-tech-view/design-look-2026-10-14/build_design_look.py <run dir> <run dir>/library-rules.json", "```", ""]
(HERE / "VISUAL-INVENTORY-2026-10-14.md").write_text("\n".join(md) + "\n")
rmd = ["# WO Board & Tech View — every visual observation, classified (14 Oct 2026)", "", "Generated by `build_design_look.py` from the run of `design_visual_inventory.py`. One row per distinct observation; 'seen in' counts the states.", ""]
rmd += md_table(["Id", "View", "Category", "Region", "Element", "Attribute", "Value", "Themes · widths · densities · states", "Class", "Case / question", "Basis"],
                [(c["id"], c["view"], c["category"], c["region"], c["element"], c["attribute"], c["value"][:220], f'{",".join(c["themes"])} · {",".join(c["widths"])} · {";".join(c["densities"])[:60]} · {c["state_count"]}', c["class"], c["case"] or "—", (c["basis"] or "")[:200]) for c in classified])
(HERE / "VISUAL-INVENTORY-ROWS-2026-10-14.md").write_text("\n".join(rmd) + "\n")
out["ticket_map"] = [{"ticket": t[0], "reported_by": t[1], "what": t[2], "design_evidence": t[3], "prd": t[4], "inventory_class": t[5], "case_proposals": t[6], "existing_case": t[7]} for t in TICKETS]
out["existing_case_additions"] = [{"case": "C581895", "link": "https://shopview.testrail.io/index.php?/cases/view/581895", "ticket": "SV-11336",
    "proposal": "Add one step after step 11: in Tech View turn on Assigned Techs (if off) and hover each avatar in {Work-order-1}'s row; expected: each shows the staff record name written down in step 2 (S5-R11b, S7-R6). The case already covers the group header, the column header and the card."}]
out["unsent_question_count"] = len(PQ) + len(EXISTING)
(HERE / "design-case-proposals.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
