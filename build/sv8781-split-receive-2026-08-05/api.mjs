// Run API calls through the authenticated browser page. Usage: node api.mjs '<json array of {m,p,b}>'
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
const APP = 'https://sv8781.qa.shopview.com', API = 'https://sv8781api.qa.shopview.com';
const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];

export async function open() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({ storageState: '/tmp/sv8781/state.json', viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
  const api = (m, p, b) => page.evaluate(async ({ API, m, p, b }) => {
    const r = await fetch(API + p, { method: m, credentials: 'include', headers: b ? { 'Content-Type': 'application/json' } : undefined, body: b ? JSON.stringify(b) : undefined });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
    return { status: r.status, json: j, text: t.slice(0, 600) };
  }, { API, m, p, b });
  return { browser, ctx, page, api, APP, API };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const calls = JSON.parse(process.argv[2]);
  const s = await open();
  for (const c of calls) {
    const r = await s.api(c.m || 'GET', c.p, c.b);
    console.log('\n=== ' + (c.m || 'GET') + ' ' + c.p + '  -> ' + r.status + ' ===');
    console.log(c.raw ? r.text : JSON.stringify(r.json).slice(0, c.n || 1200));
  }
  await s.browser.close();
}
