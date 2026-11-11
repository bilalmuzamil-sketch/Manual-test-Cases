// p62c_cache.mjs — 11 Nov 2026 ~16:35: is p62b's "offline, as-of yesterday, no message" a failure to load at all? p62b's A/P Summary picture
// showed Totals $4,763,410.45 under "As of: 11/10/2026" (today's are $4,763,441.95) and the page made NO report request while offline - so the
// figures may be yesterday's, served without the network (prefetched / cached), i.e. nothing failed. Per report (A/R Summary, A/P Summary,
// A/R Detail): (1) fresh page online, as-of 10 -> Totals; (2) fresh page online today, then offline, as-of 10 -> Totals, message, every request
// and failure (any URL, incl. service-worker); (3) same but as-of 6 (a day no runner loads) -> Totals, message. Output p62c/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p62c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
let log = []; p.on('request', (r) => log.push(['req', r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 120), r.serviceWorker() ? 'sw' : ''])); p.on('requestfailed', (r) => log.push(['FAIL', r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 120), r.failure()?.errorText]));
const tot = async () => (await p.locator('main tr').filter({ hasText: /^\s*Totals(\s|$)/ }).last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const msg = async () => (await p.locator('main').innerText()).match(/Something went wrong loading this report[^\n]*/)?.[0] || null;
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' '));
for (const k of ['aps', 'ars', 'ard']) { const r = (o[k] = {}); try {
  await s.go(REPORTS[k]); await p.waitForTimeout(4000); await F.asOf(10); await p.waitForTimeout(4000); r.online10 = await tot();
  for (const day of [10, 6]) { await s.go(REPORTS[k]); await p.waitForTimeout(4000); r['today' + day] = await tot(); log = []; await p.context().setOffline(true); await p.waitForTimeout(500); await F.asOf(day); await p.waitForTimeout(15000);
    r['off' + day] = { tot: await tot(), msg: await msg(), notes: await notes(), chip: (await F.chips())[0], net: log.filter((x) => !/favicon|collect\?/.test(x[1])).slice(0, 15) }; await s.shot(k + '-offline-' + day); await p.context().setOffline(false); await p.waitForTimeout(2000); }
} catch (e) { r.err = String(e).slice(0, 200); try { await p.context().setOffline(false); } catch {} } fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
console.log('p62c', JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { on10: v.online10?.slice(-30), off10: v.off10 && [v.off10.tot.slice(-30), v.off10.msg, v.off10.net.length], off6: v.off6 && [v.off6.tot.slice(-30), v.off6.msg, v.off6.net.length], err: v.err }]))).slice(0, 1200)); await s.close(); process.exit(0);
