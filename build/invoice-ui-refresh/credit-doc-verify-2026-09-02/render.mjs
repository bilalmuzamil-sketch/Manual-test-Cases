// Render the printed credit note and capture its text, so the 12 Credit Invoice cases can be checked
// against the real document instead of being deferred.
// Route from the registry: Customers -> the customer -> Invoices tab -> the Credit row -> the Action
// column's printer icon (tooltip "Print credit memo") -> GET /api/credit-memos/{id}/pdf
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST = '039fd202-c7f5-4b34-8000-969488b49687';
const OUT = 'build/invoice-ui-refresh/credit-doc-verify-2026-09-02';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content);
await page.goto(`${APP}/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);

// the credit memo's id comes from the request the print icon fires - take it from the API, not a guess
const ids = await page.evaluate(async u => {
  const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
  const j = await r.json().catch(() => null);
  return { status: r.status, body: JSON.stringify(j).slice(0, 1200) };
}, `https://${APIH}/api/customers/view/${CUST}`);
const acc = /"customer_account_id":"([^"]+)"/.exec(ids.body)?.[1];
const tx = await page.evaluate(async u => {
  const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
  const j = await r.json().catch(() => null);
  return j?.data?.response?.collection || [];
}, `https://${APIH}/api/customer-account/list-unpaid-transaction?account_id=${acc}`);
console.log('transactions on the account:', tx.length);
tx.forEach(t => console.log('   ', JSON.stringify(t).slice(0, 240)));
// Match on the field that actually exists. The row has no `number`; it has type:"credit" and an
// `id` - and that id is EXACTLY the one the print icon's request carried
// (3ad04480-34e3-4c3b-8de7-9e09d0d5da29), which is the confirmation that this row is the document's
// subject. Matching a field that is not in the payload is the mistake probe_lib.requireFields exists
// to stop.
const credit = tx.find(t => String(t.type).toLowerCase() === 'credit');
const cmId = credit && credit.id;
console.log('credit:', credit && credit.number, '| id', cmId);
if (!cmId) { fs.writeFileSync(`${OUT}/tx.json`, JSON.stringify(tx, null, 1)); await browser.close(); process.exit(2); }

// fetch the pdf THROUGH the browser session and save it
const b64 = await page.evaluate(async u => {
  const r = await fetch(u, { credentials: 'include' });
  if (!r.ok) return { status: r.status };
  const buf = new Uint8Array(await r.arrayBuffer());
  let s = ''; for (const b of buf) s += String.fromCharCode(b);
  return { status: r.status, b64: btoa(s), len: buf.length, type: r.headers.get('content-type') };
}, `https://${APIH}/api/credit-memos/${cmId}/pdf`);
console.log('pdf fetch ->', b64.status, b64.type, b64.len, 'bytes');
if (b64.b64) {
  fs.writeFileSync(`${OUT}/credit-memo-CM8218-4189.pdf`, Buffer.from(b64.b64, 'base64'));
  console.log('saved ->', `${OUT}/credit-memo-CM8218-4189.pdf`);
}
fs.writeFileSync(`${OUT}/render-meta.json`, JSON.stringify({ branch:'sv8218', build, customer:CUST, credit, cmId, pdf:{status:b64.status,type:b64.type,len:b64.len} }, null, 1));
await browser.close();
