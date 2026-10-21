/** loc-diag-1021.mts — 21 Oct 2026, staging, READ-MOSTLY: why does the runner's page keep landing at the S1 location? Logs, as the own
 *  runner (WOB_RUNNER), the change-location answer and what /api/auth/me reports about the location, then the page header, 4 times over
 *  ~40 s. No test data touched. */
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api } from './data.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p);
const me = async () => { const r = await a.get('/api/auth/me'); const d = r.body?.data ?? r.body ?? {}; const pick: any = {}; for (const [k, v] of Object.entries(d)) if (/workplace|location|tz|timezone/i.test(k)) pick[k] = typeof v === 'object' ? JSON.stringify(v).slice(0, 160) : v; return { status: r.status, ...pick }; };
const header = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
console.log('HEAVY', String(HEAVY).slice(0, 8), 'before', JSON.stringify(await me()));
for (let i = 0; i < 4; i++) {
  const r = await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' });
  console.log(i, 'change', r.status, JSON.stringify(r.body).slice(0, 200));
  console.log(i, 'me', JSON.stringify(await me()));
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
  console.log(i, 'header', await header(), 'first number', await p.evaluate(`(document.body.innerText.match(/\\bS\\d+-\\d+\\b/) || [])[0]`));
  await p.waitForTimeout(4000);
}
await RUN.end().catch(() => {});
await done(browser);
