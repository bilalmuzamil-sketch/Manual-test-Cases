/** Rule 125 gate for STAGING (14 Oct 2026): same check as tz-match-check.mjs, through the normal sign-in
 *  (bootOrigin, quick-login on the sign-in page, nothing injected). Cookies: /tmp/qa-cookies/staging-sso.txt +
 *  staging-full.json (PHPSESSID, cf_clearance), chmod 600, never committed. Run with TZ=Asia/Karachi. Exit 1 = no match. */
import fs from 'fs'; import path from 'path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
const EV = process.env.EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'staging-6-2026-10-14');
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' });
await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
const R = await p.evaluate(() => ({
  browserZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  browserClock: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  pills: [...document.querySelectorAll('div,span')].filter((e) => e.children.length === 0 && /^\s*\d{1,2}:\d\d\s*(AM|PM)\s*$/.test(e.textContent)).map((e) => e.textContent.trim()).slice(0, 5),
  userZone: (() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return (u.data ?? u)?.details?.workplace_timezone ?? null; } catch { return null; } })() }));
const mins = (s) => { const m = /(\d+):(\d\d)\s*(AM|PM)/.exec(s || ''); return m ? ((+m[1] % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + +m[2] : NaN; };
R.pill = R.pills[0] ?? null; R.match = Math.abs(mins(R.pill) - mins(R.browserClock)) <= 2 && R.userZone === R.browserZone;
await p.screenshot({ path: path.join(EV, 'tz-match-staging.png') }); fs.writeFileSync(path.join(EV, 'tz-match-staging.json'), JSON.stringify(R, null, 1));
console.log('TZMATCH', JSON.stringify(R)); await browser.close(); process.exit(R.match ? 0 : 1);
