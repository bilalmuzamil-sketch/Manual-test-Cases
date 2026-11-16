// Read-only state probe: stock of the seeded parts, the customer's open balance and open invoices, and one WO's status/invoice. SECRET-FREE.
import fs from 'fs';
import { start, call, LOC, OUT, zones } from './common.mjs';
const [label, woId, acct = '9bb363eb-ad93-4b66-b44f-ec12afc23b10'] = process.argv.slice(2);
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const inv = await call(page, 'GET', '/api/inventory/parts?pagination[rowsPerPage]=100');
const stock = Object.fromEntries((inv.j?.data?.collection || []).map(p => [p.part_number, p.quantity]));
const un = await call(page, 'GET', `/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination[rowsPerPage]=1000&openOnly=false`);
const r = un.j?.data?.response || {};
const tx = (r.collection || []).map(t => ({ no: t.formatted_invoice_number || t.invoice_display_number, type: t.type, amount: t.amount, balance: t.balance, status: t.status }));
let wo = null;
if (woId) { const v = (await call(page, 'GET', '/api/work-orders/view/' + woId)).j?.data?.work_order; wo = v && { number: v.display_number, status: v.status, invoice_id: v.invoice_id, invoice_status: v.invoice_status, is_invoice_created: v.is_invoice_created, total: v.total_cost, open_balance: v.open_balance }; }
const out = { label, at_utc: new Date().toISOString(), zones: await zones(page, LOC.tz), stock, customer_total_due: r.groupByDueDateData?.totalDueAmount, customer_transactions: tx, wo };
const f = `${OUT}/evidence/${label}.state.json`; fs.mkdirSync(f.replace(/\/[^/]+$/, ''), { recursive: true }); fs.writeFileSync(f, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ stock, due: out.customer_total_due, wo, tx: tx.slice(0, 8) }));
await browser.close();
