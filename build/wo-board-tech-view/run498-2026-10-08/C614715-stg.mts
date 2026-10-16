/** C614715-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614715 "With no work orders at all, Tech View and Board View show No work orders yet" (section 13236), steps as read live from
 *  TestRail on 16 Oct 2026. Source the case asserts: PRD Confluence 845185030 version 61, S1-N1c (added in version 55, Chris Ward ruling).
 *  Data (Rule 107): [Location-B] = a location with NO work orders at all. "ZZAUTOTEST F2 Empty Shop" is NOT empty any more (s2-batchB.mts
 *  seeds C368130's work orders there), so this case makes its own: "ZZAUTOTEST C614715 Empty Location", through Administration >
 *  Locations > New Location (the stg-setup.mts recipe: Name, Address 1, City, ZIP, Telephone, State/Province, Timezone Asia/Karachi).
 *  Positive control for "no work orders at all": after switching there the work order list call must answer 200 with zero rows; if it
 *  holds any, a fresh "ZZAUTOTEST C614715 Empty <n>" location is made instead. The creator (the signed-in Admin) is enrolled there, which
 *  the case allows (it is about work orders, not technicians).
 *  Steps: menu > Change Location (switchLocUI, L0333) · Work Orders > All > Tech View · Board View · the empty state's "Create Work Order"
 *  (the window's title compared with the page's own button's window) · close without saving · List. ALWAYS switched back to Heavy Duty.
 *  Output EV/C614715-stg.json, pictures C614715-stg-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts';
import { EV, t, display, tab, switchLocUI } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614715-stg-${n}.png`) }).catch(() => {});
const top = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
const wps = async () => ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []) as any[])((await a.get('/api/workplaces')).body?.data);
const mainText = () => p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ').slice(0, 600)`) as Promise<string>;
const emptyState = () => p.evaluate(`(() => { const t = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && /^No work orders yet$/.test((e.textContent || '').trim()));
  if (!t) return null; let box = t; for (let i = 0; i < 5 && box.parentElement; i++) { box = box.parentElement; if (box.querySelector('button')) break; }
  const b = box.querySelector('button'); const ic = [...box.querySelectorAll('i, .q-icon, svg')].map(e => (e.textContent || e.getAttribute('class') || '').trim().slice(0, 40));
  return { text: box.innerText.replace(/\\s+/g, ' ').trim(), button: b ? b.innerText.replace(/\\s+/g, ' ').trim() : null, icons: ic }; })()`);
async function makeLocation(name: string) {
  await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await W(7000);
  await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await W(3000); const d = p.locator('.q-dialog').last();
  await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(name);
  const fill = async (lab: string, v: string) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await W(300); };
  await fill('Address 1', '1 ZZAUTOTEST Way'); await fill('City', 'Las Vegas'); { const z = d.getByLabel(/ZIP/i).first(); await z.click(); await z.fill('89135'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('7025550199', { delay: 30 }); }
  const st = d.getByLabel('State/Province').first(); await st.click(); await W(800); await p.keyboard.type('Nevada', { delay: 40 }); await W(1200); await p.locator('.q-menu .q-item').filter({ hasText: 'Nevada' }).first().click().catch(() => {}); await W(800);
  const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); await tz.click(); await W(800); await p.keyboard.type('Karachi', { delay: 50 }); await W(1500); await p.locator('.q-menu .q-item').filter({ hasText: 'Asia/Karachi' }).first().click().catch(() => {}); await W(800);
  await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (b) { b.scrollIntoView(); b.click(); } })()`); await W(4000);
  return (await wps()).find((w) => w.name === name)?.id ?? null;
}
let LOC = 'ZZAUTOTEST C614715 Empty Location';
try {
  o.start = await top();
  if (!(await wps()).some((w) => w.name === LOC)) o.made = await makeLocation(LOC);
  // ---- step 1: Change Location through the menu
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000);
  o.s1_top = await switchLocUI(p, LOC);
  const cnt = async () => { const r = await a.get('/api/work-orders?tab=all&pagination[rowsPerPage]=5'); return { status: r.status, rows: (r.body?.data?.work_orders ?? []).length, total: r.body?.data?.pagination?.total ?? r.body?.data?.total ?? null }; };
  o.control = await cnt();
  if (o.control.status !== 200) throw new Error('work order list did not answer 200 at the location: the "no work orders" reading would be void');
  if (o.control.rows > 0) { LOC = `ZZAUTOTEST C614715 Empty ${Date.now() % 100000}`; o.remade = await makeLocation(LOC); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); o.s1_top = await switchLocUI(p, LOC); o.control2 = await cnt(); }
  o.location = LOC; await shot('s1-top-bar');
  // ---- step 2: Tech View
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await W(2000);
  o.s2 = { empty: await emptyState(), groups: await p.locator('[data-test-id^="tech_view_group_"]').count(), text: await mainText() }; await shot('s2-tech-view');
  // ---- step 3: Board View
  await display(p, 'Board View'); await W(2000); o.s3 = { empty: await emptyState(), columns: await p.locator('[data-test-id^="board_column_header_"]').count(), text: await mainText() }; await shot('s3-board-view');
  // ---- step 4: the empty state's Create Work Order button; compare with the page's own button's window
  const es = p.locator('button').filter({ hasText: /^\s*Create Work Order\s*$/ }); o.s4_buttons = await es.count();
  await es.last().click().catch(() => {}); await W(3000); const d1 = p.locator('.q-dialog:visible').last(); o.s4_window = (await d1.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160); await shot('s4-window');
  // ---- step 5: close without saving
  await p.keyboard.press('Escape').catch(() => {}); await W(1500); if (await p.locator('.q-dialog:visible').count()) { await p.locator('.q-dialog:visible button').filter({ hasText: /close|cancel/i }).first().click().catch(() => {}); await W(1500); }
  o.s5 = { dialogs: await p.locator('.q-dialog:visible').count(), empty: await emptyState() }; await shot('s5-closed');
  if (o.s4_buttons > 1) { await es.first().click().catch(() => {}); await W(3000); o.s4_pageButtonWindow = (await p.locator('.q-dialog:visible').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160); await p.keyboard.press('Escape').catch(() => {}); await W(1500); }
  // ---- step 6: List
  await display(p, 'List'); await W(2000); o.s6 = { text: await mainText(), firstRun: /No work orders yet/.test(await mainText()) }; await shot('s6-list');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.back = await switchLocUI(p, 'Staging Heavy Duty').catch(() => null); }
fs.writeFileSync(path.join(EV, 'C614715-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614715', JSON.stringify(o).slice(0, 2500)); await done(browser);
