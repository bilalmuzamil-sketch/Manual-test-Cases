// iv_pdf_boundary.mjs — establish the row-count boundary at which the Inventory Value PDF export 500s.
// Method: use the server-side part search / category filter to control the size of the filtered set,
// read the true filtered row count from the DATA endpoint's pagination.rowsNumber, then request the
// PDF for the identical scope and record status + requestId.
// SECRET-FREE (cookies from /tmp via ../../tools/qa8582.mjs).
// Usage: NODE_USE_ENV_PROXY=1 node iv_pdf_boundary.mjs <outFile>
import fs from 'fs';
import { login, api, BASE } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/iv-pdf-boundary.json';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const WP_LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';
const RANGE = 'range=custom&start_date=2026-08-01&end_date=2026-08-04';
const E = '/api/reporting/reports/inventory-value';

const { sessCookie: S, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }

async function rowCount(qs) {
  const r = await api(S, 'GET', `${E}?${qs}&pagination[page]=1&pagination[rowsPerPage]=1`);
  return { status: r.status, rows: r.body?.data?.pagination?.rowsNumber ?? null, asOf: r.body?.data?.as_of_date ?? null };
}
async function pdf(qs) {
  const r = await fetch(`${BASE}${E}/export?format=pdf&${qs}`, {
    headers: { Cookie: S, Accept: '*/*', Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' },
  });
  const buf = Buffer.from(await r.arrayBuffer());
  let err = null; if (r.status !== 200) { try { err = JSON.parse(buf.toString()); } catch { err = buf.toString().slice(0, 300); } }
  return { status: r.status, bytes: buf.length, requestId: r.headers.get('x-request-id') || '', err };
}
async function csv(qs) {
  const r = await fetch(`${BASE}${E}/export?format=csv&${qs}`, {
    headers: { Cookie: S, Accept: '*/*', Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' },
  });
  const t = await r.text();
  return { status: r.status, bytes: t.length, lines: t.split('\n').length };
}

// Probes ordered so the boundary can be bracketed. `search` narrows server-side over part # + description.
const probes = [
  { label: 'search=W4707QP (1 part)', qs: `${RANGE}&locations=${WP_HD}&search=W4707QP` },
  { label: 'search=BRAKE SHOE', qs: `${RANGE}&locations=${WP_HD}&search=${encodeURIComponent('BRAKE SHOE')}` },
  { label: 'search=BRAKE', qs: `${RANGE}&locations=${WP_HD}&search=BRAKE` },
  { label: 'search=BRAKE 2loc', qs: `${RANGE}&locations=${WP_HD},${WP_LB}&search=BRAKE` },
  { label: 'search=SEAL', qs: `${RANGE}&locations=${WP_HD}&search=SEAL` },
  { label: 'search=A', qs: `${RANGE}&locations=${WP_HD}&search=A` },
  { label: 'search=E', qs: `${RANGE}&locations=${WP_HD}&search=E` },
  { label: 'search=0', qs: `${RANGE}&locations=${WP_HD}&search=0` },
  { label: 'search=1', qs: `${RANGE}&locations=${WP_HD}&search=1` },
  { label: 'no search, 1 loc (whole list)', qs: `${RANGE}&locations=${WP_HD}` },
  { label: 'no search, 2 loc (whole list)', qs: `${RANGE}&locations=${WP_HD},${WP_LB}` },
];

const out = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString(), probes: [] };
for (const p of probes) {
  const rc = await rowCount(p.qs);
  const pd = await pdf(p.qs);
  const cs = await csv(p.qs);
  const rec = { ...p, filteredRows: rc.rows, asOf: rc.asOf, pdf: pd, csv: cs };
  out.probes.push(rec);
  console.log(String(rc.rows).padStart(6), '| pdf', pd.status, String(pd.bytes).padStart(7), '| csv', cs.status, String(cs.lines).padStart(6), '|', p.label, pd.requestId);
}
out.probes.sort((a, b) => (a.filteredRows ?? 0) - (b.filteredRows ?? 0));
const ok = out.probes.filter(p => p.pdf.status === 200).map(p => p.filteredRows);
const bad = out.probes.filter(p => p.pdf.status !== 200).map(p => p.filteredRows);
out.boundary = { largestPdfSuccessRows: Math.max(...ok, -1), smallestPdfFailureRows: bad.length ? Math.min(...bad) : null, allSuccessRowCounts: ok, allFailureRowCounts: bad };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('BOUNDARY', JSON.stringify(out.boundary));
console.log('WROTE', OUT);
