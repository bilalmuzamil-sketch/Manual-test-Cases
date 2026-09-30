# -*- coding: utf-8 -*-
"""Fix the 7 new v33 WO Board cases: rewrite preconditions (and steps) to the approved
Rule-117 pattern - discrete numbered runnable build-glossary lines, example values beside
the standard QA steps. update_case only (no new cases)."""
import json,urllib.request,base64,sys
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/");AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    return json.load(urllib.request.urlopen(r,timeout=90))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
FIX={
"154884":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with Work Orders view permission.",
  "The current location has at least 3 lead technicians shown as groups/columns. (A technician is eligible when they are Clockable, Active, and their role is not Office or not Time Clock User.) Add technicians if fewer show.",
  "Create several work orders across different lead technicians, leaving some Unassigned, via New Work Order (for example S2-17578, S2-17579, S2-17580).",
  "Assign a few of those work orders to yourself, the signed-in user, so \"Assigned to me\" has matches."],
 "steps":[
  "Open the Work Orders page and switch to List.",
  "Turn on the \"Assigned to me\" filter.",
  "Read which work orders are listed.",
  "Switch to Tech View, then to Board View, and read which work orders show in each."]},
"154885":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with Work Orders view permission.",
  "A few work orders exist at the current location (create them via New Work Order if needed).",
  "You have a desktop browser whose window you can resize; a tablet is helpful but optional."],
 "steps":[
  "Make the browser window narrower than 1024 pixels wide and open the Work Orders page.",
  "Read whether a display switcher (List / Tech View / Board View) is offered, and which layout shows.",
  "Widen the window to 1024 pixels or more and read whether Tech View and Board View become available.",
  "If a tablet is available, open the page on it held sideways (1024 pixels wide or more) and confirm the display options appear."]},
"154886":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with permission to reassign work orders.",
  "At least 2 lead technicians are shown as columns, and several work orders exist with some in the Unassigned column.",
  "Open Board View."],
 "steps":[
  "Drag every work order out of the Unassigned column onto a technician column, so Unassigned has none left.",
  "Read whether the Unassigned column stays on screen and what it shows.",
  "Drag a work order back onto the Unassigned column and confirm it can be dropped there."]},
"154887":{"pre":[
  "You are on the Work Orders page (Tech View or Board View) on the build under test, signed in with permission to reassign work orders.",
  "At least one work order is in Imported status (for example S2-17578).",
  "At least 2 lead technicians are shown as groups/columns."],
 "steps":[
  "On the Imported work order, find the Reassign lead technician action (it is shown disabled).",
  "Hover the disabled action and read the tooltip."]},
"154888":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with permission to reassign work orders and to edit the Schedule.",
  "A work order (for example S2-17578) has a current lead technician (for example Jeremy).",
  "On the Schedule, that technician has three shifts on this work order: one that has already ended, one that has not started yet, and one that is under way right now (for example Jeremy's shift runs 8:00 to 12:00 and it is now 10:00).",
  "At least one other lead technician (for example Dana) is available."],
 "steps":[
  "Reassign the work order's lead technician to the other technician (for example Dana).",
  "When the prompt asks, choose to clear shifts.",
  "Open the Schedule and read what happened to each of the three shifts: the one that had ended, the one not yet started, and the one under way."]},
"154889":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with permission to reassign work orders.",
  "A work order (for example S2-17578) has a current lead technician who has scheduled shifts on the Schedule."],
 "steps":[
  "Open the Reassign lead technician dialog (or the work order's detail page) and remove the lead technician, moving the work order to Unassigned.",
  "Read the prompt that appears."]},
"154890":{"pre":[
  "You are on the Work Orders page on the build under test, signed in with permission to reassign work orders.",
  "A work order (for example S2-17578) has a current lead technician who has scheduled shifts on the Schedule.",
  "A way to make the shift-clearing step fail is available (for example the Schedule service is briefly unavailable). If this cannot be forced by hand, this check is for automation - see the AUTOMATION note."],
 "steps":[
  "Reassign the lead technician and choose to clear shifts, in a run where the shift clearing fails.",
  "Read whether the lead technician was changed, and read the message that appears."]},
}
dry="--apply" not in sys.argv
for cid,fx in FIX.items():
    if dry:
        print(f"[DRY] C{cid}: {len(fx['pre'])} preconds, {len(fx['steps'])} steps")
        for i,p in enumerate(fx['pre'],1): print(f"    pre {i}. {p[:90]}")
        continue
    api(f"update_case/{cid}",{"custom_preconds":ol(fx["pre"]),"custom_steps":ol(fx["steps"])})
    print(f"[OK] C{cid} preconds+steps -> discrete Rule-117 lines")
