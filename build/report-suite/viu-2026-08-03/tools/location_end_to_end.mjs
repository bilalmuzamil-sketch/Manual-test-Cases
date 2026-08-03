// location_end_to_end.mjs — the Rule-40 SURFACE MATRIX probe for the Location column.
// For all six reports, for SINGLE-location scope and MULTI-location scope, records:
//   * the on-screen column headers (from the data API's column metadata where present)
//   * the CSV export's metadata lines and header line
//   * the PDF export's success/failure
// Observed live; nothing inferred. Read-only (GET only).
import fs from 'fs';
import { login, api } from './qa8582.mjs';

const OUT = new URL('../evidence/location-matrix/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';        // Staging Heavy Duty - 9919
const LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';        // Staging Lethbridge - 4310
const BOTH = HD + ',' + LB;

// Narrow ranges keep every export under the 10,000-row cap so the file itself can be read.
const REPORTS = [
  { slug: 'sales-by-customer',       base: 'range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all', variants: ['summary', 'expanded'] },
  { slug: 'sales-by-representative', base: 'range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&invoiceStatus=all', variants: ['summary', 'expanded'] },
  { slug: 'parts-velocity',          base: 'type=both&range=custom&start_date=2026-08-01&end_date=2026-08-03', variants: [null] },
  { slug: 'technician-utilization',  base: 'range=custom&start_date=2026-08-01&end_date=2026-08-03', variants: ['summary', 'expanded'] },
  { slug: 'work-in-progress',        base: 'from=2026-07-01T00:00:00.000Z&to=2026-08-03T23:59:59.999Z', variants: [null], tabs: ['approved_partially_completed', 'approved_not_started', 'completed', 'estimates'] },
  { slug: 'inventory-value',         base: 'range=custom&start_date=2026-08-01&end_date=2026-08-03', variants: [null] },
];

const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('login failed', status); process.exit(2); }
const out = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433', rows: [] };

function firstLines(body, n = 3) {
  const t = typeof body === 'string' ? body : JSON.stringify(body);
  return t.split(/\r?\n/).slice(0, n);
}
// split a CSV header line into fields (handles quoted fields)
function csvFields(line) {
  const out = []; let cur = '', q = false;
  for (const ch of line || '') {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur); return out;
}

for (const r of REPORTS) {
  for (const [scopeName, loc] of [['SINGLE (Heavy Duty only)', HD], ['MULTI (both locations)', BOTH], ['NO locations param', null]]) {
    // ---- the data API (what the screen renders from) ----
    const dq = `/api/reporting/reports/${r.slug}?${r.base}${loc ? '&locations=' + encodeURIComponent(loc) : ''}`;
    const d = await api(sessCookie, 'GET', dq);
    let dataKeys = null, sampleRowKeys = null, rowCount = null;
    if (d.status === 200 && d.body && d.body.data) {
      const dd = d.body.data;
      dataKeys = Object.keys(dd);
      const arr = dd.collection || dd.rows || dd.items || dd.data ||
        (Array.isArray(dd) ? dd : (Object.values(dd).find(Array.isArray) || null));
      if (Array.isArray(arr)) { rowCount = arr.length; if (arr[0] && typeof arr[0] === 'object') sampleRowKeys = Object.keys(arr[0]); }
    }
    // ---- the exports ----
    const exps = [];
    for (const variant of r.variants) {
      for (const tab of (r.tabs || [null])) {
        for (const fmt of ['csv', 'pdf']) {
          const q = `/api/reporting/reports/${r.slug}/export?format=${fmt}&${r.base}` +
            (loc ? '&locations=' + encodeURIComponent(loc) : '') +
            (variant ? '&variant=' + variant : '') + (tab ? '&tab=' + tab : '');
          const e = await api(sessCookie, 'GET', q);
          const rec = { format: fmt, variant, tab, status: e.status };
          if (e.status === 200 && fmt === 'csv') {
            const lines = firstLines(e.body, 6);
            rec.metaLines = lines.filter(l => /^"?(Locations|As of|Date Range|Generated|Report)/i.test(l));
            const hdrIdx = lines.findIndex(l => !/^"?(Locations|As of|Date Range|Generated|Report)/i.test(l) && l.trim());
            rec.headerLine = lines[hdrIdx];
            rec.headers = csvFields(rec.headerLine || '').map(s => s.replace(/^"|"$/g, ''));
            rec.hasLocationHeader = rec.headers.some(h => /^location$|^branch$/i.test(h.trim()));
            rec.hasLocationsMetaLine = rec.metaLines.some(l => /Locations:/i.test(l));
            const key = `${r.slug}__${scopeName.split(' ')[0]}__${variant || 'plain'}${tab ? '__' + tab : ''}.csv`;
            fs.writeFileSync(OUT + key, typeof e.body === 'string' ? e.body : JSON.stringify(e.body));
            rec.file = key;
          } else if (e.status !== 200) {
            rec.error = firstLines(e.body, 1)[0]?.slice(0, 180);
          } else { rec.note = 'pdf binary, ' + String(e.body).length + ' chars'; }
          exps.push(rec);
        }
      }
    }
    out.rows.push({ report: r.slug, scope: scopeName, dataApi: { status: d.status, rowCount, dataKeys, sampleRowKeys }, exports: exps });
    console.log(`\n=== ${r.slug} | ${scopeName}`);
    console.log('  data API', d.status, 'rows=' + rowCount, 'rowKeys=' + JSON.stringify(sampleRowKeys ? sampleRowKeys.slice(0, 24) : null));
    for (const e of exps) console.log(`  export ${e.format}${e.variant ? '/' + e.variant : ''}${e.tab ? '/' + e.tab : ''} -> ${e.status}`,
      e.error ? '| ' + e.error : (e.headers ? '| Location header: ' + (e.hasLocationHeader ? 'YES' : 'no') + ' | "Locations:" line: ' + (e.hasLocationsMetaLine ? 'YES' : 'no') + ' | ' + JSON.stringify(e.headers) : (e.note || '')));
  }
}
fs.writeFileSync(OUT + 'location-matrix.json', JSON.stringify(out, null, 2));
console.log('\nwrote', OUT + 'location-matrix.json');
