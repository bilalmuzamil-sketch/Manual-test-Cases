/** Rule 125 on ANY environment through the run 498 sign-in (14 Oct 2026, staging): set the location's Timezone to
 *  TZ_TARGET (default Asia/Karachi) in Administration > Locations > edit > Save & Close, read it back after a reload,
 *  move the signed-in user onto that zone, then prove the Schedule's "now" pill equals the browser clock.
 *  Run with WOB_TZ=Asia/Karachi so the browser is on the same zone. Exit 1 when they do not match. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV } from './wob.mts';
import { HEAVY } from './staff.mts';
const TZ = process.env.TZ_TARGET || 'Asia/Karachi'; const LOC = process.env.LOC || 'Staging Heavy Duty - 9919';
const { browser, page: p } = await open('/administration/locations'); const a = api(p); const R: any = { tz: TZ, loc: LOC };
p.setDefaultTimeout(20000);
const row = () => p.locator('tbody tr').filter({ hasText: LOC }).first();
await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
R.before = (await row().innerText()).replace(/\s+/g, ' ').slice(0, 200);
if (!R.before.includes(TZ)) {
  await row().locator('text=edit_note').first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').last(); const f = d.locator('.q-field').filter({ hasText: /Timezone/ }).first();
  await f.click(); await p.waitForTimeout(800); await p.keyboard.type(TZ.split('/')[1], { delay: 60 }); await p.waitForTimeout(2000);
  await p.locator('.q-menu .q-item').filter({ hasText: TZ }).first().click(); await p.waitForTimeout(800);
  R.clicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
  await p.waitForTimeout(4000); R.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
}
R.after = (await row().innerText()).replace(/\s+/g, ' ').slice(0, 200);
R.changeLocation = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: TZ })).status;
await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
Object.assign(R, await p.evaluate(() => ({
  browserZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  browserClock: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  pill: [...document.querySelectorAll('div,span')].filter((e) => e.children.length === 0 && /^\s*\d{1,2}:\d\d\s*(AM|PM)\s*$/.test(e.textContent || '')).map((e) => (e.textContent || '').trim())[0] ?? null,
  userZone: (() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return (u.data ?? u)?.details?.workplace_timezone ?? null; } catch { return null; } })() })));
const mins = (s: string) => { const m = /(\d+):(\d\d)\s*(AM|PM)/.exec(s || ''); return m ? ((+m[1] % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + +m[2] : NaN; };
R.match = R.after.includes(TZ) && Math.abs(mins(R.pill) - mins(R.browserClock)) <= 2 && (R.userZone === null || R.userZone === R.browserZone);
await p.screenshot({ path: path.join(EV, 'tz-match.png') });
fs.writeFileSync(path.join(EV, 'tz-match.json'), JSON.stringify(R, null, 1)); console.log('TZMATCH', JSON.stringify(R));
await done(browser, R.match ? 0 : 1);
