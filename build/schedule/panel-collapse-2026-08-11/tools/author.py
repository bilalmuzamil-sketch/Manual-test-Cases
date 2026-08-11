#!/usr/bin/env python3
"""Author the six SCH-PANEL cases for Schedule spec v27 §5.3 "Panel collapse".

Expected behaviour is taken from the DOCUMENT only (Standing Rule 57): spec v27
§5.3 / §6 / §3.1 and epic SV-8685 story SV-8686.  The BUILD supplied only the
on-screen labels (Rule 9) and the pass/fail verdict - and the verdict here is
that the control does not exist, so every case carries AUTOMATION: HOLD.
"""
import json, os

BUILD = "v3.5-af3a6e1"
DATE = "8/11/2026"
SPEC_VER = "27"

NOTBUILT = (
    "Not built yet. When this was checked on 11 August 2026 the Schedule toolbar had no panel "
    "button at all - the button furthest to the left above the grid is Today. Until that button "
    "exists this test cannot be run: mark it Blocked. If you do find a panel button, the feature "
    "has shipped - tell the QA lead so this note can be removed and the test run as written."
)
MARKER = "AUTOMATION: HOLD - the panel collapse control is not in the build"


def build_expected(items, extra_notes, anchors):
    """Numbered expectations -> optional notes -> Rule-54 provenance -> Rule-61/marker LAST."""
    out = "\n".join(f"{i+1}. {t}" for i, t in enumerate(items))
    for n in extra_notes:
        out += "\n\n" + n
    out += (
        "\n\n---\n"
        f"This is the expected behaviour as per epic SV-8685, its story SV-8686, and the Schedule "
        f"specification version {SPEC_VER} ({anchors}). "
        f"Last checked against build {BUILD} on {DATE}.\n"
        f"\n{MARKER}\n"
    )
    return out


C = []

# ---------------------------------------------------------------- SCH-PANEL-01
C.append(dict(
    id="SCH-PANEL-01", area="Grid Toolbar", section_id=4273,
    title="Panel button sits left of Today and its tooltip names what it will do",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser, with the window at least 960 pixels wide.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page, and the left panel is showing - that is the strip down the left-hand "
        "side holding the small month calendar and the list of work orders."
    ),
    steps=(
        "1. Look at the row of buttons directly above the grid, to the right of the left panel.\n"
        "2. Find the button at the far-left end of that row, before the Today button.\n"
        "3. Rest your mouse pointer on that button and read the tooltip that appears.\n"
        "4. Click the button once, so the left panel is hidden.\n"
        "5. Rest your mouse pointer on the same button again and read the tooltip.\n"
        "6. Compare the picture on the button now with the picture that was on it at step 3.\n"
        "7. Click the button once more."
    ),
    expected=[
        "There is a button at the far-left end of that row, to the left of the Today button.",
        "It sits above the grid's left-hand column - the one headed Department that carries the technician "
        "names and their small round profile pictures - so it reads as belonging to the panel it controls.",
        "It sits together with the date controls: the Today button and the left and right arrows.",
        "The button shows a small picture only, with no border or box drawn around it, in the same muted grey "
        "as the other icon buttons in that row.",
        "While the left panel is showing, the tooltip reads: Hide panel",
        "After you click it and the panel is hidden, the tooltip reads: Show panel",
        "The picture on the button is exactly the same in both states - only the tooltip changes.",
        "Clicking the button at step 4 hides the left panel, and clicking it again at step 7 shows it.",
    ],
    notes_extra=[NOTBUILT],
    anchors="§5.3 Panel collapse and §6 Grid toolbar",
    refs="SV-8686 (§5.3 Panel collapse - the control: position; borderless icon; tooltip wording. §6 Grid toolbar - Panel toggle row)",
    spec_ref="specification v27 §5.3 Panel collapse (first paragraph and Control bullet); §6 Grid toolbar Panel toggle row",
    notes=(
        "Authored 2026-08-11 for the §5.3 coverage gap. Covers assertions §5.3-L189.A1/A2/A3, "
        "§5.3-L190.A1/A2/A3 and §6-L199.A2. NOT BUILT: proven three ways on build v3.5-af3a6e1 - "
        "(1) no control anywhere left of Today at six viewport widths from 1680 down to 600, "
        "(2) not in the View options or Filter and display menus and no keyboard route moved the panel, "
        "(3) the strings 'Hide panel', 'Show panel', 'panel-left' and 'Panel toggle' appear ZERO times in "
        "the shipped Schedule JavaScript chunk, while every control that IS built appears there. "
        "The near-miss to avoid: button_mini_calendar_collapse carries aria-label 'Hide the calendar' and "
        "sits in the same left strip - that is the mini calendar's own chevron (§5.2), already covered by "
        "SCH-MCAL-03 = C29934, not the panel toggle. "
        "Honest limit on expected item 4: the specification says 'a borderless panel-left icon in secondary "
        "text color'; 'secondary text color' is a design token, so the case asserts the observable form of it "
        "- no border or box, same muted grey as the sibling icon buttons in that row."
    ),
))

# ---------------------------------------------------------------- SCH-PANEL-02
C.append(dict(
    id="SCH-PANEL-02", area="Grid Toolbar", section_id=4273,
    title="Panel button hides the left panel and the grid widens into the space",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser, with the window at least 960 pixels wide.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page, the left panel is showing, and there are some shifts visible in the grid."
    ),
    steps=(
        "1. Note roughly how much of the screen the grid takes up and how much of it you can see across.\n"
        "2. Look at the join between the left panel and the grid.\n"
        "3. Click the panel button at the far-left end of the row of buttons above the grid, to the left of Today.\n"
        "4. Watch what happens to the left panel and to the grid as it closes.\n"
        "5. Look again at the area where the left panel used to be.\n"
        "6. Click the same button a second time."
    ),
    expected=[
        "The left panel closes with a short, smooth sliding movement as its width shrinks - it does not "
        "disappear in one jump.",
        "The dividing line between the panel and the grid goes away with it, leaving no leftover line, seam or "
        "empty strip where the panel used to be.",
        "The grid grows into the space the panel gave up and lays itself out again in the wider area, so you "
        "can see more of the grid than you could before.",
        "Clicking the button a second time brings the panel back to its normal width, and the grid goes back "
        "to the size it was at step 1.",
    ],
    notes_extra=[NOTBUILT],
    anchors="§5.3 Panel collapse and §3.1 Left panel: work order sidebar",
    refs="SV-8686 (§5.3 Panel collapse - Behavior; §3.1 - collapsed from the grid toolbar handing its width to the grid)",
    spec_ref="specification v27 §5.3 Panel collapse (Behavior bullet); §3.1 Left panel: work order sidebar",
    notes=(
        "Authored 2026-08-11. Covers §5.3-L191.A1 and §5.3-L191.A2, plus the width half of §3.1-L44.A1 "
        "('handing its width to the grid'). NOT BUILT on v3.5-af3a6e1 - see SCH-PANEL-01's note for the "
        "three-way proof. Observation recorded for whoever builds it: today the panel's right edge is at "
        "x=287 and the grid starts at x=300, and a scan of that gap found NO separate divider element, so "
        "expected item 2 is written as the observable outcome (no leftover line or seam) rather than as a "
        "statement about a divider element that may not exist."
    ),
))

# ---------------------------------------------------------------- SCH-PANEL-03
C.append(dict(
    id="SCH-PANEL-03", area="Grid Toolbar", section_id=4273,
    title="What you had set up in the left panel survives hiding and showing it",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser, with the window at least 960 pixels wide.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page and the left panel is showing.\n"
        "4. There are enough work orders in the list that it has to be scrolled to see them all."
    ),
    steps=(
        "1. In the small month calendar at the top of the left panel, click a date that is not today.\n"
        "2. In the Search work orders box, type part of a customer name so that the list of work orders narrows.\n"
        "3. Scroll the work order list down a little way.\n"
        "4. Click one of the work order cards, so the panel swaps from the list of work orders to that order's "
        "list of lines.\n"
        "5. Click the panel button above the grid, to the left of Today, to hide the left panel.\n"
        "6. Click the same button again to show the panel.\n"
        "7. Check each of the four things you set up in steps 1 to 4."
    ),
    expected=[
        "The panel comes back showing the same things you left in it. Nothing has been reset, cleared or "
        "reloaded from scratch - while it was hidden its contents were only out of sight, not thrown away.",
        "The date you picked in the small month calendar is still the selected date.",
        "The text you typed is still in the Search work orders box, and the list is still narrowed by it.",
        "The list is still scrolled to roughly the position you left it at.",
        "The panel comes back showing that work order's lines, not the full list of work orders - it returns "
        "to whichever of the two views was open when you hid it.",
        "The work order you had opened is still the selected one.",
    ],
    notes_extra=[NOTBUILT],
    anchors="§5.3 Panel collapse and §3.1 Left panel: work order sidebar",
    refs="SV-8686 (§5.3 Panel collapse - State preservation; §3.1 - without losing panel state)",
    spec_ref="specification v27 §5.3 Panel collapse (State preservation bullet); §3.1 Left panel: work order sidebar",
    notes=(
        "Authored 2026-08-11. Covers §5.3-L192.A1/A2/A3/A4 and the state half of §3.1-L44.A1 ('without losing "
        "panel state'). The specification's 'whichever panel mode was active' means the work order list or the "
        "line drill-down, the two modes §3.1 defines; expected item 5 says that in plain words rather than "
        "using the word 'mode'. Build labels taken live from v3.5-af3a6e1: the search box placeholder is "
        "'Search work orders' and the drill-down's back control is labelled 'Back to work orders'. "
        "NOT BUILT - see SCH-PANEL-01's note for the three-way proof."
    ),
))

# ---------------------------------------------------------------- SCH-PANEL-04
C.append(dict(
    id="SCH-PANEL-04", area="Edge Cases and Responsiveness", section_id=4280,
    title="On a narrow window the panel button still works and your choice holds",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page."
    ),
    steps=(
        "1. Make the browser window narrower than 960 pixels wide. (The panel folding itself away on its own "
        "at that width is checked by a separate test - this test is about the button.)\n"
        "2. Find the panel button at the far-left end of the row of buttons above the grid and click it.\n"
        "3. Keep the window at that narrow width and carry on using the page - click a couple of dates in the "
        "small month calendar and scroll the grid.\n"
        "4. Now make the browser window wider again, back over 960 pixels."
    ),
    expected=[
        "The panel button still works on a narrow window: it is not hidden, greyed out or unresponsive below "
        "960 pixels, and clicking it shows the left panel by hand even at that width.",
        "The panel stays as you set it while you keep working at that width - moving around the page does not "
        "undo your choice.",
        "Your choice only stops applying when the window is resized back across the 960 pixel mark; at that "
        "point the page goes back to deciding for itself whether the panel is shown.",
    ],
    notes_extra=[NOTBUILT],
    anchors="§5.3 Panel collapse, Narrow viewports",
    refs="SV-8686 (§5.3 Panel collapse - Narrow viewports; toggle works at any width and the manual choice holds until the next resize)",
    spec_ref="specification v27 §5.3 Panel collapse (Narrow viewports bullet); §11 Responsiveness",
    notes=(
        "Authored 2026-08-11. Covers §5.3-L193.A2 and §5.3-L193.A3 ONLY. The first sentence of the same "
        "bullet - 'Below the 960px minimum supported width the panel auto-collapses' - restates §11 and is "
        "already covered by SCH-EDGE-02 = C30086, so it is deliberately NOT re-asserted here (Rule 45(e): no "
        "duplicate coverage). Filed in Edge Cases and Responsiveness rather than Grid Toolbar so it sits "
        "beside C30086, which covers the other half of the same bullet. "
        "Related known issue, recorded but NOT re-asserted: on v3.5-af3a6e1 the panel does not fold away on "
        "its own at any width - measured at 959, 900, 760 and 600 pixels on fresh page loads, the panel stayed "
        "275 pixels wide and visible while the grid shrank instead. That is C30086's assertion and it is "
        "already ticketed as SV-8942, which C30086 names. NOT BUILT for the toggle half - see SCH-PANEL-01."
    ),
))

# ---------------------------------------------------------------- SCH-PANEL-05
C.append(dict(
    id="SCH-PANEL-05", area="Grid Toolbar", section_id=4273,
    title="Menus and pop-up windows reposition when the left panel is hidden",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser, with the window at least 960 pixels wide.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page, the left panel is showing, and there is at least one shift in the grid."
    ),
    steps=(
        "1. With the left panel still showing, open something that pops open over the page - for example click "
        "a shift in the grid to open its details window.\n"
        "2. Note where it sits on the screen, then close it.\n"
        "3. Click the panel button above the grid, to the left of Today, to hide the left panel.\n"
        "4. Open the same pop-up again.\n"
        "5. Look at where it sits on the screen now."
    ),
    expected=[
        "With the panel hidden, the pop-up no longer keeps clear of the space the panel used to take up. It "
        "sits against the edge of the browser window with a normal margin instead.",
        "The whole pop-up is on screen: nothing is cut off at an edge, pushed outside the window, or left "
        "floating with a large empty gap beside it.",
        "The pop-up behaves normally otherwise - you can read it, use its buttons, and close it.",
    ],
    notes_extra=[NOTBUILT],
    anchors="§5.3 Panel collapse, Popovers and modals",
    refs="SV-8686 (§5.3 Panel collapse - Popovers and modals)",
    spec_ref="specification v27 §5.3 Panel collapse (Popovers and modals bullet)",
    notes=(
        "Authored 2026-08-11. Covers §5.3-L194.A1. The specification's wording is 'Anything that positions "
        "itself clear of the panel falls back to a normal viewport margin while the panel is collapsed'; the "
        "case states that as the observable outcome a non-technical tester can check - the pop-up stops "
        "leaving the panel's space clear, and none of it ends up off screen. Kept as its own case rather than "
        "folded into SCH-PANEL-02 because the failure it catches is different: a dialog rendering half off "
        "screen is a separate reportable bug from the panel failing to close. NOT BUILT - see SCH-PANEL-01."
    ),
))

# ---------------------------------------------------------------- SCH-PANEL-06
C.append(dict(
    id="SCH-PANEL-06", area="Grid Toolbar", section_id=4273,
    title="Hiding the panel lasts for the rest of your sign-in but is not saved",
    preconditions=(
        "1. You are signed in to the ShopView App on a desktop browser, with the window at least 960 pixels wide.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You are on the Schedule page and the left panel is showing.\n"
        "4. You know the password for the account you are signed in with, because this test signs out and back in.\n"
        "5. For the last step only, you also need a SECOND sign-in for a different person who can see the "
        "Schedule. If you do not have one, do steps 1 to 6 and mark the last point Blocked rather than guessing."
    ),
    steps=(
        "1. Click the panel button above the grid, to the left of Today, to hide the left panel.\n"
        "2. Go to another page - for example Work Orders - and then come back to Schedule.\n"
        "3. Check whether the left panel is hidden or showing.\n"
        "4. Sign out of the ShopView App completely.\n"
        "5. Sign back in with the same account and open Schedule.\n"
        "6. Check whether the left panel is hidden or showing.\n"
        "7. On a different computer or a private browsing window, sign in as the second person, open Schedule, "
        "and check whether their left panel is hidden or showing."
    ),
    expected=[
        "At step 3, still in the same sign-in, the left panel is still hidden. The choice is remembered while "
        "you stay signed in.",
        "At step 6, after signing out and back in, the left panel is showing again. The choice is not carried "
        "over into a new sign-in: it is a working-mode preference for the session you are in, not a saved view "
        "setting.",
        "At step 7, the second person's left panel is showing as normal. Your choice applied only to you and "
        "did not change what anybody else sees.",
    ],
    notes_extra=[
        "Still to be confirmed, and it affects the second point above. The product owner's description of "
        "7 August says this choice lasts only for the current sign-in. Separately, the design review of "
        "5 August asks for the Schedule's view settings to be stored per user so they survive signing out and "
        "back in. Those are two different promises. The question has been put to the product owner and has "
        "not been answered yet, so the second point follows the written specification for now. If the answer "
        "is that it should survive signing out, the second point will change.",
        NOTBUILT,
    ],
    anchors="§5.3 Panel collapse, Persistence",
    refs="SV-8686 (§5.3 Panel collapse - Persistence; session-scoped per user for build)",
    spec_ref="specification v27 §5.3 Panel collapse (Persistence bullet)",
    notes=(
        "Authored 2026-08-11. Covers §5.3-L195.A2 ('Session-scoped per user for build - this is a "
        "working-mode preference, not a saved view'). The sibling assertion §5.3-L195.A1 ('Persistence. Not "
        "persisted in the prototype.') is NOT covered by any case and is not a gap: it describes the "
        "PROTOTYPE's behaviour, not a requirement on the build, and the very next clause states the build "
        "requirement this case asserts. "
        "OPEN QUESTION, cited on the case itself per Rule 58: §5.3 says session-scoped, while item E12 of the "
        "5 August design review asks for view settings stored per user so they survive across sessions. The "
        "ambiguity is NOT resolved from the build - the case follows the specification and says so. Already "
        "drafted as item S-2 of build/schedule/coverage-rederivation-2026-08-10/QUESTIONS-FOR-BRANKO.md, "
        "which has still not been sent. "
        "TWO reasons for HOLD, not one: the control is not built, AND step 4 needs a second sign-in on this "
        "estate, which we deliberately do not take because quick-login and switch-user rotate the shared "
        "session token and a sibling worker is live."
    ),
))

out = []
for c in C:
    out.append(dict(
        id=c["id"], area=c["area"],
        title=c["title"], priority="Medium", type="Functional",
        permissions_required="Schedule: View (spec §14.1)",
        preconditions=c["preconditions"], steps=c["steps"],
        expected=build_expected(c["expected"], c["notes_extra"], c["anchors"]),
        design_ref="None - Schedule is a spec-only project (no Figma).",
        spec_ref=c["spec_ref"], refs=c["refs"],
        viu_status="VIU-Blocked-NotBuilt", notes=c["notes"],
        api_related=False, testrail_case_id=None, section_id=c["section_id"],
    ))

dst = os.path.join(os.path.dirname(__file__), "..", "..", "cases", "cases-J-panel-collapse.json")
json.dump(out, open(dst, "w"), indent=1, ensure_ascii=False)
print("wrote", len(out), "cases ->", os.path.normpath(dst))
for c in out:
    print(f"  {c['id']:<14} sec={c['section_id']}  len(title)={len(c['title']):<3} {c['title']}")
    assert len(c["title"]) <= 80, "title too long"
    assert "," not in c["refs"], "refs must be comma-free (TestRail splits on commas)"
    assert c["expected"].rstrip().endswith(MARKER), "marker must be last"
    assert c["expected"].count("AUTOMATION:") == 1, "exactly one marker"
    assert c["expected"].count("This is the expected behaviour") == 1, "exactly one provenance line"
print("\nall assertions passed")
