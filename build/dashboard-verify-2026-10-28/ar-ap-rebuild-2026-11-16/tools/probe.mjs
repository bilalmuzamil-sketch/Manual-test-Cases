// Probe (16 Nov, A/R + A/P rebuild): build marker, Rule 99 state, live location zones, the requests the
// six aging screens send, and which independent-source endpoints still answer. SECRET-FREE: the session
// lives in the browser context only; nothing secret is printed or saved. Raw bodies -> /tmp/cln/arap/probe/.
// Run: TZ=Asia/Karachi node probe.mjs
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const EV = new URL('../evidence/', import.meta.url).pathname; const RAW = '/tmp/cln/arap/probe/'; fs.mkdirSync(RAW, { recursive: true });
const loc = LOC.HD; const { browser, page } = await boot(loc);
const out = { start: await rule99(page, loc), screen_requests: {}, probes: {} };
const API = 'https://api.staging.shopview.com/api';
const get = p => page.evaluate(async ([A, p]) => { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {} return { s: r.status, j, t: j ? null : t.slice(0, 300) }; }, [API, p]);
const wp = await get('/staff/my-workplaces'); fs.writeFileSync(RAW + 'my-workplaces.json', JSON.stringify(wp.j));
const list = (wp.j?.data?.collection || wp.j?.data || []); out.workplaces = (Array.isArray(list) ? list : []).map(w => ({ id: w.id, name: w.name || w.full_name, tz: w.timezone || w.workplace_timezone }));
const reqs = []; page.on('request', r => { const u = r.url(); if (u.includes('/reporting/reports/')) reqs.push(u.replace(API, '')); });
for (const slug of ['ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices']) {
  reqs.length = 0; await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(5000);
  out.screen_requests[slug] = { url: page.url(), requests: [...new Set(reqs)].slice(0, 12), headers: await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()).filter(Boolean)) };
}
const tz = encodeURIComponent(loc.tz), today = '2026-11-16';
const P = { sum: `/reporting/reports/ar-aging-summary?asOfDate=${today}&timezone=${tz}&pagination[page]=1&pagination[rowsPerPage]=1000`,
  apsum: `/reporting/reports/ap-aging-summary?asOfDate=${today}&timezone=${tz}&pagination[page]=1&pagination[rowsPerPage]=1000`,
  ardet: `/reporting/reports/ar-aging-detail?asOfDate=${today}&timezone=${tz}`,
  ardetrows: `/reporting/reports/ar-aging-detail/buckets/current/rows?asOfDate=${today}&timezone=${tz}&pagination[page]=1&pagination[rowsPerPage]=1000`,
  coll: `/reporting/reports/ar-aging-collection?asOfDate=${today}&timezone=${tz}&pagination[page]=1&pagination[rowsPerPage]=1000`,
  unp: `/reporting/reports/ap-unpaid-invoices?asOfDate=${today}&timezone=${tz}&pagination[page]=1&pagination[rowsPerPage]=1000`,
  locs: `/reporting/reports/ar-aging-summary/locations?asOfDate=${today}&timezone=${tz}` };
for (const [k, p] of Object.entries(P)) { const r = await get(p); fs.writeFileSync(RAW + k + '.json', JSON.stringify(r.j)); const d = r.j?.data; out.probes[k] = { s: r.s, keys: d ? Object.keys(d) : null, n: Array.isArray(d?.collection) ? d.collection.length : null, pagination: d?.pagination, err: r.t || (r.s !== 200 ? r.j : undefined) }; }
const s = JSON.parse(fs.readFileSync(RAW + 'sum.json')); const cid = s?.data?.collection?.[0]?.customerId;
if (cid) { const v = await get(`/customers/view/${cid}`); const acc = v.j?.data?.company?.customer_account_id; out.probes.customer_view = { s: v.s, has_account: !!acc };
  if (acc) { for (const [k, q] of [['unpaid_open', 'openOnly=true'], ['unpaid_all', 'openOnly=false']]) { const r = await get(`/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[page]=1&pagination[rowsPerPage]=50&${q}`); fs.writeFileSync(RAW + k + '.json', JSON.stringify(r.j)); out.probes[k] = { s: r.s, n: r.j?.data?.response?.collection?.length, keys0: Object.keys(r.j?.data?.response?.collection?.[0] || {}) }; }
    const pm = await get(`/customer-payment/list?accountId=${acc}&pagination[page]=1&pagination[rowsPerPage]=50`); fs.writeFileSync(RAW + 'payments.json', JSON.stringify(pm.j)); out.probes.payments = { s: pm.s, n: pm.j?.data?.collection?.length, keys0: Object.keys(pm.j?.data?.collection?.[0] || {}) };
    const dp = await get(`/customer-deposits/list?accountId=${acc}`); fs.writeFileSync(RAW + 'deposits.json', JSON.stringify(dp.j)); out.probes.deposits = { s: dp.s }; } }
const a = JSON.parse(fs.readFileSync(RAW + 'apsum.json')); const vid = a?.data?.collection?.[0]?.vendorId;
if (vid) { const v = await get(`/parts-catalogue/vendor/${vid}`); const acc = v.j?.data?.vendor?.vendor_account_id; out.probes.vendor_view = { s: v.s, has_account: !!acc };
  if (acc) { const r = await get(`/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=${acc}&pagination[page]=1&pagination[rowsPerPage]=50`); fs.writeFileSync(RAW + 'vendor_unpaid.json', JSON.stringify(r.j)); const resp = r.j?.data?.response || r.j?.data; out.probes.vendor_unpaid = { s: r.s, n: resp?.collection?.length, keys0: Object.keys(resp?.collection?.[0] || {}) }; } }
out.end = await rule99(page, loc); save(EV + 'probe.json', out); console.log(JSON.stringify(out, null, 1).slice(0, 6000)); await browser.close();
