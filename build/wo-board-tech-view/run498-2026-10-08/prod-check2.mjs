/** Production (2026-10-09): does today's product have an "Edit Work Order" window on the work order page, filters on
 *  Purchase Orders / Vendors / Vendor Invoices, and where is the Staff screen? Second test account (never the QA lead's). */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-09'); const R = {};
const { browser, page: p, ctx, APP, version } = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } }); R.version = version;
const labels = (sel) => p.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent).map((e) => (e.getAttribute('data-test-id') || '') + '|' + (e.getAttribute('aria-label') || '') + '|' + (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40)).filter((x) => !/button_receive/.test(x)).slice(0, 60), sel);
const r = await ctx.request.get('https://api.shopview.com/api/work-orders?pagination[rowsPerPage]=5', { headers: { Accept: 'application/json' } }); const w = (await r.json())?.data?.work_orders?.[0];
await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000); R.woButtons = await labels('button, [role=button]');
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click().catch(() => {}); await p.waitForTimeout(1000); R.navMenu = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await p.keyboard.press('Escape');
R.editWOText = await p.evaluate(() => /Edit Work Order/i.test(document.body.innerText));
for (const [k, route] of [['orders', '/parts/orders'], ['vendors', '/parts/vendors'], ['deliveries', '/parts/deliveries']]) { await p.goto(APP + route, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); R[k] = { url: p.url().replace(APP, ''), toolbar: await labels('main button, main .q-chip, main [role=button]') }; await p.screenshot({ path: path.join(EV, `prod-${k}.png`) }); }
await p.goto(APP + '/settings', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); R.settings = { url: p.url().replace(APP, ''), links: await labels('a, .q-item') };
fs.writeFileSync(path.join(EV, 'prod-check2.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R).slice(0, 6000)); await browser.close(); process.exit(0);
