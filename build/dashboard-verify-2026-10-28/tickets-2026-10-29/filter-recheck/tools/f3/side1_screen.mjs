// F3 side finding 1: the date the work order's Finance tab shows for a deposit taken after 8 PM Toronto. Two passes: (A) app timezone key set
// (all four Rule 99 places on America/Toronto), (B) the same page with localStorage 'timezone' REMOVED. No writes. SECRET-FREE.
// Usage: TZ=America/Toronto node side1_screen.mjs
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SIDE1'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, LNAME, TZ } = await f3boot('dvi');
const meta = { location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), passes: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const WOS = { 'S1-38221': '1cf29c7d-295e-4919-be7e-12e90806e534', 'S1-38219': '420b6744-19e3-482e-aa9c-a682484065cd' };
for (const pass of ['A-key-set', 'B-key-removed']) {
  if (pass.startsWith('B')) await page.evaluate(() => localStorage.removeItem('timezone'));
  for (const [n, id] of Object.entries(WOS)) {
    await page.goto(`${APP}/workorders/${id}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
    const P = { loc: await assertLoc(page, LNAME, WP), app_timezone_key: await page.evaluate(() => localStorage.getItem('timezone')), browser_zone: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone) };
    meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
    const main = (await page.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ');
    const i = main.indexOf('Deposit'); P.deposit_text = main.slice(Math.max(0, i - 200), i + 500);
    P.date_strings = [...new Set(main.match(/(Oct|October) \d{1,2},? 2026|10\/\d{2}\/2026/g) || [])];
    const dep = page.getByText(/\(Deposit\)|Deposit/).first(); P.deposit_box = B(await dep.boundingBox().catch(() => null));
    const depRow = page.locator('tr, .q-item, div').filter({ hasText: /\(Deposit\)/ }).last(); P.deposit_row = (await depRow.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); P.deposit_row_box = B(await depRow.boundingBox().catch(() => null));
    await page.screenshot({ path: `${OUT}/${pass}-${n}-finance.png` }); P.VALID = P.loc.ok;
    meta.passes[`${pass}/${n}`] = P;
    console.log(pass, n, 'VALID=' + P.VALID, 'key=', P.app_timezone_key, 'bz=', P.browser_zone, JSON.stringify(P.date_strings), '|', P.deposit_row);
  }
}
fs.writeFileSync(`${OUT}/screen-meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone }));
await browser.close();
