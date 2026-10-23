/** c682419-bar.mts — 19 Oct 2026, C682419 "Board View's sideways scroll bar is thick and its handle is never tiny" (new case, section 13238,
 *  PRD 845185030 v65 S3-E2, read live 19 Oct). Follows the case's 9 steps on STAGING as the Admin user. The bar is the browser's own
 *  scrollbar, so the page cannot report the handle's size: the bar strip is captured from the SCREEN and the grey handle is found in its
 *  pixels (a run whose brightness differs from the track at both ends, measured with the board scrolled to the middle so both ends are
 *  track). Thickness = the board scroller's offsetHeight - clientHeight; the inside-column bar = Unassigned body's offsetWidth -
 *  clientWidth after scrolling it. Step 6 drags the handle with the mouse (start = left end, then from the right end back). Step 7: window
 *  1280 and 1024 wide, then location "DVI Test" (few technicians), then back to Staging Heavy Duty - 9919. Step 8: profile menu > Dark,
 *  measure, back to Light. Step 9: Tech View and List bar thickness. Firefox is not on this machine (Chromium only) — that expected line is
 *  reported as not checked. Output EV/c682419-bar.json; pictures EV/C682419-*.png. Records only; location and theme put back.
 *  Scrollbars: launched WITHOUT --hide-scrollbars (Playwright's headless default hides every scrollbar; L0464). */
import { LOC1_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { EV, t, display, tab, search, switchLocUI } from './wob.mts';

const { browser: b0, page: p0 } = await open('/workorders?tab=all');
const scale = Number(process.env.WOB_SCALE || 1);
// 19 Oct 2026 (first run read every bar as 0 px, in Board, Tech View AND List): headless Chromium is launched with --hide-scrollbars by
// default, so no scrollbar is drawn at all. Positive control below: List/Tech View bars must read > 0. A second browser WITHOUT that flag
// carries the same signed-in state (no new sign-in).
const { chromium } = await import('playwright');
const state = await p0.context().storageState(); const APPU = new URL(p0.url()).origin;
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true,
  proxy: { server: `http://127.0.0.1:${fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim()}` }, args: ['--no-sandbox', '--ignore-certificate-errors'], ignoreDefaultArgs: ['--hide-scrollbars'] });
const ctx = await browser.newContext({ storageState: state, viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale, ignoreHTTPSErrors: true });
const p = await ctx.newPage(); await b0.close().catch(() => {});
await p.goto(APPU + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
const W = (ms: number) => p.waitForTimeout(ms);
const o: any = { scale };
const SC = `[data-test-id="board_view_scroller"], .board-view__scroller`;
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C682419-${n}.png`) }).catch(() => {});
const HOME = LOC1_NAME;

const geo = () => p.evaluate(`(() => { const h = document.querySelector('${SC}'); if (!h) return null; const r = h.getBoundingClientRect(); const cs = getComputedStyle(h);
  const bt = parseFloat(cs.borderTopWidth) || 0, bb = parseFloat(cs.borderBottomWidth) || 0;
  const col = document.querySelector('[data-test-id="board_column_unassigned"] .board-column__body') || [...document.querySelectorAll('[data-test-id="board_column_unassigned"] *')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY));
  const heads = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(e => e.getBoundingClientRect().width > 0);
  const colW = heads.length > 1 ? Math.round(heads[1].getBoundingClientRect().width) : null;
  const un = document.querySelector('[data-test-id="board_column_unassigned"]'); const ub = un ? un.getBoundingClientRect() : null;
  const names = [...document.querySelectorAll('[data-test-id^="board_column_name_"]')].map(e => ({ n: e.textContent.trim(), l: Math.round(e.getBoundingClientRect().left), r: Math.round(e.getBoundingClientRect().right) }));
  const inView = names.filter(x => x.l >= 0 && x.r <= innerWidth).map(x => x.n);
  return { x: r.left, y: r.top, w: r.width, h: r.height, client: h.clientWidth, scrollW: h.scrollWidth, left: Math.round(h.scrollLeft), max: h.scrollWidth - h.clientWidth,
    barH: h.offsetHeight - h.clientHeight - bt - bb, colBar: col ? col.offsetWidth - col.clientWidth : null, colScrollTop: col ? Math.round(col.scrollTop) : null, colW, columns: heads.length,
    unassignedLeft: ub ? Math.round(ub.left) : null, firstInView: inView[0] ?? null, lastInView: inView[inView.length - 1] ?? null, innerW: innerWidth }; })()`) as Promise<any>;
const setLeft = (v: string) => p.evaluate(`(() => { const h = document.querySelector('${SC}'); h.scrollLeft = ${v}; h.dispatchEvent(new Event('scroll')); })()`).then(() => W(800));

// the handle, read from the screen: the strip under the board, middle row of pixels
async function handle(name: string) {
  const g = await geo(); if (!g || g.barH <= 0) return { bar: false, geo: g };
  const clip = { x: g.x, y: g.y + g.h - g.barH, width: g.client, height: g.barH };
  const buf = await p.screenshot({ clip }); fs.writeFileSync(path.join(EV, `C682419-strip-${name}.png`), buf);
  const a: any = await p.evaluate(`(async () => { const img = new Image(); img.src = 'data:image/png;base64,${buf.toString('base64')}'; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, Math.floor(img.height / 2), img.width, 1).data; const px = []; for (let i = 0; i < img.width; i++) px.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]);
    const L = (q) => 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]; const lum = px.map(L);
    const endL = (lum.slice(0, 3).reduce((s, v) => s + v, 0) + lum.slice(-3).reduce((s, v) => s + v, 0)) / 6;
    const leftEnd = lum.slice(0, 3).reduce((s, v) => s + v, 0) / 3, rightEnd = lum.slice(-3).reduce((s, v) => s + v, 0) / 3;
    const diff = lum.map(v => Math.abs(v - endL) > 10); const first = diff.indexOf(true), last = diff.lastIndexOf(true);
    const mid = first >= 0 ? px[Math.floor((first + last) / 2)] : null;
    return { width: img.width, first, last, track: px[1], thumb: mid, leftEnd: Math.round(leftEnd), rightEnd: Math.round(rightEnd), trackLum: Math.round(endL), thumbLum: mid ? Math.round(L(mid)) : null }; })()`);
  const len = a.first >= 0 ? Math.round((a.last - a.first + 1) / scale) : 0;
  return { bar: true, geo: g, handleCss: len, handleStartCss: Math.round(a.first / scale), trackRgb: a.track, thumbRgb: a.thumb, trackLum: a.trackLum, thumbLum: a.thumbLum, endsDiffer: Math.abs(a.leftEnd - a.rightEnd) > 10 };
}
const measureMid = async (name: string) => { const g = await geo(); if (g?.max > 0) await setLeft(String(Math.round(g.max / 2))); const h = await handle(name); await setLeft('0'); return h; };

const tableBar0 = () => p.evaluate(`(() => { const m = document.querySelector('.q-table__middle'); if (!m) return null; return { horizontal: m.offsetHeight - m.clientHeight, vertical: m.offsetWidth - m.clientWidth }; })()`);
await display(p, 'List').catch(() => {}); await W(2500); o.control_listBars = await tableBar0();
// step 1-2: All tab, Board View, nothing narrowing the board
o.location = await switchLocUI(p, HOME);
await tab(p, 'All'); await search(p, ''); await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await W(1200);
await display(p, 'Board View'); await W(2500); await setLeft('0');
o.s2 = await geo(); await shot('s2-board');
// step 3-4: the bottom bar, then scroll inside Unassigned and read its own bar
o.s3 = { barThickness: o.s2?.barH };
const ub = await p.locator('[data-test-id="board_column_unassigned"]').boundingBox();
if (ub) { await p.mouse.move(ub.x + ub.width / 2, ub.y + Math.min(ub.height, 600) / 2); await p.mouse.wheel(0, 400); await W(1200); }
o.s4 = await geo(); o.s4.ratio = o.s4?.colBar ? Math.round((o.s4.barH / o.s4.colBar) * 10) / 10 : null; await shot('s3-s4-bars');
// step 5: the handle against one technician column (board in the middle so both ends are track)
o.s5 = await measureMid('s5-1600'); o.s5.halfColumn = o.s4?.colW ? o.s4.colW / 2 : null; await shot('s5-handle');
// step 6: drag the handle right with the mouse, then back left
{ const g = await geo(); const h = o.s5;
  if (g && h.bar && h.handleCss > 0) {
    const y = g.y + g.h - g.barH / 2; const L = h.handleCss; const T = g.client;
    await p.mouse.move(g.x + L / 2, y); await p.mouse.down(); await p.mouse.move(g.x + T + 60, y, { steps: 25 }); await p.mouse.up(); await W(1500);
    o.s6right = await geo(); await shot('s6-right');
    await p.mouse.move(g.x + T - L / 2, y); await p.mouse.down(); await p.mouse.move(g.x - 60, y, { steps: 25 }); await p.mouse.up(); await W(1500);
    o.s6left = await geo(); await shot('s6-left');
    o.s6 = { reachedEnd: Math.abs(o.s6right.left - o.s6right.max) <= 2, backToStart: o.s6left.left <= 2, unassignedStayed: o.s6right.unassignedLeft === o.s2.unassignedLeft && o.s6left.unassignedLeft === o.s2.unassignedLeft, lastAtRight: o.s6right.lastInView, firstAtLeft: o.s6left.firstInView };
  } else o.s6 = { notDone: 'no handle measured' }; }
// step 7: narrower windows, then a location with few technicians
for (const w of [1280, 1024]) { await p.setViewportSize({ width: w, height: 800 }); await W(2000); o['s7_' + w] = await measureMid(`s7-${w}`); await shot(`s7-${w}`); }
await p.setViewportSize({ width: 1600, height: 1000 }); await W(1500);
o.s7_loc = await switchLocUI(p, 'DVI Test'); await W(3000); await display(p, 'Board View').catch(() => {}); await W(2000);
o.s7_few = await measureMid('s7-dvi'); await shot('s7-dvi');
o.s7_back = await switchLocUI(p, HOME); await W(3000);
// step 8: Dark, then back to Light
const theme = async (word: RegExp) => { await p.locator('[data-test-id="profile_menu_button"]').click(); await W(1000);
  let it = p.locator('.q-menu button, .q-menu .q-btn, .q-menu [role="radio"], .q-menu [role="button"]').filter({ hasText: word }).last();
  if (!(await it.count())) it = p.locator('.q-menu').getByText(word).last();
  const found = await it.count(); if (found) await it.click().catch(() => {}); await W(1500); await p.keyboard.press('Escape').catch(() => {}); await W(1000); return found; };
await display(p, 'Board View').catch(() => {}); await W(1500);
o.s8_darkClicked = await theme(/^\s*(dark_mode\s*)?Dark\s*$/i); o.s8_body = await p.evaluate(`getComputedStyle(document.body).backgroundColor`);
o.s8 = await measureMid('s8-dark'); await shot('s8-dark');
o.s8_lightClicked = await theme(/^\s*(light_mode\s*)?Light\s*$/i); o.s8_bodyAfter = await p.evaluate(`getComputedStyle(document.body).backgroundColor`);
// step 9: Tech View and List keep their thin bars
const tableBar = () => p.evaluate(`(() => { const m = document.querySelector('.q-table__middle'); if (!m) return null; const cs = getComputedStyle(m); return { horizontal: m.offsetHeight - m.clientHeight - (parseFloat(cs.borderTopWidth) || 0) - (parseFloat(cs.borderBottomWidth) || 0), vertical: m.offsetWidth - m.clientWidth, wider: m.scrollWidth > m.clientWidth, taller: m.scrollHeight > m.clientHeight }; })()`);
await display(p, 'Tech View'); await W(2500); o.s9_tech = await tableBar(); await shot('s9-tech');
await display(p, 'List'); await W(2500); o.s9_list = await tableBar(); await shot('s9-list');
o.firefox = 'not checked: only Chromium is installed on this machine';
fs.writeFileSync(path.join(EV, 'c682419-bar.json'), JSON.stringify(o, null, 1));
console.log(t(), 'C682419', JSON.stringify(o).slice(0, 6000));
await done(browser);
