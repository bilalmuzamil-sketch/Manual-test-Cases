// observe_customer_card.mjs — C45190 / C44923 / C45191, all customer-card observations.
//
// Reuses boot8218.mjs (Rule 27). Every read waits for a KNOWN ANCHOR first, because a read taken
// before the card mounts reports "absent" for a field that is plainly there — the exact mistake
// that produced a false Contact=false/Phone=false/Authorizer=false result on 2026-08-31.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });

const TARGETS = [
  { key: 'workOrder',         label: 'normal work order',   url: `/workorders/${process.env.WO}` },
  { key: 'importedWorkOrder', label: 'imported work order', url: `/imported-work-orders/${process.env.IMP}` },
  { key: 'partSale',          label: 'parts sale',          url: `/parts/part-sale/${process.env.PS}` },
];

// read the card only once an anchor proves it has mounted
async function readCard(page) {
  // A weak anchor is worse than none: the first run read 148/282/429 body chars and reported every
  // field absent on pages that plainly have them. Require REAL CONTENT plus the card's own DOM,
  // and treat a miss as "my check did not fire", never as "the field is absent" (skill 03 s8.0-a).
  const anchored = await page.waitForFunction(() => {
    const t = document.body?.innerText || '';
    if (t.length < 1200) return false;
    return document.querySelectorAll('.static-field__label').length >= 2;
  }, { timeout: 45000 }).then(() => true).catch(() => false);
  await page.waitForTimeout(3000);
  return await page.evaluate((ok) => {
    const t = document.body?.innerText || '';
    const q = s => !!document.querySelector(s);
    const labels = [...document.querySelectorAll('.static-field__label')].map(e => e.textContent.trim());
    return {
      anchorFired: ok,
      bodyChars: t.length,
      url: location.pathname,
      staticLabels: labels,
      hasContactLabel: labels.includes('Contact'),
      hasPhoneLabel: labels.includes('Phone'),
      hasAuthorizerLabel: labels.some(l => /authorizer/i.test(l)),
      authorizerReadonly: q('[data-test-id="authorizer_readonly"]'),
      authorizerPhone: q('[data-test-id="authorizer_phone"]'),
      // the editable control: a select whose label mentions Authorizer
      authorizerSelect: [...document.querySelectorAll('.q-field, .q-select')]
        .some(e => /authorizer/i.test(e.textContent || '') && e.classList.contains('q-select')),
      changeCustomer: /Change Customer/i.test(t),
      cardText: t.slice(0, 900),
    };
  }, anchored);
}

const { browser, page, errs } = await boot('/workorders');
const results = {};
for (const tgt of TARGETS) {
  let r = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.goto(APP + tgt.url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
    r = await readCard(page);
    if (r.anchorFired && !/^\/$|\/login/.test(r.url)) break;
    console.log(`  (attempt ${attempt} did not settle: anchor=${r.anchorFired} url=${r.url} chars=${r.bodyChars}) - retrying`);
    await page.waitForTimeout(4000);
  }
  results[tgt.key] = { ...tgt, ...r };
  await page.screenshot({ path: `${OUT}/evidence/card-${tgt.key}.png`, fullPage: false });
  console.log(`\n=== ${tgt.label} (${tgt.url})`);
  console.log('  anchor fired      :', r.anchorFired, '| body chars', r.bodyChars, '| landed', r.url);
  console.log('  static labels     :', JSON.stringify(r.staticLabels));
  console.log('  Contact / Phone   :', r.hasContactLabel, '/', r.hasPhoneLabel);
  console.log('  Authorizer label  :', r.hasAuthorizerLabel, '| select', r.authorizerSelect, '| readonly', r.authorizerReadonly);
  console.log('  Change Customer   :', r.changeCustomer);
}
fs.writeFileSync(`${OUT}/evidence/customer-card-observations.json`, JSON.stringify({ results, pageErrors: errs }, null, 1));
await browser.close();
