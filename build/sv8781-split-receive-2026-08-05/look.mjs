// Open a page with the live session, log API traffic + test-ids, screenshot.
// Usage: node look.mjs <path> <label>
import { open } from '/tmp/sv8781/api.mjs';
const dest = process.argv[2], label = process.argv[3] || 'shot';
const s = await open();
const calls = [];
s.page.on('response', r => { const u = r.url(); if (u.includes('/api/')) calls.push(`${r.status()} ${r.request().method()} ${u.split('sv8781api.qa.shopview.com')[1]?.split('?')[0]}`); });
await s.page.goto(s.APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 });
await s.page.waitForTimeout(12000);
console.log('url  :', s.page.url());
console.log('title:', await s.page.title());
console.log('\n--- API calls ---');
[...new Set(calls)].forEach(c => console.log('  ' + c));
const ids = await s.page.evaluate(() => [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')));
console.log('\n--- test-ids (' + ids.length + ' total, unique) ---');
console.log('  ' + [...new Set(ids)].join(', '));
console.log('\n--- visible text ---');
console.log((await s.page.locator('body').innerText().catch(() => '')).slice(0, 1800));
await s.page.screenshot({ path: `/tmp/sv8781/${label}.png`, fullPage: false });
console.log('\nshot -> /tmp/sv8781/' + label + '.png');
await s.browser.close();
