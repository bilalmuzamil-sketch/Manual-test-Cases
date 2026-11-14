// s16a_columns.mjs — 14 Nov 2026, staging (Karachi browser, 1440 px, QA lead's session): C1145255-C1145258 (columns stay in place when buckets /
// groups open and close: one bucket open, closed, Expand all, Collapse all) and C1145259 (A/R Detail columns while lines load past 100). Records
// every heading's left edge at each step against the collapsed baseline. Pictures per step. Output s16a/out.json.
import { stgStart } from './stglib.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import { M, moved } from './m16.mjs'; import fs from 'fs';
const OUT = new URL('./s16a/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const S = mkSort(p); const m = M(p); const o = {};
const firstGroup = () => p.evaluate(() => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => /keyboard_arrow_right/.test(t.innerText) && !/\(0\)/.test(t.innerText)); return tr ? tr.innerText.replace(/keyboard_arrow_\w+/g, '').trim().split('\n')[0].slice(0, 40) : null; });
async function run(cid, slug) { const q = (o[cid] = { steps: {} }); try { await s.go('/reports/' + slug); await p.waitForTimeout(4500);
  q.steps[1] = { heads: await m.heads(), pic: await s.shot(cid + '-1-collapsed') }; const base = q.steps[1].heads; const g = await firstGroup(); q.group = g;
  const esc = g.replace(/[-()[\]$.*+?^|\\]/g, (c) => '\\' + c); q.exp = await S.expand(new RegExp('^' + esc)); await p.waitForTimeout(3500); q.steps[2] = { heads: await m.heads(), pic: await s.shot(cid + '-2-one-open') }; q.steps[2].moved = moved(base, q.steps[2].heads);
  q.col = await S.collapse(new RegExp('^' + esc)); await p.waitForTimeout(2500); q.steps[3] = { heads: await m.heads(), pic: await s.shot(cid + '-3-closed') }; q.steps[3].moved = moved(base, q.steps[3].heads);
  await m.headerChevron().click(); await p.waitForTimeout(5000); q.steps[4] = { heads: await m.heads(), chevron: await m.headerChevron().innerText().catch(() => null), pic: await s.shot(cid + '-4-expand-all') }; q.steps[4].moved = moved(base, q.steps[4].heads);
  await m.headerChevron().click(); await p.waitForTimeout(3500); q.steps[5] = { heads: await m.heads(), chevron: await m.headerChevron().innerText().catch(() => null), pic: await s.shot(cid + '-5-collapse-all') }; q.steps[5].moved = moved(base, q.steps[5].heads);
} catch (e) { q.err = String(e).slice(0, 300); await s.shot(cid + '-error'); } }
await run('C1145255', 'ar-aging-detail'); await run('C1145256', 'ar-aging-collection'); await run('C1145257', 'ap-aging-detail'); await run('C1145258', 'ap-unpaid-invoices');
{ const cid = 'C1145259', q = (o[cid] = { steps: {} }); try { await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(4500);
  const big = await p.evaluate(() => { const tr = [...document.querySelectorAll('main tbody tr')].map((t) => t.innerText.replace(/keyboard_arrow_\w+/g, '').trim()).map((t) => [t, +(t.match(/\((\d+)\)/) || [0, 0])[1]]).find(([, n]) => n > 100); return tr ? tr[0].split(' (')[0] : null; }); q.bucket = big;
  await S.expand(new RegExp('^' + big.replace(/[-()]/g, (c) => '\\' + c) + ' \\(')); await p.waitForTimeout(4000); q.rows1 = await p.locator('main tbody tr').count(); q.steps[1] = { rows: q.rows1 };
  q.steps[2] = { heads: await m.heads(), pic: await s.shot(cid + '-2-first-100') }; const base = q.steps[2].heads; let n = q.rows1;
  for (let i = 0; i < 30 && n <= q.rows1; i++) { await p.mouse.wheel(0, 2500); await p.waitForTimeout(1200); n = await p.locator('main tbody tr').count(); }
  await p.waitForTimeout(2000); q.rows2 = await p.locator('main tbody tr').count(); q.steps[3] = { rows: q.rows2, heads: await m.heads(), pic: await s.shot(cid + '-3-more-loaded') }; q.steps[3].moved = moved(base, q.steps[3].heads);
} catch (e) { q.err = String(e).slice(0, 300); await s.shot(cid + '-error'); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
for (const [k, q] of Object.entries(o)) console.log(k, JSON.stringify({ group: q.group || q.bucket, err: q.err, rows: [q.rows1, q.rows2], moved: Object.fromEntries(Object.entries(q.steps).map(([st, v]) => [st, v.moved])), chev: [q.steps[4]?.chevron, q.steps[5]?.chevron] }).slice(0, 900));
await s.close(); process.exit(0);
