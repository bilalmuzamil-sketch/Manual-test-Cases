#!/usr/bin/env python3
"""Byte-verified update_case for existing cases the Fabian-review changes make stale.
Sends all three text fields (§2.1). Rule-69 marker (build deferred). Re-stamped provenance."""
import sys, json, os, datetime
sys.path.insert(0,'/tmp/testrail'); import tr

MARK="AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"
OPLOG=os.path.join(os.path.dirname(__file__),'oplog-update.jsonl')
def log(r):
    open(OPLOG,'a').write(json.dumps(r)+'\n')

def prov(anchors, extra_story):
    a=", ".join(anchors)
    return (f"This is the expected behaviour as per epic SV-8685, read on 17 August 2026, "
            f"and stories {extra_story} and the Schedule specification version 30 ({a}), read on 17 August 2026.")

def exp(items, anchors, extra_story):
    return "\n".join(items)+"\n\n---\n"+prov(anchors,extra_story)+"\n\n"+MARK+"\n"

UPDATES = {
 30054: dict(
   refs="SV-8700; SV-9242 (§7; §4.10; §14.1 empty-cell menu)",
   preconds="\n".join([
     "1. You are signed in on a desktop browser with Schedule: Edit.",
     "2. You are on the Schedule page in week view (the same menu is offered in month view).",
     "3. Schedulable work order lines exist, and at least one existing work order is available to assign."]),
   steps="\n".join([
     "1. Left-click an empty spot in a technician's grid cell (not on an existing shift or event block).",
     "2. Read the menu items and their order."]),
   expected=exp([
     "1. A dropdown menu opens at the spot you clicked.",
     "2. It contains THREE items, in this order: 'Assign work order' (first), 'Create Event', and 'New Work Order'.",
     "3. 'Assign work order' is listed first, above 'Create Event' and 'New Work Order'.",
     "4. There is no 'View Day' item and no 'New Shift' item - both were removed.",
     "5. This menu is opened by a normal left-click - right-clicking the cell does not open it."],
     ["§7","§4.10","§14.1"], "SV-8700 and SV-9242 (Assign work order menu item)")),
 29931: dict(
   refs="SV-8686; SV-9234 (§3.2; §4.2; §4.4; §8.1 unassigned lane)",
   preconds="\n".join([
     "1. You are signed in on a desktop browser.",
     "2. You are on the Schedule page.",
     "3. At least one unassigned shift exists (a user with Edit permission drops a work order onto a department group header row first)."]),
   steps="\n".join([
     "1. Look at a department group header row in the schedule grid.",
     "2. Note where an unassigned shift is displayed."]),
   expected=exp([
     "1. The department group header row acts as that department's unassigned lane, inside the grid itself - it is not a separate tray or panel, and it is one row, not a separate second row.",
     "2. Shifts without a technician sit in this row.",
     "3. An unassigned block renders as a fixed-width chip carrying its hours (it is not scaled to its duration) and simply has no technician."],
     ["§3.2","§4.2","§4.4","§8.1"], "SV-8686 and SV-9234 (unassigned lane on the department header row)")),
}

def run():
    for cid, u in UPDATES.items():
        st0, before = tr.get_case(cid)
        json.dump(before, open(f"/tmp/testrail/snapshots/C{cid}.fabbefore.json","w"))
        payload = {"refs":u["refs"], "custom_preconds":u["preconds"],
                   "custom_steps":u["steps"], "custom_expected":u["expected"]}
        log({'op':'update_case','cid':cid,'intent':datetime.datetime.utcnow().isoformat()+'Z'})
        st, line, b, a = tr.update_case_verified(cid, payload)
        log({'op':'update_case','cid':cid,'http':st,'verify':line,
             'ts':datetime.datetime.utcnow().isoformat()+'Z'})
        print(f"OK C{cid}: {line}")

if __name__=='__main__':
    run(); print("DONE updates")
