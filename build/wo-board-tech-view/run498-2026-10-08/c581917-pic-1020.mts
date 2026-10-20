/** c581917-pic-1020.mts — 20 Oct 2026, staging: C581917 step 5 picture. tech-filter-check-1020 read WO-2 (S2-37640, Ralph Edwards) back in
 *  the results after "Clear all filters" (search kept) but its row was far down the drawn list; here the same state is rebuilt (search
 *  the case's customer, Technician = Esther Howard, Status = Paid, Clear all filters) and WO-2's row is brought on screen with
 *  findRow (wob.mts) by its work-order id, then pictured. Raw readings only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { EV, shot, display, tab, search, findRow } from './wob.mts';
const OUT = path.join(EV, 'c581917-pic-1020.json');
const CUST = 'ZZAUTOTEST NT3 Technician Filter Mix 82068';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: any = {};
try {
  const wos = await workOrders(a, CUST); const w2 = wos.find((x: any) => x.number === 'S2-37640'); const w1 = wos.find((x: any) => x.number === 'S2-37639'); R.ids = { w1: !!w1, w2: !!w2 };
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await search(p, CUST);
  const chip = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  await chip.click(); await W(1200); await p.locator('.q-menu').last().locator('input').first().fill('Esther Howard'); await W(1200);
  await p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /Esther Howard/ }).first().click(); await W(1200); await p.keyboard.press('Escape'); await W(900);
  await p.locator('[data-test-id="filter_chip_status"]').first().click(); await W(1000); await p.locator('[data-test-id="filter_option_status_paid"]').first().click(); await W(1000); await p.keyboard.press('Escape'); await W(900);
  R.empty = /No work orders match these filters/.test(await p.locator('body').innerText()); await shot(p, 'C581917-1020-before-clear');
  await p.locator('button, .q-btn').filter({ hasText: /Clear all filters/i }).first().click(); await W(3000);
  R.chips = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  R.search = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  if (w2) { R.w2Group = await findRow(p, w2.id); await shot(p, 'C581917-1020-s5-wo2'); }
  if (w1) { R.w1Group = await findRow(p, w1.id); await shot(p, 'C581917-1020-s5-wo1'); }
} catch (e: any) { R.err = String(e?.message || e).slice(0, 400); }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
await RUN.end().catch(() => {});
await done(browser);
