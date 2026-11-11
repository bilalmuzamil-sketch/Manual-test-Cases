// p24_credit.mjs — 11 Nov 2026: C1062566/C1062568 setup through the SCREEN. Customer "ZZAUTOTEST CREDIT DAY A" (API) → customer page →
// Invoices tab → Issue Credit → Credit Date 11/05/2026, Amount 50.00, Issue Store Credit, Reason → Issue Credit. Every request captured,
// pictures at each stage. Output exec/p24/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p24/', import.meta.url).pathname; const s = await start(OUT, '/customers'); const p = s.page; const a = mk(p); const o = { reqs: [] };
p.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/recent-entities/.test(r.url())) o.reqs.push({ u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 900) }); });
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
await S.loc(a);
const c = await a.post('/api/customers/create', { name: 'ZZAUTOTEST CREDIT DAY A' }); o.c = c; const cid = c.j?.data?.company_id || c.j?.data?.id; o.cid = cid;
const ct = await a.post('/api/contacts/create', { company_id: cid, first_name: 'ZZ', last_name: 'Credit' }); o.contact = ct.j?.data?.contact_id;
await s.go('/customers/' + cid); await p.waitForTimeout(3000); o.url = p.url(); await s.shot('customer');
await p.getByRole('tab', { name: /Invoices/ }).first().click().catch(async () => { await p.getByText('Invoices', { exact: true }).first().click(); }); await p.waitForTimeout(2500); await s.shot('invoices-tab');
await p.getByRole('button', { name: /Issue Credit/i }).first().click(); await p.waitForTimeout(2000); await s.shot('issue-credit-open');
o.form = (await p.locator('.q-dialog, [role=dialog]').last().innerText().catch(() => '')).slice(0, 900); save();
const typeIn = async (lab, val) => { const f = p.getByLabel(lab).first(); await f.click(); await f.fill(''); await f.type(val); await p.keyboard.press('Tab'); await p.waitForTimeout(400); };
try { await typeIn(/Credit Date/i, '11/05/2026'); } catch (e) { o.dErr = String(e).slice(0, 200); }
try { await typeIn(/^Amount/i, '50.00'); } catch (e) { o.aErr = String(e).slice(0, 200); }
await p.getByText('Issue Store Credit', { exact: true }).first().click().catch((e) => { o.sErr = String(e).slice(0, 200); });
try { await typeIn(/Reason/i, 'ZZAUTOTEST aging credit dated 5 Nov'); } catch (e) { o.rErr = String(e).slice(0, 200); }
await s.shot('filled'); save();
await p.locator('.q-dialog, [role=dialog]').last().getByRole('button', { name: /^Issue Credit$/ }).click().catch((e) => { o.btnErr = String(e).slice(0, 200); }); await p.waitForTimeout(3500); await s.shot('after');
o.after = (await p.locator('body').innerText()).slice(0, 300);
for (const b of ['days_1_to_30', 'current']) { const r = await a.get(`/api/reporting/reports/ar-aging-detail/buckets/${b}/rows?asOfDate=2026-11-10&customers=${cid}&pagination[page]=1&pagination[rowsPerPage]=100`); o['rows-' + b] = JSON.stringify(r.j?.data?.collection || r.j).slice(0, 600); }
save(); console.log(JSON.stringify({ ...o, c: undefined }).slice(0, 4000)); await s.close(); process.exit(0);
