// Read-only: invoice + payment records for the test customer account (figures for the independent recompute). SECRET-FREE.
import fs from 'fs';
import { start, call, LOC } from './common.mjs';
const [acct, invId, out] = process.argv.slice(2);
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const res = {};
for (const p of [`/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination[rowsPerPage]=1000&openOnly=false`, `/api/customer-payment/list?accountId=${acct}&pagination[rowsPerPage]=1000`, `/api/customer-deposits/list?accountId=${acct}`,
  ...(invId ? [`/api/invoices/view/${invId}`, `/api/invoices/${invId}`, `/api/invoices/${invId}/view`, `/api/invoices/details/${invId}`] : [])]) { const r = await call(page, 'GET', p); res[p] = { s: r.s, j: r.j }; console.log(r.s, p, JSON.stringify(r.j).slice(0, 300)); }
fs.writeFileSync(out || '/tmp/cln/rgwo/readinv.json', JSON.stringify(res, null, 1));
await browser.close();
