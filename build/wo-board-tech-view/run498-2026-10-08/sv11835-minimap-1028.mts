/** sv11835-minimap-1028.mts — 28 Oct 2026, QA branch sv11835 (SV-11835, Branko Cicovic: "No navigation map on the board view").
 *  Source: PRD 845185030 v81 S3-E2 ("The board shows no sideways scrollbar, in any browser; it scrolls sideways with the minimap
 *  (S3-E2a), a trackpad, or Shift with the mouse wheel. The scrollbars inside each column are unchanged.") and S3-E2a (minimap fixed
 *  bottom right, one tile per technician column, none for Unassigned, thumb over the columns in view; shows whenever the board is
 *  wider than the screen, hides when every column fits; drag thumb / click tile / Left Right Home End; at most 360px or 40%;
 *  chat launcher moves up; announced "Board columns" + "Columns {first} to {last} of {total}"). Cases C682419 (rewrite) and C847746.
 *  Measurements, each with a positive control:
 *   - sideways scrollbar: the board scroller's offsetHeight − clientHeight (0 = no bar drawn) AND scrollWidth > clientWidth (the
 *     board IS wider — otherwise "no bar" proves nothing); a column scroller's bar is read the same way (unchanged, so > 0 expected).
 *   - minimap: found by aria-label "Board columns", else data-test-id/class containing "minimap"; candidates fixed at bottom right are
 *     dumped so a wrong selector shows up as a list, not as "absent".
 *   - every move is read as the scroller's scrollLeft before/after, plus which column headers are on screen.
 *   - fits case: Technician filter narrowed to one technician (every column fits), then location 2.
 *  Traps: Board View draws only nearby columns (L0430) — tile count is compared with allBoardCols(), which walks the whole board;
 *  the chat launcher may be an iframe — read all fixed elements in the bottom-right quarter. Output EV/sv11835-minimap-1028.json,
 *  pictures EV/SV11835-*.png (2x). Preferences put back. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t, display, tab, allBoardCols } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const o: any = { at: new Date().toISOString() }; const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const save = () => fs.writeFileSync(path.join(EV, 'sv11835-minimap-1028.json'), JSON.stringify(o, null, 1));
const shot = (n: string, clip?: any) => p.screenshot({ path: path.join(EV, `SV11835-${n}.png`), ...(clip ? { clip } : {}) }).catch(() => {});
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const SC = `document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller')`;
const scroller = () => p.evaluate(`(() => { const h = ${SC}; if (!h) return null; const cs = getComputedStyle(h);
  return { scrollLeft: Math.round(h.scrollLeft), scrollWidth: h.scrollWidth, clientWidth: h.clientWidth, barH: h.offsetHeight - h.clientHeight, overflowX: cs.overflowX, scrollbarWidth: cs.scrollbarWidth }; })()`) as Promise<any>;
const colBar = () => p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => [...e.querySelectorAll('*')].find(x => x.scrollHeight > x.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(x).overflowY))).find(Boolean);
  return c ? { barW: c.offsetWidth - c.clientWidth, scrollable: c.scrollHeight - c.clientHeight } : null; })()`);
const onScreen = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(h => { const r = h.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth && r.width > 0; }).map(h => h.innerText.replace(/\\s+/g, ' ').trim().slice(0, 30))`);
const MM = `(document.querySelector('[aria-label="Board columns"]') || document.querySelector('[data-test-id*="minimap"], [class*="minimap"], [class*="mini-map"]'))`;
const mini = () => p.evaluate(`(() => { const m = ${MM}; if (!m) return null; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m);
  const kids = [...m.querySelectorAll('*')].filter(e => e.getBoundingClientRect().width > 0);
  const thumb = kids.find(e => /thumb|viewport|window/i.test((e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) + ' ' + (e.getAttribute('data-test-id') || '')));
  const tiles = kids.filter(e => /tile|column|col\\b/i.test((typeof e.className === 'string' ? e.className : '') + ' ' + (e.getAttribute('data-test-id') || '')) && e !== thumb);
  const tb = thumb ? thumb.getBoundingClientRect() : null;
  return { tag: m.tagName, tid: m.getAttribute('data-test-id'), cls: String(m.className).slice(0, 120), role: m.getAttribute('role'), aria: m.getAttribute('aria-label'),
    valuetext: m.getAttribute('aria-valuetext'), describedby: m.getAttribute('aria-describedby') ? (document.getElementById(m.getAttribute('aria-describedby'))||{}).textContent : null,
    live: [...document.querySelectorAll('[aria-live]')].map(e => e.textContent.trim()).filter(s => /Columns/i.test(s)),
    tabindex: m.getAttribute('tabindex'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom),
    position: cs.position, visible: r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0',
    thumb: tb ? { x: Math.round(tb.x), y: Math.round(tb.y), w: Math.round(tb.width), h: Math.round(tb.height) } : null, tiles: tiles.length,
    tileBoxes: tiles.slice(0, 3).concat(tiles.slice(-2)).map(e => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }) }; })()`) as Promise<any>;
const fixedBR = () => p.evaluate(`[...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); if (cs.position !== 'fixed') return false; const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 20 && r.right > innerWidth * 0.6 && r.bottom > innerHeight * 0.6; })
  .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, id: e.id, tid: e.getAttribute('data-test-id'), cls: String(e.className).slice(0, 80), title: e.getAttribute('title'), aria: e.getAttribute('aria-label'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), z: getComputedStyle(e).zIndex }; })`);
const overlap = (b: any, s: any) => b && s && !(b.x + b.w <= s.x || s.x + s.w <= b.x || b.y + b.h <= s.y || s.y + s.h <= b.y);
const toBoard = async () => { await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await W(3000); };
try {
  o.pinOff = (await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [] } })).status;
  await toBoard(); await p.mouse.move(700, 400); await W(800);
  // ---- S1: no sideways bar, the board IS wider (positive control), minimap shown without scrolling
  o.s1 = { scroller: await scroller(), mini: await mini(), fixedBottomRight: await fixedBR() }; await shot('s1-board');
  const sc0 = o.s1.scroller; o.s1.boardWider = sc0 ? sc0.scrollWidth > sc0.clientWidth + 4 : null; o.s1.sidewaysBarDrawn = sc0 ? sc0.barH > 0 : null;
  const m0 = o.s1.mini; if (m0) await shot('s1-minimap', { x: Math.max(0, m0.x - 120), y: Math.max(0, m0.y - 160), width: Math.min(m0.w + 240, 1400), height: m0.h + 260 });
  // ---- S2: tiles vs technician columns (whole board walked), Unassigned on screen
  const cols = await allBoardCols(p); o.s2 = { boardCols: cols.length, techCols: cols.filter((c: any) => !/unassigned/i.test(c.name ?? c.title ?? '')).length, names: cols.slice(0, 3).map((c: any) => c.name ?? c.title), tiles: (await mini())?.tiles ?? null };
  // ---- S3: a column's own scrollbar unchanged (drawn)
  o.s3 = await colBar();
  // ---- S4: drag the thumb right then left
  let m = await mini();
  if (m) {
    const th = m.thumb ?? { x: m.x + 4, y: m.y + 4, w: 20, h: m.h - 8 };
    const before = (await scroller())?.scrollLeft; await p.mouse.move(th.x + th.w / 2, th.y + th.h / 2); await p.mouse.down(); await p.mouse.move(m.x + m.w + 40, th.y + th.h / 2, { steps: 12 }); await p.mouse.up(); await W(1000);
    const right = await scroller(); const thR = (await mini())?.thumb; o.s4 = { thumbFound: !!m.thumb, before, afterRight: right?.scrollLeft, maxLeft: right ? right.scrollWidth - right.clientWidth : null, onScreenRight: await onScreen(), thumbRight: thR };
    await shot('s4-dragged-right');
    m = await mini(); const th2 = m?.thumb ?? th; await p.mouse.move(th2.x + th2.w / 2, th2.y + th2.h / 2); await p.mouse.down(); await p.mouse.move(m.x - 40, th2.y + th2.h / 2, { steps: 12 }); await p.mouse.up(); await W(1000);
    o.s4.afterLeft = (await scroller())?.scrollLeft; o.s4.onScreenLeft = await onScreen();
    // ---- S5/S6: click last tile, first tile, keys
    m = await mini(); await p.mouse.click(m.x + m.w - 3, m.y + m.h / 2); await W(1000); o.s5 = { scrollLeft: (await scroller())?.scrollLeft, onScreen: await onScreen() };
    await p.mouse.click(m.x + 3, m.y + m.h / 2); await W(1000); o.s6 = { afterFirstTile: (await scroller())?.scrollLeft, focused: await p.evaluate(`(() => { const m = ${MM}; return !!m && (m === document.activeElement || m.contains(document.activeElement)); })()`), keys: [] as any[] };
    for (const k of ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'End', 'Home']) { await p.keyboard.press(k); await W(800); const s = await scroller(); o.s6.keys.push({ k, scrollLeft: s?.scrollLeft, first: (await onScreen())[0], live: (await mini())?.live, valuetext: (await mini())?.valuetext }); }
  }
  // ---- S7: Shift + mouse wheel over the board (and plain sideways wheel = trackpad)
  await p.evaluate(`${SC}.scrollLeft = 0`); await W(500); await p.mouse.move(700, 400);
  await p.keyboard.down('Shift'); await p.mouse.wheel(0, 600); await p.keyboard.up('Shift'); await W(800); o.s7 = { shiftWheel: (await scroller())?.scrollLeft };
  await p.mouse.wheel(600, 0); await W(800); o.s7.trackpadSideways = (await scroller())?.scrollLeft;
  // ---- S8: chat launcher vs minimap; size at 1600 and at 1024
  m = await mini(); o.s8 = { miniWide: m ? { w: m.w, right: m.right, bottom: m.bottom, vw: 1600 } : null, fixed: await fixedBR() };
  o.s8.overlaps = (o.s8.fixed as any[]).filter((f) => m && !(f.x >= m.x && f.x + f.w <= m.x + m.w + 1 && f.y >= m.y && f.y + f.h <= m.y + m.h + 1) && overlap(f, m));
  await shot('s8-bottom-right', { x: 1600 - 700, y: 1000 - 420, width: 700, height: 420 });
  await p.setViewportSize({ width: 1024, height: 900 }); await W(2000); const m1024 = await mini(); o.s8.mini1024 = m1024 ? { w: m1024.w, tiles: m1024.tiles, visible: m1024.visible } : null; await shot('s8-1024');
  await p.setViewportSize({ width: 1600, height: 1000 }); await W(1500);
  // ---- S9: every column fits — Technician filter narrowed to one technician
  await p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first().click(); await W(1500);
  const firstTech = p.locator('.q-menu').last().locator('.q-checkbox').nth(1); o.s9 = { picked: await firstTech.evaluate((c) => ((c.closest('.q-item, label') || c.parentElement) as HTMLElement)?.innerText.trim()).catch(() => null) };
  await firstTech.click().catch(() => {}); await W(1200); await p.keyboard.press('Escape'); await W(2500);
  o.s9.scroller = await scroller(); o.s9.mini = await mini(); await shot('s9-one-technician');
  await p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first().click(); await W(1200); const clr = p.locator('.q-menu').last().getByText(/Clear selection/i).first(); if (await clr.count()) await clr.click(); await p.keyboard.press('Escape'); await W(1500);
  // ---- location 2
  const LOC2 = process.env.WOB_LOC2, LOC1 = process.env.WOB_LOC1;
  if (LOC2) { o.loc2 = { change: (await a.post('/api/iam/change-location', { workplace_id: LOC2, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' })).status };
    await toBoard(); o.loc2.scroller = await scroller(); o.loc2.mini = await mini(); await shot('loc2-board');
    o.loc2.back = (await a.post('/api/iam/change-location', { workplace_id: LOC1, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' })).status; }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot('error'); }
o.restore = (await a.put(PREF, { value: ORIGINAL })).status; save(); console.log(t(), JSON.stringify(o).slice(0, 6000)); await done(browser);
