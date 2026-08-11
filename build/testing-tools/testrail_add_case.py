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
      is_required   : False
      default_value : "0"
      items         : 0, None | 1, Ranorex

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

#: `custom_automation_type` is NOT required; 0 ("None") is also its own default.
DEFAULT_AUTOMATION_TYPE = 0


def add_case_payload(title, refs=None, preconds=None, steps=None, expected=None,
                     type_id=1, priority_id=1, template_id=1,
                     atmstatus=DEFAULT_ATMSTATUS,
                     automation_type=DEFAULT_AUTOMATION_TYPE,
                     **extra):
    """Build an `add_case` body with a truthful automation status.

    `atmstatus` defaults to 1 ("Not Automated"). Setting it to 3 ("Automated") is the
    automation engineer's call, not ours — if a caller passes 3 it must be a deliberate,
    reviewed act, so this raises rather than letting it through silently.
    """
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
    if case_body.get("custom_automation_type") != DEFAULT_AUTOMATION_TYPE:
        problems.append(f"custom_automation_type is {case_body.get('custom_automation_type')!r}, "
                        f"expected {DEFAULT_AUTOMATION_TYPE!r}")
    return (not problems), problems


if __name__ == "__main__":
    import json
    print("Canonical add_case payload (no title/refs/text supplied):")
    print(json.dumps(add_case_payload(title="<title>"), indent=2))
    try:
        add_case_payload(title="x", atmstatus=3)
    except ValueError as e:
        print("\nGuard works — atmstatus=3 is refused:\n  " + str(e))
