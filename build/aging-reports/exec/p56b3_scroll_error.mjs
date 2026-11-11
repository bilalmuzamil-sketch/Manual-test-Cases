// p56b3_scroll_error.mjs — 11 Nov 2026 (p56b with the page-2 call answered 500 instead of aborted: on this QA site an aborted API call is taken as 'QA env is sleeping' and the page is redirected to the sleep page, L0646): C1062583 instrument proof (Rule 104). s4f opened "1-30 days past due" on A/P Detail (496 lines),
// went offline, scrolled to the end and saw 100 lines and no "Not every line loaded. Collapse and expand this bucket to try again." - with no
// failed call recorded (the failure listener was attached after the scrolling). This logs EVERY request/response/failure from before the
// expand: (1) online control - which call loads lines 101-200 when you scroll? (2) offline scroll; (3) online, that exact call aborted.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL(process.env.P56B_OUT || './p56b3/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const o = {};
let log = []; const t0 = { v: Date.now() }; const rel = () => Date.now() - t0.v;
p.on('request', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'req', r.method(), r.url().replace(/^.*\/api/, '/api').slice(0, 200)]); });
p.on('response', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'res', r.status(), r.url().replace(/^.*\/api/, '/api').slice(0, 200)]); });
p.on('requestfailed', (r) => log.push([rel(), 'FAIL', r.failure()?.errorText, r.url().replace(/^.*\/api/, '/api').slice(0, 200)]));
const B = /1-30 days past due/; const lines = async () => (await p.locator('main tbody tr').allInnerTexts()).filter((t) => /^[A-Z][a-z]{2} \d/.test(t.trim())).length;
const msg = async () => (await p.locator('main').innerText()).match(/Not every line loaded[^\n]*/)?.[0] || null;
const toEnd = async () => { for (let i = 0; i < 12; i++) { await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(700); } };
async function trial(name, mid, after) { /* L0642: a re-opened bucket reuses loaded lines, so every trial opens the report fresh */ await s.go(REPORTS.apd); await p.waitForTimeout(3500); log = []; t0.v = Date.now(); const r = { name };
  r.expand = await S.expand(B); await p.waitForTimeout(2500); r.linesOpen = await lines(); if (mid) await mid(); await toEnd(); await s.shot(name + '-scrolled');
  r.m = null; for (let i = 0; i < 30 && !r.m; i++) { r.m = await msg(); if (!r.m) { if (i % 5 === 0) await toEnd(); await p.waitForTimeout(1000); } } r.linesEnd = await lines(); await s.shot(name + '-end');
  r.net = log.filter((x) => !/fe-permissions|notifications|quick-login/.test(x[3])).slice(0, 50); if (after) await after(); o[name] = r; fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
  console.log('p56b', name, JSON.stringify({ m: r.m, open: r.linesOpen, end: r.linesEnd, net: r.net.length })); return r; }
try {
  const ctl = await trial('1-online-control'); const reqs = ctl.net.filter((x) => x[1] === 'req'); o.pageCall = (reqs.find((x) => /pagination%5Bpage%5D=2/.test(x[3])) || reqs[0] || [])[3] || null; /* p56 control: lines come from /api/reporting/reports/<report>/buckets/<bucket>/rows?...pagination%5Bpage%5D=N */
  await trial('2-offline-scroll', async () => { await p.context().setOffline(true); await p.waitForTimeout(500); }, async () => { await p.context().setOffline(false); await p.waitForTimeout(1500); });
  const base = o.pageCall ? o.pageCall.split('?')[0] : 'buckets'; o.abortPattern = base;
  await trial('3-page-call-aborted', async () => { await p.route((u) => u.toString().includes(base) && /pagination%5Bpage%5D=([2-9]|\d\d)/.test(u.toString()), (rt) => rt.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'ZZAUTOTEST forced server error' }) })); }, async () => { await p.unrouteAll?.().catch(() => {}); });
  await trial('4-online-again');
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p56b done', o.err || '', o.pageCall); await s.close(); process.exit(0);
