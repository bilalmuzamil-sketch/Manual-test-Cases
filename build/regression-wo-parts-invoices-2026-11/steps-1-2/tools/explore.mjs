// Exploration helper: open a route at the test location, list visible test-ids/buttons and API calls. Read-only unless a click script is passed. SECRET-FREE.
import fs from 'fs';
import { start, APP, LOC } from './common.mjs';
const [route, shot, ...clicks] = process.argv.slice(2);
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const reqs = []; page.on('request', r => { if (/api\.staging/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace('https://api.staging.shopview.com', '') + (r.method() !== 'GET' ? ' ' + (r.postData() || '').slice(0, 300) : '')); });
await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(6000);
for (const c of clicks) {
  reqs.push('--- click ' + c);
  const [kind, val] = c.split('=');
  const loc = kind === 'tid' ? page.locator(`[data-test-id="${val}"]`).first() : kind === 'text' ? page.getByText(val, { exact: true }).first() : page.locator(val).first();
  await loc.scrollIntoViewIfNeeded().catch(() => {}); await loc.click({ force: true, timeout: 10000 }).catch(e => reqs.push('CLICKFAIL ' + e.message.slice(0, 100)));
  await page.waitForTimeout(3000);
}
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(e => e.getAttribute('data-test-id') + (e.innerText ? '«' + e.innerText.replace(/\s+/g, ' ').trim().slice(0, 40) + '»' : '')));
await page.screenshot({ path: '/tmp/cln/rgwo/' + (shot || 'explore') + '.png' });
console.log('URL', page.url()); console.log('IDS', [...new Set(ids)].join(' | ').slice(0, 4000)); console.log(reqs.filter(r => !/notifications|intercom|feature/.test(r)).join('\n').slice(0, 3000));
await browser.close();
