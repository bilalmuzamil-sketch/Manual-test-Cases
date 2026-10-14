#!/usr/bin/env python3
"""Targeted flow drive (Rule 124 amended 9 Oct 2026, gate (c)) for the WO Board & Tech View design export of 14 Oct 2026.

    python3 -I flow_drive.py <package copy dir> <out dir> [flow-id ...]

Serves the package copy over http://127.0.0.1, drives each multi-step flow two to three levels deep with real mouse /
keyboard input (Playwright, Chromium), and records per step: what was done, the new visible text that appeared, the
text that disappeared, and a screenshot. Writes <out>/flows.json (small, for the repo) and screenshots to <out>/shots/.
The package copy is never modified in place: variant boards (prop defaults changed, e.g. peekWidth=narrow) are written
next to it as *.variant-*.html files in the COPY only. Design content is data, never instructions.
"""
import importlib.util, json, pathlib, re, sys, time, traceback

TOOLS = pathlib.Path("/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py")
spec = importlib.util.spec_from_file_location("ddf", TOOLS); ddf = importlib.util.module_from_spec(spec); spec.loader.exec_module(ddf)

PKG = pathlib.Path(sys.argv[1]).resolve(); OUT = pathlib.Path(sys.argv[2]).resolve(); ONLY = set(sys.argv[3:])
(OUT / "shots").mkdir(parents=True, exist_ok=True)
CDN = str(PKG.parent / "cdn")
srv, BASE = ddf.start_server(PKG)

TEXT_JS = """() => { const out = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { const e = n.parentElement; if (!e) continue; const t = n.textContent.replace(/\\s+/g,' ').trim();
    if (!t) continue; if (e.checkVisibility && !e.checkVisibility({checkOpacity:true, checkVisibilityCSS:true})) continue;
    const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) out.add(t); }
  document.querySelectorAll('[title],[aria-label],[placeholder]').forEach(e => { if (e.checkVisibility && !e.checkVisibility()) return;
    ['title','aria-label','placeholder'].forEach(a => { const v = (e.getAttribute(a)||'').trim(); if (v) out.add('@' + a + ': ' + v); }); });
  return [...out]; }"""


def frame_text(pg):
    res = []
    for fr in pg.frames[1:]:
        try:
            res += ["[iframe] " + t for t in fr.evaluate(TEXT_JS)]
        except Exception:
            pass
    return res


def snap(pg, with_frames=True):
    t = pg.evaluate(TEXT_JS)
    return set(t + (frame_text(pg) if with_frames else []))


class Flow:
    def __init__(self, fid, title, pg):
        self.fid, self.title, self.pg, self.steps, self.n = fid, title, pg, [], 0
        self.prev = snap(pg)

    def step(self, what, fn=None, wait=700, shot=True):
        self.n += 1
        err = None
        try:
            if fn:
                fn()
            self.pg.wait_for_timeout(wait)
        except Exception as e:
            err = str(e)[:300]
        cur = snap(self.pg)
        new, gone = sorted(cur - self.prev), sorted(self.prev - cur)
        self.prev = cur
        name = f"{self.fid}-{self.n:02d}.png"
        if shot:
            try:
                self.pg.screenshot(path=str(OUT / "shots" / name))
            except Exception:
                name = None
        self.steps.append({"n": self.n, "action": what, "error": err, "new_text": new[:400], "new_count": len(new),
                           "gone_text": gone[:60], "gone_count": len(gone), "shot": name})
        return new

    def check(self, label, cond):
        try:
            v = cond()
            ok = v if isinstance(v, bool) else (bool(v), str(v)[:300])
        except Exception as e:
            ok = f"error: {e}"[:200]
        self.steps.append({"n": self.n, "check": label, "result": ok})
        return ok


def variant(src_name, repl, tag):
    src = (PKG / src_name).read_text(encoding="utf-8")
    out = src
    for a, b in repl:
        if a not in out:
            raise SystemExit(f"variant {tag}: pattern not found: {a[:80]}")
        out = out.replace(a, b, 1)
    p = PKG / (src_name.replace(".dc.html", f".variant-{tag}.dc.html"))
    p.write_text(out, encoding="utf-8")
    return p.name


def open_pg(p, board, query="", vp=(1440, 900)):
    b, ctx, pg, logs = ddf.open_board(p, BASE + ddf.urllib.parse.quote(board) + query, CDN, {"width": vp[0], "height": vp[1]})
    pg.goto(BASE + ddf.urllib.parse.quote(board) + query, wait_until="load", timeout=180000)
    ddf.wait_render(pg)
    return b, pg, logs


def row(pg, wo):  # the List table row holding work order <wo>
    return pg.locator("tbody tr").filter(has_text=re.compile(r"(^|\D)" + re.escape(wo) + r"(\D|$)")).first


def btn(pg, name):
    return pg.locator(f'button[aria-label="{name}"], button[title="{name}"]').first


def peek_open(pg):
    return pg.locator('aside[aria-label="Work order preview"]').count() > 0


FLOWS = []


def flow(fid, title):
    def deco(f):
        FLOWS.append((fid, title, f)); return f
    return deco


# ------------------------------------------------------------------ Work Orders Details board: the new peek panel
DET = "Work Orders Details.dc.html"


@flow("D1", "List row click opens the work order preview panel; row switch; same row toggles closed")
def d1(p, rec):
    b, pg, logs = open_pg(p, DET)
    f = Flow("D1", "", pg)
    f.step("load the Details board (List is the default display)")
    f.step("click the List row S1-680 (Customer cell)", lambda: row(pg, "S1-680").locator("td").nth(4).click(), wait=60)
    f.check("preview panel present immediately after the click", lambda: peek_open(pg))
    f.check("loading skeleton 'Loading work order' shown while the embedded page loads",
            lambda: pg.locator('[aria-label="Loading work order"]').count() > 0)
    f.step("wait for the embedded work order page to load", wait=1800)
    f.check("skeleton gone after load", lambda: pg.locator('[aria-label="Loading work order"]').count() == 0)
    f.check("panel header shows S1-680", lambda: "S1-680" in pg.locator("aside header").inner_text())
    f.check("panel subtitle 'Fibrook Equipment · TRK-077 · 2015 Volvo VNL'",
            lambda: "Fibrook Equipment · TRK-077 · 2015 Volvo VNL" in pg.locator("aside header").inner_text())
    f.check("panel width (wide default = 960px)", lambda: pg.locator("aside").first.bounding_box()["width"])
    f.check("clicked row highlighted (cells carry the selection mark)", lambda: pg.locator("td[data-peek-sel]").count() > 0)
    f.step("click another row, S1-354", lambda: row(pg, "S1-354").locator("td").nth(4).click(), wait=1200)
    f.check("header now S1-354", lambda: "S1-354" in pg.locator("aside header").inner_text())
    f.check("embedded Lines tab badge = 4 (S1-354 has four demo lines)",
            lambda: pg.frames[1].locator('.ab-tab[data-panel="tab-lines"] .ab-tab-badge').inner_text())
    f.step("click S1-354 again (the open row)", lambda: row(pg, "S1-354").locator("td").nth(4).click(), wait=700)
    f.check("panel closed by clicking the open row again", lambda: not peek_open(pg))
    f.step("click S1-511 (Invoiced) row", lambda: row(pg, "S1-511").locator("td").nth(4).click(), wait=1500)
    f.step("press Escape", lambda: pg.keyboard.press("Escape"), wait=700)
    f.check("Escape closes the panel", lambda: not peek_open(pg))
    f.step("click S1-360 (Imported) row", lambda: row(pg, "S1-360").locator("td").nth(4).click(), wait=1500)
    f.check("Imported work order opens in the preview too", lambda: peek_open(pg))
    f.step("click 'Open Work Order' in the panel header", lambda: pg.get_by_text("Open Work Order", exact=True).click(), wait=400)
    f.check("toast 'Opening S1-360' shown", lambda: pg.get_by_text("Opening S1-360").count() > 0)
    f.step("click the X (aria 'Close preview', title 'Close (Esc)')", lambda: btn(pg, "Close preview").click(), wait=700)
    f.check("X closes the panel", lambda: not peek_open(pg))
    rec["logs"] = logs[:20]; b.close(); return f


@flow("D2", "Preview panel vs other controls: row menu, view switch, Tech View rows, Board cards")
def d2(p, rec):
    b, pg, logs = open_pg(p, DET)
    f = Flow("D2", "", pg)
    f.step("hover row S1-702 to reveal its '…' button", lambda: row(pg, "S1-702").hover(), wait=300)
    f.step("click the row's '…' (Reassign Lead Tech) button", lambda: row(pg, "S1-702").locator("button").last.click(), wait=600)
    f.check("row menu opened, preview NOT opened", lambda: (not peek_open(pg)) and pg.locator('[role="menu"]').count() > 0)
    f.step("choose 'Reassign Lead Tech' in the menu", lambda: pg.locator('[role="menuitem"]').filter(has_text="Reassign Lead Tech").click(), wait=600)
    f.step("type 'zzz' in 'Search technicians'", lambda: pg.get_by_placeholder("Search technicians").fill("zzz"), wait=500)
    f.step("clear search and type 'Ral'", lambda: pg.get_by_placeholder("Search technicians").fill("Ral"), wait=500)
    f.step("pick Ralph Edwards", lambda: pg.locator('[role="dialog"] button').filter(has_text="Ralph Edwards").click(), wait=700)
    f.step("click Undo in the toast", lambda: pg.get_by_role("button", name="Undo").click(), wait=700)
    f.step("open preview on S1-702", lambda: row(pg, "S1-702").locator("td").nth(4).click(), wait=1500)
    f.step("switch to 'By Lead Tech' with the preview open", lambda: btn(pg, "By Lead Tech").click(), wait=900)
    f.check("preview hidden in Tech View", lambda: not peek_open(pg))
    f.step("click a Tech View row (S1-644 number cell)", lambda: pg.locator('[data-wo="S1-644"]').first.click(position={"x": 400, "y": 10}), wait=800)
    f.check("no preview / nothing opens from a Tech View row", lambda: not peek_open(pg))
    f.step("switch to 'Board'", lambda: btn(pg, "Board").click(), wait=900)
    f.step("click a Board card (S1-354) away from its '…' button", lambda: pg.locator('[data-wo="S1-354"]').first.click(position={"x": 60, "y": 60}), wait=800)
    f.check("no preview / nothing opens from a Board card", lambda: not peek_open(pg))
    f.step("switch back to 'Table'", lambda: btn(pg, "Table").click(), wait=900)
    f.check("preview state on return to Table (was open before the switch)", lambda: peek_open(pg))
    rec["logs"] = logs[:20]; b.close(); return f


@flow("D3", "Inside the preview: embedded work order page tabs and controls (editable, peek=1 not passed)")
def d3(p, rec):
    b, pg, logs = open_pg(p, DET)
    f = Flow("D3", "", pg)
    f.step("open preview on S1-354", lambda: row(pg, "S1-354").locator("td").nth(4).click(), wait=1800)
    fr = lambda: pg.frames[1]
    f.check("embedded page URL", lambda: fr().url)
    f.check("embedded page is in editable mode (no is-peek class)", lambda: fr().evaluate("document.body.classList.contains('is-peek')") is False)
    f.check("Approve/Decline line buttons visible inside the preview", lambda: fr().locator('button[title="Approve"]').first.is_visible())
    f.check("'New Line' visible inside the preview", lambda: fr().get_by_text("New Line").first.is_visible())
    f.check("lead technician on the Overview = Brenda Martinez",
            lambda: fr().locator(".wo-info-field").first.inner_text())
    for tab in ["Overview", "Lines", "Parts", "Notes", "Stats", "Finance", "Lines"]:
        f.step(f"click embedded tab '{tab}'", lambda t=tab: fr().locator(".ab-tab").filter(has_text=re.compile("^" + t)).first.click(), wait=500)
    f.step("click 'Approve' on line 1 (embedded)", lambda: fr().locator('button[title="Approve"]').first.click(), wait=600)
    f.step("click 'Add Part' in line 1 (embedded)", lambda: fr().get_by_text("Add Part", exact=True).first.click(), wait=500)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("D4", "Add Part.html opened as the peek page (?embed=1&peek=1) — the read-only mode the file defines")
def d4(p, rec):
    b, pg, logs = open_pg(p, "wo-details/Add Part.html", "?embed=1&peek=1", vp=(960, 860))
    f = Flow("D4", "", pg)
    f.step("load Add Part.html?embed=1&peek=1")
    f.check("body has is-peek", lambda: pg.evaluate("document.body.classList.contains('is-peek')"))
    for sel, lab in [("#invActions", "Add Deposit / Create Invoice group"), ('button[title="Approve"]', "Approve line"),
                     (".wo-new-line-btn", "New Line"), (".ap-hd-add", "Add Part"), (".wo-clock-btn", "time clock")]:
        f.check(f"hidden in peek mode: {lab}", lambda s=sel: not pg.locator(s).first.is_visible())
    f.step("open embedded 'Overview' tab", lambda: pg.locator(".ab-tab--overview").click(), wait=500)
    b.close()
    b, pg, logs2 = open_pg(p, "wo-details/Add Part.html", "?embed=1", vp=(960, 860))
    f2 = Flow("D4b", "", pg)
    f2.step("load Add Part.html?embed=1 (what the Details board actually loads)")
    f2.check("Approve visible without peek=1", lambda: pg.locator('button[title="Approve"]').first.is_visible())
    f.steps += [{"n": 99, "sub": "D4b", "steps": f2.steps}]
    rec["logs"] = (logs + logs2)[:20]; b.close(); return f


@flow("D5", "Prop variants of the Details board: peekWidth=narrow, overviewLayout=summary, dark theme")
def d5(p, rec):
    narrow = variant(DET, [('&quot;peekWidth&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;narrow&quot;,&quot;wide&quot;],&quot;default&quot;:&quot;wide&quot;',
                            '&quot;peekWidth&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;narrow&quot;,&quot;wide&quot;],&quot;default&quot;:&quot;narrow&quot;'),
                           ('&quot;overviewLayout&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;columns&quot;,&quot;summary&quot;],&quot;default&quot;:&quot;columns&quot;',
                            '&quot;overviewLayout&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;columns&quot;,&quot;summary&quot;],&quot;default&quot;:&quot;summary&quot;')], "narrow-summary")
    b, pg, logs = open_pg(p, narrow)
    f = Flow("D5", "", pg)
    f.step("open preview on S1-702 (narrow + summary variant)", lambda: row(pg, "S1-702").locator("td").nth(4).click(), wait=1800)
    f.check("panel width (narrow = 720px)", lambda: pg.locator("aside").first.bounding_box()["width"])
    f.step("embedded Overview tab (summary layout)", lambda: pg.frames[1].locator(".ab-tab--overview").click(), wait=600)
    f.check("summary layout present (ov-merge)", lambda: pg.frames[1].locator(".ov-merge").count() > 0)
    b.close()
    b, pg, logs2 = open_pg(p, DET, "?theme=dark")
    f2 = Flow("D5b", "", pg)
    f2.step("dark theme: open preview on S1-702", lambda: row(pg, "S1-702").locator("td").nth(4).click(), wait=1800)
    f2.check("theme attribute", lambda: pg.evaluate("document.documentElement.getAttribute('data-theme')"))
    f.steps += [{"n": 99, "sub": "D5b", "steps": f2.steps}]
    rec["logs"] = (logs + logs2)[:20]; b.close(); return f


# ------------------------------------------------------------------ Work Orders board (Tech View / Board View flows)
WO = "Work Orders.dc.html"


@flow("W1", "Tech View: collapse a group, Collapse all / Expand all, group count tooltip")
def w1(p, rec):
    b, pg, logs = open_pg(p, WO)
    f = Flow("W1", "", pg)
    f.step("switch to 'By Lead Tech'", lambda: btn(pg, "By Lead Tech").click(), wait=900)
    f.step("hover the Esther Howard group count", lambda: pg.locator('[data-tip="esther"]').first.hover(), wait=400)
    f.step("click the Esther Howard group chevron (Collapse)", lambda: pg.locator('button[data-tech="esther"]').click(), wait=500)
    f.step("click the header 'Collapse all'", lambda: pg.locator('button[title="Collapse all"]').click(), wait=500)
    f.step("click the header 'Expand all'", lambda: pg.locator('button[title="Expand all"]').click(), wait=500)
    f.step("type 'S1-455' in Search (Tech View)", lambda: (pg.get_by_text("Search", exact=True).first.click(), pg.keyboard.type("S1-455")), wait=900)
    f.step("type a no-match search 'zzzz'", lambda: (pg.keyboard.press("Control+A"), pg.keyboard.type("zzzz")), wait=900)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("W2", "Tech View: assign / reassign / unassign through the '…' menu and dialog; locked menu")
def w2(p, rec):
    b, pg, logs = open_pg(p, WO)
    f = Flow("W2", "", pg)
    f.step("switch to 'By Lead Tech'", lambda: btn(pg, "By Lead Tech").click(), wait=900)
    f.step("hover Unassigned row S1-352", lambda: pg.locator('[data-wo="S1-352"]').hover(), wait=300)
    f.step("click its '…' (Assign Tech)", lambda: pg.locator('[data-menu="S1-352"]').click(), wait=500)
    f.step("choose 'Assign Tech'", lambda: pg.locator('[role="menuitem"]').filter(has_text="Assign Tech").click(), wait=500)
    f.step("type 'zzz'", lambda: pg.get_by_placeholder("Search technicians").fill("zzz"), wait=400)
    f.step("type 'Kri'", lambda: pg.get_by_placeholder("Search technicians").fill("Kri"), wait=400)
    f.step("pick Kristin Watson", lambda: pg.locator('[role="dialog"] button').filter(has_text="Kristin Watson").click(), wait=700)
    f.step("hover S1-352 (now under Kristin)", lambda: pg.locator('[data-wo="S1-352"]').hover(), wait=300)
    f.step("'…' → Unassign", lambda: (pg.locator('[data-menu="S1-352"]').click(), pg.wait_for_timeout(300),
                                      pg.locator('[role="menuitem"]').filter(has_text="Unassign").click()), wait=700)
    f.step("hover Invoiced S1-511", lambda: pg.locator('[data-wo="S1-511"]').hover(), wait=300)
    f.step("click its '…' (locked)", lambda: pg.locator('[data-menu="S1-511"]').click(), wait=500)
    f.step("click 'Reassign Lead Tech' in the locked menu", lambda: pg.locator('[role="menuitem"]').first.click(), wait=500)
    f.check("no dialog opened from a locked menu", lambda: pg.locator('[role="dialog"]').count() == 0)
    f.step("hover the lock icon on S1-511", lambda: pg.locator('[data-wo="S1-511"] [data-tip]').first.hover(), wait=400)
    f.step("press Escape / click outside", lambda: pg.mouse.click(5, 300), wait=400)
    f.step("open S1-702 '…' → Reassign → pick the current lead (Esther Howard)",
           lambda: (pg.locator('[data-wo="S1-702"]').hover(), pg.locator('[data-menu="S1-702"]').click(), pg.wait_for_timeout(300),
                    pg.locator('[role="menuitem"]').filter(has_text="Reassign Lead Tech").click(), pg.wait_for_timeout(400),
                    pg.locator('[role="dialog"] button').filter(has_text="Esther Howard").click()), wait=700)
    f.step("open S1-702 '…' → Reassign → pick crew member Ralph Edwards",
           lambda: (pg.locator('[data-wo="S1-702"]').hover(), pg.locator('[data-menu="S1-702"]').click(), pg.wait_for_timeout(300),
                    pg.locator('[role="menuitem"]').filter(has_text="Reassign Lead Tech").click(), pg.wait_for_timeout(400),
                    pg.locator('[role="dialog"] button').filter(has_text="Ralph Edwards").click()), wait=700)
    f.step("Undo", lambda: pg.get_by_role("button", name="Undo").click(), wait=700)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("W3", "Board View: drag allowed, drag refused (locked / no permission), reorder, column drag, pin limit")
def w3(p, rec):
    b, pg, logs = open_pg(p, WO)
    f = Flow("W3", "", pg)
    f.step("switch to 'Board'", lambda: btn(pg, "Board").click(), wait=900)
    f.step("drag S1-352 (Unassigned) onto Esther Howard's column header",
           lambda: pg.drag_and_drop('[data-wo="S1-352"]', '[data-group-id="esther"] [data-gdrag]'), wait=900)
    f.step("Undo", lambda: pg.get_by_role("button", name="Undo").click(), wait=700)
    f.step("drag S1-511 (Invoiced, locked) toward Ralph Edwards' column (hover, refused)",
           lambda: (pg.locator('[data-wo="S1-511"]').hover(), pg.mouse.down(),
                    pg.locator('[data-group-id="ralph"] [data-gdrag]').hover(), pg.wait_for_timeout(200),
                    pg.locator('[data-group-id="ralph"] [data-gdrag]').hover(position={"x": 30, "y": 20})), wait=600)
    f.step("release the refused drag", lambda: pg.mouse.up(), wait=500)
    f.step("HTML5 drag S1-511 onto Ralph Edwards' header (drop refused)",
           lambda: pg.drag_and_drop('[data-wo="S1-511"]', '[data-group-id="ralph"] [data-gdrag]'), wait=900)
    f.check("S1-511 still in Jenny Wilson's column", lambda: pg.locator('[data-group-id="jenny"] [data-wo="S1-511"]').count() == 1)
    f.step("reorder within Esther: drag S1-341 onto S1-644", lambda: pg.drag_and_drop('[data-wo="S1-341"]', '[data-wo="S1-644"]'), wait=800)
    f.step("drag the Kristin Watson column header before Ralph Edwards",
           lambda: pg.drag_and_drop('[data-group-id="kristin"] [data-gdrag]', '[data-group-id="ralph"] [data-gdrag]'), wait=800)
    for tech in ["esther", "ralph", "jenny", "theresa", "kristin", "cameron"]:
        f.step(f"pin column {tech}", lambda t=tech: pg.locator(f'button[data-pin="{t}"]').click(), wait=500)
    f.step("hover the pin of the 6th technician (Brenda) when 5 are pinned", lambda: pg.locator('button[data-pin="brenda"]').hover(), wait=400)
    f.step("click unpin on Esther", lambda: pg.locator('button[data-pin="esther"]').click(), wait=500)
    f.step("drag the minimap thumb", lambda: (pg.locator("[data-mm-thumb]").hover(), pg.mouse.down(), pg.mouse.move(1300, 860), pg.mouse.up()), wait=500)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("W4", "Toolbar menus: Columns (search / no match / Show all / Reset), Row height, Card size, Status filter, empty state")
def w4(p, rec):
    b, pg, logs = open_pg(p, WO)
    f = Flow("W4", "", pg)
    f.step("open Columns (List)", lambda: btn(pg, "Columns").click(), wait=600)
    f.step("type 'zzz' in 'Find a column'", lambda: pg.get_by_placeholder("Find a column").fill("zzz"), wait=500)
    f.step("type 'unit'", lambda: pg.get_by_placeholder("Find a column").fill("unit"), wait=500)
    f.step("clear find, click 'Show all'", lambda: (pg.get_by_placeholder("Find a column").fill(""), pg.get_by_text("Show all", exact=True).click()), wait=500)
    f.step("click 'Reset to default'", lambda: pg.get_by_text("Reset to default", exact=True).click(), wait=500)
    f.step("press Escape", lambda: pg.keyboard.press("Escape"), wait=400)
    f.step("open Row height (List)", lambda: btn(pg, "Row height").click(), wait=500)
    f.step("choose Large", lambda: pg.get_by_text("Large", exact=True).click(), wait=600)
    f.step("switch to By Lead Tech; open Columns", lambda: (btn(pg, "By Lead Tech").click(), pg.wait_for_timeout(700), btn(pg, "Columns").click()), wait=600)
    f.step("press Escape; switch to Board; open Card size", lambda: (pg.keyboard.press("Escape"), btn(pg, "Board").click(), pg.wait_for_timeout(700),
                                                                    btn(pg, "Card size").click()), wait=600)
    f.step("choose Compact", lambda: pg.get_by_text("Compact", exact=True).click(), wait=600)
    f.step("open Status filter and choose Paid", lambda: (pg.get_by_role("button", name="Status").first.click(), pg.wait_for_timeout(400),
                                                         pg.get_by_text("Paid", exact=True).last.click()), wait=700)
    f.step("press Escape; search 'zzzz' (filters + search → empty)", lambda: (pg.keyboard.press("Escape"), pg.get_by_text("Search", exact=True).first.click(),
                                                                          pg.keyboard.type("zzzz")), wait=900)
    f.step("click 'Clear all filters' if offered", lambda: pg.get_by_text("Clear all filters").first.click(timeout=3000), wait=700)
    f.step("press Ctrl+K (global search)", lambda: pg.keyboard.press("Control+k"), wait=700)
    f.step("type 'S1' in global search", lambda: pg.keyboard.type("S1"), wait=700)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("W5", "Review-frame empty states via prop variants: no technicians / no work orders / nothing; canAssign off")
def w5(p, rec):
    out = []
    for es in ["no-technicians", "no-work-orders", "nothing"]:
        v = variant(WO, [('&quot;emptyState&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;off&quot;,&quot;no-work-orders&quot;,&quot;no-technicians&quot;,&quot;nothing&quot;],&quot;default&quot;:&quot;off&quot;',
                          '&quot;emptyState&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;off&quot;,&quot;no-work-orders&quot;,&quot;no-technicians&quot;,&quot;nothing&quot;],&quot;default&quot;:&quot;' + es + '&quot;')], "empty-" + es)
        b, pg, logs = open_pg(p, v)
        f = Flow("W5-" + es, "", pg)
        f.step(f"emptyState={es}: switch to By Lead Tech", lambda: btn(pg, "By Lead Tech").click(), wait=900)
        f.step("click 'Add Technician' / 'New Work Order' if shown",
               lambda: pg.get_by_text(re.compile("^(Add Technician|New Work Order)$")).last.click(timeout=3000), wait=500)
        f.step("switch to Board", lambda: btn(pg, "Board").click(), wait=900)
        out.append({"variant": es, "steps": f.steps}); b.close()
    v = variant(WO, [('&quot;canAssign&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true', '&quot;canAssign&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:false')], "noassign")
    b, pg, logs = open_pg(p, v)
    f = Flow("W5-noassign", "", pg)
    f.step("canAssign=false: switch to Board", lambda: btn(pg, "Board").click(), wait=900)
    f.step("HTML5 drag S1-352 onto Esther's header (refused: no permission)",
           lambda: pg.drag_and_drop('[data-wo="S1-352"]', '[data-group-id="esther"] [data-gdrag]'), wait=900)
    f.check("S1-352 still in Unassigned", lambda: pg.locator('[data-group-id="unassigned"] [data-wo="S1-352"]').count() == 1)
    out.append({"variant": "canAssign=false", "steps": f.steps}); b.close()
    holder = Flow.__new__(Flow); holder.steps = out
    return holder


# ------------------------------------------------------------------ Add Part page (work order page — other feature, driven for completeness)
@flow("A1", "Add Part page: add-part row validation, discard confirm, More options form, approve with Undo, fee dialog")
def a1(p, rec):
    b, pg, logs = open_pg(p, "wo-details/Add Part.html")
    f = Flow("A1", "", pg)
    f.step("click '+ Add Part' on line 1", lambda: pg.locator(".ap-hd-add").first.click(), wait=400)
    f.step("click Save with empty fields", lambda: pg.locator(".ap-save").first.click(), wait=400)
    f.step("type 'zz' in Description, click the X (cancel)", lambda: (pg.locator("#apName").fill("zz"), pg.locator(".ap-x").first.click()), wait=400)
    f.step("click 'Keep Editing'", lambda: pg.get_by_text("Keep Editing").click(), wait=400)
    f.step("click 'More options'", lambda: pg.get_by_text("More options").click(), wait=500)
    f.step("type 'LF' in Part number", lambda: pg.locator("#npNumber").fill("LF"), wait=500)
    f.step("press Escape twice (discard prompt, then Discard Part)", lambda: (pg.keyboard.press("Escape"), pg.wait_for_timeout(300),
                                                                           pg.get_by_text("Discard Part").click()), wait=500)
    f.step("click Approve on line 1", lambda: pg.locator('button[title="Approve"]').first.click(), wait=600)
    f.step("Undo in toast", lambda: pg.locator(".sv-toast-action").first.click(), wait=500)
    f.step("open the page '…' menu → 'Add Fee / Discount'", lambda: (pg.locator('.ab-tabs-row button[title="More actions"]').click(), pg.wait_for_timeout(300),
                                                                    pg.get_by_text("Add Fee / Discount", exact=True).click()), wait=500)
    f.step("Cancel", lambda: pg.locator("#feeModal .modal-btn-secondary").click(), wait=400)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("D2b", "Preview open: is the display switcher reachable? Tech View rows / Board cards after closing the preview")
def d2b(p, rec):
    b, pg, logs = open_pg(p, DET)
    f = Flow("D2b", "", pg)
    hit = """(lab) => { const b = document.querySelector('button[title="' + lab + '"]'); if (!b) return 'no button';
      const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      return (e === b || b.contains(e)) ? 'reachable' : ('covered by ' + (e.closest('aside') ? 'the preview panel (aside)' : e.tagName)); }"""
    f.check("before opening: 'By Lead Tech' switcher reachable", lambda: pg.evaluate(hit, "By Lead Tech"))
    f.step("open preview on S1-702", lambda: row(pg, "S1-702").locator("td").nth(4).click(), wait=1800)
    for lab in ["Table", "By Lead Tech", "Board", "Columns", "Row height", "New Work Order"]:
        f.check(f"with the preview open at 1440x900: '{lab}' control", lambda l=lab: pg.evaluate(hit, l))
    f.check("'New Work Order' button reachable (by text)", lambda: pg.evaluate("""() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'New Work Order');
       if (!b) return 'none'; const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return (e === b || b.contains(e)) ? 'reachable' : 'covered'; }"""))
    f.step("press Escape to close the preview", lambda: pg.keyboard.press("Escape"), wait=600)
    f.step("switch to 'By Lead Tech'", lambda: btn(pg, "By Lead Tech").click(), wait=900)
    f.step("click a Tech View row (S1-644), away from its controls", lambda: pg.locator('[data-wo="S1-644"]').first.click(position={"x": 520, "y": 12}), wait=900)
    f.check("no preview opens from a Tech View row", lambda: not peek_open(pg))
    f.check("no navigation / toast from a Tech View row click", lambda: pg.locator('[role="status"]').count())
    f.step("switch to 'Board'", lambda: btn(pg, "Board").click(), wait=900)
    f.step("click a Board card (S1-354) away from its '…' button", lambda: pg.locator('[data-wo="S1-354"]').first.click(position={"x": 60, "y": 70}), wait=900)
    f.check("no preview opens from a Board card", lambda: not peek_open(pg))
    f.check("no toast from a Board card click", lambda: pg.locator('[role="status"]').count())
    f.step("switch back to 'Table'", lambda: btn(pg, "Table").click(), wait=900)
    f.check("preview stays closed", lambda: not peek_open(pg))
    f.step("open preview on S1-702 then switch to Board via keyboard-free route: close X first", lambda: (row(pg, "S1-702").locator("td").nth(4).click(), pg.wait_for_timeout(1500)), wait=300)
    f.step("resize to 1920 wide", lambda: pg.set_viewport_size({"width": 1920, "height": 1000}), wait=800)
    for lab in ["Table", "By Lead Tech", "Board"]:
        f.check(f"at 1920 wide with preview open: '{lab}'", lambda l=lab: pg.evaluate(hit, l))
    rec["logs"] = logs[:20]; b.close(); return f


END_JS = """(w) => document.querySelector('[data-wo="' + w + '"]').dispatchEvent(new DragEvent('dragend', {bubbles: true}))"""


@flow("W3b", "Refused drag message (denied pill) during a drag: locked status and no permission")
def w3b(p, rec):
    js = """([src, dst]) => { const s = document.querySelector('[data-wo="' + src + '"]'); const t = document.querySelector('[data-group-id="' + dst + '"] [data-gdrag]');
      const dt = new DataTransfer(); const o = {bubbles: true, cancelable: true, dataTransfer: dt};
      const r = t.getBoundingClientRect(); s.dispatchEvent(new DragEvent('dragstart', o));
      t.dispatchEvent(new DragEvent('dragover', Object.assign({clientX: r.left + 20, clientY: r.top + 10}, o))); return 'ok'; }"""
    b, pg, logs = open_pg(p, WO)
    f = Flow("W3b", "", pg)
    f.step("switch to 'Board'", lambda: btn(pg, "Board").click(), wait=900)
    f.step("start dragging Invoiced S1-511 and hold it over Ralph Edwards' column", lambda: pg.evaluate(js, ["S1-511", "ralph"]), wait=400)
    f.step("end the drag", lambda: pg.evaluate(END_JS, "S1-511"), wait=400)
    f.step("start dragging Declined S1-359 over Esther Howard's column", lambda: pg.evaluate(js, ["S1-359", "esther"]), wait=400)
    f.step("end the drag", lambda: pg.evaluate(END_JS, "S1-359"), wait=400)
    f.step("start dragging Imported S1-360 over Esther Howard's column", lambda: pg.evaluate(js, ["S1-360", "esther"]), wait=400)
    f.step("end the drag", lambda: pg.evaluate(END_JS, "S1-360"), wait=400)
    f.step("start dragging Approved S1-352 over Esther Howard's column (allowed: blue drop line, no message)", lambda: pg.evaluate(js, ["S1-352", "esther"]), wait=400)
    f.step("end the drag", lambda: pg.evaluate(END_JS, "S1-352"), wait=400)
    f.step("Tech View: hover the lock on S1-511", lambda: (btn(pg, "By Lead Tech").click(), pg.wait_for_timeout(800),
                                                       pg.locator('[data-wo="S1-511"] [data-tip-text]').first.dispatch_event("mouseover")), wait=500)
    b.close()
    v = variant(WO, [('&quot;canAssign&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true', '&quot;canAssign&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:false')], "noassign")
    b, pg, logs2 = open_pg(p, v)
    f2 = Flow("W3c", "", pg)
    f2.step("canAssign=false: switch to 'Board'", lambda: btn(pg, "Board").click(), wait=900)
    f2.check("no '…' menu buttons on cards", lambda: pg.locator('[data-menu]').evaluate_all("els => els.filter(e => getComputedStyle(e.parentElement).display !== 'none').length"))
    f2.step("start dragging S1-352 over Esther Howard's column", lambda: pg.evaluate(js, ["S1-352", "esther"]), wait=400)
    f.steps += [{"n": 99, "sub": "W3c canAssign=false", "steps": f2.steps}]
    rec["logs"] = (logs + logs2)[:20]; b.close(); return f


@flow("W4b", "Filters + search empty state (Status filter applied, then a no-match search); Clear all filters")
def w4b(p, rec):
    b, pg, logs = open_pg(p, WO)
    f = Flow("W4b", "", pg)
    f.step("switch to 'By Lead Tech'", lambda: btn(pg, "By Lead Tech").click(), wait=900)
    f.step("open the Status filter", lambda: pg.locator("button").filter(has_text=re.compile(r"^\s*Status")).first.click(), wait=500)
    f.step("tick 'Approved'", lambda: pg.get_by_text("Approved", exact=True).last.click(force=True), wait=600)
    f.step("press Escape", lambda: pg.keyboard.press("Escape"), wait=500)
    f.step("search 'zzzz'", lambda: (pg.get_by_text("Search", exact=True).first.click(), pg.keyboard.type("zzzz")), wait=900)
    f.step("click 'Clear all filters'", lambda: pg.get_by_text("Clear all filters").first.click(timeout=5000), wait=800)
    f.step("switch to 'Board' and search 'zzzz' with Status still set", lambda: (btn(pg, "Board").click(), pg.wait_for_timeout(700)), wait=500)
    f.step("switch to 'Table' (List) with the no-match search", lambda: btn(pg, "Table").click(), wait=900)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("A1b", "Add Part page: More options full form, catalog search no match, discard")
def a1b(p, rec):
    b, pg, logs = open_pg(p, "wo-details/Add Part.html")
    f = Flow("A1b", "", pg)
    f.step("click '+ Add Part' on line 1", lambda: pg.locator(".ap-hd-add").first.click(), wait=400)
    f.step("click 'More options'", lambda: pg.locator(".ap-more-link").first.click(), wait=600)
    f.step("type 'zzz' in Part number", lambda: pg.locator("#npNumber").fill("zzz"), wait=500)
    f.step("press Escape (discard prompt)", lambda: pg.keyboard.press("Escape"), wait=400)
    f.step("click 'Discard Part'", lambda: pg.get_by_text("Discard Part").click(), wait=400)
    rec["logs"] = logs[:20]; b.close(); return f


@flow("T1", "Dark theme for real (ShopviewTheme.set('dark')): List + preview, Tech View, Board View on both boards")
def t1(p, rec):
    out = []
    for board in [DET, WO]:
        b, pg, logs = open_pg(p, board)
        pg.evaluate("() => window.ShopviewTheme && ShopviewTheme.set('dark')"); pg.reload(wait_until="load"); ddf.wait_render(pg)
        f = Flow("T1-" + ("details" if board == DET else "wo"), "", pg)
        bg = "() => getComputedStyle(document.body).backgroundColor + ' / theme=' + document.documentElement.getAttribute('data-theme')"
        f.check("resolved theme and page background", lambda: pg.evaluate(bg))
        if board == DET:
            f.step("dark: open preview on S1-702", lambda: row(pg, "S1-702").locator("td").nth(4).click(), wait=1800)
            f.check("embedded page theme (iframe data-theme)", lambda: pg.frames[1].evaluate("() => document.documentElement.getAttribute('data-theme') + ' / ' + getComputedStyle(document.body).backgroundColor"))
            f.step("dark: close preview", lambda: pg.keyboard.press("Escape"), wait=500)
        f.step("dark: By Lead Tech", lambda: btn(pg, "By Lead Tech").click(), wait=900)
        f.step("dark: Board", lambda: btn(pg, "Board").click(), wait=900)
        out.append({"variant": board, "steps": f.steps}); b.close()
    holder = Flow.__new__(Flow); holder.steps = out
    return holder


def main():
    from playwright.sync_api import sync_playwright
    results = []
    with sync_playwright() as p:
        for fid, title, fn in FLOWS:
            if ONLY and fid not in ONLY:
                continue
            rec = {"flow": fid, "title": title}
            t0 = time.time()
            try:
                fl = fn(p, rec)
                rec["steps"] = fl.steps
            except Exception as e:
                rec["fatal"] = traceback.format_exc()[-1500:]
            rec["seconds"] = round(time.time() - t0, 1)
            results.append(rec)
            print(fid, rec.get("fatal", "ok")[:200], rec["seconds"], flush=True)
    prev = []
    fp = OUT / "flows.json"
    if ONLY and fp.exists():
        prev = [r for r in json.loads(fp.read_text()) if r["flow"] not in ONLY]
    fp.write_text(json.dumps(prev + results, indent=1, ensure_ascii=False))


main()
