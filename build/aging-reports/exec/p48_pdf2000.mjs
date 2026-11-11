// p48_pdf2000.mjs — 11 Nov 2026: C715469 (A/P Detail PDF of exactly 2,000 lines downloads; 2,001 refused) and C715467 (over 2,000 refused at once,
// CSV downloads). Picks vendors whose open A/P lines today add up to EXACTLY 2,000 (fewest vendors, names that no other vendor name contains, so
// the Vendor-filter search ticks the right one), and a vendor B with exactly one line. Verifies both sums on the server's own report answer before
// touching the screen, then runs the steps through the screen. Output p48/out.json + pictures + the exported files.
import { start, API, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const OUT = new URL('./p48/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const s = await start(OUT, REPORTS.apd); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const o = {};
const TODAY = '2026-11-11';
const get = (u) => p.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); return { st: r.status, j: await r.json().catch(() => null) }; }, API + u);
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const calls = []; const reqT = {};
p.on('request', (r) => { if (/export/.test(r.url())) reqT[r.url()] = Date.now(); });
p.on('response', async (r) => { if (/export/.test(r.url())) calls.push({ u: r.url().replace(/^.*reports\//, '').slice(0, 200), st: r.status(), ms: Date.now() - (reqT[r.url()] || Date.now()) }); });
const docRows = (rows) => rows.filter((r) => /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test((r[0] || '').trim()) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test((r[0] || '').trim()) || /^\d{4}-\d{2}-\d{2}/.test((r[0] || '').trim())).length;
async function uiRows() { const t = await p.locator('main').innerText(); const m = [...t.matchAll(/past due \((\d+)\)|Current \((\d+)\)/g)].map((x) => +(x[1] || x[2])); return { buckets: m, sum: m.reduce((a, b) => a + b, 0) }; }
try {
  await p.waitForTimeout(2500);
  // 1. per-vendor open line counts today (A/P Unpaid Invoices answer groups every open document by vendor)
  let all = [], page = 1;
  while (page < 800) { /* 11 Nov: this answer pages 30 vendors at a time whatever rowsPerPage says; read until an empty page */ const r = await get(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=${TODAY}&pagination[page]=${page}&pagination[rowsPerPage]=100&pagination[sortBy]=vendor_name&pagination[descending]=false`);
    const c = r.j?.data?.collection ?? []; all = all.concat(c.map((v) => ({ id: v.vendorId, name: v.name, n: v.rowsNumber }))); if (!c.length) break; page++; }
  const det = await get(`/api/reporting/reports/ap-aging-detail?asOfDate=${TODAY}`);
  o.vendors = all.length; o.sumUnpaid = all.reduce((a, v) => a + v.n, 0); o.detailTotal = det.j?.data?.totals?.rowsNumber; save();
  // 2. exact subset = 2000, fewest vendors, unique-substring names only
  const names = all.map((v) => v.name.toLowerCase());
  const uniq = (v) => names.filter((n) => n.includes(v.name.toLowerCase())).length === 1 && v.name.length >= 4 && !/["\\]/.test(v.name);
  const cand = all.filter((v) => v.n > 1 && v.n <= 2000 && uniq(v)).sort((a, b) => b.n - a.n).slice(0, 200);
  const best = new Array(2001).fill(null); best[0] = [];
  for (let i = 0; i < cand.length; i++) for (let t = 2000; t >= cand[i].n; t--) { const prev = best[t - cand[i].n]; if (prev && !prev.includes(i) && (!best[t] || best[t].length > prev.length + 1)) best[t] = [...prev, i]; }
  if (!best[2000]) throw new Error('no exact subset of 2000');
  const chosen = best[2000].map((i) => cand[i]); o.chosen = chosen;
  const B = all.find((v) => v.n === 1 && uniq(v) && !chosen.some((c) => c.id === v.id)); o.vendorB = B; save();
  // 3. server check with the vendor filter (try the two list spellings)
  for (const sp of ['vendors=' + chosen.map((v) => v.id).join(','), chosen.map((v) => 'vendors[]=' + v.id).join('&')]) {
    const r = await get(`/api/reporting/reports/ap-aging-detail?asOfDate=${TODAY}&${sp}`); o['srv:' + sp.slice(0, 12)] = r.j?.data?.totals?.rowsNumber; }
  save();
  // 4. C715469 through the screen
  await s.go(REPORTS.apd); await p.waitForTimeout(3000);
  for (const v of chosen) await F.pick('Vendor', v.name);
  o.s1 = { chips: await F.chips(), rows: await uiRows() }; await s.shot('469-1-chosen'); save();
  let n0 = calls.length; o.s2 = await E.exportAs('CSV', '469-csv', 120000); o.s2.calls = calls.slice(n0);
  if (o.s2.file) o.s3 = { docRows: docRows(E.readCsv(o.s2.file)), lines: E.readCsv(o.s2.file).length }; save();
  n0 = calls.length; const t0 = Date.now(); o.s4 = await E.exportAs('PDF', '469-pdf-2000', 240000); o.s4.secs = Math.round((Date.now() - t0) / 1000); o.s4.calls = calls.slice(n0);
  await s.shot('469-4-after-pdf'); save();
  if (B) { await F.pick('Vendor', B.name); o.s5 = { chips: await F.chips(), rows: await uiRows() }; await s.shot('469-5-plus-B'); save();
    n0 = calls.length; const t1 = Date.now(); o.s6 = await E.exportAs('PDF', '469-pdf-2001', 60000); o.s6.secs = Math.round((Date.now() - t1) / 1000); o.s6.calls = calls.slice(n0); await s.shot('469-6-after'); save(); }
  // 5. C715467 — all vendors, today
  await s.go(REPORTS.apd); await p.waitForTimeout(3500); o.k1 = { chips: await F.chips(), rows: await uiRows() }; await s.shot('467-0-all');
  n0 = calls.length; const t2 = Date.now(); o.k2 = await E.exportAs('PDF', '467-pdf', 60000); o.k2.secs = Math.round((Date.now() - t2) / 1000); o.k2.calls = calls.slice(n0); await s.shot('467-1-after-pdf'); save();
  n0 = calls.length; o.k3 = await E.exportAs('CSV', '467-csv', 180000); o.k3.calls = calls.slice(n0);
  if (o.k3.file) o.k4 = { docRows: docRows(E.readCsv(o.k3.file)), lines: E.readCsv(o.k3.file).length };
} catch (e) { o.err = String(e).slice(0, 400); }
save(); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
