"""Targeted flow drive (Rule 124 (c)) for the DVI V2 14 Oct prototypes. Each flow: fresh load, a list of steps
(click by visible text / title / placeholder, type, select), visible text captured after every step; a step whose
target is missing is recorded as FAILED (never skipped silently)."""
import sys, json, re, time, pathlib, importlib.util
spec = importlib.util.spec_from_file_location("ddf", "/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py")
ddf = importlib.util.module_from_spec(spec); sys.argv_save = sys.argv; spec.loader.exec_module(ddf)
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
CACHE = sys.argv[3]; only = sys.argv[4] if len(sys.argv) > 4 else None
srv, base = ddf.start_server(ROOT)

def vis(pg):
    return pg.evaluate("() => document.body.innerText")

def do(pg, step):
    kind, arg = step[0], step[1]
    nth = step[2] if len(step) > 2 else 0
    if kind == "text":
        loc = pg.get_by_text(arg, exact=True)
    elif kind == "textp":
        loc = pg.get_by_text(arg, exact=False)
    elif kind == "role":
        loc = pg.get_by_role("button", name=arg, exact=True)
    elif kind == "title":
        loc = pg.locator(f'[title="{arg}"]')
    elif kind == "ph":
        loc = pg.locator(f'[placeholder="{arg}"]')
    elif kind == "css":
        loc = pg.locator(arg)
    elif kind == "type":
        loc = pg.locator(arg); loc.nth(nth).fill(step[3]); return f"typed {step[3]!r}"
    elif kind == "select":
        loc = pg.locator("select").nth(nth); loc.select_option(arg); return f"selected {arg}"
    elif kind == "wait":
        pg.wait_for_timeout(arg); return "waited"
    elif kind == "width":
        pg.set_viewport_size({"width": arg, "height": 900}); pg.wait_for_timeout(500); return f"width {arg}"
    n = loc.count()
    if n <= nth:
        raise RuntimeError(f"target not found ({n} matches)")
    el = loc.nth(nth)
    try:
        el.scroll_into_view_if_needed(timeout=3000); el.click(timeout=4000)
    except Exception:
        el.click(force=True, timeout=4000)
    pg.wait_for_timeout(450)
    return f"clicked ({n} matches)"

FLOWS = {}
FI = "Prototype - Fill Inspection.dc.html"; TB = "Prototype - Template Builder.dc.html"; WO = "Prototype - Work Order Handoff.dc.html"; FD = "Inspection Fill V2 - Desktop.dc.html"; HUB = "Prototype - Hub.dc.html"
FLOWS["FI-01 Mark axle OK then Undo"] = (FI, [("text","Mark axle OK"),("text","Undo")])
FLOWS["FI-02 Mark section OK then Undo"] = (FI, [("text","Mark section OK"),("text","Undo")])
FLOWS["FI-03 Not OK opens note + instruction, acknowledge"] = (FI, [("text","Not OK",0),("text","Acknowledge"),("text","Acknowledge")])
FLOWS["FI-04 OK shows Instruction marker, open and Hide"] = (FI, [("text","OK",0),("textp","Instruction"),("text","Hide")])
FLOWS["FI-05 Verdict dropdown on a tire value"] = (FI, [("css","[id^=card-ax] button:has(svg)",2),("text","Monitor",0)])
FLOWS["FI-06 Add axle, remove axle, Single/Dual"] = (FI, [("text","+ Add Axle"),("title","Remove this axle"),("text","Single"),("text","Dual")])
FLOWS["FI-07 Axle tabs and top view"] = (FI, [("width",1440),("text","Axle 2"),("text","Axle 3")])
FLOWS["FI-08 Next section, submit with items, outstanding list, go to first"] = (FI, [("textp","Next: Air system"),("text","Submit & Generate Report"),("text","Go to the first one")])
FLOWS["FI-09 Outstanding button toggles list, close"] = (FI, [("textp","Outstanding"),("textp","Outstanding")])
FLOWS["FI-10 Complete everything and submit"] = (FI, [("text","Mark section OK"),("textp","Next: Air system"),("text","Mark section OK"),("text","Submit & Generate Report")])
FLOWS["FI-11 Monitor needs note and ack, outstanding kinds"] = (FI, [("textp","Next: Air system"),("text","Monitor",0),("ph","Describe the problem and the recommended repair"),("type","textarea",0,"Lost 3 psi"),("text","Acknowledge"),("textp","Outstanding")])
FLOWS["FI-12 Reference file viewer"] = (FI, [("text","Open"),("text","Close")])
FLOWS["FI-13 Instruction file viewer"] = (FI, [("text","Not OK",0),("text","Bendix-chamber-out-of-service-procedure.pdf"),("text","Close")])
FLOWS["FI-14 Collapse and expand section"] = (FI, [("title","Collapse section"),("textp","Show 2 fields"),])
FLOWS["FI-15 Phone: verdict sheet and last-section action"] = (FI, [("text","Phone"),("css","[id^=card-ax] button:has(svg)",2),("text","Not OK",-1),("textp","Next: Air system"),("text","Not OK",0),("text","Review & Sign")])
FLOWS["FI-16 Change answer drops acknowledgement"] = (FI, [("text","Not OK",0),("text","Acknowledge"),("text","Monitor",0),("text","Not OK",0)])
FLOWS["FI-17 Reset"] = (FI, [("text","Mark section OK"),("text","Reset")])
FLOWS["TB-01 Follow-up toggles and acknowledgement"] = (TB, [("text","Add follow-up to a response"),("text","Add follow-up to a response"),("text","Follow-up for this response",3),("text","Require acknowledgement",0)])
FLOWS["TB-02 Include Monitor off/on"] = (TB, [("text","Include Monitor option"),("text","Include Monitor option")])
FLOWS["TB-03 Rename response"] = (TB, [("title","Rename response",0),("type","input[readonly]",0,"Pass")])
FLOWS["TB-04 Attach and remove follow-up file"] = (TB, [("text","Follow-up for this response",3),("text","Attach File",0),("title","Remove file",0)])
FLOWS["TB-05 Validation toggles and summary"] = (TB, [("text","Required to complete"),("text","Photo required"),("text","Photo required if Not OK"),("text","Note required if Monitor / Not OK")])
FLOWS["TB-06 Add field picker, Per axle, Checkbox"] = (TB, [("text","+ Add Field",0),("text","Per axle",0),("text","+ Add Field",0),("text","Checkbox",0)])
FLOWS["TB-07 Per axle editor rows, units, scope, axles"] = (TB, [("text","Brake & tire measurements"),("text","+ Add Measurement Row"),("select","mm",0),("select","side",1),("title","Delete row",0)])
FLOWS["TB-08 Duplicate and delete field"] = (TB, [("text","Duplicate Field"),("text","Delete Field")])
FLOWS["TB-09 Preview, click a card returns to Edit"] = (TB, [("text","Preview"),("text","Low-air warning buzzer"),("text","Preview")])
FLOWS["TB-10 Publish toast"] = (TB, [("text","Include Monitor option"),("text","Publish")])
FLOWS["TB-11 Add section"] = (TB, [("text","+ Add Section")])
FLOWS["TB-12 General reference file remove/attach"] = (TB, [("title","Remove file",-1),("text","Attach File",-1)])
FLOWS["TB-13 Disabled field types"] = (TB, [("text","+ Add Field",0),("text","Text",0),("text","Photo",0)])
FLOWS["TB-14 Phone: properties sheet and Done"] = (TB, [("text","Phone"),("text","Low-air warning buzzer"),("text","Done")])
FLOWS["TB-15 Change field type"] = (TB, [("text","Per axle",-1)])
FLOWS["WO-01 Build lines on this work order, review, uncheck, add"] = (WO, [("textp","Build lines"),("text","This work order"),("wait",2500),("css","label",1),("textp","Add 2 Line")])
FLOWS["WO-02 Build lines on a new work order"] = (WO, [("textp","Build lines"),("text","A new work order"),("wait",2500),("textp","Add 3 Line")])
FLOWS["WO-03 Discard drafts"] = (WO, [("textp","Build lines"),("text","This work order"),("wait",2500),("text","Discard")])
FLOWS["WO-04 Uncheck all lines disables Add"] = (WO, [("textp","Build lines"),("text","This work order"),("wait",2500),("css","label",0),("css","label",1),("css","label",2),("textp","Add 0 Line")])
FLOWS["WO-05 ShopCoach off"] = (WO, [("css","div[style*='cursor'] >> nth=0",0)])
FLOWS["WO-06 Work order Notes tab, open inspection, PDF"] = (WO, [("text","Go to work order"),("textp","Notes ("),("text","View PDF",0),("text","Close"),("text","Open Inspection")])
FLOWS["WO-07 Build from Notes"] = (WO, [("text","Go to work order"),("textp","Notes ("),("textp","Build lines"),("wait",2500),("textp","Add 3 Line")])
FLOWS["WO-08 Asset inspections tab, View, Build lines"] = (WO, [("text","Customers"),("text","View",1),("text","Customers"),("textp","Build lines"),("wait",2500)])
FLOWS["WO-09 Other tabs"] = (WO, [("text","Go to work order"),("textp","Parts ("),("text","Timesheets"),("text","Finance")])
FLOWS["WO-10 Phone: target sheet"] = (WO, [("text","Phone"),("textp","Build lines"),("text","This work order"),("wait",2500)])
FLOWS["WO-11 After lines added, Build lines gone"] = (WO, [("textp","Build lines"),("text","This work order"),("wait",2500),("textp","Add 3 Line"),("textp","Notes ("),("text","Customers")])
FLOWS["FD-01 A6 live: Mark field OK tooltip, press, Undo"] = (FD, [("css","#a6 button:has-text('Mark field OK')"),("text","Undo")])
FLOWS["FD-02 A6 live: Single/Dual, verdict menu"] = (FD, [("css","#a6 button:has-text('Single')"),("css","#a6 button:has-text('Dual')"),("css","#a6 .grp button",1),("text","Not OK",-1)])
FLOWS["HUB-01 Hub links"] = (HUB, [("textp","Template builder")])

def run_flow(p, name, board, steps):
    b, ctx, pg, logs = ddf.open_board(p, base + __import__('urllib.parse').parse.quote(board), CACHE, {"width":1440,"height":900})
    rec = {"flow": name, "board": board, "steps": []}
    try:
        pg.goto(base + __import__('urllib.parse').parse.quote(board), wait_until="load", timeout=180000); ddf.wait_render(pg)
        if name.startswith("WO-05"):
            # ShopCoach toggle: the small switch beside the 'ShopCoach' label in the prototype header
            sw = pg.get_by_text("ShopCoach", exact=True).locator("xpath=following-sibling::div[1]")
            steps = []
            before = vis(pg); sw.click(); pg.wait_for_timeout(500)
            rec["steps"].append({"step": "toggle ShopCoach off", "result": "clicked", "text": vis(pg)})
            pg.get_by_text("Go to work order", exact=True).click(); pg.wait_for_timeout(400)
            pg.get_by_text("Notes (2)", exact=False).click(); pg.wait_for_timeout(400)
            rec["steps"].append({"step": "WO > Notes with ShopCoach off", "result": "clicked", "text": vis(pg)})
            pg.get_by_text("Customers", exact=True).click(); pg.wait_for_timeout(400)
            rec["steps"].append({"step": "Asset > Inspections with ShopCoach off", "result": "clicked", "text": vis(pg)})
        rec["start_text"] = vis(pg)
        for st in steps:
            try:
                r = do(pg, st); t = vis(pg)
                rec["steps"].append({"step": repr(st), "result": r, "text": t})
            except Exception as e:
                rec["steps"].append({"step": repr(st), "result": "FAILED " + str(e)[:200], "text": vis(pg)})
        pg.screenshot(path=str(OUT / (re.sub(r'[^A-Za-z0-9]+','_',name)[:60] + ".png")), full_page=False)
    finally:
        rec["console"] = logs[:20]; b.close()
    return rec

res = []
with sync_playwright() as p:
    for name, (board, steps) in FLOWS.items():
        if only and not name.startswith(only): continue
        t0 = time.time(); r = run_flow(p, name, board, steps); r["secs"] = round(time.time()-t0,1); res.append(r)
        fails = [s for s in r["steps"] if s["result"].startswith("FAILED")]
        print(f"{name}: {len(r['steps'])} steps, {len(fails)} failed, {r['secs']}s", flush=True)
json.dump(res, open(OUT / ("flows" + (("-" + only) if only else "") + ".json"), "w"), indent=1)
