// p62b_six.mjs — 11 Nov 2026 ~15:40: p62 for the six design tests C715633-C715638 (one per report, as-of to YESTERDAY as the cases say; the
// 500 control routes every /reporting/reports/ call of the page). Copied from p62_report_error.mjs, whose header follows:
// p62_report_error.mjs — 11 Nov 2026: C715442 (A/R Collection) / C715443 (A/P Summary) instrument proof (Rule 104). s78b went offline and
// changed the as-of date: rows stayed and no "Something went wrong loading this report. Please try again." showed - unknown whether the page
// asked the server. Per report, on a FRESH page: (1) offline, as-of to a date never loaded on this page (the 3rd), log every request/failure,
// poll 30 s for the message and the toast; (2) online, the report's own data call answered 500 (route.fulfill, not abort - an aborted call
// sends QA sites to the sleep page, L0646), as-of to the 4th, poll 30 s; (3) no block, as-of back to today - rows load.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p62b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
let log = []; const t0 = { v: 0 }; const rel = () => Date.now() - t0.v;
p.on('request', (r) => { if (/sv11315api/.test(r.url()) && /reporting/.test(r.url())) log.push([rel(), 'req', r.url().replace(/^.*\/api/, '/api').slice(0, 140)]); });
p.on('response', (r) => { if (/sv11315api/.test(r.url()) && /reporting/.test(r.url())) log.push([rel(), 'res', r.status(), r.url().replace(/^.*\/api/, '/api').slice(0, 140)]); });
p.on('requestfailed', (r) => log.push([rel(), 'FAIL', r.failure()?.errorText, r.url().replace(/^.*\/api/, '/api').slice(0, 140)]));
const msg = async () => (await p.locator('main').innerText()).match(/Something went wrong loading this report[^\n]*/)?.[0] || null;
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
async function poll(o2, name) { o2.m = null; o2.notes = []; for (let i = 0; i < 30 && !o2.m; i++) { o2.m = await msg(); for (const n of await notes()) if (!o2.notes.includes(n)) o2.notes.push(n); if (!o2.m) await p.waitForTimeout(1000); } o2.net = log.slice(0, 30); await s.shot(name); }
for (const [cid, rep, slug] of [['C715633', 'ars', 'x'], ['C715634', 'ard', 'x'], ['C715635', 'arc', 'x'], ['C715636', 'aps', 'x'], ['C715637', 'apd', 'x'], ['C715638', 'apu', 'x']]) { const r = (o[cid] = {});
  try { await s.go(REPORTS[rep]); await p.waitForTimeout(4000);
    log = []; t0.v = Date.now(); await p.context().setOffline(true); await p.waitForTimeout(500); await F.asOf(10); r.offline = {}; await poll(r.offline, cid + '-1-offline'); await p.context().setOffline(false); await p.waitForTimeout(2000);
    await s.go(REPORTS[rep]); await p.waitForTimeout(4000); await p.route((u) => /\/reporting\//.test(u.toString()), (rt) => rt.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"ZZAUTOTEST forced"}' }));
    log = []; t0.v = Date.now(); await F.asOf(9); r.server500 = {}; await poll(r.server500, cid + '-2-server-500'); await p.unrouteAll?.().catch(() => {});
    log = []; t0.v = Date.now(); await F.asOf(11); await p.waitForTimeout(4000); r.after = { m: await msg(), rows: await p.locator('main tbody tr').count(), chips: await F.chips() }; await s.shot(cid + '-3-online');
  } catch (e) { r.err = String(e).slice(0, 300); try { await s.shot(cid + '-error'); } catch {} }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p62b', cid, JSON.stringify({ off: r.offline?.m, offNet: r.offline?.net?.length, s500: r.server500?.m, s500notes: r.server500?.notes, after: r.after?.rows, err: r.err })); }
await s.close(); process.exit(0);
