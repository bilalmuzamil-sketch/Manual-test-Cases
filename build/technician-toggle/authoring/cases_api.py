"""Section "API" (Rule 4) — Story 5, Public API technician value on staff (SV-11883), plus the Story 1 rules that only a request from
outside the staff window can reach (S1-R4 "any other way", S1 Error Handling) and S3-N3's outside tool. The requests named here are
the Public API's staff requests as the tech plan lists them (GET /api/v1/staff, GET /api/v1/staff/<id>, GET /api/v1/locations/<id>/staff,
PATCH /api/v1/staff/<id>); the tester checks them against the Public API documentation."""
from tt_lib import C, HOLD, PRE_REL
from common import *

S = "API"
KEY = ("Have a valid Public API key for the test organization, the Public API documentation for staff, and a request tool "
       "(Postman or any tool that sends requests with that key).")
PLAN_READ = ("Tech plan", "| `GET /api/v1/staff`, `/v1/staff/{id}`, `/v1/locations/{id}/staff` | `technician: boolean` (readOnly); not in `StaffUpdate`; `PATCH` ignores it | B4 |")
PLAN_LIST = ("Tech plan", "**API**: with a Public API token, `GET /api/v1/staff` → `technician` present. A PATCH with it is ignored.")
GET_A = "Send GET /api/v1/staff/<staff member A's id> with the API key."
GET_LIST = "Send GET /api/v1/staff with the API key."


def api(key, title, pre, steps, res, q, marker=None, note=""):
    C(key, S, title, [KEY] + pre, steps, res, q, marker=marker, note=note, api=True, stories=[5] if not any(str(x).startswith("S1") for x in q) else None)


A_ID = "Note staff member A's id as the Public API gives it (from GET /api/v1/staff)."
api("API-01", "A technician's staff record carries technician true",
    [ADMIN, staff(), A_ID],
    [GET_A, "Open Settings, Staff in the app."],
    [["The request succeeds.", 'The record includes "technician": true.'], ['Staff member A\'s row shows "Yes" in the Technician column, matching the API value.']],
    ["S5-R1", PLAN_READ])
api("API-02", "Technician off or Time Clock off reads technician false",
    [ADMIN, staff(tech=False, role="the built-in Parts Manager role"),
     "Have a new staff member for this test, staff member B, with Time Clock off and Technician off.", "Have a technician staff member C made for this test, so the list holds a true value to compare with."],
    [GET_LIST],
    [["The request succeeds.", 'Staff member A\'s record has "technician": false.', 'Staff member B\'s record has "technician": false.',
      'Staff member C\'s record has "technician": true.']],
    ["S5-R1", PLAN_LIST])
api("API-03", "A deactivated person whose toggle is on reads technician false",
    [ADMIN, staff(extra=", then deactivated with Deactivate Account"), A_ID],
    [GET_A, "Reactivate staff member A on the Deactivated tab of Settings, Staff.", GET_A],
    [["The request succeeds.", 'The record includes "technician": false, although the toggle is on.'], ["Staff member A is active again."],
     ['The record now includes "technician": true.']],
    ["S5-E1", "S5-R1", "S1-E2"])
api("API-04", "The value follows a change made in the staff window",
    [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work"), A_ID, LIST],
    [GET_A, EDIT_A, "Switch Technician off.", SAVE, GET_A],
    [['The record includes "technician": true.'], ["The window shows Technician on."], ["Technician is off."], ["The window closes."],
     ['The record now includes "technician": false.']],
    ["S5-R1", "S1-R6"])
api("API-05", "Location staff records carry the same technician value",
    [ADMIN, staff(), "Have a new staff member for this test, staff member B, enrolled at the test location, with Time Clock on and Technician off.",
     "Note the test location's id as the Public API gives it."],
    ["Send GET /api/v1/locations/<test location id>/staff with the API key."],
    [["The request succeeds.", 'Staff member A\'s record has "technician": true.', 'Staff member B\'s record has "technician": false.']],
    ["S5-R1", PLAN_READ])
api("API-06", "A staff update carrying technician false is accepted and ignores it",
    [ADMIN, staff(), A_ID, "Choose a new phone number for staff member A."],
    ['Send PATCH /api/v1/staff/<staff member A\'s id> with the API key, with the new phone number and "technician": false.', "Open Settings, Staff in the app."],
    [["The update succeeds, as today.", "The record returned has the new phone number.", 'The record returned has "technician": true (the value sent was ignored).'],
     ['Staff member A\'s row still shows "Yes" in the Technician column.']],
    ["S5-N1", PLAN_LIST])
api("API-07", "A staff update carrying technician true for a non-technician is ignored",
    [ADMIN, staff(tech=False, role="the built-in Parts Manager role"), A_ID, "Choose a new phone number for staff member A."],
    ['Send PATCH /api/v1/staff/<staff member A\'s id> with the API key, with the new phone number and "technician": true.', "Open Settings, Staff in the app."],
    [["The update succeeds, as today.", 'The record returned has "technician": false.'], ['Staff member A\'s row still shows "No" in the Technician column.']],
    ["S5-N1"])
api("API-08", "Turning Time Clock off through the API turns Technician off",
    [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work"), A_ID],
    ["Send PATCH /api/v1/staff/<staff member A's id> with the API key, turning Time Clock off.", GET_A, "Open staff member A's Edit Staff Member window in the app."],
    [["The update succeeds: it is not refused."], ['The record shows Time Clock off and "technician": false.'],
     ["Time Clock is off.", "Technician is off and grayed out."]],
    ["S1-R4", "EH-S1"])
api("API-09", "A request switching Technician on with Time Clock off is refused",
    [ADMIN, staff(tc=False, tech=False, role="the built-in Parts Manager role"), A_ID],
    ['Send PATCH /api/v1/staff/<staff member A\'s id> with the API key, with "technician": true.', GET_A],
    [['The request is refused with "A technician must have Time Clock on."', "Nothing is saved."], ['The record still has "technician": false.']],
    ["EH-S1", "UFS-5", "S5-N1"], marker="PO:refusal-route")
api("API-10", "A request switching Technician on for an Office User is refused",
    [ADMIN, staff(tech=False, role="the built-in Office User role"), A_ID],
    ['Send PATCH /api/v1/staff/<staff member A\'s id> with the API key, with "technician": true.', GET_A],
    [['The request is refused with "This role can\'t be a technician."', "Nothing is saved."], ['The record still has "technician": false.']],
    ["EH-S1", "UFS-6", "S5-N1"], marker="PO:refusal-route")
api("API-11", "With Office User and Time Clock off, the refusal gives the role message",
    [ADMIN, staff(tc=False, tech=False, role="the built-in Time Clock User role"), A_ID],
    ['Send PATCH /api/v1/staff/<staff member A\'s id> with the API key, with "technician": true.', GET_A],
    [['The request is refused with "This role can\'t be a technician."', 'It is not refused with "A technician must have Time Clock on."'],
     ['The record still has "technician": false.']],
    ["EH-S1", "UFS-6"], marker="PO:refusal-route")
api("API-12", "Moving a technician to Office User through a request saves and turns it off",
    [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work"), A_ID],
    ["Send a staff update request with the API key that moves staff member A to the built-in Office User role.", GET_A],
    [["The update succeeds: it is not refused."], ['The record shows the Office User role and "technician": false.']],
    ["EH-S1", "S1-N1"], marker=HOLD("needs a Public API request that changes a staff member's role; the saved sources name none"))
api("API-13", "A non-technician made lead through the Public API is accepted",
    [ADMIN, staff(tech=False, role="the built-in Parts Manager role"), wo(1, "Approved", "nobody (no lead)")],
    ["Send a Public API work order update with the API key that makes staff member A the lead of work order 1.", "Open work order 1 in the app."],
    [["The update is accepted, as today."], ["Work order 1 shows staff member A as its lead.", "In the Lead Technician dropdown staff member A is listed last, grayed out, with the check mark."]],
    ["S3-N3", "S3-R7", "KD-OFFER"], marker=HOLD("needs the Public API request that sets a work order's lead; the saved sources name none"))
api("API-14", "The Public API changelog announces the technician value",
    ["Have the Public API changelog for the release that ships Technician Toggle."],
    ["Open the Public API changelog."],
    [["An entry announces the new read-only technician value on staff records."]],
    ["S5-R2", ("Tech plan", "**D6**: S5-R2 → `docs/api/v1/changelog.md` \"Unreleased -- Additive\", plus `api/openapi/openapi.yaml` `Staff` schema and `docs/api/v1/sync-guide.md`.")],
    marker=HOLD("the changelog entry is published with the release; run once the release notes for the Public API are out"))
api("API-15", "Staff turned on at release are picked up as changed by the Public API",
    ["Sign in to production (the live app, app.shopview.com) as an Admin of the production test account, at its test location, Trucks Hill 2.", KEY,
     "Shortly before the release reached production, have two new staff members for this test on production: staff member A, active, on the built-in Parts Manager role, with Time Clock on and Billable set to Yes, and staff member B, active, on the built-in Service Advisor role, with Time Clock on, Billable set to No and no work (written down with screenshots).",
     "Note the moment, to the minute, just before the release reached production."],
    ["Send the Public API request that lists staff changed since a given time, with the noted moment.", "Open Settings, Staff."],
    [["Staff member A is in the list of changed staff, with \"technician\": true.", "Staff member B is not in the list of changed staff."],
     ['Staff member A\'s row shows "Yes" and staff member B\'s row shows "No" in the Technician column.']],
    ["S6-R3", "S5-R1"], marker=PRE_REL)
