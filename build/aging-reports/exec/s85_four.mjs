// s85_four.mjs — 11 Nov 2026: the QA lead's four extra tests on the p66 data. C1078998 A/R invoice with no due date stored (Net 30, 40 days
// old) — which bucket; C1078999 A/P bill with no due date — listed or not; C1079000 a $100 bill paid $110 — listed with Open Balance $-10.00;
// C1095432 A/R Summary: the sum of every customer row's Total against the Totals row (step 3's overpaid customer cannot be built: L0641).
// Output exec/s85/<id>.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s85/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const D = JSON.parse(fs.readFileSync(new URL('./p66/out.json', import.meta.url)));
const shot = async (o, n) => { const f = await s.shot(o.id + '-' + n); (o.shots ||= []).push(f); return f; };
const rows = () => p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => [...tr.children].map(td => td.innerText.replace(/\\s+/g,' ').trim()).join(' | ')).filter(t => t.replace(/[ |]/g,''))`);
const expandAll = async () => { for (const b of [/^Current/, /^1-30/, /^31-60/, /^61-90/, /^91/]) await S.expand(b); };
const money = (t) => { const m = (t || '').match(/\$-?[\d,]+\.\d\d|-\$[\d,]+\.\d\d/g); return m ? Number(m[m.length - 1].replace(/[$,]/g, '')) : null; };
const T = {
  C1078998: async (o) => { o.data = D.ar; await s.go(REPORTS.ard); await p.waitForTimeout(3500); await F.pick('Customer', D.ar.name); await expandAll(); o.rows = await rows(); o.line = o.rows.filter((r) => r.includes(D.ar.num)); await shot(o, '4-invoice'); },
  C1078999: async (o) => { o.data = D.ap; await s.go(REPORTS.apd); await p.waitForTimeout(3500); await F.pick('Vendor', 'ZZRV No Due Date P66'); o.chips = await F.chips(); await expandAll(); o.rows = await rows(); o.text = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(-400); await shot(o, '4-vendor'); },
  C1079000: async (o) => { o.data = D.op; await s.go(REPORTS.apd); await p.waitForTimeout(3500); await F.pick('Vendor', D.op.name); await expandAll(); o.rows = await rows(); o.line = o.rows.filter((r) => r.includes(D.op.bill)); o.text = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(-400); await shot(o, '4-5-bill'); },
  C1095432: async (o) => { await s.go(REPORTS.ars); await p.waitForTimeout(4000); const all = await S.collect(); const body = all.filter((r) => !/^Totals?\b/.test(clean(r.text))); const tot = all.find((r) => /^Totals?\b/.test(clean(r.text))) || null;
    o.n = body.length; o.sum = Math.round(body.reduce((x, r) => x + (money(r.cells[r.cells.length - 1]) || 0), 0) * 100) / 100; o.totalsRow = tot && tot.text; o.totals = tot && money(tot.cells[tot.cells.length - 1] || tot.text);
    if (!tot) { o.totalsDom = await p.evaluate(() => { const r = [...document.querySelectorAll('main tr')].find((x) => /^\s*Totals?\b/.test(x.innerText)); return r && r.innerText.replace(/\s+/g, ' '); }); o.totals = money(o.totalsDom); }
    o.equal = o.totals !== null && Math.abs(o.totals - o.sum) < 0.005; await p.evaluate(`${S.SC}.scrollTop = ${S.SC}.scrollHeight`); await p.waitForTimeout(2500); await shot(o, '4-6-bottom'); },
};
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify(o.line || o.equal || '').slice(0, 200)); }
await s.close(); process.exit(0);
