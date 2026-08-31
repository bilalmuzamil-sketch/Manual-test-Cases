// CONTACT RECORD, round 2. Round 1 proved the ROUTE is right -- /customers/{id}/contacts renders
// the customer shell with its Contacts / Assets / Work Orders / Part Sales tabs -- but the id I
// had extracted from the work-order payload was wrong ("Failed to load customer data"). So this
// run does not guess an id: it CLICKS A CUSTOMER ROW and reads the id the app itself navigates to.
// Every real endpoint on this project came from watching the app's own traffic; a guessed id or
// route has 404'd every time.
// Read-only.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const log = (...a) => console.log(...a);
const out = {};

const { browser, page } = await boot('/customers');
await page.waitForTimeout(4000);

async function snap(name) {
  await page.waitForTimeout(2500);
  const text = await page.evaluate(() => document.body?.innerText || '');
  const controls = await page.evaluate(() => {
    const seen = new Set(), o = [];
    for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,.q-item,label,input,[role=switch],[role=checkbox],[role=tab],.q-checkbox,.q-toggle,th,td')) {
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
  log(`  ${name.padEnd(28)} ${String(text.length).padStart(6)} chars  ${controls.length} controls  ${page.url().replace(APP, '')}`);
}

// click a customer row and let the app tell us the id. Prefer one WITH assets (more likely to
// have contacts on file) -- 'Aagate Landscaping' showed 17.
let clicked = false;
for (const name of ['Aagate Landscaping', 'Aacrest Works', 'Aadale Motors']) {
  const row = page.getByText(name, { exact: true }).first();
  if (await row.count()) {
    await row.click({ timeout: 8000, force: true }).catch(() => {});
    await page.waitForTimeout(4000);
    if (/\/customers\/[0-9a-f-]{8,}/.test(page.url())) { log(`clicked ${name} -> ${page.url().replace(APP, '')}`); clicked = true; break; }
  }
}
if (!clicked) log('could not navigate into a customer by clicking a row');
await snap('customer-page');

const m = page.url().match(/\/customers\/([0-9a-f-]{8,})/);
const cid = m ? m[1] : null;
log('customer id the app used:', cid);

if (cid) {
  await page.goto(`${APP}/customers/${cid}/contacts`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await snap('customer-contacts');
  // open a contact to read its form -- this is where "Approves Work" should be
  for (const sel of ['[data-test-id*="edit_contact" i]', '[data-test-id*="contact" i][data-test-id*="edit" i]',
                     '[data-test-id*="add_contact" i]', '[data-test-id*="new_contact" i]', 'tbody tr']) {
    const l = page.locator(sel).first();
    if (await l.count()) {
      log(`\nopening the contact form via ${sel}`);
      await l.click({ timeout: 8000, force: true }).catch(() => {});
      await page.waitForTimeout(3500);
      await snap('contact-form');
      const chk = await page.evaluate(() => [...document.querySelectorAll('.q-dialog label,.q-dialog .q-checkbox,.q-dialog .q-toggle,.q-dialog [role=checkbox],.q-dialog [data-test-id]')]
        .map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
        .filter(x => (x.t && x.t.length < 70) || x.id));
      out['contact-form-fields'] = { fields: chk };
      log(`  contact-form fields: ${chk.length}`);
      chk.slice(0, 40).forEach(c => log(`     - ${JSON.stringify(c.t).slice(0, 46).padEnd(48)} ${c.id}`));
      break;
    }
  }
}

fs.writeFileSync(`${DIR}/surfaces-contact2.json`, JSON.stringify(out, null, 1));
const corpus = Object.values(out).map(s => (s.text || '') + ' ' +
  ((s.controls || []).concat(s.fields || []).map(c => c.t + ' ' + c.id).join(' '))).join('\n');
log('\n---- LABEL CHECK on the contact surfaces ----');
for (const l of ['Approves Work', 'is_authorizer', 'Authorizer', 'Approval Code']) {
  log(`   ${l.padEnd(16)} ${corpus.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
}
log(`   ${'zz-9f3a'.padEnd(16)} ${corpus.includes('zz-9f3a') ? 'FOUND (BAD)' : 'absent (control OK)'}`);
await browser.close();
