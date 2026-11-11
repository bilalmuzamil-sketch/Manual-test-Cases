// p24c_depapi.mjs — 11 Nov 2026: can an unused deposit carry an earlier date? Read the leftover deposit DEP11315-4709, then try
// (1) POST /api/deposits without a work order (customerAccountId), (2) an update of the leftover's date — reading every refusal. Output p24/depapi.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p24/', import.meta.url).pathname; const s = await start(OUT, '/customers'); const a = mk(s.page); const o = JSON.parse(fs.readFileSync(OUT + 'out.json')); const r = {};
const acct = JSON.parse(o.reqs.find((x) => /credit-memos/.test(x.u)).b).customerAccountId; r.acct = acct;
const dep = (o['d-2026-11-10-current'] || []).find((x) => x[0] === 'Deposit'); r.dep = dep;
for (const u of [`/api/deposits?customerAccountId=${acct}`, `/api/deposits?companyId=${o.cid}`, `/api/customers/${o.cid}/deposits`, `/api/deposits/list?customerAccountId=${acct}`]) { const x = await a.get(u); r['GET ' + u] = [x.st, JSON.stringify(x.j).slice(0, 700)]; }
for (const b of [{ customerAccountId: acct, amount: 41, paymentMethod: 'CASH', depositDate: '2026-11-05T07:00:00.000Z', memo: 'ZZAUTOTEST unused deposit 5 Nov' }, { companyId: o.cid, amount: 41, paymentMethod: 'CASH', depositDate: '2026-11-05T07:00:00.000Z', memo: 'ZZAUTOTEST' }]) { const x = await a.post('/api/deposits', b); r['POST ' + Object.keys(b)[0]] = [x.st, JSON.stringify(x.j).slice(0, 500)]; }
fs.writeFileSync(OUT + 'depapi.json', JSON.stringify(r, null, 1)); console.log(JSON.stringify(r).slice(0, 4000)); await s.close(); process.exit(0);
