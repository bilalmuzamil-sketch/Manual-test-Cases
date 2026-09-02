// Let the SPA BOOT. Previous attempts parked the page on /login and then called APIs with fetch(),
// which is driving the app over raw HTTP - it never boots, so nothing hydrates. (QA lead, 2026-09-02:
// "Your framing is the problem, not the build.")
//
// Reuses the proven driver's two non-obvious requirements:
//   * chromium cannot TLS through the egress proxy, so it needs a LOCAL BRIDGE, FRESH PER RUN
//   * playwright is imported by absolute path, not bare 'playwright'
// And one safety rule from the QA lead: a "session expired" reply hands back a DEAD PHPSESSID that
// 409s for ever. Persist that and you are latched into permanent logout. So this script NEVER writes
// back to /tmp/qa-cookies/sv9315-cookies.json; it only reports what it saw.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const APP = 'https://sv9315.qa.shopview.com';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cookies = JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json', 'utf8'));
const OUT = 'build/probe-2026-09-02/boot';

const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 1100 } });

// cookies FIRST, on both hosts, before any navigation
const spread = [];
for (const c of cookies) for (const domain of ['.qa.shopview.com', 'sv9315.qa.shopview.com', 'sv9315api.qa.shopview.com'])
  spread.push({ name: c.name, value: c.value, domain, path: '/' });
await ctx.addCookies(spread);
console.log(`cookies seeded: ${spread.length} entries (${cookies.length} values x 3 hosts) BEFORE first navigation`);

const page = await ctx.newPage();
page.setDefaultTimeout(60000);
const calls = [];
page.on('response', r => { const u = r.url(); if (/shopview\.com\/api\//.test(u)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(/https:\/\/[^/]+/, '')}`); });

// navigate to the ROOT and let the app start normally
await page.goto(APP + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
console.log('after boot, url =', page.url().replace(APP, '') || '/');
console.log('storage now  =', JSON.stringify(await page.evaluate(() => ({
  local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))));
console.log('api calls the app made on boot:');
[...new Set(calls)].forEach(c => console.log('   ' + c));

// what CONTROLS does this page actually offer? (text alone hid this before)
const controls = await page.evaluate(() => [...document.querySelectorAll('button, a, [role="button"], .q-btn')]
  .map(el => {
    const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
    return { tag: el.tagName, text: (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
             href: el.getAttribute('href') || null, cls: (el.className || '').toString().slice(0, 50) };
  }).filter(x => x.text || x.href));
console.log('\ncontrols on the page (' + controls.length + '):');
controls.forEach(c => console.log(`   [${c.tag}] ${JSON.stringify(c.text)} href=${c.href}`));

await page.screenshot({ path: `${OUT}/after-boot.png`, fullPage: true });
fs.writeFileSync(`${OUT}/boot-report.json`, JSON.stringify({
  url: page.url(), calls: [...new Set(calls)], controls,
  storage: await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })),
}, null, 1));
console.log('\nscreenshot -> ' + OUT + '/after-boot.png');
await browser.close();
