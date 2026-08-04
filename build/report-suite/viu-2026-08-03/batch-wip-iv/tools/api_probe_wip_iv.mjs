// api_probe_wip_iv.mjs — behaviour + calculation probes for the WIP and Inventory Value reporting
// APIs. This is the reliable half of the VIU: every numeric/scope/sort/filter assertion is checked
// against the live payload rather than a virtualised grid. SECRET-FREE.
// Usage: NODE_USE_ENV_PROXY=1 node api_probe_wip_iv.mjs <outJson>
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/api-wip-iv.json';
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';
const W = '/api/reporting/reports/work-in-progress';
const I = '/api/reporting/reports/inventory-value';
const R = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString(), wip: {}, iv: {} };

const { sessCookie: S, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const g = (p) => api(S, 'GET', p);
const money = n => (n === null || n === undefined) ? null : Number(n);
const near = (a, b, tol = 0.02) => Math.abs(Number(a) - Number(b)) <= tol;

// ============================= WIP =============================
const WY = 'from=2025-08-05T00:00:00.000Z&to=2026-08-04T23:59:59.999Z';

{
  const r = await g(`${W}?${WY}&locations=${HD},${LB}`);
  R.wip.shape = { status: r.status, topKeys: Object.keys(r.body?.data ?? {}), };
  const d = r.body?.data ?? {};
  R.wip.sectionKeys = Object.keys(d);
  // find the row collections
  const coll = d.collection ?? d.rows ?? null;
  R.wip.hasFlatCollection = Array.isArray(coll);
  R.wip.summary = d.summary ?? d.totals ?? null;
  R.wip.raw = JSON.stringify(d).slice(0, 1200);
  if (Array.isArray(coll) && coll[0]) R.wip.rowKeys = Object.keys(coll[0]);
  // tab buckets, if the payload groups them
  for (const k of Object.keys(d)) {
    const v = d[k];
    if (Array.isArray(v)) R.wip[`arr_${k}`] = { len: v.length, keys: v[0] ? Object.keys(v[0]) : null };
    else if (v && typeof v === 'object' && !Array.isArray(v)) R.wip[`obj_${k}`] = Object.keys(v);
  }
}

// per-row calculation contract
{
  const r = await g(`${W}?${WY}&locations=${HD},${LB}`);
  const d = r.body?.data ?? {};
  // collect every row from wherever they live
  const rows = [];
  const walk = (o) => { if (Array.isArray(o)) { o.forEach(x => { if (x && typeof x === 'object' && ('earned' in x || 'total' in x)) rows.push(x); else walk(x); }); }
    else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
  walk(d);
  R.wip.rowsFound = rows.length;
  R.wip.sampleRow = rows[0] ?? null;
  const checks = { earnedEqLaborPlusParts: [], remainingEqLaborPlusParts: [], totalEqEarnedPlusRemaining: [], statuses: {}, daysOpenFmt: new Set(), invHrsFmt: new Set() };
  for (const x of rows) {
    if ('labor_earned' in x && 'parts_earned' in x && 'earned' in x)
      checks.earnedEqLaborPlusParts.push(near(money(x.earned), money(x.labor_earned) + money(x.parts_earned)));
    if ('labor_remaining' in x && 'parts_remaining' in x && 'remaining' in x)
      checks.remainingEqLaborPlusParts.push(near(money(x.remaining), money(x.labor_remaining) + money(x.parts_remaining)));
    if ('earned' in x && 'remaining' in x && 'total' in x)
      checks.totalEqEarnedPlusRemaining.push(near(money(x.total), money(x.earned) + money(x.remaining)));
    const st = x.status ?? x.wo_status; checks.statuses[st] = (checks.statuses[st] ?? 0) + 1;
    if (x.days_open !== undefined) checks.daysOpenFmt.add(typeof x.days_open + ':' + String(x.days_open).slice(0, 12));
    if (x.invoiced_hours !== undefined) checks.invHrsFmt.add(String(x.invoiced_hours));
  }
  const pct = a => a.length ? `${a.filter(Boolean).length}/${a.length}` : 'n/a';
  R.wip.calcContract = {
    'S4-R19 Earned = LaborEarned + PartsEarned': pct(checks.earnedEqLaborPlusParts),
    'S4-R20 Remaining = LaborRemaining + PartsRemaining': pct(checks.remainingEqLaborPlusParts),
    'S4-R21 Total = Earned + Remaining': pct(checks.totalEqEarnedPlusRemaining),
    statusesPresent: checks.statuses,
    daysOpenSamples: [...checks.daysOpenFmt].slice(0, 6),
    invHrsSamples: [...checks.invHrsFmt].slice(0, 10),
  };
  // S2-R2 / S2-R3 negative: no Invoiced / Paid / Declined, and no part-sale work orders
  R.wip.forbiddenStatuses = Object.keys(checks.statuses).filter(s => /invoic|paid|declin/i.test(String(s)));
  R.wip.woNumberPrefixes = [...new Set(rows.map(x => String(x.wo_number ?? x.number ?? '').split('-')[0]))].slice(0, 12);
  // asset / vin edge cases
  R.wip.assetEdge = rows.filter(x => !x.unit_number || !x.vin).slice(0, 6)
    .map(x => ({ wo: x.wo_number, unit: x.unit_number ?? x.unit ?? null, vin: x.vin ?? null, asset: x.asset ?? null }));
  R.wip.locationsSeen = [...new Set(rows.map(x => x.location ?? x.location_name).filter(Boolean))];
}

// date-range span limit (S7-R8 366-day cap)
R.wip.spanLimit = {};
for (const [label, span] of [['366d', 366], ['367d', 367], ['400d', 400], ['730d', 730]]) {
  const end = new Date('2026-08-04T23:59:59.999Z');
  const start = new Date(end.getTime() - (span - 1) * 86400000);
  const r = await g(`${W}?from=${start.toISOString()}&to=${end.toISOString()}&locations=${HD}`);
  R.wip.spanLimit[label] = { status: r.status, error: r.status !== 200 ? JSON.stringify(r.body).slice(0, 250) : null };
}

// location scope constraint
{
  const bogus = '00000000-0000-0000-0000-000000000000';
  R.wip.locScope = {
    single: (await g(`${W}?${WY}&locations=${HD}`)).status,
    both: (await g(`${W}?${WY}&locations=${HD},${LB}`)).status,
    none: (await g(`${W}?${WY}`)).status,
    inaccessible: await (async () => { const r = await g(`${W}?${WY}&locations=${bogus}`);
      return { status: r.status, err: JSON.stringify(r.body).slice(0, 200) }; })(),
  };
  const a = await g(`${W}?${WY}&locations=${HD}`);
  const b = await g(`${W}?${WY}&locations=${HD},${LB}`);
  const count = o => JSON.stringify(o).match(/"wo_number"/g)?.length ?? 0;
  R.wip.locScope.rowCounts = { single: count(a.body), both: count(b.body) };
}

// ============================= IV =============================
const IVR = 'range=custom&start_date=2026-08-01&end_date=2026-08-04';
{
  const r = await g(`${I}?${IVR}&locations=${HD},${LB}&pagination[page]=1&pagination[rowsPerPage]=25`);
  const d = r.body?.data ?? {};
  R.iv.shape = { status: r.status, topKeys: Object.keys(d), pagination: d.pagination ?? null, asOf: d.as_of_date ?? null,
    totals: d.totals ?? null, rowKeys: d.collection?.[0] ? Object.keys(d.collection[0]) : null };
  R.iv.sampleRows = (d.collection ?? []).slice(0, 3);
  // calculation contract
  const rows = d.collection ?? [];
  const chk = { totalCost: [], totalSell: [], margin: [], marginPct: [], qtyPositive: [], oneRowPerLoc: {} };
  for (const x of rows) {
    chk.totalCost.push(near(money(x.total_cost), money(x.qty) * money(x.unit_cost), 0.05));
    chk.totalSell.push(near(money(x.total_sell), money(x.qty) * money(x.unit_sell), 0.05));
    chk.margin.push(near(money(x.margin), money(x.total_sell) - money(x.total_cost), 0.05));
    const mp = money(x.total_sell) ? (money(x.margin) / money(x.total_sell)) * 100 : null;
    chk.marginPct.push(mp === null ? (x.margin_pct === null || x.margin_pct === undefined) : near(money(x.margin_pct), mp, 0.15));
    chk.qtyPositive.push(money(x.qty) > 0);
    const k = `${x.part_number}@${x.location}`; chk.oneRowPerLoc[k] = (chk.oneRowPerLoc[k] ?? 0) + 1;
  }
  const pct = a => a.length ? `${a.filter(Boolean).length}/${a.length}` : 'n/a';
  R.iv.calcContract = {
    'S3-R7 TotalCost = Qty x UnitCost': pct(chk.totalCost),
    'S3-R6 TotalSell = Qty x UnitSell': pct(chk.totalSell),
    'S3-R8 Margin = TotalSell - TotalCost': pct(chk.margin),
    'S3-R9 MarginPct = Margin / TotalSell x 100': pct(chk.marginPct),
    'S2-R1 qty > 0 on every row': pct(chk.qtyPositive),
    duplicatePartLocationKeys: Object.entries(chk.oneRowPerLoc).filter(([, n]) => n > 1).slice(0, 5),
  };
}

// totals over the FULL filtered set (S4-R2) — compare page totals against a full walk
{
  const first = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=25`);
  const t = first.body?.data?.totals ?? null;
  const rowsNumber = first.body?.data?.pagination?.rowsNumber ?? null;
  // walk everything (server pages of 500)
  let sumCost = 0, sumSell = 0, sumMargin = 0, sumQty = 0, seen = 0, p = 1;
  for (;;) {
    const r = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=${p}&pagination[rowsPerPage]=500`);
    const c = r.body?.data?.collection ?? [];
    for (const x of c) { sumCost += money(x.total_cost); sumSell += money(x.total_sell); sumMargin += money(x.margin); sumQty += money(x.qty); }
    seen += c.length; if (c.length === 0 || seen >= rowsNumber) break; p++;
    if (p > 40) break;
  }
  R.iv.totalsVsFullWalk = { serverTotals: t, rowsNumber, walkedRows: seen,
    walked: { total_cost: +sumCost.toFixed(2), total_sell: +sumSell.toFixed(2), margin: +sumMargin.toFixed(2), qty: +sumQty.toFixed(2) },
    matchesTotalCost: t ? near(money(t.total_cost), sumCost, 1) : null,
    matchesTotalSell: t ? near(money(t.total_sell), sumSell, 1) : null,
    totalsMarginPctRecomputed: t && money(t.total_sell) ? +((money(t.margin) / money(t.total_sell)) * 100).toFixed(1) : null,
    totalsMarginPctReported: t?.margin_pct ?? null };
}

// pagination + sort behaviour (S1-R8, S9-R1..R3)
{
  const first = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=10`);
  const second = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=2&pagination[rowsPerPage]=10`);
  const pick = r => (r.body?.data?.collection ?? []).map(x => `${x.part_number}|${x.total_cost}`);
  R.iv.pagination = { page1: pick(first), page2: pick(second), pageSizeHonoured: pick(first).length,
    pagination1: first.body?.data?.pagination, pagination2: second.body?.data?.pagination };
  R.iv.defaultSortDesc = (() => { const v = (first.body?.data?.collection ?? []).map(x => money(x.total_cost));
    return { values: v.slice(0, 6), isDescending: v.every((x, i) => i === 0 || v[i - 1] >= x) }; })();
  for (const [col, desc] of [['part_number', 'false'], ['part_number', 'true'], ['total_cost', 'false'], ['description', 'false'], ['margin_pct', 'true']]) {
    const r = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=6&pagination[sortBy]=${col}&pagination[descending]=${desc}`);
    R.iv[`sort_${col}_${desc}`] = (r.body?.data?.collection ?? []).map(x => `${x.part_number} | ${x.description?.slice(0, 22)} | ${x.total_cost} | ${x.margin_pct}`);
  }
}

// filters: category / vendor / search, all server-side; first page reset
{
  const cats = await g('/api/reporting/reports/inventory-value/filters');
  R.iv.filtersEndpoint = { status: cats.status, keys: Object.keys(cats.body?.data ?? {}), body: JSON.stringify(cats.body).slice(0, 300) };
  const base = `${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=5`;
  const all = await g(base);
  const rn = o => o.body?.data?.pagination?.rowsNumber ?? null;
  const sample = (all.body?.data?.collection ?? [])[0] ?? {};
  R.iv.filterProbe = { allRows: rn(all), sampleCategory: sample.category, sampleVendor: sample.vendor };
  if (sample.category) {
    const r = await g(`${base}&categories=${encodeURIComponent(sample.category)}`);
    R.iv.filterProbe.byCategoryName = { status: r.status, rows: rn(r), firstCat: r.body?.data?.collection?.[0]?.category };
  }
  const s = await g(`${base}&search=BRAKE`);
  R.iv.filterProbe.bySearchBRAKE = { status: s.status, rows: rn(s),
    allMatch: (s.body?.data?.collection ?? []).every(x => /BRAKE/i.test(`${x.part_number} ${x.description}`)),
    firstRows: (s.body?.data?.collection ?? []).slice(0, 3).map(x => `${x.part_number} | ${x.description}`) };
  const sTotals = s.body?.data?.totals;
  R.iv.filterProbe.searchRecomputesTotals = { all: all.body?.data?.totals?.total_cost, searched: sTotals?.total_cost };
  const lower = await g(`${base}&search=brake`);
  R.iv.filterProbe.caseInsensitive = { upper: rn(s), lower: rn(lower), equal: rn(s) === rn(lower) };
  const desc = await g(`${base}&search=${encodeURIComponent('ROLLING LOBE')}`);
  R.iv.filterProbe.searchesDescription = { rows: rn(desc), first: desc.body?.data?.collection?.[0]?.description };
}

// as-of / history (S5-R2..R6, S5-N1, S11)
R.iv.asOf = {};
for (const [label, qs] of [
  ['today', 'range=custom&start_date=2026-08-04&end_date=2026-08-04'],
  ['yesterday', 'range=custom&start_date=2026-08-03&end_date=2026-08-03'],
  ['this month', 'range=custom&start_date=2026-08-01&end_date=2026-08-04'],
  ['last month', 'range=custom&start_date=2026-07-01&end_date=2026-07-31'],
  ['2026-01', 'range=custom&start_date=2026-01-01&end_date=2026-01-31'],
  ['2020 (before capture began)', 'range=custom&start_date=2020-01-01&end_date=2020-01-31'],
  ['future', 'range=custom&start_date=2027-01-01&end_date=2027-01-31'],
  ['no range param', ''],
]) {
  const r = await g(`${I}?${qs}${qs ? '&' : ''}locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=3`);
  R.iv.asOf[label] = { status: r.status, as_of_date: r.body?.data?.as_of_date ?? null,
    rows: r.body?.data?.pagination?.rowsNumber ?? null,
    totalCost: r.body?.data?.totals?.total_cost ?? null,
    err: r.status !== 200 ? JSON.stringify(r.body).slice(0, 200) : null };
}

// core-charge exclusion (S2-N1) — is the "R134A-CORE" row a core charge?
{
  const r = await g(`${I}?${IVR}&locations=${HD}&search=CORE&pagination[page]=1&pagination[rowsPerPage]=50`);
  R.iv.coreRows = (r.body?.data?.collection ?? []).slice(0, 12).map(x => ({ part: x.part_number, desc: x.description, cat: x.category, qty: x.qty }));
  // cross-check against the parts catalogue for a core flag
  const p = await g('/api/inventory/parts?search=R134A-CORE&limit=5');
  R.iv.coreCatalogueLookup = { status: p.status, body: JSON.stringify(p.body).slice(0, 900) };
}

fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT);
console.log('WIP calc:', JSON.stringify(R.wip.calcContract, null, 1).slice(0, 900));
console.log('WIP spanLimit:', JSON.stringify(R.wip.spanLimit));
console.log('IV calc:', JSON.stringify(R.iv.calcContract, null, 1).slice(0, 700));
console.log('IV asOf:', JSON.stringify(R.iv.asOf, null, 1).slice(0, 1400));
