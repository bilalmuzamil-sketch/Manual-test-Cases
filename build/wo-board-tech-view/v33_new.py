# -*- coding: utf-8 -*-
import importlib.util,sys,json
spec=importlib.util.spec_from_file_location("v33","build/wo-board-tech-view/v33_update.py")
V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
SEC={"S1":13236,"S3":13238,"S4":13239}
LOG={}
def add(sc,title,pre,steps,results,anchors):
    dry="--apply" not in sys.argv
    exp=("<p><strong>Expected results</strong></p>"+V.ul(results)+V.source_block(sc,anchors)
         +"<p></p>"+V.quotes_block(anchors)+"<p></p>"+V.MARKER)
    if dry: print(f"[DRY] {sc} {title} ({len(title)})"); return
    r=V.api(f"add_case/{SEC[sc]}",{"title":title[:250],
        "custom_preconds":"<ol>"+"".join(f"<li>{V.esc(x)}</li>" for x in pre)+"</ol>",
        "custom_steps":"<ol>"+"".join(f"<li>{V.esc(x)}</li>" for x in steps)+"</ol>",
        "custom_expected":exp,"custom_automation_type":2,"custom_atmstatus":1})
    LOG[str(r["id"])]={"sc":sc,"title":title,"anchors":anchors,"section":SEC[sc]}
    print(f"[OK] C{r['id']} [{sc}] {title}")

SEED_S1='Seed: at a location with >=3 eligible lead technicians (Clockable, Active, role not Office/Time Clock), create several work orders across leads with some Unassigned, via Work Orders > New. Open Work Orders and enable a display option.'

add("S1","Assigned to me shows only my matching work orders in every display",
 [SEED_S1+' Assign some work orders to yourself; be able to toggle "Assigned to me".'],
 ['Enable "Assigned to me".','Switch through List, Tech View and Board View and read which work orders show.'],
 ['With "Assigned to me" enabled, every display option shows only the work orders that match the existing Assigned to me rules.'],
 ["S1-R13"])

add("S1","Display options follow the 1024px screen-width switch (List below it)",
 ['Seed a few work orders. Use a desktop browser you can resize, plus a tablet if available.'],
 ['Narrow the browser below 1024px and read the Work Orders page: is a display switcher offered, and what layout shows?',
  'Widen to 1024px or more and confirm Tech View and Board View are offered.',
  'On a tablet held sideways at >=1024px, confirm the display options appear (switch is by width, not device).'],
 ['Below 1024px the Work Orders page shows List exactly as today (the phone card layout) with no display switcher.',
  'At 1024px and wider, Tech View and Board View are offered on any device (a tablet at >=1024px gets them too); the switch is by screen width only and never detects the device type.'],
 ["S1-R14"])

add("S3","Board keeps the Unassigned column visible as a drop target when empty",
 ['Seed work orders so Unassigned can be emptied (assign them all to technicians). Open Board View.'],
 ['Empty the Unassigned column (assign its work orders away).','Confirm the Unassigned column stays visible with its empty state and can still receive a dragged work order.'],
 ['The Unassigned column stays visible even with no work, showing its empty state, so work orders can be dragged to it (per S3-N1 while Assigned to me is on, S1-N1 when no work orders match, and the same rule as Tech View).'],
 ["S3-R22"])

SEED_S4='Seed: a work order in a status that allows lead reassignment, plus one Imported work order; >=2 eligible lead technicians. Open Tech View or Board View.'

add("S4","Imported work order: reassign lead is disabled with its own tooltip",
 [SEED_S4],
 ['On an Imported work order, open or hover the disabled Reassign lead technician action and read the tooltip.'],
 ['The disabled Reassign lead technician action on an Imported work order shows the tooltip "The lead technician can\'t be changed on an imported work order."'],
 ["S4-N9"])

add("S4","Clearing shifts on a lead change trims by shift timing",
 ['Seed: a work order whose current lead (e.g. Jeremy) has scheduled shifts on the Schedule - one already ended, one not yet started, and one under way now (e.g. Jeremy 8:00-12:00, now 10:00). >=2 eligible leads.'],
 ['Reassign the lead technician and choose to clear shifts.','Open the Schedule and read what happened to each of the three shifts.'],
 ['When the user chooses to clear shifts: an already-ended shift stays as it is; a not-yet-started shift is removed; a shift under way at the moment of the lead change is ended at that moment (the part already under way stays, the rest is removed) - e.g. Jeremy 8:00-12:00 with the lead changing to Dana at 10:00 leaves Jeremy 8:00-10:00.'],
 ["S4-R25"])

add("S4","Removing the lead prompts to clear shifts, same as changing it",
 ['Seed: a work order whose lead has scheduled shifts.'],
 ['Remove the lead technician (move the work order to Unassigned) via the Reassign lead technician dialog or the detail page.','Read the prompt shown.'],
 ['Removing the lead technician (moving the work order to Unassigned) shows the same shift-clearing prompt as changing it (S4-R11).'],
 ["S4-R26"])

add("S4","Lead change and shift clearing succeed or fail together",
 ['Seed: a work order whose lead has scheduled shifts; a way to make the shift-clearing step fail.'],
 ['Change the lead and clear shifts in a run where the shift clearing fails.','Read whether the lead changed and what message shows.'],
 ['The lead change and the shift clearing succeed or fail together: if clearing fails, the lead technician is not changed and the failure message (S4-N8) shows.'],
 ["S4-R27"])

if "--apply" in sys.argv:
    allc=json.load(open("build/wo-board-tech-view/created-ALL.json"))
    allc.update(LOG); json.dump(allc,open("build/wo-board-tech-view/created-ALL.json","w"),indent=1)
    print(f"added {len(LOG)}; total {len(allc)}")
