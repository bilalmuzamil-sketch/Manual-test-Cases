// Capture the AUTHORIZER surface: the work-order customer contact card and the Authorizer picker.
//
// WHY: the 5 cases TestRail flags Automated (C44919-C44922, C44985) all turn on labels that live
// HERE, not on the rendered document -- 'Approves Work', 'No authorizer', the Authorizer row
// itself. The first surface capture took the work-order lines page, the finance tab, the invoice
// menu and the invoice settings dialog; it never opened the customer contact card, so those labels
// were reported "absent" when they had simply never been looked for. Searching one surface and
// concluding "absent" is a probe that cannot fire.
//
// READ-ONLY on the cases: this captures screens. It does not write to TestRail at all, so Rule 71
// is not engaged -- the QA lead authorised BUILD VERIFYING the Automated cases, which is reading.
// On the app it opens pickers to READ them and presses Escape; it commits nothing (core §7.5).
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const log = (...a) => console.log(...a);
const surfaces = {};

const { browser, page } = await boot('/workorders?tab=complete');

async function snap(name) {
  const text = await page.evaluate(() => document.body?.innerText || '');
  const controls = await page.evaluate(() => {
    const seen = new Set(), o = [];
    for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,.q-item,[role=menuitem],[role=tab],label,input,select,[role=switch],[role=option],.q-field__label,.q-item__label')) {
      const t = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ');
      const id = el.getAttribute('data-test-id') || '';
      if ((!t && !id) || t.length > 90) continue;
      const k = t + '|' + id;
      if (seen.has(k)) continue;
      seen.add(k); o.push({ t, id });
    }
    return o;
  });
  surfaces[name] = { url: page.url(), chars: text.length, text, controls };
  fs.writeFileSync(`${DIR}/surface-${name}.txt`, text);
  await page.screenshot({ path: `${EV}/surface-${name}.png`, fullPage: true }).catch(() => {});
  log(`  ${name.padEnd(30)} ${String(text.length).padStart(6)} chars  ${controls.length} controls`);
  return surfaces[name];
}

// 1 — the work order page, where the customer contact card lives
await page.goto(`${APP}/workorders/${WO.id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);
const s1 = await snap('wo-customer-card');

// find anything authorizer-ish, by test-id or by visible text
const found = await page.evaluate(() => {
  const hits = [];
  for (const el of document.querySelectorAll('*')) {
    const id = el.getAttribute && el.getAttribute('data-test-id');
    if (id && /authoriz|approv/i.test(id)) hits.push({ how: 'test-id', id, tag: el.tagName.toLowerCase() });
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = (n.textContent || '').trim();
    if (/authoriz|approves work|approval code/i.test(t) && t.length < 90) {
      const p = n.parentElement;
      hits.push({ how: 'text', text: t, id: (p && p.getAttribute('data-test-id')) || '', tag: p ? p.tagName.toLowerCase() : '' });
    }
  }
  return hits;
});
log(`\nauthorizer-ish hits on the work order page: ${found.length}`);
found.slice(0, 25).forEach(h => log(`   ${h.how.padEnd(8)} ${JSON.stringify(h.text || h.id).slice(0, 60).padEnd(62)} ${h.tag} ${h.id}`));
fs.writeFileSync(`${DIR}/authorizer-hits.json`, JSON.stringify(found, null, 1));

// 2 — open the Authorizer picker if it exists, and READ the options
let opened = false;
for (const sel of ['[data-test-id*="authorizer" i]', '[data-test-id*="approver" i]']) {
  const loc = page.locator(sel).first();
  if (await loc.count()) {
    log(`\nopening the authorizer control via ${sel}`);
    await loc.click({ timeout: 10000 }).catch(e => log('  click failed:', String(e).slice(0, 100)));
    await page.waitForTimeout(2200);
    const opts = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-menu .q-item__label')]
      .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
      .filter(x => x.t && x.t.length < 90));
    surfaces['authorizer-picker'] = { options: opts };
    log(`  picker options: ${opts.length}`);
    opts.slice(0, 30).forEach(o => log(`     - ${JSON.stringify(o.t).slice(0, 60)}  ${o.id}`));
    await page.screenshot({ path: `${EV}/surface-authorizer-picker.png`, fullPage: true }).catch(() => {});
    await snap('authorizer-picker-page');
    await page.keyboard.press('Escape');
    opened = true;
    break;
  }
}
if (!opened) log('\nno authorizer control found by test-id on this work order page');

// 3 — the customer tab, in case the card lives there instead
for (const tid of ['link_customer_tab', 'link_details_tab', 'tab_customer']) {
  const t = page.locator(`[data-test-id="${tid}"]`).first();
  if (await t.count()) {
    log(`\nopening ${tid}`);
    await t.click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await snap(`wo-${tid}`);
    break;
  }
}

fs.writeFileSync(`${DIR}/surfaces-authorizer.json`, JSON.stringify(surfaces, null, 1));
const corpus = Object.values(surfaces).map(s => (s.text || '') + ' ' +
  ((s.controls || []).concat(s.options || []).map(c => c.t + ' ' + c.id).join(' '))).join('\n');
log('\n---- LABEL CHECK against everything captured here ----');
for (const l of ['Authorizer', 'Approves Work', 'No authorizer', 'Approval Code', 'Contact', 'Phone']) {
  log(`   ${l.padEnd(16)} ${corpus.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
}
log(`   ${'zz-control-9f3a'.padEnd(16)} ${corpus.includes('zz-control-9f3a') ? 'FOUND (BAD)' : 'absent (control OK)'}`);
await browser.close();
