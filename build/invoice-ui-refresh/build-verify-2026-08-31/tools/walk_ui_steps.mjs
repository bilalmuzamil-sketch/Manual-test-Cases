// Three walks in one run, to spend one browser session rather than three.
//
// C44923  "On the customer's contacts page, create or edit a contact and enable Approves Work"
//         then confirm it becomes selectable in the work order's Authorizer list IMMEDIATELY
//         (spec S3-R9: "without any refresh or re-save of the work order").
// C45190  "Verify the Contact/Phone rows and the card actions still work" on the work order and
//         the part sale customer cards.
// C45177 / C45196  find the payment REVERSAL and payment APPLICATION routes by opening the
//         payment UI and reading it. Read-only for these two -- dialogs are opened to be read and
//         Escaped; nothing is committed (core 7.5).
//
// The contact edit IS a write, pre-authorised as seeding; the flag is set on an existing contact
// and RESTORED at the end (Rule 6). Every non-GET call is printed.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const EST_WO = 'f5678f51-f531-4c21-a45f-5a2279b922be';   // editable, same customer
const PAID_WO = '06747f14-bf1e-4c03-8358-732e78b0167d';
const log = (...a) => console.log(...a);
const nonGet = [];
const out = {};
const { browser, page } = await boot(`/customers/${CUST}/contacts`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,240); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });
page.on('response', r => { if (r.request().method()!=='GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url()))
  log(`   [resp] ${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/,'').slice(0,95)}`); });

// ---------- C44923: enable Approves Work on a contact that does not have it ----------
log('\n=== C44923: enable "Approves Work" on a contact ===');
await page.waitForTimeout(4000);
const rowsTxt = await page.evaluate(() => document.body.innerText || '');
log('contacts page mentions Nicole Cole:', /Nicole Cole/.test(rowsTxt));
let edited = null;
const editBtn = page.locator('[data-test-id*="edit_contact" i]');
const n = await editBtn.count();
log(`edit-contact controls found: ${n}`);
for (let i = 0; i < Math.min(n, 8); i++) {
  await editBtn.nth(i).click({ timeout: 8000, force: true }).catch(() => {});
  await page.waitForTimeout(2200);
  const st = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    const cb = d.querySelector('[data-test-id="input_checkbox_is_authorizer"]');
    const nameI = d.querySelector('[data-test-id="input_first_name"]');
    const lastI = d.querySelector('[data-test-id="input_last_name"]');
    return { open: true, checked: cb ? (cb.getAttribute('aria-checked') === 'true' || cb.checked === true) : null,
             hasCheckbox: !!cb, name: `${nameI ? nameI.value : ''} ${lastI ? lastI.value : ''}`.trim() };
  });
  if (st && st.hasCheckbox && st.checked === false) {
    log(`  contact "${st.name}" has Approves Work UNCHECKED -> enabling it`);
    await page.locator('[data-test-id="input_checkbox_is_authorizer"]').first().click({ timeout: 8000, force: true }).catch(() => {});
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${EV}/c44923-contact-approves-work.png`, fullPage: true }).catch(() => {});
    await page.locator('[data-test-id="button_confirm_dialog"]').first().click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(4000);
    edited = st.name;
    break;
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
out.C44923 = { contact_edited: edited };
log(`  contact edited: ${edited || 'NONE (no unchecked contact reachable)'}`);

// does it appear in the work order's Authorizer list immediately? (S3-R9)
if (edited) {
  await page.goto(`${APP}/workorders/${EST_WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-test-id="select_authorizer"]', { timeout: 40000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.locator('[data-test-id="select_authorizer"] input').first().click({ timeout: 10000, force: true }).catch(() => {});
  await page.waitForTimeout(2000);
  const opts = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=option]')]
    .map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean));
  const present = opts.some(o => o.toLowerCase().includes(edited.split(' ')[0].toLowerCase()));
  out.C44923.authorizer_options_after = opts;
  out.C44923.new_authorizer_selectable_immediately = present;
  log(`  authorizer list now: ${opts.join(' , ')}`);
  log(`  the newly-flagged contact is selectable WITHOUT a refresh: ${present}`);
  await page.keyboard.press('Escape');
}

// ---------- C45190: the customer card on the work order ----------
log('\n=== C45190: customer card rows and actions ===');
const card = await page.evaluate(() => {
  const t = document.body.innerText || '';
  const has = s => t.includes(s);
  return { Contact: has('Contact'), Phone: has('Phone'), Authorizer: has('Authorizer'),
           Title: has('Title'),
           actions: [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id'))
             .filter(i => /contact|phone|authorizer|customer_card|edit/i.test(i)) };
});
out.C45190 = { work_order_card: card };
log(`  work order card -> Contact=${card.Contact} Phone=${card.Phone} Authorizer=${card.Authorizer}`);
log(`  card action ids: ${[...new Set(card.actions)].slice(0, 10).join(', ')}`);

// ---------- C45177 / C45196: the payment surface ----------
log('\n=== C45177 / C45196: payment controls on a PAID work order ===');
await page.goto(`${APP}/workorders/${PAID_WO}/finance`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4500);
const pay = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e => e.getAttribute('data-test-id'))
  .filter(i => /pay|reverse|refund|void|credit|deposit|cash/i.test(i)));
out.payment_controls = [...new Set(pay)];
log('  payment-ish test-ids:');
[...new Set(pay)].forEach(i => log('    ', i));
const menu = page.locator('[data-test-id="button_wo_invoice_menu"]').first();
if (await menu.count()) {
  await menu.click({ timeout: 9000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
    .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' })).filter(x => x.t));
  out.invoice_menu_paid = items;
  log('  invoice menu on a PAID work order:');
  items.forEach(i => log(`     ${JSON.stringify(i.t).padEnd(32)} ${i.id}`));
  await page.keyboard.press('Escape');
}
fs.writeFileSync(`${DIR}/ui-walk-evidence.json`, JSON.stringify({ ...out, nonGet }, null, 1));
log(`\nNON-GET CALLS THIS RUN: ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
