#!/usr/bin/env python3
"""Round 2b (12 Nov 2026): turns the design worker's drafts (design-2026-11-12/tools/cases_data.py, the data DESIGN-CASE-PLAN.md is
rendered from: DC-nn look cases and DV-nn held design-version cases) into cases_design.py (keys D-01.., section DESIGN, "Design — how it
looks") and their References from Design blocks into design_refs_design.json. The drafts' words are kept; the only changes are in CHANGES
(written to design_changes.json and REPORT.md):
  1. "AUTOMATION: READY" -> the Rule 69 marker (no build exists yet; a build check lifts it).
  2. DV markers name the merged PO question: "the design differs from the PRD, waiting on the PO (question n)". Held design-version
     cases stay in the DESIGN section (QA lead: waiting design cases stay in "Design — how it looks").
  3. DC-50's hold (asset Invoices tab "No Charge" or "$0.00") is lifted: the point was settled in round 2a (PRD S3-R6/S9-R10 and the
     tech plan, TP-174, both say "No Charge"; the verify ticket's "$0.00" is loose wording) and the question was dropped.
  4. PRD quotes: a code is quoted whole; (code, opening words) quotes the whole sentence of that requirement, copied from the saved PRD
     (the same rule as the design worker's make_case_plan.py); "§8-NN" (User Feedback row NN) -> the named item UFS-NN.
  4b. "<number>"-style placeholders -> "[number]" (the library's one placeholder style) with its square-bracket note (common.NAME_NOTE).
  5. Precondition "Open the attached picture(s) ... at 100% zoom beside the screen." added, as in the plan.
  6. Notes (in the References block only): design question numbers -> merged sheet numbers; case ids -> plain words.
  7. Any further per-case edit made for a gate is in EDITS, applied here, never by hand in cases_design.py.
python3 make_cases_design.py   (then python3 build.py)"""
import json, os, re, runpy, sys
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); DD = f"{P}/design-2026-11-12"
sys.path.insert(0, D)
DRAFTS = runpy.run_path(f"{DD}/tools/cases_data.py")["CASES"]
FIGS = json.load(open(f"{DD}/DESIGN-FIGURES-2026-11-12.json"))["list"]
BYFILE = {f["file"].replace(".dc.html", ""): f for f in FIGS}
CANVAS = ('Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794507512-2fc4 '
          '(its boards byte-identical to version 1794484794-2031, read and rendered 12 Nov 2026)')
# design question (NEW-QUESTIONS.py rows 8-13) -> slug on the merged sheet (po_questions.py); 13 (reviewer remarks, IWO-D50) is a ruling
DQ = {8: "category-helper", 9: "locked-note", 10: "reopen-message", 11: "report-empty-cell", 12: "report-wrapping"}
DV_Q = {"DV-01": "category-helper", "DV-02": "internal-estimate-stamp", "DV-03": "locked-note", "DV-04": "reopen-message",
        "DV-05": "report-empty-cell", "DV-06": "report-wrapping"}
NOTE_FIX = {   # notes that name a case id or the dropped question 4 (plain words instead)
 "DC-08": [("question 8, held case DV-01.", "settled by PRD v1.1 S1-R14 (Milos Vasic's answer 12): the PRD's helper text is the expectation.")],
 "DC-50": [("The Total balance cell waits on question 4 of the sheet (PRD \"No Charge\" vs the Jira check-list \"$0.00\"); the design draws \"No Charge\".",
            "The Total balance cell shows \"No Charge\" as the PRD says and the design draws (the Jira check-list's \"$0.00\" is settled by the tech plan, which builds \"No Charge\"); this case is not held.")],
 "DC-74": [("(IWO-D44, question 11) and wrapping numbers (IWO-D45, question 12) are held as DV-05 and DV-06.",
            "(IWO-D44) and wrapping numbers (IWO-D45) are settled by PRD v1.1 S9-R2 (answers 15 and 16): a dash in an empty cell, and numbers and dates on one line at 1440 and 1536 pixels.")],
 "DV-01": [("question 8:", "question {category-helper}:")],
 "DV-02": [("question 3 of the sheet (already asked by the PRD case worker).", "question {internal-estimate-stamp} of the sheet.")],
 "DV-03": [("question 9.", "question {locked-note}.")], "DV-04": [("question 10.", "question {reopen-message}.")],
 "DV-05": [("question 11.", "question {report-empty-cell}.")], "DV-06": [("question 12.", "question {report-wrapping}.")],
}
# ---- round 3 (12 Nov 2026): PRD v1.1 and Milos Vasic's answers 1-16 (po-answers-2026-11-12/). No board changed (DESIGN-CHANGE-2026-11-12.md).
RETIRE = {"DV-01": "answer 12: the PRD's helper texts are the expectation (D-06, D-08, D-09, D-13); QA lead: delete",
          "DV-03": "answer 13: no other note is shown (S2-R9 v1.1); the check moves to D-49; QA lead: delete",
          "DV-05": "answer 15: a dash in every empty cell (S9-R2 v1.1); the check is in D-74; QA lead: delete"}
V11 = {   # draft id -> round 3 changes: add (step -> bullets), set (step -> bullets, replacing), q (quotes added), note (replaces the diff note), release
 "DC-06": dict(add={1: ["Under the Internal categories tab a hint reads \"Set on the customer, or on the asset for one unit. An internal work order takes it when it is created.\""]},
               note_add="Difference: the design's tab hint differs from PRD v1.1 S1-R13's hint: register IWO-D09, settled by PRD v1.1 (Milos Vasic's answer 12); the PRD text is the expectation."),
 "DC-08": dict(add={1: ["The window shows the helper \"It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work Orders report.\""]}),
 "DC-09": dict(add={1: ["The window shows the helper \"It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work Orders report.\""]},
               note_add="Difference: the design's Name helper differs from PRD v1.1 S1-R14's helper: register IWO-D09, settled by PRD v1.1 (answer 12)."),
 "DC-13": dict(add={2: ["The select \"Default internal category\" carries the helper \"Used by every new internal work order for this customer unless the asset has its own category.\""]},
               note_add="Difference: the design's helper for the select (\"Preselected on every new work order…\") differs from PRD v1.1 S1-R7: register IWO-D09, settled by PRD v1.1 (answer 12)."),
 "DC-49": dict(add={1: ["No other note shows on the closed work order (no \"This work order is locked\" note)."]}, q=[("S2-R9", "No other note is shown")],
               note_add="Difference: the design draws a \"This work order is locked\" note on a closed internal work order: register IWO-D29, settled by PRD v1.1 S2-R9 (answer 13): no other note is shown."),
 "DC-74": dict(add={1: ["Every cell with no value shows a dash \"—\" (for example Original work order and Original technician on the internal work order's row).",
                        "Work order numbers and dates each stay on one line."],
                    2: ["Work order numbers and dates still stay on one line."]}),
 "DC-75": dict(add={2: ["The \"Unassigned\" row shows a dash \"—\" as its Comeback rate (it has no completed lines), and every cell with no value shows a dash."]},
               note_add="Difference: the design leaves Completed lines and Comeback rate empty on the Unassigned row: register IWO-D56, settled by PRD v1.1 S9-R2 (answers 11 and 15): a dash."),
 "DV-02": dict(set={2: ["The estimate carries the INTERNAL stamp and shows no prices or totals."]}, release=True,
               note="Difference: register IWO-D19, settled by PRD v1.1 S2-R4 (Milos Vasic's answer 3): the INTERNAL stamp, as the design draws. The design's \"Category: General Internal\" line under it is not part of the expectation: S2-R4 names that line for a no-charge work order only."),
 "DV-04": dict(set={1: ["A green message \"Work order [number] reopened\" shows."]}, q=["UFS-27"], release=True,
               note="Difference: none left: register IWO-D31 is closed, PRD v1.1 S4-R3 and its message table (answer 14) give the message the design draws."),
 "DV-06": dict(set={1: ["Work order numbers and dates in the table stay on one line; no number is broken (the design breaks them, \"S2-\" over \"34918\")."]}, release=True,
               note="Difference: register IWO-D45, settled by PRD v1.1 S9-R2 (answer 16): numbers and dates stay on one line at 1440 and 1536 pixels; the design still breaks them."),
}
V11_LOG = {}
QFIX = {}     # round 4 (13 Nov 2026): (draft, code, opening words in v1.1) -> opening words in PRD v1.3, or None to drop that quote
QMISS = []
EDITS = {   # draft id -> [(field, old, new)] gate fixes only
 "DC-72": [("results", "The invoice is created as today.", "The invoice is created and shows on the Finance tab.")],   # round 2c: no unseen baseline
}
CODEMAP = {"S3-EH": "EH-S3-1"}   # the design worker's whole-story Error Handling piece -> the one bullet the case quotes
OVERRIDE = {   # draft id -> fields replaced (each listed in CHANGES with its reason)
 "DC-44": dict(steps=["Open the internal work order.", "Click Close Work Order.", "Click Close Work Order in the window."],
               results=[["The work order opens."], ["The Close window opens."],
                        ["An alert toast \"Could not close the work order. Try again.\" shows and stays until it is dismissed; the work order is not Closed."]],
               marker="NOMAN:Close has to fail, which only a developer can make happen",
               why="the draft's 'turn the browser offline' step dropped and the case marked as one a tester cannot set up, the same ruling as the "
                   "PRD case for a failed Close (round 1): a dropped network also stops the window loading, so the failure the PRD names cannot be "
                   "made by hand; kept out of TestRail with the other cases a tester cannot set up"),
}
CHANGES = []
FRESH = re.compile(r"^Have (a|an|two|one) (new|closed|invoiced|billable|internal|no-charge)\b.*(work order|part sale|invoice)")   # Rule 137


def v10_to_v13(x):
    """PRD v1.0 message row number -> PRD v1.3 key: v1.3 replaced row 16 (Close confirmation) by rows 16-18 and v1.1 inserted row 25."""
    n = int(x[3:])
    return f"UFS-{n if n <= 15 else 18 if n == 16 else n + 2 if n <= 24 else n + 3:02d}"


def sentence(text, start):
    """The whole sentence of `text` that starts with `start` (a full stop inside quotes does not end it); design worker's rule."""
    i = text.find(start)
    if i < 0: return None
    inq = False; j = i
    while j < len(text):
        c = text[j]
        if c == '"': inq = not inq
        if c == '.' and not inq and (j + 1 == len(text) or text[j + 1] == ' '): return text[i:j + 1]
        if c == '"' and not inq and j > 0 and text[j - 1] == '.' and (j + 1 == len(text) or (text[j + 1] == ' ' and j + 2 < len(text) and text[j + 2].isupper())):
            return text[i:j + 1]
        j += 1
    return text[i:]


def main():
    import iwo_lib as L
    from po_questions import QN
    from common import NAME_NOTE
    qfmt = {k: str(v) for k, v in QN.items()}
    cases, refs, srcmap = [], {}, {}
    for i, c in enumerate(DRAFTS, 1):
        did = c["id"]; key = f"D-{i:02d}"; srcmap[did] = key
        if did in RETIRE: V11_LOG[key] = [f"retired: {RETIRE[did]}"]; continue
        v = V11.get(did, {})
        c = dict(c)
        for field, old, new in EDITS.get(did, []):
            s = json.dumps(c[field], ensure_ascii=False)
            if json.dumps(old, ensure_ascii=False)[1:-1] not in s: raise SystemExit(f"{did}: edit text not found in {field}: {old[:60]}")
            c[field] = json.loads(s.replace(json.dumps(old, ensure_ascii=False)[1:-1], json.dumps(new, ensure_ascii=False)[1:-1]))
            CHANGES.append(f"{did} {field}: {old[:50]!r} -> {new[:50]!r}")
        ov = OVERRIDE.get(did, {})
        for f in ("steps", "results"):
            if f in ov: c[f] = ov[f]
        if ov: CHANGES.append(f"{did}: {ov['why']}")
        figs = [BYFILE[b] for b in c["boards"]]
        pics = [f["picture"].split("/")[-1] for f in figs]
        pre = list(c["pre"]) + ["Open the attached picture%s %s at 100%% zoom beside the screen." % ("s" if len(pics) > 1 else "", ", ".join(pics))]
        q = []
        for x in c["quotes"]:
            if isinstance(x, tuple):
                code, start = x
                start = QFIX.get((did, code, start), start)
                if start is None: continue
                s = sentence(L.CODE[code], start)
                if not s: QMISS.append(f"{did}: no sentence of {code} starts {start!r}"); continue
                q.append((code, s.strip()))
            elif x.startswith("§8-"): q.append(v10_to_v13(x))   # the drafts number message rows as PRD v1.0 does
            elif x in CODEMAP: q.append(CODEMAP[x])
            else: q.append(x)
        for x in v.get("q", []):
            if isinstance(x, tuple):
                s2 = sentence(L.CODE[x[0]], x[1]).strip(); q.append((x[0], s2))
            else: q.append(v10_to_v13(x) if x.startswith("§8-") else x)
        if ov.get("marker", "").startswith("NOMAN:"):
            marker = L.NOMAN(ov["marker"][6:])
        elif did.startswith("DV") and v.get("release"):
            marker = None
        elif did.startswith("DV"):
            marker = f"AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question {QN[DV_Q[did]]})"
        else:
            if c.get("hold"): CHANGES.append(f"{did}: hold {c['hold']!r} lifted (settled in round 2a, question dropped)")
            marker = None
        notes = []
        if c.get("diff"):
            d = c["diff"]
            for old, new in NOTE_FIX.get(did, []):
                if old not in d: raise SystemExit(f"{did}: note text not found: {old[:60]}")
                d = d.replace(old, re.sub(r"\{([a-z-]+)\}", lambda m: qfmt[m.group(1)], new))
            if re.search(r"\bD[CV]-\d", d): raise SystemExit(f"{did}: a case id left in the note: {d}")
            notes.append("Difference: " + d)
        if "note" in v: notes = [v["note"]]
        if "note_add" in v: notes.append(v["note_add"])
        if did.startswith("DV") and not v.get("release"):
            notes.append("Held design version (Rule 130): not run and not added to the run until the PO answers; released or removed that day.")
        pages = []
        for f in figs:
            if f["page_name"] not in pages: pages.append(f["page_name"])
        head = "%s: page%s %s, board%s %s." % (CANVAS, "s" if len(pages) > 1 else "", " / ".join('"%s"' % p for p in pages),
                                               "s" if len(figs) > 1 else "", ", ".join('"%s" (%s)' % (f["board_title"], f["page_name"]) for f in figs))
        conv = lambda t: re.sub(r"<([a-z][a-zA-Z' ]*)>", r"[\1]", t)
        steps = [conv(x) for x in c["steps"]]; res = [[conv(x) for x in r] for r in c["results"]]
        for st, b in v.get("set", {}).items(): res[st - 1] = list(b)
        for st, b in v.get("add", {}).items(): res[st - 1] = res[st - 1] + list(b)
        if v: V11_LOG[key] = [w for w in (
            [f"step {st}: result rewritten: {b[0][:80]!r}" for st, b in v.get("set", {}).items()]
            + [f"step {st}: result added from PRD v1.1: {x[:80]!r}" for st, b in v.get("add", {}).items() for x in b]
            + [f"quote added: {x if isinstance(x, str) else x[0]}" for x in v.get("q", [])]
            + (["released from the PO hold (answer given, PRD v1.1)"] if v.get("release") else [])
            + (["References from Design note rewritten"] if "note" in v or "note_add" in v else []))]
        note = NAME_NOTE if re.search(r"\[[a-z][a-zA-Z' ]*\]", " ".join(steps + sum(res, []))) else ""
        fresh = lambda x: (x[:-1] + ", made for this test." if FRESH.match(x) and "for this test" not in x else x)
        cases.append(dict(key=key, src=did, title=conv(c["title"]), pre=[fresh(conv(x)) for x in pre], steps=steps, res=res, q=q,
                          marker=marker, note=note, stories=list(c["stories"]), boards=list(c["boards"])))
        refs[key] = {"pages": head, "pictures": pics, "words": list(c.get("words") or []), "notes": notes, "boards": list(c["boards"]), "src": did}
    if QMISS: raise SystemExit("quotes not found in PRD v1.3:\n  " + "\n  ".join(QMISS))
    out = ['"""Design — how it looks (Rule 126): one case per design worker draft (look cases DC-nn, then the held design-version cases',
           'DV-nn, Rule 130 item 5), keys D-01.. in draft order. GENERATED by make_cases_design.py from design-2026-11-12/tools/cases_data.py',
           '(the data of DESIGN-CASE-PLAN.md); edit the generator (EDITS), never this file. References from Design: design_refs_design.json."""',
           "from iwo_lib import C", "", 'S = "DESIGN"']
    for c in cases:
        out.append(f"# {c['src']}")
        out.append(f"C({c['key']!r}, S, {c['title']!r},\n  {c['pre']!r},\n  {c['steps']!r},\n  {c['res']!r},\n  {c['q']!r}"
                   + (f",\n  marker={c['marker']!r}" if c["marker"] else "") + (f",\n  note={c['note']!r}" if c["note"] else "") + f",\n  stories={c['stories']!r})")
    open(f"{D}/cases_design.py", "w").write("\n".join(out) + "\n")
    json.dump(refs, open(f"{D}/design_refs_design.json", "w"), indent=1, ensure_ascii=False)
    ch = ["all READY markers -> the Rule 69 marker (no build yet)",
          "DV markers name the merged questions: " + ", ".join(f"{k} -> {QN[v]}" for k, v in DV_Q.items()),
          "quotes: (code, opening words) -> that requirement's whole sentence, verbatim; §8-NN -> UFS-NN",
          "precondition 'Open the attached picture(s) ... at 100% zoom beside the screen.' added (as in the plan)",
          "'<number>' placeholders -> '[number]' with the square-bracket note",
          "Rule 137: a 'Have a new / closed / invoiced ... work order' bullet ends ', made for this test.' (a record the case changes is fresh)",
          "notes: design question numbers -> merged numbers; case ids -> plain words"] + CHANGES
    json.dump({"map": srcmap, "changes": ch, "v11": V11_LOG, "retired": {srcmap[k]: w for k, w in RETIRE.items()}}, open(f"{D}/design_changes.json", "w"), indent=1, ensure_ascii=False)
    print("cases_design.py", len(cases), "| DC", sum(c["src"].startswith("DC") for c in cases), "| DV", sum(c["src"].startswith("DV") for c in cases))
    print(*ch, sep="\n  ")


if __name__ == "__main__":
    main()
