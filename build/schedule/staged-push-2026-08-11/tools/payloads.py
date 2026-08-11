#!/usr/bin/env python3
"""The exact intended bodies for the two NEW Schedule cases (Groups 2), plus the
text-surgery rules for the three edit groups.

Nothing here calls TestRail. `exec_push.py` imports this and does the writing, so the
payload text can be reviewed on its own and diffed against the staged manifest
(build/schedule/coverage-gaps-2026-08-11/NEW-CASES.md).

TWO DELIBERATE DEPARTURES FROM THE STAGED MANIFEST, both recorded in CHANGES-MADE.md:

 1. The manifest's provenance line reads "... and the Schedule specification version 27
    (§11 Dark theme), both read on 11 August 2026." That is the pre-read-date form with a
    single trailing date, and "both" does not even match the three sources it names. All 174
    live Schedule cases now carry a READ-DATE PER CITED SOURCE (Rule 54 as amended
    2026-08-11), so these two cases are written in that form instead. The suite stays
    uniform; no source, anchor or assertion changed.

 2. Sentence 2 ("Last checked against build ... on ...") is ABSENT. No build was observed
    in this pass, so naming one would assert a check nobody made (Rule 12/54).
"""

# ---------------------------------------------------------------------------
# GROUP 2 — the two new cases. Section 4280 "Edge Cases and Responsiveness".
# ---------------------------------------------------------------------------

PROV_09 = (
    "This is the expected behaviour as per epic SV-8685, read on 11 August 2026, its story "
    "SV-8700 (requirement 5), read on 11 August 2026, and the Schedule specification "
    "version 27 (§11 Dark theme), read on 11 August 2026."
)
PROV_10 = PROV_09

SCH_EDGE_09 = {
    "internal_id": "SCH-EDGE-09",
    "section_id": 4280,
    "area": "Edge Cases and Responsiveness",
    "title": "Dark mode is chosen from the user menu and is remembered for you",
    "refs": ("SV-8700 (§11 Dark theme - chosen from user menu and persisted per user "
             "- spec v27 2026-08-07)"),
    "preconds": (
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. You know the password for the account you are signed in with, because this test "
        "signs out and back in.\n"
        "4. The app is currently in light mode."
    ),
    "steps": (
        "1. Open the menu for your own account - the one under your name or profile picture "
        "at the top of the page - and look for the light / dark theme choice in it.\n"
        "2. Use that choice to switch the app to dark mode.\n"
        "3. Open the Schedule page and check it is in dark mode.\n"
        "4. Sign out of the ShopView App completely.\n"
        "5. Sign back in with the same account and open the Schedule page again.\n"
        "6. Check whether the Schedule is in light mode or dark mode.\n"
        "7. On a different computer, or in a private browsing window, sign in with the SAME "
        "account again and open the Schedule page.\n"
        "8. Check whether the Schedule is in light mode or dark mode there too.\n"
        "9. Switch back to light mode from the same menu when you have finished, so you "
        "leave the account as you found it."
    ),
    "expected": (
        "1. The light / dark theme choice is in your own account menu at the top of the "
        "page. You do not have to go into a settings page to find it.\n"
        "2. Choosing dark mode switches the app to dark mode straight away, and the Schedule "
        "page opens in dark mode.\n"
        "3. At step 6, after signing out and signing back in, the Schedule is STILL in dark "
        "mode. Your choice was remembered.\n"
        "4. At step 8, on the other computer or in the private window, the Schedule is ALSO "
        "in dark mode. The choice is remembered against your account, not against the one "
        "browser you set it in.\n"
        "5. Switching back to light mode at step 9 works the same way and is remembered in "
        "the same way.\n"
        "\n---\n" + PROV_09 + "\n\nAUTOMATION: READY\n"
    ),
}

SCH_EDGE_10 = {
    "internal_id": "SCH-EDGE-10",
    "section_id": 4280,
    "area": "Edge Cases and Responsiveness",
    "title": "In dark mode pop-up windows still look raised above the page",
    "refs": ("SV-8700 (§11 Dark theme - elevation and shadow swap so depth reads "
             "correctly - spec v27 2026-08-07)"),
    "preconds": (
        "1. You are signed in to the ShopView App on a desktop browser.\n"
        "2. Your role has the Schedule: View permission.\n"
        "3. The app is in dark mode.\n"
        "4. You are on the Schedule page in week view, with at least one shift in the grid."
    ),
    "steps": (
        "1. Click a shift in the grid to open its details window, and look at where that "
        "window meets the page behind it.\n"
        "2. Close it, then open the View options menu from the row of buttons above the grid, "
        "and look at where that menu meets the page behind it.\n"
        "3. Rest your mouse pointer on a shift so its hover tooltip appears, and look at "
        "where the tooltip meets the page behind it.\n"
        "4. Switch the app to light mode and look at the same three things again, so you have "
        "something to compare against."
    ),
    "expected": (
        "1. In dark mode each of the three - the shift details window, the View options menu "
        "and the hover tooltip - is clearly separated from the page behind it. You can tell "
        "where it ends and the page begins.\n"
        "2. The separation comes from the pop-up itself: it sits on a slightly different "
        "shade from the page behind it, or has a visible edge or soft shadow around it.\n"
        "3. None of the three blends into the page so that its edges cannot be made out, and "
        "none of them is missing that separation entirely while the light-mode version has "
        "it.\n"
        "4. Nothing you check is unreadable, and no text or icon disappears into the "
        "background.\n"
        "\n---\n" + PROV_10 + "\n\nAUTOMATION: READY\n"
    ),
}

NEW_CASES = [SCH_EDGE_09, SCH_EDGE_10]

# ---------------------------------------------------------------------------
# GROUP 1 — the six Panel collapse cases. One sentence each.
# ---------------------------------------------------------------------------
PANEL_CASES = [43582, 43583, 43584, 43585, 43586, 43587]

#: The wrong literal, copied onto all six from C43582 (which has 8 EXPECTED RESULTS, not
#: 8 steps). The real step count is re-counted from each case's own live `custom_steps`
#: at write time -- never taken from a document.
WRONG = "steps 1 to 8 cannot be carried out"
RIGHT = "steps 1 to {n} cannot be carried out"

# ---------------------------------------------------------------------------
# GROUP 3 — C29998, one expected item appended, old item 4 renumbered to 5.
# ---------------------------------------------------------------------------
C29998_OLD_ITEM4 = "4. The hidden shifts can be opened from that popover."
C29998_NEW_ITEMS = (
    "4. You can tell the '+2 more' is something to click without relying on its colour: it "
    "carries the count as words you can read, and it is drawn as its own distinct shape - a "
    "small chip, pill or button - not just a differently coloured patch of the lane.\n"
    "5. The hidden shifts can be opened from that popover."
)
C29998_OLD_REFS = "SV-8693 (§4.7)"
C29998_NEW_REFS = ("SV-8693 (§4.7 lane cap and overflow + §11 the overflow uses "
                   "shape - spec v27 2026-08-07)")

# THE PROVENANCE LINE MUST GAIN §11 TOO -- a THIRD departure from the staged manifest,
# which said the provenance block was unchanged.
#
# The new expected item is sourced from §11 ("the overflow uses shape"), NOT from §4.7. If
# `refs` names §11 and the tester-facing provenance line does not, the case ends up
# asserting something no source it cites supports -- which is the exact Rule-54 honesty
# defect that COVERAGE-REDERIVATION.md section 8 was written to report on five other cases.
# Rule 54 outranks our own staged plan, so the anchor is extended.
#
# Sentence 2 is kept VERBATIM and is still true: the case as a whole was last checked
# against v3.5-7ec992f on 8/6/2026. The new item has never been checked against any build,
# and that is recorded in FINDINGS.md rather than being written into tester-facing text.
C29998_OLD_PROV = ("and the Schedule specification version 27 (§4.7), read on "
                   "11 August 2026.")
C29998_NEW_PROV = ("and the Schedule specification version 27 (§4.7 Overlap and lane "
                   "stacking and §11 Accessibility - the overflow uses shape), read on "
                   "11 August 2026.")

# ---------------------------------------------------------------------------
# GROUP 4 — C38866, `refs` only.
# ---------------------------------------------------------------------------
# Live value. It carries a COMMA, so TestRail stores it as TWO references, the second of
# which is the fragment "persisted per user))". It also cites the EPIC where story SV-8700
# requirement 5 states the requirement almost verbatim (Rule 20 wants per-story precision),
# and it CLAIMS an assertion the case's four steps never make -- they never sign out.
C38866_OLD_REFS = ("SV-8685 (§11 (Dark theme - user-selectable Light / Dark,"
                   "persisted per user))")
# Comma-free single entry. Names the owning story for the dark-theme assertions and, for
# the case's third assertion, the story the suite already credits with "not color-only"
# (C30032 = SV-8698). Drops the persistence claim: SCH-EDGE-09 now asserts it.
C38866_NEW_REFS = (
    "SV-8700 (§11 Dark theme - the Schedule and its dialogs render readably in dark "
    "mode and revert on switching back) and SV-8698 (§11 accessibility - overtime and "
    "conflict cues are not colour-only) - spec v27 2026-08-07"
)
