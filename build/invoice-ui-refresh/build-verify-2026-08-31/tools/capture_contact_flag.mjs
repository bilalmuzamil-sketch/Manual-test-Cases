// The LAST unseen authorizer surface: the CUSTOMER CONTACT RECORD, where the spec says
// "Approves Work" lives -- 'the existing checkbox on the contact record (the is_authorizer flag)'
// (requirements.md S3-R5 / S3-R9 / context note). Four of the five Automated cases depend on this
// one label, and it was reported "absent" only because nothing had ever opened this screen.
// Read-only: navigates, reads, screenshots. Opens an edit dialog to READ it and Escapes out.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const COOK = fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim();
const log = (...a) => console.log(...a);
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const out = {};

// which customer does our work order belong to? take it from the app's own payload,
// never from a guessed id.
const woView = await (await fetch(`https://sv8218api.qa.shopview.com/api/work-orders/view/${WO.id}`,
  { headers: { Cookie: COOK } })).json();
function findKey(o, re, depth = 0) {
  if (!o || typeof o !== 'object' || depth > 6) return null;
  for (const [k, v] of Object.entries(o)) {
    if (re.test(k) && (typeof v === 'string') && v.length > 20) return { k, v };
    const r = findKey(v, re, depth + 1);
    if (r) return r;
  }
  return null;
}
const cust = findKey(woView, /^customer_id$/i) || findKey(woView, /customer_id/i);
log('customer_id from the work order payload:', cust ? cust.v : 'NOT FOUND');

const { browser, page } = await boot('/customers');
async function snap(name) {
  await page.waitForTimeout(2500);
  const text = await page.evaluate(() => document.body?.innerText || '');
  const controls = await page.evaluate(() => {
    const seen = new Set(), o = [];
    for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,.q-item,label,input,[role=switch],[role=checkbox],[role=tab],.q-checkbox,.q-toggle')) {
      const t = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ');
      const id = el.getAttribute('data-test-id') || '';
      if ((!t && !id) || t.length > 90) continue;
      const k = t + '|' + id; if (seen.has(k)) continue; seen.add(k); o.push({ t, id });
    }
    return o;
  });
  out[name] = { url: page.url(), chars: text.length, text, controls };
  fs.writeFileSync(`${DIR}/surface-${name}.txt`, text);
  await page.screenshot({ path: `${EV}/surface-${name}.png`, fullPage: true }).catch(() => {});
  log(`  ${name.padEnd(28)} ${String(text.length).padStart(6)} chars  ${controls.length} controls`);
}

await snap('customers-list');

if (cust) {
  for (const route of [`/customers/${cust.v}/contacts`, `/customers/${cust.v}`]) {
    log(`\ntrying ${route}`);
    await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3500);
    await snap('customer' + route.split('/').pop().slice(0, 12));
    // open the first contact row / edit control, to READ the contact form
    for (const sel of ['[data-test-id*="contact" i][data-test-id*="edit" i]',
                       '[data-test-id*="edit_contact" i]', '[data-test-id*="contact_row" i]',
                       'tbody tr']) {
      const l = page.locator(sel).first();
      if (await l.count()) {
        log(`   opening a contact via ${sel}`);
        await l.click({ timeout: 8000, force: true }).catch(() => {});
        await page.waitForTimeout(3000);
        await snap('contact-form');
        break;
      }
    }
    const corpus = Object.values(out).map(s => (s.text || '') + ' ' + (s.controls || []).map(c => c.t + ' ' + c.id).join(' ')).join('\n');
    if (/approves work|is_authorizer/i.test(corpus)) { log('   >>> "Approves Work" FOUND — stopping here'); break; }
  }
}

fs.writeFileSync(`${DIR}/surfaces-contact.json`, JSON.stringify(out, null, 1));
const corpus = Object.values(out).map(s => (s.text || '') + ' ' + (s.controls || []).map(c => c.t + ' ' + c.id).join(' ')).join('\n');
log('\n---- LABEL CHECK on the contact surfaces ----');
for (const l of ['Approves Work', 'is_authorizer', 'Authorizer', 'Contact', 'Approval Code']) {
  log(`   ${l.padEnd(16)} ${corpus.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
}
log(`   ${'zz-9f3a'.padEnd(16)} ${corpus.includes('zz-9f3a') ? 'FOUND (BAD)' : 'absent (control OK)'}`);
await browser.close();
