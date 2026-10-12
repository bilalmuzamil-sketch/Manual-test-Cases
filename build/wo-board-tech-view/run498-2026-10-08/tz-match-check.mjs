/** Rule 125 gate (12 Oct 2026): before ANY time-related check, the Schedule's blue "now" pill must equal the browser's own
 *  clock, and the browser must run on the location's zone. Exit 1 if not. Normal sign-in, browser TZ from the TZ variable. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const BR = process.env.QA_BRANCH || 'sv10043'; const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'karachi-2026-10-12');
const { browser, page: p, APP } = await boot(BR, '/schedule', 'admin');
await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
const R = await p.evaluate(() => ({
  browserZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  browserClock: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  pill: [...document.querySelectorAll('div,span')].filter((e) => e.children.length === 0 && /^\s*\d{1,2}:\d\d\s*(AM|PM)\s*$/.test(e.textContent)).map((e) => e.textContent.trim())[0] ?? null,
  shop: document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\s+/g, ' ').slice(0, 40) ?? null,
  userZone: (() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return (u.data ?? u)?.details?.workplace_timezone ?? null; } catch { return null; } })() }));
const mins = (s) => { const m = /(\d+):(\d\d)\s*(AM|PM)/.exec(s || ''); return m ? ((+m[1] % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + +m[2] : NaN; };
R.match = Math.abs(mins(R.pill) - mins(R.browserClock)) <= 2 && R.userZone === R.browserZone;
await p.screenshot({ path: path.join(EV, `tz-match-${BR}.png`) });
console.log('TZMATCH', JSON.stringify(R)); await browser.close(); process.exit(R.match ? 0 : 1);
