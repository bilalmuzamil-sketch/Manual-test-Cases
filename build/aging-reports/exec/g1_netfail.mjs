// g1_netfail.mjs — 12 Nov 2026 01:20 UTC: GENUINENESS check for held drafts 04/05 before any filing (QA lead 12 Nov: never file a defect
// that will later be closed as "not a bug"). Offline on the QA site also wakes the site's own "QA env is sleeping" handler, which production
// does not have. Here the browser stays ONLINE and only the report's own data call fails as a network error (route.abort 'internetdisconnected'):
//   N1 A/R Aging Collection: As of -> 11/03/2026 with the report call failing  (draft 05, PRD S8-R6 message expected)
//   N2 A/R Aging Detail: open "Current" with its rows call failing             (draft 04 first-open, "Something went wrong loading this bucket…")
//   N3 A/P Aging Detail: open "1-30 days past due", scroll with page-2 call failing (draft 04 scroll, "Not every line loaded…")
// For each: messages, any QA-site notice, the bucket/report text, a picture. Output g1/out.json.
import { start, REPORTS } from './lib.mjs'; const ONLY = process.env.ONLY?.split(','); import { mkFilt } from './filt.mjs'; import { settle } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./' + (process.env.OUTDIR || 'g1') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
const mainTxt = async () => (await p.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
const MSG = /Something went wrong loading this (report|bucket)|Not every line loaded/;
const watch = async (q, ms) => { q.seen = []; for (let i = 0; i < ms / 500; i++) { for (const n of await notes()) if (!q.seen.includes(n)) q.seen.push(n); const m = (await mainTxt()).match(MSG); if (m && !q.msg) q.msg = m[0]; await p.waitForTimeout(500); } q.url = p.url(); };
// N1
if (!ONLY || ONLY.includes('N1')) { const q = (o.N1 = {}); try { await s.go(REPORTS.arc); await p.waitForTimeout(4000); await settle(p); let armed = false;
    await p.route(/\/api\/reporting\/reports\/ar-aging-collection(\?|\/)/, (r) => armed ? r.abort('internetdisconnected') : r.continue()); armed = true;
    await F.asOf('3').catch(async (e) => { q.asOfErr = String(e).slice(0, 120); }); await watch(q, 12000); q.chips = await F.chips(); await p.screenshot({ path: OUT + 'N1-arc-netfail.png' }); await p.unroute(/ar-aging-collection/);
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g1 N1', JSON.stringify(q).slice(0, 600)); }
// N2
if (!ONLY || ONLY.includes('N2')) { const q = (o.N2 = {}); try { await s.go(REPORTS.ard); await p.waitForTimeout(4000); await settle(p);
    await p.route(/\/buckets\/[a-z_0-9]+\/rows/, (r) => r.abort('internetdisconnected'));
    await p.locator('main tbody tr').filter({ hasText: /^\s*\S*\s*Current/ }).first().click().catch(async () => { await p.getByText(/^Current \(/).first().click(); }); await watch(q, 10000);
    q.bucket = (await mainTxt()).match(/Current \(\d+\)[^$]{0,200}/)?.[0]; await p.screenshot({ path: OUT + 'N2-ard-bucket-netfail.png' }); await p.unroute(/\/buckets\//);
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g1 N2', JSON.stringify(q).slice(0, 600)); }
// N3
if (!ONLY || ONLY.includes('N3')) { const q = (o.N3 = {}); try { await s.go(REPORTS.apd); await p.waitForTimeout(4000); await settle(p);
    await p.route(/\/buckets\/days_1_to_30\/rows\?.*pagination%5Bpage%5D=([2-9])/, (r) => r.abort('internetdisconnected'));
    await p.getByText(/^1-30 days past due \(/).first().click(); await p.waitForTimeout(4000);
    for (let i = 0; i < 12; i++) { await p.evaluate(() => { const sc = [...document.querySelectorAll('main *')].filter((e) => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (sc) sc.scrollTop += 900; }); await p.waitForTimeout(700); }
    await watch(q, 8000); q.lines = await p.locator('main tbody tr').count(); await p.screenshot({ path: OUT + 'N3-apd-scroll-netfail.png' }); await p.unroute(/\/buckets\//);
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g1 N3', JSON.stringify(q).slice(0, 600)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
