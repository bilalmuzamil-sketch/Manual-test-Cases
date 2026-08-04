// READ-ONLY probe (GET only) — does the PDF-export 500 track ELAPSED TIME or RENDERED VOLUME?
// Reuses build/report-suite/viu-2026-08-03/batch-pv-tu/tools/qa8582.mjs (secrets read from /tmp).
// Run: NODE_USE_ENV_PROXY=1 node pdf500_mechanism_probe.mjs
import fs from 'fs';
import { login, BASE } from '../../viu-2026-08-03/batch-pv-tu/tools/qa8582.mjs';

const OUT = new URL('./pdf500-mechanism-probe.json', import.meta.url).pathname;
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
async function probe(label, slug, qs) {
  const url = `${BASE}/api/reporting/reports/${slug}/export?${qs}`;
  const t0 = Date.now();
  let r, buf = null, err = null;
  try {
    r = await fetch(url, { headers: { Cookie: sessCookie, 'User-Agent': UA, Accept: '*/*',
      Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' },
      signal: AbortSignal.timeout(150000) });
    buf = Buffer.from(await r.arrayBuffer());
  } catch (e) { err = String(e); }
  const ms = Date.now() - t0;
  const rec = { label, slug, qs, ms, status: r ? r.status : null, err,
    // NEVER persist set-cookie: it carries the live session id (CLAUDE.md secrets rule).
    headers: r ? Object.fromEntries([...r.headers.entries()].filter(([k]) => k.toLowerCase() !== 'set-cookie')) : null,
    bytes: buf ? buf.length : 0,
    bodyIfSmall: buf && buf.length < 2000 ? buf.toString('utf8') : null };
  console.log(`${label.padEnd(46)} ${rec.status}  ${String(ms).padStart(7)} ms  bytes=${rec.bytes}`);
  return rec;
}

// PV row counts are pinned by the search term (proven in batch-pv-tu exports-log.jsonl):
//   search=GA -> 344 rows (PASSED twice)   search=HO -> 449 rows (FAILED twice)
const PVBASE = 'range=this_year&type=both&format=pdf';
const NARROW = 'columns=part_number,description';
const IVWHOLE = 'range=custom&start_date=2026-08-01&end_date=2026-08-04&locations=b3c8c820-f815-4cf1-8938-10956c5ee71a';

const out = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433', probes: [] };
out.probes.push(await probe('PV 344 rows (GA) all columns', 'parts-velocity', `${PVBASE}&search=GA`));
out.probes.push(await probe('PV 449 rows (HO) all columns', 'parts-velocity', `${PVBASE}&search=HO`));
out.probes.push(await probe('PV 449 rows (HO) 2 columns', 'parts-velocity', `${PVBASE}&search=HO&${NARROW}`));
out.probes.push(await probe('PV 3238 rows (M) 2 columns', 'parts-velocity', `${PVBASE}&search=M&${NARROW}`));
out.probes.push(await probe('IV 5657 rows whole list, PDF', 'inventory-value', `${IVWHOLE}&format=pdf`));
out.probes.push(await probe('IV 5657 rows whole list, CSV', 'inventory-value', `${IVWHOLE}&format=csv`));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT);
