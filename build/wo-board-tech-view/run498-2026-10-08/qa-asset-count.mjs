/** C368181 picture (12 Oct 2026): the QA branch asset page's tabs, in a normally signed-in browser (quick-login, nothing
 *  injected), at 2x. Asset = the truck on a ZZAUTOTEST work order with unit TRK-201, reached from the work order page. Read-only. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'clean-tz-2026-10-12');
const { browser, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); const R = {};
try {
  const num = process.env.WO || 'S10043-19183';
  const r = await p.evaluate(async (q) => (await fetch(`https://sv10043api.qa.shopview.com/api/work-orders?search=${q}&pagination[rowsPerPage]=5`, { credentials: 'include', headers: { Accept: 'application/json' } })).json(), num);
  const w = (r?.data?.work_orders ?? []).find((x) => Object.values(x).includes(num));
  // as a person does: the work order > its customer card > Assets tab > the truck > Work Orders tab
  await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  await p.getByText(/^\s*ZZAUTOTEST Move Labor/).first().click(); await p.waitForTimeout(7000); R.customerUrl = p.url().replace(/[0-9a-f-]{36}/g, '<id>');
  await p.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Assets/ }).first().click(); await p.waitForTimeout(4000);
  await p.locator('tbody tr').filter({ hasText: /TRK-201/ }).first().click(); await p.waitForTimeout(7000);
  const wt = p.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Work Orders/ }).first(); if (await wt.count()) { await wt.click(); await p.waitForTimeout(4000); }
  R.url = p.url().replace(/[0-9a-f-]{36}/g, '<id>');
  R.tabs = await p.evaluate(`[...document.querySelectorAll('.q-tab, [role=tab]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  R.rows = await p.locator('tbody tr').count(); await p.screenshot({ path: path.join(EV, 'qa-asset-wo-tab.png') });
} catch (e) { R.error = String(e?.message || e).slice(0, 200); await p.screenshot({ path: path.join(EV, 'qa-asset-error.png') }); }
console.log('QAASSET', JSON.stringify(R)); await browser.close(); process.exit(0);
