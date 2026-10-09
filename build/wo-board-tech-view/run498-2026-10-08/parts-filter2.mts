/**
 * PARTS PAGES KEEP THEIR FILTER AFTER A RELOAD (2026-10-09): C368218 Purchase Orders, C368219 Vendors, C368223 Vendor
 * Invoices. QA lead 9 Oct 2026 confirmed these pages have no Vendor / State filter: each has the page's own Search
 * (the Search button at the RIGHT of the page header), the app-wide search, and (Purchase Orders) a columns button. So the page's own Search
 * is the filter used; the expected results are unchanged. Positive control: the search must NARROW the rows first.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/parts/orders'); p.setDefaultTimeout(30_000);
const R: any = {}; const ONLYS = (process.env.ONLY || '').split(',').filter(Boolean);
const rows = () => p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 80))`) as Promise<string[]>;
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' '))`) as Promise<string[]>;
const box = () => p.locator('[data-test-id="page_search_input"]');
const heads = () => p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`) as Promise<string[]>;
for (const [id, route, col] of [['C368218', '/parts/orders', 2], ['C368219', '/parts/vendors', 0], ['C368223', '/parts/deliveries', 1]] as const) {
  if (ONLYS.length && !ONLYS.includes(id)) continue; const o: any = { route };
  try {
    await p.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 90_000 }); for (let i = 0; i < 20 && !(await rows()).length; i++) await p.waitForTimeout(1500); await p.waitForTimeout(1500); const all = await rows(); o.rowsBefore = all.length; o.heads = await heads();
    // a value from the page itself: the first row's cell in a distinctive column (order number / vendor name / invoice number)
    const v = await p.evaluate(`(() => { const r = [...document.querySelectorAll('tbody tr')].find(r => r.getBoundingClientRect().height > 0); return r ? (r.cells[${col}]?.innerText || '').trim() : null; })()`) as string | null; o.value = v;
    if (!(await box().isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click(); await box().click(); await box().fill(v ?? ''); await p.waitForTimeout(3500);
    o.rowsFiltered = await rows(); o.narrowed = o.rowsFiltered.length > 0 && o.rowsFiltered.length < o.rowsBefore; o.urlFiltered = p.url().replace(APP, '');
    await p.keyboard.press('Escape').catch(() => {}); await shot(p, `${id}-filtered`);
    o.attempts = [];
    for (let k = 0; k < 2; k++) { if (k) { if (!(await box().isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click(); await box().fill(v ?? ''); await p.waitForTimeout(3500); }
      const urlBefore = p.url().replace(APP, ''); const nBefore = (await rows()).length; await p.reload({ waitUntil: 'domcontentloaded', timeout: 90_000 }); for (let i = 0; i < 20 && !(await rows()).length; i++) await p.waitForTimeout(1500); await p.waitForTimeout(2000);
      const vis = await box().isVisible().catch(() => false); o.attempts.push({ urlBefore, rowsBefore: nBefore, urlAfter: p.url().replace(APP, ''), boxVisible: vis, boxValue: vis ? await box().inputValue().catch(() => null) : null, rowsAfter: (await rows()).length, firstRow: (await rows())[0] ?? null, toasts: await toasts() }); await shot(p, `${id}-reload-${k + 1}`); }
    // the columns button, where the page has one: switch the last column off as a second remembered setting
    const cb = p.locator('[data-test-id="button_column_selection"]'); o.columnsButton = await cb.count();
    if (o.columnsButton) { await cb.click(); await p.waitForTimeout(800); const tg = p.locator('.q-menu [data-test-id^="toggle_column_"]'); o.columnToggles = await tg.count(); if (o.columnToggles) { const last = tg.nth(o.columnToggles - 1); o.columnOff = (await last.innerText()).trim(); await last.click(); await p.waitForTimeout(800); } await p.keyboard.press('Escape'); await p.waitForTimeout(800); o.headsFiltered = await heads(); }
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
    o.afterReload = { search: await box().inputValue().catch(() => null), rows: await rows(), url: p.url().replace(APP, ''), heads: await heads(), toasts: await toasts() };
    o.sameRows = JSON.stringify(o.afterReload.rows) === JSON.stringify(o.rowsFiltered); await shot(p, `${id}-after-reload`);
    if (o.columnsButton && o.columnOff) { await p.locator('[data-test-id="button_column_selection"]').click(); await p.waitForTimeout(800); const tg = p.locator('.q-menu [data-test-id^="toggle_column_"]'); await tg.nth((await tg.count()) - 1).click(); await p.keyboard.press('Escape'); }   // put the column back
  } catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, `${id}-error`); }
  R[id] = o; console.log(t(), id, JSON.stringify(o).slice(0, 2500)); fs.writeFileSync(path.join(EV, 'parts-filter2.json'), JSON.stringify(R, null, 1));
}
await done(browser);
