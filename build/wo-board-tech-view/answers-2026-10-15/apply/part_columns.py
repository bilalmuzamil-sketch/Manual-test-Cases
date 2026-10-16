"""Tech View column cases already in the Rule 117 layout: C96927 (answer 25, new S5-R4a: three columns locked on) and three
cases whose S5-R4 quote changed wording only (answer 14 added the heading words; their expected results are unchanged)."""
from common import *


def c96927():
    p = base(96927)
    assert len(p["steps"]) == 16
    p["steps"] += [
        "Click the Column Selection button and try to turn off Status, then Number, then Customer.",
        "Turn Unit off.",
        "Close the menu and read the Tech View column headers.",
        "Click the Column Selection button, turn Unit on and close the menu.",
    ]
    p["results"] += [
        "Step 17: Status, Number and Customer cannot be turned off: each is either not in the menu or shown switched on and "
        "locked, and all three stay in the Tech View table.",
        "Step 19: the Unit column no longer shows in Tech View, while Status, Number and Customer still show.",
    ]
    p["source"] = v54_source(p["source"], answers=(14, 25), changed=True,
                             extra="S5-R4a was added in version 54 on 15 Oct 2026 from answer 25; S5-R4 gained the sentence on heading words (answer 14).")
    requote(p, "S5-R4")
    p["quotes"].insert(2, q("S5-R4a"))
    return finish(p, title="Tech View's column menu offers List's columns and Assigned Techs, three stay on",
                  summary="Answer 25 / PRD v54 S5-R4a: Status, Number and Customer cannot be turned off in Tech View, Unit can "
                          "(new steps 17-20). Re-quoted S5-R4, added S5-R4a. Marker stays HOLD (not yet build-verified).")


def _s5r4_only(cid):
    p = base(cid)
    if cid == 368141:   # developer note moved out of the tester's view; the setup Doc Part 2 already carries it (16 Oct)
        p["preconditions"] = [x for x in p["preconditions"] if not x.startswith("Developer note kept from the automation engineer")]
    p["source"] = v54_source(p["source"], answers=(14,), changed=False,
                             extra="In version 54 S5-R4 gained one sentence (column headings use List's labels, for example Unit, and Assigned Techs); the default columns and their order are unchanged, so the expected results are unchanged.")
    requote(p, "S5-R4")
    return finish(p, changed=False, summary="Re-quoted S5-R4 from v54 (one sentence on heading words added, answer 14). "
                                            "Expected unchanged; no retest.")


def c96979(): return _s5r4_only(96979)
def c96983(): return _s5r4_only(96983)
def c368141(): return _s5r4_only(368141)


COLUMNS_CHANGED = [c96927]
COLUMNS_QUOTE_ONLY = [c96979, c96983, c368141]
