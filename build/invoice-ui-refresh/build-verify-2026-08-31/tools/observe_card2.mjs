// observe_card2.mjs — second pass on the customer card.
//
// The first pass anchored on ">=2 static-field labels", which is wrong for the IMPORTED card: it
// legitimately has fewer fields, so the anchor could not fire and the read looked "absent". Anchor
// on real page content instead, and capture the SELECT labels too - on an account that CAN edit,
// Contact and Authorizer render as q-selects, not as static fields, so a static-label-only reader
// under-reports them.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });

const TARGETS = [
  { key: 'workOrder',         label: 'normal work order',   url: `/workorders/${process.env.WO}` },
  { key: 'importedWorkOrder', label: 'imported work order', url: `/imported-work-orders/${process.env.IMP}` },
  { key: 'partSale',          label: 'parts sale',          url: `/parts/part-sale/${process.env.PS}` },
];

async function read(page) {
  const ok = await page.waitForFunction(
    () => (document.body?.innerText || '').length > 1200,
    { timeout: 60000 }).then(() => true).catch(() => false);
  await page.waitForTimeout(3500);
  return page.evaluate((anchorFired) => {
    const t = document.body?.innerText || '';
    const statics = [...document.querySelectorAll('.static-field__label')].map(e => e.textContent.trim());
    const selects = [...document.querySelectorAll('.q-select')].map(e => {
      const l = e.querySelector('.q-field__label');
      return { label: l ? l.textContent.trim() : '', text: (e.textContent || '').trim().slice(0, 80) };
    });
    const has = (arr, re) => arr.some(x => re.test(typeof x === 'string' ? x : x.label));
    return {
      anchorFired, bodyChars: t.length, url: location.pathname,
      statics, selects,
      contact:    { static: has(statics, /^Contact$/i),    select: has(selects, /contact/i) },
      phone:      { static: has(statics, /^Phone$/i) },
      authorizer: { static: has(statics, /authoriz/i),     select: has(selects, /authoriz/i),
                    readonlyEl: !!document.querySelector('[data-test-id="authorizer_readonly"]'),
                    phoneEl:    !!document.querySelector('[data-test-id="authorizer_phone"]') },
      changeCustomer: /Change Customer/i.test(t),
      snippet: t.slice(0, 700),
    };
  }, ok);
}

const { browser, page, errs } = await boot('/workorders');
const results = {};
for (const tgt of TARGETS) {
  let r = null;
  for (let a = 1; a <= 3; a++) {
    await page.goto(APP + tgt.url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
    r = await read(page);
    if (r.anchorFired && !/^\/$|\/login/.test(r.url)) break;
    console.log(`  (attempt ${a}: anchor=${r.anchorFired} url=${r.url} chars=${r.bodyChars}) retrying`);
    await page.waitForTimeout(4000);
  }
  results[tgt.key] = { ...tgt, ...r };
  await page.screenshot({ path: `${OUT}/evidence/card2-${tgt.key}.png` });
  console.log(`\n=== ${tgt.label}  ${tgt.url}`);
  console.log('  anchor', r.anchorFired, '| chars', r.bodyChars, '| landed', r.url);
  console.log('  static labels :', JSON.stringify(r.statics));
  console.log('  select labels :', JSON.stringify(r.selects.map(s => s.label)));
  console.log('  Contact       :', JSON.stringify(r.contact));
  console.log('  Phone(static) :', r.phone.static);
  console.log('  AUTHORIZER    :', JSON.stringify(r.authorizer));
  console.log('  Change Customer:', r.changeCustomer);
}
fs.writeFileSync(`${OUT}/evidence/customer-card-pass2.json`, JSON.stringify({ results, pageErrors: errs }, null, 1));
await browser.close();
