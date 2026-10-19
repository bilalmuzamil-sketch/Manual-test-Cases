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
await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(8000);
if (!version) version = await pg.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const lst = pg.locator('[aria-label="List"]').first(); if (await lst.count()) { await lst.click().catch(() => {}); await W(3000); }
const out: any = { env: ENV, version, at: new Date().toISOString(), tabs: {} };
for (const tab of ['All', 'Estimates', 'Work Orders', 'Completed']) {
  const tl = pg.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + tab + '\\s*$') }).first();
  if (!(await tl.count())) { out.tabs[tab] = 'tab not found'; continue; }
  await tl.click().catch(() => {}); await W(3500);
  out.tabs[tab] = await pg.evaluate(`(() => {
    const chips = [...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.getAttribute('data-test-id') + ' = ' + e.innerText.replace(/\\s+/g, ' ').trim()));
    return { url: location.pathname + location.search, chips, statusChip: chips.some(c => /status/i.test(c)) };
  })()`);
  await pg.screenshot({ path: path.join(EV, `tabs-status-${ENV}-${tab.replace(/ /g, '')}.png`) }).catch(() => {});
}
out.control = out.tabs.All?.statusChip === true;
fs.writeFileSync(path.join(EV, `tabs-status-filter-${ENV}.json`), JSON.stringify(out, null, 1)); console.log('TABS', JSON.stringify(out));
await closeAll(); process.exit(0);
