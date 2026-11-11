// p25_vcredit.mjs — 11 Nov 2026: C1062567 setup. Vendor "ZZAUTOTEST VCREDIT V" (Net 30, API) + a bill today ($500, API, part ZZVC-PART)
// → SCREEN: Parts > Returns > Create Return: Vendor, Packaging Slip, Part Number (the received part), Price Per Unit 50.00 → Save Return;
// Returns list: tick it → Receive Credit → Credit Memo Number, Credit Date 11/05/2026, Tax 0 → Post Credit. Requests + pictures. Output p25/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p25/', import.meta.url).pathname; const s = await start(OUT, '/parts/returns'); const p = s.page; const a = mk(p);
const o = fs.existsSync(OUT + 'out.json') ? JSON.parse(fs.readFileSync(OUT + 'out.json')) : {}; o.reqs = [];
p.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/recent-entities/.test(r.url())) o.reqs.push({ u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 900) }); });
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
await S.loc(a);
if (!o.vid) { o.vid = await S.vendor(a, 'ZZAUTOTEST VCREDIT V'); o.bill = await S.bill(a, o.vid, { amount: 500, date: '2026-11-10', number: 'ZZVC-BILL' }); save(); }
await s.go('/parts/returns'); await p.waitForTimeout(3000); await s.shot('returns');
await p.getByRole('button', { name: /Create Return/i }).first().click(); await p.waitForTimeout(2500); await s.shot('create-open'); o.form = (await p.locator('body').innerText()).slice(0, 1500); save();
const fld = (re) => p.locator('.q-field').filter({ hasText: re }).first();
try { await fld(/^Vendor/).click(); await p.keyboard.type('ZZAUTOTEST VCREDIT'); await p.waitForTimeout(2000); o.vMenu = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 300); await p.locator('.q-menu .q-item').filter({ hasText: 'ZZAUTOTEST VCREDIT V' }).first().click(); await p.waitForTimeout(800); } catch (e) { o.vErr = String(e).slice(0, 200); }
try { const ps = p.getByLabel(/Packaging Slip/i).first(); await ps.click(); await ps.type('ZZVC-SLIP'); } catch (e) { o.psErr = String(e).slice(0, 200); }
try { await fld(/Part Number/).click(); await p.waitForTimeout(1800); o.pMenu = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 400); await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(800); } catch (e) { o.pErr = String(e).slice(0, 200); }
try { const pp = p.getByLabel(/Price Per Unit/i).first(); await pp.click(); await pp.fill(''); await pp.type('50.00'); await p.keyboard.press('Tab'); } catch (e) { o.ppErr = String(e).slice(0, 200); }
await s.shot('create-filled'); save();
await p.getByRole('button', { name: /Save Return/i }).first().click().catch((e) => { o.saveErr = String(e).slice(0, 200); }); await p.waitForTimeout(3500); await s.shot('saved'); save();
await s.go('/parts/returns'); await p.waitForTimeout(3000);
const row = p.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST VCREDIT V' }).first(); o.rowText = await row.innerText().catch(() => null);
await row.locator('.q-checkbox, [role=checkbox]').first().click().catch((e) => { o.tickErr = String(e).slice(0, 200); }); await p.waitForTimeout(800);
await p.getByRole('button', { name: /Receive Credit/i }).first().click().catch((e) => { o.rcErr = String(e).slice(0, 200); }); await p.waitForTimeout(2500); await s.shot('process-return'); o.prForm = (await p.locator('.q-dialog, [role=dialog]').last().innerText().catch(() => '')).slice(0, 800); save();
try { const cm = p.getByLabel(/Credit Memo Number/i).first(); await cm.click(); await cm.type('ZZVC-CM1'); const cd = p.getByLabel(/Credit Date/i).first(); await cd.click(); await cd.fill(''); await cd.type('11/05/2026'); await p.keyboard.press('Tab'); const tx = p.getByLabel(/^Tax/i).first(); await tx.click(); await tx.fill(''); await tx.type('0'); await p.keyboard.press('Tab'); } catch (e) { o.cmErr = String(e).slice(0, 200); }
await s.shot('process-filled'); await p.getByRole('button', { name: /Post Credit/i }).first().click().catch((e) => { o.postErr = String(e).slice(0, 200); }); await p.waitForTimeout(3500); await s.shot('posted');
for (const D of ['2026-11-05', '2026-11-06', '2026-11-10']) for (const b of ['days_1_to_30', 'current']) { const x = await a.get(`/api/reporting/reports/ap-aging-detail/buckets/${b}/rows?asOfDate=${D}&vendors=${o.vid}&pagination[page]=1&pagination[rowsPerPage]=100`); o[`r-${D}-${b}`] = (x.j?.data?.collection || []).map((q) => [q.transactionType, q.documentNumber, q.date, q.dueDate, q.daysPastDue, q.openBalanceCents]); }
save(); console.log(JSON.stringify({ reqs: o.reqs.filter((x) => !/change-location|add-vendor|orders\//.test(x.u)), errs: Object.fromEntries(Object.entries(o).filter(([k]) => /Err$/.test(k))), rows: Object.fromEntries(Object.entries(o).filter(([k]) => k.startsWith('r-'))) }).slice(0, 4000)); await s.close(); process.exit(0);
