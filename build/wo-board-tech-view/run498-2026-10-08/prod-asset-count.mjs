/** Rule 121 for C368181 (12 Oct 2026): does production's asset page show a count on its Work Orders tab? Read-only.
 *  Asset = the truck on S1-3 (2017 WESTERNSTAR, unit T 987), reached the way a person does: its card on the work order page. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12');
const { browser, page: p, ctx, APP } = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 }); p.setDefaultTimeout(20000); const R = {};
try {
  const lst = await (await ctx.request.get('https://api.shopview.com/api/work-orders?pagination[rowsPerPage]=200', { headers: { Accept: 'application/json' } })).json();
  const wo = (lst?.data?.work_orders ?? []).find((w) => Object.values(w).some((v) => v === 'S1-3'));
  await p.goto(`${APP}/workorders/${wo.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  await p.getByText(/2017 WESTERNSTAR/).first().click(); await p.waitForTimeout(8000); R.url = p.url();
  R.tabs = await p.evaluate(`[...document.querySelectorAll('.q-tab, [role=tab]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  const wt = p.locator('.q-tab, [role=tab]').filter({ hasText: /Work Orders/ }).first(); if (await wt.count()) { await wt.click(); await p.waitForTimeout(5000); }
  R.rows = await p.locator('tbody tr').count(); R.pager = (await p.locator('.q-table__bottom, .q-table__control').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ')).slice(0, 4);
  await p.screenshot({ path: path.join(EV, 'prod-asset-wo-tab.png') });
  const it = p.locator('.q-tab, [role=tab]').filter({ hasText: /Invoices/ }).first(); if (await it.count()) { await it.click(); await p.waitForTimeout(4000); R.invRows = await p.locator('tbody tr').count(); R.invPager = (await p.locator('.q-table__bottom, .q-table__control').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ')).slice(0, 4); }
} catch (e) { R.error = String(e?.message || e).slice(0, 200); await p.screenshot({ path: path.join(EV, 'prod-asset-error.png') }); }
fs.writeFileSync(path.join(EV, 'prod-asset-count.json'), JSON.stringify(R, null, 1)); console.log('ASSET', JSON.stringify(R));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
