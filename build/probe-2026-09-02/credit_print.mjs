// The QA lead's screenshot gives the route: Customers -> the customer -> Invoices tab -> the row whose
// Type is "Credit" -> the print icon in the Action column, tooltip "Print credit memo".
// Walk it, and capture the request the print icon fires - that is the document render path the
// 2026-08-31 pass searched 13 candidate routes for and never found.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP } = await boot('sv9315', '/customers', 'admin');
const API = 'https://sv9315api.qa.shopview.com';
const get = p => page.evaluate(async u => {
  const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (_) {}
  return { status: r.status, json: j };
}, API + p);

// find a customer that HAS a credit, reading the transaction list at its REAL key
const cs = await get('/api/customers?pagination[page]=1&pagination[rowsPerPage]=500');
const list = cs.json?.data?.collection || [];
let target = null;
for (const c of list.slice(0, 120)) {
  const v = await get(`/api/customers/view/${c.id}`);
  const acc = JSON.stringify(v.json || {}).match(/"customer_account_id":"([^"]+)"/)?.[1];
  if (!acc) continue;
  const r = await get(`/api/customer-account/list-unpaid-transaction?account_id=${acc}`);
  const rows = r.json?.data?.response?.collection || [];      // <- data.response.collection
  const cm = rows.find(x => /CM/.test(String(x.number || x.no || JSON.stringify(x))));
  if (cm) { target = { c, acc, cm, rows: rows.length }; break; }
}
if (!target) { console.log('no credit found in the first 120 customers'); await browser.close(); process.exit(0); }
console.log('customer with a credit:', target.c.name);
console.log('the credit row:', JSON.stringify(target.cm).slice(0, 320));

// now the UI: open that customer's Invoices tab and click the row's print icon
const reqs = [];
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u) && /print|pdf|preview|credit|memo|document/i.test(u)) reqs.push(`${r.method()} ${u.replace(API,'<api>')}`); });
await page.goto(`${APP}/customers/${target.c.id}/invoices`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);
console.log('url:', page.url().replace(APP, ''));
const tbl = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const lab = el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
    return (c.textContent || '').replace(/\s+/g, ' ').trim(); };
  const heads = [...t.querySelectorAll('thead th, thead td')].map(lab);
  return { heads, rows: [...t.querySelectorAll('tbody tr')].map(tr =>
    Object.fromEntries([...tr.cells].map((c, i) => [heads[i] ?? 'col' + i, lab(c)]))),
    tips: [...new Set([...t.querySelectorAll('[title],[aria-label]')].map(e => e.getAttribute('title') || e.getAttribute('aria-label')).filter(Boolean))] };
});
console.log('columns:', JSON.stringify(tbl && tbl.heads));
console.log('rows   :', JSON.stringify(tbl && tbl.rows).slice(0, 400));
console.log('tooltips:', JSON.stringify(tbl && tbl.tips));
fs.writeFileSync('build/probe-2026-09-02/credit-print.json', JSON.stringify({ target: { name: target.c.name, cm: target.cm }, tbl, reqs }, null, 1));
await page.screenshot({ path: 'build/probe-2026-09-02/credit-invoices-tab.png' });
await browser.close();
