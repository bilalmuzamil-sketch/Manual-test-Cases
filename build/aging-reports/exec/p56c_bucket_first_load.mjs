// p56c_bucket_first_load.mjs — 11 Nov 2026: C1062582, third instrument. p56 showed a bucket re-opened on the same page reuses its lines (no
// request), so offline/aborted re-opens prove nothing (L0642). Here every trial opens A/R Detail FRESH and expands "Current" for the first
// time on that page: (A) offline from before the expand; (B) online with only the bucket's /rows call aborted; then, still on page B, the
// block is lifted and the bucket is collapsed and expanded again (case steps 3-5). Logs every request/response/failure + console errors,
// polls 40 s for "Something went wrong loading this bucket...", pictures at 3 s and at the end.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./p56c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const o = {};
let log = []; const t0 = { v: Date.now() }; const rel = () => Date.now() - t0.v;
p.on('request', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'req', r.method(), r.url().replace(/^.*\/api/, '/api').slice(0, 170)]); });
p.on('response', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'res', r.status(), r.url().replace(/^.*\/api/, '/api').slice(0, 170)]); });
p.on('requestfailed', (r) => log.push([rel(), 'FAIL', r.failure()?.errorText, r.url().replace(/^.*\/api/, '/api').slice(0, 170)]));
p.on('console', (m) => { if (m.type() === 'error') log.push([rel(), 'console', m.text().slice(0, 200)]); });
const ROWS = /\/buckets\/current\/rows/; const lines = async () => (await p.locator('main tbody tr').allInnerTexts()).filter((t) => /^[A-Z][a-z]{2} \d/.test(t.trim())).length;
const msg = async () => (await p.locator('main').innerText()).match(/Something went wrong[^\n]*/)?.[0] || null;
async function expandPoll(name) { log = []; t0.v = Date.now(); const r = { name }; r.state0 = (await p.locator('main tbody tr').filter({ hasText: /Current \(/ }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  r.expand = await S.expand(/Current \(/); await p.waitForTimeout(500); await s.shot(name + '-3s'); r.m = null; for (let i = 0; i < 40 && !r.m; i++) { r.m = await msg(); if (!r.m) await p.waitForTimeout(1000); }
  r.msgAtMs = r.m ? rel() : null; r.lines = await lines(); r.rows = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => /Current|Something|Total for Current/.test(t)).slice(0, 6);
  await s.shot(name + '-end'); r.net = log.filter((x) => !/fe-permissions|notifications/.test(x[3] || '')).slice(0, 40); o[name] = r; fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p56c', name, JSON.stringify({ m: r.m, lines: r.lines, state0: r.state0.slice(0, 40), net: r.net.map((x) => x[1] + ' ' + x[2]).join(',') })); return r; }
try {
  await s.go(REPORTS.ard); await p.waitForTimeout(4000); await p.context().setOffline(true); await p.waitForTimeout(500); await expandPoll('A-offline-first-open'); await p.context().setOffline(false); await p.waitForTimeout(1500);
  await p.route((u) => ROWS.test(u.toString()), (rt) => rt.abort('failed')); await s.go(REPORTS.ard); await p.waitForTimeout(4000); await expandPoll('B-rows-blocked-first-open');
  await p.unrouteAll?.().catch(() => {}); await S.collapse(/^\S*\s*Current \(/); await p.waitForTimeout(1500); await expandPoll('C-unblocked-collapse-expand');
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p56c done', o.err || ''); await s.close(); process.exit(0);
