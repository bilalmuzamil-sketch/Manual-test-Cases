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
    // 22 Oct 2026: the case's own steps, nothing else (judged 22 Oct: the page was opened by address, Escape emptied the Search box, a
    // column was switched off and on, and step 6 was never done). Step 1: top menu Parts, then the page in the left menu (address only
    // as a recorded fallback); steps 2-3 Search; 4 reload; 5 read; 6 clear the Search box.
    const LEFT: Record<string, RegExp> = { C368218: /^\s*Purchase Orders\s*$/, C368219: /^\s*Vendors\s*$/, C368223: /^\s*Vendor Invoices\s*$/ };
    await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 90_000 }); await p.waitForTimeout(4000);
    await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /^\s*Parts\s*$/ }).first().click().catch((e) => { o.partsClick = String(e).slice(0, 100); }); await p.waitForTimeout(4000);
    await p.locator('a, .q-item, [role=link], [role=menuitem]').filter({ hasText: LEFT[id] }).first().click().catch((e) => { o.leftClick = String(e).slice(0, 100); }); await p.waitForTimeout(4000);
    o.route1 = p.url().replace(APP, ''); if (!o.route1.startsWith(route)) { o.fallbackGoto = true; await p.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 90_000 }); }
    for (let i = 0; i < 20 && !(await rows()).length; i++) await p.waitForTimeout(1500); await p.waitForTimeout(1500); const all = await rows(); o.rowsBefore = all.length; o.heads = await heads(); await shot(p, `${id}-step1`);
    const v = await p.evaluate(`(() => { const r = [...document.querySelectorAll('tbody tr')].find(r => r.getBoundingClientRect().height > 0); return r ? (r.cells[${col}]?.innerText || '').trim() : null; })()`) as string | null; o.value = v;
    if (!(await box().isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click(); await box().click(); await box().fill(v ?? ''); await p.waitForTimeout(3500);
    o.rowsFiltered = await rows(); o.narrowed = o.rowsFiltered.length > 0 && o.rowsFiltered.length < o.rowsBefore; o.urlFiltered = p.url().replace(APP, ''); await shot(p, `${id}-filtered`);
    await p.reload({ waitUntil: 'domcontentloaded', timeout: 90_000 }); for (let i = 0; i < 20 && !(await rows()).length; i++) await p.waitForTimeout(1500); await p.waitForTimeout(2500);
    const vis = await box().isVisible().catch(() => false);
    o.afterReload = { boxVisible: vis, search: vis ? await box().inputValue().catch(() => null) : null, rows: await rows(), url: p.url().replace(APP, ''), heads: await heads(), toasts: await toasts() };
    o.sameRows = JSON.stringify(o.afterReload.rows) === JSON.stringify(o.rowsFiltered); await shot(p, `${id}-after-reload`);
    if (vis) { await box().fill(''); await p.waitForTimeout(3000); } o.step6cleared = { box: vis ? await box().inputValue().catch(() => null) : null, rows: (await rows()).length };
  } catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, `${id}-error`); }
  R[id] = o; console.log(t(), id, JSON.stringify(o).slice(0, 2500)); fs.writeFileSync(path.join(EV, 'parts-filter2.json'), JSON.stringify(R, null, 1));
}
await done(browser);
