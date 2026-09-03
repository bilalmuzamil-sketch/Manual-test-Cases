// Render the printed credit note for EVERY credit on an account, whatever its state, so the six cases
// that were NOT VERIFIED for want of data can be checked against real documents.
// Route (registry, proven 2026-09-02): the Action column's printer icon fires
//   GET /api/credit-memos/{creditMemoId}/pdf   -> a DOWNLOAD, not a preview.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const ACCS = (process.env.ACCS || 'ebeb8706-3777-4984-b58f-2d906ea211c8,94ea52fa-3e38-4cf5-a4b4-2ce914fe548d,29c8073d-82c2-4fbe-9593-225f7f2e2959').split(',');
const OUT = 'build/invoice-ui-refresh/credit-states-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content);
console.log('build marker:', build);
const meta = [];
for (const acc of ACCS) {
  const tx = await page.evaluate(async u => { const r=await fetch(u,{credentials:'include'}); const j=await r.json().catch(()=>null);
    return j?.data?.response?.collection || []; },
    `https://${APIH}/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=200&openOnly=false`);
  for (const t of tx.filter(t=>String(t.type).toLowerCase()==='credit')) {
    const got = await page.evaluate(async u => { const r=await fetch(u,{credentials:'include'});
      if(!r.ok) return {status:r.status}; const b=new Uint8Array(await r.arrayBuffer());
      let s=''; for(const x of b) s+=String.fromCharCode(x);
      return {status:r.status, b64:btoa(s), len:b.length, type:r.headers.get('content-type')}; },
      `https://${APIH}/api/credit-memos/${t.id}/pdf`);
    const name = `${t.invoice_number}-${(t.status_label||t.status||'x').replace(/\s+/g,'-')}`;
    console.log(`${name.padEnd(28)} amount ${String(t.amount).padStart(8)} balance ${String(t.balance).padStart(8)} -> ${got.status} ${got.len||''}`);
    if (got.b64) fs.writeFileSync(`${OUT}/${name}.pdf`, Buffer.from(got.b64,'base64'));
    meta.push({ acc, id:t.id, number:t.invoice_number, status:t.status, status_label:t.status_label,
                amount:t.amount, balance:t.balance, origin_invoices:t.origin_invoices, pdf:{status:got.status,len:got.len} });
  }
}
fs.writeFileSync(`${OUT}/render-meta.json`, JSON.stringify({branch:'sv8218', build, at:new Date().toISOString(), credits:meta},null,1));
await browser.close();
