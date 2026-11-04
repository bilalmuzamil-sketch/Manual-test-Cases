"""Builds proposals.json for the 4 Nov 2026 named-set updates from the LIVE before-copies in before/ (taken with get_case on
4 Nov 2026). No TestRail call here. Writes proposals.json plus one readiness file per suite for tester_readiness_check --also.

TASK A  A/R and A/P Report Sorting: Chris Ward's answer 17 (ANSWER-17-Chris-Ward.md) names the four tickets; all four were read in Jira
        on 4 Nov 2026 (Bug, In Progress, parent SV-11315, filed by Chris Ward 3 Nov 2026), so each marker is backed (Rule 61, 11 Aug
        amendment). In each case the informal "Where the build is expected to differ: ... No ticket number is known yet ... mark this
        test Failed." paragraph (the deviation note) is replaced by the Rule 61 block, in the form the What/Why suite uses live
        (C154711), and the AUTOMATION line becomes AUTOMATION: READY - EXPECT FAIL (SV-xxxxx). Nothing else changes.
TASK B  What/Why: C154708 (S1-02) released on Doc answer 16, rewritten top to bottom (Rule 134) against PRD v17 (live 4 Nov 2026,
        S1 unchanged since v16/v15) and answer 16.
"""
import json, re, os, html
HERE = os.path.dirname(os.path.abspath(__file__))
B = lambda i: json.load(open(os.path.join(HERE, "before", f"C{i}.json")))
J = "https://shopview.atlassian.net/browse/"

SYM = {
    715282: ("SV-12138", "in step 3, invoice B and invoice C, which have the same date, come out in the order they were invoiced that day, so "
             "invoice C comes before invoice B, instead of in invoice number order"),
    715283: ("SV-12138", "in step 3, bill B and bill C, which have the same date, come out in the order they were entered that day, so bill C "
             "comes before bill B, instead of in bill number order"),
    715416: ("SV-12139", 'in step 1, the right-hand button of the "Switch location?" dialog reads "Switch Location" with a capital L instead of '
             '"Switch location"'),
    715417: ("SV-12139", 'in step 1, the right-hand button of the "Switch location?" dialog reads "Switch Location" with a capital L instead of '
             '"Switch location"'),
    715519: ("SV-12139", 'in step 1, the right-hand button of the "Switch location?" dialog reads "Switch Location" with a capital L instead of '
             '"Switch location"'),
    715520: ("SV-12139", 'in step 1, the right-hand button of the "Switch location?" dialog reads "Switch Location" with a capital L instead of '
             '"Switch location"'),
    715546: ("SV-12139", 'in step 1, the right-hand button of the "Switch location?" dialog reads "Switch Location" with a capital L instead of '
             '"Switch location"'),
    715573: ("SV-12140", 'customer B (whose name goes on with "-") is listed first, then customer A and customer D (the other names that go on '
             'with a punctuation mark), then customer C: the names going on with a punctuation mark are put before the one going on with a '
             'digit, instead of plain character order'),
    715343: ("SV-12141", "in steps 4 and 6, the Locations line names location C first, then location A: the order you ticked them, instead of "
             "the Location menu's A to Z order"),
}


def esc(s): return html.escape(s, quote=False)


def ef_block(tk, sym):
    return (f"<p>What you should see today: {esc(sym)}. This is a known problem and it is already reported — see {J}{tk} "
            f"(filed by Chris Ward on 3 Nov 2026).</p>"
            "<p>· If you see exactly that, mark this test FAILED and do not raise anything new.</p>"
            "<p>· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.</p>"
            "<p>· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.</p>")


OLD_MARK = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
P, problems = {}, []
for i, (tk, sym) in SYM.items():
    c = B(i); e = c["custom_expected"]
    dev = re.findall(r"<p>Where the build is expected to differ:(?:(?!</p>).)*</p>", e)
    if len(dev) != 1 or "ticket number is known yet" not in dev[0].lower(): problems.append(f"C{i}: deviation note not found once"); continue
    if e.count("AUTOMATION:") != 1 or e.count(OLD_MARK) != 1: problems.append(f"C{i}: marker not the expected one"); continue
    if e.find(dev[0]) > e.find("<p><strong>Exact quotes"): problems.append(f"C{i}: deviation note below the quotes"); continue
    e2 = e.replace(dev[0], ef_block(tk, sym)).replace(OLD_MARK, f"AUTOMATION: READY - EXPECT FAIL ({tk})")
    assert e2.rstrip().endswith(f"<p>AUTOMATION: READY - EXPECT FAIL ({tk})</p>")
    P[f"C{i}"] = {"suite": "A/R and A/P Report Sorting (build/ar-ap-report-sorting)", "title": c["title"],
                  "updated_on_before": c["updated_on"], "fields": {"custom_expected": e2},
                  "reason": (f"Chris Ward, answer 17 (sheet 11_3z_Tp…, row 25, read 4 Nov 2026): {tk} lists this case. {tk} read in Jira 4 Nov "
                             "2026: Bug, In Progress, so it backs the marker (Rule 61). The 'Where the build is expected to differ … no ticket "
                             "number is known yet … mark this test Failed' note is replaced by the Rule 61 block (symptom + three outcomes) and "
                             f"the marker becomes AUTOMATION: READY - EXPECT FAIL ({tk}). Nothing else changes."),
                  "removed_text": dev[0]}

# ---------------- TASK B: C154708 ----------------
c = B(154708); e = c["custom_expected"]
TITLE = "The Title label stays Title when a canned line is picked, then its text deleted"
STEPS = ("<ol><li>Click New Line.</li><li>Type the first three letters of canned line A's name.</li><li>Click canned line A in the list.</li>"
         "<li>Click at the end of canned line A's name in the Title box.</li>"
         "<li>Press Backspace until the Title box is empty.</li></ol>")
R = ("<p><strong>Expected Result</strong></p>"
     "<p>Step 1:</p><ul><li>The New Line window opens over work order 1, with the cursor in the field labeled \"Title\".</li>"
     "<li>The grey prompt \"What are you doing?\" shows inside the Title box, under the label.</li></ul>"
     "<p>Step 2:</p><ul><li>The prompt is gone and only the three letters show.</li><li>The label still reads \"Title\".</li>"
     "<li>Canned line A is offered in the list.</li></ul>"
     "<p>Step 3:</p><ul><li>The field shows canned line A's name.</li><li>The label still reads \"Title\", not a question such as \"What are you doing?\".</li>"
     "<li>No grey prompt sits beside the picked name.</li></ul>"
     "<p>Step 4:</p><ul><li>The cursor sits at the end of canned line A's name, which still shows in the Title box.</li>"
     "<li>No clear (x) button shows at the right end of the Title box.</li></ul>"
     "<p>Step 5:</p><ul><li>The Title box is empty: canned line A's name is no longer picked.</li><li>The label still reads \"Title\".</li>"
     "<li>The grey prompt \"What are you doing?\" shows again in the Title box.</li></ul><p></p>")
q0 = e.find("<p><strong>Exact quotes from the source (for reproducibility)</strong></p>")
d0 = e.find("<p><strong>References from Design</strong></p>")
assert q0 > 0 and d0 > q0
quotes = e[q0:d0]
OLD_FROM = ("From: PRD \"What Are You Doing / Why Are You Doing It?\" (Title and Description), Confluence 845348896, version 15 (14 Oct 2026, "
            "owner Chris Ward), read 27 Oct 2026")
NEW_FROM = ("From: PRD \"What Are You Doing / Why Are You Doing It?\" (Title and Description), Confluence 845348896, version 17 (28 Oct 2026, "
            "owner Chris Ward), read 4 Nov 2026")
assert quotes.count(OLD_FROM) == 1, "From line changed live"
quotes = quotes.replace(OLD_FROM, NEW_FROM)
S1R7 = ("<li><strong>S1-R7:</strong> &ldquo;Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the "
        "same order, same validation, same values saved.&rdquo;</li>")
ANS16 = ("<p>From: Chris Ward, answer to question 16 in the What/Why question Doc "
         "(https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA), question posted 28 Oct 2026, read 4 Nov 2026</p>"
         "<ul><li><strong>Answer 16:</strong> &ldquo;No clear (x) button. A picked canned line is emptied the way it is today, by deleting its "
         "text in the Title box (Backspace). The picker is then empty again and the label still reads \"Title\" (S1-R4). An (x) would be "
         "a new control, and S1-R7 keeps the dialog as it is. Please test that deleting the text empties the picker.&rdquo;</li></ul>")
OLD_BUILD = "<p>Last checked against build v26.43.1-f2d183d (staging) on 10/28/2026.</p>"
NEW_BUILD = ("<p>Steps 1 to 3 were last checked against build v26.43.1-f2d183d (staging) on 10/28/2026; steps 4 and 5 have not yet been "
             "checked against a build.</p>")
assert quotes.count(OLD_BUILD) == 1 and quotes.count("</ul>") == 1
quotes = quotes.replace("</ul>", S1R7 + "</ul>" + ANS16).replace(OLD_BUILD, NEW_BUILD)
tail = e[d0:]
OLD_M = re.findall(r"<p>AUTOMATION:[^<]*</p>", tail); assert len(OLD_M) == 1 and "clear (x)" in OLD_M[0]
tail = tail.replace(OLD_M[0], "<p>AUTOMATION: READY</p>")
e2 = R + quotes + tail
P["C154708"] = {"suite": "What/Why (build/founder-mode/what-why)", "title": TITLE, "updated_on_before": c["updated_on"],
                "fields": {"title": TITLE, "custom_steps": STEPS, "custom_expected": e2},
                "reason": ("Released on Chris Ward's Doc answer 16 (4 Nov 2026): no clear (x) button; a picked canned line is emptied by "
                           "deleting its text with Backspace, the picker is then empty and the label still reads Title. Rewritten top to "
                           "bottom (Rule 134) against PRD v17 (S1-R3/R4/R5/R7 verbatim) and answer 16; marker HOLD -> AUTOMATION: READY "
                           "(the suite's standard released marker, 54 live cases). Preconditions, refs, design block: confirmed unchanged."),
                "parts": {"title": "CHANGED (says how the name is removed: its text deleted)",
                          "preconditions": "CONFIRMED (user/location, work order 1, canned line A, start screen: all used by the steps)",
                          "steps": "CHANGED (old step 4 'Click the clear button (x)' replaced by step 4 click at the end of the name and step 5 Backspace)",
                          "expected results": "CHANGED (steps 1-3 confirmed word for word; new step 4 and step 5 results from answer 16, S1-R4, S1-R3, S1-R7)",
                          "quotes": "CONFIRMED verbatim in PRD v17 (S1-R4, S1-R5, S1-R3); S1-R7 added; answer 16 added verbatim with its From line",
                          "From lines": "CHANGED (PRD version 15 read 27 Oct -> version 17 read 4 Nov 2026; new From line for answer 16)",
                          "build line": "CHANGED (steps 4-5 not yet checked against a build)",
                          "References from Design": "CONFIRMED (unchanged; design copy of 27 Oct 2026, not re-read on 4 Nov)",
                          "held note / marker": "CHANGED (HOLD on the missing clear button -> AUTOMATION: READY)",
                          "refs": "CONFIRMED (SV-10130)", "section": "CONFIRMED (20461, Story 1)",
                          "run": "run 553 (What/Why - Execution) no longer exists in TestRail (get_run 400 on 4 Nov 2026): no run to add it to"}}

json.dump(P, open(os.path.join(HERE, "proposals.json"), "w"), indent=1, ensure_ascii=False)
# readiness inputs: full tester fields (live + proposed) per suite
for name, keys in (("ar-ap", [k for k in P if k != "C154708"]), ("what-why", ["C154708"])):
    out = {}
    for k in keys:
        c = B(int(k[1:])); f = {x: c.get(x) for x in ("title", "custom_preconds", "custom_steps", "custom_expected")}; f.update(P[k]["fields"])
        out[k] = {"fields": f}
    json.dump(out, open(os.path.join(HERE, f"readiness-{name}.json"), "w"), indent=1, ensure_ascii=False)
print(len(P), "proposals; problems:", problems)
