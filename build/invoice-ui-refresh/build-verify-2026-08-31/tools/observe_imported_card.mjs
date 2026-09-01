// observe_imported_card.mjs — the IMPORTED work order surface for C45190.
//
// A direct page load of /imported-work-orders/{id} bounces to "/": the route guard is
// `requiredCheck: () => featureFlags().WorkOrders` and on a cold reload it runs before the flag
// store has loaded. That is a harness problem, NOT a missing screen - so navigate the way a tester
// does instead: Work Orders list -> the "Imported" status chip -> click the row (skill 18).
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const NUM = process.env.NUM || 'ZZAUTOTEST-IMP-001';
const log = []; const L = (...a) => { const s = a.join(' '); console.log(s); log.push(s); };

const read = (page) => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const selects = [...document.querySelectorAll('.q-select')]
    .map(e => (e.querySelector('.q-field__label')?.textContent || '').trim());
  const statics = [...document.querySelectorAll('.static-field__label')].map(e => e.textContent.trim());
  return {
    url: location.pathname, bodyChars: t.length, statics, selects,
    contact:    statics.includes('Contact') || selects.some(l => /contact/i.test(l)),
    phone:      statics.includes('Phone')   || selects.some(l => /phone/i.test(l)),
    authorizer: statics.some(l => /authoriz/i.test(l)) || selects.some(l => /authoriz/i.test(l)),
    authorizerReadonlyEl: !!document.querySelector('[data-test-id="authorizer_readonly"]'),
    changeCustomer: /Change Customer/i.test(t),
    snippet: t.replace(/\s+/g, ' ').slice(0, 800),
  };
});

const { browser, page } = await boot('/workorders');
await page.waitForFunction(() => (document.body?.innerText || '').length > 1500, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);
L('work orders list landed:', page.url(), '| chars', (await page.evaluate(() => document.body.innerText.length)));

// click the Imported status chip / option
const chip = await page.evaluate(() => {
  const cands = [...document.querySelectorAll('button, .q-chip, .q-btn, [role="button"]')];
  const c = cands.find(e => /^\s*imported\s*$/i.test((e.innerText || '').trim()));
  if (c) { c.click(); return { via: 'direct chip', text: c.innerText.trim() }; }
  const status = cands.find(e => /status/i.test((e.innerText || '').trim()));
  if (status) { status.click(); return { via: 'status chip opened' }; }
  return { via: null, sample: cands.slice(0, 14).map(e => (e.innerText || '').trim().slice(0, 24)).filter(Boolean) };
});
L('status/Imported chip:', JSON.stringify(chip));
await page.waitForTimeout(2500);
const opt = await page.evaluate(() => {
  const it = [...document.querySelectorAll('.q-menu .q-item, .q-menu [role="option"], .q-item')]
    .find(e => /^\s*imported\s*$/i.test((e.innerText || '').trim()));
  if (it) { it.click(); return true; }
  return false;
});
L('Imported option clicked:', opt);
await page.waitForTimeout(4000);
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/evidence/imported-list.png` });

const rowClicked = await page.evaluate((num) => {
  const rows = [...document.querySelectorAll('tr')];
  const r = rows.find(x => (x.innerText || '').includes(num));
  if (!r) return { found: false, rows: rows.length,
                   sample: rows.slice(0, 8).map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 60)) };
  r.click(); return { found: true, text: (r.innerText || '').replace(/\s+/g, ' ').slice(0, 120) };
}, NUM);
L('imported row:', JSON.stringify(rowClicked));
await page.waitForTimeout(6000);
const r = await read(page);
L('IMPORTED CARD:');
L('  landed', r.url, '| chars', r.bodyChars);
L('  statics :', JSON.stringify(r.statics));
L('  selects :', JSON.stringify(r.selects));
L('  Contact:', r.contact, '| Phone:', r.phone, '| AUTHORIZER:', r.authorizer,
  '| readonly element:', r.authorizerReadonlyEl, '| Change Customer:', r.changeCustomer);
L('  snippet:', r.snippet.slice(0, 400));
await page.screenshot({ path: `${OUT}/evidence/card-imported.png` });
fs.writeFileSync(`${OUT}/evidence/imported-card.json`, JSON.stringify({ chip, opt, rowClicked, card: r }, null, 1));
fs.writeFileSync(`${OUT}/evidence/imported-card.log`, log.join('\n') + '\n');
await browser.close();
