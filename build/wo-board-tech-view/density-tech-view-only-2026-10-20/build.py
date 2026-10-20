#!/usr/bin/env python3
"""20 Oct 2026, QA lead on the 8 density cases that test Tech View and Board View: "I will go with your recommendation" (Board View
parts removed, Tech View only, as PRD v71 says). DRAFT ONLY: writes proposals.json here and checks it. No TestRail write.
Layout: Rule 117, ninth to twelfth amendments (copied from ../standard-and-v71-2026-10-20/build.py render()).
python3 build.py"""
import os, json, re, html
D = os.path.dirname(os.path.abspath(__file__)); W = os.path.dirname(D)
PRD = open(f"{W}/prd-v71-2026-10-20/CONFLUENCE-845185030-v71-2026-10-20.md").read()
norm = lambda s: re.sub(r"\s+", " ", s.replace("**", "")).strip()
PRDn = norm(PRD)
ANS = json.load(open(f"{W}/answers-2026-10-15/CHRIS-ANSWERS-12-31-2026-10-15.json"))
DES = f"{W}/sources/design-2026-10-14-upload"
DS = f"{DES}/_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037"
DESn = norm(" ".join(open(p, encoding="utf-8").read() for p in [f"{DES}/Work Orders.dc.html", f"{DS}/_ds_bundle.js", f"{DS}/README.md"]))
BEFORE = {c: json.load(open(f"{D}/C{c}-before.json")) for c in [96987, 96988, 96989, 96990, 96991, 96992, 590110, 590128]}
def code(k): return re.search(r"\*\*" + re.escape(k) + r":\*\*\s*(.*)", PRD).group(1).strip().replace("**", "")
SETUP = "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
DLINK = "https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&amp;via=share"
FROMV71 = ('From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 71 (20 Oct 2026, Chris Ward), '
           'read 20 Oct 2026 &middot; Epic SV-10043, ')
S6 = "story SV-10049 (Story 6, Density in Tech View and Board View)"
S3 = "SV-10046 (Story 3, Board View — board by lead technician)"
SHEET = ('"WO Board and Tech View – questions for Chris Ward (14 Oct 2026)" (Google Sheet 1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU, '
         'tab "Questions for Chris"), answered 15 Oct 2026, read 15 Oct 2026')
e = lambda s: html.escape(s, quote=False)
ADMIN = ('You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
BLOCK = ('If any record above is missing, mark this test Blocked: "setup not done".', "")
KD = ("Key decision, Fields vs. density are separate controls")

def render(pre, steps, res, groups, notes=(), design=None, marker="AUTOMATION: READY", pre_html=None):
    """groups: [(from_line_html, [(label, quote_text)])]; design: (intro_html, [(label, quote_text)]) or None."""
    P = pre_html or (f'<p><strong><a href="{SETUP}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
         "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>")
    S = "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>"
    X = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>" +
         "".join(f"<p>{n}</p>" for n in notes) + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>" +
         "".join(f"<p>{f}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(v)}&rdquo;</li>" for k, v in qs) + "</ul>" for f, qs in groups) +
         "<p>Not yet checked against a build in this wording.</p>")
    if design:
        intro, dq = design
        X += ("<p></p><p><strong>References from Design</strong></p>" + f"<p>{intro}</p>" +
              ("<ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(v)}&rdquo;</li>" for k, v in dq) + "</ul>" if dq else ""))
    X += f"<p></p><p>{marker}</p>"
    return P, S, X

def items(h): return [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def marker_of(c): return re.findall(r"AUTOMATION: [^<]+", BEFORE[c]["custom_expected"])[-1].strip()
C, WHY = {}, {}

# ---------------- C96987
pre = [('User {User-B} has the "Admin" role at {Location-A} and has never changed density. You are signed in as {User-B}, in a browser window at least 1024 px wide.',
        "For example: {User-B} is ZZAUTOTEST F1 Nora New and {Location-A} is Staging Heavy Duty - 9919."),
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician.",
        "For example: {Customer-A} is ZZAUTOTEST F1 Density Choices and {Work-order-1} is S1-702."),
       ('Starting screen: "Work Orders" > "All" tab, "List" shown, "Search" empty, no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Look at the toolbar on the right of the Work Orders page.", 'Click "Tech View" in the display switcher.', "Click the density button."]
res = ["Step 1: List shows no density button.",
       "Step 2: Tech View shows, with a density button in its toolbar.",
       'Step 3: the menu offers three choices, "Compact", "Regular" and "Comfortable", and "Regular" is marked as in use.']
groups = [(FROMV71 + S6, [(KD, "List has neither new control and stays as it is in production."), ("S6-R1", code("S6-R1")), ("S6-R5", code("S6-R5"))])]
notes = ["Developers also check this with unit tests: <code>DensityMenu.spec.ts</code> (lines 36 and 57) and <code>WorkOrdersToolbar.spec.ts</code> (lines 207 and 219)."]
design = ('Claude Design project "Work Orders" (Branko Cicovic), <a href="' + DLINK + '">Work Orders.dc.html</a>, export of 14 Oct 2026 (design library '
          '_ds_bundle.js), read 14 Oct 2026. The design names Tech View\'s control "Row height", with the choices Small, Medium and Large. Chris Ward '
          'ruled on 19 Oct 2026 (design-difference sheet, answer 11) for the PRD\'s names, Compact, Regular and Comfortable, and this case follows the PRD.',
          [("Design — _ds_bundle.js (design library), density menu title", "const densTitle = cards ? 'Card size' : 'Row height';"),
           ("Design — _ds_bundle.js (design library), Tech View density choices", "const ROW_DENSITY = [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']];")])
P, S, X = render(pre, steps, res, groups, notes, design, marker_of(96987))
C[96987] = {"title": BEFORE[96987]["title"], "refs": "SV-10043,SV-10049", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96987] = ["Board View steps 4 and 5 and the Board View half of both results removed: PRD v71 S6-R1 offers density in Tech View only.",
              "Steps split to one action each (5 to 3); every step has its own \"Step N:\" result.",
              "Preconditions rewritten in the two-audience layout; the \"Dev-layer test\" line, Needs line, build name and Setup block removed (the how-to is SETUP-C96987 in recipes.md); the dev-layer note kept as one plain sentence after the results.",
              "[User-B] and [WO-1] became {User-B} and {Work-order-1}; the separate [User-A] creator is not needed by the steps and was dropped. Example names kept (ZZAUTOTEST F1 Density Choices, ZZAUTOTEST F1 Nora New, S1-702).",
              "Quotes re-taken from PRD v71: S6-R1 (changed in v71), S6-R5 (unchanged), and the Key decision sentence that backs \"List has no density button\".",
              "The design note moved from the Source paragraph to \"References from Design\" with the 14 Oct 2026 export's own words; the Board View \"Card size\" note dropped (Board View is out of this case), and Chris Ward's 19 Oct ruling (answer 11) named.",
              "refs set to SV-10043,SV-10049 (was empty). AUTOMATION unchanged: READY."]

# ---------------- C96988
pre = [ADMIN,
       ('Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User".', "For example: {Technician-A} is Esther Howard."),
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}.",
        "For example: {Customer-A} is ZZAUTOTEST F1 Density Content and {Work-order-1} is S1-702."),
       ('In Tech View\'s "Column Selection", "Lead Technician" is turned on (it is off until you turn it on).', ""),
       ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".', ""), BLOCK]
steps = ["Write down every column heading and every value in {Work-order-1}'s row.",
         'Click the density button and choose "Compact".',
         "Compare the column headings and the values in {Work-order-1}'s row with what you wrote down at step 1.",
         'Click the density button and choose "Comfortable".',
         "Compare the column headings and the values in {Work-order-1}'s row with what you wrote down at step 1."]
res = ['Step 1: the row shows a value in its columns, including {Technician-A} under "Lead Technician", a progress bar under "Progress" and an amount under "Total price".',
       "Step 2: the rows are tighter (shorter) than at Regular. Nothing else about the row changes.",
       'Step 3: the same columns, in the same order, with the same values as at step 1. "Lead Technician", "Progress" and "Total price" are still shown.',
       "Step 4: the rows are roomier (taller) than at Regular.",
       "Step 5: the same columns, in the same order, with the same values as at step 1."]
groups = [(FROMV71 + S6, [("S6-R2", code("S6-R2")), ("S6-R6", code("S6-R6")), (KD, "Density changes spacing and element sizing only; it never hides fields.")])]
P, S, X = render(pre, steps, res, groups, marker=marker_of(96988))
C[96988] = {"title": BEFORE[96988]["title"], "refs": "SV-10043,SV-10049", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96988] = ["Board View steps 1 to 5 (card fields, card at each density) removed: PRD v71 S6-E1 says Board View cards keep their current spacing, and Board View has no density button (S3-R11).",
              "The Tech View half (old step 6, \"repeat in Tech View with its columns\") kept and written out: the row's columns and values are compared at Regular, Compact and Comfortable.",
              "The old step turned on optional card fields in \"Fields to display\" (Board View only). In Tech View the same check uses an optional column: \"Lead Technician\", which S5-R4 lists as off by default, is turned on in the preconditions; Progress and Total price are default Tech View columns. No new behaviour is tested.",
              "One action per step (6 to 5); one \"Step N:\" result per step.",
              "Preconditions in the two-audience layout; Needs line, build name and Setup block removed (SETUP-C96988 in recipes.md). [Tech-A] and [WO-1] became {Technician-A} and {Work-order-1}; examples kept (Esther Howard, ZZAUTOTEST F1 Density Content, S1-702).",
              "Quotes from PRD v71: S6-R2, S6-R6 and the Key decision sentence (unchanged wording, re-checked in v71).",
              "The old design note (the design's Compact card hides hours, progress and totals) dropped: it is about Board View cards, which this case no longer checks.",
              "refs set to SV-10043,SV-10049 (was empty). AUTOMATION unchanged: READY. This case is marked Automated in TestRail (Rules 65 and 71)."]

# ---------------- C96989
pre = [ADMIN,
       ("You can switch to a second location, {Location-B}, and a second browser (or a second computer) is open on the sign-in page.",
        "For example: {Location-B} is Staging Lethbridge - 4310."),
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician.",
        "For example: {Customer-A} is ZZAUTOTEST F1 Density Shared and {Work-order-1} is S1-702."),
       ('In Tech View the density is not "Comfortable".', 'For example: it is "Regular".'),
       ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Look at the toolbar and at the space around the card of {Work-order-1}.",
         'Click "Tech View" in the display switcher.',
         'Click the density button and choose "Comfortable".',
         'Click "Board View" in the display switcher.',
         "Log out.",
         "Sign in again as the same user.",
         'Open "Work Orders" and click "Tech View" in the display switcher.',
         'Change location to {Location-B} (your initials at the top right > "Change Location").',
         'Open "Work Orders" and click "Tech View" in the display switcher.',
         "In the second browser, sign in as the same user.",
         'In the second browser, open "Work Orders" and click "Tech View" in the display switcher.']
res = ["Step 1: Board View's toolbar has no density button.",
       "Step 2: Tech View shows, with a density button in its toolbar.",
       'Step 3: "Comfortable" is in use and the rows are roomier than before.',
       "Step 4: Board View still has no density button, and the card of {Work-order-1} has the same spacing as at step 1. Choosing Comfortable in Tech View did not change Board View.",
       "Step 5: you are signed out.",
       "Step 6: you are signed in.",
       'Step 7: Tech View opens with "Comfortable" still in use: the rows have the same roomy spacing as at step 3.',
       "Step 8: the top bar shows {Location-B}.",
       'Step 9: at {Location-B}, Tech View is at "Comfortable" too.',
       "Step 10: you are signed in in the second browser.",
       'Step 11: in the second browser, Tech View is at "Comfortable" too.']
groups = [(FROMV71 + "stories SV-10049 (Story 6, Density in Tech View and Board View) and " + S3 + "; ticket SV-11580",
           [("S3-R11", code("S3-R11")), ("S6-R1", code("S6-R1")), ("S6-R3", code("S6-R3")), ("S6-E1", code("S6-E1")), ("S6-R7", code("S6-R7"))])]
P, S, X = render(pre, steps, res, groups, marker=marker_of(96989))
C[96989] = {"title": "Tech View density is kept after logout, in another browser and location", "refs": "SV-10043,SV-10046,SV-10049,SV-11580",
            "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96989] = ["Title changed: the old title (\"One density choice is shared by Tech View and Board View and kept\") is wrong under PRD v71, where density belongs to Tech View only (S6-R3).",
              "The shared-choice check (old step 2, Board View reads Comfortable) replaced, as v71 says, by: Board View has no density button (S3-R11) and its card keeps its spacing after Comfortable is chosen in Tech View (S6-E1, S6-R3) - steps 1 and 4.",
              "The saved-per-user check kept in full (S6-R7): after logout and login, at the second location and in the second browser, Tech View is still Comfortable. Old steps 3 to 5 now open Tech View (they opened Board View in step 4 before).",
              "One action per step (5 to 11); one \"Step N:\" result per step. Over the 10-step target; not split (Rule 127).",
              "Preconditions in the two-audience layout; Needs line, build name and Setup block removed (SETUP-C96989). {Location-B} added as a named placeholder for the old \"second location\" (example Staging Lethbridge - 4310, from the setup file). Example names kept (ZZAUTOTEST F1 Density Shared, S1-702).",
              "Quotes from PRD v71: S3-R11, S6-R1, S6-R3, S6-E1 (all changed in v71) and S6-R7 (unchanged).",
              "refs set to SV-10043,SV-10046,SV-10049,SV-11580 (was empty). AUTOMATION unchanged: READY. This case is marked Automated in TestRail (Rules 65 and 71). Today's staging build still shows the Board View density button (SV-11580 Open), so steps 1 and 4 fail until it ships."]

# ---------------- C96990
old = BEFORE[96990]
pre = [ADMIN,
       ('Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User".', "For example: {Technician-A} is Esther Howard."),
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}.",
        'For example: {Customer-A} is "ZZAUTOTEST F1 Compact Text" and {Work-order-1} is S10043-17651.'),
       ('Tech View shows the "Progress" column (it is on by default).', ""),
       ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", nothing ticked in "Status", no choice in "Asset on Site", "Assigned to me" off.', ""), BLOCK]
steps = ['Click the density button and choose "Regular".',
         "Look at the size of the text in {Work-order-1}'s row, of the column header labels and of the percentage beside the progress bar.",
         'Click the density button and choose "Compact".',
         "Compare the same texts with what you saw at step 2.",
         'Click the density button and choose "Comfortable".',
         "Compare the same texts with what you saw at step 2."]
res = ['Step 1: "Regular" is in use.',
       "Step 2: the row text is the normal size (14 px). The column header labels and the percentage are smaller (12 px).",
       'Step 3: "Compact" is in use and the rows are tighter.',
       "Step 4: at Compact the row text is the same size as at Regular (14 px), not smaller. The column header labels and the percentage keep their own smaller size (12 px), the same as at Regular.",
       'Step 5: "Comfortable" is in use and the rows are roomier.',
       "Step 6: at Comfortable every text is the same size as at Regular."]
notes = ["The PRD (version 52) said only that Compact must not go below the minimum body text size, while the design's Compact rows use 13 px. "
         "Chris Ward answered on 15 Oct 2026 (answer 27) that row and card text is 14 px at every density and text the design sets at 12 px stays 12 px; "
         "PRD versions 54 to 71 say so, and this case follows it."]
groups = [(FROMV71 + S6, [("S6-R4", code("S6-R4")), ("Terminology, Density", "Design must define the three variants without reducing text below the application’s minimum body size.")]),
          ("From: Chris Ward's answer 27, " + e(SHEET), [("Chris Ward's answer 27", ANS["27"])])]
P, S, X = render(pre, steps, res, groups, notes, marker=marker_of(96990))
C[96990] = {"title": "Tech View row text stays the same size at every density", "refs": "SV-10043,SV-10049", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96990] = ["Title changed: \"card text\" dropped, because Board View cards have no density in PRD v71 (S6-E1).",
              "Board View steps 9 to 11 and the Step 11 result removed (they set density in Board View, which v71 removes, S3-R11).",
              "Old steps 1 and 2 (open Work Orders, search, click Tech View) became the starting screen; the Tech View text checks (old steps 3 to 8) kept, one action each (11 to 6), with a \"Step N:\" result for every step (it had results for 3 steps only).",
              "Preconditions: the per-case Google Doc link replaced by the feature's setup file link; filter state folded into the starting-screen line; Blocked line added. Examples kept (Esther Howard, ZZAUTOTEST F1 Compact Text, S10043-17651).",
              "Quotes: S6-R4 from PRD v71 (unchanged), the Terminology sentence the old Source cited, and Chris Ward's answer 27 as its own \"From:\" document, word for word.",
              "Divergence note kept (PRD versions now \"54 to 71\").",
              "refs set to SV-10043,SV-10049 (was empty). AUTOMATION unchanged: READY."]

# ---------------- C96991
pre = [ADMIN,
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician.",
        "For example: {Customer-A} is ZZAUTOTEST F1 Density Load Fail and {Work-order-1} is S1-702."),
       ("A developer can make your saved density fail to load. This cannot be done from the product; without it, step 3 cannot be checked by hand.", ""),
       ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ['Click the density button and choose "Comfortable".',
         "Reload the page.",
         "Ask the developer to make your saved density fail to load, then reload the page."]
res = ['Step 1: "Comfortable" is in use and the rows are roomier.',
       'Step 2: Tech View opens again with "Comfortable" still in use (the saved density loads normally).',
       'Step 3: Tech View uses "Regular": the rows have the normal spacing, not the roomy spacing of step 2. If no developer could make the load fail, write "load failure not checked by hand" for this step.']
groups = [(FROMV71 + S6, [("S6-N2", code("S6-N2")), ("S6-R7", code("S6-R7"))])]
P, S, X = render(pre, steps, res, groups, marker=marker_of(96991))
C[96991] = {"title": BEFORE[96991]["title"], "refs": "SV-10043,SV-10049", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96991] = ["Board View removed from step 3 and from the result: in PRD v71 density belongs to Tech View only (S6-R3), so the fallback to Regular is checked in Tech View.",
              "The normal-load check (old step 2) kept and given its own result; S6-R7 quoted for it (saved per user across sessions).",
              "The forced-failure condition moved out of the step into one plain precondition and into the step 3 result; the instruction \"write 'load failure not checked by hand'\" kept.",
              "Preconditions in the two-audience layout; Needs line, build name and Setup block removed (SETUP-C96991). Example names kept (ZZAUTOTEST F1 Density Load Fail, S1-702).",
              "Quote S6-N2 from PRD v71 (unchanged).",
              "refs set to SV-10043,SV-10049 (was empty). AUTOMATION unchanged: READY (Rule 114 would allow HOLD for the forced-failure step; the brief keeps the case's value, see the report)."]

# ---------------- C96992
pre = [ADMIN,
       ('Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User".', "For example: {Technician-A} is Esther Howard."),
       ("Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}.",
        "For example: {Customer-A} is ZZAUTOTEST F1 Density Scope and {Work-order-1} is S1-702."),
       ('In Tech View the density is "Regular", and a second browser tab shows the "Customers" page, opened before you start.', ""),
       ('Starting screen: "Work Orders" > "All" tab, "List" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Look at the height of {Work-order-1}'s row.",
         'Click "Board View" in the display switcher.',
         "Look at the toolbar and at the space around the card of {Work-order-1}.",
         'Click "Tech View" in the display switcher.',
         'Click the density button and choose "Comfortable".',
         'Click the density button and choose "Compact".',
         'Click "Board View" in the display switcher.',
         'Click "List" in the display switcher.',
         'Switch to the "Customers" browser tab and reload the page.']
res = ["Step 1: List shows {Work-order-1}'s row at its usual height.",
       "Step 2: Board View shows the card of {Work-order-1} in {Technician-A}'s column.",
       "Step 3: Board View's toolbar has no density button.",
       "Step 4: Tech View shows, with a density button in its toolbar.",
       "Step 5: Tech View's rows become roomier (taller).",
       "Step 6: Tech View's rows become tighter (shorter) than at Comfortable and at Regular.",
       "Step 7: Board View still has no density button, and the card of {Work-order-1} has the same spacing as at step 3.",
       "Step 8: {Work-order-1}'s row in List is the same height as at step 1.",
       "Step 9: the Customers table's rows are the same height as before the reload."]
groups = [(FROMV71 + "stories SV-10049 (Story 6, Density in Tech View and Board View) and " + S3 + "; ticket SV-11580",
           [("S6-E1", code("S6-E1")), ("S3-R11", code("S3-R11")), ("S6-R3", code("S6-R3")), ("S6-R2", code("S6-R2"))])]
P, S, X = render(pre, steps, res, groups, marker=marker_of(96992))
C[96992] = {"title": "Density changes Tech View rows only, not Board View cards or List", "refs": "SV-10043,SV-10046,SV-10049,SV-11580",
            "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[96992] = ["Title changed: the old title (\"Density affects Tech View rows and Board View cards, List stays as today\") is wrong under PRD v71 S6-E1.",
              "\"Board View cards change with density\" replaced, as v71 says, by: Board View has no density button (S3-R11) and its card keeps the same spacing after Tech View's density changes (S6-E1) - steps 3 and 7.",
              "Kept: Tech View rows change with density (S6-R2), List keeps today's row height, other tables unchanged (S6-E1). The old \"compare Customers with before\" made checkable: a Customers tab opened before the test is reloaded and compared.",
              "One action per step (5 to 9); one \"Step N:\" result per step.",
              "Preconditions in the two-audience layout; Needs line, build name and Setup block removed (SETUP-C96992). Examples kept (Esther Howard, ZZAUTOTEST F1 Density Scope, S1-702).",
              "Quotes from PRD v71: S6-E1, S3-R11, S6-R3 (changed in v71) and S6-R2. The old Source's \"Review Decisions DR-33\" is not quoted: its words are not held in this repository; S6-E1 carries the same rule.",
              "refs set to SV-10043,SV-10046,SV-10049,SV-11580 (was empty). AUTOMATION unchanged: READY. This case is marked Automated in TestRail (Rules 65 and 71). Today's staging build still shows the Board View density button (SV-11580 Open), so steps 3 and 7 fail until it ships."]

# ---------------- C590110 (design)
old = BEFORE[590110]
ost, ores = items(old["custom_steps"]), items(old["custom_expected"].split("</ul>")[0])
assert ost[7] == "Look at the density button." and ores[7].startswith("Step 8: the density button shows a card")
steps = ost[:7] + ost[8:]
res = ores[:7] + [re.sub(r"^Step 9:", "Step 8:", ores[8]), re.sub(r"^Step 10:", "Step 9:", ores[9])]
pre_html = old["custom_preconds"]
oq = re.findall(r"<li><strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", old["custom_expected"])
dq = [(k, html.unescape(v)) for k, v in oq if k.startswith("Design")]
notes = ["Until 15 Oct 2026 the PRD (version 52) left every List icon unchanged, so this case did not judge the filter icons. Chris Ward answered on 15 Oct 2026 "
         "(answer 12) that the filter chips and Search use the design file's icons in every display option, List included, and (answer 21) that today's tabs, "
         "toolbar and Create Work Order button stay. PRD versions 54 to 71 say so, and this case follows them. The design names the three options Table, By Lead "
         "Tech and Board; PRD version 71 still keeps List, Tech View and Board View (answer 24). The Technician filter's wrench icon is checked in the Technician "
         "filter design case.",
         "PRD versions 55 and 58 (S1-R9a, S2-R23; Chris Ward rulings on Slavcho Mitrov's questions and PR notes, 15 Oct 2026) add that the display switcher's "
         "icons and the toolbar icons are the design's slate colour in every view, List included; steps 1, 3, 4 and 7 check it.",
         "PRD version 71 removes Board View's density button (S3-R11), so this case no longer looks at a density button in Board View; the Board View picture is "
         "still used for the switcher and the Search and filter icons."]
groups = [(FROMV71 + "stories SV-10044 (Story 1, Switch between display options) and SV-10049 (Story 6, Density in Tech View and Board View); ticket SV-11319",
           [("S1-R9a", code("S1-R9a")), ("S2-R23", code("S2-R23")), ("S1-R9", code("S1-R9")), ("S6-R1", code("S6-R1")),
            ("Goals", "List remains the default and is unchanged from production. The only changes to the Work Orders page are the display switcher and the icons on the filter chips and Search, which follow the design file in every display option, List included (S1-R9a). Today’s tabs, toolbar layout and Create Work Order button stay as they are.")]),
          ("From: Chris Ward's answers 12, 21 and 24, " + e(SHEET), [("Chris Ward's answer 12", ANS["12"]), ("Chris Ward's answer 21", ANS["21"]), ("Chris Ward's answer 24", ANS["24"])])]
design = ('Claude Design project "Work Orders" (Branko Cicovic), <a href="' + DLINK + '">Work Orders.dc.html</a>, export of 14 Oct 2026, read 14 Oct 2026. '
          'The design pictures attached to this case, "DC-01-toolbar-tech-view-light-1440.png" and "DC-01-toolbar-board-view-light-1440.png", were rendered from it.', dq)
P, S, X = render(None, steps, res, groups, notes, design, marker_of(590110), pre_html=pre_html)
C[590110] = {"title": old["title"], "refs": old["refs"], "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[590110] = ["Step 8 (\"Look at the density button\" in Board View) and its result (the card-height icon) removed: PRD v71 S3-R11, Board View has no density button. Steps 9 and 10 renumbered 8 and 9 (10 to 9 steps).",
               "Every other step and result unchanged, including the Tech View density button and menu (steps 4 and 6) and the Board View switcher, Search and filter icons (steps 7 and 8).",
               "Preconditions unchanged (already in the current layout).",
               "Source paragraph replaced by \"From:\" lines: PRD v71 (S1-R9a, S1-R9, Goals unchanged; S2-R23 re-quoted in its v71 wording; S6-R1 in its v71 wording) and Chris Ward's answers 12, 21 and 24 as their own document, word for word.",
               "Divergence notes kept (versions brought to 71); one sentence added saying why the Board View density button is no longer looked at.",
               "Design references moved to \"References from Design\": the design link, the export and board, the two attached picture names and the design's quoted words, unchanged (all 8 re-found in the 14 Oct 2026 export). The card-height quote stays as the design's own words.",
               "Title and refs unchanged. AUTOMATION unchanged: READY."]

# ---------------- C590128 (design)
old = BEFORE[590128]
ost, ores = items(old["custom_steps"]), items(old["custom_expected"].split("</ul>")[0])
steps = ost[:6] + ['Click "Board View" in the display switcher.', "Look at the avatars on the card for {Work-order-1}."]
res = ores[:6] + ["Step 7: Board View shows the card for {Work-order-1}.",
                  "Step 8: the card's avatars are 24 px: the same size as the row avatars at Regular (step 4), and smaller than the 32 px row avatars at Comfortable (step 6)."]
pre_html = old["custom_preconds"].replace(
    "Board View's \"Fields to display\" has \"Line technicians\" on.", 'On Board View cards the "Line technicians" field is turned on.')
assert "Fields to display" not in pre_html
oq = re.findall(r"<li><strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", old["custom_expected"])
dq = [(k, html.unescape(v)) for k, v in oq if k.startswith("Design")]
notes = ["The design's Compact row text is 13 px and the design adds the hours under the progress bar only at Comfortable. Chris Ward answered on 15 Oct 2026 "
         "(answer 27) that row and card text is 14 px at every density and Compact never shrinks it, while text the design sets at 12 px stays 12 px, and (answer 18) "
         "that no hours line shows at any density. PRD version 71 still says so, and this case follows it.",
         "PRD versions 60 and 61 (S2-R23; Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422 and SV-11421, 16 Oct 2026) add the avatar sizes by "
         "density (rows 20, 24 and 32 px; group headers 24, 28 and 36 px; the Service Advisor avatar too), the Compact progress bar of 48 × 4 px, and Board card "
         "avatars that stay 24 px; steps 2, 4, 6 and 8 check them. PRD version 71 removes Board View's density button (S3-R11), so the card avatars are checked "
         "after Tech View's density has changed."]
groups = [(FROMV71 + "story SV-10049 (Story 6, Density in Tech View and Board View); ticket SV-11318",
           [("S2-R23", code("S2-R23")), ("S6-R1", code("S6-R1")), ("S6-R2", code("S6-R2")), ("S6-R4", code("S6-R4")), ("S6-R6", code("S6-R6")),
            ("S6-E1", code("S6-E1")), ("S2-R20", code("S2-R20"))]),
          ("From: Chris Ward's answers 18 and 27, " + e(SHEET), [("Chris Ward's answer 18", ANS["18"]), ("Chris Ward's answer 27", ANS["27"])])]
design = ('Claude Design project "Work Orders" (Branko Cicovic), <a href="' + DLINK + '">Work Orders.dc.html</a>, export of 14 Oct 2026, read 14 Oct 2026. '
          'The design pictures attached to this case, "DC-06-tech-view-compact-light-1440.png", "DC-06-tech-view-regular-light-1440.png" and '
          '"DC-06-tech-view-comfortable-light-1440.png", were rendered from it.', dq)
P, S, X = render(None, steps, res, groups, notes, design, marker_of(590128), pre_html=pre_html)
C[590128] = {"title": old["title"], "refs": old["refs"], "custom_preconds": P, "custom_steps": S, "custom_expected": X}
WHY[590128] = ["Steps 7 to 10 (Board View density button, \"Comfortable in use in Board View too\", choosing Compact in Board View) removed: PRD v71 S3-R11 and S6-R3.",
               "The card-avatar check kept (S2-R23 still says \"Board View card avatars stay 24px\"): new steps 7 and 8 open Board View after Tech View's density was changed and compare the card's avatars with the row avatars (10 to 8 steps). The title stays right.",
               "Steps and results 1 to 6 unchanged.",
               "Precondition \"Board View's 'Fields to display' has 'Line technicians' on\" reworded without the button name, which v71 renames Column Selection; everything else in the preconditions unchanged.",
               "Source paragraph replaced by \"From:\" lines: PRD v71 (S2-R23 re-quoted in its v71 wording; S6-R1 in its v71 wording; S6-R2, S6-R4, S6-R6, S2-R20 unchanged; S6-E1 added for step 8; S6-R3 dropped because no result relies on it now) and Chris Ward's answers 18 and 27 word for word.",
               "Divergence notes kept (version brought to 71; step list now 2, 4, 6 and 8).",
               "Design references moved to \"References from Design\": the design link, export, board, the three picture names and the four design code quotes, unchanged (all re-found in the 14 Oct 2026 export).",
               "Title and refs unchanged. AUTOMATION unchanged: READY."]

# ---------------- checks
probs, rows = [], []
for cid, f in C.items():
    X, S_, P_ = f["custom_expected"], f["custom_steps"], f["custom_preconds"]
    head, rest = X.split("<p><strong>Exact quotes from the source (for reproducibility)</strong></p>")
    refs_part = rest.split("<p><strong>References from Design</strong></p>")
    for k, q in re.findall(r"<li><strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", refs_part[0]):
        qn = norm(html.unescape(q))
        ok = qn in PRDn if not k.startswith("Chris Ward") else any(qn == norm(v) for v in ANS.values() if isinstance(v, str))
        if not ok: probs.append(f"C{cid}: quote {k} not verbatim in its source")
    if len(refs_part) > 1:
        for k, q in re.findall(r"<li><strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", refs_part[1]):
            if norm(html.unescape(q)) not in DESn: probs.append(f"C{cid}: design quote {k} not in the 14 Oct export")
    ns = S_.count("<li>"); rl = re.findall(r"<li>Step (\d+):", head)
    if ns != len(rl) or rl != [str(i + 1) for i in range(ns)]: probs.append(f"C{cid}: {ns} steps vs results {rl}")
    if len(f["title"]) > 80 or ";" in f["title"]: probs.append(f"C{cid}: title")
    if cid in (590110, 590128) and not f["title"].startswith("Design: "): probs.append(f"C{cid}: Design prefix")
    if X.count("AUTOMATION:") != 1 or not re.search(r"<p>AUTOMATION: (READY|READY - EXPECT FAIL \(SV-\d+\)|HOLD - [^<]+)</p>$", X): probs.append(f"C{cid}: AUTOMATION line")
    if f["custom_expected"].count("From: ") < 1 or "Source &mdash;" in X: probs.append(f"C{cid}: From/Source layout")
    used = set(re.findall(r"\{[A-Za-z0-9-]+\}", S_ + head)); dfn = set(re.findall(r"\{[A-Za-z0-9-]+\}", P_))
    if used - dfn: probs.append(f"C{cid}: undefined {sorted(used - dfn)}")
    for i, s in enumerate(items(S_), 1):
        if "Board View" in s and re.search(r"densit", s, re.I): probs.append(f"C{cid}: step {i} is a Board View density step")
    outside = re.sub(r"<li><strong>[^<]+:</strong> &ldquo;.*?&rdquo;</li>", "", P_ + S_ + X)
    if "Fields to display" in outside: probs.append(f"C{cid}: 'Fields to display' outside quotes")
    if re.search(r"Needs:|<strong>Setup</strong>|Dev-layer|v26\.40", P_): probs.append(f"C{cid}: old precondition lines left")
    if not P_.rstrip("</ul>").endswith('If any record above is missing, mark this test Blocked: "setup not done".</li>') and \
       'If any record above is missing, mark this test Blocked: "setup not done".</li></ul>' not in P_: probs.append(f"C{cid}: Blocked line not last")
    rows.append((f"C{cid}", f["title"], items(BEFORE[cid]["custom_steps"]).__len__(), ns, re.findall(r"AUTOMATION: [^<]+", X)[0]))
out = {str(k): {**v, "why": WHY[k]} for k, v in C.items()}
json.dump(out, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)
for r in rows: print(" | ".join(map(str, r)))
print("problems:", probs or "none")
