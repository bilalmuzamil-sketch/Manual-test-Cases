"""Design cases, second set: density, Reassign dialog, sticky headers, Technician filter icon (changed expected results) and
four design cases whose quoted PRD wording or settled questions changed but whose expected results did not."""
import re
from common import *


def c590128():
    p = base(590128)
    r = p["results"]
    assert [x.split(":")[0] for x in r] == ["Step 3", "Step 5", "Step 7", "Steps 3, 5 and 7", "Step 8"]
    r[0] = ("Step 3: the rows are at their lowest (36 px in the design), the avatars are smaller and the progress bars shorter and "
            "thinner (48 × 4 px in the design), as in the Compact picture. The row text is the same size as at Regular (14 px); "
            "Compact does not make it smaller.")
    r[3] = ("Steps 3, 5 and 7: the same columns and the same values show at every density, and no hours line (for example "
            "\"0.8 / 8.0 hrs\") shows under the progress bar at any density. The column header labels and the percentage beside "
            "the progress bar stay the same small size at every density.")
    p["source"] = v54_source(p["source"], answers=(18, 27), changed=True)
    p["divergence"] = ("The design's Compact row text is 13 px and the design adds the hours under the progress bar only at "
                       "Comfortable. Chris Ward answered on 15 Oct 2026 (answer 27) that row and card text is 14 px at every density "
                       "and Compact never shrinks it, while text the design sets at 12 px stays 12 px, and (answer 18) that no hours "
                       "line shows at any density. PRD version 54 says so, and this case follows it.")
    requote(p, "S6-R4")
    p["quotes"].insert(5, q("S2-R20"))
    return finish(p, title="Density changes Tech View row, avatar and bar sizes but never the text size",
                  summary="Answers 18 and 27 / PRD v54 S6-R4, S2-R20: Compact row text is 14 px like Regular (was: may be 13 px, "
                          "write down which); no hours line at any density; 12 px labels stay 12 px. Re-quoted S6-R4, added "
                          "S2-R20. Marker back to HOLD until re-run.")


def c590129():
    p = base(590129)
    r = p["results"]
    assert r[0].startswith("Step 5:")
    assert "Unassigned is offered too;" in r[0]
    r[0] = r[0].replace("Unassigned is offered too;", "Unassigned is the first row of the list, before every technician;")
    r[0] = r[0].replace("The layout matches the design picture.", "There is no grouping of the technicians. Apart from the "
                        "Unassigned row, the layout matches the design picture.")
    p["source"] = v54_source(p["source"], answers=(19,), changed=True)
    p["divergence"] = ("The PRD (version 52) listed the dialog's content, search, grouping, avatars and N open count under design "
                       "updates still required, and the design has no Unassigned row. Chris Ward answered on 15 Oct 2026 (answer 19) "
                       "that the dialog is tested as drawn (search, avatars, N open per technician, no grouping), plus Unassigned as "
                       "its first row, and that the design is final for this release. PRD version 54 says so, and this case follows "
                       "it.")
    requote(p, "S4-R12")
    return finish(p, title="Reassign lead technician dialog looks as designed, with Unassigned first",
                  summary="Answer 19 / PRD v54 S4-R12: the dialog is final as drawn, no grouping, with Unassigned as its first row "
                          "(step 5; was: Unassigned offered somewhere). Re-quoted S4-R12. Marker back to HOLD until re-run.")


def c590131():
    p = base(590131)
    p["preconditions"][4] = ("In the design picture only the column header row stays at the top and the group header scrolls "
                             "away; the PRD keeps the group header on screen, so the case follows the PRD.")
    p["preconditions"].insert(8, "At least one technician's group, with work orders in it, comes after Unassigned in Tech View.")
    p["steps"] = p["steps"] + [
        "Keep scrolling down until the next group's header reaches the Unassigned header.",
        "Keep scrolling a little further and look at the top of the table.",
    ]
    r = p["results"]
    assert len(r) == 1 and r[0].startswith("Step 3:")
    p["results"] = [
        r[0],
        "Step 5: the next group's header pushes the Unassigned header up and off, and takes its place just under the column header "
        "row. Only one group header is held under the column headings at any time.",
    ]
    p["source"] = v54_source(p["source"], answers=(20,), changed=True)
    p["divergence"] = ("The design lets the group header scroll away. Chris Ward answered on 15 Oct 2026 (answer 20) that while you "
                       "scroll through an expanded group its header stays just under the column headings, only one header is held "
                       "at a time and the next group's header pushes it off, and that Unassigned works the same way. PRD version 54 "
                       "says so, and this case follows it. The behaviour is also covered by C96935 and C368127.")
    requote(p, "S2-R18")
    requote(p, "S2-E1")
    return finish(p, title="Tech View holds one group header at a time under the column headings",
                  summary="Answer 20 / PRD v54 S2-E1, S2-R18: one group header is held at a time and the next one pushes it off "
                          "(new steps 4-5 and precondition: a technician group after Unassigned). Re-quoted S2-R18 and S2-E1. "
                          "Marker back to HOLD until re-run.")


def _base_ui(cid):
    """A case last saved from the TestRail editor (plain dash and quote marks): normalise those before parsing."""
    c = dict(ALL[cid])
    c["custom_preconds"] = c["custom_preconds"].replace("<p><br></p>", "<p></p>")
    ex = c["custom_expected"].replace("Source — where this behaviour comes from", "Source &mdash; where this behaviour comes from")
    ex = re.sub(r"(<li><strong>[^<]*:</strong> )“(.*?)”(</li>)", lambda m: m.group(1) + "&ldquo;" + m.group(2) + "&rdquo;" + m.group(3), ex)
    c["custom_expected"] = ex
    p, _ = parse(c)
    assert p and "results" in p, f"C{cid} does not parse after normalising"
    return dict(p, case_id=cid)


def c590127():
    p = _base_ui(590127)
    assert p["marker"] == "AUTOMATION: Ready"
    r = p["results"]
    assert r[0].startswith("Step 2:")
    r[0] = ("Step 2: the Technician filter sits directly after Assigned to me, showing the design's thin outline wrench icon, the "
            "word Technician and a down arrow, in the same style as the filters beside it, as in the design picture. There is no "
            "Department filter.")
    p["source"] = v54_source(p["source"], answers=(12,), changed=True)
    p["divergence"] = ("The design's Technician list has no Unassigned entry and filters by any assigned technician; this case "
                       "follows the PRD (S1-R15, added in version 52). The design gives the filter a wrench icon; Chris Ward answered "
                       "on 15 Oct 2026 (answer 12) that the filter chips use the design file's icons in every display option, and "
                       "PRD version 54 says so, so step 2 now checks the wrench icon.")
    p["quotes"].insert(2, q("S1-R9a"))
    return finish(p, summary="Answer 12 / PRD v54 S1-R9a: the Technician filter's wrench icon is now judged (step 2; was: not "
                             "judged). Added quote S1-R9a. The marker had been typed by hand as 'AUTOMATION: Ready' on 15 Oct "
                             "07:03; it is set to the exact HOLD literal (the Technician filter is not on the staging build, per "
                             "the 15 Oct staging check).")


# ---- quote/source refresh only: the expected results are unchanged, so the build check line and READY stay ----

def c590118():
    p = base(590118)
    p["source"] = v54_source(p["source"], answers=(26,), changed=False)
    p["divergence"] = ("The design's small map at the bottom right of Board View is not in the PRD; Chris Ward answered on 15 Oct "
                       "2026 (answer 26) that it is left out of this release (PRD version 54, Out of Scope), so it is not judged "
                       "here.")
    return finish(p, changed=False, summary="Answer 26: the minimap question is settled (out of scope); divergence note updated, "
                                            "source moved to PRD v54. Expected unchanged; no retest.")


def c590113():
    p = base(590113)
    p["source"] = v54_source(p["source"], answers=(14, 25), changed=False)
    p["divergence"] = ("The design's header row reads \"Unit #\" and \"Assigned Tech\"; Chris Ward answered on 15 Oct 2026 (answer "
                       "14) that the headings are Unit and Assigned Techs, and PRD version 54 says so. The design's Tech View column "
                       "chooser does not offer On Site, VIN/Serial # or Lead Technician; PRD version 54 keeps them as columns that "
                       "can be added, and this case follows the PRD. Which columns cannot be turned off (answer 25) is checked in its "
                       "own case.")
    requote(p, "S5-R4")
    return finish(p, changed=False, summary="Answers 14 and 25: questions settled, divergence note updated. Re-quoted S5-R4 from "
                                            "v54 (heading words now stated in the PRD). Expected unchanged; no retest.")


def c590114():
    p = base(590114)
    p["source"] = v54_source(p["source"], answers=(31,), changed=False)
    assert "(question W-16 to the product owner, not yet answered)" in p["divergence"]
    p["divergence"] = p["divergence"].replace(
        "this case follows the PRD, which keeps List's display (question W-16 to the product owner, not yet answered).",
        "this case follows the PRD, which keeps List's display (PRD version 51 onwards; Chris Ward confirmed on 15 Oct 2026, "
        "answer 31, that the names show as the List shows them).")
    requote(p, "S2-R20")
    requote(p, "S1-R9a")
    return finish(p, changed=False, summary="Re-quoted S2-R20 and S1-R9a from v54 (the added sentences are checked in the density "
                                            "and icon cases); Clocked In question marked settled. Expected unchanged; no retest.")


def c590119():
    p = base(590119)
    p["source"] = v54_source(p["source"], changed=False)
    requote(p, "S1-R9a")
    return finish(p, changed=False, summary="Re-quoted S1-R9a from v54 (the Board View header icons it names are unchanged). "
                                            "Expected unchanged; no retest.")


DESIGN2_CHANGED = [c590128, c590129, c590131, c590127]
DESIGN2_QUOTE_ONLY = [c590118, c590113, c590114, c590119]
