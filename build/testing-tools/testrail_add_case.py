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

    custom_automation_type
      is_required   : False (on the API) but MANDATORY BY POLICY (QA lead 2026-09-02)
      default_value : "0"
      items         : 0, None | 1, E2E | 2, Functional | 3, Unit   (live get_case_fields 2026-09-02;
                      an earlier note here said "1, Ranorex" and was wrong)

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
"""

# The dropdown, verbatim from get_case_fields (project 1, read live 2026-08-11).
AUTOMATION_STATUS = {
    "Not Automated": 1,
    "Cannot be automated": 2,
    "Automated": 3,
    "Pending": 4,
}

#: What we send on every case we create. Never change this to 3.
DEFAULT_ATMSTATUS = AUTOMATION_STATUS["Not Automated"]  # == 1

# The Automation Type dropdown, verbatim from get_case_fields (project 1, read live 2026-09-02).
AUTOMATION_TYPE = {
    "None": 0,
    "E2E": 1,
    "Functional": 2,
    "Unit": 3,
}

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
    """
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


if __name__ == "__main__":
    import json
    print("Canonical add_case payload (Functional example):")
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
