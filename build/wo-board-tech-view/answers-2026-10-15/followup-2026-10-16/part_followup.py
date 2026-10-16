"""Follow-up (QA lead, 16 Oct 2026: "1. Yes ... 2. Same as above"): C581895 updated for PRD v54 S5-R11b (answer 23; retest), and
four older cases whose quoted PRD wording had gone stale before 14 Oct (C96963, C97009, C368158: S4-N2 without Imported;
C368130: the reworded Design updates line). All five rewritten in full to the Rule 117 layout, each with a new setup Doc."""
import sys
sys.path.insert(0, "build/wo-board-tech-view/answers-2026-10-15/apply")
from common import *
from docparts import *
from part_older_a import PRE_ADMIN, PRE_WIDTH, PRE_CLEAR, CLEAR_DOC, pre_tech, src, mk


def to_invoiced(ph):
    return (f"Then on {{{ph}}}: click the line's Complete button, type a Tech Story (fill any missing detail it asks for, for example "
            "Mileage) and click Complete Line; click the Finance tab and click Mark Reviewed (in the Mark as reviewed window fill "
            "Mileage or Engine Hours if asked and click Confirm review); then on the Finance tab click Create Invoice. The status reads Invoiced.")


def to_paid(ph):
    return to_invoiced(ph) + " Then on the Finance tab click New Payment, enter the full amount and click Make Payment. The status reads Paid."


def to_complete(ph):
    return (f"Then on {{{ph}}}: click the line's Complete button, type a Tech Story and click Complete Line; click the Finance tab and "
            "click Mark Reviewed (fill Mileage or Engine Hours if asked) and click Confirm review. The status reads Complete.")


def wo_declined(ph, cust, example, lead):
    return (f"Work Orders > Create Work Order > in the New Work Order window pick {{{cust}}} and its asset > Save (if a Confirmation about "
            "the credit limit appears, click Create). In the New Line form type \"grease\", pick the ready-made line \"Service - Full "
            "grease service\" and click Save & Close with Line Approved off; it is the work order's only line. Write down the number "
            f"shown at the top left (for example {example}). This is {{{ph}}}. While it is an Estimate its Lead Technician is "
            f"read-only on the page, so give it its lead from Board View: the card's More actions (…) > Reassign lead technician > "
            f"pick {{{lead}}} > Reassign. Then open {{{ph}}} and click Decline on its line. The status reads Declined.")


def c581895():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Technicians {Technician-A} (for example ZZAUTOTEST Staffname Ana) and {Technician-B} (for example ZZAUTOTEST Staffname "
           "Ben) are active staff members at {Location-A} with Time Clock on and a Role other than Office User or Time Clock User.",
           "Where the site allows it, each technician's staff record name differs from the name on their sign-in account (for example "
           "staff record ZZAUTOTEST Staffname Ana, account ZZAUTOTEST Account Ana). On staging the two names cannot differ, because "
           "renaming either one renames both, so there every name simply has to match Settings > Staff.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST S5R11b Staff Names\") is used by this case only.",
           "Approved work order {Work-order-1} (for example S10043-17791) for {Customer-A} is led by {Technician-A} and has two approved "
           "lines, {Line-1} and {Line-2} (for example \"Service - Full grease service\" twice).",
           "{Line-2}'s technician is {Technician-B}, set through Edit Line.",
           "List shows the Lead Technician column, Board View's Fields to display has Lead technician and Line technicians on, and Tech "
           "View shows the Assigned Techs column (it is on by default).",
           PRE_CLEAR]
    steps = ["Click your initials (top right) and open Settings > Staff.",
             "Write down the names shown for {Technician-A} and {Technician-B}.",
             "Open Work Orders, click the All tab and click List in the display switcher.",
             "Type the name of {Customer-A} in Search.",
             "Read the Lead Technician of {Work-order-1}.",
             "Click Board View in the display switcher.",
             "Read the lead technician name on {Work-order-1}'s card.",
             "Read the header of the column that holds {Work-order-1}.",
             "Hover each avatar in the card's line technicians, and the +N if one shows, and read each name.",
             "Click Tech View in the display switcher.",
             "Read the header of the group that holds {Work-order-1}.",
             "Hover each avatar in {Work-order-1}'s Assigned Techs cell, and the +N if one shows, and read each name."]
    res = ["Step 5: List's Lead Technician shows {Technician-A}'s staff record name, as written down at step 2.",
           "Step 7: the card's lead technician name is the same staff record name.",
           "Step 8: the column header shows {Technician-A}'s staff record name.",
           "Step 9: the names shown on hover are the staff record names of {Technician-A} and {Technician-B}, as written down at step 2.",
           "Step 11: the group header shows {Technician-A}'s staff record name.",
           "Step 12: the names shown on hover are the staff record names of {Technician-A} and {Technician-B}.",
           "Steps 5 to 12: no other name for either technician appears anywhere (for example not ZZAUTOTEST Account Ana)."]
    return mk(581895, "Technician names and avatar hover names match the staff record in both views", pre, steps, res,
              src("story SV-10048 (Story 5, Choose what is shown); SV-10050 (Story 7, Line technicians)",
                  "S5-R11b, S2-R10, S7-R1, S7-R6, S2-R12 and S3-R12", answers=(4, 23),
                  extra="S5-R11b was added in version 49 from Chris Ward's answer 4 (14 Oct 2026) and widened in version 54 from answer 23 "
                        "to every name in both views, avatar hover names included. Developer note (Slack #fs-board-tech-view, 12 Oct "
                        "2026): staff record and account names can differ on the QA data. Staging keeps one name per technician "
                        "(found by the test-run session on 15 Oct 2026).",
                  checked="The previous version of this case was run on staging (build v26.40.17-a5c4210) on 10/15/2026."),
              [q("S5-R11b"), q("S2-R10"), q("S7-R1"), q("S7-R6"), q("S2-R12"), q("S3-R12")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH,
               tech("Technician-A", "ZZAUTOTEST Staffname Ana"), tech("Technician-B", "ZZAUTOTEST Staffname Ben"),
               "Names: on a QA site, compare each technician's name in Settings > Staff with the name their own account shows after they "
               "sign in (their initials > Edit Profile). If you can find two technicians whose two names differ, use them as {Technician-A} "
               "and {Technician-B}. On staging the names never differ; use any two technicians.",
               customer("Customer-A", "ZZAUTOTEST S5R11b Staff Names"),
               wo("Work-order-1", "Customer-A", "S10043-17791", lead="Technician-A"),
               "On {Work-order-1}'s Lines tab the first line is {Line-1}. Click New Line, type \"grease\", pick \"Service - Full grease "
               "service\", turn Line Approved on and click Save & Close: this is {Line-2}. On {Line-2} click Edit Line, pick {Technician-B} "
               "as its technician and save.",
               "Work Orders > All > List > Column Selection: turn Lead Technician on. Board View > Fields to display: turn Lead technician "
               "and Line technicians on. Tech View: check the Assigned Techs column shows (it is on by default).",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows {Work-order-1} with Lead "
               "Technician {Technician-A}. Then empty Search."],
              ["Goal: one work order led by {Technician-A} with {Technician-B} on a line; compare every name shown in the two views with "
               "Settings > Staff.",
               "Record each technician's staff record name and account name, and every rendered name (visible text and the hover text) "
               "on the List, the card, the column header, the group header and both avatar groups."],
              "Rewritten in full to the Rule 117 layout (own setup Doc; it had no doc link after the 15 Oct rewrite). Answer 23 / PRD "
              "v54 S5-R11b: the avatar hover names on cards and in Tech View rows must also be the staff record name (was: each "
              "technician can be found by name). Staging's one-name limit is stated in the preconditions. Retest.",
              divergence="Until 15 Oct 2026 the PRD named only cards and headers, and this case only checked that each technician could be "
                         "found by name in a row's avatars. Chris Ward answered on 15 Oct 2026 (answer 23) that every technician name in "
                         "both views, avatar hover names included, is the staff record name; PRD version 54 says so. On staging a "
                         "technician's staff record and sign-in account always carry the same name, so there the case shows that every "
                         "name matches Settings > Staff but cannot show which of the two the screen reads; run it where the names can "
                         "differ to prove that.")


S4N2_NOTE = ("In version 48 (12 Oct 2026) S4-N2 dropped Imported from the locked statuses (Imported work orders now open in List "
             "only); the Invoiced and Paid rules this case checks are unchanged, so the expected results are unchanged.")


def c96963():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "Esther Howard"), pre_tech("Technician-B", "Ralph Edwards"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Invoiced Paid Locked\") is used by this case only and has six work "
           "orders whose Lead Technician was set while they were still open (for example S10043-17801 to S10043-17806): "
           "{Work-order-1} Approved, led by {Technician-A}; {Work-order-2} Invoiced, led by {Technician-A}; {Work-order-3} Paid, led by "
           "{Technician-A}; {Work-order-4} Invoiced, with no lead technician; {Work-order-5} Declined, led by {Technician-A}; "
           "{Work-order-6} Complete, led by {Technician-A}.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["Open Work Orders, click the All tab and click Board View in the display switcher.",
             "Type the name of {Customer-A} in Search.",
             "Drag {Work-order-2}'s card from {Technician-A}'s column into {Technician-B}'s column.",
             "Drag {Work-order-2}'s card into the Unassigned column.",
             "Drag {Work-order-2}'s card within {Technician-A}'s column to above {Work-order-1}.",
             "Drag {Work-order-3}'s card into {Technician-B}'s column, then into the Unassigned column, then within {Technician-A}'s column to above {Work-order-1}.",
             "Drag {Work-order-4}'s card into {Technician-A}'s column, then drag it to a new place within the Unassigned column.",
             "Drag {Work-order-5}'s card into {Technician-B}'s column (click Keep shifts if asked).",
             "Drag {Work-order-6}'s card into {Technician-B}'s column (click Keep shifts if asked).",
             "Open {Work-order-2} and try to change Lead Technician on the work order page.",
             "Go back, click Tech View in the display switcher and do steps 3 to 7 again with the rows, then drag {Work-order-5} and {Work-order-6} from {Technician-B}'s group back into {Technician-A}'s group."]
    res = ["Steps 3, 4 and 6: {Work-order-2} and {Work-order-3} cannot be moved to {Technician-B} or to Unassigned: the card goes back "
           "to {Technician-A}'s column and the lead stays {Technician-A}.",
           "Steps 5 and 6: {Work-order-2} and {Work-order-3} can be moved within {Technician-A}'s column and keep their new place.",
           "Step 7: {Work-order-4} cannot be moved out of Unassigned, but it can be reordered inside it.",
           "Steps 8 and 9: {Work-order-5} (Declined) and {Work-order-6} (Complete) move to {Technician-B} normally, with \"Lead "
           "technician updated\".",
           "Step 10: on the work order page the Lead Technician of {Work-order-2} cannot be changed either.",
           "Step 11: Tech View follows the same rules for every move. A change sent outside the screens is also refused by the "
           "server; this part cannot be checked by hand, so write \"server refusal not checked by hand\" in the result comment and "
           "pass or fail on what you can see. Imported work orders are checked in their own case."]
    kd = ("Lead technician cannot be changed once a work order is Invoiced or Paid. This is a product rule, not only a screen rule, "
          "so it must hold on every path that changes the lead technician — board drag, Reassign dialog, and the work order detail page.")
    return mk(96963, "The lead of an Invoiced or Paid work order cannot be changed in any way", pre, steps, res,
              src("story SV-10047 (Story 4, Reassign or unassign the lead technician)",
                  "S4-R10, S4-N2 and Key decision: lead locked once Invoiced or Paid",
                  extra=S4N2_NOTE + " Review Decisions DR-37 (Declined and Complete move freely). PO answer to engineering, Sasha "
                        "Grosman 24 Sep 2026 (Invoiced/Paid reorder within their technician or within Unassigned).",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S4-R10"), q("S4-N2"), ["Key decision: lead locked once Invoiced or Paid", kd]], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"),
               customer("Customer-A", "ZZAUTOTEST F1 Invoiced Paid Locked"),
               wo("Work-order-1", "Customer-A", "S10043-17801", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17802", lead="Technician-A") + " " + to_invoiced("Work-order-2"),
               wo("Work-order-3", "Customer-A", "S10043-17803", lead="Technician-A") + " " + to_paid("Work-order-3"),
               wo("Work-order-4", "Customer-A", "S10043-17804") + " " + to_invoiced("Work-order-4"),
               wo_declined("Work-order-5", "Customer-A", "S10043-17805", "Technician-A"),
               wo("Work-order-6", "Customer-A", "S10043-17806", lead="Technician-A") + " " + to_complete("Work-order-6"),
               no_shifts("{Technician-A} and {Technician-B}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows the six work orders with the "
               "statuses and leads listed in the Preconditions. If not, fix the status or lead before starting. Then empty Search."],
              ["Goal: one work order in each of Approved, Invoiced, Paid, Invoiced with no lead, Declined and Complete; try every move.",
               "Record each card's column and lead after every drop; read Lead Technician from the work order page at the end."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S4-N2 re-quoted from v54 (Imported "
              "removed in v48). [Tech-A]/[WO-n] became {Technician-A}/{Work-order-n}; the example numbers are no longer named as fixed values.")


def c97009():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"), pre_tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F3 Invoiced Lock\") is used by this case only and has six work orders (for "
           "example S10043-17811 to S10043-17816): {Work-order-1} Approved, {Work-order-2} Invoiced, {Work-order-3} Paid, "
           "{Work-order-4} Declined and {Work-order-5} Complete, all led by {Technician-A}, and {Work-order-6} Invoiced with no lead technician.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the name of {Customer-A} in Search.",
             "Click Board View in the display switcher.",
             "Look at the {Work-order-2} and {Work-order-3} cards and hover the lock or any marker on them.",
             "Drag {Work-order-2}'s card above {Work-order-1}'s card inside {Technician-A}'s column and release it.",
             "Drag {Work-order-2}'s card into {Technician-B}'s column and release it.",
             "Drag {Work-order-3}'s card into the Unassigned column and release it.",
             "Drag {Work-order-6}'s card from Unassigned into {Technician-A}'s column and release it.",
             "Drag {Work-order-4}'s card into {Technician-B}'s column and release it, then drag {Work-order-5}'s card into {Technician-B}'s column and release it.",
             "Click Tech View in the display switcher.",
             "Drag {Work-order-3}'s row into {Technician-B}'s group and release it."]
    res = ["Step 4: {Work-order-2} and {Work-order-3} show that they can only be reordered within {Technician-A}'s work, not moved "
           "to another technician (the design shows a lock with the text \"Invoiced · can't be reassigned\"). Write down the words "
           "you see where they differ from these; a different label alone is not a fail.",
           "Step 5: {Work-order-2} moves above {Work-order-1}. Reordering within the same technician is allowed.",
           "Steps 6 and 7: {Work-order-2} cannot be dropped on {Technician-B} and {Work-order-3} cannot be dropped on Unassigned. "
           "Both stay in {Technician-A}'s column, no lead-change message appears and {Technician-A}'s count is unchanged.",
           "Step 8: {Work-order-6} cannot be moved out of Unassigned. It stays there.",
           "Step 9: {Work-order-4} (Declined) and {Work-order-5} (Complete) move to {Technician-B}'s column with \"Lead technician updated\".",
           "Step 11: the same rule holds in Tech View. {Work-order-3} stays in {Technician-A}'s group."]
    tp = ("In a locked status a work order can be dragged within its current technician (or within Unassigned if it has no lead); it "
          "cannot be dropped on another technician, and cannot move between a technician and Unassigned.")
    return mk(97009, "Invoiced and Paid work orders can only be reordered within their technician", pre, steps, res,
              src("story SV-10052 (Story 9, Drag to reorder work and technician groups/columns); SV-10047 (Story 4, Reassign or "
                  "unassign the lead technician)", "S9-N1, S4-N2 and S4-N7",
                  extra=S4N2_NOTE + " Review Decisions page 853901313, DR-37 (25 Sep 2026). Design screen: lock text \"Invoiced · "
                        "can't be reassigned\". Tech plan (revised 24 Sep 2026) section 3.23.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S9-N1"), q("S4-N2"), q("S4-N7"), ["Tech plan 3.23 lead lock vs reorder", tp]], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha"), tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
               customer("Customer-A", "ZZAUTOTEST F3 Invoiced Lock"),
               wo("Work-order-1", "Customer-A", "S10043-17811", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17812", lead="Technician-A") + " " + to_invoiced("Work-order-2"),
               wo("Work-order-3", "Customer-A", "S10043-17813", lead="Technician-A") + " " + to_paid("Work-order-3"),
               wo_declined("Work-order-4", "Customer-A", "S10043-17814", "Technician-A"),
               wo("Work-order-5", "Customer-A", "S10043-17815", lead="Technician-A") + " " + to_complete("Work-order-5"),
               wo("Work-order-6", "Customer-A", "S10043-17816") + " " + to_invoiced("Work-order-6"),
               no_shifts("{Technician-A} and {Technician-B}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows exactly six work orders: "
               "{Work-order-1} Approved, {Work-order-2} Invoiced, {Work-order-3} Paid, {Work-order-4} Declined and {Work-order-5} "
               "Complete, all led by {Technician-A}, and {Work-order-6} Invoiced with no lead. Then empty Search."],
              ["Goal: Invoiced and Paid work orders beside open ones; reorder within the technician and try to move them out."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S4-N2 re-quoted from v54 (Imported "
              "removed in v48). Six customers became one customer with {Work-order-1..6}.")


def c368158():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F3 Invoiced On Site\") is used by this case only and has one work order, "
           "{Work-order-1} (for example S10043-17821), led by {Technician-A} and then Invoiced.",
           "List shows the On Site column with a toggle in each row.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the name of {Customer-A} in Search.",
             "Click List in the display switcher.",
             "In {Work-order-1}'s row, click the On Site toggle to change it.",
             "Refresh the page and read the On Site value.",
             "Open {Work-order-1} and read Lead Technician and Asset on site."]
    res = ["Step 4: the change is accepted with no error.",
           "Step 5: after the refresh the new On Site value is kept.",
           "Step 6: Lead Technician is still {Technician-A}, and Asset on site shows the new value. The lock on Invoiced work orders "
           "does not block the On Site toggle."]
    tp = "Re-sending the *current* lead stays a no-op so the asset-on-site toggle keeps working on invoiced work orders."
    return mk(368158, "The On Site toggle still saves on an Invoiced work order", pre, steps, res,
              src("story SV-10047 (Story 4, Reassign or unassign the lead technician)", "S4-N2",
                  extra=S4N2_NOTE + " Work Orders Board View & Tech View Display Options Technical Implementation Plan (revised 24 Sep "
                        "2026, uploaded 8 Oct 2026), section 5 (the change endpoint) and the Phase 3 browser walk.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S4-N2"), ["Tech plan 5 change endpoint", tp]], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha"),
               customer("Customer-A", "ZZAUTOTEST F3 Invoiced On Site"),
               wo("Work-order-1", "Customer-A", "S10043-17821", lead="Technician-A") + " " + to_invoiced("Work-order-1"),
               "Work Orders > All > List: if the rows show no On Site toggle, open Column Selection and turn On Site on. If it cannot be "
               "shown, report the case Blocked with that reason.",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows exactly {Work-order-1}, "
               "Invoiced, led by {Technician-A}, with an On Site toggle in its row. Then empty Search."],
              ["Goal: one Invoiced work order with a lead; flip its On Site toggle in List and check the lead is untouched."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S4-N2 re-quoted from v54 (Imported "
              "removed in v48). Step 6 now also reads Asset on site on the work order page, which the step already asked for.")


def c368130():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Location {Location-A} (for example \"ZZAUTOTEST F2 Empty Shop\") is used by this case only and has no technicians: no "
           "staff member has {Location-A} in their Location field. You are working at {Location-A}.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F2 No Tech Location\") has two Approved work orders at {Location-A}, "
           "{Work-order-1} and {Work-order-2} (for example S10043-17831 and S10043-17832), with no lead technician.",
           PRE_CLEAR]
    steps = ["Open Work Orders and click the All tab.",
             "Click Tech View in the display switcher.",
             "Read what the page shows.",
             "Click Board View in the display switcher.",
             "Read what the page shows."]
    res = ["Step 3: Tech View shows the Unassigned group holding {Work-order-1} and {Work-order-2}, and no technician groups.",
           "Step 5: Board View shows the Unassigned column holding {Work-order-1} and {Work-order-2}, and no technician columns.",
           "Steps 3 and 5: both displays explain that there are no technicians. The PRD does not fix the wording: write down what you "
           "see (the design reads \"No technicians yet\" and \"Add technicians to assign work orders. Until then, every work order "
           "stays in Unassigned.\"). A different wording alone is not a fail."]
    du = "Filtered-empty results (the List's empty state, S1-N1), and an organization with no technicians, in both new views."
    return mk(368130, "A location with no technicians shows only Unassigned in Tech View and Board View", pre, steps, res,
              src("story SV-10045 (Story 2, Tech View — table grouped by lead technician)", "Design updates required from Branko, "
                  "S2-R2 and S3-R1",
                  extra="The Design updates line was reworded in version 43 (8 Oct 2026); the no-technicians state is still listed as "
                        "design work, so the expected results are unchanged. Claude Design export of 14 Oct 2026 (Work Orders.dc.html), "
                        "no-technicians empty state. PRD footer comment Slavcho Mitrov 1 Oct 2026 item 3 (the panel explains work "
                        "stays in Unassigned, no Add Technician button).",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [["Design updates required from Branko", du], q("S2-R2"), q("S3-R1"),
               ["Design — Work Orders.dc.html, no-technicians empty state", "Add technicians to assign work orders. Until then, every work order stays in Unassigned."]],
              "AUTOMATION: READY",
              [SIGNIN,
               "Create a location with no technicians: your initials > Settings > Locations > New Location > Name (for example "
               "\"ZZAUTOTEST F2 Empty Shop\"), Address 1, City, State/Province, ZIP/Postal Code, Timezone and Telephone (all required; "
               "any test values) > Save & Close. The window notes \"Setting up a new location may result in additional billing.\" This "
               "is {Location-A}. Do not pick {Location-A} in anyone's Location field (Settings > Staff).",
               "Click your initials > Change Location and pick {Location-A}.", WIDTH,
               customer("Customer-A", "ZZAUTOTEST F2 No Tech Location"),
               wo("Work-order-1", "Customer-A", "S10043-17831"),
               wo("Work-order-2", "Customer-A", "S10043-17832"),
               CLEAR_DOC,
               "Check the setup worked: the top bar next to the bell shows {Location-A}; Work Orders > All lists {Work-order-1} and "
               "{Work-order-2} with an empty Lead Technician. If other work orders or a technician show at {Location-A}, use a fresh location."],
              ["Goal: a location with no technicians and two unassigned work orders; read Tech View and Board View."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. The Design updates line re-quoted in "
              "its current wording (reworded in v43); the design's empty-state text is now quoted from the 14 Oct export.")


FOLLOWUP = [c581895, c96963, c97009, c368158, c368130]
