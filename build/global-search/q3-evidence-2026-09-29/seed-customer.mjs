// Q3 asks whether a customer is findable by ITS OWN telephone. Existing records cannot answer it
// cleanly: 7 Star Truck Repair's number is found, but the row calls it a "Contact match", and its
// one contact carries different numbers - so something is mislabelled and the premise is unclear.
// A customer created HERE, with a unique number and NO contacts at all, removes the ambiguity.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:13000 });
try {
  await page.setViewportSize({width:1440,height:900});
  const btn = page.getByRole('button',{name:/New Customer|Add Customer/i}).first();
  await btn.click(); await page.waitForTimeout(3000);
  const fields = await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input, .q-dialog textarea')]
    .map((e,i)=>({i, label:(e.closest('.q-field')?.innerText||'').replace(/\s+/g,' ').trim().slice(0,38), type:e.type})));
  console.log('FIELDS:', JSON.stringify(fields, null, 0));
  const btns = await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>b.innerText.replace(/\s+/g,' ').trim()));
  console.log('BUTTONS:', JSON.stringify(btns));
} finally { await browser.close(); }
