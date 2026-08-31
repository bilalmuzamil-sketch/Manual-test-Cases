// Find the REAL authorizer write route by watching the app perform it.
// The route C45169/C45170 name -- POST /api/work-orders/{wo}/authorizer -- 404s, as does
// /set-authorizer. Guessing is what fails on this API; the app knows the shape.
//
// Done on the EDITABLE estimate work order S8218-15017 (never on the captured baseline S2-15522),
// selecting a real authorizer from the picker. That is a write, which the QA lead pre-authorised
// for seeding on this disposable branch ("Always", 2026-08-31). Every non-GET call is printed.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const WO = 'e6a4c9d5-0000-0000-0000-000000000000';       // replaced below
const log = (...a) => console.log(...a);
const nonGet = [];

const COOK = fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim();
const wos = await (await fetch('https://sv8218api.qa.shopview.com/api/work-orders?limit=200', { headers: { Cookie: COOK } })).json();
function rows(o) { if (Array.isArray(o) && o[0] && typeof o[0] === 'object') return o; if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = rows(v); if (r) return r; } } return null; }
const list = rows(wos) || [];
const est = list.find(w => String(w.status).toLowerCase() === 'estimate');
log('editable work order:', est.number, est.id);

const { browser, page } = await boot(`/workorders/${est.id}/lines`);
page.on('request', r => {
  if (r.method() !== 'GET' && /\/api\//.test(r.url())) {
    const u = r.url().replace(/^https?:\/\/[^/]+/, '');
    let body = '';
    try { body = (r.postData() || '').slice(0, 300); } catch (_) {}
    nonGet.push(`${r.method()} ${u}  BODY=${body}`);
  }
});
page.on('response', async r => {
  if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) {
    log(`   [resp] ${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 110)}`);
  }
});

await page.waitForSelector('[data-test-id="select_authorizer"]', { timeout: 40000 }).catch(() => {});
await page.waitForTimeout(2500);
const inp = page.locator('[data-test-id="select_authorizer"] input').first();
await inp.click({ timeout: 10000, force: true }).catch(e => log('open failed:', String(e).slice(0, 80)));
await page.waitForTimeout(1800);
const opts = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=option]')]
  .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' })).filter(x => x.t));
log('picker options:', opts.map(o => `${o.t}[${o.id}]`).join(' , '));

// pick a REAL authorizer (not "No authorizer") so a write actually happens
const pick = opts.find(o => !/no authorizer/i.test(o.t));
if (pick) {
  log(`selecting ${JSON.stringify(pick.t)}`);
  await page.locator(`[data-test-id="${pick.id}"]`).first().click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(4500);
}

fs.writeFileSync(`${DIR}/authorizer-write-traffic.json`, JSON.stringify({ wo: est.number, wo_id: est.id, nonGet }, null, 1));
log(`\nNON-GET CALLS (the write route is in here): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
