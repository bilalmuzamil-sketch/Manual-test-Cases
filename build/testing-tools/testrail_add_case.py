#!/usr/bin/env python3
"""CANONICAL `add_case` payload builder — copy your payload from HERE, never from an old exec script.

WHY THIS FILE EXISTS
--------------------
Every TestRail push in this workspace has been a one-off script, and each one copied its
`add_case` payload from the previous one. They all carried:

    "custom_atmstatus": 3,        # 3 == "Automated"

`3` was never required by anything. Read live from `get_case_fields` on project 1:

    custom_atmstatus  id 17  label "Automation status"  type dropdown
      is_required   : True
      default_value : "1"
      items         : 1, Not Automated | 2, Cannot be automated | 3, Automated | 4, Pending

    custom_automation_type  id 14  label "Automation Type"  type dropdown
      is_required   : True  (re-read live 2026-09-03 — an earlier note here said "False (on the
                      API) but MANDATORY BY POLICY"; the field is required on the API too now)
      default_value : "0"
      items         : 0, None | 1, E2E | 2, Functional | 3, Unit   (live get_case_fields 2026-09-02
                      and re-confirmed 2026-09-03; an earlier note here said "1, Ranorex" and was wrong)

QA lead, 2026-09-02, verbatim:
    "going forward every test case you directly create in Testrail or if you give me the CSV/XML
     file to upload these must contain the AUTOMATION type for each test case, so that we never
     have to edit the testrail test cases for this again."
So `automation_type` is REQUIRED of every caller and may never be 0 ("None"). Choose it by the
rubric: Unit (3) = isolated calculation / format / single-field validation; E2E (1) = cross-feature
journey, browser print dialog, audit trail, or email/PDF delivery; Functional (2) = single-feature
UI behaviour (default when neither Unit nor E2E fits).

So every case we created by API landed in TestRail flagged **Automated when nobody had
automated it**. That field is how Vladimir Tomovic records what he has actually automated, and
Standing Rule 65 keys the whole tell-Vlad duty off it — a case born `3` both tells him he
automated something he never touched and pollutes the signal Rule 65 reads.

QA lead, 2026-08-11, verbatim:
    "Are you adding 'Automated' to the test cases when you create them? there ar etest cases
     which are being given the AUTOMATED testrail marker, those are fine, but if you are adding
     that marker that is wrong."

`1` is a statement of fact. `3` is a claim about somebody else's work.

WHY `1` AND NOT AN OMITTED FIELD
--------------------------------
`is_required` is **True** for project 1, so omitting the field on a create is not proven safe —
and `add_case` was not exercised to test it (Rule 12: not observed, so not asserted). Sending
`1` explicitly satisfies the required flag AND states the truth, and it does not depend on
TestRail's default-application behaviour. This matches the authoritative line in CLAUDE.md
("Durable key facts -> TestRail").

USAGE
-----
    from testrail_add_case import add_case_payload

    payload = add_case_payload(
        title="...", refs="SV-8785 (S1-R3)",
        preconds="...", steps="...", expected="...")
    status, body = tr.req(f"add_case/{section_id}", payload)

If a case genuinely must carry a different automation status, pass it EXPLICITLY:

    add_case_payload(..., atmstatus=AUTOMATION_STATUS["Pending"])

There is no code path in which `3` is a default.

WHY THE TWO MAPS BELOW ARE AUDITED, NOT JUST DECLARED (added 2026-09-03)
-----------------------------------------------------------------------
Both maps are hard-coded id lists read live once — `AUTOMATION_STATUS` on 2026-08-11,
`AUTOMATION_TYPE` on 2026-09-02 — and every case this workspace creates is stamped from them.
They are keyed by NAME, so a **newly added** dropdown item fails loudly with `KeyError`, which
is fine. The silent risk is the other direction:

    a value RENUMBERED or REMOVED in TestRail Administration -> Customizations.

Nothing here would notice. `AUTOMATION_TYPE["Functional"]` keeps returning `2`, and every case
created from that day forward is stamped with whatever `2` now means — wrong automation type,
or wrong automation status, on every case, with a 200 OK on each one. That is not hypothetical
at this scale: `custom_automation_type` is the field the QA lead mandated on 2026-09-02 for
**every** created case and every CSV/XML deliverable, and a **285-case backfill sweep** on
2026-09-02 already had to clean up cases born with the wrong value. A silent renumbering would
recreate that sweep, at scale, and this time the cases would look correct in the payload log.

So the maps get the same treatment as `automation_markers.SANCTIONED`: declared once here,
and `assert_current()` diffs them BOTH WAYS against a live `get_case_fields` before the first
write path runs. It never edits the maps; it raises `StaleFieldMap` naming the drift.

    from testrail_add_case import assert_current, add_case_payload
    assert_current(tr.get("get_case_fields"))      # loud failure if TestRail has moved
    payload = add_case_payload(title=..., automation_type=AUTOMATION_TYPE["Functional"])

Measured live 2026-09-03: both dropdowns match the declarations below exactly — id 17
"Automation status" (required, default "1") and id 14 "Automation Type" (required, default
"0"). No drift today.
"""

# The dropdown, verbatim from get_case_fields (project 1, read live 2026-08-11;
# re-confirmed unchanged by a live read 2026-09-03).
AUTOMATION_STATUS = {
    "Not Automated": 1,
    "Cannot be automated": 2,
    "Automated": 3,
    "Pending": 4,
}

#: What we send on every case we create. Never change this to 3.
DEFAULT_ATMSTATUS = AUTOMATION_STATUS["Not Automated"]  # == 1

# The Automation Type dropdown, verbatim from get_case_fields (project 1, read live 2026-09-02;
# re-confirmed unchanged by a live read 2026-09-03).
AUTOMATION_TYPE = {
    "None": 0,
    "E2E": 1,
    "Functional": 2,
    "Unit": 3,
}

#: system_name -> (the declared map, the date it was last read live). The audit walks this, so
#: a third dropdown added here is audited automatically instead of being forgotten.
DECLARED_FIELDS = {
    "custom_atmstatus": (AUTOMATION_STATUS, "2026-08-11, re-confirmed 2026-09-03"),
    "custom_automation_type": (AUTOMATION_TYPE, "2026-09-02, re-confirmed 2026-09-03"),
}

_REFRESH_FIELDS = (
    "Refresh: read `get_case_fields` on project 1 live and correct the map in "
    "build/testing-tools/testrail_add_case.py to match, then re-run "
    "`python3 build/testing-tools/testrail_add_case.py --audit`. Correct the map — never "
    "loosen the audit, and never keep writing an id you can no longer prove."
)


class StaleFieldMap(RuntimeError):
    """A declared name->id dropdown map no longer matches the live TestRail instance."""


def _parse_items(raw):
    """TestRail serves dropdown items as "1, Not Automated\\n2, Cannot be automated". -> {name: id}.

    Order is irrelevant; the pairing is what matters. A line this cannot parse is REPORTED as
    unparseable rather than skipped, so a format change cannot make the audit quietly pass.
    """
    items, bad = {}, []
    for line in (raw or "").splitlines():
        line = line.strip()
        if not line:
            continue
        head, sep, name = line.partition(",")
        if not sep or not head.strip().lstrip("-").isdigit():
            bad.append(line)
            continue
        items[name.strip()] = int(head.strip())
    return items, bad


def _live_items(case_fields, system_name):
    """The live {name: id} for one dropdown, from a `get_case_fields` response."""
    for f in case_fields or []:
        if f.get("system_name") != system_name:
            continue
        for cfg in f.get("configs") or []:
            opts = cfg.get("options") or {}
            if "items" in opts:
                items, bad = _parse_items(opts["items"])
                return items, bad, opts
        return None, [], {}
    return None, [], {}


def audit(case_fields):
    """Diff every declared dropdown map against a live `get_case_fields`. Returns a problems list.

    Checks, per field: the field still exists and still serves items; every declared name is
    still present; every declared name still carries the SAME id (the renumbering case, which
    is the one nothing else here would catch); and every live item is declared (a new value —
    reported so it can be added deliberately rather than discovered by a KeyError mid-sweep).
    """
    problems = []
    if not case_fields:
        raise StaleFieldMap(
            "get_case_fields returned nothing, so the declared dropdown maps cannot be proven "
            "current and this run would create cases from maps it never checked. %s"
            % _REFRESH_FIELDS)
    for system_name, (declared, read_on) in DECLARED_FIELDS.items():
        live, bad, _opts = _live_items(case_fields, system_name)
        if live is None:
            problems.append(
                "%s: the field is GONE from get_case_fields (declared %s). Every case created "
                "from this map is stamping a field the instance no longer has."
                % (system_name, read_on))
            continue
        for line in bad:
            problems.append("%s: unparseable live item line %r — the items format changed, so "
                            "this audit cannot vouch for the map." % (system_name, line))
        for name, sid in sorted(declared.items()):
            if name not in live:
                problems.append(
                    "%s: declared value %r (id %s, read %s) NO LONGER EXISTS in the instance; "
                    "every case stamped with %s is now stamped with something else or nothing."
                    % (system_name, name, sid, read_on, sid))
            elif live[name] != sid:
                problems.append(
                    "%s: RENUMBERED — %r was id %s (read %s), the instance now serves id %s. "
                    "Every case created since the change carries the WRONG value."
                    % (system_name, name, sid, read_on, live[name]))
        for name, sid in sorted(live.items()):
            if name not in declared:
                problems.append(
                    "%s: live value %r (id %s) is NOT declared here. Add it deliberately; a "
                    "caller reaching for it gets a KeyError mid-sweep otherwise."
                    % (system_name, name, sid))
    return problems


def assert_current(case_fields):
    """Prove both dropdown maps still match the instance, or raise loudly. Returns the field count.

    Call this BEFORE the first `add_case`/`update_case` of any pass, and before emitting any
    CSV/XML import deliverable — those carry the same ids and are uploaded unreviewed.
    """
    global _PROVEN
    problems = audit(case_fields)
    if not problems:
        _PROVEN = (True, "live get_case_fields audit passed for %s"
                         % ", ".join(sorted(DECLARED_FIELDS)))
        return len(DECLARED_FIELDS)
    msg = ["THE DECLARED TESTRAIL DROPDOWN MAPS IN build/testing-tools/testrail_add_case.py ARE STALE.",
           "Refusing to stamp cases from a map that does not match the instance -- a renumbered",
           "value writes the wrong automation status/type on every case, with a 200 OK on each."]
    msg += ["  " + p for p in problems]
    msg.append(_REFRESH_FIELDS)
    raise StaleFieldMap("\n".join(msg))


# ---------------------------------------------------------------------------------------
# THE GATE. An audit nobody calls protects nothing, so the payload builder — the first step
# of every write path in this workspace — refuses to run until the maps have been PROVEN
# current in this process, or a caller has said OUT LOUD that it could not prove them.
# There is no third option and no silent default: those are what this file exists to remove.
# ---------------------------------------------------------------------------------------
_PROVEN = None          # None = never checked · (True, how) = proven · (False, why) = declared


def declare_unaudited(reason):
    """Proceed WITHOUT a live audit, on the record. For a caller that has no credentials.

    This is not a way to skip the check; it is a way to be honest that it did not happen.
    The reason is printed to stderr on every call, so a pass that stamped cases from an
    unproven map cannot later be described as verified (Rule 12).
    """
    global _PROVEN
    if not reason or not str(reason).strip():
        raise ValueError("declare_unaudited() needs a REASON — say why the live "
                         "get_case_fields audit could not be run.")
    _PROVEN = (False, str(reason).strip())
    print("testrail_add_case: PROCEEDING ON AN UNAUDITED FIELD MAP — %s\n"
          "  The automation status/type stamped on these cases is NOT proven against the live\n"
          "  instance. Say so in the report; do not call it verified." % _PROVEN[1],
          file=__import__("sys").stderr)


def _require_gate():
    if _PROVEN is not None:
        return
    raise StaleFieldMap(
        "THE FIELD MAPS HAVE NOT BEEN PROVEN CURRENT IN THIS PROCESS.\n"
        "  `AUTOMATION_STATUS` and `AUTOMATION_TYPE` are hard-coded ids. If a value was\n"
        "  renumbered in TestRail Administration -> Customizations, every case this pass\n"
        "  creates is stamped WRONG, and every one returns 200 OK. A 285-case backfill on\n"
        "  2026-09-02 already had to clean that up once.\n"
        "  Do ONE of these before the first payload:\n"
        "    from testrail_add_case import assert_current\n"
        "    assert_current(tr.get('get_case_fields'))        # proves it, one live read\n"
        "  or, if this caller genuinely has no credentials:\n"
        "    from testrail_add_case import declare_unaudited\n"
        "    declare_unaudited('offline fixture generation, no TestRail access')\n"
        "  %s" % _REFRESH_FIELDS)


def assert_current_via(fetch):
    """Convenience: `assert_current(fetch('get_case_fields'))`, latching the gate open."""
    return assert_current(fetch("get_case_fields"))

#: There is NO default automation type. Every caller must choose 1/2/3 (QA lead 2026-09-02);
#: 0 ("None") is refused. This sentinel exists only so a caller who forgets the argument gets a
#: clear error instead of silently shipping None.
_AUTOMATION_TYPE_REQUIRED = object()


def add_case_payload(title, refs=None, preconds=None, steps=None, expected=None,
                     type_id=1, priority_id=1, template_id=1,
                     atmstatus=DEFAULT_ATMSTATUS,
                     automation_type=_AUTOMATION_TYPE_REQUIRED,
                     **extra):
    """Build an `add_case` body with a truthful automation status AND a real automation type.

    `atmstatus` defaults to 1 ("Not Automated"). Setting it to 3 ("Automated") is the
    automation engineer's call, not ours — if a caller passes 3 it must be a deliberate,
    reviewed act, so this raises rather than letting it through silently.

    `automation_type` is REQUIRED (QA lead 2026-09-02): pass 1 (E2E), 2 (Functional) or 3 (Unit).
    Omitting it, or passing 0 ("None"), raises — so no case is ever born without a type again.

    Raises `StaleFieldMap` unless the dropdown maps have been proven current in this process
    (`assert_current`) or explicitly declared unaudited (`declare_unaudited`).
    """
    _require_gate()
    if automation_type is _AUTOMATION_TYPE_REQUIRED:
        raise ValueError(
            "automation_type is required (QA lead 2026-09-02): pass AUTOMATION_TYPE['E2E'] (1), "
            "['Functional'] (2) or ['Unit'] (3). A case may never be created with type 0 ('None')."
        )
    if automation_type not in (AUTOMATION_TYPE["E2E"], AUTOMATION_TYPE["Functional"], AUTOMATION_TYPE["Unit"]):
        raise ValueError(
            f"custom_automation_type must be 1 (E2E), 2 (Functional) or 3 (Unit) — never 0/None; "
            f"got {automation_type!r} (QA lead 2026-09-02)."
        )
    if atmstatus == AUTOMATION_STATUS["Automated"]:
        raise ValueError(
            "custom_atmstatus=3 ('Automated') is the automation engineer's flag to set, not "
            "ours (CLAUDE.md 'Durable key facts -> TestRail'; Standing Rules 38 and 65). "
            "A case we create has not been automated by anyone, so it is 1 ('Not Automated')."
        )
    if atmstatus not in AUTOMATION_STATUS.values():
        raise ValueError(f"custom_atmstatus must be one of {sorted(AUTOMATION_STATUS.values())}, "
                         f"got {atmstatus!r}")

    payload = {
        "title": title,
        "type_id": type_id,
        "priority_id": priority_id,
        "template_id": template_id,
        "custom_atmstatus": atmstatus,
        "custom_automation_type": automation_type,
    }
    # Text fields are sent only when supplied. NOTE for `update_case` (a different call):
    # TestRail RE-RENDERS any text field you OMIT through its HTML pipeline, so an update
    # payload must always carry custom_preconds + custom_steps + custom_expected, even
    # unchanged — see APP-ACTIONS-PLAYBOOK.md section J.
    if refs is not None:
        payload["refs"] = refs
    if preconds is not None:
        payload["custom_preconds"] = preconds
    if steps is not None:
        payload["custom_steps"] = steps
    if expected is not None:
        payload["custom_expected"] = expected
    payload.update(extra)

    # RE-VALIDATE AFTER THE MERGE — found 2026-08-12 (run-sync pass).
    # `payload.update(extra)` runs AFTER the `atmstatus` check above, so until this block
    # existed a caller could bypass the whole guard with the FIELD name instead of the
    # parameter name:
    #     add_case_payload(title="x", custom_atmstatus=3)   -> produced 3, silently
    # and `custom_atmstatus` is exactly the name a caller copying an old exec script would
    # reach for, because that is the key those scripts use. The validated value was being
    # overwritten by the very spelling the guard exists to stop.
    if payload.get("custom_atmstatus") == AUTOMATION_STATUS["Automated"]:
        raise ValueError(
            "custom_atmstatus=3 ('Automated') was injected through **extra, bypassing the "
            "`atmstatus` check. 3 is the automation engineer's flag to set, not ours "
            "(CLAUDE.md 'Durable key facts -> TestRail'; Standing Rules 38 and 65). "
            "A case we create has not been automated by anyone, so it is 1 ('Not Automated')."
        )
    return payload


def verify_created_case(case_body, expected_atmstatus=DEFAULT_ATMSTATUS):
    """Post-create check. Returns (ok, problems).

    Some older verifiers asserted `custom_atmstatus == 3` as a PASS condition, which would
    flag a correctly-created case as a failure. Use this instead.
    """
    problems = []
    got = case_body.get("custom_atmstatus")
    if got != expected_atmstatus:
        problems.append(f"custom_atmstatus is {got!r}, expected {expected_atmstatus!r}")
    at = case_body.get("custom_automation_type")
    if at not in (AUTOMATION_TYPE["E2E"], AUTOMATION_TYPE["Functional"], AUTOMATION_TYPE["Unit"]):
        problems.append(f"custom_automation_type is {at!r}, expected a real type "
                        f"1 (E2E) / 2 (Functional) / 3 (Unit), never 0/None (QA lead 2026-09-02)")
    return (not problems), problems


def _live_case_fields():
    """Live `get_case_fields`. READ-ONLY — no write of any kind is made from this module."""
    import base64
    import json
    import os
    import ssl
    import sys as _sys
    import urllib.request
    _sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from load_creds import testrail_creds
    email, key = testrail_creds()
    req = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/get_case_fields")
    req.add_header("Authorization",
                   "Basic " + base64.b64encode(("%s:%s" % (email, key)).encode()).decode())
    ctx = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
    with urllib.request.urlopen(req, context=ctx, timeout=90) as r:
        return json.loads(r.read().decode())


def _main_audit():
    """`--audit`: read get_case_fields live and print the both-ways diff. Exit 1 on drift."""
    import sys as _sys
    print("DECLARED DROPDOWN MAPS — build/testing-tools/testrail_add_case.py")
    for system_name, (declared, read_on) in sorted(DECLARED_FIELDS.items()):
        print("  %s  (last read live: %s)" % (system_name, read_on))
        for name, sid in sorted(declared.items(), key=lambda kv: kv[1]):
            print("      %s, %s" % (sid, name))
    try:
        cf = _live_case_fields()
    except Exception as exc:                          # noqa: BLE001 - reported, not swallowed
        print("\nLIVE AUDIT NOT RUN: %s" % exc)
        print("The maps above are UNPROVEN in this run. Supply credentials and re-run.")
        return 2
    print("\nLIVE get_case_fields (%d fields):" % len(cf))
    for system_name in sorted(DECLARED_FIELDS):
        live, bad, opts = _live_items(cf, system_name)
        print("  %s  is_required=%s default_value=%r" % (
            system_name, opts.get("is_required"), opts.get("default_value")))
        print("      items: %s" % (", ".join("%s, %s" % (i, n)
                                             for n, i in sorted((live or {}).items(),
                                                                key=lambda kv: kv[1]))
                                   or "NONE"))
        for line in bad:
            print("      UNPARSEABLE item line: %r" % line)
    problems = audit(cf)
    if problems:
        print("\nDRIFT (%d):" % len(problems))
        for p in problems:
            print("  " + p)
        print("\nFIELD MAPS: STALE — see above")
        return 1
    print("\nFIELD MAPS: CURRENT")
    return 0


if __name__ == "__main__":
    import json
    import sys

    if "--audit" in sys.argv:
        sys.exit(_main_audit())

    # The offline selftest never touches TestRail, so it says so rather than pretending.
    declare_unaudited("offline selftest of the payload guards; no TestRail access needed")
    print("\nCanonical add_case payload (Functional example):")
    print(json.dumps(add_case_payload(title="<title>", automation_type=AUTOMATION_TYPE["Functional"]), indent=2))
    try:
        add_case_payload(title="x", automation_type=AUTOMATION_TYPE["Functional"], atmstatus=3)
    except ValueError as e:
        print("\nGuard works — atmstatus=3 is refused:\n  " + str(e))
    try:
        add_case_payload(title="x")  # no automation_type
    except ValueError as e:
        print("\nGuard works — a missing automation_type is refused:\n  " + str(e))
    try:
        add_case_payload(title="x", automation_type=0)  # None
    except ValueError as e:
        print("\nGuard works — automation_type=0 (None) is refused:\n  " + str(e))

    # --- the 2026-09-03 staleness audit ---------------------------------------------------
    _renumbered = [{"system_name": "custom_atmstatus", "configs": [{"options": {
                        "items": "1, Not Automated\n2, Cannot be automated\n"
                                 "3, Automated\n4, Pending"}}]},
                   {"system_name": "custom_automation_type", "configs": [{"options": {
                        "items": "0, None\n1, E2E\n3, Functional\n4, Unit"}}]}]
    try:
        assert_current(_renumbered)
        print("\nAUDIT FAILED TO FIRE on a renumbered dropdown — this is a bug in the audit.")
    except StaleFieldMap as e:
        print("\nAudit works — a RENUMBERED value is caught:")
        for line in str(e).splitlines():
            if "RENUMBERED" in line or "NOT declared" in line:
                print("  " + line.strip())

    _removed = [{"system_name": "custom_atmstatus", "configs": [{"options": {
                    "items": "1, Not Automated\n2, Cannot be automated\n3, Automated"}}]},
                {"system_name": "custom_automation_type", "configs": [{"options": {
                    "items": "0, None\n1, E2E\n2, Functional\n3, Unit"}}]}]
    try:
        assert_current(_removed)
        print("\nAUDIT FAILED TO FIRE on a removed value — this is a bug in the audit.")
    except StaleFieldMap as e:
        print("\nAudit works — a REMOVED value is caught:")
        for line in str(e).splitlines():
            if "NO LONGER EXISTS" in line:
                print("  " + line.strip())

    _gone = [{"system_name": "custom_automation_type", "configs": [{"options": {
                 "items": "0, None\n1, E2E\n2, Functional\n3, Unit"}}]}]
    try:
        assert_current(_gone)
        print("\nAUDIT FAILED TO FIRE on a vanished field — this is a bug in the audit.")
    except StaleFieldMap as e:
        print("\nAudit works — a VANISHED field is caught:")
        for line in str(e).splitlines():
            if "is GONE" in line:
                print("  " + line.strip())

    print("\nAudit works — the CURRENT live map (read 2026-09-03) passes: %d field(s) proven."
          % assert_current([
              {"system_name": "custom_atmstatus", "configs": [{"options": {
                  "items": "1, Not Automated\n2, Cannot be automated\n3, Automated\n4, Pending"}}]},
              {"system_name": "custom_automation_type", "configs": [{"options": {
                  "items": "0, None\n1, E2E\n2, Functional\n3, Unit"}}]}]))

    # The gate: a fresh process that has proven nothing cannot build a payload.
    import subprocess
    _probe = subprocess.run(
        [sys.executable, "-c",
         "import sys; sys.path.insert(0, %r);\n"
         "import testrail_add_case as t\n"
         "try:\n"
         "    t.add_case_payload(title='x', automation_type=2)\n"
         "    print('GATE FAILED TO FIRE')\n"
         "except t.StaleFieldMap as e:\n"
         "    print('GATE FIRED: ' + str(e).splitlines()[0])\n"
         % __import__("os").path.dirname(__import__("os").path.abspath(__file__))],
        capture_output=True, text=True)
    print("\nGate works — an unproven process cannot build a payload:\n  "
          + (_probe.stdout.strip() or _probe.stderr.strip()))
