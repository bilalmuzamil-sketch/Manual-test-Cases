// Area 3 screen evidence for TU S2-E3: waits for the no-rate flag written by tu_rate.py, then reads the Technician
// Utilization screen at ZZAUTOTEST V1R-87 Location C (This Month). Run: TZ=America/Edmonton node tu_screen.mjs
import fs from 'fs'; import { boot, APP, sleep, rule99, save } from '../tools/sboot.mjs';
const loc = { id: '613d5730-af58-47c5-ad64-52bb5a8cf58d', name: 'ZZAUTOTEST V1R-87 Location C', tz: 'America/Edmonton' };
const EV = new URL('./evidence/', import.meta.url).pathname;
while (!fs.existsSync('/tmp/cln/rg16/a3_norate.flag')) await sleep(5000);
const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } });
const r99 = await rule99(page, loc);
await page.goto(APP + '/reports/technician-utilization', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(8000);
const rows = await page.evaluate(() => [...document.querySelectorAll('tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(t => /Esther|Summary|Total/i.test(t)).slice(0, 6));
const header = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(h => h.innerText.trim()));
const range = await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim());
await page.screenshot({ path: EV + 'tu-no-rate-zzautotest-location.png' });
save(EV + 'tu-no-rate-screen.json', { rule99: r99, range, header, rows, at_utc: new Date().toISOString() });
console.log(JSON.stringify({ range, header, rows, zones: r99.all_zones_match, offsets_agree: r99.offsets_agree }));
await browser.close();
