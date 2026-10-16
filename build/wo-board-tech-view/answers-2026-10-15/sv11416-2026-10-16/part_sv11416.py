"""QA lead 16 Oct 2026: "Create a test case for this if not already created and mark it as failed and attach this ticket ...:
SV-11416". No case covered a deleted lead technician (run 498 searched). Board View section 13238 (S3, with the deactivated-technician
cases C96952, C368131). Expected results quote PRD v58 S5-R11b and S3-R3 (every column header names the technician by the staff
record name, the same name List shows); the spec is silent on deletion, so S3-N2/S3-N4 and the 2026-09-13 decision are quoted as
the nearest rules and the open PO question is stated (Rule 56). Writes proposals-sv11416.json."""
import sys, json
sys.path.insert(0, "build/wo-board-tech-view/answers-2026-10-15/apply")
from docparts import SIGNIN, LOCATION, WIDTH, customer, wo, PART2_EVIDENCE
from part_older_a import PRE_ADMIN, PRE_WIDTH, PRE_CLEAR, CLEAR_DOC
H = "build/wo-board-tech-view/answers-2026-10-15/sv11416-2026-10-16"
A = json.load(open(f"{H}/anchor-quotes-current.json"))
PRDF = open("build/wo-board-tech-view/answers-2026-10-15/CONFLUENCE-845185030-v58-2026-10-16.md").read()
DEC = ("Deactivating a technician does not change work orders they already lead. They remain the lead technician on those work "
       "orders so the work stays visible and attributable; they simply receive no new assignments (S2-N2, S3-N2, S3-E3).")
assert DEC in PRDF.replace("**", "")
PRD = ("PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 58 (15 Oct 2026, Chris Ward)")
J = "https://shopview.atlassian.net/browse/SV-11416"
p = {
 "key": "N-SV11416-deleted-lead", "section_id": 13238,
 "title": "Deleting a lead technician leaves no Unknown Technician column in Board View",
 "preconditions": [PRE_ADMIN, PRE_WIDTH,
    "Technician {Technician-A} (for example ZZAUTOTEST SV11416 Dana Delete) is a new staff member made for this case only, active at "
    "{Location-A} with Time Clock on and the Technician role, with no labor recorded on any work order, because this test deletes them.",
    "Customer {Customer-A} (for example \"ZZAUTOTEST SV11416 Deleted Lead\") is used by this case only.",
    "Approved work order {Work-order-1} (for example S10043-17901) for {Customer-A} is led by {Technician-A}.",
    PRE_CLEAR],
 "steps": [
    "Open Work Orders, click the All tab and click Board View in the display switcher.",
    "Type the name of {Customer-A} in Search.",
    "Read the header of the column that holds {Work-order-1}.",
    "Click your initials (top right) and open Settings > Staff.",
    "Click the pencil icon on {Technician-A}.",
    "Click Delete and confirm the deletion.",
    "Open Work Orders, click the All tab and click List in the display switcher.",
    "Type the name of {Customer-A} in Search.",
    "Read the Lead Technician of {Work-order-1} and write it down.",
    "Click Board View in the display switcher.",
    "Find {Work-order-1} and read the header of the column that holds it."],
 "results": [
    "Step 3: {Work-order-1} is in a column headed with {Technician-A}'s name.",
    "Step 11: {Work-order-1} is not in a column headed \"Unknown Technician\". Every column header on the board names whose column it is.",
    "Step 11: if {Work-order-1} is still in a technician's column, that column's header shows the same name as the Lead Technician "
    "you wrote down at step 9."],
 "expect_fail": [
    "Known problem (SV-11416, open: " + J + "): today, at step 11, {Work-order-1} sits in a column headed \"Unknown Technician\" "
    "with a generic person icon. The deleted technician's name is not shown and the column has no inactive marker.",
    "1. If you see exactly that, mark this test Failed and raise nothing new.",
    "2. If it fails in a different way, that is a new problem: report it.",
    "3. If it passes, the fix has shipped: tell the QA lead."],
 "source": (f"Epic SV-10043; story SV-10046 (Story 3, Board View); {PRD}, S5-R11b and S3-R3, with S3-N2, S3-N4 and the Decisions "
            "entry of 2026-09-13 as the nearest rules, read 16 Oct 2026. Defect SV-11416 (open). Source-verified 16 October 2026."),
 "divergence": ("The spec says what happens when a lead technician is deactivated (the work stays in their column, marked inactive, "
                "so it stays attributable) but not when the technician is deleted. SV-11416 asks the product owner to decide: show the "
                "technician's name with the inactive marker, as for a deactivated technician, or move the work order to Unassigned. "
                "Either keeps this case's results; once the product owner decides, this case is updated to that ruling."),
 "quotes": [["S5-R11b", A["S5-R11b"]], ["S3-R3", A["S3-R3"]], ["S3-N2", A["S3-N2"]], ["S3-N4", A["S3-N4"]],
            ["Decisions (2026-09-13)", DEC]],
 "checked": "Last checked against staging on 10/16/2026: failed as described in SV-11416 (the ticket does not record the build marker).",
 "marker": "AUTOMATION: READY - EXPECT FAIL (SV-11416)",
 "doc_part1": [SIGNIN, LOCATION, WIDTH,
    "Your initials > Settings > Staff > New Staff Member. Make a new one for this case, never reuse one, because the test deletes it. "
    "Enter First Name and Last Name (for example ZZAUTOTEST SV11416 Dana Delete), an Email with ZZAUTOTEST in it, Role Technician, "
    "at least one Department (required), Location {Location-A}, turn Time Clock on, then Save & Close. Make sure the staff member is "
    "active. Do not record labor for them on any work order. This is {Technician-A}.",
    customer("Customer-A", "ZZAUTOTEST SV11416 Deleted Lead"),
    wo("Work-order-1", "Customer-A", "S10043-17901", lead="Technician-A"),
    CLEAR_DOC,
    "Check the setup worked: Work Orders > All > Board View > Search the name of {Customer-A} shows {Work-order-1} in {Technician-A}'s "
    "column. Then empty Search."],
 "doc_part2": [
    "Goal: delete the lead technician of one work order and read Board View's column header for that work order, then compare it "
    "with List's Lead Technician.",
    "Fact (C368191 run, 15 Oct 2026, staging): deleting a staff member who has recorded labor is refused with \"Staff is being used "
    "elsewhere.\" This case's technician has no labor, only the lead, so the delete goes through (SV-11416 steps).",
    "The test deletes {Technician-A}, so each run needs a new technician; the old ZZAUTOTEST work order and customer can stay.",
    PART2_EVIDENCE],
 "why": "SV-11416 (QA lead, 16 Oct 2026): a deleted lead technician's work order shows under \"Unknown Technician\" in Board View."}
json.dump({"new": [p]}, open(f"{H}/proposals-sv11416.json", "w"), indent=1, ensure_ascii=False)
print(len(p["title"]), "title chars")
