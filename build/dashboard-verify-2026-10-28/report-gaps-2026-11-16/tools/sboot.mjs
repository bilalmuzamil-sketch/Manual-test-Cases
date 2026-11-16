// Staging screen helper for the 16 Nov report-gaps pass. Rule 99: session change-location + browser timezoneId +
// process TZ + localStorage 'timezone' (+ 'location'), all read back into the evidence, plus browser vs machine offsets.
// SECRET-FREE: cookies stay in /tmp (boot2 reads /tmp/cln/cookies.json); nothing secret is printed or saved.
import fs from 'fs'; import { execFileSync } from 'child_process';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
export const APP = 'https://app.staging.shopview.com';
export const LOC = { HD: { id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', name: 'Staging Heavy Duty - 9919', tz: 'Asia/Karachi' },
  LE: { id: 'f8a8b802-7780-4b16-bf10-343caeb616b2', name: 'Staging Lethbridge - 4310', tz: 'America/Edmonton' },
  QB: { id: '25a0d576-b371-4b82-bef4-41ba977f31c2', name: 'QB Location', tz: 'America/Vancouver' },
  DVI: { id: '39522bc6-abca-4f67-bd12-2840043c2d68', name: 'DVI Test', tz: 'Pacific/Fiji' } };
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function boot(loc, opts = {}) {
  if (process.env.TZ !== loc.tz) throw new Error(`process TZ ${process.env.TZ} != location zone ${loc.tz} (Rule 99)`);
  const r = await boot2('admin', { workplaceId: loc.id, timezone: loc.tz, contextOptions: { viewport: opts.viewport || { width: 1920, height: 1080 }, acceptDownloads: true, ...(opts.ctx || {}) } });
  await r.page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), loc.id);
  r.rule99 = await rule99(r.page, loc); return r;
}
export async function rule99(page, loc) {
  const b = await page.evaluate(() => ({ browser_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, browser_offset_min: -new Date().getTimezoneOffset(),
    app_timezone_key: localStorage.getItem('timezone'), app_location_key: localStorage.getItem('location'), at_utc: new Date().toISOString() }));
  const sys = JSON.parse(execFileSync('python3', ['-I', '-c', `import json,datetime as d;from zoneinfo import ZoneInfo as Z;n=d.datetime.now(Z('${loc.tz}'));print(json.dumps({'machine_offset_min':int(n.utcoffset().total_seconds()//60)}))`]).toString());
  const app_version = await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content).catch(() => null);
  return { location: loc.name, location_zone: loc.tz, session_change_location_zone: loc.tz, process_TZ: process.env.TZ, ...b, ...sys,
    offsets_agree: b.browser_offset_min === sys.machine_offset_min, all_zones_match: b.browser_zone === loc.tz && process.env.TZ === loc.tz && JSON.parse(b.app_timezone_key || 'null') === loc.tz, app_version };
}
export async function setTheme(page, theme) {
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1920, height: 1080 }); await sleep(800);
  await page.locator('header .short-text-content').first().click(); await sleep(1200);
  await page.locator('.q-menu').last().getByText(theme === 'dark' ? 'Dark' : 'Light', { exact: true }).click(); await sleep(1500);
  await page.keyboard.press('Escape'); await sleep(600); await page.setViewportSize(vp); await sleep(800);
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}
export function save(file, obj) { fs.mkdirSync(file.replace(/\/[^/]+$/, ''), { recursive: true }); fs.writeFileSync(file, JSON.stringify(obj, null, 1)); }
