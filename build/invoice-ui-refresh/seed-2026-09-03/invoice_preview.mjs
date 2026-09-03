// C44970 line 1 (does the printed document carry a disclaimer?) was NOT VERIFIED on 2026-09-02 because
// the CONTROL failed: rendering the same shop's ordinary invoice, to see whether the shop configures a
// disclaimer at all. The route turned up on the part sale's "Finance" tab:
//     GET /api/invoices/preview?invoice_id=<id>&type=html&isEstimate=0&includeDeclined=0&historyEvent=
// Fetch the ordinary invoice's own HTML and search it for disclaimer wording.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const INV = process.env.INV || 'b3bae655-22c0-4fa1-95b6-049e777b2647';
const { browser, page, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(6000);
const got = await page.evaluate(async ([h,inv]) => {
  const r = await fetch(`https://${h}/api/invoices/preview?invoice_id=${inv}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`, {credentials:'include'});
  const t = await r.text();
  return { status:r.status, type:r.headers.get('content-type'), len:t.length, body:t };
}, [APIH, INV]);
console.log('preview ->', got.status, got.type, got.len, 'bytes');
fs.writeFileSync(`${OUT}/invoice-preview.html`, got.body || '');
const text = (got.body||'').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<script[\s\S]*?<\/script>/g,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
fs.writeFileSync(`${OUT}/invoice-preview.txt`, text);
console.log('visible text length:', text.length);
for (const w of ['disclaim','warrant','terms','liabilit','not responsible','agree','interest will','late']) {
  const i = text.toLowerCase().indexOf(w);
  console.log(`  ${w.padEnd(16)} ${i<0 ? 'not present' : 'AT '+i+': …'+text.slice(Math.max(0,i-120), i+220)+'…'}`);
}
console.log('--- tail of the document text ---');
console.log(text.slice(-700));
await browser.close();
