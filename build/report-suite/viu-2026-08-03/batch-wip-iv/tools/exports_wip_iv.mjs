// exports_wip_iv.mjs — download every WIP + IV export permutation and record exact shape.
// SECRET-FREE: credentials come from /tmp/report-suite-viu/cookies.json via ../../tools/qa8582.mjs.
// Usage: NODE_USE_ENV_PROXY=1 node exports_wip_iv.mjs <outDir>
import fs from 'fs';
import path from 'path';
import { login, api, BASE } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/exports-wip-iv';
fs.mkdirSync(OUT, { recursive: true });

const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';   // Staging Heavy Duty - 9919
const WP_LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';   // Staging Lethbridge - 4310

const WIP_COLS_DEFAULT = 'wo_number,status,customer,asset,advisor,days_open,earned,remaining,total';
const WIP_COLS_ALL = 'wo_number,status,customer,asset,vin,location,advisor,days_open,last_activity,labor_earned,labor_remaining,parts_earned,parts_remaining,earned,remaining,total';
const WIP_TABS = ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates'];

// WIP takes from/to ISO datetimes; IV takes range/start_date/end_date.
const WIP_RANGE = 'from=2026-01-01T00:00:00.000Z&to=2026-08-04T23:59:59.000Z';
const IV_RANGE = 'range=custom&start_date=2026-08-01&end_date=2026-08-03';

async function grab(sess, name, url) {
  const r = await fetch(BASE + url, {
    headers: {
      Cookie: sess, Accept: '*/*',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/',
    },
  });
  const ct = r.headers.get('content-type') || '';
  const cd = r.headers.get('content-disposition') || '';
  const reqId = r.headers.get('x-request-id') || r.headers.get('x-requestid') || '';
  const buf = Buffer.from(await r.arrayBuffer());
  const rec = { name, url, status: r.status, contentType: ct, contentDisposition: cd, requestId: reqId, bytes: buf.length };
  if (r.status === 200 && (ct.includes('pdf') || ct.includes('csv') || ct.includes('octet') || cd)) {
    const ext = ct.includes('pdf') ? 'pdf' : 'csv';
    const f = path.join(OUT, `${name}.${ext}`);
    fs.writeFileSync(f, buf);
    rec.file = f;
    if (ext === 'csv') rec.head = buf.toString('utf8').split('\n').slice(0, 4);
  } else {
    rec.body = buf.toString('utf8').slice(0, 600);
  }
  console.log(rec.status, name, rec.bytes, rec.requestId || '');
  return rec;
}

const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }

const results = [];
const E = '/api/reporting/reports';

// ---------- WIP ----------
for (const tab of WIP_TABS) {
  for (const fmt of ['csv', 'pdf']) {
    // single location, default columns
    results.push(await grab(sessCookie, `wip__${tab}__SINGLE__default.${fmt}`.replace(`.${fmt}`, ''),
      `${E}/work-in-progress/export?format=${fmt}&${WIP_RANGE}&tab=${tab}&columns=${WIP_COLS_DEFAULT}&locations=${WP_HD}`));
    // two locations, all columns
    results.push(await grab(sessCookie, `wip__${tab}__MULTI__allcols`,
      `${E}/work-in-progress/export?format=${fmt}&${WIP_RANGE}&tab=${tab}&columns=${WIP_COLS_ALL}&locations=${WP_HD},${WP_LB}`));
  }
}
// WIP negative probes
results.push(await grab(sessCookie, 'wip__NEG__no-columns',
  `${E}/work-in-progress/export?format=csv&${WIP_RANGE}&tab=Completed&locations=${WP_HD}`));
results.push(await grab(sessCookie, 'wip__NEG__bad-tab',
  `${E}/work-in-progress/export?format=csv&${WIP_RANGE}&tab=Nonsense&columns=${WIP_COLS_DEFAULT}&locations=${WP_HD}`));
results.push(await grab(sessCookie, 'wip__NEG__bad-format',
  `${E}/work-in-progress/export?format=xlsx&${WIP_RANGE}&tab=Completed&columns=${WIP_COLS_DEFAULT}&locations=${WP_HD}`));
results.push(await grab(sessCookie, 'wip__NEG__invoiced-hours-col',
  `${E}/work-in-progress/export?format=csv&${WIP_RANGE}&tab=Completed&columns=${WIP_COLS_DEFAULT},invoiced_hours&locations=${WP_HD}`));

// ---------- IV ----------
for (const fmt of ['csv', 'pdf']) {
  results.push(await grab(sessCookie, `iv__SINGLE__wholelist__${fmt}`,
    `${E}/inventory-value/export?format=${fmt}&${IV_RANGE}&locations=${WP_HD}`));
  results.push(await grab(sessCookie, `iv__MULTI__wholelist__${fmt}`,
    `${E}/inventory-value/export?format=${fmt}&${IV_RANGE}&locations=${WP_HD},${WP_LB}`));
  results.push(await grab(sessCookie, `iv__SINGLE__searchnarrow__${fmt}`,
    `${E}/inventory-value/export?format=${fmt}&${IV_RANGE}&locations=${WP_HD}&search=W4707QP`));
  results.push(await grab(sessCookie, `iv__MULTI__searchnarrow__${fmt}`,
    `${E}/inventory-value/export?format=${fmt}&${IV_RANGE}&locations=${WP_HD},${WP_LB}&search=BRAKE`));
  results.push(await grab(sessCookie, `iv__NOLOC__wholelist__${fmt}`,
    `${E}/inventory-value/export?format=${fmt}&${IV_RANGE}`));
}
results.push(await grab(sessCookie, 'iv__NEG__bad-format',
  `${E}/inventory-value/export?format=xlsx&${IV_RANGE}&locations=${WP_HD}`));

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({
  buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString(), results,
}, null, 1));
console.log('WROTE', path.join(OUT, 'manifest.json'));
