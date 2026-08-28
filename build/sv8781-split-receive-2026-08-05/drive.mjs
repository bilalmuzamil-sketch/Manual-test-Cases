// SV-8781 driver. Usage: node drive.mjs <path> [label]
// NEVER calls quick-login (see playbook §Q - it rotates PHPSESSID and kills the session).
// Reuses /tmp/sv8781/state.json when present so the session is touched as little as possible.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
const APP = 'https://sv8781.qa.shopview.com', API = 'https://sv8781api.qa.shopview.com';
const dest = process.argv[2] || '/workorders';
const label = process.argv[3] || 'shot';

const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];
const cookies = fs.readFileSync('/tmp/sv8781/cookies.txt', 'utf8').trim().split('\n').map(l => { const i = l.indexOf('='); return { name: l.slice(0, i), value: l.slice(i + 1), domain: '.qa.shopview.com', path: '/', secure: true }; });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
const failed = [];
page.on('response', r => { const u = r.url(); if (u.includes('/api/') && r.status() >= 400) failed.push(`${r.status()} ${u.replace(API, '').split('?')[0]}`); });

// establish the host-scoped cookie, then confirm the session from INSIDE the page
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3500);
const chk = await page.evaluate(async API => {
  const r = await fetch(API + '/api/auth/me/fe-permissions', { credentials: 'include' });
  return { s: r.status, b: await r.text() };
}, API);
if (chk.s !== 200) {
  console.log('!! SESSION NOT USABLE:', chk.s, chk.b.slice(0, 120));
  console.log('!! Need a fresh PHPSESSID. Do NOT call quick-login.');
  await browser.close(); process.exit(2);
}
const fe = JSON.parse(chk.b).data;
console.log('session OK - perms', fe.fe_permissions.length, 'role', fe.template_slug);

// hydrate localStorage so the SPA routes (no quick-login involved)
const me = await page.evaluate(async API => {
  for (const ep of ['/api/sso/check', '/api/staff/me', '/api/profile']) {
    const r = await fetch(API + ep, { credentials: 'include' });
    if (r.status === 200) { const j = await r.json().catch(() => null); if (j?.data) return { ep, data: j.data }; }
  }
  return null;
}, API);
console.log('user payload:', me ? me.ep : 'none found');
if (me) await page.evaluate(({ u, f }) => { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.token) localStorage.setItem('token', JSON.stringify(u.token)); }, { u: me.data, f: fe });

await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);
console.log('url  :', page.url());
console.log('title:', await page.title());
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')));
console.log('test-ids (' + ids.length + '):', ids.slice(0, 60).join(', '));
console.log('body :', (await page.locator('body').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400));
console.log('failed api:', failed.slice(0, 8).join(' | ') || '(none)');
await ctx.storageState({ path: '/tmp/sv8781/state.json' });
await page.screenshot({ path: `/tmp/sv8781/${label}.png`, fullPage: false });
console.log('shot -> /tmp/sv8781/' + label + '.png');
await browser.close();
