// p23_vendor_net30.mjs — 11 Nov 2026: C1062569 needs a Net 30 vendor (bill due = invoice date + 30). Vendors made by add-vendor with
// credit_term NET_30 came out due = invoice date. Make vendor "ZZAUTOTEST NEG PASTDUE V" through the SCREEN (Parts > Vendors > New Vendor,
// Credit Terms "Net 30", Taxes "Exempt (0%)") capturing the request; then bills dated today-21 (A, 100.00) and today-30 (B, 200.00) through
// the API; read A/P Detail for that vendor. Output exec/p23/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p23/', import.meta.url).pathname; const s = await start(OUT, '/parts/vendors'); const p = s.page; const a = mk(p); const o = { reqs: [] };
p.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url())) o.reqs.push({ u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 800) }); });
await S.loc(a); await p.waitForTimeout(2500); await s.shot('vendors');
await p.getByRole('button', { name: /New Vendor/i }).first().click(); await p.waitForTimeout(2000); await s.shot('new-vendor');
const dlg = p.locator('.q-dialog, [role=dialog]').filter({ hasText: 'New Vendor' }).last(); o.form = (await dlg.innerText().catch(() => '')).slice(0, 900);
const name = 'ZZAUTOTEST NEG PASTDUE V2'; const nm = p.getByLabel(/^Name/).first(); await nm.click(); await nm.type(name); await p.keyboard.press('Tab');
const pick = async (label, opt) => { await p.locator('.q-field').filter({ hasText: label }).first().click(); await p.waitForTimeout(900); o['menu-' + opt] = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 400); await p.locator('.q-menu .q-item').filter({ has: p.getByText(opt, { exact: true }) }).first().click(); await p.waitForTimeout(500); };
await p.mouse.click(528, 488); await p.waitForTimeout(1200); o.ctMenu = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 400); await s.shot('ct-menu');
await p.locator('.q-menu .q-item').filter({ hasText: /Net 30$/ }).first().click().catch((e) => { o.ctErr = String(e).slice(0, 150); }); await p.waitForTimeout(600);
await p.mouse.click(720, 544); await p.waitForTimeout(1200); o.txMenu = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 300);
await p.locator('.q-menu .q-item').filter({ hasText: /^Exempt/ }).first().click().catch((e) => { o.txErr = String(e).slice(0, 150); }); await p.waitForTimeout(600);
await s.shot('filled'); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await p.mouse.click(1018, 797); await p.waitForTimeout(3000); await s.shot('saved');
const vl = await a.get('/api/reporting/reports/ap-aging/vendors'); const list = vl.j?.data?.collection || vl.j?.data || []; const v = (Array.isArray(list) ? list : []).find((x) => (x.name || x.label) === name); o.vendor = v;
const vid = v?.id || v?.value || v?.vendorId; o.vid = vid;
const day = (n) => { const d = new Date(Date.UTC(2026, 10, 10) - n * 864e5); return d.toISOString().slice(0, 10); };
if (vid) { o.bA = await S.bill(a, vid, { amount: 100, date: day(21), number: 'ZZNEG2-A' }); o.bB = await S.bill(a, vid, { amount: 200, date: day(30), number: 'ZZNEG2-B' });
  const r = await a.get(`/api/reporting/reports/ap-aging-detail?asOfDate=2026-11-10&vendors=${vid}`); o.rep = JSON.stringify(r.j).slice(0, 2500); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ ...o, reqs: o.reqs.filter((x) => /vendor/i.test(x.u)) }).slice(0, 4000)); await s.close(); process.exit(0);
