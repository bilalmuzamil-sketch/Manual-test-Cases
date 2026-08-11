#!/usr/bin/env python3
"""Payload builder for the 12 staged Schedule LABEL corrections of 2026-08-11.

Every edit is an EXACT-STRING replacement with a hard pre-assertion: if the anchor
is not present in the live text, the build raises and the batch never starts. That
is what protects this pass from a sibling's concurrent edit -- a changed anchor is
a STOP, never a silent no-op and never a blind overwrite.

SCOPE, stated so it cannot drift: LABELS AND NAVIGATION WORDING ONLY.
  * not one expected BEHAVIOUR is changed (Standing Rule 57 -- expectations come
    from the documents, and the build supplies only the labels)
  * the Rule-54 provenance line is NOT touched on any of the 12. Sentence 2 is the
    record of the build a case was last CHECKED against, and this pass observed
    nothing itself (the app session is dead, 401 sso_required). Re-stamping it to
    v3.5-65d6500 would assert a check we did not perform. See FINDINGS.md F1.
  * the automation markers are NOT touched -- no verdict changed, so no marker can.

Standing Rule 50: all three text fields go on every payload, including the
unchanged ones, because TestRail re-renders any omitted text field into
<p>-wrapped CRLF and this project shows markup literally to the tester.
"""

# ---------------------------------------------------------------------------
# The build strings, and where each was observed. Every one of these is
# corroborated in build/schedule/build-viu-2026-08-11/evidence/combined-dump.json
# (1,184 distinct strings harvested from build v3.5-65d6500 on 2026-08-11).
#
#   "View options"      present   |  "View Options"    ABSENT (0 hits)
#   "Filter & display"  present   |  "Filter and display options" = an aria-label
#   "Capacity Planning" present   |  "Capacity Bars"   ABSENT (0 hits)
#   "Show Saturday" / "Show Sunday"  present
#   "VIN Number"        present
#   "business hours"    65 hits   |  "working hours"   ABSENT (0 hits)
#   "Reassign"          ABSENT (0 hits)  -> C30015's core assertion stands
# ---------------------------------------------------------------------------


class AnchorMissing(RuntimeError):
    pass


def rep(text, old, new, cid, field, count=1):
    """Replace `old` with `new`, asserting the anchor exists exactly `count` times."""
    n = text.count(old)
    if n != count:
        raise AnchorMissing(
            f"C{cid} {field}: expected {count} occurrence(s) of {old!r}, found {n}. "
            f"The live text has moved under this pass -- STOPPING (Rule 50)."
        )
    return text.replace(old, new)


def build(live):
    """live: {case_id(int) -> live case body dict}. Returns {cid -> payload dict}."""
    out = {}

    def base(cid):
        b = live[cid]
        return {
            "custom_preconds": b.get("custom_preconds") or "",
            "custom_steps": b.get("custom_steps") or "",
            "custom_expected": b.get("custom_expected") or "",
        }

    # ---------------------------------------------------------------- C30042
    # 'Filter & Display' -> 'Filter & display'   AND   'VIN' -> 'VIN Number'
    cid = 30042
    p = base(cid)
    p["title"] = ("'Filter & display' dropdown: department toggles, "
                  "'My Shifts' and 'VIN Number'")
    p["custom_steps"] = rep(p["custom_steps"], "'Filter & Display'",
                            "'Filter & display'", cid, "custom_steps")
    p["custom_expected"] = rep(p["custom_expected"], "'My Shifts', and 'VIN'.",
                               "'My Shifts', and 'VIN Number'.", cid, "custom_expected")
    p["custom_expected"] = rep(p["custom_expected"], "'My Shifts' OFF, 'VIN' OFF.",
                               "'My Shifts' OFF, 'VIN Number' OFF.", cid, "custom_expected")
    out[cid] = p

    # ---------------------------------------------------------------- C30046
    # 'View Options' -> 'View options'; Capacity Bars -> Capacity Planning;
    # Saturday/Sunday -> Show Saturday/Show Sunday
    cid = 30046
    p = base(cid)
    p["title"] = ("'View options': six toggles with defaults; "
                  "Capacity Planning and Events flip")
    p["custom_steps"] = rep(p["custom_steps"], "Open 'View Options' in the grid toolbar.",
                            "Open 'View options' in the grid toolbar.", cid, "custom_steps")
    p["custom_steps"] = rep(p["custom_steps"],
                            "Turn OFF Capacity Bars, look at the day column headers, "
                            "then turn it back ON.",
                            "Turn OFF Capacity Planning, look at the day column headers, "
                            "then turn it back ON.", cid, "custom_steps")
    p["custom_expected"] = rep(
        p["custom_expected"],
        "Six toggles are offered: Business Hours, Capacity Bars, Events, Tech Hours, "
        "Saturday, Sunday.",
        "Six toggles are offered: Business Hours, Capacity Planning, Events, Tech Hours, "
        "Show Saturday, Show Sunday.", cid, "custom_expected")
    p["custom_expected"] = rep(
        p["custom_expected"],
        "Defaults: Business Hours OFF, Capacity Bars ON, Events ON, Tech Hours OFF, "
        "Saturday ON, Sunday ON.",
        "Defaults: Business Hours OFF, Capacity Planning ON, Events ON, Tech Hours OFF, "
        "Show Saturday ON, Show Sunday ON.", cid, "custom_expected")
    p["custom_expected"] = rep(
        p["custom_expected"],
        "Capacity Bars OFF: the capacity bars disappear from the column headers; "
        "ON: they reappear with the same values.",
        "Capacity Planning OFF: the capacity bars disappear from the column headers; "
        "ON: they reappear with the same values.", cid, "custom_expected")
    out[cid] = p

    # ---------------------------------------------------------------- C30047
    cid = 30047
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "in 'View Options'.", "in 'View options'.",
                            cid, "custom_steps")
    out[cid] = p

    # ---------------------------------------------------------------- C30050
    cid = 30050
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "in 'View Options'.", "in 'View options'.",
                            cid, "custom_steps")
    out[cid] = p

    # ---------------------------------------------------------------- C30051
    # 'View Options' -> 'View options'; the TOGGLES are 'Show Saturday'/'Show Sunday'
    # while the COLUMNS stay Saturday/Sunday. The distinction is deliberate.
    cid = 30051
    p = base(cid)
    p["title"] = "'Show Saturday' and 'Show Sunday' include or exclude the weekend columns"
    p["custom_steps"] = rep(p["custom_steps"],
                            "Turn OFF Saturday in 'View Options'; look at the grid.",
                            "Turn OFF 'Show Saturday' in 'View options'; look at the grid.",
                            cid, "custom_steps")
    p["custom_steps"] = rep(p["custom_steps"], "Turn OFF Sunday too; look again.",
                            "Turn OFF 'Show Sunday' too; look again.", cid, "custom_steps")
    p["custom_expected"] = rep(
        p["custom_expected"],
        "Saturday off: the Saturday column is removed (6 columns remain).",
        "'Show Saturday' off: the Saturday column is removed (6 columns remain).",
        cid, "custom_expected")
    p["custom_expected"] = rep(
        p["custom_expected"],
        "Sunday off too: 5 weekday columns remain (Monday to Friday).",
        "'Show Sunday' off too: 5 weekday columns remain (Monday to Friday).",
        cid, "custom_expected")
    out[cid] = p

    # ------------------------------------------- the 'Filter & display' family
    cid = 29930
    p = base(cid)
    p["custom_expected"] = rep(p["custom_expected"], "the 'Filter and Display' dropdown",
                               "the 'Filter & display' dropdown", cid, "custom_expected")
    out[cid] = p

    cid = 30043
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "In 'Filter and Display', ",
                            "In 'Filter & display', ", cid, "custom_steps")
    out[cid] = p

    cid = 30044
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "In 'Filter and Display', ",
                            "In 'Filter & display', ", cid, "custom_steps")
    out[cid] = p

    cid = 30045
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "in 'Filter and Display'.",
                            "in 'Filter & display'.", cid, "custom_steps")
    out[cid] = p

    cid = 30082
    p = base(cid)
    p["custom_steps"] = rep(p["custom_steps"], "in 'Filter and Display' is OFF",
                            "in 'Filter & display' is OFF", cid, "custom_steps")
    out[cid] = p

    # ---------------------------------------------------------------- C30025
    # 'working hours' -> 'business hours' in the QUOTED EXAMPLES only. The
    # scope-conditional "in the spirit of" framing is KEPT (Rule 42), and the
    # assertion -- that the boundary is the technician's OWN configured hours --
    # is NOT touched: it was confirmed live (build-viu FINDINGS F7).
    cid = 30025
    p = base(cid)
    p["custom_expected"] = rep(p["custom_expected"], "'Starts before working hours'",
                               "'Starts before business hours'", cid, "custom_expected")
    p["custom_expected"] = rep(p["custom_expected"], "'Extends past working hours'",
                               "'Extends past business hours'", cid, "custom_expected")
    out[cid] = p

    # ---------------------------------------------------------------- C30015
    # A closed enumeration the build now contradicts. The repair is
    # SCOPE-CONDITIONAL (Rule 42): it states the ABSENCE the case exists to
    # assert, and deliberately REFUSES to list what else the modal shows today --
    # replacing one closed list with another would re-arm the same time bomb.
    cid = 30015
    p = base(cid)
    p["custom_expected"] = rep(
        p["custom_expected"],
        "1. The modal offers a Delete action (a trash icon in the header) and a "
        "close (x) icon - and no other actions.",
        "1. The modal offers a Delete action (a trash icon in the header) and a "
        "close (x) icon. It offers no way to move the shift to a different "
        "technician - no Reassign action, under that or any other name. Other "
        "editing controls may be present (for example notes, colour, or estimated "
        "hours); their presence is not what this test checks.",
        cid, "custom_expected")
    out[cid] = p

    return out


TARGETS = [30042, 30046, 30047, 30050, 30051, 29930, 30043, 30044, 30045,
           30082, 30025, 30015]
