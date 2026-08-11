#!/usr/bin/env python3
"""Create FLT-COLL-06 -- SV-9041's negative limb. ONE add_case, byte-verified.

custom_atmstatus comes from the canonical builder (1 = Not Automated). Never 3.
"""
import json, os, sys
sys.path.insert(0, os.getcwd())
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools")
import tr
from testrail_add_case import add_case_payload, verify_created_case, DEFAULT_ATMSTATUS

DRY = "--apply" not in sys.argv
SECTION = 4118  # "Collapse and Expand"

TITLE = "One filter on a page: no collapse control and the filter bar stays shown"

REFS = ("SV-9041; SV-8785 [epic] (SV-9041 - collapse control shown only where a page has >1 filter; "
        "spec v19 S1-R4 states the toggle exists but sets no condition on it) [spec v19 2026-08-06]")

PRECONDS = """1. You are signed in to the ShopView App on a desktop browser.
2. You can reach a page whose filter bar shows only ONE filter button. On the build the developers were working on, Parts then Part Sales was such a page: its filter bar showed only Status.
3. If every page you can reach shows two or more filter buttons, mark this test BLOCKED and say which pages you checked - do not mark it failed."""

STEPS = """1. Open the page you chose and look at the filter bar above the table.
2. Count the filter buttons in that bar and confirm there is only one.
3. Look along the whole toolbar row - where the Search control and the page's main button sit - for the small control that hides and shows the filter bar.
4. Move to another page and come back to this one, then look at the filter bar again."""

EXPECTED = """1. The filter bar shows exactly one filter button.
2. There is no control anywhere in the toolbar for hiding or showing the filter bar. It is not greyed out or switched off - it is simply not there at all.
3. The filter bar itself is on display, with its one filter button available to use as normal.
4. After leaving the page and coming back, the filter bar is still on display and there is still no hide/show control.

Note for the tester: the missing control is the point of this test, not a fault. On a page with only one filter there is nothing worth hiding, so the control is left out on purpose. If you DO find a hide/show control on a page with only one filter button, that is the failure - please report it.

---
This is the expected behaviour as per ticket SV-9041 (https://shopview.atlassian.net/browse/SV-9041), read on 11 August 2026, which says the expand/collapse filter control should only be visible if there is more than one filter present on the page, and that otherwise it should not be visible and the filter is always shown; and as per epic SV-8785, read on 11 August 2026. The Filters specification at Confluence version 19 (published 6 August 2026), read on 11 August 2026, describes the collapse control in S1-R4 but sets no condition on when it appears, so there is no requirement number to quote for this rule.

AUTOMATION: READY"""

payload = add_case_payload(title=TITLE, refs=REFS, preconds=PRECONDS,
                           steps=STEPS, expected=EXPECTED)

# ---- pre-flight guards -------------------------------------------------
assert payload["custom_atmstatus"] == 1, payload["custom_atmstatus"]
assert len(TITLE) <= 80, len(TITLE)
for part in REFS.split(","):
    assert len(part.strip()) <= 248, len(part.strip())
assert ",".join(p.strip() for p in REFS.split(",")) == REFS
for fld in (PRECONDS, STEPS, EXPECTED):
    for bad in ("<p>", "<li>", "<ol>", "\r\n"):
        assert bad not in fld, bad
assert EXPECTED.rstrip().endswith("AUTOMATION: READY")
assert "Last checked against build" not in EXPECTED      # no sentence 2
assert EXPECTED.count("AUTOMATION:") == 1
print("pre-flight OK:")
print(f"  custom_atmstatus = {payload['custom_atmstatus']} (Not Automated)")
print(f"  custom_automation_type = {payload['custom_automation_type']}")
print(f"  title {len(TITLE)} chars | refs {len(REFS)} chars, {REFS.count(',')} commas")
print(f"  marker last: yes | sentence 2 present: no | raw markup: none")

if DRY:
    print("\nDRY RUN -- nothing created")
    sys.exit(0)

st, body = tr.req(f"add_case/{SECTION}", payload)
print(f"\nadd_case HTTP {st}")
if st != 200:
    raise SystemExit(f"STOP: {body}")
cid = body["id"]
print(f"CREATED C{cid}")

# ---- byte verification by re-GET --------------------------------------
st, back = tr.req(f"get_case/{cid}")
if st != 200: raise SystemExit(f"re-GET failed {st}")
mism = []
for f, want in payload.items():
    got = back.get(f)
    if f == "refs":
        ok = ",".join(p.strip() for p in (got or "").split(",")) == want
    else:
        ok = got == want
    if not ok: mism.append((f, want, got))
print(f"fields compared: {len(payload)} | mismatches: {len(mism)}")
if mism:
    for f,w,g in mism: print(f"  MISMATCH {f}\n    WANT {w!r}\n    GOT  {g!r}")
    raise SystemExit("STOP: byte verification FAILED")
ok, problems = verify_created_case(back)
print(f"verify_created_case: {'PASS' if ok else 'FAIL ' + str(problems)}")
if not ok: raise SystemExit("STOP")
print(f"section_id: {back['section_id']} (expected {SECTION})")
print(f"created_by: {back['created_by']} | custom_atmstatus: {back['custom_atmstatus']}")
print("VERIFIED: byte-identical MATCH")
json.dump({"case_id":cid,"internal":"FLT-COLL-06","section_id":SECTION,"http":st,
           "fields_compared":len(payload),"mismatches":0,
           "custom_atmstatus":back["custom_atmstatus"]},
          open("../create-oplog.json","w"), indent=1)
