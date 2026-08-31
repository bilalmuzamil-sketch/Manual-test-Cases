// SEED AN UNPAID INVOICE so 'Due date' can be observed.
//
// WHY: spec S10-R4 -- a fully paid invoice shows "Paid date"; one that is NOT fully paid shows
// "Due date". Every invoice on sv8218 is PAID (proven: statuses are paid=90, approved=2,
// estimate=8, and approved/estimate work orders carry no invoice_id at all), so 'Due date' can
// never render on the data as it stands. C44963 needs it; C44962 quotes 'Receipt' and needs the
// same non-paid state to be checked properly.
//
// Seeding is pre-authorised on this disposable branch (QA lead, 2026-08-31: "Always"). This run
// READS the invoice action first and only commits with --commit, printing every non-GET call at
// exit so an unintended write is visible immediately (core 7.5). The captured baseline S2-15522 is
// never touched.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const COMMIT = process.argv.includes('--commit');
const COOK = fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim();
const log = (...a) => console.log(...a);
const nonGet = [];

const wos = await (await fetch('https://sv8218api.qa.shopview.com/api/work-orders?limit=200', { headers: { Cookie: COOK } })).json();
function rows(o) { if (Array.isArray(o) && o[0] && typeof o[0] === 'object') return o; if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = rows(v); if (r) return r; } } return null; }
const list = rows(wos) || [];
const cand = list.filter(w => String(w.status).toLowerCase() === 'approved');
log('approved work orders available:', cand.map(w => `${w.number}(${w.id.slice(0, 8)})`).join(' , ') || 'none');
if (!cand.length) { log('no approved work order to invoice — STOP'); process.exit(2); }
const wo = cand[0];
log(`target: ${wo.number}  status=${wo.status}  total=${wo.totalPrice ?? wo.total ?? '?'}`);

const { browser, page } = await boot(`/workorders/${wo.id}/lines`);
page.on('request', r => {
  if (r.method() !== 'GET' && /\/api\//.test(r.url())) {
    let b = ''; try { b = (r.postData() || '').slice(0, 260); } catch (_) {}
    nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}  BODY=${b}`);
  }
});
page.on('response', r => {
  if (r.request().method() !== 'GET' && /\/api\//.test(r.url()))
    log(`   [resp] ${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 100)}`);
});

await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 40000 }).catch(() => {});
await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 12000 }).catch(() => {});
await page.waitForTimeout(4000);
await page.screenshot({ path: `${EV}/seed-unpaid-finance.png`, fullPage: true }).catch(() => {});

// READ every control that could invoice this work order
const ctl = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],[data-test-id],.q-item')]
  .map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 44),
               id: e.getAttribute('data-test-id') || '' }))
  .filter(x => /invoice|finalize|finalise|complete|bill/i.test(x.t + x.id)));
log('\ninvoice-ish controls on the finance tab:');
[...new Map(ctl.map(c => [c.id + '|' + c.t, c])).values()].forEach(c => log(`   ${JSON.stringify(c.t).padEnd(30)} ${c.id}`));

// An APPROVED work order has no invoice menu -- it has a direct `button_create_invoice`
// ("Create Invoice") on the finance tab. That is the action, so use it rather than hunting a menu.
const create = page.locator('[data-test-id="button_create_invoice"]').first();
if (await create.count()) {
  if (!COMMIT) {
    log('\n--commit NOT passed. Nothing committed. Would press button_create_invoice ("Create Invoice").');
  } else {
    log('\ncommitting via button_create_invoice ("Create Invoice")');
    await create.click({ timeout: 12000 }).catch(e => log('click failed:', String(e).slice(0, 90)));
    await page.waitForTimeout(3000);
    const ok = page.locator('[data-test-id="button_confirm_dialog"]').first();
    if (await ok.count()) { log('confirm dialog present — accepting'); await ok.click({ timeout: 10000 }).catch(() => {}); }
    await page.waitForTimeout(6000);
    await page.screenshot({ path: `${EV}/seed-unpaid-after.png`, fullPage: true }).catch(() => {});
    log('url after:', page.url().replace(APP, ''));
    const after = await (await fetch(`https://sv8218api.qa.shopview.com/api/work-orders/view/${wo.id}`, { headers: { Cookie: COOK } })).text();
    const m = after.match(/"invoice_id"\s*:\s*"([0-9a-f-]{8,})"/);
    const st = after.match(/"status"\s*:\s*"([a-z_ ]+)"/i);
    log(`new invoice_id: ${m ? m[1] : 'NONE'}   work order status now: ${st ? st[1] : '?'}`);
    if (m) fs.writeFileSync(`${DIR}/seeded-unpaid-invoice.json`, JSON.stringify({ wo: wo.number, wo_id: wo.id, invoice_id: m[1] }, null, 1));
  }
}
const menu = page.locator('[data-test-id="button_wo_invoice_menu"]').first();
if (false && await menu.count()) {
  await menu.click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
    .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' })).filter(x => x.t));
  log('\ninvoice menu items:');
  items.forEach(i => log(`   ${JSON.stringify(i.t).padEnd(34)} ${i.id}`));
  fs.writeFileSync(`${DIR}/seed-unpaid-menu.json`, JSON.stringify({ wo: wo.number, items, controls: ctl }, null, 1));
  const inv = items.find(i => /^\s*(check\s+)?(create|generate|issue)?\s*invoice/i.test(i.t) || /menu_item_invoice/i.test(i.id));
  if (!COMMIT) {
    log(`\n--commit NOT passed. Nothing committed.`);
    log(`control that WOULD be used: ${inv ? JSON.stringify(inv) : 'NONE FOUND — needs a human read first'}`);
    await page.keyboard.press('Escape');
  } else if (!inv) {
    log('\n--commit passed but no recognisable invoice action — refusing to guess.');
    await page.keyboard.press('Escape');
  } else {
    log(`\ncommitting via ${JSON.stringify(inv)}`);
    await page.locator(`[data-test-id="${inv.id}"]`).first().click({ timeout: 12000 }).catch(e => log('click failed:', String(e).slice(0, 90)));
    await page.waitForTimeout(3000);
    // a confirm dialog may follow
    const ok = page.locator('[data-test-id="button_confirm_dialog"]').first();
    if (await ok.count()) { log('confirm dialog present — accepting'); await ok.click({ timeout: 10000 }).catch(() => {}); await page.waitForTimeout(5000); }
    await page.screenshot({ path: `${EV}/seed-unpaid-after.png`, fullPage: true }).catch(() => {});
    log('url after:', page.url().replace(APP, ''));
  }
}
fs.writeFileSync(`${DIR}/seed-unpaid-nonget.json`, JSON.stringify({ commit: COMMIT, wo: wo.number, wo_id: wo.id, nonGet }, null, 1));
log(`\nNON-GET CALLS THIS RUN (expect 0 without --commit): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
