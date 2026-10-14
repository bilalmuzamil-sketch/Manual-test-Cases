import importlib.util, pathlib, sys
spec = importlib.util.spec_from_file_location("ddf", "/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); ddf = importlib.util.module_from_spec(spec); spec.loader.exec_module(ddf)
PKG = pathlib.Path(sys.argv[1]); srv, BASE = ddf.start_server(PKG)
from playwright.sync_api import sync_playwright
order = "(g) => [...document.querySelectorAll('[data-group-id=\"' + g + '\"] [data-wo]')].map(e => e.dataset.wo).join(',')"
cols = "() => [...document.querySelectorAll('[data-group-id]')].map(e => e.dataset.groupId).join(',')"
with sync_playwright() as p:
    for view in ["Board", "By Lead Tech"]:
        b, ctx, pg, logs = ddf.open_board(p, BASE, str(PKG.parent / "cdn"), {"width": 1440, "height": 900})
        pg.goto(BASE + "Work%20Orders%20Details.dc.html", wait_until="load"); ddf.wait_render(pg)
        pg.locator(f'button[title="{view}"]').click(); pg.wait_for_timeout(800)
        print(view, "esther before:", pg.evaluate(order, "esther"))
        pg.drag_and_drop('[data-wo="S1-341"]', '[data-wo="S1-644"]'); pg.wait_for_timeout(600)
        print(view, "esther after drag S1-341 onto S1-644:", pg.evaluate(order, "esther"))
        print(view, "groups before:", pg.evaluate(cols))
        pg.drag_and_drop('[data-group-id="kristin"] [data-gdrag]', '[data-group-id="ralph"] [data-gdrag]'); pg.wait_for_timeout(600)
        print(view, "groups after dragging Kristin's header onto Ralph's:", pg.evaluate(cols))
        pg.drag_and_drop('[data-group-id="unassigned"] [data-gdrag]', '[data-group-id="jenny"] [data-gdrag]'); pg.wait_for_timeout(600)
        print(view, "groups after dragging Unassigned's header onto Jenny's:", pg.evaluate(cols))
        pg.drag_and_drop('[data-wo="S1-511"]', '[data-wo="S1-680"]'); pg.wait_for_timeout(600)
        print(view, "jenny after dragging Invoiced S1-511 onto S1-680 (same tech reorder):", pg.evaluate(order, "jenny"))
        b.close()
