/** UI map 2 (2026-10-09): where Edit Work Order lives on the work order page (every button / aria-label and the
 *  three-dots menu), the toolbar of Purchase Orders / Vendors / Vendor Invoices (their filter controls), the Staff
 *  screen (search, row, row actions, the account-access control) and the List's paging (page size, how more rows load). */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { EV, t, shot, display } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const R: any = {};
const labels = (sel: string) => p.evaluate(`[...document.querySelectorAll('${sel}')].filter(e => e.offsetParent).map(e => (e.getAttribute('data-test-id') || '') + '|' + (e.getAttribute('aria-label') || '') + '|' + (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40)).slice(0, 80)`);
try { const [w] = await workOrders(a, 'ZZAUTOTEST Edit WO'); const id = w?.id ?? (await workOrders(a, 'ZZAUTOTEST'))[0].id;
  await p.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); R.woButtons = await labels('button, [role=button], a');
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000); R.navMenu = await p.locator('.q-menu .q-item').allInnerTexts(); await shot(p, 'UI2-wo-menu'); await p.keyboard.press('Escape');
  const cust = p.locator('[data-test-id="customer_card_change_action"]'); R.customerChange = await cust.count(); const veh = p.locator('[data-test-id="vehicle_card_change_action"]'); R.vehicleChange = await veh.count();
  R.statusCard = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="select_"], [data-test-id^="input_"]')].map(e => e.getAttribute('data-test-id')).slice(0, 30)`);
} catch (e: any) { R.woError = String(e).slice(0, 200); }
for (const [k, route] of [['orders', '/parts/orders'], ['vendors', '/parts/vendors'], ['deliveries', '/parts/deliveries']]) { try { await p.goto(APP + route, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R[k] = { url: p.url().replace(APP, ''), toolbar: await labels('main button, main .q-chip, main .q-select, main [role=button]'), heads: await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim())`) }; await shot(p, `UI2-${k}`); } catch (e: any) { R[k] = String(e).slice(0, 200); } }
try { await p.goto(APP + '/settings/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); R.staff = { url: p.url().replace(APP, ''), controls: await labels('main input, main button, main [role=button]'), firstRow: await p.evaluate(`(document.querySelector('tbody tr') || {}).innerText`) };
  const row = p.locator('tbody tr').first(); R.staff.rowButtons = await row.evaluate((r) => [...r.querySelectorAll('button, a, i')].map((e: any) => (e.getAttribute('data-test-id') || '') + '|' + (e.getAttribute('aria-label') || '') + '|' + (e.innerText || '').trim()).slice(0, 12)).catch(() => []);
  const more = row.locator('button').last(); await more.click().catch(() => {}); await p.waitForTimeout(1000); R.staff.rowMenu = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await shot(p, 'UI2-staff'); await p.keyboard.press('Escape'); } catch (e: any) { R.staffError = String(e).slice(0, 200); }
try { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await display(p, 'List'); await p.waitForTimeout(2500);
  R.list = { rows: await p.locator('tbody tr').count(), bottom: await labels('.q-table__bottom *') }; const gets: string[] = []; p.on('request', (r) => { if (/\/api\/work-orders\?/.test(r.url())) gets.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/, '')).slice(0, 160)); });
  for (let i = 0; i < 6; i++) { await p.mouse.move(800, 600); await p.mouse.wheel(0, 3000); await p.waitForTimeout(1200); } R.list.rowsAfterScroll = await p.locator('tbody tr').count(); R.list.requests = gets.slice(0, 6); } catch (e: any) { R.listError = String(e).slice(0, 200); }
console.log(t(), JSON.stringify(R).slice(0, 9000)); fs.writeFileSync(path.join(EV, 'probe-ui2.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
