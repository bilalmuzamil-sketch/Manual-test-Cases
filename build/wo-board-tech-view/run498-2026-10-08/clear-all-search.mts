/** tabs-status-filter.mts — 19 Oct 2026, read-only. For C96916 / C368214 (blocked: "Status: Approved" on the Work Orders tab).
 *  On each Work Orders tab (All, Estimates, Work Orders, Completed) in List, list the filter chips offered. ENV=prod uses the
 *  production password sign-in (prod-login-boot.mjs; credentials stay in /tmp); otherwise staging through session.mts.
 *  Positive control: the All tab must show a Status chip (seen on staging 17 Oct). Output EV/tabs-status-filter-<env>.json + pictures. */
import fs from 'node:fs'; import path from 'node:path';
const ENV = process.env.ENV === 'prod' ? 'prod' : 'staging';
const EV = process.env.WOB_EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
let pg: any, closeAll: () => Promise<any>, APP: string, version: any = null;
if (ENV === 'prod') { const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any;
  const P = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.QA_DPR || 1) });
  pg = P.page; APP = P.APP; version = P.version ?? null; closeAll = async () => { await P.browser?.close?.().catch(() => {}); await P.context?.close?.().catch(() => {}); };
} else { const S = await import('./session.mts'); const o = await S.open('/workorders?tab=all'); pg = o.page; APP = S.APP; closeAll = async () => { await o.browser.close().catch(() => {}); }; }
const W = (ms: number) => pg.waitForTimeout(ms);
/* clear-all-search.mts — 19 Oct 2026, read-only, for C590122 step 8 (PRD S1-N1: Tech View/Board View show "the same empty state as the List,
   with the same messages and action"). On the All tab: Status = Paid + Search "zzzz" -> the no-results state -> Clear all filters; then read
   the Search box and the Status chip. Done in List (production and staging) and in Tech View (staging). Output EV/clear-all-search-<env>.json. */
await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(8000);
if (!version) version = await pg.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const out: any = { env: ENV, version, at: new Date().toISOString(), views: {} };
const views = ENV === 'prod' ? ['List'] : ['List', 'Tech View'];
for (const v of views) {
  const r: any = {};
  await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).first().click().catch(() => {}); await W(2500);
  const sw = pg.locator(`[aria-label="${v}"]`).first(); if (await sw.count()) { await sw.click().catch(() => {}); await W(3000); }
  await pg.locator('[data-test-id="filter_chip_status"]').first().click().catch(() => {}); await W(900);
  await pg.locator('.q-menu').getByText('Clear selection').first().click({ timeout: 3000 }).catch(() => {}); await W(500);
  await pg.locator('[data-test-id="filter_option_status_paid"], .q-menu .q-item:has-text("Paid")').first().click().catch(() => {}); await W(800); await pg.keyboard.press('Escape'); await W(1500);
  await pg.getByText('Search', { exact: true }).first().click().catch(() => {}); await W(500);
  const box = pg.locator('[data-test-id="page_search_input"], input[placeholder*="earch" i]').first(); await box.fill('zzzz').catch(() => {}); await W(3500);
  r.before = { search: await box.inputValue().catch(() => null), status: (await pg.locator('[data-test-id="filter_chip_status"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(),
    empty: (await pg.evaluate(`document.body.innerText`) as string).match(/No work orders match[^\n]*/)?.[0] ?? null };
  await pg.screenshot({ path: path.join(EV, `clearall-${ENV}-${v.replace(/ /g, '')}-1-before.png`) }).catch(() => {});
  const btn = pg.getByRole('button', { name: /Clear all filters/i }).first(); r.button = await btn.count();
  if (r.button) { await btn.click().catch(() => {}); await W(2500); }
  r.after = { search: await box.inputValue().catch(() => null), status: (await pg.locator('[data-test-id="filter_chip_status"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(),
    empty: (await pg.evaluate(`document.body.innerText`) as string).match(/No work orders match[^\n]*/)?.[0] ?? null };
  await pg.screenshot({ path: path.join(EV, `clearall-${ENV}-${v.replace(/ /g, '')}-2-after.png`) }).catch(() => {});
  // tidy: empty the search box again
  await box.fill('').catch(() => {}); await W(1000);
  out.views[v] = r;
}
fs.writeFileSync(path.join(EV, `clear-all-search-${ENV}.json`), JSON.stringify(out, null, 1)); console.log('CLEARALL', JSON.stringify(out));
await closeAll(); process.exit(0);
