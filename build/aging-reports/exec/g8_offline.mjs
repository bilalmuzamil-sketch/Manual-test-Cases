// g8_offline.mjs — 12 Nov 2026 (QA lead: "retest ALL the tests which is in blocked status"): the ten offline tests, re-run with a REAL network drop
// (context.setOffline) and ONLY the QA site's own redirect neutralised. The QA bundle's axios error handler (index.*.js, read 12 Nov, kept in the
// scratchpad, not committed) has one QA-only branch: `if(!a.response && env==="qa" && message==="Network Error") { toast "QA env is sleeping",
// setTimeout(() => location.href = <sleep page>, ms); return Promise.reject(a) }` - the error still reaches the report as usual; only the page is
// then sent away. Here every top-level navigation away from sv11315 is answered 204 (a 204 navigation leaves the page where it is), so what the
// REPORT does with the failure can be seen. Positive controls: `sleepNav` counts the redirects the site attempted (proves the drop hit the app's
// error path), and after going back online the same action must load rows (the instrument works both ways). Production has no such branch: there
// the same error goes to the next lines of the same handler (the standard error toast with the error's message). Output g8/<id>.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { settle } from './q3_common.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const REAL = process.env.MODE === 'real'; /* MODE=real (12 Nov): a REAL drop (setOffline: navigator.onLine false + every request fails) and ONLY the sleep page intercepted - the faithful version of "switch Wi-Fi off" */
const OUT = new URL(REAL ? './g9/' : './g8/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const ctx = p.context(); const S = mkSort(p); const F = mkFilt(p);
const ONLY = process.env.ONLY?.split(','); let sleepNav = []; const NET = []; /* instrument proof (Rule 104): every reporting request, its failure or answer */
p.on('request', (q) => { if (/\/api\/reporting\//.test(q.url())) NET.push(['req', Date.now(), q.url().replace(/^.*\/api/, '')]); });
p.on('requestfailed', (q) => { if (/\/api\//.test(q.url())) NET.push(['fail', Date.now(), q.url().replace(/^.*\/api/, ''), q.failure()?.errorText]); });
p.on('response', (r) => { if (/\/api\/reporting\//.test(r.url())) NET.push(['resp', Date.now(), r.url().replace(/^.*\/api/, ''), r.status(), r.fromServiceWorker()]); });
/* 12 Nov trial 2 (net log): with a route active, setOffline did NOT stop requests (they got 200 while "offline"). So the drop is made here too:
   while OFF, every request to the app's own hosts fails as ERR_INTERNET_DISCONNECTED (what Chrome gives offline); setOffline still sets navigator.onLine. */
let OFF = false; const _setOff = ctx.setOffline.bind(ctx); ctx.setOffline = async (v) => { OFF = v; if (REAL || process.env.REAL_OFFLINE) await _setOff(v); }; /* trial 4: Chrome's own offline switch let the API calls through untouched (200s, no route call) - the drop is made by the route alone */
/* g9 run 1 was VOID: any Playwright route (even one on the sleep host) puts every request through interception, and intercepted requests ignore
   setOffline (they got 200 "offline"). MODE=real therefore uses raw CDP: Fetch pauses ONLY the sleep page (answered 204), and the drop is
   Network.emulateNetworkConditions offline - nothing else is intercepted, so every other request genuinely fails as offline. */
/* g9 runs 1-2 were VOID: ANY interception (a Playwright route, or CDP Fetch even on the sleep host alone) makes Chrome ignore offline emulation -
   requests got 200 while "offline". MODE=real therefore intercepts NOTHING: a page shim drops only the QA handler's redirect timer
   (`setTimeout(() => window.location.href = <sleep page>, ms)`, read in the QA bundle 12 Nov) and counts it in window.__sleepBlocked (positive
   control: the app's own network-error path ran), and the drop is Playwright's real setOffline (navigator.onLine false, every request fails). */
/* g9 run 4: a fresh fetch failed offline but the report's own request still got 200 - the browser's HTTP cache (the same as-of URL was loaded by earlier runs on this persistent profile). The cache is switched off (no interception). */
let cdp = null; if (REAL) { cdp = await ctx.newCDPSession(p); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); await cdp.send('Network.clearBrowserCache'); }
if (REAL) await ctx.addInitScript(() => { const st = window.setTimeout; window.__sleepBlocked = 0;
  window.setTimeout = function (fn, ms, ...a) { if (typeof fn === 'function' && /location\.href\s*=/.test(String(fn))) { window.__sleepBlocked++; return 0; } return st.call(this, fn, ms, ...a); }; });
if (!REAL) await p.route('**/*', (r) => { const q = r.request(); if (OFF && /sv11315(api)?\.qa\.shopview\.com/.test(q.url()) && !q.isNavigationRequest()) { NET.push(['abort', Date.now(), q.url().replace(/^.*\/api/, '')]); return r.abort('internetdisconnected'); } if (q.isNavigationRequest() && q.frame() === p.mainFrame() && !/sv11315\.qa\.shopview\.com/.test(q.url())) { sleepNav.push(q.url()); return r.fulfill({ status: 204, body: '' }); } return r.fallback(); });
/* trial 3: the report's own requests never reached the page route (the analytics ones did) - qa-branch-boot routes the API host at context level;
   so the drop is ALSO placed on the context, registered last so it runs first there. */
if (!REAL) await ctx.route(/sv11315api\.qa\.shopview\.com/, (r) => { if (OFF) { NET.push(['abort-ctx', Date.now(), r.request().url().replace(/^.*\/api/, '')]); return r.abort('internetdisconnected'); } return r.fallback(); });
const main = async () => (await p.locator('main').innerText({ timeout: 4000 }).catch(() => '')).replace(/\s+/g, ' ');
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
const wait = async (re, n = 20) => { for (let i = 0; i < n; i++) { const t = await main(); const m = t.match(re); if (m) return m[0]; await p.waitForTimeout(500); } return null; };
const box = async (re) => p.evaluate((src) => { const r = new RegExp(src); const el = [...document.querySelectorAll('main *')].filter((e) => r.test(e.textContent || '') && e.children.length < 3).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }, re.source);
const today = new Date(); const dd = String(today.getDate()), yd = String(new Date(Date.now() - 864e5).getDate());
const REP = /Something went wrong loading this report\. Please try again\./, BUK = /Something went wrong loading this bucket\. Collapse and expand it to try again\./, MORE = /Not every line loaded\. Collapse and expand this bucket to try again\./;
async function reportTest(o, path, back) { // offline, as-of to yesterday, online (+ back to today)
  await s.go(path); await p.waitForTimeout(3000); await settle(p); o.rows0 = (await p.locator('main tbody tr').count()); o.p0 = await s.shot(o.id + '-0-online');
  sleepNav = []; NET.push(['OFFLINE', Date.now()]); await ctx.setOffline(true); o.offline = await p.evaluate(() => navigator.onLine === false); o.probe = await p.evaluate(async () => { try { const r = await fetch('https://sv11315api.qa.shopview.com/api/reporting/reports/ar-aging-summary/locations?asOfDate=2026-10-01', { credentials: 'include' }); return 'status ' + r.status; } catch (e) { return 'ERR ' + e.message; } }); /* positive control: a fresh request must fail while offline */ await F.asOf(yd); o.msg2 = await wait(REP); await p.waitForTimeout(1500);
  o.notes2 = await notes(); o.chip2 = (await F.chips()).find((c) => /As of/.test(c)); o.box2 = await box(REP); o.url2 = p.url(); o.sleepNav2 = [...sleepNav]; o.sleepBlocked2 = await p.evaluate(() => window.__sleepBlocked).catch(() => null); o.p2 = await s.shot(o.id + '-2-offline');
  await ctx.setOffline(false); await p.waitForTimeout(1500); o.p3 = await s.shot(o.id + '-3-online-again');
  if (back) { await F.asOf(dd); await p.waitForTimeout(3000); await settle(p); o.msg4 = (await main()).match(REP)?.[0] || null; o.rows4 = await p.locator('main tbody tr').count(); o.chip4 = (await F.chips()).find((c) => /As of/.test(c)); o.p4 = await s.shot(o.id + '-4-today-again'); }
}
const T = {
  C715442: (o) => reportTest(o, REPORTS.arc, true), C715443: (o) => reportTest(o, REPORTS.aps, true),
  C715633: (o) => reportTest(o, REPORTS.ars, false), C715634: (o) => reportTest(o, REPORTS.ard, false), C715635: (o) => reportTest(o, REPORTS.arc, false),
  C715636: (o) => reportTest(o, REPORTS.aps, false), C715637: (o) => reportTest(o, REPORTS.apd, false), C715638: (o) => reportTest(o, REPORTS.apu, false),
  C1062582: async (o) => { await s.go(REPORTS.ard); await p.waitForTimeout(3000); await settle(p); o.p0 = await s.shot(o.id + '-0-online');
    sleepNav = []; NET.push(['OFFLINE', Date.now()]); await ctx.setOffline(true); o.offline = await p.evaluate(() => navigator.onLine === false); o.exp = await S.expand(/^Current/); o.msg2 = await wait(BUK); await p.waitForTimeout(1500); o.notes2 = await notes(); o.box2 = await box(BUK); o.url2 = p.url(); o.sleepNav2 = [...sleepNav]; o.sleepBlocked2 = await p.evaluate(() => window.__sleepBlocked).catch(() => null); o.p2 = await s.shot(o.id + '-2-offline-expand');
    await ctx.setOffline(false); await p.waitForTimeout(1500); o.col = await S.collapse(/^Current/); await p.waitForTimeout(1500); o.p4 = await s.shot(o.id + '-4-collapsed');
    o.exp5 = await S.expand(/^Current/); await p.waitForTimeout(4000); const t5 = await main(); o.msg5 = t5.match(BUK)?.[0] || null; o.lines5 = (t5.match(/\bInvoice\b/g) || []).length; o.p5 = await s.shot(o.id + '-5-expanded-online'); },
  C1062583: async (o) => { await s.go(REPORTS.apd); await p.waitForTimeout(3000); await settle(p);
    const heads = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /days past due \(\d+\)|^.{0,40}Current \(\d+\)/.test(t)));
    o.heads = heads; const big = heads.map((h) => [h, Number((h.match(/\((\d+)\)/) || [])[1])]).filter(([, n]) => n > 100).sort((a, b) => b[1] - a[1])[0]; o.bucket = big?.[0]; if (!big) { o.err = 'no bucket over 100 lines'; return; }
    const name = big[0].replace(/^.*?((\d+-\d+|\d+ or more) days past due|Current)/, '$1').replace(/\s*\(.*/, ''); o.name = name; const re = new RegExp(name.replace(/[-]/g, '\\-'));
    o.exp1 = await S.expand(re); await p.waitForTimeout(4000); o.lines1 = await p.locator('main tbody tr').count(); o.p1 = await s.shot(o.id + '-1-expanded');
    sleepNav = []; NET.push(['OFFLINE', Date.now()]); await ctx.setOffline(true); o.offline = await p.evaluate(() => navigator.onLine === false);
    for (let i = 0; i < 40 && !(await main()).match(MORE); i++) { await p.mouse.move(800, 600); await p.mouse.wheel(0, 1500); await p.waitForTimeout(400); }
    o.msg3 = await wait(MORE, 10); await p.waitForTimeout(1200); o.notes3 = await notes(); o.box3 = await box(MORE); o.url3 = p.url(); o.sleepNav3 = [...sleepNav]; o.sleepBlocked3 = await p.evaluate(() => window.__sleepBlocked).catch(() => null); o.p3 = await s.shot(o.id + '-3-offline-scrolled');
    await ctx.setOffline(false); await p.waitForTimeout(1500); await p.evaluate(() => { const m = document.querySelector('main'); [m, ...m.querySelectorAll('*')].forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); window.scrollTo(0, 0); }); await p.waitForTimeout(800);
    o.col = await S.collapse(re); await p.waitForTimeout(1500); o.p5 = await s.shot(o.id + '-5-collapsed'); o.exp6 = await S.expand(re); await p.waitForTimeout(4000); o.msg6 = (await main()).match(MORE)?.[0] || null; o.lines6 = await p.locator('main tbody tr').count(); o.p6 = await s.shot(o.id + '-6-expanded-again'); },
};
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id }; NET.length = 0;
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); await s.shot(id + '-error'); } finally { await ctx.setOffline(false).catch(() => {}); }
  o.net = [...NET]; fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, JSON.stringify({ off: o.offline, msg2: o.msg2, msg3: o.msg3, notes: o.notes2 || o.notes3, sleep: (o.sleepNav2 || o.sleepNav3 || []).length, shim: o.sleepBlocked2 ?? o.sleepBlocked3, url: o.url2 || o.url3, back: o.msg4 ?? o.msg5 ?? o.msg6, rows4: o.rows4, err: o.err })); }
await s.close(); process.exit(0);
