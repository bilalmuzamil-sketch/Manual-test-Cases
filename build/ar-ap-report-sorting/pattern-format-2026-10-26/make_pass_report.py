#!/usr/bin/env python3
"""Pattern pass (26 Oct 2026, Rule 117 fourteenth amendment): compare every case before and after, and write PASS-REPORT.md.
Before = proposals-before.json (authoring/proposals.json as it stood at the start of this pass, the scenario layout; byte-identical
to the build of that moment). After = authoring/proposals.json from build.py. Checks, per case:
 (1) the part below the blank paragraph (build-difference note, exact quotes with From: lines, References from Design, AUTOMATION
     line) is byte-identical to what followed the old results list; the quotes block, the design block and the AUTOMATION line are
     also compared one by one; every other field except title, preconditions, steps and expected is unchanged;
 (2) no fact lost: every amount, number, date, quoted label and term name in the old preconditions (without their "For example:"
     lines and placeholders), steps and results is still in the new preconditions, steps or results.
python3 make_pass_report.py   (exit 1 on any failed check)"""
import json, os, re, html, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/authoring")
import pattern as PT, importlib, difflib
import ar_lib as L
for _m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(_m)
CASE = {c["key"]: c for c in L.CASES}
def eh(t): return html.escape(t, quote=False)
# preconditions as they stood after the first pattern pass and before the relevance and independence pass (same day)
BEFORE_REL = {}
_k = None
for _l in open(f"{H}/pattern-before-relevance.txt").read().split("\n"):
    if _l.startswith("### "): _k = _l[4:].split(" |")[0]; BEFORE_REL[_k] = []
    elif _l.startswith("  P: "): BEFORE_REL[_k].append(_l[5:])
B = json.load(open(f"{H}/proposals-before.json")); A = json.load(open(f"{P}/authoring/proposals.json"))
U = lambda s: html.unescape(re.sub(r"<[^>]+>", "", s))
def li(h): return [U(x) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def old_pre(pc):
    body = pc.split("<p><strong>Preconditions</strong></p><ul>", 1)[1].rsplit("</ul>", 1)[0]
    out = []
    for x in body.split("<li>")[1:]:
        x = x.replace("</li>", "")
        main, _, ex = x.partition("<br>")
        out.append((U(main), U(ex)))
    return out
def old_res(ex): return li(ex.split("</ul>", 1)[0])
def old_tail(ex): return ex.split("</ul>", 1)[1]
def new_blocks(ex):
    head, _, tail = ex.partition("<p></p>")
    steps = re.findall(r"<p>Step (\d+):</p><ul>(.*?)</ul>", head, re.S)
    return [(int(n), li(b)) for n, b in steps], tail
def parts(tail):
    q = tail[tail.index("<p><strong>Exact quotes"):tail.index("<p></p><p><strong>References from Design")]
    d = tail[tail.index("<p></p><p><strong>References from Design"):tail.rindex("<p>AUTOMATION: ")]
    a = tail[tail.rindex("<p>AUTOMATION: "):]
    return q, d, a
NUM = re.compile(r"\$-?[\d,]+\.\d\d|\b\d[\d,]*(?:\.\d+)?\b")
DATE = re.compile(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}\b|\b\d{1,2}/\d{1,2}/\d{4}\b|\b\d{4}-\d\d-\d\d\b")
QUOTE = re.compile(r'"([^"]+)"')
TERM = re.compile(r"\b(?:Net \d+|COD|Due on receipt)\b")
def facts(items):
    """Facts per item (one precondition, step or result), so a quote mark is paired inside its own sentence; a quoted text longer
    than 80 characters is a sentence, not a label, and is checked through its numbers and dates instead."""
    out = set()
    for text in items:
        t = PT.plain(text)
        out |= set(NUM.findall(t)) | set(DATE.findall(t)) | {'"' + q + '"' for q in QUOTE.findall(t) if len(q) <= 80} | set(TERM.findall(t))
    return out
def norm(s): return re.sub(r"\s+", " ", s)
probs, rows, lost_all, kept_examples, scen_lost, inline_eg, note_changed, removed_pre, rel_changes = [], [], {}, {}, {}, {}, [], {}, {}
same_title = 0
for k in A:
    b, a = B[k]["fields"], A[k]["fields"]
    for f in sorted(set(b) | set(a)):
        if f in ("title", "custom_preconds", "custom_steps", "custom_expected"): continue
        if b.get(f) != a.get(f): probs.append(f"{k}: field {f} changed")
    if B[k]["title"] == A[k]["title"]: same_title += 1
    ot = old_tail(b["custom_expected"]); blocks, nt = new_blocks(a["custom_expected"])
    if not a["custom_expected"].startswith("<p><strong>Expected Result</strong></p><p>Step 1:</p>"): probs.append(f"{k}: new expected does not open with Expected Result / Step 1:")
    note = CASE[k]["note"]
    ot_expected = ot.replace(f"<p>{eh(note)}</p>", f"<p>{eh(PT.plain(note))}</p>", 1) if note else ot
    if ot_expected != ot: note_changed.append(k)
    if nt != ot_expected: probs.append(f"{k}: the part below the blank line is not byte-identical (apart from the note's plain names)")
    try:
        for name, x, y in zip(("quotes block", "design block", "AUTOMATION line"), parts(ot), parts(nt)):
            if x != y: probs.append(f"{k}: {name} differs")
    except ValueError: probs.append(f"{k}: quotes / design / AUTOMATION blocks not found")
    op = old_pre(b["custom_preconds"]); os_ = li(b["custom_steps"]); orr = old_res(b["custom_expected"])
    np_ = li(a["custom_preconds"]); ns = li(a["custom_steps"])
    if [n for n, _ in blocks] != list(range(1, len(ns) + 1)): probs.append(f"{k}: Step N: headings do not match the steps")
    nr = [x for _, r in blocks for x in r]
    old_items = [m for m, _ in op if not m.startswith("Scenario: ")] + os_ + [re.sub(r"^Step \d+: ", "", x) for x in orr]
    new_text = norm(" ".join(np_ + ns + nr))
    lost = sorted(x for x in facts(old_items) if norm(x) not in new_text and norm(x.replace('"', "")) not in new_text)
    # a fact found only in a precondition the relevance pass removed as unneeded is listed, not failed
    from_sr = facts(os_ + [re.sub(r"^Step \\d+: ", "", x) for x in orr])
    pre_only = [x for x in lost if x not in from_sr]
    if pre_only: removed_pre[k] = pre_only
    lost = [x for x in lost if x in from_sr]
    if lost: lost_all[k] = lost
    b4, now = BEFORE_REL[k], np_
    if b4 != now:
        gone = [x for x in b4 if x not in now]; new_ = [x for x in now if x not in b4]
        pairs = []
        for g in gone:
            best = max(new_, key=lambda n: difflib.SequenceMatcher(None, g, n).ratio(), default=None)
            if best and difflib.SequenceMatcher(None, g, best).ratio() >= 0.6: pairs.append((g, best)); new_.remove(best)
        rel_changes[k] = (pairs, [g for g in gone if g not in [a for a, _ in pairs]], new_)
    ex_vals = set()
    for _, ex in op:
        if ex: ex_vals |= {v.strip() for v in re.findall(r"ZZAUTOTEST \S+ ([^,;.]+?)(?:,| and |;|\.|$)", ex)}
    kept = sorted(v for v in ex_vals if v and f'"{v}"' in new_text)
    # example amounts and day counts that became plain facts (in the new text, in an old example line, not in the old case text)
    exf = {x for x in facts([ex for _, ex in op if ex]) if re.match(r"\$|\d", x)} - facts(old_items)
    kept += sorted(x for x in exf if re.search(r"(?<![\d,.$])" + re.escape(x) + r"(?![\d,])", new_text) and (x.startswith("$") or re.search(re.escape(x) + r" days", new_text)))
    scen = [m[len("Scenario: "):] for m, _ in op if m.startswith("Scenario: ")]
    sl = sorted(x for x in facts(scen) if norm(x) not in new_text)
    if sl: scen_lost[k] = sl
    inline_eg[k] = sum(1 for x in nr if re.search(r"\(for example", x))
    if kept: kept_examples[k] = kept
    rows.append((k, B[k]["title"], A[k]["title"], op, np_, os_, ns, orr, blocks))
for k, l in lost_all.items(): probs.append(f"{k}: fact lost: {l}")
R = []; w = R.append
w("# A/R and A/P Report Sorting: every case in the QA lead's pattern (26 Oct 2026)")
w("")
w("QA lead, 26 Oct 2026: his own pattern for a test case, *\"Yes, permanent, all suites\"* (Rule 117 fourteenth amendment; lessons L-06 to L-10). "
  "Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed. Generated by `pattern-format-2026-10-26/make_pass_report.py`.")
w("")
w("## Result")
w(f"- Cases reformatted: {len(A)} of {len(A)} (titles unchanged on {same_title}; they were already plain, at most 80 characters, design titles keep \"Design: \").")
w("- Preconditions: plain bullets in setup order (\"Sign in as ...\", \"Have ...\", \"Make sure ...\", \"Use a desktop browser window ...\", \"Open ...\", \"Leave the report with ...\"); "
  "no \"Scenario:\" line, no {placeholder}, no \"For example:\" line, no setup-file link, no who-to-ask; records named plainly (customer A, vendor B, location A, invoice A, date A) and the same names used in the steps and results; the Blocked line last, reworded to the brief's \"If you cannot set up any of the above, mark this test Blocked: \\\"setup not done\\\".\"")
w("- Steps: the same actions, in the same order, with the placeholders replaced by the plain names.")
w("- Expected Result: \"Expected Result\", then \"Step N:\" and one bullet per fact for every step, then one blank paragraph (`<p></p>`).")
w("- Below the blank paragraph: byte-identical to before (script check below).")
w(f"- How: `authoring/pattern.py` converts each case model mechanically; every converted case was then read in full and {len(__import__('pattern_layout').LAYOUT)} cases were corrected by hand in `authoring/pattern_layout.py` (example values that results depend on written as plain facts, sentences that held several facts split, \"date A\" style values defined).")
w("")
w("## Script checks")
w(f"- Byte identity of the part below the blank line (note, quotes block with its From: lines, References from Design, AUTOMATION line), and of every other field (refs, type, priority, template, automation fields): "
  + ("PASS for all " + str(len(A)) + " cases." if not [p for p in probs if "fact lost" not in p] else "FAIL, see problems."))
w(f"- No fact lost (every amount, number, date, quoted label and term name of the old preconditions without their \"For example:\" lines, steps and results is in the new preconditions, steps or results): "
  + ("PASS for all " + str(len(A)) + " cases." if not lost_all else f"FAIL in {len(lost_all)} cases, see problems."))
w("- Example values kept as plain facts because a result depends on them (hand list, `authoring/pattern_layout.py`): the names in S1-01 to S1-04 and S1-07, "
  "bill A due 10 days ago and bill B due 20 days ago in S2-23, the five invoice amounts in S5-38, the eight invoice or bill amounts in DATA-16 and DATA-17. "
  f"Script check, example values now in the case that were not in its old text: {sum(len(v) for v in kept_examples.values())} values in {len(kept_examples)} cases: "
  + "; ".join(f"{k}: {', '.join(v)}" for k, v in kept_examples.items()) + ". Every other \"For example:\" value was only an example (ZZAUTOTEST names, example locations, example document numbers, example organizations) and stays in the setup file.")
w("- The \"Scenario:\" line (thirteenth amendment) is removed, as the brief says. Facts of a Scenario line not found word for word in the new case: "
  + ("none." if not scen_lost else "; ".join(f"{k}: {', '.join(v)}" for k, v in scen_lost.items()) + " (each read by hand: the Scenario line said \"narrower than 1440 px\" / \"narrower than 1024 px\"; the case keeps it in its title and sets the exact width, 1280 px or 900 px, in its preconditions)."))
w("- Kept on purpose: three build-difference notes below the blank line (S1-16, S3-17, S5-18) name records by their old placeholders ({Customer-B}, {Location-C}, {Location-B}); they are kept byte for byte as the brief requires.")
w(f"- Kept on purpose: {sum(1 for v in inline_eg.values() if v)} cases keep an inline \"(for example ...)\" inside a result, unchanged from before, showing a format or a typical count (the As of chip date format, a CSV date format, a note-the-count hint, a credit's minus sign, a location name wrapping): "
  + ", ".join(k for k, v in inline_eg.items() if v) + ". They are not \"For example:\" lines and carry no record value.")
w("")
w("## Relevance and independence pass (26 Oct 2026, coordinator notes)")
w("QA lead: preconditions *\"must make sense and relate to the steps and expected results below\"*; *\"if one test case fails that does not block the other test case\"*. "
  "Gate in `authoring/build.py` (permanent): every record a precondition names appears in the steps or results, or its bullet gives a \"so ...\" reason; no case key or C-id in the tester's words; "
  "a step that changes a record, or a result that adds amounts up, needs its records \"created for this test\".")
w(f"- Notes below the blank line changed only in their placeholder words (now the plain names the case uses): {', '.join(note_changed) or 'none'}. Quotes, From: lines, design block and AUTOMATION line byte-identical.")
w(f"- Facts that left with a precondition removed as unneeded (not in any step or result): " + ("; ".join(f"{k}: {', '.join(v)}" for k, v in removed_pre.items()) or "none") + ".")
w(f"- Cases whose preconditions changed in this pass: {len(rel_changes)}. One line each (R = removed, A = added, W = reworded):")
for k, (pairs, gone, new_) in rel_changes.items():
    w(f"  - {k}: " + "; ".join([f"R \"{g}\"" for g in gone] + [f"A \"{n}\"" for n in new_] + [f"W \"{a}\" → \"{b}\"" for a, b in pairs]))
w("")
w("## Problems")
w("- none" if not probs else "")
for p in probs: w(f"- {p}")
w("")
w("## Per case, old vs new")
for k, ot, nt, op, np_, os_, ns, orr, blocks in rows:
    w(f"### {k}")
    w(f"- Title: {'unchanged: ' + nt if ot == nt else 'OLD ' + ot + ' / NEW ' + nt}")
    w("- Old preconditions:")
    for m, ex in op: w(f"  - {m}" + (f" [{ex}]" if ex else ""))
    w("- New preconditions:")
    for x in np_: w(f"  - {x}")
    if os_ == ns: w("- Steps: unchanged wording")
    else:
        w("- Old steps: " + " | ".join(f"{i}. {x}" for i, x in enumerate(os_, 1)))
    w("- New steps: " + " | ".join(f"{i}. {x}" for i, x in enumerate(ns, 1)))
    w("- Old results: " + " | ".join(orr))
    w("- New results:")
    for n, r in blocks: w(f"  - Step {n}: " + " / ".join(r))
    w("")
open(f"{H}/PASS-REPORT.md", "w").write("\n".join(R) + "\n")
print("cases", len(A), "| problems", len(probs), "| facts lost in", len(lost_all), "cases | example values kept as facts", sum(len(v) for v in kept_examples.values()))
for p in probs[:60]: print("PROBLEM", p)
sys.exit(1 if probs else 0)
