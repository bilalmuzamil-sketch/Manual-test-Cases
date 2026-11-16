import { start, APP, US } from './common.mjs';
const { browser, page } = await start({ workplaceId: US.id, timezone: US.tz });
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(6000);
const t = await page.evaluate(() => { const h = document.querySelector('header'); return h ? h.innerText.replace(/\n+/g, ' | ') : 'no header'; });
console.log(t.slice(0, 400));
const req = []; page.on('request', r => { if (/api\.staging/.test(r.url()) && r.method() !== 'GET') req.push(r.method() + ' ' + r.url()); });
await page.screenshot({ path: '/tmp/cln/rgwo/hdr.png' });
await browser.close();
