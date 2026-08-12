#!/usr/bin/env python3
"""payloads.py — the 2026-08-12 Schedule write set, built against LIVE case text.

Every edit is an exact string replacement checked against the case as it stands in
TestRail right now; if the anchor text is not found the payload is refused rather
than guessed at, so a case another author has touched cannot be silently clobbered.

ALL THREE text fields go on every payload — TestRail re-renders any text field
omitted from an update through its HTML pipeline, wrapping it in <p> and turning
\\n into \\r\\n.

Rule 54 sentence 2 is re-stamped ONLY on cases something was actually observed on
this build.  Sentence 1 — the SOURCE of the expectation — is never touched.
"""
import json, re, sys

BUILD = "v3.5-65d6500"
DATE = "8/12/2026"
LIVE = {c["id"]: c for c in json.load(open("/tmp/sched/live-cases.json"))}

# NOTE: the build marker itself contains a dot ("v3.5-65d6500"), so a non-greedy
# match up to the first "." stops INSIDE the marker and leaves the old tail behind
# ("...on 8/12/2026.5-af3a6e1 on 8/11/2026."). Anchor on the trailing date instead.
STAMP_RE = re.compile(r"Last checked against build \S+ on \d{1,2}/\d{1,2}/\d{4}\.")


def restamp(expected):
    """Replace the Rule-54 sentence 2 in place; never append a second one."""
    new = "Last checked against build %s on %s." % (BUILD, DATE)
    if STAMP_RE.search(expected):
        return STAMP_RE.sub(new, expected, count=1)
    raise ValueError("no existing build stamp to replace")


def set_marker(expected, marker):
    out = re.sub(r"AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD[^\n]*)",
                 marker, expected, count=1)
    if out == expected and marker not in expected:
        raise ValueError("marker not replaced")
    return out


def rep(text, old, new, field, cid):
    if old not in text:
        raise ValueError("C%d %s: anchor not present: %r" % (cid, field, old[:70]))
    return text.replace(old, new)


EDITS = []          # (cid, reason, fn(preconds, steps, expected) -> tuple)

# titles that quote a label the build spells differently.  Both stay under the
# 80-character ceiling: 76 and 78.
TITLES = {
    38850: "'Add Hours' appends a removable second range for split shifts, starting empty",
    38848: "Edit Staff has a 'Set working hours for this technician' toggle, off by default",
}


def edit(cid, reason):
    def deco(fn):
        EDITS.append((cid, reason, fn))
        return fn
    return deco


# ─────────────────────────────────────────────────────────────────────────────
# A · LABEL CORRECTIONS — all five admin dialogs read live today
# ─────────────────────────────────────────────────────────────────────────────

@edit(38850, "build ships 'Add Hours' (capital H) in BOTH hours editors; navigation added")
def _c38850(p, s, e, cid=38850):
    p = rep(p, "You are in the per-day working-hours editor (location or technician) with a day's first range set.",
            "You are in the per-day working-hours editor with a day's first range set. Reach it either from "
            "Settings > Locations > the pencil on a shop's row > turn on 'Set business hours for this shop', "
            "or from Settings > Staff > the pencil on a technician's row > turn on "
            "'Set working hours for this technician'.", "preconds", cid)
    s = rep(s, "click 'Add hours'", "click 'Add Hours'", "steps", cid)
    e = rep(e, "'Add hours' appends", "'Add Hours' appends", "expected", cid)
    return p, s, restamp(e)


@edit(38848, "build ships 'Set working hours for this technician', not 'custom hours'; navigation added")
def _c38848(p, s, e, cid=38848):
    p = rep(p, "You open the Edit Staff Member screen for a technician.",
            "You open the Edit Staff Member screen for a technician - Settings > Staff, then the pencil on that "
            "technician's row.", "preconds", cid)
    s = s.replace("'Set custom hours for this technician'", "'Set working hours for this technician'")
    e = e.replace("'Set custom hours for this technician'", "'Set working hours for this technician'")
    return p, s, restamp(e)


@edit(38849, "same toggle label correction")
def _c38849(p, s, e, cid=38849):
    p = p.replace("'Set custom hours for this technician'", "'Set working hours for this technician'")
    s = s.replace("'Set custom hours for this technician'", "'Set working hours for this technician'")
    e = e.replace("'Set custom hours for this technician'", "'Set working hours for this technician'")
    return p, s, restamp(e)


@edit(38926, "'Reset to template' is on the ROLE'S OWN screen; the list menu offers only 'View Permissions'")
def _c38926(p, s, e, cid=38926):
    s = rep(s,
            "2. Take these roles one at a time - Technician, Parts Manager, Parts Tech, Office, Time Clock - "
            "use 'Reset To Template' so the role is back at its default, then read its Schedule permissions "
            "(View, Edit, Delete).",
            "2. Take these roles one at a time - Technician, Parts Manager, Parts Tech, Office, Time Clock. "
            "Open the role by clicking the pencil on its row, then click 'Reset to template' on the role's own "
            "screen so the role is back at its default, and read its Schedule permissions (View, Edit, Delete). "
            "Note: the three-dot menu on the roles list does NOT offer this - it only offers 'View Permissions'. "
            "The reset button is on the role's own screen.", "steps", cid)
    return p, s, restamp(e)


@edit(38847, "label confirmed exactly as written; build stamp only")
def _c38847(p, s, e, cid=38847):
    p = rep(p, "You are on the Edit Location screen for a shop.",
            "You are on the Edit Location screen for a shop - Settings > Locations, then the pencil on that "
            "shop's row.", "preconds", cid)
    return p, s, restamp(e)


# ─────────────────────────────────────────────────────────────────────────────
# B · C29962 — the click alternative is gone and the case said nothing about it
# ─────────────────────────────────────────────────────────────────────────────

ARM_NOTE = (
    "\n\nWhat you should see today: there is no click alternative anywhere. The work order card in the "
    "left-hand panel carries no button that arms it for placing - not when the page loads, not when you "
    "rest the mouse on the card, and not inside the card's line list. The only way to place a job on the "
    "grid is to drag it. This is a known problem and it is already reported - see "
    "https://shopview.atlassian.net/browse/SV-8957. That ticket has been closed without the problem being "
    "fixed, so do not wait for a fix.\n"
    "- If you see exactly that, mark this test FAILED and do not raise anything new.\n"
    "- If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
    "- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed."
)


@edit(29962, "SV-8957 still reproduces on this build; Rule-61 symptom + three outcomes added")
def _c29962(p, s, e, cid=29962):
    head, sep, tail = e.partition("\n---\n")
    if not sep:
        raise ValueError("C29962: no provenance separator")
    e = head.rstrip() + ARM_NOTE + "\n---\n" + tail
    e = restamp(e)
    return p, s, set_marker(e, "AUTOMATION: READY - EXPECT FAIL (SV-8957)")


# ─────────────────────────────────────────────────────────────────────────────
# C · C43582-C43587 — the panel button has no interface at all
# ─────────────────────────────────────────────────────────────────────────────

PANEL_OLD = ("When it was last checked, on 11 August 2026, the Schedule toolbar had no panel button at all - "
             "the button furthest to the left above the grid was Today - so on that build steps 1 to 7 cannot "
             "be carried out and this test FAILS.")
PANEL_NEW = ("When it was last checked, on 12 August 2026, the Schedule toolbar still had no panel button at "
             "all - the button furthest to the left above the grid was Today, and the only thing on the page "
             "that hides anything is the small arrow that folds away the month calendar inside the panel, "
             "which is a different control - so on that build steps 1 to 7 cannot be carried out and this "
             "test FAILS.")


def _panel(p, s, e, cid):
    if PANEL_OLD in e:
        e = e.replace(PANEL_OLD, PANEL_NEW)
    else:
        # the sentence is worded per-case; fall back to the shared clause
        e = rep(e, "on 11 August 2026", "on 12 August 2026", "expected", cid)
    e = restamp(e)
    return p, s, set_marker(e, "AUTOMATION: HOLD - the panel button does not exist in this build")


for _cid in (43582, 43583, 43584, 43585, 43586, 43587):
    EDITS.append((_cid, "no interface for this feature in the build; HOLD not READY",
                  (lambda c: (lambda p, s, e: _panel(p, s, e, c)))(_cid)))


# ─────────────────────────────────────────────────────────────────────────────
# D · re-stamp ONLY what was actually observed today
# ─────────────────────────────────────────────────────────────────────────────

@edit(30084, "the 'Time Clock' control was read live on the staff record today")
def _c30084(p, s, e):
    return p, s, restamp(e)


@edit(43554, "Day carries aria-pressed=true on arrival; observed today")
def _c43554(p, s, e):
    return p, s, restamp(e)


def build():
    out = []
    for cid, reason, fn in EDITS:
        c = LIVE[cid]
        p0, s0, e0 = c["custom_preconds"] or "", c["custom_steps"] or "", c["custom_expected"] or ""
        p, s, e = fn(p0, s0, e0)
        if (p, s, e) == (p0, s0, e0):
            raise ValueError("C%d produced no change" % cid)
        pl = {"custom_preconds": p, "custom_steps": s, "custom_expected": e}
        if cid in TITLES:
            assert len(TITLES[cid]) <= 80, cid
            pl["title"] = TITLES[cid]
        out.append({"cid": cid, "reason": reason, "payload": pl})
    return out


if __name__ == "__main__":
    ps = build()
    print("payloads:", len(ps))
    for x in ps:
        c = LIVE[x["cid"]]
        print("=" * 74)
        print("C%d  %s" % (x["cid"], c["title"]))
        print("  reason:", x["reason"])
        for f in ("custom_preconds", "custom_steps", "custom_expected"):
            if (c[f] or "") != x["payload"][f]:
                print("  ~", f, "CHANGED")
    json.dump(ps, open("/tmp/sched/payloads.json", "w"), indent=1)
