// q16_block.mjs — 12 Nov 2026: proof for the rewritten steps of the ten "connection lost" tests (QA lead 12 Nov "1. i will follow your recommendation":
// testers make the report's data fail with the browser's own request-blocking tool, F12 > More tools > Network request blocking, pattern
// "*reporting/reports*"). That tool is Chrome's Network.setBlockedURLs - used here as is (no interception, no shim), so the run shows exactly what a
// tester sees, including the QA site's own "QA env is sleeping" notice and its redirect. Per report: block, change the as-of date, a picture every
// 0.5 s for 8 s (message? redirect?), unblock. A/R Detail: block, expand "Current". Output q16/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { settle } from './q3_common.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./q16/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p);
const cdp = await p.context().newCDPSession(p); await cdp.send('Network.enable');
const yd = String(new Date(Date.now() - 864e5).getDate()); const o = {};
const read = async () => ({ url: p.url(), msg: ((await p.locator('main').innerText({ timeout: 1500 }).catch(() => '')).match(/Something went wrong[^.]*\.[^.]*\.|Not every line loaded[^.]*\./) || [null])[0], notes: (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ')) });
for (const [k, act] of [['ars', 'date'], ['ard', 'expand']]) { const q = (o[k] = { timeline: [] });
  try { await s.go(REPORTS[k]); await p.waitForTimeout(2500); await settle(p);
    await cdp.send('Network.setBlockedURLs', { urls: ['*reporting/reports*'] }); const t0 = Date.now();
    if (act === 'date') await F.chips().then(() => p.locator('main button', { hasText: /As of:/ }).first().click()).then(() => p.waitForTimeout(800)).then(() => p.locator('.q-menu').last().locator('button, .q-date__calendar-item').filter({ hasText: new RegExp('^' + yd + '$') }).first().click());
    else await S.expand(/^Current/);
    for (let i = 0; i < 16; i++) { await p.waitForTimeout(500); const r = await read(); r.t = Date.now() - t0; q.timeline.push(r); if (i % 2 === 0 || r.msg) await p.screenshot({ path: `${OUT}${k}-${String(r.t).padStart(5, '0')}ms.png` }).catch(() => {}); if (!/sv11315\.qa/.test(r.url)) break; }
  } catch (e) { q.err = String(e).slice(0, 200); }
  await cdp.send('Network.setBlockedURLs', { urls: [] }); q.firstMsgAt = q.timeline.find((r) => r.msg)?.t ?? null; q.leftAt = q.timeline.find((r) => !/sv11315\.qa/.test(r.url))?.t ?? null;
  console.log(k, JSON.stringify({ firstMsgAt: q.firstMsgAt, leftAt: q.leftAt, msg: q.timeline.find((r) => r.msg)?.msg, notes: q.timeline.at(-1)?.notes, err: q.err })); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
