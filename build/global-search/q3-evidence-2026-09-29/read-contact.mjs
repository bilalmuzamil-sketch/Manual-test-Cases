// What phone number does 7 Star Truck Repair's single contact carry? The whole of Q3 turns on
// whether the customer was findable by ITS OWN number or only because a contact shares it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const C='b3406baf-3b85-424a-a2c8-c3ed5f4da4b0';
const { page, browser } = await boot(`/customers/${C}/contacts`, { key:'admin', settle:13000 });
try {
  await page.setViewportSize({width:1440,height:900});
  const rows = await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
    .map(r=>[...r.querySelectorAll('td')].map(c=>c.innerText.replace(/\s+/g,' ').trim())));
  const hdr = await page.evaluate(()=>[...document.querySelectorAll('thead th')]
    .map(c=>c.innerText.replace(/\s+/g,' ').replace(/arrow_drop_(up|down)/g,'').trim()));
  console.log('HEADERS:', JSON.stringify(hdr));
  console.log('CONTACTS:', JSON.stringify(rows));
} finally { await browser.close(); }
