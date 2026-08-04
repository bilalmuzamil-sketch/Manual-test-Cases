// capture_all_exports.mjs — download EVERY export variant of a report via the API and record the
// file bytes for extraction. CSV headers are read directly; PDFs are handed to extract_pdf.py.
// This is the Location-column proof for all four exports (Rule 40 surface matrix). SECRET-FREE.
//
// Usage: node capture_all_exports.mjs <slug> [--single-location]
import fs from 'fs';
import { login, api, BASE } from '../../tools/qa8582.mjs';

const slug = process.argv[2];
const single = process.argv.includes('--single-location');
const OUT = new URL(`../evidence/${slug}/exports${single ? '-single-loc' : ''}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';   // Staging Heavy Duty - 9919
const WP_LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';   // Staging Lethbridge - 4310
const { sessCookie } = await login('admin');

// Narrow enough to stay under the export size guard, wide enough to have rows.
const base = 'range=custom&start_date=2026-06-01&end_date=2026-08-04'
  + (slug === 'sales-by-customer' ? '&productType=all' : '&productType=all&invoiceStatus=all')
  + '&locations=' + (single ? WP_HD : `${WP_HD},${WP_LB}`);

const rec = { slug, single, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433',
  queryBase: base, files: [] };

for (const format of ['csv', 'pdf']) {
  for (const variant of ['summary', 'expanded']) {
    const url = `${BASE}/api/reporting/reports/${slug}/export?format=${format}&variant=${variant}&${base}`;
    const r = await fetch(url, { headers: { Cookie: sessCookie, Accept: '*/*',
      'User-Agent': 'Mozilla/5.0', Origin: 'https://sv8582.qa.shopview.com' } });
    const buf = Buffer.from(await r.arrayBuffer());
    const entry = { format, variant, status: r.status,
      contentType: r.headers.get('content-type'),
      contentDisposition: r.headers.get('content-disposition'), bytes: buf.length };
    if (r.status === 200) {
      const fn = `${slug}__${variant}.${format}`;
      fs.writeFileSync(OUT + fn, buf);
      entry.file = fn;
      if (format === 'csv') {
        const lines = buf.toString('utf8').split(/\r?\n/);
        entry.csvLineCount = lines.length;
        entry.csvHead = lines.slice(0, 6);
        entry.csvTail = lines.filter(Boolean).slice(-2);
      }
    } else {
      entry.errorBody = buf.toString('utf8').slice(0, 400);
    }
    rec.files.push(entry);
    console.log('===', format.toUpperCase(), variant, '->', r.status, entry.bytes + 'B', entry.contentDisposition || '');
    if (entry.csvHead) entry.csvHead.forEach((l, i) => console.log(`   csv[${i}] ${l.slice(0, 400)}`));
    if (entry.csvTail) console.log('   csvLAST:', entry.csvTail.join(' | ').slice(0, 400));
    if (entry.errorBody) console.log('   ERR:', entry.errorBody);
  }
}

// bad-format + missing-variant guards (used by the API cases)
for (const [label, qs] of [
  ['bad format', `format=xlsx&variant=summary&${base}`],
  ['missing variant', `format=csv&${base}`],
  ['bad variant', `format=csv&variant=detail&${base}`],
]) {
  const r = await api(sessCookie, 'GET', `/api/reporting/reports/${slug}/export?${qs}`);
  rec[label.replace(/ /g, '_')] = { status: r.status, body: JSON.stringify(r.body).slice(0, 300) };
  console.log('GUARD', label, '->', r.status, JSON.stringify(r.body).slice(0, 200));
}

fs.writeFileSync(OUT + 'exports.json', JSON.stringify(rec, null, 1));
console.log('\nwrote', OUT + 'exports.json');
