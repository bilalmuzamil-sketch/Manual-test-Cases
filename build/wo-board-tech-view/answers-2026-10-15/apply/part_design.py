"""Design cases ("Design — how it looks", section 73780) changed by Chris Ward's answers 12-31 (PRD version 54)."""
from common import *

DESIGN_CHIPS = [
    ["Design — _ds_bundle.js (design library), Work Orders filter chip Status icon", 'id: "status", icon: SVIcons.ICON_LOAD, label: "Status",'],
    ["Design — _ds_bundle.js (design library), Work Orders filter chip Assigned to me icon", 'id: "mine", icon: svGlyph("clipboard-list", 16), label: "Assigned to me",'],
    ["Design — _ds_bundle.js (design library), Work Orders filter chip Asset on site icon", 'id: "asset", icon: SVIcons.ICON_TRUCK, label: "Asset on site",'],
    ["Design — _ds_bundle.js (design library), spinner icon", 'ICON_LOAD: lazyGlyph("loader"),'],
    ["Design — _ds_bundle.js (design library), Search icon", 'ICON_SEARCH: lazyGlyph("search", 20),'],
]


def c590110():
    p = base(590110)
    p["steps"] = [
        "Open Work Orders from the top menu and click the All tab.",
        "Click List in the display switcher at the right of the toolbar.",
        "Look at the three buttons of the display switcher.",
        "Look at the icon in the Search box and the icons on the Status, Assigned to me and Asset on Site filters, and compare them with the Tech View design picture.",
        "Click Tech View in the display switcher.",
        "Look at the display switcher, the density button and the Column Selection button, and compare them with the Tech View design picture.",
        "Look at the icon in the Search box and the icons on the filters.",
        "Click the density button.",
        "Look at the menu that opens.",
        "Press Escape.",
        "Click Board View in the display switcher.",
        "Look at the display switcher and the density button, and compare them with the Board View design picture.",
        "Look at the icon in the Search box and the icons on the filters.",
        "Click List in the display switcher.",
        "Look at the other icons in List's toolbar.",
    ]
    r = p["results"]
    assert r[0].startswith("Step 3:") and r[1].startswith("Step 5:") and r[2].startswith("Step 7:") and r[3].startswith("Step 10:") and r[4].startswith("Step 12:")
    p["results"] = [
        r[0],
        "Step 4: the Search box shows a magnifier, and the filters show the design's thin outline icons, as in the design picture: "
        "a circle of short strokes on Status, a clipboard with lines on Assigned to me and a truck on Asset on Site. They are drawn "
        "in the same thin outline style as the switcher icons, not filled icons, emoji or text characters.",
        r[1].replace("Step 5:", "Step 6:", 1),
        "Step 7: the Search box and the filters show the same icons as in List at step 4.",
        r[2].replace("Step 7:", "Step 9:", 1),
        r[3].replace("Step 10:", "Step 12:", 1),
        "Step 13: the Search box and the filters show the same icons as in List at step 4.",
        "Step 15: apart from the Search and filter icons, the icons in List's toolbar look the same as in List in production "
        "today. The only other change to List is the display switcher.",
    ]
    p["source"] = v54_source(p["source"], answers=(12, 21, 24), changed=True)
    p["divergence"] = ("Until 15 Oct 2026 the PRD (version 52) left every List icon unchanged, so this case did not judge the filter "
                       "icons. Chris Ward answered on 15 Oct 2026 (answer 12) that the filter chips and Search use the design file's "
                       "icons in every display option, List included, and (answer 21) that today's tabs, toolbar and Create Work Order "
                       "button stay. PRD version 54 says so, and this case follows it. The design names the three options Table, By "
                       "Lead Tech and Board; PRD version 54 keeps List, Tech View and Board View (answer 24). The Technician filter's "
                       "wrench icon is checked in the Technician filter design case.")
    requote(p, "S1-R9a")
    requote_goals(p)
    p["quotes"] += DESIGN_CHIPS
    return finish(p, title="Display switcher, filter and Search icons match the design in every display",
                  summary="Answer 12 / PRD v54 S1-R9a and Goals: the filter chips and Search now use the design's icons in every "
                          "display, List included (was: not judged). Steps 4, 7 and 13 added to check them in List, Tech View and "
                          "Board View; step 15 now excludes them from 'List unchanged'. Re-quoted S1-R9a and Goals from v54; "
                          "design chip icons quoted. Marker back to HOLD until re-run.")


def c590111():
    p = base(590111)
    r = p["results"]
    assert r[0].startswith("Steps 2 to 4:") and r[1].startswith("Step 6:") and r[2].startswith("Step 9:")
    p["results"] = [
        r[0] + " The tooltips read List (step 2), Tech View (step 3) and Board View (step 4).",
        "Step 6: in Board View each tooltip also opens above the switcher, reads List, Tech View or Board View, and covers none of "
        "the column headers (technician names and counts).",
        r[2],
    ]
    p["source"] = v54_source(p["source"], answers=(24,), changed=True)
    p["divergence"] = ("The design shows only the browser's own hover text on the switcher (Table, By Lead Tech, Board). Chris Ward "
                       "answered on 15 Oct 2026 (answer 24) that the tooltips read List, Tech View and Board View; PRD version 54 says "
                       "so, and this case now checks the words as well as the position.")
    requote(p, "S1-R9b")
    return finish(p, title="Switcher tooltips read List, Tech View, Board View and open above it",
                  summary="Answer 24 / PRD v54 S1-R9b: the tooltip words are now judged (List, Tech View, Board View); steps 2-4 "
                          "and 6 results say so. Re-quoted S1-R9b. Marker back to HOLD until re-run.")


def c590112():
    p = base(590112)
    r = p["results"]
    assert r[3].startswith("Step 5:")
    r[3] = ("Step 5: the table scrolls sideways inside the page (a horizontal scroll bar shows) and each header label stays above "
            "its own column while you scroll. No column is squeezed narrower than its content or cut off to make the table fit.")
    p["source"] = v54_source(p["source"], answers=(13, 21), changed=True)
    p["divergence"] = ("With the design's default columns the table is about 1,790 px wide, so it scrolls sideways at 1440 and 1536 "
                       "px in the design too. Chris Ward answered on 15 Oct 2026 (answer 13) that sideways scrolling is fine, as in "
                       "the design, and columns keep the design's minimum widths and are never squeezed or clipped; PRD version 54 "
                       "says so, and this case follows it.")
    requote(p, "S2-R22")
    requote_goals(p)
    return finish(p, summary="Answer 13 / PRD v54 S2-R22: sideways scrolling confirmed, columns never squeezed or clipped (added "
                             "to step 5). Re-quoted S2-R22 and Goals. Marker back to HOLD until re-run.")


def c590115():
    p = base(590115)
    r = p["results"]
    assert r[0].startswith("Step 5:") and r[2].startswith("Steps 8 and 10:") and r[3].startswith("Step 12:")
    r[0] = ("Step 5: the pill is the same pill as in List at step 2: the same colours, the same word, the same rounded shape and "
            "the same width, with the same red and blue numbers on it.")
    r[2] = ("Steps 8 and 10: the pills are the same height at Compact and at Regular, as low as the small pills in the Compact "
            "and Regular design pictures (16 px).")
    r[3] = ("Step 12: at Comfortable the pills are taller than at Regular, as tall as the pills in the Comfortable picture "
            "(22 px), and keep the same width.")
    p["source"] = v54_source(p["source"], answers=(15,), changed=True)
    p["divergence"] = ("The PRD (version 52) said 18 px at Compact and Regular, while the design draws the small pill 16 px tall. "
                       "Chris Ward answered on 15 Oct 2026 (answer 15) that the pill is 16 px at Compact and Regular and 22 px at "
                       "Comfortable, as the design draws it; PRD version 54 corrects the size and adds that Tech View's pill takes "
                       "List's widths. This case follows version 54. List's own pill widths are checked in their own case.")
    requote(p, "S6-R2a")
    return finish(p, title="Tech View status pill is List's pill, 16 px tall, 22 px at Comfortable",
                  summary="Answer 15 / PRD v54 S6-R2a: pill 16 px at Compact and Regular (was 18 px), 22 px at Comfortable, same "
                          "width as List's pill (steps 5, 8, 10, 12). Re-quoted S6-R2a. Marker back to HOLD until re-run.")


def c590116():
    p = base(590116)
    p["steps"][1] = "Look at the left edge of every group header, the Unassigned header included."
    p["steps"][8] = "Look at the left edge of the work order rows and of the group headers."
    r = p["results"]
    assert r[0].startswith("Step 2:") and r[5].startswith("Step 9:")
    r[0] = ("Step 2: every technician group header shows a six-dot grip (two columns of three small grey dots) at its left edge, "
            "as in the design pictures. The Unassigned header shows no grip.")
    r[5] = ("Step 9: no grip shows on the work order rows for {User-B}, who cannot drag work orders. Every technician group header "
            "still shows the grip, because {User-B} can reorder technicians. The Unassigned header shows no grip.")
    p["source"] = v54_source(p["source"], answers=(16,), changed=True)
    p["divergence"] = ("The PRD (version 52) put a grip on every group header, Unassigned included, for users who can drag. Chris "
                       "Ward answered on 15 Oct 2026 (answer 16): technician group-header grips show to everyone who can reorder "
                       "technicians, view-only users included; row grips show only to users with Work Orders create and edit; the "
                       "Unassigned header has no grip. PRD version 54 says so, and this case follows it. The design shows row grips "
                       "to a view-only user too; this case follows the PRD.")
    requote(p, "S9-R1a")
    p["quotes"].insert(1, q("S9-R2"))
    return finish(p, title="Six-dot grips on Tech View rows and technician headers, none on Unassigned",
                  summary="Answer 16 / PRD v54 S9-R1a: Unassigned header has no grip (step 2); a view-only user sees grips on "
                          "technician group headers but not on rows (step 9). Re-quoted S9-R1a, added S9-R2. Marker back to HOLD "
                          "until re-run.")


def c590117():
    p = base(590117)
    r = p["results"]
    assert r[0].startswith("Step 2:") and r[1].startswith("Step 3:")
    r[0] = ("Step 2: from left to right: a thin down-pointing arrow, a round light-grey avatar holding a grey outline person icon, "
            "the word Unassigned in dark semibold text, a short grey upright divider, a clipboard outline icon and the number of "
            "work orders, as in the design picture. The Unassigned header has no six-dot grip.")
    r[1] = ("Step 3: {Technician-B}'s header starts with the six-dot grip, then the arrow. Its avatar is a light-grey circle with "
            "the initials in dark grey (for example \"ZJ\"), like \"BM\" in the design picture, not a solid blue circle with white "
            "initials. The name is dark and semibold, about the size of the row text (14 px in the design).")
    p["source"] = v54_source(p["source"], answers=(16,), changed=True)
    p["divergence"] = (p["divergence"] + " The PRD (version 52) also put a grip on the Unassigned header; Chris Ward answered on 15 "
                       "Oct 2026 (answer 16) that the Unassigned header has no grip, and PRD version 54 says so.")
    requote(p, "S1-R9a")
    p["quotes"].append(q("S9-R1a"))
    return finish(p, title="Tech View group headers show grip, arrow, avatar, name and count as designed",
                  summary="Answer 16 / PRD v54 S9-R1a: the Unassigned header has no grip (step 2 no longer lists one); technician "
                          "headers start with the grip (step 3). Re-quoted S1-R9a, added S9-R1a. Marker back to HOLD until re-run.")


def c590120():
    p = base(590120)
    p["preconditions"].insert(4, "The design pictures show the design's own tinted status badge; the product owner chose List's "
                                 "status pill for the cards, so compare the card's pill with List, not with the pictures.")
    old = p["steps"]
    assert len(old) == 6
    p["steps"] = ["Open Work Orders, click the All tab and click List in the display switcher.",
                  "Type the name of {Customer-A} in Search.",
                  "Look at {Work-order-1}'s status pill and any red or blue number on it.",
                  "Click Board View in the display switcher.",
                  old[1], old[2],
                  "Look at the status pill on {Work-order-1}'s card and compare it with the pill you saw in List at step 3.",
                  old[3], old[4], old[5]]
    r = p["results"]
    assert [x.split(":")[0] for x in r] == ["Step 2", "Step 3", "Step 4", "Step 5", "Step 6"]
    p["results"] = [
        r[0].replace("Step 2:", "Step 5:", 1),
        r[1].replace("Step 3:", "Step 6:", 1),
        "Step 7: the card's pill is the same pill as in List: the same colour, the same word, the same rounded shape, with the same "
        "red and blue numbers on it when List shows them, and it is 22 px tall, as tall as the badge on the cards in the Detailed "
        "design picture.",
        r[2].replace("Step 4:", "Step 8:", 1),
        r[3].replace("Step 5:", "Step 9:", 1).replace("as at step 3", "as at step 6"),
        r[4].replace("Step 6:", "Step 10:", 1).replace("as at step 3", "as at step 6"),
    ]
    p["source"] = v54_source(p["source"], answers=(22, 27), changed=True)
    p["divergence"] = p["divergence"].replace(
        " Whether the card's status pill is the design's pill or List's pill is open with the product owner (question PQ-V13, not "
        "yet answered), so only its place is judged.",
        " The design's card shows its own tinted badge without numbers; Chris Ward answered on 15 Oct 2026 (answer 22) that cards "
        "use List's production pill with the red and blue counts, 22 px tall, and (answer 27) that row and card text is 14 px at "
        "every density. PRD version 54 says so, and this case follows it.")
    assert "answer 22" in p["divergence"]
    p["quotes"].insert(3, q("S3-R5a"))
    p["quotes"].append(q("S6-R4"))
    return finish(p, title="Board View cards use List's status pill and keep the design's text sizes",
                  summary="Answers 22 and 27 / PRD v54 S3-R5a, S6-R4: the card's status pill is List's pill with the red and blue "
                          "counts, 22 px tall (new steps 1-4 and 7 compare it with List); text stays 14 px at every density. "
                          "Added quotes S3-R5a and S6-R4. Not yet run: first run on staging.")


def c590122():
    p = base(590122)
    r = p["results"]
    assert r[2].startswith("Step 7:") and r[3].startswith("Step 8:")
    r[2] = ("Step 7: the board is replaced by an empty state centred on the page: List's magnifier icon in a round grey circle, the "
            "title \"No work orders match these filters\", the hint \"Try removing a filter to widen your results.\" and a Clear all "
            "filters button.")
    r[3] = "Step 8: List shows the same empty state, with the same magnifier icon, words and button."
    p["source"] = v54_source(p["source"], answers=(17,), changed=True,
                             extra="Earlier answer: Chris Ward, answer 10 on the same sheet, 14 Oct 2026 (the PRD's words are right; the design is being updated).")
    p["divergence"] = ("The design's empty texts read \"No work orders assigned\" and \"No results for …\"; Chris Ward answered on 14 "
                       "Oct 2026 (answer 10) that the PRD's words are right, and this case follows them. The PRD (version 52) gave "
                       "empty states the clipboard icon while List and the design use a magnifier on the no-results page; Chris Ward "
                       "answered on 15 Oct 2026 (answer 17) that the no-results page keeps List's magnifier and the clipboard is only "
                       "for a view with no work orders at all. PRD version 54 says so, and steps 7 and 8 now check the magnifier.")
    requote(p, "S1-R9a")
    return finish(p, summary="Answer 17 / PRD v54 S1-R9a: the filtered no-results page shows List's magnifier (steps 7 and 8; "
                             "was: icon not judged). Divergence updated for answers 10 and 17. Re-quoted S1-R9a. Marker back to "
                             "HOLD until re-run.")


def c590125():
    p = base(590125)
    p["preconditions"].insert(2, "Your profile menu (click your initials, top right) offers Light and Dark, and Light is chosen "
                                 "at the start.")
    p["steps"] = [
        "Open Work Orders, click the All tab and click Tech View in the display switcher.",
        "Click your initials (top right) and click Dark.",
        "Look at Tech View and compare it with the Tech View dark design picture.",
        "Hover {Work-order-1}'s row.",
        "Click Board View in the display switcher.",
        "Look at Board View and compare it with the Board View dark design picture.",
        "Click your initials (top right) and click Light.",
    ]
    p["results"] = [
        "Step 3: the page, the table, its column header row and the group headers turn dark with light text, as in the Tech View "
        "dark picture. Every word, number, icon, status pill and grip stays readable against the dark background. No part of Tech "
        "View is left with a white background, and no text is dark on dark.",
        "Step 4: the hovered row turns a slightly lighter dark grey, as in the dark picture's hover, and its text stays readable.",
        "Step 6: the board, its columns, their headers and the cards turn dark as in the Board View dark picture. Card text, "
        "numbers, status pills and avatars stay readable, and no part of Board View is left with a white background.",
        "Step 7: Tech View and Board View return to the light look.",
    ]
    p["source"] = p["source"].replace("(no sentence about themes)", "S1-R9c (added in version 54)")
    p["source"] = p["source"].replace("Not yet checked against a build.", "Not yet checked against a build.")
    p["source"] = v54_source(p["source"], answers=(29,), changed=True)
    p["divergence"] = ("Until 15 Oct 2026 the PRD said nothing about themes and this case was on hold. Chris Ward answered on 15 Oct "
                       "2026 (answer 29) that both views are tested in the dark theme as well as light, with the design file's dark "
                       "colours; PRD version 54 adds this, and the hold is lifted.")
    p["quotes"].insert(0, q("S1-R9c"))
    return finish(p, title="Tech View and Board View look as designed in the Dark theme",
                  summary="Answer 29 / PRD v54 S1-R9c: the dark theme is in scope. The hold is lifted: steps switch to Dark from "
                          "the profile menu (seen on staging 15 Oct: Light / Dark) and compare both views with the dark design "
                          "pictures. Added quote S1-R9c. Not yet run: first run on staging.")


DESIGN_CHANGED = [c590110, c590111, c590112, c590115, c590116, c590117, c590120, c590122, c590125]
