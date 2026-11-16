import fs from 'fs';
import { start, call, APP, LOC } from './common.mjs';
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(6000);
console.log('HEADER', await page.evaluate(() => document.querySelector('header')?.innerText.replace(/\n+/g, ' | ').slice(-120)));
const out = {};
for (const p of ['/api/inventory/bin-locations', '/api/inventory/parts?pagination[rowsPerPage]=100', '/api/labour-types', '/api/workplaces/' + LOC.id]) { const r = await call(page, 'GET', p); out[p] = r; console.log(p, r.s, JSON.stringify(r.j).slice(0, 300)); }
await browser.close();
