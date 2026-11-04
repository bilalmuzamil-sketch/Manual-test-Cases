// Fresh browser (no saved report_table:inventory-value) → Inventory Value first visit; records header boxes. SECRET-FREE.
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import fs from 'fs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/filed-2026-10-28/pictures';
const W = '39522bc6-abca-4f67-bd12-2840043c2d68';
const { browser, page } = await boot2('admin', { workplaceId: W, timezone: 'America/Toronto' });
await page.setViewportSize({ width: 2300, height: 900 });
await page.evaluate(w => { localStorage.setItem('location', JSON.stringify(w)); }, W);
const saved = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('report_table')));
const btz = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
await page.goto('https://app.staging.shopview.com/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('thead th', { timeout: 60000 }); await page.waitForTimeout(4000);
const ver = await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content);
const heads = await page.$$eval('thead th', ths => ths.map(t => { const r = t.getBoundingClientRect(); return { text: t.innerText.trim(), x: r.x, y: r.y, w: r.width, h: r.height }; }).filter(h => h.w > 0));
await page.screenshot({ path: `${OUT}/IV-1-first-visit-columns.png` });
fs.writeFileSync(`${OUT}/IV-1-boxes.json`, JSON.stringify({ ver, browserTz: btz, savedBefore: saved, url: page.url(), at: new Date().toISOString(), heads }, null, 1));
console.log(ver, 'savedBefore', saved, heads.map(h => h.text).join(' | '));
await browser.close();
