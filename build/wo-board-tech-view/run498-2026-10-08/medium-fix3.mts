/** FIX 3 (2026-10-09): options picked from the same rows the menu reading lists (tick-box rows), and no word-end rule
 * (the chip's hidden text runs 'personVendorkeyboard_arrow_down' together; matching already stays inside the page).
 * FIX 2 (2026-10-09): filter chips matched whole-word inside the page only (the hidden text reads 'personVendor', and
 * 'Customer' had matched the top menu's 'Customers'); the options offered are recorded when the wanted one is missing;
 * the imported work order is opened by clicking its number.
 *
 * Medium / Low regression (2026-10-09): filters kept after a reload on Parts pages (C368220 Return requests,
 * C368221 Return credits, C368222 Part Sales, C368224 Catalog, C368225 Inventory) and on reports (C368226-C368231),
 * report filters' tick / select all / clear (C368232-C368237), the Customers table (C368245), dashboard table cards
 * (C368246) and an imported work order's lead (C368247). Pages are reached by the menus' own words, as a tester would.
 * Runs as our own test admin (runner.mts). Every page is photographed; the filter state is read from the open menu.
 */
import { LOC1_NAME, LOC2_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { startState } from './fixup-1017.mts';
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000); const a = api(p);
await startState(p, a, 'medium-fix3');   // L0415, fix-up 2
const R: Record<string, any> = {};
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2400)); fs.writeFileSync(path.join(EV, 'medium-fix3.json'), JSON.stringify(R, null, 1));
}
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const nav = async (top: string, sub?: string) => { await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: top }).first().click(); await p.waitForTimeout(4000);
  if (sub) { const l = p.getByText(sub, { exact: true }).last(); await l.click(); await p.waitForTimeout(5000); } };
const table = async () => ({ rows: await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).length`), first: await p.evaluate(`[...document.querySelectorAll('tbody tr')].slice(0, 4).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 80))`), bottom: await p.locator('.q-table__bottom').first().innerText().catch(() => null), totals: (await p.locator('main, .q-page').first().innerText().catch(() => '')).match(/\$[\d,]+\.\d\d/g)?.slice(0, 4) ?? [] });
/** open a filter by its label (a chip, a button or a field whose text starts with the label) */
const filterEl = (label: string) => p.locator('.q-page-container, main').first().locator('button, .q-btn, .q-chip, .q-field, [data-test-id^="filter_chip_"]').filter({ hasText: new RegExp('^\\s*(?:[a-z_]+\\s*)?' + label, 'i') })   /* FIX 2: the hidden text runs the icon name into the label ('personVendor'); whole word only and never the top menu ('Customers') */   /* FIX: the label starts with its icon name ('person Vendor', 'place Location') */.filter({ visible: true }).first();
/* FIX 3: options are drawn as tick-box rows; pick from the same set the menu reading uses (the last open menu) */
const menuItems = () => p.locator('.q-menu').filter({ visible: true }).last().locator('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio').filter({ hasText: /\S/ });
const menuState = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
  return [...m.querySelectorAll('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio')].filter(e => e.innerText.trim()).map(e => { const on = !!(e.querySelector('.q-checkbox__inner--truthy, .q-radio__inner--truthy, [aria-checked=true], [aria-selected=true]') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || e.classList.contains('q-item--active') || /\\bcheck\\b/.test(e.innerText)); return (on ? '[x] ' : '[ ] ') + e.innerText.replace(/\\s+/g, ' ').replace(/\\bcheck\\b/, '').trim().slice(0, 50); }).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 40); })()`) as Promise<string[] | null>;
const closeMenu = async () => { await p.keyboard.press('Escape'); await p.waitForTimeout(800); };
// FIX-UP 2 (17 Oct 2026): the "All …" / "Select all" row of a filter, found by its own text with the icon word removed
const ALLRX = /^(All\b|Select all\b)/i;
const cleanOpt = (x: string) => String(x ?? '').replace(/\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check|done)\s+/i, '').replace(/\bcheck\b/, '').trim();
async function clickAllItem(pg: Page = p): Promise<string | null> { const txt = await pg.evaluate(`(() => { document.querySelectorAll('[data-zz-all]').forEach(e => e.removeAttribute('data-zz-all'));
    const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    const clean = (x) => String(x || '').replace(/\\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check|done)\\s+/i, '').replace(/\\bcheck\\b/, '').trim();
    const it = [...m.querySelectorAll('.q-item, [role=option], [role=checkbox]')].find(e => /^(All\\b|Select all\\b)/i.test(clean(e.innerText))); if (!it) return null; it.setAttribute('data-zz-all', '1'); return clean(it.innerText); })()`).catch(() => null) as string | null;
  if (txt) { await pg.locator('[data-zz-all="1"]').first().click().catch(() => {}); await pg.waitForTimeout(2000); } return txt; }
/** pick in a filter: `how` = the n-th option, or a text */
async function keepAfterReload(id: string, label: string, pick: number | string, before?: () => Promise<void>, opts: { restore?: boolean } = {}) {
  const o: any = {}; const f = filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) { o.labels = await p.evaluate(`[...document.querySelectorAll('button, .q-chip, .q-field__label')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 300).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean).slice(0, 30)`); await shot(p, `${id}-no-filter`); return o; }
  await f.click(); await p.waitForTimeout(1200); o.menuBefore = await menuState();
  // FIX-UP 2 (17 Oct 2026): what the filter shows BEFORE anything is set (L0415); the case's set-up clears a value already chosen
  o.chipStart = (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); const tickedStart = (o.menuBefore ?? []).filter((x: string) => x.startsWith('[x]')).map((x: string) => x.slice(4));
  console.log(t(), 'START STATE found', id, JSON.stringify({ chip: o.chipStart, ticked: tickedStart.slice(0, 5) }));
  if (opts.restore && tickedStart.some((x: string) => !ALLRX.test(x))) { o.setupCleared = await clickAllItem(); await p.waitForTimeout(1500); o.menuBefore = await menuState(); console.log(t(), 'START STATE set', id, JSON.stringify({ cleared: o.setupCleared, ticked: (o.menuBefore ?? []).filter((x: string) => x.startsWith('[x]')).slice(0, 5) })); }
  const items = menuItems();
  if ((await items.count()) < 3) { await p.keyboard.type('a', { delay: 60 }); await p.waitForTimeout(2500); o.typedToLoad = await items.count(); }   // FIX: some lists load their options only after typing
  o.tableStart = await table();
  o.options = (await items.allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 12); let it = typeof pick === 'number' ? items.nth(Math.min(pick, Math.max(0, (await items.count()) - 1))) : items.filter({ hasText: pick }).first(); o.picked = (await it.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  // FIX-UP 2 (17 Oct 2026, C368224/C368225): option 0 was the default "All manufacturers" / "All categories", so no real filter was chosen.
  // A numbered pick that lands on an "All …" / "Select all" row moves to the first REAL option after it.
  if (typeof pick === 'number' && ALLRX.test(cleanOpt(o.picked))) { const n = await items.count(); for (let k = 0; k < n; k++) { const tx = cleanOpt(await items.nth(k).innerText().catch(() => '')); if (tx && !ALLRX.test(tx)) { o.skippedDefault = o.picked; it = items.nth(k); o.picked = tx; break; } } } if (!o.picked) { await shot(p, `${id}-options`); await closeMenu(); return o; } await it.click(); await p.waitForTimeout(2000);
  o.menuAfterPick = await menuState(); await closeMenu(); o.tableBefore = await table(); o.chip = (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await shot(p, `${id}-before-reload`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); if (before) await before();
  o.tableAfter = await table(); o.chipAfter = (await filterEl(label).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); o.url = p.url().replace(APP, '');
  await filterEl(label).click().catch(() => {}); await p.waitForTimeout(1200); o.menuAfterReload = await menuState(); await closeMenu(); o.toasts = await toasts(); await shot(p, `${id}-after-reload`);
  o.sameRows = JSON.stringify(o.tableBefore.first) === JSON.stringify(o.tableAfter.first) && o.tableBefore.rows === o.tableAfter.rows;
  // FIX-UP 2: the pick read back — ticked in the menu before AND after the reload, and named on the filter button (positive control: the rows changed when it was ticked)
  const pk = cleanOpt(o.picked); o.readBack = { tickedAfterPick: (o.menuAfterPick ?? []).includes('[x] ' + pk.slice(0, 50)), chipNamesIt: String(o.chip).includes(pk.slice(0, 20)), tickedAfterReload: (o.menuAfterReload ?? []).includes('[x] ' + pk.slice(0, 50)), chipAfterNamesIt: String(o.chipAfter).includes(pk.slice(0, 20)), rowsChangedByPick: JSON.stringify(o.tableStart?.first) !== JSON.stringify(o.tableBefore.first) || o.tableStart?.rows !== o.tableBefore.rows };
  if (opts.restore) { await filterEl(label).click().catch(() => {}); await p.waitForTimeout(1200); o.restoreClicked = await clickAllItem(); await p.waitForTimeout(1500); await closeMenu(); o.restoredChip = (await filterEl(label).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); }
  return o;
}
async function tickSelectClear(id: string, label: string) {
  const o: any = {}; const f = filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) return o;
  await f.click(); await p.waitForTimeout(1200); o.start = await menuState(); const items = menuItems();
  o.buttons = await p.locator('.q-menu:visible button').allInnerTexts().catch(() => []);
  if ((await items.count()) < 3) { await p.keyboard.type('a', { delay: 60 }); await p.waitForTimeout(2500); }
  const n = await items.count(); const idx = Math.min(2, n - 1); const t0 = await table();
  await items.nth(idx).click(); await p.waitForTimeout(2000); o.afterUntick = await menuState(); o.tableAfterUntick = await table();
  await items.nth(idx).click(); await p.waitForTimeout(2000); o.afterRetick = await menuState(); o.tableAfterRetick = await table();
  const sel = p.locator('.q-menu:visible').locator('.q-item, button, [role=option]').filter({ hasText: /^\s*(Select all|All\b)/i }).first(); o.selectAllWord = (await sel.innerText().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null;
  if (await sel.count()) { await sel.click(); await p.waitForTimeout(2000); o.afterSelectAll = await menuState(); }
  const clr = p.locator('.q-menu:visible').locator('.q-item, button').filter({ hasText: /Clear( selection)?/i }).first(); o.clearWord = (await clr.innerText().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null;
  if (await clr.count()) { await clr.click(); await p.waitForTimeout(2000); o.afterClear = await menuState(); }
  o.tableStart = t0; await shot(p, `${id}-menu`); await closeMenu(); return o;
}

await run('C368220', async () => { await nav('Parts', 'Returns'); R.C368220 = { page: p.url().replace(APP, '') }; Object.assign(R.C368220, await keepAfterReload('C368220', 'Vendor', 1)); });
await run('C368221', async () => { await nav('Parts', 'Returns'); const c = p.locator('.q-tab, [role=tab]').filter({ hasText: /Credits/ }).first(); await c.click(); await p.waitForTimeout(3000);
  R.C368221 = { page: p.url().replace(APP, '') }; Object.assign(R.C368221, await keepAfterReload('C368221', 'Date', '60', async () => { R.C368221.tabAfterReload = await p.evaluate(`document.querySelector('.q-tab--active, [role=tab][aria-selected=true]')?.innerText.trim()`); const c2 = p.locator('.q-tab, [role=tab]').filter({ hasText: /Credits/ }).first(); if (!/Credits/.test(String(R.C368221.tabAfterReload))) { await c2.click(); await p.waitForTimeout(3000); } })); });
await run('C368222', async () => { await nav('Parts', 'Part Sales'); R.C368222 = { page: p.url().replace(APP, '') }; Object.assign(R.C368222, await keepAfterReload('C368222', 'Status', 'Complete')); });
await run('C368224', async () => { await nav('Parts', 'Catalog'); R.C368224 = { page: p.url().replace(APP, '') }; Object.assign(R.C368224, await keepAfterReload('C368224', 'Manufacturer', 0, undefined, { restore: true })); });
await run('C368225', async () => { await nav('Parts', 'Inventory'); R.C368225 = { page: p.url().replace(APP, '') }; Object.assign(R.C368225, await keepAfterReload('C368225', 'Category', 0, undefined, { restore: true })); });
const reportsKeep: [string, string, string, number | string][] = [['C368226', 'Work In Progress', 'Location', LOC2_NAME], ['C368227', 'Sales By Customer', 'Customer', 2], ['C368228', 'Parts Velocity', 'Vendor', 2], ['C368229', 'Inventory Value', 'Category', 2], ['C368230', 'Technician Utilization', 'Technician', 2], ['C368231', 'Sales By Representative', 'Location', LOC2_NAME]];
for (const [id, rep, label, pick] of reportsKeep) await run(id, async () => { await nav('Reports', rep); R[id] = { page: p.url().replace(APP, '') }; Object.assign(R[id], await keepAfterReload(id, label, pick)); });
const reportsTick: [string, string, string][] = [['C368232', 'Work In Progress', 'Location'], ['C368233', 'Sales By Customer', 'Customer'], ['C368234', 'Parts Velocity', 'Vendor'], ['C368235', 'Inventory Value', 'Category'], ['C368236', 'Technician Utilization', 'Technician'], ['C368237', 'Sales By Representative', 'Location']];
// ───────── FIX-UP 2 (17 Oct 2026, C368233-C368235): the 16 Oct run never did step 6 (the "All …" row was looked for with ^All, but its
// text starts with the tick-box icon word) and never repeated the steps on production (step 9). caseSteps() now does steps 3-8 exactly
// as written — on the SAME code for both sides — and production (app.shopview.com, a dummy environment we are authorised to use; the
// second production account signs in by password, so it does not touch the staging Google sign-in, L0394) is step 9, read only.
// Every step's ticks, the filter button's words and the report's rows are recorded per side; a picture per step: <id>-<side>-stepN-*.png.
const menuStateOn = (pg: Page) => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
  return [...m.querySelectorAll('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio')].filter(e => e.innerText.trim()).map(e => { const on = !!(e.querySelector('.q-checkbox__inner--truthy, .q-radio__inner--truthy, [aria-checked=true], [aria-selected=true]') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || e.classList.contains('q-item--active') || /\\bcheck\\b/.test(e.innerText)); return (on ? '[x] ' : '[ ] ') + e.innerText.replace(/\\s+/g, ' ').replace(/\\bcheck\\b/, '').trim().slice(0, 50); }).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 400); })()`).catch(() => null) as Promise<string[] | null>;
const tableOn = async (pg: Page) => ({ rows: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).length`).catch(() => -1), first: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].slice(0, 3).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 70))`).catch(() => []) });
const sumUp = (st: string[] | null) => { const tk = (st ?? []).filter((x) => x.startsWith('[x]')).map((x) => x.slice(4)); return { ticked: tk.length, of: (st ?? []).length, allTicked: tk.some((x) => ALLRX.test(x)), firstTicked: tk.slice(0, 3) }; };
const filterOn = (pg: Page, label: string) => pg.locator('.q-page-container, main').first().locator('button, .q-btn, .q-chip, .q-field, [data-test-id^="filter_chip_"]').filter({ hasText: new RegExp('^\\s*(?:[a-z_]+\\s*)?' + label, 'i') }).filter({ visible: true }).first();
async function caseSteps(id: string, label: string, pg: Page, side: string) {
  const o: any = { side }; const f = filterOn(pg, label); o.filterFound = await f.count(); if (!o.filterFound) { await pg.screenshot({ path: path.join(EV, `${id}-${side}-no-filter.png`) }).catch(() => {}); return o; }
  const chip = async () => (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/keyboard_arrow_down/, '').trim();
  const pic = (n: string) => pg.screenshot({ path: path.join(EV, `${id}-${side}-${n}.png`) }).catch(() => {});
  const read = async (k: string) => { const st = await menuStateOn(pg); o[k] = { ...sumUp(st), chip: await chip(), table: await tableOn(pg) }; return st; };
  // step 3: open the filter; the "All …" row should be ticked
  await f.click(); await pg.waitForTimeout(1500); const s3 = await read('step3'); o.step3.allRow = (s3 ?? []).find((x) => ALLRX.test(x.slice(4))) ?? null; await pic('step3');
  console.log(t(), 'START STATE found', id, side, JSON.stringify({ chip: o.step3.chip, ticked: o.step3.ticked, allTicked: o.step3.allTicked }));
  const items = pg.locator('.q-menu').filter({ visible: true }).last().locator('.q-item, [role=option], [role=checkbox]').filter({ hasText: /\S/ });
  if ((await items.count()) < 3) { await pg.keyboard.type('a', { delay: 60 }); await pg.waitForTimeout(2500); }
  // step 4: click ONE real option (the second real one, as on 16 Oct and in prod-filters.mjs)
  let idx = -1, real = 0; const n = await items.count(); for (let k = 0; k < n; k++) { const tx = cleanOpt(await items.nth(k).innerText().catch(() => '')); if (tx && !ALLRX.test(tx)) { real++; if (real === 2) { idx = k; o.option = tx; break; } } }
  if (idx < 0) { o.error = 'no real option found'; return o; }
  await items.nth(idx).click(); await pg.waitForTimeout(2500); await read('step4'); await pic('step4-one');
  // step 5: click the same option again
  await items.nth(idx).click(); await pg.waitForTimeout(2500); await read('step5'); await pic('step5-again');
  // step 6: click the "All …" box; if it was already ticked, click it once more
  const wasTicked = o.step5.allTicked; o.step6 = { allTickedBefore: wasTicked };
  o.step6.clicked1 = await clickAllItem(pg); const s61 = await menuStateOn(pg); o.step6.after1 = { ...sumUp(s61), chip: await chip(), table: await tableOn(pg) }; await pic('step6-all');
  if (wasTicked || o.step6.after1.allTicked) { o.step6.clicked2 = await clickAllItem(pg); const s62 = await menuStateOn(pg); o.step6.after2 = { ...sumUp(s62), chip: await chip(), table: await tableOn(pg) }; await pic('step6-all-again'); }
  if (!o.step6.clicked1) o.step6.note = 'no "All …" / "Select all" row was found in the open filter';
  // step 7: a Clear selection button?
  const clr = pg.locator('.q-menu').filter({ visible: true }).last().locator('button, .q-btn, .q-item').filter({ hasText: /Clear( selection)?/i }).first(); o.step7 = { clearButton: (await clr.innerText().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null, buttons: (await pg.locator('.q-menu').filter({ visible: true }).last().locator('button').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean) };
  if (o.step7.clearButton) { await clr.click().catch(() => {}); await pg.waitForTimeout(2000); o.step7.after = { ...sumUp(await menuStateOn(pg)), chip: await chip(), table: await tableOn(pg) }; await pic('step7-clear'); }
  // step 8: close the filter and set it back to "All …"
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(1000); o.step8 = { chipClosed: await chip() };
  for (let k = 0; k < 2; k++) { await f.click().catch(() => {}); await pg.waitForTimeout(1200); const st = sumUp(await menuStateOn(pg)); if (st.allTicked) { o.step8.allTicked = true; await pg.keyboard.press('Escape'); await pg.waitForTimeout(800); break; } o.step8[`setBack${k}`] = await clickAllItem(pg); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1000); }
  o.step8.chip = await chip(); o.step8.table = await tableOn(pg); await pic('step8');
  o.toasts = await pg.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []);
  return o; }
let PROD: any = null;
async function prodPage() { if (PROD) return PROD; const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any; PROD = await bootProdLogin('/reports', { viewport: { width: 1600, height: 1000 } }); PROD.page.setDefaultTimeout(20_000); console.log(t(), 'PRODUCTION signed in', JSON.stringify({ version: PROD.version ?? null })); return PROD; }
const slugOf: Record<string, string> = { 'Sales By Customer': 'sales-by-customer', 'Parts Velocity': 'parts-velocity', 'Inventory Value': 'inventory-value' };
for (const [id, rep, label] of reportsTick) await run(id, async () => {
  if (['C368233', 'C368234', 'C368235'].includes(id)) {
    // steps 1-2 on staging, by the menus (Reports > the report), then steps 3-8
    await nav('Reports', rep); R[id] = { page: p.url().replace(APP, ''), staging: await caseSteps(id, label, p, 'staging') };
    // step 9: production, same report, steps 1-8 (read only; the filter is put back to "All …" at step 8)
    try { const P = await prodPage(); const pp: Page = P.page; await pp.goto(`${P.APP}/reports`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await pp.waitForTimeout(5000);
      const link = pp.getByText(rep, { exact: true }).last(); R[id].prodNav = await link.count(); if (R[id].prodNav) { await link.click().catch(() => {}); await pp.waitForTimeout(6000); }
      if (!pp.url().includes(slugOf[rep])) { await pp.goto(`${P.APP}/reports/${slugOf[rep]}`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await pp.waitForTimeout(7000); R[id].prodNavFallback = 'opened by its address'; }
      R[id].production = await caseSteps(id, label, pp, 'production'); R[id].productionVersion = P.version ?? null;
    } catch (e: any) { R[id].production = { error: String(e?.message || e).slice(0, 200) }; }
    const S = R[id].staging, Pd = R[id].production; const keyOf = (x: any) => x ? `${x.ticked}/${x.allTicked ? 'All' : '-'}` : null;
    R[id].compare = Pd?.error ? 'production not read' : { step3: [keyOf(S.step3), keyOf(Pd.step3)], step4: [keyOf(S.step4), keyOf(Pd.step4)], step5: [keyOf(S.step5), keyOf(Pd.step5)], step6first: [keyOf(S.step6?.after1), keyOf(Pd.step6?.after1)], step6second: [keyOf(S.step6?.after2), keyOf(Pd.step6?.after2)], clearButton: [S.step7?.clearButton ?? null, Pd.step7?.clearButton ?? null], step8chip: [S.step8?.chip, Pd.step8?.chip] };
    return; }
  await nav('Reports', rep); R[id] = { page: p.url().replace(APP, '') }; Object.assign(R[id], await tickSelectClear(id, label)); });

await run('C368245', async () => { await nav('Customers'); const o: any = { first: await table(), toasts: await toasts() };
  const th0 = p.locator('thead th').filter({ hasText: /Customer Name|Name/ }).first(); const th = (await th0.count()) ? th0 : p.getByText('Customer Name').last(); o.headerKind = (await th0.count()) ? 'th' : 'text'; await th.click(); await p.waitForTimeout(2500);
  const names = async () => p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.querySelector('td')?.innerText.trim()).filter(Boolean)`) as Promise<string[]>;
  const n1 = await names(); o.sorted = n1.slice(0, 6); o.inOrder = n1.every((x, i) => i === 0 || n1[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) <= 0) || n1.every((x, i) => i === 0 || n1[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) >= 0);
  for (let i = 0; i < 4; i++) { await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle') || document.scrollingElement; s.scrollTop = 1e9; window.scrollTo(0, 1e9); })()`); await p.waitForTimeout(1800); }
  const n2 = await names(); o.after = { count: n2.length, before: n1.length, unique: new Set(n2).size === n2.length, ordered: n2.every((x, i) => i === 0 || n2[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) <= 0) || n2.every((x, i) => i === 0 || n2[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) >= 0) };
  o.bottom = await p.locator('.q-table__bottom').first().innerText().catch(() => null); await shot(p, 'C368245'); R.C368245 = o; });

// ───────── FIX-UP 2 (17 Oct 2026, C368246): the 16 Oct run read no cards — on this build the dashboard cards show charts and their
// TABLES open behind each card's "View details". Step 1 clicks the ShopView logo (the case's route on this build); step 2 opens every
// card's "View details", reads where the table opened (window / page), its headings and rows; step 3 clicks a heading and reads the
// column again, twice (positive control: the column's own values are read before the click, and a card with no rows is recorded as
// such, never as "sorted"). One picture per card: C368246-<n>-<card>.png.
await run('C368246', async () => { const o: any = { cards: [] };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  // step 1: Dashboard in the top menu (staging shows it there); else the ShopView logo, as the case says for the QA build
  const navD = p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /^\s*Dashboard\s*$/ }).first(); o.topMenuDashboard = await navD.count();
  if (o.topMenuDashboard) { await navD.click().catch(() => {}); await p.waitForTimeout(7000); }
  else { const logo = p.locator('a[href$="/dashboard"], [data-test-id*="logo" i] a, [data-test-id*="logo" i], header a').first(); o.logo = await logo.count(); if (o.logo) { await logo.click().catch(() => {}); await p.waitForTimeout(7000); } }
  o.logoOpened = p.url().replace(APP, ''); if (!/\/dashboard/.test(p.url())) { await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
  o.url = p.url().replace(APP, ''); o.toastsStart = await toasts();
  // FIX-UP 2c (17 Oct 2026, last automated try): the 17 Oct picture shows "View details ⌄" under every card, but 0 were found — the
  // control's text carries its icon word ("View details expand_more"), so an exact-text match missed it, and the cards are not .q-card.
  // Now: every card is DUMPED first (its visible text, every button/link with text, aria-label and role) with a picture, so a person can
  // see exactly what to click; the "View details" controls are found by text CONTAINING "View details", climbed to their clickable element
  // and their card, and MARKED (data-zz-vd / data-zz-card = n); each is clicked by its mark and the card (or a window, if one opens) read.
  const marked = await p.evaluate(`(() => { document.querySelectorAll('[data-zz-vd],[data-zz-card]').forEach(e => { e.removeAttribute('data-zz-vd'); e.removeAttribute('data-zz-card'); });
    const vis = (e) => e.getBoundingClientRect().width > 0; const leafs = [...document.querySelectorAll('main *, .q-page *')].filter(e => vis(e) && /View details/i.test(e.textContent || '') && ![...e.children].some(c => /View details/i.test(c.textContent || '')));
    const out = []; leafs.forEach((l, i) => { const ctl = l.closest('button, a, [role=button], .q-btn, .cursor-pointer') || l; let card = ctl.parentElement; while (card && card.getBoundingClientRect().height < 150) card = card.parentElement;
      ctl.setAttribute('data-zz-vd', String(i)); if (card) card.setAttribute('data-zz-card', String(i));
      out.push({ i, control: { tag: ctl.tagName.toLowerCase(), text: (ctl.innerText || '').replace(/\\s+/g, ' ').trim(), role: ctl.getAttribute('role'), aria: ctl.getAttribute('aria-label') }, title: card ? (card.innerText.split('\\n').map(x => x.trim()).filter(Boolean)[0] || '').slice(0, 50) : null,
        cardText: card ? card.innerText.replace(/\\s+/g, ' ').trim().slice(0, 200) : null, cardControls: card ? [...card.querySelectorAll('button, a, [role=button], .q-btn')].filter(vis).map(b => ({ text: (b.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30), aria: b.getAttribute('aria-label'), role: b.getAttribute('role'), tag: b.tagName.toLowerCase() })).slice(0, 8) : [] }); });
    return out; })()`).catch((e) => [{ error: String(e).slice(0, 100) }]) as any[];
  const titles = marked.map((x: any) => x.title); o.viewDetails = marked.length; o.cardsDump = marked; o.cardTitles = titles; await shot(p, 'C368246-dashboard');
  console.log(t(), 'START STATE found C368246', JSON.stringify({ url: o.url, viewDetails: o.viewDetails, cards: marked.map((x: any) => ({ title: x.title, control: x.control, controls: x.cardControls })) }));
  for (let i = 0; i < Math.min(marked.length, 10); i++) { const c: any = { title: titles[i] };
    try {
      if (!/\/dashboard/.test(p.url())) { await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
      let b = p.locator(`[data-zz-vd="${i}"]`).first(); if (!(await b.count())) { o.remarked = true; await p.evaluate(`(() => { const l = [...document.querySelectorAll('main *, .q-page *')].filter(e => e.getBoundingClientRect().width > 0 && /View details/i.test(e.textContent || '') && ![...e.children].some(c => /View details/i.test(c.textContent || '')))[${i}]; if (!l) return; const ctl = l.closest('button, a, [role=button], .q-btn, .cursor-pointer') || l; ctl.setAttribute('data-zz-vd', '${i}'); let card = ctl.parentElement; while (card && card.getBoundingClientRect().height < 150) card = card.parentElement; if (card) card.setAttribute('data-zz-card', '${i}'); })()`).catch(() => {}); b = p.locator(`[data-zz-vd="${i}"]`).first(); }
      await b.scrollIntoViewIfNeeded().catch(() => {}); const url0 = p.url(); await b.click(); await p.waitForTimeout(5000);
      const dlgOpen = await p.locator('.q-dialog').filter({ visible: true }).count(); c.opened = dlgOpen ? 'window' : (p.url() !== url0 ? `page ${p.url().replace(APP, '')}` : 'in the card');
      const root = dlgOpen ? p.locator('.q-dialog').filter({ visible: true }).last() : (p.url() !== url0 ? p.locator('main, .q-page').first() : p.locator(`[data-zz-card="${i}"]`).first());
      const readT = async () => root.evaluate((el: any) => ({ heads: [...el.querySelectorAll('thead th')].map((h: any) => h.innerText.replace(/\s+/g, ' ').replace(/arrow_(up|down)ward|arrow_drop_(up|down)/g, '').trim()).filter(Boolean).slice(0, 10), rows: el.querySelectorAll('tbody tr').length, first: [...el.querySelectorAll('tbody tr')].slice(0, 4).map((r: any) => r.innerText.replace(/\s+/g, ' ').slice(0, 90)), noData: /No data/i.test(el.innerText) })).catch(() => null);
      c.table = await readT();
      c.textAfterOpen = (await root.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); c.roleRows = await root.evaluate((el: any) => el.querySelectorAll('[role=row], .q-tr').length).catch(() => null);   // fix-up 2c: what opened, for a person reading the log
      if (c.table && !c.table.rows && c.table.noData) { const rng = root.locator('button, .q-btn, .q-select').filter({ hasText: /This Month|Month|Week|Year|Days|Today/ }).first(); if (await rng.count()) { await rng.click(); await p.waitForTimeout(900); const opts = p.locator('.q-menu .q-item'); const n = await opts.count(); if (n) { c.ranges = (await opts.allInnerTexts()).map((x) => x.trim()).slice(0, 8); await opts.nth(n - 1).click(); await p.waitForTimeout(3500); c.tableWidened = await readT(); } } }
      const th = root.locator('thead th.sortable, thead th:has(i), thead th').first(); c.headers = await root.locator('thead th').count();
      if (c.headers && (c.tableWidened?.rows ?? c.table?.rows)) { const col = await th.evaluate((e: any) => Array.from(e.parentElement.children).indexOf(e)).catch(() => 0);
        const colVals = () => root.evaluate((el: any, k: any) => [...el.querySelectorAll('tbody tr')].map((r: any) => (r.children[k]?.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 8), col).catch(() => []);
        const v0 = await colVals(); await th.click().catch(() => {}); await p.waitForTimeout(1800); const v1 = await colVals(); await th.click().catch(() => {}); await p.waitForTimeout(1800); const v2 = await colVals();
        c.sort = { header: (await th.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(), before: v0, firstClick: v1, secondClick: v2, changed: JSON.stringify(v1) !== JSON.stringify(v2) || JSON.stringify(v0) !== JSON.stringify(v1) };
      } else c.sort = c.headers ? 'no rows to order' : 'no table headings found';
      c.toasts = await toasts(); await shot(p, `C368246-${i + 1}-${String(titles[i] || 'card').replace(/[^A-Za-z0-9]+/g, '-').slice(0, 30)}`);
      if (dlgOpen) { await p.keyboard.press('Escape'); await p.waitForTimeout(1000); } else if (c.opened === 'in the card') { c.rowsSeenInCard = c.table?.rows ?? null; }
    } catch (e: any) { c.error = String(e?.message || e).slice(0, 200); }
    o.cards.push(c); }
  // the cards that show a table straight on the dashboard (the 16 Oct reading), kept as a second reading
  if (!/\/dashboard/.test(p.url())) { await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
  o.inlineTables = await p.evaluate(`[...document.querySelectorAll('.q-card')].filter(c => c.querySelector('table')).map(c => ({ title: (c.innerText.split('\\n')[0] || '').trim().slice(0, 50), rows: c.querySelectorAll('tbody tr').length }))`).catch(() => []);
  R.C368246 = o; });

await run('C368247', async () => {
  const cust = `ZZAUTOTEST Imported Lead ${Date.now() % 100000}`; await (await import('./data.mts')).customer(a, cust, 'IMP-1');
  const hdr = '*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount';   // FIX: the app's own template marks required columns with *
  const d = new Date(); const mdy = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`; const inv = `ZZAUTOTEST-IMP-${Date.now() % 100000}`;
  const csv = [hdr, `${LOC1_NAME},${cust},,2015,Freightliner,Cascadia,IMP-1,Truck,120000,,${inv},${mdy},ZZAUTOTEST,,Labor,ZZAUTOTEST imported labor,Imported lead check,,,,1,100.00,100.00,5.00`].join('\n') + '\n';
  const imp = await p.evaluate(async ([api, body]) => { const fd = new FormData(); fd.append('file', new Blob([body as string], { type: 'text/csv' }), 'zzautotest-imported.csv'); const r = await fetch(`${api}/api/imports/work-order-historical`, { method: 'POST', body: fd, credentials: 'include' }); return { status: r.status, body: (await r.text()).slice(0, 200) }; }, [(await import('./profile.mts')).API, csv]);
  R.C368247seed = { inv, imp, listed: ((await a.get('/api/work-orders-imported?pagination[page]=1&pagination[rowsPerPage]=50')).body?.data?.work_orders ?? (await a.get('/api/work-orders-imported?pagination[page]=1&pagination[rowsPerPage]=50')).body?.data?.collection ?? []).length };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500);
  await p.locator('[aria-label="List"]').first().click(); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Imported/ }).first().click(); await p.waitForTimeout(2500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  const o: any = { rows: await p.evaluate(`[...document.querySelectorAll('tbody tr')].length`) };
  await p.getByText(inv, { exact: true }).first().click({ timeout: 15000 }).catch(async () => { await p.getByText(/^ZZIMP-1001$/).first().click(); });   // FIX 2: click the imported number itself
    await p.waitForTimeout(5000); o.url = p.url().replace(APP, '');
  o.page = (await p.locator('main, .q-page').first().innerText()).replace(/\s+/g, ' ').slice(0, 600); o.leadControl = await p.locator('[data-test-id="select_lead_technician"]').count(); o.leadText = /Lead Technician/i.test(o.page);
  await shot(p, 'C368247'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.afterReloadLead = /Lead Technician/i.test(await p.locator('main, .q-page').first().innerText());
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000); await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.keyboard.press('Escape');
  R.C368247 = o; await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(3000); await p.locator('[data-test-id="filter_chip_status"]').click().catch(() => {}); await p.waitForTimeout(800); await p.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await p.keyboard.press('Escape').catch(() => {});   /* FIX: never leave the Imported filter saved */ });

fs.writeFileSync(path.join(EV, 'medium-fix3.json'), JSON.stringify(R, null, 1));
if (PROD) await Promise.race([PROD.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 8000))]);   // fix-up 2: the production browser (C368233-C368235)
await RUN.end(); await done(browser);
