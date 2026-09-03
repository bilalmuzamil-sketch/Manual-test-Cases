#!/usr/bin/env python3
"""THE ONE PLACE TESTRAIL'S RESULT-STATUS IDS ARE DECLARED — and the audit that proves the
declaration has not gone stale against the TestRail instance itself.

    from testrail_statuses import bucket, assert_current, BUCKETS, UNTESTED
    assert_current(api("get_statuses"))       # loud failure if the instance no longer matches
    key = bucket(test["status_id"])           # raises on an id this file does not know

THE FAILURE CLASS THIS FILE EXISTS TO KILL
------------------------------------------
`gen_dashboard.py` carried the status map as a five-entry literal and read it with

    SID.get(t["status_id"], "untested")

TestRail supports **custom statuses, ids 6-12** (`custom_status1` .. `custom_status7`). Any
result carrying one fell into the `.get` default and was counted as **Untested** — silently.
No error, no warning. The effect is not cosmetic and it is not symmetric:

  * the Untested figure is INFLATED, and
  * the real figure (Passed / Failed / whatever the custom status means) is DEFLATED,
  * on the "Executed %", the burndown "remaining", and every per-engineer bar,

i.e. on the numbers the QA lead reads to decide whether a suite is ready to hand to a manual
tester. A dashboard that quietly under-reports progress is worse than one that refuses to
render, because nobody knows to distrust it. **Never silently degrade a number he reads.**

This is the same failure class `automation_markers.py` exists for — a hard-coded set of valid
values that "passes by ignoring anything new" — and it is deliberately built to the same shape:

  DECLARATION (below)     what an id is allowed to be. ONE copy in the repo, byte-exact,
                          imported by every tool, reviewable.
  AUDIT (`audit()`)       proves that declaration still agrees with the LIVE instance, in
                          BOTH directions. It never edits the declaration; it fails.
  LOOKUP (`bucket()`)     raises `UnknownStatusId` on anything undeclared. There is no
                          default, because a default is what caused the bug.

WHY A DECLARED MAP *PLUS* A LIVE AUDIT, RATHER THAN PURE RUNTIME DERIVATION
--------------------------------------------------------------------------
`get_statuses` needs credentials, and several tools that need to *name* a status (fixtures,
offline formatters, tests, a CSV writer) have none. So the map is declared here so it can be
read without a network call, and every tool that DOES have credentials — `gen_dashboard.py`
is one; it cannot run without them at all — calls `assert_current()` with a live
`get_statuses` before it counts anything. A credentialed tool therefore can never render a
figure derived from a stale map, and an uncredentialed one still cannot invent a bucket.

WHAT WAS ACTUALLY MEASURED (live `get_statuses`, https://shopview.testrail.io, 2026-09-03)
------------------------------------------------------------------------------------------
Five statuses, all `is_system: true`. **NO custom status (id 6-12) exists in this instance
today** — so the bug above is REAL but NOT YET FIRING. The moment anyone adds one in TestRail
Administration -> Customizations -> Result Statuses, it fires on every run that uses it.

    id  system_name  label     is_system  is_final  is_untested
    1   passed       Passed    True       True      False
    2   blocked      Blocked   True       True      False
    3   untested     Untested  True       False     True
    4   retest       Retest    True       False     False
    5   failed       Failed    True       True      False

🛑 TO REFRESH AFTER SOMEONE ADDS OR RENUMBERS A STATUS: run
`python3 build/testing-tools/testrail_statuses.py`, which prints the live set and the exact
diff, then add the new row to `DECLARED` below **and nowhere else**, and give the new bucket a
colour in `gen_dashboard.py`'s `CLR`. Re-run until it prints `STATUS MAP: CURRENT`.
"""
import sys

# ---------------------------------------------------------------------------------------
# THE DECLARATION. Verbatim from a live `get_statuses` on https://shopview.testrail.io,
# read 2026-09-03 (read-only; no write of any kind was made in that pass).
#
#   id           the TestRail status id, as it appears in a test's/result's `status_id`.
#   bucket       the key every tool counts under. For a system status this is TestRail's own
#                `name`, so the two can never drift apart by a typo.
#   label        the human label, as TestRail serves it.
#   is_untested  TestRail's own flag. `UNTESTED` below is derived from it, never guessed —
#                "executed = total - untested" is arithmetic the QA lead reads.
# ---------------------------------------------------------------------------------------
DECLARED = (
    # id, bucket,     label,      is_system, is_untested
    (1, "passed",   "Passed",   True, False),
    (2, "blocked",  "Blocked",  True, False),
    (3, "untested", "Untested", True, True),
    (4, "retest",   "Retest",   True, False),
    (5, "failed",   "Failed",   True, False),
)

#: id -> bucket. Derived from DECLARED; never written out a second time.
SID = {sid: b for sid, b, _l, _sys, _u in DECLARED}

#: bucket -> label.
LABELS = {b: l for _sid, b, l, _sys, _u in DECLARED}

#: every declared bucket, in id order.
BUCKETS = tuple(b for _sid, b, _l, _sys, _u in DECLARED)

#: the bucket TestRail itself flags `is_untested`. Derived, so "executed = total - UNTESTED"
#: cannot be pointed at the wrong key.
UNTESTED = next(b for _sid, b, _l, _sys, u in DECLARED if u)

#: the highest id TestRail reserves for a system status. 6-12 are the seven custom slots.
MAX_SYSTEM_STATUS_ID = 5
MAX_CUSTOM_STATUS_ID = 12

_REFRESH = ("Refresh: run `python3 build/testing-tools/testrail_statuses.py` to print the live "
            "`get_statuses` set and the exact diff, then add the row to DECLARED in "
            "build/testing-tools/testrail_statuses.py (and give the new bucket a colour in "
            "gen_dashboard.py's CLR). Do not add a fallback.")


class UnknownStatusId(KeyError):
    """A result carries a status id this file does not declare. Never bucket it silently."""


class StaleStatusMap(RuntimeError):
    """The declaration above no longer agrees with the live TestRail instance."""


def bucket(status_id):
    """Return the counting bucket for a TestRail `status_id`, or RAISE.

    This is the deliberate replacement for `SID.get(status_id, "untested")`. There is no
    default and there will not be one: the default was the bug. A caller that genuinely wants
    to tolerate an unknown id must say so at the call site and say what it does instead.
    """
    try:
        return SID[status_id]
    except KeyError:
        pass
    if isinstance(status_id, int) and MAX_SYSTEM_STATUS_ID < status_id <= MAX_CUSTOM_STATUS_ID:
        extra = ("This is a TestRail CUSTOM status (id 6-12 == custom_status%d). One has been "
                 "added to the instance since 2026-09-03, when a live get_statuses returned the "
                 "five system statuses and nothing else. " % (status_id - MAX_SYSTEM_STATUS_ID))
    else:
        extra = "This id is outside TestRail's documented range (1-5 system, 6-12 custom). "
    raise UnknownStatusId(
        "UNMAPPED TESTRAIL STATUS ID %r. %sRefusing to count it as %r — that is exactly the "
        "silent miscount this module exists to stop: it would inflate the untested figure and "
        "deflate the real one on a dashboard the QA lead reads to decide whether a suite is "
        "ready. %s" % (status_id, extra, UNTESTED, _REFRESH))


def run_count_field(status_id):
    """The `get_run` field carrying this status's count (`passed_count`, `custom_status3_count`).

    A run's totals are per-status fields, so a custom status is missing from
    `passed+failed+blocked+retest+untested` too — the same silent miscount, at the run level.
    """
    if status_id in SID and status_id <= MAX_SYSTEM_STATUS_ID:
        return "%s_count" % SID[status_id]
    if MAX_SYSTEM_STATUS_ID < status_id <= MAX_CUSTOM_STATUS_ID:
        return "custom_status%d_count" % (status_id - MAX_SYSTEM_STATUS_ID)
    raise UnknownStatusId("no run count field for status id %r. %s" % (status_id, _REFRESH))


def audit(live_statuses):
    """Diff the declaration against a live `get_statuses` BOTH WAYS.

    Returns (unknown, vanished, renamed):
      unknown  -- live statuses no id here declares. A custom status added in TestRail lands
                  here, which is what forces this file to be updated instead of results being
                  miscounted as untested.
      vanished -- ids declared here that the instance no longer serves.
      renamed  -- ids present in both whose `name` or `is_untested` flag has changed. A
                  renumbered/renamed status keeps counting under the old bucket otherwise.
    """
    if not live_statuses:
        raise StaleStatusMap(
            "get_statuses returned nothing, so the declared status map cannot be proven "
            "current and this run would be asserting a map it never checked. %s" % _REFRESH)
    live = {s["id"]: s for s in live_statuses}
    declared = {sid: (b, u) for sid, b, _l, _sys, u in DECLARED}

    unknown = {sid: s for sid, s in live.items() if sid not in declared}
    vanished = [sid for sid in declared if sid not in live]
    renamed = {}
    for sid, (b, u) in declared.items():
        s = live.get(sid)
        if s is None:
            continue
        if s.get("name") != b or bool(s.get("is_untested")) != bool(u):
            renamed[sid] = (b, u, s.get("name"), bool(s.get("is_untested")))
    return unknown, vanished, renamed


def assert_current(live_statuses):
    """Prove the declaration matches the live instance, or raise loudly. Returns the count.

    Call this BEFORE counting anything, so a stale map stops the run instead of producing a
    figure nobody should trust.
    """
    unknown, vanished, renamed = audit(live_statuses)
    if not unknown and not vanished and not renamed:
        return len(DECLARED)
    msg = ["THE DECLARED TESTRAIL STATUS MAP IN build/testing-tools/testrail_statuses.py IS STALE.",
           "Refusing to count results against a map that does not match the instance -- that is",
           "how every result carrying a custom status got silently counted as Untested."]
    for sid, s in sorted(unknown.items()):
        msg.append("  UNKNOWN live status id %s: name=%r label=%r is_untested=%s"
                   % (sid, s.get("name"), s.get("label"), s.get("is_untested")))
        msg.append("    -> results with this id would have been miscounted. Add it to DECLARED,")
        msg.append("       and give its bucket a colour in gen_dashboard.py's CLR.")
    for sid in sorted(vanished):
        msg.append("  DECLARED status id %s (%r) is no longer served by the instance." % (sid, SID[sid]))
        msg.append("    -> it was removed; this file still counts under the old bucket.")
    for sid, (b, u, live_name, live_u) in sorted(renamed.items()):
        msg.append("  DECLARED status id %s drifted: bucket %r/is_untested=%s, live %r/is_untested=%s"
                   % (sid, b, u, live_name, live_u))
        msg.append("    -> the id was renamed or repurposed; counts under it are now wrong.")
    msg.append(_REFRESH)
    raise StaleStatusMap("\n".join(msg))


def _live_statuses():
    """Live `get_statuses` using the standard credential search. READ-ONLY."""
    import base64
    import json
    import os
    import ssl
    import urllib.request
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from load_creds import testrail_creds
    email, key = testrail_creds()
    req = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/get_statuses")
    req.add_header("Authorization",
                   "Basic " + base64.b64encode(("%s:%s" % (email, key)).encode()).decode())
    ctx = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
    with urllib.request.urlopen(req, context=ctx, timeout=90) as r:
        return json.loads(r.read().decode())


def main():
    print("DECLARED TESTRAIL RESULT STATUSES — build/testing-tools/testrail_statuses.py")
    for sid, b, label, is_sys, is_unt in DECLARED:
        print("  id=%-3d %-9s %-9s system=%-5s is_untested=%-5s run field=%s"
              % (sid, b, label, is_sys, is_unt, run_count_field(sid)))
    print("\nbuckets (%d): %s" % (len(BUCKETS), ", ".join(BUCKETS)))
    print("untested bucket: %r  (derived from TestRail's own is_untested flag)" % UNTESTED)
    try:
        live = _live_statuses()
    except Exception as exc:                                  # noqa: BLE001 - reported, not swallowed
        print("\nLIVE AUDIT NOT RUN: %s" % exc)
        print("The declaration above is UNPROVEN in this run. Supply credentials and re-run.")
        return 2
    print("\nLIVE get_statuses (%d):" % len(live))
    for s in sorted(live, key=lambda s: s["id"]):
        print("  id=%-3d name=%-9s label=%-9s is_system=%-5s is_final=%-5s is_untested=%s"
              % (s["id"], s.get("name"), s.get("label"), s.get("is_system"),
                 s.get("is_final"), s.get("is_untested")))
    custom = [s for s in live if s["id"] > MAX_SYSTEM_STATUS_ID]
    print("\ncustom statuses (id 6-12) present: %s"
          % (", ".join("%s (%s)" % (s["id"], s.get("name")) for s in custom) if custom else "NONE"))
    unknown, vanished, renamed = audit(live)
    print("  unknown  (live -> here) : %s" % (", ".join(map(str, sorted(unknown))) or "NONE"))
    print("  vanished (here -> live) : %s" % (", ".join(map(str, sorted(vanished))) or "NONE"))
    print("  renamed  (both, drifted): %s" % (", ".join(map(str, sorted(renamed))) or "NONE"))
    if unknown or vanished or renamed:
        print("\nSTATUS MAP: STALE — see above")
        return 1
    print("\nSTATUS MAP: CURRENT")
    return 0


if __name__ == "__main__":
    sys.exit(main())
