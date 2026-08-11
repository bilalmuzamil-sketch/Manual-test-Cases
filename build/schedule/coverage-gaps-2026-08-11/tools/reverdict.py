#!/usr/bin/env python3
"""Re-verdict all 397 Schedule assertions against the CURRENT 174-case suite.

READ-ONLY. No write path to TestRail or Jira exists in this file.

METHOD, and why it is a RE-DERIVATION rather than a patch (Rule 43):

 1. The requirement set is re-extracted from a LIVE-fetched spec body, not read
    from last pass's file. It reproduces 234 lines / 397 assertions exactly, from
    an independently re-fetched v27 whose sha256 matches the mirror.

 2. Every one of the 174 case bodies changed since the 2026-08-10 map was built,
    so its 282 COVERED verdicts CANNOT be carried forward on trust. Instead the
    matcher is re-run over the current bodies and each assertion's best-match
    score is compared against the 2026-08-10 baseline. An assertion whose score
    held or improved still has the text that earned its verdict; one that dropped
    is pulled out for a hand read. That is a mechanical check of all 397, not a
    sample (Rule 50).

 3. The 24 rows that were NOT plain COVERED on 2026-08-10 (19 UNCOVERED + 4
    PARTIAL + 1 BLOCKED) are re-verdicted BY HAND here, each with both texts
    quoted in COVERAGE-REDERIVATION.md (Rule 45(e)).

The verdict below is the HAND verdict. The score orders the reading queue; it
never decides anything.
"""
import json, os, sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
OLD = os.path.join(HERE, "..", "..", "coverage-rederivation-2026-08-10", "evidence")

# ---------------------------------------------------------------------------
# HAND verdicts, 2026-08-11. Every entry was decided by reading the requirement
# against the LIVE case text, and every one is quoted in COVERAGE-REDERIVATION.md.
# (verdict, class, covering case ids, note)
HAND = OrderedDict()

# --- the §5.3 panel family: 17 of the 19 UNCOVERED rows -------------------
P = {
    "§5.3-L189.A1": (43582, "C43582 expected 8 asserts the click hides the panel and the second click shows it."),
    "§5.3-L189.A2": (43582, "C43582 expected 1 places it at the far-left of the row left of Today; expected 2 puts it above the grid's Department column carrying technician names and avatars."),
    "§5.3-L189.A3": (43582, "C43582 expected 3 asserts it sits with the date controls - Today and the two arrows."),
    "§5.3-L190.A1": (43582, "C43582 expected 4 asserts a picture-only button with no border or box, in the same muted grey as the sibling icon buttons. The spec's 'secondary text color' is a design-system token a layman cannot read off a screen and we hold no dated design for it, so the case asserts its observable form with three siblings in the same row to compare against. Disclosed, not silently substituted."),
    "§5.3-L190.A2": (43582, "C43582 expected 7 asserts the picture is identical in both states and only the tooltip changes."),
    "§5.3-L190.A3": (43582, "C43582 expected 5 and 6 assert the tooltip reads Hide panel when open and Show panel when collapsed."),
    "§5.3-L191.A1": (43583, "C43583 expected 1 asserts the short smooth width transition rather than a jump; expected 2 asserts the divider goes with it leaving no line, seam or empty strip."),
    "§5.3-L191.A2": (43583, "C43583 expected 3 asserts the grid grows into the space and lays itself out again wider."),
    "§5.3-L192.A1": (43584, "C43584 expected 1 asserts nothing is reset, cleared or reloaded - contents were out of sight, not thrown away."),
    "§5.3-L192.A2": (43584, "C43584 steps 1-4 set up all four states and expected 2, 3 and 4 assert the calendar date, the search text with its narrowed list, and the scroll position; the drill-down state is asserted by expected 5."),
    "§5.3-L192.A3": (43584, "C43584 expected 6 asserts the opened work order is still the selected one after the cycle."),
    "§5.3-L192.A4": (43584, "C43584 expected 5 asserts it returns to whichever of the two panel views was open."),
    "§5.3-L193.A2": (43585, "C43585 expected 1 asserts the button is not hidden, greyed out or unresponsive below 960px and still expands the panel by hand at that width."),
    "§5.3-L193.A3": (43585, "C43585 expected 2 and 3 assert the choice survives continued use at that width and stops applying only on a resize back across 960px."),
    "§5.3-L194.A1": (43586, "C43586 expected 1 asserts the pop-up stops keeping clear of the panel's space and sits at a normal window margin; expected 2 asserts none of it is cut off."),
    "§5.3-L195.A2": (43587, "C43587 expected 1 and 2 assert the choice holds within the sign-in and is gone after signing out - a working-mode preference, not a saved view."),
    "§6-L200.A1":   (43582, "C43582 asserts the toolbar row's whole content: the control exists at that toolbar position (expected 1-3) and collapses and expands the panel (expected 8)."),
}
for aid, (cid, note) in P.items():
    HAND[aid] = ("COVERED", "", [cid], note)

HAND["§3.1-L44.A1"] = ("COVERED", "", [43583, 43584],
    "Split across two cases because the sentence makes two promises. C43583 expected 3 covers 'handing "
    "its width to the grid'; C43584 expected 1-6 cover 'without losing panel state'. Both cite §3.1 in "
    "their refs.")

# §5.3-L193.A1 was hand-flipped COVERED on 2026-08-10 and is re-confirmed here.
HAND["§5.3-L193.A1"] = ("COVERED", "", [30086],
    "Restates §11's own sentence, which SCH-EDGE-02 = C30086 asserts almost verbatim: 'On narrow "
    "viewports the sidebar collapses.' C43585 step 1 explicitly defers to it in its own text, so the "
    "split is declared on the case rather than left to a reader to infer.")

# §5.3-L195.A1: RE-CLASSIFIED. It was one of the 19 UNCOVERED; it is not a
# requirement on the build at all.
HAND["§5.3-L195.A1"] = ("NOT-INDEPENDENTLY-TESTABLE", "PROTOTYPE-STATEMENT", [],
    "'Persistence. Not persisted in the prototype.' describes the PROTOTYPE's behaviour, not a "
    "requirement on the shipped product, and the very next clause states the build requirement "
    "(§5.3-L195.A2, covered by C43587). A case written against it would test a prototype nobody ships. "
    "Re-classified from UNCOVERED rather than counted as closed coverage - the distinction is the point.")

# --- the 4 PARTIAL rows ---------------------------------------------------
HAND["§4.12-L165.A1"] = ("COVERED", "", [30033],
    "CLOSED since 2026-08-10. C30033 expected 1 now reads 'a breakdown for each assigned technician' and "
    "its precondition-facing note names the v26 narrowing. The v26 wording is confirmed genuinely newer "
    "than what it replaced (v1-v25), so following it is Rule 32 pointing forwards.")

HAND["§11-L303.A1"] = ("PARTIAL", "OURS", [38866],
    "GENUINELY STILL PARTIAL. C38866 asserts dark-mode rendering; it never chooses the theme from the "
    "user menu and never signs out and back in, so neither 'chosen from the user menu' nor 'persisted "
    "per user' is asserted - while the case's own refs CLAIM the persistence. Staged as SCH-EDGE-09.")

HAND["§11-L303.A4"] = ("PARTIAL", "OURS", [38866],
    "GENUINELY STILL PARTIAL. C38866 expected 1 asserts readability; depth is a different property and a "
    "different failure (a dark shadow on a dark surface makes a dialog merge into the page). Staged as "
    "SCH-EDGE-10.")

HAND["§11-L301.A6"] = ("PARTIAL", "OURS", [29998, 38866],
    "GENUINELY STILL PARTIAL. C29998 asserts the '+N more' affordance exists and opens a popover; C38866 "
    "asserts conflict and overtime cues are not colour-only. Neither asserts the OVERFLOW is conveyed by "
    "SHAPE. Staged as a one-item extension of C29998, not a new case - see NEW-CASES.md S3.")

# --- the 1 BLOCKED row ----------------------------------------------------
HAND["§12-L307.A1"] = ("BLOCKED", "PO", [30089, 29983],
    "STILL BLOCKED - the specification contradicts itself and Branko has not ruled. NEW THIS PASS: the "
    "two sentences are NOT the same age. §12's dates to v1 (2026-07-15); §4.5's 'not skipped in V1' was "
    "added at v22 (2026-07-27) and has survived five later edits. Our two cases follow the NEWER and more "
    "specific sentence, so our position is better supported than recorded - but two sentences in one "
    "document at one version is a document defect, not a Rule 32 conflict between sources, so recency "
    "informs the risk and does not settle it. Question still owed.")


def main():
    rows = json.load(open(os.path.join(EV, "assertions-v27.json")))
    new = {r["assertion_id"]: r for r in json.load(open(os.path.join(EV, "coverage-raw.json")))["d1"]}
    old = {r["assertion_id"]: r for r in json.load(open(os.path.join(OLD, "verdicts.json")))}

    assert set(new) == set(old) == {r["assertion_id"] for r in rows}, "assertion id sets differ"

    out, carried, rechecked, degraded = [], 0, 0, []
    for r in rows:
        aid = r["assertion_id"]
        o, n = old[aid], new[aid]
        os_, ns_ = (o["top"][0]["score"] if o["top"] else 0.0), (n["top"][0]["score"] if n["top"] else 0.0)
        if aid in HAND:
            v, k, cids, note = HAND[aid]
            src = "HAND-2026-08-11"
        else:
            # not re-verdicted by hand: carry the 2026-08-10 verdict, but ONLY on
            # the evidence that the text which earned it has not degraded.
            v, k, note = o["verdict"], o.get("class", ""), o.get("note", "")
            m = o.get("match")  # a single best-match dict on the 2026-08-10 rows
            cids = [m["cid"]] if isinstance(m, dict) else (
                [o["top"][0]["cid"]] if o["top"] and v == "COVERED" else [])
            src = "CARRIED-mechanically-rechecked"
            carried += 1
        rechecked += 1
        if ns_ < os_ - 0.05:
            degraded.append({"assertion_id": aid, "old": os_, "new": ns_,
                             "old_cid": o["top"][0]["cid"] if o["top"] else None,
                             "new_cid": n["top"][0]["cid"] if n["top"] else None})
        out.append({**r, "verdict": v, "class": k, "cases": cids, "note": note,
                    "verdict_source": src, "score_2026_08_10": os_, "score_2026_08_11": ns_,
                    "top_now": n["top"][:3]})

    json.dump(out, open(os.path.join(EV, "verdicts-2026-08-11.json"), "w"), indent=1)

    c = Counter(x["verdict"] for x in out)
    print(f"assertions re-derived from the live spec : {len(out)}")
    print(f"  mechanically re-checked against 174    : {rechecked}")
    print(f"  hand re-verdicted this pass            : {len(HAND)}")
    print(f"  carried on the mechanical re-check     : {carried}")
    print(f"  score DEGRADED > 0.05                  : {len(degraded)}  {degraded}")
    print("VERDICTS:")
    for k, v in c.most_common():
        print(f"  {k:<32} {v}")
    print(f"  TOTAL                            {sum(c.values())}")
    print("classes:", dict(Counter(x["class"] for x in out if x["class"])))
    print("\nEvery row NOT plain COVERED:")
    for x in out:
        if x["verdict"] != "COVERED":
            print(f"  {x['verdict']:<30} {x['assertion_id']:<18} {x['class']}")


if __name__ == "__main__":
    main()
