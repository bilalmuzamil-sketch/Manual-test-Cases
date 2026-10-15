"""New case (15 Oct 2026): S6-R2a as reworded in PRD version 53/54 — List's status pills keep production's sizes, including
the matching widths down the column, and Tech View's pill takes the same widths. Goes in "Design — how it looks" (73780)."""
from common import *
from docparts import *
from part_older_a import PRE_ADMIN, PRE_CLEAR, CLEAR_DOC, pre_tech, src

NEW = [{
    "key": "N-S6R2a-pill-widths", "section_id": 73780,
    "title": "List status pills keep matching widths and Tech View pills take the same widths",
    "preconditions": [PRE_ADMIN,
                      "Your browser window is 1440 px wide, with the browser zoom at 100%.",
                      pre_tech("Technician-A", "ZZAUTOTEST S6 Pia Pills"),
                      "Customer {Customer-A} (for example \"ZZAUTOTEST S6 Pill Widths\") is used by this case only and has two work "
                      "orders led by {Technician-A}: {Work-order-1} (for example S10043-17781), Approved, and {Work-order-2} (for "
                      "example S10043-17782), Ready For Review.",
                      PRE_CLEAR],
    "steps": ["Open Work Orders, click the All tab and click List in the display switcher.",
              "Type the name of {Customer-A} in Search.",
              "Look at the status pills of {Work-order-1} (Approved) and {Work-order-2} (Ready For Review), one above the other in the Status column, and compare their widths.",
              "Click Tech View in the display switcher.",
              "Look at the same two pills in {Technician-A}'s group and compare their widths with List's.",
              "Click the density button and choose Compact, and look at the two pills.",
              "Click the density button and choose Comfortable, and look at the two pills.",
              "Click the density button and choose Regular.",
              "Click List in the display switcher and look at the two pills again."],
    "results": ["Step 3: the two pills are the same width: the Approved pill is as wide as the Ready For Review pill, as the pills down "
                "the Status column are in production today. Neither pill is narrowed to fit its own word.",
                "Step 5: in Tech View the two pills have the same widths as in List at step 3.",
                "Steps 6 and 7: changing density changes only the pills' height (16 px at Compact, 22 px at Comfortable); their "
                "widths stay the same as in List.",
                "Step 9: List's pills look exactly as at step 3; Tech View's density did not change them."],
    "source": src("stories SV-10049 (Story 6, Density), SV-10045 (Story 2, Tech View)", "S6-R2a and S2-R19", answers=(15,),
                  extra="S6-R2a was reworded in version 53 on 15 Oct 2026 (Chris Ward ruling on Slavcho Mitrov's question on "
                        "SV-11310, from production screenshots: List's status pills must match production's sizes exactly, including "
                        "the matching widths down the column, and Tech View's pill takes the same widths). Related open ticket: "
                        "SV-11310 (staging sizes each pill to its text). Not yet checked against a build."),
    "quotes": [q("S6-R2a"), q("S2-R19")],
    "marker": MARKER_HOLD,
    "doc_part1": [SIGNIN, LOCATION, "Set the browser window to 1440 px wide with the zoom at 100%.",
                  tech("Technician-A", "ZZAUTOTEST S6 Pia Pills"),
                  customer("Customer-A", "ZZAUTOTEST S6 Pill Widths"),
                  wo("Work-order-1", "Customer-A", "S10043-17781", lead="Technician-A"),
                  wo("Work-order-2", "Customer-A", "S10043-17782", lead="Technician-A") + " Then click the line's Complete button, "
                  "type a Tech Story (fill any missing detail it asks for, for example Mileage) and click Complete Line. The status "
                  "reads Ready For Review.",
                  CLEAR_DOC,
                  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows {Work-order-1} Approved "
                  "and {Work-order-2} Ready For Review, both led by {Technician-A}. Then empty Search."],
    "doc_part2": ["Goal: two status pills of different words one above the other; compare their widths in List and Tech View at three densities.",
                  "Read each pill's bounding box (getBoundingClientRect width and height) in List and Tech View at each density; List's "
                  "two widths must be equal, Tech View's equal to List's, Tech View's height 16/16/22 px.",
                  PART2_EVIDENCE],
    "why": "PRD v53/v54 S6-R2a (15 Oct 2026): List's pills keep production's sizes, matching widths down the column; Tech View's "
           "pill takes the same widths. No existing case checked the widths (SV-11310 is open)."}]
