/** C614716-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614716 "Density and Columns tooltips open above their button and hide while open" (section 73780), steps as read live from
 *  TestRail on 16 Oct 2026. Source the case asserts: PRD Confluence 845185030 version 61, S2-R23 (tooltip sentence added in version 55,
 *  Chris Ward ruling) and S1-R9b.
 *  Data (Rule 107, ZZAUTOTEST): technician "ZZAUTOTEST N3 Tia", customer "ZZAUTOTEST N3 Tooltips" with one Approved work order led by Tia.
 *  Window 1440 px wide, zoom 100% (deviceScaleFactor from WOB_SCALE only affects the pictures). Starting screen: All tab, Tech View,
 *  Search = the customer, no filter, Assigned to me off.
 *  Reading: every visible .q-tooltip (text + box) after each hover, the hovered button's box and the table's column header row box, so
 *  "above the button" = tooltip bottom <= button top, and "does not cover the header row" = no overlap between the two boxes.
 *  Positive control (Rule 104): at least one of the three hovers (steps 1, 4, 7) must show a tooltip, or "no tooltip while open" (steps 2
 *  and 5) is void — a hover that never produced a tooltip proves nothing. The pointer is parked away between hovers.
 *  Output EV/C614716-stg.json, pictures C614716-stg-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, customer, workOrder } from './data.mts';
import { EV, t, display, tab, search } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614716-stg-${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const box = (sel: string) => p.locator(sel).first().boundingBox().catch(() => null);
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1; })
  .map(e => { const r = e.getBoundingClientRect(); return { text: e.innerText.trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })`) as Promise<any[]>;
const menus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`) as Promise<string[]>;
const away = async () => { await p.mouse.move(5, 880); await W(700); };
const overlap = (x: any, y: any) => !!(x && y && x.x < y.x + y.width && x.x + x.w > y.x && x.y < y.y + y.height && x.y + x.h > y.y);
const hoverRead = async (sel: string, tag: string) => { await away(); await p.locator(sel).first().hover().catch(() => {}); await W(1500); const b = await box(sel); const tp = await tips(); const head = await box('thead');
  await shot(tag); return { button: b, tooltips: tp, above: tp[0] && b ? tp[0].y + tp[0].h <= b.y + 1 : null, coversHeaderRow: tp[0] ? overlap(tp[0], head) : null }; };
try {
  await p.setViewportSize({ width: 1440, height: 900 });
  const A = (await person(a, 'ZZAUTOTEST N3', 'Tia', { role: TECH, email: `zz.wob.n3.tia${D}`, clockable: true, workplace: HEAVY })).row; o.eligible = await ensureEligible(a, A, 'A');
  const CUST = 'ZZAUTOTEST N3 Tooltips'; const c = await customer(a, CUST, 'N3-U1');
  const have = ((await a.get(`/api/work-orders?tab=all&search=${encodeURIComponent(CUST)}&pagination[rowsPerPage]=10`)).body?.data?.work_orders ?? []) as any[];
  if (!have.length) await workOrder(a, c, 'approved', A.staff_id);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await search(p, CUST); await W(2000);
  o.s1 = await hoverRead('[data-test-id="button_density"]', 's1-density-hover');
  await p.locator('[data-test-id="button_density"]').first().click(); await W(1200); o.s2 = { menus: await menus(), tooltips: await tips() }; await shot('s2-density-open');
  await p.keyboard.press('Escape'); await W(900); o.s3 = { menus: await menus() };
  o.s4 = await hoverRead('[data-test-id="button_tech_view_column_selection"]', 's4-columns-hover');
  await p.locator('[data-test-id="button_tech_view_column_selection"]').first().click(); await W(1200); o.s5 = { menus: await menus(), tooltips: await tips() }; await shot('s5-columns-open');
  await p.keyboard.press('Escape'); await W(900); o.s6 = { menus: await menus() };
  o.s7 = await hoverRead('[aria-label="Tech View"]', 's7-switcher-hover');
  o.positiveControl = [o.s1, o.s4, o.s7].some((x) => (x?.tooltips ?? []).length > 0) ? 'a hover produced a tooltip' : 'VOID: no hover produced any tooltip';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'C614716-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614716', JSON.stringify(o).slice(0, 2500)); await done(browser);
