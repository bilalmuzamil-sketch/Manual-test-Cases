// S2-925 carries a part awaiting receipt. Read its row exactly, then open Receive and read the modal.
// Serves C44583 (modal, no navigation), C44584 (vendor/invoice/date), C44568 (part states), C44569.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID='79476028-70b2-44c7-9e34-0eddc62c15af', TAG='C44583-S2-925';
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID);

// exact button texts, not a substring of "Work Order"
const exact = await page.evaluate(() => {
  const want = ['Order','Pick','Receive','Approve','Decline','Complete','Return'];
  const out = [];
  for (const b of document.querySelectorAll('button, .q-btn, [role=menuitem], .q-item')) {
    const t = (b.innerText||'').trim(); if (!want.includes(t)) continue;
    const r = b.getBoundingClientRect(); if (!r.width) continue;
    out.push({ t, disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test(b.className||'') });
  }
  return out;
});
console.log('EXACT action buttons:', JSON.stringify(exact));
// badges: short chips on the part rows
const badges = await page.evaluate(() => [...document.querySelectorAll('.q-badge, .q-chip, [class*=badge], [class*=chip], [class*=status]')]
  .map(e => (e.innerText||'').trim()).filter(t => t && t.length < 30));
console.log('BADGES:', JSON.stringify([...new Set(badges)]));
const urlBefore = page.url();
const rec = page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').first();
console.log('Receive buttons:', await page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').count());
await rec.click();
await page.waitForTimeout(6000);
const urlAfter = page.url();
console.log('URL before:', urlBefore); console.log('URL after :', urlAfter, '| navigated:', urlBefore !== urlAfter);
await page.screenshot({ path: `${EV}/${TAG}-receive-modal.png` });
const modal = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog'); if (!d) return null;
  return { text: (d.innerText||'').trim(),
    fields: [...d.querySelectorAll('input, textarea, select')].map(i => ({ label: (i.closest('.q-field')?.innerText||'').split('\n')[0], value: i.value, required: i.required || /required/i.test(i.closest('.q-field')?.className||'') })),
    buttons: [...d.querySelectorAll('button, .q-btn')].map(b => ({ t: (b.innerText||'').trim(), disabled: b.disabled===true||/disabled/.test(b.className||'') })).filter(b=>b.t) };
});
fs.writeFileSync(`${EV}/${TAG}-modal.json`, JSON.stringify({ urlBefore, urlAfter, exact, badges: [...new Set(badges)], modal }, null, 1));
if (modal) { console.log('=== MODAL TEXT ==='); console.log(modal.text.slice(0, 1600));
  console.log('FIELDS:', JSON.stringify(modal.fields, null, 1).slice(0, 1200));
  console.log('BUTTONS:', JSON.stringify(modal.buttons)); } else console.log('no modal opened');
await browser.close();
