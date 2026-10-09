/** UI map for the High-risk regression cases (2026-10-09): what is on a customer page and an asset page (tabs, the
 *  Work Orders table), the work order page's New Line form, a line's ⋮ menu and its Edit labor window, the page's
 *  three-dots menu (Timesheets), and the Schedule (sidebar card, technician rows, time grid). Reads only; pictures. */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p);
const R: any = {};
const ids = (pg: Page = p, re = '.') => pg.evaluate(`[...new Set([...document.querySelectorAll('[data-test-id]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>')).filter(t => new RegExp(${JSON.stringify(re)}, 'i').test(t)))].slice(0, 120)`);
const texts = (sel: string) => p.evaluate(`[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 40)`);
const n = `ZZAUTOTEST UI Map ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZUIMAP');
const canned: any[] = []; { const cc = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(cc) ? cc : cc?.collection ?? [])); }
const wo = await workOrder(a, c, 'estimate', null); await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[1].id, status: 'authorized' });
await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
const num = (await workOrders(a, n))[0]?.number;
try { // customer page
  await p.goto(`${APP}/customers/${c.company_id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R.customer = { url: p.url().replace(APP, ''), tabs: await texts('.q-tab, [role=tab]'), ids: await ids(p, 'tab|work|vehicle|asset') }; await shot(p, 'UI-customer');
  const wt = p.locator('.q-tab, [role=tab]').filter({ hasText: /Work Orders/ }).first(); if (await wt.count()) { await wt.click(); await p.waitForTimeout(3500); R.customer.woTab = { heads: await texts('thead th'), rows: await texts('tbody tr'), ids: await ids(p, 'table|pagination|toggle|vehicle_here|row'), bottom: await texts('.q-table__bottom') }; await shot(p, 'UI-customer-wo'); }
  const at = p.locator('.q-tab, [role=tab]').filter({ hasText: /Assets|Vehicles/ }).first(); if (await at.count()) { await at.click(); await p.waitForTimeout(3500); R.customer.assetsTab = { heads: await texts('thead th'), rows: await texts('tbody tr') };
    await p.locator('tbody tr').first().click().catch(() => {}); await p.waitForTimeout(5000); R.asset = { url: p.url().replace(APP, ''), tabs: await texts('.q-tab, [role=tab]') }; await shot(p, 'UI-asset');
    const awt = p.locator('.q-tab, [role=tab]').filter({ hasText: /Work Orders/ }).first(); if (await awt.count()) { await awt.click(); await p.waitForTimeout(3500); R.asset.woTab = { heads: await texts('thead th'), rows: await texts('tbody tr'), ids: await ids(p, 'table|pagination|toggle|vehicle_here|row'), bottom: await texts('.q-table__bottom') }; await shot(p, 'UI-asset-wo'); } }
} catch (e: any) { R.customerError = String(e).slice(0, 200); }
try { // work order page: New Line form, line menu, Edit labor, top three-dots
  await p.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await p.locator('[data-test-id="button_new_line"]').click(); await p.waitForTimeout(2500);
  R.newLine = { labels: await texts('.q-dialog .q-field__label, .q-dialog label'), buttons: await texts('.q-dialog button'), ids: await ids(p, '.') }; await shot(p, 'UI-new-line'); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  const dots = p.locator('[data-test-id^="button_line_context_menu"], [data-test-id^="line_number_"] ~ * button, button:has(i:text("more_vert"))').first();
  const lineMenu = p.locator('table [data-test-id^="line_number_"]').first(); const lb = await lineMenu.boundingBox();
  const mv = p.locator('tbody i, tbody .q-icon').filter({ hasText: 'more_vert' }).first(); await mv.click().catch(() => {}); await p.waitForTimeout(1200);
  R.lineMenu = await texts('.q-menu .q-item'); await shot(p, 'UI-line-menu');
  const el = p.locator('.q-menu .q-item').filter({ hasText: /Edit labor/i }).first(); if (await el.count()) { await el.click(); await p.waitForTimeout(2000); R.editLabor = { labels: await texts('.q-dialog .q-field__label, .q-dialog label'), buttons: await texts('.q-dialog button'), title: await texts('.q-dialog .text-h6, .q-dialog [data-test-id="text_dialog_title"]') }; await shot(p, 'UI-edit-labor'); await p.keyboard.press('Escape'); }
  await p.waitForTimeout(800);
  const top = p.locator('.q-tabs ~ * button, button').filter({ has: p.locator('i', { hasText: 'more_vert' }) });
  R.topMenus = await top.count();
  for (let i = 0; i < Math.min(await top.count(), 6); i++) { const b = top.nth(i); const bb = await b.boundingBox(); if (!bb || bb.y > 140) continue; await b.click().catch(() => {}); await p.waitForTimeout(1000); R[`topMenu${i}`] = { at: [Math.round(bb.x), Math.round(bb.y)], items: await texts('.q-menu .q-item') }; await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
} catch (e: any) { R.woError = String(e).slice(0, 200); }
try { // schedule
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  R.schedule = { ids: await ids(p, 'sidebar|schedule|row|cell|staff|search|today|next|arrow'), buttons: await texts('button'), staffRows: await p.evaluate(`[...document.querySelectorAll('[data-staff-id]')].slice(0, 5).map(e => e.getAttribute('data-staff-id').slice(0,8) + ' ' + e.className.slice(0, 60))`) };
  await shot(p, 'UI-schedule');
} catch (e: any) { R.scheduleError = String(e).slice(0, 200); }
R.wo = num;
console.log(t(), JSON.stringify(R, null, 1).slice(0, 9000));
fs.writeFileSync(path.join(EV, 'probe-ui.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
