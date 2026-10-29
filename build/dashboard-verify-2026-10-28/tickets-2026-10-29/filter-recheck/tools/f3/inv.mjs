// F3 fresh-context inventory: open a report screen in a NEW boot2 context (storage empty except user/token/perms + the app's
// own 'timezone' key), record every filter chip's default text, every localStorage key, URL, the API requests the page made.
// Rule 99: browser timezoneId + process TZ + session change-location + localStorage timezone = the location's zone, recorded.
// Usage: TZ=<zone> node inv.mjs <loc> <path> <name>   SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com';
const LOC = { dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'], hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], leth: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'] };
const [l, path, name] = process.argv.slice(2); const [WP, TZ, LNAME] = LOC[l];
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/inv`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await f3boot(l); // location + timezone keys set (F4 trap, Rule 99)
const reqs = []; page.on('request', r => { const u = r.url(); if (u.includes('/api/') && r.resourceType() !== 'image') reqs.push(r.method() + ' ' + decodeURIComponent(u.replace(/^.*\/api/, '/api')).slice(0, 400)); });
const meta = { name, location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString() };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.ls_before = await page.evaluate(() => Object.keys(localStorage));
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
reqs.length = 0;
await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
meta.loc_start = await assertLoc(page, LNAME, WP);
meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
meta.url = page.url();
meta.chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + ' = ' + e.innerText.replace(/\s+/g, ' ').trim()));
meta.test_ids = await page.locator('main [data-test-id]').evaluateAll(es => [...new Set(es.map(e => e.getAttribute('data-test-id')))].filter(x => !/^(text|link)_.*_[0-9a-f-]{20,}/.test(x)).slice(0, 80));
meta.toolbar = (await page.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 700);
meta.heads = await page.locator('thead th').allInnerTexts().catch(() => []);
meta.header_loc = (await page.locator('header').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 200);
meta.ls_after = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => !['user', 'fe_permissions_wrapper', 'token'].includes(k)).map(k => [k, String(localStorage.getItem(k)).slice(0, 200)])));
meta.reqs = reqs; meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok;
fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(meta, null, 1));
await page.screenshot({ path: `${OUT}/${name}.png` });
console.log(JSON.stringify({ name, VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, url: meta.url, chips: meta.chips, ls: meta.ls_after, heads: meta.heads.slice(0, 14) }));
console.log('REQS', JSON.stringify(reqs.filter(r => !/translations|fe-permissions|auth\/me|notifications|whats-new|release|envelope|\/api\/js|mapsjs|feature-flags|my-current-task|view-profile|punch-clock\/today|my-workplaces/.test(r))).slice(0, 2500));
await browser.close();
