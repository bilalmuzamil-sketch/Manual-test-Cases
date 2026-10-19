/** refresh-tab.mts — 19 Oct 2026, read-only probe (C96936 re-run: after a refresh tab A came back on the Work Orders tab, not All).
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
/* On the All tab, in each view (production: List; staging: List, Tech View), with a search typed: read the active tab, the URL and the saved
   preference tab; reload; read them again (twice, 5 s apart). Positive control: the tab read before the reload must be All.
   Output EV/refresh-tab-<env>.json + pictures refresh-tab-<env>-<view>-<before|after>.png. */
const activeTab = () => pg.evaluate(`(() => { const e = document.querySelector('.q-tab--active, [role=tab][aria-selected=true]'); return e ? e.innerText.trim() : null; })()`);
const saved = () => pg.evaluate(`fetch('/api/users/me/preferences/work-orders-list', { credentials: 'include' }).then(r => r.ok ? r.json() : r.status).then(j => typeof j === 'number' ? j : (j?.data?.value?.tab ?? j?.data?.value?.filterView ?? JSON.stringify(j?.data?.value ?? null).slice(0, 200))).catch(e => String(e))`);
await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(8000);
if (!version) version = await pg.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const out: any = { env: ENV, version, at: new Date().toISOString(), views: {} };
for (const v of (ENV === 'prod' ? ['List'] : ['List', 'Tech View'])) {
  const r: any = {};
  await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).first().click().catch(() => {}); await W(2500);
  const sw = pg.locator(`[aria-label="${v}"]`).first(); if (await sw.count()) { await sw.click().catch(() => {}); await W(3000); }
  await pg.getByText('Search', { exact: true }).first().click().catch(() => {}); await W(500);
  await pg.locator('[data-test-id="page_search_input"], input[placeholder*="earch" i]').first().fill('ZZAUTOTEST').catch(() => {}); await W(3500);
  r.before = { tab: await activeTab(), url: pg.url().replace(APP, ''), saved: await saved() };
  await pg.screenshot({ path: path.join(EV, `refresh-tab-${ENV}-${v.replace(' ', '')}-before.png`) }).catch(() => {});
  await pg.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000);
  r.after = { tab: await activeTab(), url: pg.url().replace(APP, ''), saved: await saved() };
  await W(5000); r.after2 = { tab: await activeTab(), url: pg.url().replace(APP, '') };
  await pg.screenshot({ path: path.join(EV, `refresh-tab-${ENV}-${v.replace(' ', '')}-after.png`) }).catch(() => {});
  out.views[v] = r;
}
await pg.locator('[aria-label="List"]').first().click().catch(() => {});
fs.writeFileSync(path.join(EV, `refresh-tab-${ENV}.json`), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
await closeAll(); process.exit(0);
