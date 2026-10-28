// Every PV date preset, picked on screen: records the window each one sends (location time zone set as the app sets it).
import fs from 'fs';
import { open2, APP } from './ctx2.mjs';
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto';
const { browser, page } = await open2(WP, TZ, 1, 2300, 1000);
let last = null; page.on('request', r => { const u = r.url(); if (/reports\/parts-velocity\?/.test(u)) last = decodeURIComponent(u.replace(/^.*\?/, '')); });
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="table_parts_velocity"]', { timeout: 90000 }); await page.waitForTimeout(9000);
const R = { default: last };
const chip = page.locator('.pv-filter-band button').first();
await chip.click(); await page.waitForTimeout(1200);
const opts = (await page.locator('.q-menu').last().innerText()).split('\n').map(s => s.trim()).filter(Boolean);
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
for (const o of opts) {
  if (o === 'Custom') continue;
  last = null;
  await chip.click(); await page.waitForTimeout(1000);
  await page.locator('.q-menu').last().getByText(o, { exact: true }).first().click(); await page.waitForTimeout(800);
  const ap = page.locator('.q-menu').last().getByText(/^Apply$/); if (await ap.count()) { await ap.first().click(); }
  await page.waitForTimeout(5000);
  const m = last && last.match(/start_date=([^&]+)&end_date=([^&]+)/);
  R[o] = m ? [m[1], m[2]] : last; R[o + ' label'] = (await chip.innerText()).replace(/\n/g, ' ');
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
}
fs.writeFileSync('/tmp/cln/w3/shots/presets.json', JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1));
await browser.close();
