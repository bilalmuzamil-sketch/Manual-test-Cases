import importlib.util, pathlib, sys
spec = importlib.util.spec_from_file_location("ddf", "/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); ddf = importlib.util.module_from_spec(spec); spec.loader.exec_module(ddf)
PKG = pathlib.Path(sys.argv[1]); srv, BASE = ddf.start_server(PKG)
from playwright.sync_api import sync_playwright
KEYS = ["No work orders match these filters", "Try removing a filter to widen your results.", "Clear all filters", "Try a different search term or remove a filter.", "No results for", "Check the spelling"]
with sync_playwright() as p:
    for view in ["Table", "By Lead Tech", "Board"]:
        b, ctx, pg, logs = ddf.open_board(p, BASE, str(PKG.parent / "cdn"), {"width": 1440, "height": 900})
        pg.goto(BASE + "Work%20Orders.dc.html", wait_until="load"); ddf.wait_render(pg)
        pg.locator(f'button[title="{view}"]').click(); pg.wait_for_timeout(800)
        pg.locator("button").filter(has_text="Status").first.click(); pg.wait_for_timeout(500)
        pg.locator("button[role=checkbox]").filter(has_text="Paid").first.click(); pg.wait_for_timeout(400)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        pg.locator("button").filter(has_text="Assigned to me").first.click(); pg.wait_for_timeout(900)
        t = pg.evaluate("() => document.body.innerText")
        print(view, "| filters only (Status: Paid + Assigned to me):", [k for k in KEYS if k in t])
        pg.screenshot(path=str(PKG.parent / f"flows/shots/probe-filters-only-{view.replace(' ','')}.png"))
        if "Clear all filters" in t:
            pg.get_by_text("Clear all filters").first.click(); pg.wait_for_timeout(800)
            t2 = pg.evaluate("() => document.body.innerText")
            print(view, "| after Clear all filters:", [k for k in KEYS if k in t2], "chips:", pg.evaluate("() => [...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => /^Status|Assigned/.test(t))"))
        b.close()
    b, ctx, pg, logs = ddf.open_board(p, BASE, str(PKG.parent / "cdn"), {"width": 1440, "height": 900})
    pg.goto(BASE + "Work%20Orders.dc.html", wait_until="load"); ddf.wait_render(pg)
    pg.get_by_text("Search", exact=True).first.click(); pg.keyboard.type("zzzz"); pg.wait_for_timeout(900)
    print("Table | search only:", [k for k in KEYS if k in pg.evaluate("() => document.body.innerText")])
    b.close()
