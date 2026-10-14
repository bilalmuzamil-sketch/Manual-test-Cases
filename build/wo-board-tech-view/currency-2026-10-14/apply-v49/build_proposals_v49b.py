#!/usr/bin/env python3
"""Second batch of the PRD v49 pass (14 Oct 2026, coordinator follow-up): the full rewrite of C368131 against S3-R20c and the
widened S4-N5. Reuses the shared tester/doc sentences of build_proposals_v49.py (its helper block is executed, nothing else).
Every quote is copied by code from the saved PRD v49 (anchor-quotes-current.json) or the saved PRD text. Writes proposals-v49-b.json.
Run from the repo root:  python3 build/wo-board-tech-view/currency-2026-10-14/apply-v49/build_proposals_v49b.py"""
import json
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"
src = open(f"{H}/build_proposals_v49.py").read().split("PROPOSALS = {")[0]
ns = {}; exec(compile(src, "helpers", "exec"), ns)
q, signed, WIDTH, CLEAN, tech, PRD = ns["q"], ns["signed"], ns["WIDTH"], ns["CLEAN"], ns["tech"], ns["PRD"]
P1_SIGN, P1_LOC, P1_WIDTH, p1_staff, p1_customer = ns["P1_SIGN"], ns["P1_LOC"], ns["P1_WIDTH"], ns["p1_staff"], ns["p1_customer"]
P1_NEWWO, LINE_A, P1_LEAD, P2_STAFF, P2_EVID = ns["P1_NEWWO"], ns["LINE_A"], ns["P1_LEAD"], ns["P2_STAFF"], ns["P2_EVID"]
prd = open("build/wo-board-tech-view/currency-2026-10-14/CONFLUENCE-845185030-v49-2026-10-14b.md").read()
CTX = "A pin only counts at locations where the technician is enrolled."
assert CTX in prd
CTXQ = ["Context note (S3-R20a, S3-R20b)", CTX]

P = {"updates": [], "new": [], "retire": [], "anchors_covered": {}, "notes": []}
P["updates"].append({
 "case_id": 368131,
 "title": "Pinned technician columns after deactivation or removal from this location",
 "preconditions": [
  "You are signed in as {User-A}, an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit, at {Location-A} (for example Staging Heavy Duty - 9919).",
  WIDTH,
  'A second user {User-B} (for example "ZZAUTOTEST C368131 Viewer") has a role with Work orders > View only (Create & Edit off) at {Location-A} and is signed in in a second browser or a private window.',
  tech("Technician-A", "Esther Howard", svc=False),
  "Technician {Technician-B} (for example ZZAUTOTEST Jenny Pinned) is an active technician at {Location-A}, made for this case only, and leads no work order.",
  "Technician {Technician-C} (for example ZZAUTOTEST Theresa Pinned) is an active technician at {Location-A} and at a second location {Location-B} (for example Staging Light Duty), made for this case only.",
  'Customer {Customer-A} (for example "ZZAUTOTEST C368131 Pinned Gone") is used by this case only.',
  "Approved work order {Work-order-1} (for example S10043-17691) for {Customer-A} is led by {Technician-A}.",
  "Approved work order {Work-order-2} (for example S10043-17692) for {Customer-A} is led by {Technician-C}.",
  "Both {User-A} and {User-B} have {Technician-B} and {Technician-C} pinned in Board View.",
  "No technician has a shift on the Schedule for {Work-order-1} or {Work-order-2}.",
  CLEAN,
 ],
 "steps": [
  "Click your initials (top right) and open Settings > Staff.",
  "Click {Technician-B}'s edit icon, click Deactivate Account and confirm.",
  "Click {Technician-C}'s edit icon, remove {Location-A} from her Location field (keep {Location-B}) and click Save.",
  "Click Work Orders in the top menu.",
  "Click the All tab, click Search and type the name of {Customer-A}.",
  "Click Board View in the display switcher.",
  "Read the pinned columns right after Unassigned, including {Technician-B}'s column.",
  "Find {Technician-C}'s column further along and read its header.",
  "Drag {Work-order-1} from {Technician-A}'s column onto {Technician-B}'s column and let go.",
  "Drag {Work-order-1} from {Technician-A}'s column onto {Technician-C}'s column and let go.",
  "Read the message that appears and where {Work-order-1} is.",
  "Drag {Work-order-2} from {Technician-C}'s column onto the Unassigned column and let go.",
  "Read the board again.",
  "In the second browser, as {User-B}, open Work Orders, click the All tab and click Board View.",
  "Read the pinned columns.",
 ],
 "results": [
  "Step 7: {Technician-B}'s column is still shown right after Unassigned, so the pin is kept. It is marked inactive and empty, and it reads \"No work orders\", not \"Drag a work order here to assign it\".",
  "Step 7: {Technician-C} is not among the pinned columns.",
  "Step 8: {Technician-C}'s column appears further along as a normal column holding {Work-order-2}, with no pin icon and no inactive marker.",
  "Step 9: the card cannot be dropped on {Technician-B}'s column. {Work-order-1} stays in {Technician-A}'s column.",
  "Steps 10 and 11: the drop is refused with the message \"This technician can't be assigned work orders.\" and {Work-order-1} stays in {Technician-A}'s column.",
  "Step 13: {Work-order-2} is in Unassigned and {Technician-C} no longer has a column at all.",
  "Step 15: for the view-only {User-B}, {Technician-B}'s column also reads \"No work orders\", and there is no {Technician-C} column.",
 ],
 "source": ("Epic SV-10043; stories SV-10046 (Story 3, Board View — board by lead technician) and SV-10047 (Story 4, Reassign or unassign "
            f"the lead technician); {PRD}, S3-R20a, S3-E3, S3-N4, S3-R20b and its context note (Sasha Grosman's answer to SQ-11, 24 Sep 2026), "
            "S3-R20c (added in version 49) and S4-N5 (widened in version 49), both from Chris Ward's answer 2 of 14 Oct 2026 to our question "
            "sheet; read 14 Oct 2026. Sasha Grosman's answer to engineering of 24 Sep 2026 treated a technician who is no longer at this "
            "location like an inactive one; PRD version 49 (14 Oct 2026) says that column shows no inactive marker and refuses drops with its "
            "own message, and we take the later PRD as prevailing. Source-verified 14 October 2026. This version of the case has not yet been "
            "checked against a build (the previous version, updated 9 Oct 2026 for PRD v44, was not re-run on the QA build)."),
 "quotes": [q("S3-R20a"), q("S3-E3"), q("S3-N4"), q("S3-R20b"), q("S3-R20c"), q("S4-N5"), CTXQ],
 "marker": "AUTOMATION: READY",
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  p1_staff("Technician-A", "Esther Howard", svc=False),
  p1_staff("Technician-B", "ZZAUTOTEST Jenny Pinned", new_only=True, svc=False),
  p1_staff("Technician-C", "ZZAUTOTEST Theresa Pinned", new_only=True, svc=False,
           extra_loc=" and one other location {Location-B} (for example Staging Light Duty), so her Location field is never empty"),
  p1_customer("ZZAUTOTEST C368131 Pinned Gone"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Close. The status reads Approved. Write down the number shown at the top "
  "left (for example S10043-17691). Repeat this once more. Number them {Work-order-1} and {Work-order-2}.",
  P1_LEAD + " Give {Work-order-1} the lead {Technician-A} and {Work-order-2} the lead {Technician-C}.",
  "Your initials > Settings > Roles & Permissions > Create Custom Role (for example \"ZZAUTOTEST C368131 View Role\") > turn on Work Orders "
  "view, leave Work Orders create and edit off > Save.",
  "Your initials > Settings > Staff > New Staff Member with an email you can open (for example \"ZZAUTOTEST C368131 Viewer\"), Role = the new "
  "role, at least one Department, Location {Location-A} > Save & Close. Accept the invitation email and set a password. This is {User-B}; keep "
  "it signed in in a second browser or a private window.",
  "As {User-A}, and again as {User-B}: Work Orders > All tab > Board View. If three technicians are already pinned, unpin one (click the filled "
  "pin in its column header), because only three pins are allowed. Click the pin icon in {Technician-B}'s and in {Technician-C}'s column "
  "headers (pins are per user).",
  "Do not book any Schedule shift on {Work-order-1} or {Work-order-2}.",
  "Check the setup worked: for both users, Board View shows {Technician-B} and {Technician-C} right after Unassigned with filled pins. Work "
  "Orders > All tab > Search with the name of {Customer-A} shows {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-C}. "
  "If anything differs, fix it before you start, then clear the search.",
 ],
 "doc_part2": [
  "Goal: two pinned technicians for both users; during the test one is deactivated ({Technician-B}, leading nothing) and one is removed from "
  "{Location-A} ({Technician-C}, still leading {Work-order-2}); then the board is read and three drags are made, and the board is read as a "
  "view-only user.",
  P2_STAFF,
  "Create {Technician-B} and {Technician-C} new for this case (never deactivate or move a shared technician). Create {Customer-A}, its contact "
  "and asset, and {Work-order-1} and {Work-order-2} on screen as in Part 1. Record {Work-order-1 id} and {Work-order-2 id}.",
  "{User-B} needs a second browser context with its own sign-in (the invitation and password are set on screen). Quick login signs in only as "
  "Admin, so {User-B} must sign in with the email and password; keep the password in /tmp only.",
  "UNVERIFIED on the Work Orders QA site: whether the Location field can be left empty, which is why {Technician-C} is given {Location-B} as well.",
  "Steps 1 to 3 change the staff records during the test; do them on screen as written.",
  "Steps 9 to 12: Playwright drag-and-drop from each card to the target column. Read the message after step 10 exactly and compare it character "
  "for character with \"This technician can't be assigned work orders.\" Record where each card ends up and whether any question opened.",
  "Steps 7, 8 and 15: record each column header's text and whether it shows a pin, an inactive marker and the empty-column text. UNVERIFIED: how "
  "the build shows the inactive marker (a label or a badge); record what you see.",
  "Context: this case follows PRD version 49 (14 Oct 2026). Nothing about how the build behaves today is assumed; judge only what you see.",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (link, Preconditions with {placeholders}, setup moved to the doc). PRD v49 S3-R20c: "
                    "{Technician-C}'s column has no inactive marker (step 8) and a drop onto it is refused with \"This technician can't be "
                    "assigned work orders.\" and the work order stays (steps 10-11); the column goes once empty (step 13, kept). S4-N5 quote "
                    "refreshed to v49. Kept: deactivated pinned column reads \"No work orders\" for both users, pin kept (S3-R20a, S3-E3, "
                    "S3-N4), removed technician not pinned (S3-R20b). Own new ZZAUTOTEST technicians, so no shared staff record is changed "
                    "and nothing must be restored. Title without the semicolon. Rule 56 divergence sentence on Sasha's 24 Sep answer."),
})
for a in ("S3-R20a", "S3-E3", "S3-N4", "S3-R20b", "S3-R20c", "S4-N5"): P["anchors_covered"].setdefault(a, []).append(368131)
json.dump(P, open(f"{H}/proposals-v49-b.json", "w"), indent=1, ensure_ascii=False)
print("updates", len(P["updates"]), len(P["updates"][0]["title"]), P["updates"][0]["title"])
