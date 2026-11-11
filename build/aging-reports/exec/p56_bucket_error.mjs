// p56_bucket_error.mjs — 11 Nov 2026: C1062582 instrument proof (Rule 104) before any verdict. s4f expanded "Current" on A/R Detail with the
// browser offline and saw no lines and no "Something went wrong loading this bucket..." message for 40 s, and recorded no failed bucket call -
// so it is not yet known whether the expand asked the server at all. This records EVERY request, response and failure (any URL) around three
// expands: (1) online, as the positive control (which call loads the lines?); (2) offline (setOffline); (3) online but that exact call made to
// fail (page.route abort), the deterministic version of "cannot load". Polls 40 s for the message each time; pictures at 3 s and at the end.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./p56/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const o = {};
let log = []; const t0 = { v: Date.now() }; const rel = () => Date.now() - t0.v;
p.on('request', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'req', r.method(), r.url().replace(/^.*\/api/, '/api').slice(0, 160)]); });
p.on('response', (r) => { if (/sv11315api/.test(r.url())) log.push([rel(), 'res', r.status(), r.url().replace(/^.*\/api/, '/api').slice(0, 160)]); });
p.on('requestfailed', (r) => log.push([rel(), 'FAIL', r.failure()?.errorText, r.url().replace(/^.*\/api/, '/api').slice(0, 160)]));
const lines = async () => (await p.locator('main tbody tr').allInnerTexts()).filter((t) => /^[A-Z][a-z]{2} \d/.test(t.trim())).length;
const msg = async () => (await p.locator('main').innerText()).match(/Something went wrong[^\n]*/)?.[0] || null;
async function trial(name, before, after) { await S.collapse(/^\S*\s*Current \(/); await p.waitForTimeout(1000); if (before) await before(); log = []; t0.v = Date.now(); const r = { name };
  r.expand = await S.expand(/Current \(/); await p.waitForTimeout(500); await s.shot(name + '-3s'); r.m = null; for (let i = 0; i < 40 && !r.m; i++) { r.m = await msg(); if (!r.m) await p.waitForTimeout(1000); } r.msgAtMs = r.m ? rel() : null;
  r.lines = await lines(); r.rowText = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => /Current|Something|Total for Current/.test(t)).slice(0, 6); await s.shot(name + '-end'); r.net = log.slice(0, 40); if (after) await after(); o[name] = r; fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p56', name, JSON.stringify({ m: r.m, lines: r.lines, net: r.net.length })); return r; }
try {
  await s.go(REPORTS.ard); await p.waitForTimeout(3000);
  const ctl = await trial('1-online-control'); const call = ctl.net.find((x) => x[1] === 'req' && /bucket|aging|detail/i.test(x[3])); o.bucketCall = call ? call[3] : null;
  await trial('2-offline', async () => { await p.context().setOffline(true); }, async () => { await p.context().setOffline(false); await p.waitForTimeout(1500); });
  const pat = o.bucketCall ? new RegExp(o.bucketCall.split('?')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[0-9a-f-]{36}/g, '[^/?]+')) : /buckets/;
  await trial('3-call-aborted', async () => { await p.route((u) => pat.test(u.toString()), (rt) => rt.abort('failed')); }, async () => { await p.unroute(() => true).catch(() => {}); await p.unrouteAll?.().catch(() => {}); });
  await trial('4-online-again');
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p56 done', o.err || '', o.bucketCall); await s.close(); process.exit(0);
