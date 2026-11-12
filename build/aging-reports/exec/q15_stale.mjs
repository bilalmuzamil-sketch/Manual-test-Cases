// q15_stale.mjs — 12 Nov 2026. QA lead: "I will follow your recommendation [no ticket for 'offline keeps the previous rows under the new date'] IF this
// issue on the QA branch does not show the wrong data in any other use case too." So: on every one of the six aging reports, every filter/sort/expand
// action is done (a) with the connection OFF (real setOffline, nothing intercepted - L0695; browser cache disabled) and (b) on a SLOW connection
// (5 s added to every request, online) - and the screen is read right after the action, then again once the data can arrive. Wrong data = a chip/sort
// that says one thing while the rows still show the previous result, with no loading sign. Per check: rows before / right after / after recovery,
// chips, requests sent, loading bar visible, any message, a picture. Output q15/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { settle } from './q3_common.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL(process.env.OUTDIR || './q15/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const ctx = p.context(); const S = mkSort(p); const F = mkFilt(p);
const cdp = await ctx.newCDPSession(p); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
const NET = []; p.on('request', (q) => { if (/\/api\/reporting\/reports\//.test(q.url())) NET.push(q.url().replace(/^.*\/reports\//, '').slice(0, 80)); });
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].slice(0, 6).map((tr) => tr.innerText.replace(/\s+/g, ' ').trim().slice(0, 90)));
const state = async () => ({ chips: await F.chips(), rows: await rows(), bar: await p.evaluate(() => [...document.querySelectorAll('.q-linear-progress, .q-loading-bar, .q-spinner, .q-inner-loading')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0'; }).map((e) => String(e.getAttribute('class') || '').slice(0, 40))), msg: ((await p.locator('main').innerText().catch(() => '')).match(/Something went wrong[^.]*\.|Not every line loaded[^.]*\./) || [null])[0], notes: (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ')) });
const yd = String(new Date(Date.now() - 864e5).getDate());
const R = { ars: ['Customer', 'ZZAUTOTEST LOC MIX'], ard: ['Customer', 'ZZAUTOTEST LOC MIX'], arc: ['Customer', 'ZZAUTOTEST LOC MIX'], aps: ['Vendor', 'ZZAUTOTEST LOC MIX V'], apd: ['Vendor', 'ZZAUTOTEST LOC MIX V'], apu: ['Vendor', 'ZZAUTOTEST LOC MIX V'] };
const ACTIONS = { date: () => F.asOf(yd), pastdue: () => F.menuClick('Past due', '1-30 days'), location: () => F.menuClick('Location', 'Staging Heavy Duty - 9919'),
  who: (k) => F.pick(R[k][0], R[k][1]),
  sort: async () => { /* run 1's header click never registered (rows unchanged even after recovery) - use sortlib.clickTh on a money column, as the passed sort tests did */ const th = (await S.ths()).map((h) => h.t); const lab = ['Total', 'Amount', 'Open Balance', 'Balance'].find((x) => th.includes(x)) || th.at(-1); await S.clickTh(lab); await p.waitForTimeout(1500); return lab; },
  expand: async (k) => /d$/.test(k) ? S.expand(/1-30 days past due/) : 'n/a' };
const o = { offline: {}, slow: {} };
for (const mode of ['offline', 'slow']) for (const k of Object.keys(R)) for (const act of Object.keys(ACTIONS)) {
  if (process.env.ONLY && !process.env.ONLY.split(',').includes(k + '.' + act)) continue; if (act === 'expand' && !/d$/.test(k)) continue;
  const q = (o[mode][k + '.' + act] = {});
  try { await s.go(REPORTS[k]); await p.waitForTimeout(2500); await settle(p); q.before = await state(); NET.length = 0;
    if (mode === 'offline') await ctx.setOffline(true); else await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 5000, downloadThroughput: -1, uploadThroughput: -1 });
    q.ret = String(await ACTIONS[act](k)).slice(0, 60); await p.waitForTimeout(mode === 'slow' ? 300 : 3000); q.during = await state(); q.reqDuring = [...NET]; q.pDuring = await s.shot(`${mode}-${k}-${act}-during`);
    if (mode === 'offline') await ctx.setOffline(false); else await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await p.waitForTimeout(mode === 'slow' ? 12000 : 7000); await settle(p); q.after = await state(); q.reqAfter = NET.length;
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    q.chipChanged = !same(q.before.chips, q.during.chips) || act === 'sort' || act === 'expand'; q.rowsSameDuring = same(q.before.rows, q.during.rows); q.rowsChangeAfter = !same(q.during.rows, q.after.rows);
    q.verdict = q.during.msg ? 'message' : (q.chipChanged && q.rowsSameDuring && q.rowsChangeAfter && !q.during.bar.length) ? 'OLD ROWS UNDER NEW CHOICE, NO SIGN' : (q.during.bar.length ? 'loading sign shown' : (q.rowsSameDuring && !q.rowsChangeAfter ? 'no visible change needed' : 'rows changed'));
    if (q.verdict.startsWith('OLD') || q.verdict === 'loading sign shown') q.pAfter = await s.shot(`${mode}-${k}-${act}-after`);
  } catch (e) { q.err = String(e).slice(0, 200); await ctx.setOffline(false).catch(() => {}); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }).catch(() => {}); }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(mode, k, act, q.verdict || q.err, 'bar:', JSON.stringify(q.during?.bar), 'req:', q.reqDuring?.length);
}
await s.close(); process.exit(0);
