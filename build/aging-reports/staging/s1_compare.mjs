// s1_compare.mjs — 12 Nov 2026, C715471 (A/R) and C715472 (A/P) on STAGING after the release (v26.45.4-b8c04e2). The six reports, untouched,
// as of 12 Nov 2026 (the date of the "before" copies saved by session "5. V1 vs V2" at 06:35-06:46 UTC, facts only), read in full from the reports'
// own data calls and matched document by document with the before files (before/*.tsv). Every difference is sorted:
//   intended  — a credit (credit memo / deposit / vendor credit) dated ON the as-of date moved from 1-30 to Current (PRD v11 section 2);
//   new       — a document not in the before copy (made after 06:35 UTC by someone, or backdated seed);
//   gone      — a document in the before copy and not now (paid / voided since);
//   balance   — same document, different open balance (a payment since, or a fault);
//   bucket    — same document, different bucket, not the intended move (a fault unless explained).
// Output s1/compare.json + s1/after-*.json. Read-only: GET calls only, with the QA lead's session.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s1/', import.meta.url).pathname; const s = await stgStart(OUT); const d = '2026-11-12';
const tsv = (n) => { const [h, ...rows] = fs.readFileSync(decodeURIComponent(new URL('./before/' + n, import.meta.url).pathname), 'utf8').trim().split('\n'); const hs = h.split('\t'); return rows.map((r) => Object.fromEntries(r.split('\t').map((v, i) => [hs[i], v]))); };
const cents = (v) => (v === '' || v == null ? 0 : Math.round(Number(v) * 100));
async function all(path, per = 100) { const out = []; for (let pg = 1; pg < 400; pg++) { const r = await s.api(`${path}${path.includes('?') ? '&' : '?'}pagination[page]=${pg}&pagination[rowsPerPage]=${per}`); if (r.st !== 200) throw new Error(path + ' ' + r.st); const c = r.j.data.collection || []; out.push(...c); const n = r.j.data.pagination?.rowsNumber ?? 0; if (!c.length || out.length >= n) return { rows: out, data: r.j.data }; } return { rows: out }; }
const B = ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus']; const BB = { current: 'current', days1to30: 'days_1_to_30', days31to60: 'days_31_to_60', days61to90: 'days_61_to_90', days91Plus: 'days_91_plus' };
const o = { asOf: d, at: new Date().toISOString() };
async function detail(slug) { const docs = []; for (const b of B) { const { rows } = await all(`/api/reporting/reports/${slug}/buckets/${b}/rows?asOfDate=${d}`); for (const r of rows) docs.push({ ...r, bucket: b }); } return docs; }
const isCredit = (t) => /credit|deposit/i.test(t || '');
function compareDocs(name, before, after, keyB, keyA, balB) {
  const mb = new Map(before.map((r) => [keyB(r), r])), ma = new Map(after.map((r) => [keyA(r), r])); const res = { before: before.length, after: after.length, intended: [], new: [], gone: [], balance: [], bucket: [], dupKeysBefore: before.length - mb.size, dupKeysAfter: after.length - ma.size };
  for (const [k, a] of ma) { const b = mb.get(k); if (!b) { res.new.push([k, a.documentNumber, a.customerName || a.vendorName, a.date, a.bucket, a.openBalanceCents, a.locationName]); continue; }
    const bb = BB[b.bucket] || b.bucket; if (cents(balB(b)) !== a.openBalanceCents) res.balance.push([k, a.documentNumber, a.customerName || a.vendorName, cents(balB(b)), a.openBalanceCents]);
    if (bb !== a.bucket) { const onAsOf = (a.date || '').slice(0, 10) === d || (b.date || '').slice(0, 10) === d; (isCredit(a.transactionType) && onAsOf && bb === 'days_1_to_30' && a.bucket === 'current' ? res.intended : res.bucket).push([k, a.documentNumber, a.customerName || a.vendorName, a.transactionType, a.date, bb, a.bucket]); } }
  for (const [k, b] of mb) if (!ma.has(k)) res.gone.push([k, b.transactionNumber, b.customerName || b.vendorName, b.date, b.bucket, balB(b), b.locationName]);
  o[name] = res; return res; }
// A/R Detail + A/P Detail
const ard = await detail('ar-aging-detail'); fs.writeFileSync(OUT + 'after-ard.json', JSON.stringify(ard)); const apd = await detail('ap-aging-detail'); fs.writeFileSync(OUT + 'after-apd.json', JSON.stringify(apd));
compareDocs('ard', tsv('AR Aging Detail - all documents.tsv'), ard, (r) => r.transactionNumber + '|' + r.customerName, (r) => r.documentNumber + '|' + r.customerName, (r) => r.balance);
compareDocs('apd', tsv('AP Aging Detail - all documents.tsv'), apd, (r) => r.id, (r) => r.documentId, (r) => r.openBalance);
// Summaries
const ars = await all(`/api/reporting/reports/ar-aging-summary?asOfDate=${d}`); const aps = await all(`/api/reporting/reports/ap-aging-summary?asOfDate=${d}`);
fs.writeFileSync(OUT + 'after-ars.json', JSON.stringify(ars)); fs.writeFileSync(OUT + 'after-aps.json', JSON.stringify(aps));
o.arsRow0 = ars.rows[0]; o.apsRow0 = aps.rows[0]; o.arsTotals = ars.data?.totals; o.apsTotals = aps.data?.totals;
// Collection / Unpaid group totals
const arc = await all(`/api/reporting/reports/ar-aging-collection?asOfDate=${d}`, 30); const apu = await all(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=${d}`, 30);
fs.writeFileSync(OUT + 'after-arc.json', JSON.stringify(arc.rows.map(({ rows, ...g }) => ({ ...g, rowsShown: (rows || []).length })))); fs.writeFileSync(OUT + 'after-apu.json', JSON.stringify(apu.rows.map(({ rows, ...g }) => ({ ...g, rowsShown: (rows || []).length }))));
o.arcTotals = arc.data?.totals; o.apuTotals = apu.data?.totals; o.arcGroups = arc.rows.length; o.apuGroups = apu.rows.length;
fs.writeFileSync(OUT + 'compare.json', JSON.stringify(o, null, 1));
const sm = (x) => ({ before: x.before, after: x.after, intended: x.intended.length, new: x.new.length, gone: x.gone.length, balance: x.balance.length, bucket: x.bucket.length, dupB: x.dupKeysBefore, dupA: x.dupKeysAfter });
console.log(JSON.stringify({ ard: sm(o.ard), apd: sm(o.apd), ars: [ars.rows.length, o.arsTotals], aps: [aps.rows.length, o.apsTotals], arc: [o.arcGroups, o.arcTotals], apu: [o.apuGroups, o.apuTotals], arsRow0: JSON.stringify(o.arsRow0).slice(0, 300) })); await s.close(); process.exit(0);
