/** FIX 4 (10 Oct): index 0 is the 'All …' row on Catalog/Inventory — pick index 2; the location filters offer QB Location, not Lethbridge.
 *  FIX 3 (2026-10-09): options picked from the same rows the menu reading lists (tick-box rows), and no word-end rule
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
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, t, shot } from './wob.mts';
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000); const a = api(p);
const R: Record<string, any> = {};
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2400)); fs.writeFileSync(path.join(EV, 'medium-fix5.json'), JSON.stringify(R, null, 1));
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
/** pick in a filter: `how` = the n-th option, or a text */
async function keepAfterReload(id: string, label: string, pick: number | string, before?: () => Promise<void>) {
  const o: any = {}; const f = filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) { o.labels = await p.evaluate(`[...document.querySelectorAll('button, .q-chip, .q-field__label')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 300).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean).slice(0, 30)`); await shot(p, `${id}-no-filter`); return o; }
  await f.click(); await p.waitForTimeout(1200); o.menuBefore = await menuState();
  const items = menuItems();
  if ((await items.count()) < 3) { await p.keyboard.type('a', { delay: 60 }); await p.waitForTimeout(2500); o.typedToLoad = await items.count(); }   // FIX: some lists load their options only after typing
  o.options = (await items.allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 12); const it = typeof pick === 'number' ? items.nth(Math.min(pick, Math.max(0, (await items.count()) - 1))) : items.filter({ hasText: pick }).first(); o.picked = (await it.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); if (!o.picked) { await shot(p, `${id}-options`); await closeMenu(); return o; } await it.click(); await p.waitForTimeout(2000);
  o.menuAfterPick = await menuState(); await closeMenu(); o.tableBefore = await table(); o.chip = (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await shot(p, `${id}-before-reload`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); if (before) await before();
  o.tableAfter = await table(); o.chipAfter = (await filterEl(label).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); o.url = p.url().replace(APP, '');
  await filterEl(label).click().catch(() => {}); await p.waitForTimeout(1200); o.menuAfterReload = await menuState(); await closeMenu(); o.toasts = await toasts(); await shot(p, `${id}-after-reload`);
  o.sameRows = JSON.stringify(o.tableBefore.first) === JSON.stringify(o.tableAfter.first) && o.tableBefore.rows === o.tableAfter.rows;
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
  /* FIX (2026-10-10): the item's text starts with its icon name, so an anchored 'Select all' never matched — match anywhere */
  const sel = menuItems().filter({ hasText: /Select all|\bAll [a-z]+/i }).first(); o.selectAllWord = (await sel.innerText().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null;
  if (await sel.count()) { await sel.click(); await p.waitForTimeout(2000); o.afterSelectAll = await menuState(); }
  const clr = p.locator('.q-menu:visible').locator('.q-item, button').filter({ hasText: /Clear( selection)?/i }).first(); o.clearWord = (await clr.innerText().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null;
  if (await clr.count()) { await clr.click(); await p.waitForTimeout(2000); o.afterClear = await menuState(); }
  if (o.afterClear) { const sel2 = menuItems().filter({ hasText: /Select all|\bAll [a-z]+/i }).first(); if (await sel2.count()) { await sel2.click(); await p.waitForTimeout(2000); o.afterSelectAllFromCleared = await menuState(); o.tableAfterSelectAll = await table(); } }
  o.tableStart = t0; await shot(p, `${id}-menu`); await closeMenu(); return o;
}

await run('C368220', async () => { await nav('Parts', 'Returns'); R.C368220 = { page: p.url().replace(APP, '') }; Object.assign(R.C368220, await keepAfterReload('C368220', 'Vendor', 1)); });
await run('C368221', async () => { await nav('Parts', 'Returns'); const c = p.locator('.q-tab, [role=tab]').filter({ hasText: /Credits/ }).first(); await c.click(); await p.waitForTimeout(3000);
  R.C368221 = { page: p.url().replace(APP, '') }; Object.assign(R.C368221, await keepAfterReload('C368221', 'Date', '60', async () => { R.C368221.tabAfterReload = await p.evaluate(`document.querySelector('.q-tab--active, [role=tab][aria-selected=true]')?.innerText.trim()`); const c2 = p.locator('.q-tab, [role=tab]').filter({ hasText: /Credits/ }).first(); if (!/Credits/.test(String(R.C368221.tabAfterReload))) { await c2.click(); await p.waitForTimeout(3000); } })); });
await run('C368222', async () => { await nav('Parts', 'Part Sales'); R.C368222 = { page: p.url().replace(APP, '') }; Object.assign(R.C368222, await keepAfterReload('C368222', 'Status', 'Complete')); });
await run('C368224', async () => { await nav('Parts', 'Catalog'); R.C368224 = { page: p.url().replace(APP, '') }; Object.assign(R.C368224, await keepAfterReload('C368224', 'Manufacturer', 2)); });
await run('C368225', async () => { await nav('Parts', 'Inventory'); R.C368225 = { page: p.url().replace(APP, '') }; Object.assign(R.C368225, await keepAfterReload('C368225', 'Category', 2)); });
const reportsKeep: [string, string, string, number | string][] = [['C368226', 'Work In Progress', 'Location', 'QB Location'], ['C368227', 'Sales By Customer', 'Customer', 2], ['C368228', 'Parts Velocity', 'Vendor', 2], ['C368229', 'Inventory Value', 'Category', 2], ['C368230', 'Technician Utilization', 'Technician', 2], ['C368231', 'Sales By Representative', 'Location', 'QB Location']];
for (const [id, rep, label, pick] of reportsKeep) await run(id, async () => { await nav('Reports', rep); R[id] = { page: p.url().replace(APP, '') }; Object.assign(R[id], await keepAfterReload(id, label, pick)); });
const reportsTick: [string, string, string][] = [['C368232', 'Work In Progress', 'Location'], ['C368233', 'Sales By Customer', 'Customer'], ['C368234', 'Parts Velocity', 'Vendor'], ['C368235', 'Inventory Value', 'Category'], ['C368236', 'Technician Utilization', 'Technician'], ['C368237', 'Sales By Representative', 'Location']];
for (const [id, rep, label] of reportsTick) await run(id, async () => { await nav('Reports', rep); R[id] = { page: p.url().replace(APP, '') }; Object.assign(R[id], await tickSelectClear(id, label)); });

await run('C368245', async () => { await nav('Customers'); const o: any = { first: await table(), toasts: await toasts() };
  const th0 = p.locator('thead th').filter({ hasText: /Customer Name|Name/ }).first(); const th = (await th0.count()) ? th0 : p.getByText('Customer Name').last(); o.headerKind = (await th0.count()) ? 'th' : 'text'; await th.click(); await p.waitForTimeout(2500);
  const names = async () => p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.querySelector('td')?.innerText.trim()).filter(Boolean)`) as Promise<string[]>;
  const n1 = await names(); o.sorted = n1.slice(0, 6); o.inOrder = n1.every((x, i) => i === 0 || n1[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) <= 0) || n1.every((x, i) => i === 0 || n1[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) >= 0);
  for (let i = 0; i < 4; i++) { await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle') || document.scrollingElement; s.scrollTop = 1e9; window.scrollTo(0, 1e9); })()`); await p.waitForTimeout(1800); }
  const n2 = await names(); o.after = { count: n2.length, before: n1.length, unique: new Set(n2).size === n2.length, ordered: n2.every((x, i) => i === 0 || n2[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) <= 0) || n2.every((x, i) => i === 0 || n2[i - 1].localeCompare(x, undefined, { sensitivity: 'base' }) >= 0) };
  o.bottom = await p.locator('.q-table__bottom').first().innerText().catch(() => null); await shot(p, 'C368245'); R.C368245 = o; });

await run('C368246', async () => { await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); const o: any = { url: p.url().replace(APP, ''), toasts: await toasts() };
  o.cards = await p.evaluate(`[...document.querySelectorAll('.q-card')].filter(c => c.querySelector('table')).map(c => ({ title: (c.innerText.split('\\n')[0] || '').trim().slice(0, 50), rows: c.querySelectorAll('tbody tr').length, heads: [...c.querySelectorAll('thead th')].map(h => h.innerText.trim()).filter(Boolean).slice(0, 6) }))`);
  const sorts: any = {}; const cards = p.locator('.q-card').filter({ has: p.locator('table') });
  for (let i = 0; i < Math.min(await cards.count(), 6); i++) { const c = cards.nth(i); const title = ((await c.innerText()).split('\n')[0] || '').trim().slice(0, 40); const th = c.locator('thead th').filter({ has: p.locator('i, .q-icon') }).first();
    if (!(await th.count())) { sorts[title] = 'no sortable header'; continue; } const col = await th.evaluate((e) => Array.from(e.parentElement!.children).indexOf(e));
    const read = () => c.evaluate((el, k) => [...el.querySelectorAll('tbody tr')].map((r) => ((r.children[k as number] as HTMLElement)?.innerText.trim() || (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim())), col);
    if (await c.getByText(/No data for selected date range/).count()) { const rng = c.locator('button, .q-btn, .q-select').filter({ hasText: /This Month|Month|Week|Year|Days/ }).first(); if (await rng.count()) { await rng.click(); await p.waitForTimeout(900); const opts = p.locator('.q-menu .q-item'); const n = await opts.count(); if (n) { (sorts as any)[title + ' ranges'] = (await opts.allInnerTexts()).map((x) => x.trim()).slice(0, 8); await opts.nth(n - 1).click(); await p.waitForTimeout(3000); } } (sorts as any)[title + ' rowsAfterWiden'] = await c.locator('tbody tr').count(); }
    const b = await read(); await th.click(); await p.waitForTimeout(1500); const x = await read(); await th.click(); await p.waitForTimeout(1500); const y = await read();
    sorts[title] = { header: (await th.innerText()).trim(), before: b.slice(0, 4), first: x.slice(0, 4), second: y.slice(0, 4), changed: JSON.stringify(x) !== JSON.stringify(y) }; }
  o.sorts = sorts; await shot(p, 'C368246'); R.C368246 = o; });

await run('C368247', async () => {
  const cust = `ZZAUTOTEST Imported Lead ${Date.now() % 100000}`; await (await import('./data.mts')).customer(a, cust, 'IMP-1');
  const hdr = '*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount';   // FIX: the app's own template marks required columns with *
  const d = new Date(); const mdy = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`; const inv = `ZZAUTOTEST-IMP-${Date.now() % 100000}`;
  const csv = [hdr, `Staging Heavy Duty - 9919,${cust},,2015,Freightliner,Cascadia,IMP-1,Truck,120000,,${inv},${mdy},ZZAUTOTEST,,Labor,ZZAUTOTEST imported labor,Imported lead check,,,,1,100.00,100.00,5.00`].join('\n') + '\n';
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

fs.writeFileSync(path.join(EV, 'medium-fix5.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
