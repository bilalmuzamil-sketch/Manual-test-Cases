// p2a evidence (Phase 2, Worker A, 29 Oct 2026). Rule 99: browser timezoneId = the location's zone, process TZ = the
// location's zone, session change-location'd to the zone (boot2), all three recorded in meta.json. deviceScaleFactor 2.
// SECRET-FREE. Usage: TZ=<zone> node ev_p2a.mjs <MODE>   Out: /tmp/cln/p2a/ev/<MODE>/
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const L = { HD: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], DVI: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'] };
const MODELOC = { A1: 'HD', A2: 'HD', A3: 'HD', A5HD: 'HD', A4: 'DVI', A4b: 'DVI', A5: 'DVI', A5b: 'DVI', A5c: 'DVI', A5x: 'DVI', A5y: 'DVI', A5z: 'DVI', A5d: 'DVI' };
const mode = process.argv[2]; const [WP, TZ, LOC] = L[MODELOC[mode]];
if (process.env.TZ !== TZ) { console.error('run with TZ=' + TZ); process.exit(2); }
const OUT = `/tmp/cln/p2a/ev/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const SEED = fs.existsSync('/tmp/cln/p2a/seed.json') ? JSON.parse(fs.readFileSync('/tmp/cln/p2a/seed.json')) : {};
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ,
  contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ, acceptDownloads: true } });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
// Rule 99 (Worker B, 29 Oct): report/dashboard date windows use localStorage 'timezone' (UTC when missing), not the browser zone.
const reqStarts = []; page.on('request', r => { const u = r.url(); if (/\/api\/reporting/.test(u)) { const q = decodeURIComponent((u.split('?')[1] || '')); const m = q.match(/(range=[^&]*)|(start_date=[^&]*)|(end_date=[^&]*)|(from=[^&]*)/g); reqStarts.push(u.replace(/^.*\/api/, '').split('?')[0] + ' ' + (m || []).join('&')); } });
const meta = { mode, location: LOC, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.browser_now = await page.evaluate(() => new Date().toString());
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async loc => B(await loc.first().boundingBox({ timeout: 3000 }).catch(() => null));
const txt = async loc => (await loc.first().innerText({ timeout: 3000 }).catch(() => '')).replace(/\s+/g, ' ').trim();
const shot = async (name, extra = {}) => { await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { at_utc: new Date().toISOString(), url: page.url().replace(APP, ''), ...extra }; save(); console.log('SHOT', name, JSON.stringify(extra).slice(0, 900)); };
const go = async (path, wait = 12000) => { await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(wait);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
const rowsOf = async (sel = 'tbody tr', n = 40) => (await page.locator(sel).evaluateAll((trs, n) => trs.slice(0, n).map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\s+/g, ' ').trim())), n));
const heads = async () => (await page.locator('thead th').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim());
const search = async q => { const s = page.locator('[data-test-id="input_report_search"] input, input[data-test-id="input_report_search"]').first(); await s.click(); await s.fill(q); await page.waitForTimeout(6000); };
const preset = async v => { await page.locator('[data-test-id="filter_chip_range"]').click(); await page.waitForTimeout(1200);
  meta.presets = await page.locator('[data-test-id^="filter_preset_range_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id').replace('filter_preset_range_', '') + '=' + e.innerText.trim()));
  await page.locator(`[data-test-id="filter_preset_range_${v}"]`).click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(8000); };
const M = await import('./modes.mjs').catch(e => { console.error(e); return null; });
try { await M.run({ mode, page, meta, shot, go, box, txt, rowsOf, heads, search, preset, save, APP, SEED, OUT }); }
catch (e) { meta.error = String(e).slice(0, 800); console.error('ERR', meta.error); await page.screenshot({ path: `${OUT}/error.png` }).catch(() => {}); }
meta.report_request_start_dates = [...new Set(reqStarts)].slice(0, 12);
save();
console.log(JSON.stringify({ mode, app_tz: meta.app_timezone_key, starts: meta.report_request_start_dates.slice(0, 4), v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, location_tz: meta.location_tz }));
await browser.close();
