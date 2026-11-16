// Read-only: open Administration -> Settings at US Location, list its tiles/links, screenshot. SECRET-FREE.
import fs from 'fs';
import { start, zones, APP, OUT } from './common.mjs';
const WP = '41369a91-00f8-4cef-95e3-cd0fe3cdaea3';
const { browser, page } = await start({ workplaceId: WP, timezone: 'America/Denver' });
await page.goto(APP + '/administration/settings', { waitUntil: 'domcontentloaded', timeout: 60000 });

await page.waitForTimeout(7000);
fs.mkdirSync(OUT + '/evidence/settings', { recursive: true });
await page.screenshot({ path: OUT + '/evidence/settings/00-settings-home.png', fullPage: true });
const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ t: a.innerText.trim().replace(/\s+/g, ' ').slice(0, 80), h: a.getAttribute('href') })).filter(x => x.h && x.h.startsWith('/')));
const txt = (await page.locator('main, .q-page, body').first().innerText()).replace(/\n+/g, ' | ');
console.log(page.url(), 'HEADER', await (await import('./common.mjs')).headerLocation(page)); console.log(JSON.stringify(await zones(page, 'America/Denver')));
console.log(txt.slice(0, 3000));
console.log(JSON.stringify(links.filter(l => /admin|setting/.test(l.h))));
await browser.close();
