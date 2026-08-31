// Live scan of the 118 Inline Add and Edit Parts cases: per-field render container
// (markdown fr-view => renders, plain markdown => ESCAPING) + custom_atmstatus.
// Logs in through the local MITM bridge (chromium cannot TLS through the egress proxy).
// Usage: node scan.mjs <out.json>
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/inline-add-edit-parts/render-repair-2026-08-31';
const OUT = process.argv[2] || `${DIR}/scan-1.json`;
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const ids = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks.json`, 'utf8'));
const cids = Object.keys(ids).sort((a, b) => +a - +b);
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;

async function api(path, tries = 4) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(`${API}/${path}`, { headers: { Authorization: AUTH, 'Content-Type': 'application/json' } });
      const b = await r.json().catch(() => null);
      if (r.status === 429) { await new Promise(s => setTimeout(s, 5000)); continue; }
      return [r.status, b];
    } catch (e) { await new Promise(s => setTimeout(s, 3000 * (t + 1))); }
  }
  return [0, null];
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors', '--disable-background-networking', '--disable-component-update', '--no-first-run', '--no-default-browser-check'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email);
await page.fill('#password', UI.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }
log('login ok');

async function readView(cid) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  return await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    const out = { _count: ds.length };
    ['custom_preconds', 'custom_steps', 'custom_expected'].forEach((f, i) => {
      if (ds[i]) out[f] = { cls: ds[i].className.trim(), text: ds[i].innerText };
    });
    return out;
  });
}

const results = {};
let i = 0;
for (const cid of cids) {
  i++;
  const [st, live] = await api(`get_case/${cid}`);
  const atm = st === 200 ? live.custom_atmstatus : null;
  const title = st === 200 ? live.title : null;
  let view;
  try { view = await readView(cid); } catch (e) { view = { error: String(e).slice(0, 120) }; }
  const perField = {};
  for (const f of ['custom_preconds', 'custom_steps', 'custom_expected']) {
    const v = view[f];
    if (!v) { perField[f] = { present: false }; continue; }
    const frview = /\bfr-view\b/.test(v.cls);
    perField[f] = { cls: v.cls, frview, literal: LITERAL.test(v.text) };
  }
  const anyEscaping = Object.values(perField).some(f => f.present !== false && !f.frview);
  results[cid] = { title, atm, count: view._count, fields: perField, anyEscaping };
  if (i % 10 === 0) log(`scanned ${i}/${cids.length}`);
}
fs.writeFileSync(OUT, JSON.stringify(results, null, 1));

// summary
const esc = cids.filter(c => results[c].anyEscaping);
const frAll = cids.filter(c => !results[c].anyEscaping && Object.values(results[c].fields).every(f => f.present === false || f.frview));
const autom = cids.filter(c => results[c].atm === 3);
log(`DONE ${cids.length} scanned -> escaping ${esc.length}, all-fr-view ${frAll.length}, atm=3 ${autom.length}`);
log('escaping cids:', esc.join(','));
log('atm=3 cids:', autom.join(','));
await browser.close();
