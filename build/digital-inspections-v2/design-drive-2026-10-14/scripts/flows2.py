import sys, json, pathlib, importlib.util, urllib.parse
spec = importlib.util.spec_from_file_location("ddf", "/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py")
ddf = importlib.util.module_from_spec(spec); spec.loader.exec_module(ddf)
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(sys.argv[1]); OUT=pathlib.Path(sys.argv[2]); CACHE=sys.argv[3]
srv, base = ddf.start_server(ROOT); res={}
def openb(p, board):
    b, ctx, pg, logs = ddf.open_board(p, None, CACHE, {"width":1440,"height":900})
    pg.goto(base+urllib.parse.quote(board), wait_until="load", timeout=180000); ddf.wait_render(pg); return b, pg
T=lambda pg: pg.evaluate("()=>document.body.innerText")
with sync_playwright() as p:
    # TB-03 rename response: pencil, type, blur
    b, pg = openb(p, "Prototype - Template Builder.dc.html")
    pg.locator('[title="Rename response"]').nth(0).click(); pg.wait_for_timeout(300)
    ro_before = pg.locator('input[readonly]').count()
    pg.keyboard.press("Control+A"); pg.keyboard.type("Pass"); pg.wait_for_timeout(200)
    pg.get_by_text("RESPONSE SETTINGS").click(); pg.wait_for_timeout(300)
    t = T(pg); res["TB-03 rename"] = {"readonly_inputs_after_pencil": ro_before, "canvas_sub_has_Pass": "Checkbox · Pass / Monitor / Not OK / N/A" in t, "line": [l for l in t.split("\n") if "Pass" in l][:5]}
    b.close()
    # TB-04 attach follow-up file on OK response (follow-up on, no file)
    b, pg = openb(p, "Prototype - Template Builder.dc.html")
    n0 = T(pg).count("Remove file")
    pg.get_by_text("Attach File", exact=True).nth(0).click(); pg.wait_for_timeout(300)
    t1 = T(pg); files=[l for l in t1.split("\n") if l.endswith(".pdf")]
    pg.locator('[title="Remove file"]').nth(0).click(); pg.wait_for_timeout(300); t2=T(pg)
    res["TB-04 attach/remove"] = {"pdf_names_after_attach": files, "remove_buttons_before/after_attach/after_remove": [pg.locator('[title=\"Remove file\"]').count()], "pdf_names_after_remove": [l for l in t2.split("\n") if l.endswith(".pdf")]}
    # require-ack toggle only on Monitor/Not OK: count labels
    res["TB-ack-toggles"] = {"Require acknowledgement count (Monitor off for f2? Monitor follow-up off)": T(pg).count("Require acknowledgement")}
    b.close()
    # FD A6 hover tooltip + verdict menu
    b, pg = openb(p, "Inspection Fill V2 - Desktop.dc.html")
    a6 = pg.locator("#a6"); a6.scroll_into_view_if_needed()
    btn = a6.locator("button", has_text="Mark field OK").first; btn.hover(); pg.wait_for_timeout(500)
    tip = [l for l in T(pg).split("\n") if l.startswith("Marks every position")]
    pg.mouse.move(2,2); pg.wait_for_timeout(300)
    mb = a6.locator("button:has(svg)")
    cnt = mb.count(); opened=None
    for i in range(cnt):
        before = T(pg)
        try: mb.nth(i).click(timeout=2000)
        except Exception: continue
        pg.wait_for_timeout(300); after=T(pg)
        new=[l for l in after.split("\n") if l not in before.split("\n")]
        if any(" tire · " in l or " brake · " in l for l in new):
            opened = new; pg.get_by_text("N/A", exact=True).last.click(); pg.wait_for_timeout(300)
            res["FD-02 verdict menu"] = {"menu_lines": opened, "after_pick": [l for l in T(pg).split('\n') if 'position' in l][:6]}
            break
    res["FD-01 tooltip"] = tip
    b.close()
json.dump(res, open(OUT/"flows2.json","w"), indent=1); print(json.dumps(res, indent=1)[:3000])
