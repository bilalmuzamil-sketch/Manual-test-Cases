#!/usr/bin/env python3
"""Third batch of the PRD v49 pass (14 Oct 2026, QA lead's yes via the coordinator): full rewrite of C97010 to the current Rule 117
layout. The old "turn the network off" step (not something a manual tester can rely on, Rule 114) becomes a real by-hand route:
the work order is invoiced in a second tab while the board in the first tab still shows it movable, then dragged in the first tab
(S9-E1 / S4-E3: the status changed before the drop completed, so the drop is rejected with S4-N3 / S4-N8). If the board already
shows the card locked, the case says plainly that the failed-save part cannot be checked by hand.
Quotes copied by code from the saved PRD v49. Writes proposals-v49-c.json. Run from the repo root."""
import json
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"
src = open(f"{H}/build_proposals_v49.py").read().split("PROPOSALS = {")[0]
ns = {}; exec(compile(src, "helpers", "exec"), ns)
q, signed, WIDTH, CLEAN, tech, PRD = ns["q"], ns["signed"], ns["WIDTH"], ns["CLEAN"], ns["tech"], ns["PRD"]
P1_SIGN, P1_LOC, P1_WIDTH, p1_staff, p1_customer = ns["P1_SIGN"], ns["P1_LOC"], ns["P1_WIDTH"], ns["p1_staff"], ns["p1_customer"]
P1_NEWWO, LINE_A, P1_LEAD, P2_STAFF, P2_EVID = ns["P1_NEWWO"], ns["LINE_A"], ns["P1_LEAD"], ns["P2_STAFF"], ns["P2_EVID"]
STAMP = "Last checked against build v26.40.8-7a95011 on 10/8/2026."   # kept exactly as on the live case (asserted before the write)

P = {"updates": [], "new": [], "retire": [], "anchors_covered": {}, "notes": []}
P["updates"].append({
 "case_id": 97010,
 "title": "Nothing can be dropped on an inactive technician, and a failed drop goes back",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "ZZAUTOTEST Ana Alpha", svc=False),
  tech("Technician-B", "ZZAUTOTEST Ben Bravo", svc=False),
  'Customer {Customer-A} (for example "ZZAUTOTEST C97010 Failed Drop") is used by this case only.',
  "Approved work order {Work-order-1} (for example S10043-17701) for {Customer-A} is led by {Technician-A}.",
  "Work order {Work-order-2} (for example S10043-17702) for {Customer-A} is led by {Technician-A}, is Complete (reviewed) and has not been invoiced, so Create Invoice is offered on its Finance tab.",
  "Approved work order {Work-order-3} (for example S10043-17703) for {Customer-A} is led by technician {Technician-C} (for example ZZAUTOTEST Dan Delta), made for this case only.",
  "After {Work-order-3} was given its lead, {Technician-C}'s staff account was deactivated.",
  "No technician has a shift on the Schedule for {Work-order-1}, {Work-order-2} or {Work-order-3}.",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Read {Technician-C}'s column header and its count.",
  "Drag {Work-order-1} from {Technician-A}'s column onto {Technician-C}'s column and let go.",
  "Read where {Work-order-1} is and {Technician-C}'s count.",
  "Open a second browser tab and open {Work-order-2} in it.",
  "In the second tab, click the Finance tab and click Create Invoice.",
  "Go back to the first tab. Do not refresh it.",
  "Drag {Work-order-2} from {Technician-A}'s column onto {Technician-B}'s column and let go.",
  "Read where {Work-order-2} is and the alert that appears.",
  "Wait about ten seconds and check whether the alert is still shown.",
  "Click the alert's dismiss (X) button.",
  "Refresh the page.",
  "Open {Work-order-2} and read its Lead Technician.",
 ],
 "results": [
  "Step 3: {Technician-C}'s column is still shown with {Work-order-3}, is marked inactive and its count is 1.",
  "Step 5: the drop is not accepted. {Work-order-1} stays in {Technician-A}'s column, {Technician-C}'s count stays 1 and no \"Lead technician updated\" message appears.",
  "Steps 9 and 10: the move cannot be saved. {Work-order-2} goes back to {Technician-A}'s column and the alert reads \"Failed to update lead technician, please try again.\", with a message explaining that the work order's status does not allow the change. If the first tab already showed {Work-order-2} as locked and it could not be dragged onto {Technician-B}'s column, this part cannot be checked by hand: write \"not checked by hand\" in the result comment.",
  "Steps 11 and 12: the alert stays on screen until you dismiss it.",
  "Steps 13 and 14: {Work-order-2} is in {Technician-A}'s column and its Lead Technician is still {Technician-A}.",
 ],
 "source": ("Epic SV-10043; stories SV-10052 (Story 9, Drag to reorder work and technician groups/columns), SV-10047 (Story 4, Reassign or "
            f"unassign the lead technician) and SV-10046 (Story 3, Board View); {PRD}, S9-N2, S9-E1, S4-N5 (widened in version 49 from Chris "
            "Ward's answer 2 of 14 Oct 2026 to also name a technician not enrolled at this location; this case checks the inactive technician), "
            "S3-N2, S3-N4, S4-E3, S4-N3, S4-N8, S4-N2 and S4-R10, read 14 Oct 2026. The failed save is produced by invoicing the work order in a "
            "second tab before the drop lands, which replaces the earlier way of turning the network off. Source-verified 14 October 2026. "
            "This version of the case has not yet been checked against a build (the previous version was last checked against build "
            "v26.40.8-7a95011 on 10/8/2026)."),
 "quotes": [q("S3-N2"), q("S3-N4"), q("S4-N5"), q("S9-N2"), q("S9-E1"), q("S4-E3"), q("S4-N3"), q("S4-N8"), q("S4-N2"), q("S4-R10")],
 "stamp": STAMP,
 "marker": "AUTOMATION: READY",
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  p1_staff("Technician-A", "ZZAUTOTEST Ana Alpha", svc=False),
  p1_staff("Technician-B", "ZZAUTOTEST Ben Bravo", svc=False),
  p1_staff("Technician-C", "ZZAUTOTEST Dan Delta", new_only=True, svc=False),
  p1_customer("ZZAUTOTEST C97010 Failed Drop"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Close. The status reads Approved. Write down the number shown at the top "
  "left (for example S10043-17701). Repeat this twice more. Number them {Work-order-1}, {Work-order-2} and {Work-order-3} in the order you "
  "create them.",
  P1_LEAD + " Give {Work-order-1} and {Work-order-2} the lead {Technician-A}, and {Work-order-3} the lead {Technician-C}.",
  "Complete {Work-order-2}: on its Lines tab click the line's Complete button, type a Tech Story (fill any missing detail it asks for, for "
  "example Mileage) and click Complete Line (the List shows \"Ready For Review\"). Then click Mark Reviewed, enter the VIN if asked and click "
  "Confirm Review. The status reads Complete. Do not click Create Invoice now.",
  "Deactivate {Technician-C}: your initials > Settings > Staff > {Technician-C}'s edit icon > click Deactivate Account and confirm.",
  "Do not book any Schedule shift on the three work orders.",
  "Check the setup worked: Work Orders > All tab > Search with the name of {Customer-A} shows {Work-order-1} (Approved) and {Work-order-2} "
  "(Complete) led by {Technician-A}, and {Work-order-3} (Approved) led by {Technician-C}. {Work-order-2}'s Finance tab offers Create Invoice. "
  "Settings > Staff shows {Technician-C} deactivated. If anything differs, fix it before you start, then clear the search.",
 ],
 "doc_part2": [
  "Goal: a deactivated technician {Technician-C} still leading {Work-order-3}; a Complete, not yet invoiced {Work-order-2}; then a refused drop "
  "onto {Technician-C}, and a failed move of {Work-order-2} because it is invoiced in a second tab before the drop lands.",
  P2_STAFF,
  "Create {Technician-C} new for this case (never deactivate a shared technician). Create {Customer-A}, its contact and asset, and "
  "{Work-order-1} to {Work-order-3} on screen as in Part 1. Record {Work-order-1 id} to {Work-order-3 id}.",
  "Use two pages in one Playwright browser context: page 1 holds Board View (steps 1 to 5 and 8 to 13), page 2 opens {Work-order-2} and "
  "clicks Create Invoice (steps 6 and 7). Never reload page 1 between step 7 and step 9.",
  "UNVERIFIED on the Work Orders QA site: whether Board View refreshes a card by itself when another tab changes its status, and whether "
  "Create Invoice needs anything more on this build. If page 1 already shows {Work-order-2} locked before step 9 (it is then offered only "
  "within {Technician-A}'s column), record that and mark steps 9 and 10 as not checked by hand; do not force the request outside the screen.",
  "Steps 9 and 10: record the network answer to the drop (the tech plan says the board move is refused only when the lead would change) and "
  "read the alert text exactly; compare it character for character with \"Failed to update lead technician, please try again.\" Record the "
  "status explanation exactly as shown (the PRD does not give its wording).",
  "Steps 13 and 14: confirm with GET on {Work-order-2} that the lead is still {Technician-A} and the status is Invoiced.",
  "Context: this case follows PRD version 49 (14 Oct 2026). Nothing about how the build behaves today is assumed; judge only what you see.",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (link, Preconditions with {placeholders}, setup moved to the doc). The network-off "
                    "step (Rule 114) is replaced by a by-hand route: {Work-order-2} is invoiced in a second tab while the first tab's board "
                    "still shows it movable, then dragged there (S9-E1, S4-E3: rejected with S4-N3/S4-N8 and a status explanation); if the "
                    "card already shows locked, the case says plainly the failed-save part cannot be checked by hand. Inactive half kept "
                    "(S4-N5 v49, S3-N2, S3-N4). Own ZZAUTOTEST technician {Technician-C} is the one deactivated. Quotes re-copied from v49. "
                    "Build stamp of 10/8/2026 and AUTOMATION: READY kept; this version not yet checked against a build."),
})
for a in ("S3-N2", "S3-N4", "S4-N5", "S9-N2", "S9-E1", "S4-E3", "S4-N3", "S4-N8", "S4-N2", "S4-R10"): P["anchors_covered"].setdefault(a, []).append(97010)
json.dump(P, open(f"{H}/proposals-v49-c.json", "w"), indent=1, ensure_ascii=False)
print("updates", len(P["updates"]), len(P["updates"][0]["title"]), P["updates"][0]["title"])
