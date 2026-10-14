import importlib.util, pathlib, sys
spec = importlib.util.spec_from_file_location("ddf", "/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); ddf = importlib.util.module_from_spec(spec); spec.loader.exec_module(ddf)
PKG = pathlib.Path(sys.argv[1]); srv, BASE = ddf.start_server(PKG)
from playwright.sync_api import sync_playwright
cols = "() => [...document.querySelectorAll('[data-group-id]')].map(e => e.dataset.groupId).join(',')"
js = """([src, dst]) => { const s = document.querySelector('[data-group-id="' + src + '"] [data-gdrag]'); const t = document.querySelector('[data-group-id="' + dst + '"]');
  const dt = new DataTransfer(); const r = t.getBoundingClientRect(); const o = (x, y) => ({bubbles: true, cancelable: true, dataTransfer: dt, clientX: x, clientY: y});
  s.dispatchEvent(new DragEvent('dragstart', o(0, 0)));
  const x = r.left + 10, y = r.top + 10;
  t.dispatchEvent(new DragEvent('dragover', o(x, y))); t.dispatchEvent(new DragEvent('drop', o(x, y))); s.dispatchEvent(new DragEvent('dragend', o(x, y))); return 'ok'; }"""
with sync_playwright() as p:
    for view in ["Board", "By Lead Tech"]:
        b, ctx, pg, logs = ddf.open_board(p, BASE, str(PKG.parent / "cdn"), {"width": 1440, "height": 900})
        pg.goto(BASE + "Work%20Orders%20Details.dc.html", wait_until="load"); ddf.wait_render(pg)
        pg.locator(f'button[title="{view}"]').click(); pg.wait_for_timeout(800)
        print(view, "before:", pg.evaluate(cols))
        pg.evaluate(js, ["kristin", "ralph"]); pg.wait_for_timeout(600)
        print(view, "after Kristin's header dropped at the start of Ralph's group:", pg.evaluate(cols))
        if view == "Board":
            pg.evaluate(js, ["kristin", "unassigned"]); pg.wait_for_timeout(600)
            print(view, "after Kristin's header dropped on Unassigned:", pg.evaluate(cols))
        b.close()
