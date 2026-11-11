// s1_check.mjs — 11 Nov 2026: folder S1 "Reports open in QuickBooks name order" readings on sv11315 (run 557). For each report: which
// heading carries the sorted mark (read from the header cell's own classes/aria-sort and the arrow icon's state, positive control = the
// other headings), and the full list of names in screen order (the table is scrolled until no more rows load). Then exports PDF+CSV of
// A/R and A/P Summary and a reload, for the capitals tests. Output exec/s1/ (readings s1.json + pictures).
import { start, REPORTS, T } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const sortState = () => p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => ({ text: th.innerText.replace(/\\s+/g,' ').replace(/arrow_drop_up|arrow_drop_down|keyboard_arrow_right|keyboard_arrow_down/g,'').trim(), cls: th.className, aria: th.getAttribute('aria-sort'), icon: (() => { const i = th.querySelector('.q-table__sort-icon, i'); if (!i) return null; const cs = getComputedStyle(i); return { cls: i.className, op: cs.opacity, tr: cs.transform, vis: cs.visibility }; })() }))`);
// The table draws only the rows near the scroll position (virtual scroll), so rows are COLLECTED at every step (in screen order, by
// first appearance) — reading only at the end lost the top rows (first run 11 Nov).
const scrollAll = async () => { const seen = []; const has = new Set(); let stall = 0;
  const sc = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
  await p.evaluate(`${sc}.scrollTop = 0`); await p.waitForTimeout(800);
  for (let i = 0; i < 400 && stall < 4; i++) { const rs = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => tr.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)`);
    let added = 0; for (const r of rs) if (!has.has(r)) { has.add(r); seen.push(r); added++; }
    const moved = await p.evaluate(`(() => { const e = ${sc}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`);
    await p.waitForTimeout(700); stall = (!moved && !added) ? stall + 1 : 0; }
  return seen; };
for (const k of ['ars', 'aps']) { await s.go(REPORTS[k]); await p.waitForTimeout(2500); o[k] = { list: await scrollAll() }; await s.shot(k + '-scrolled'); }
const prev = JSON.parse(fs.readFileSync(OUT + 's1.json')); for (const k of Object.keys(prev)) o[k] = { ...prev[k], ...(o[k] || {}) }; s.save('s1', o);
for (const [k, v] of Object.entries(o)) console.log(k, v.sort.map((h) => h.text + (/sorted/.test(h.cls) ? '[SORTED]' : '') + (h.aria ? '[aria ' + h.aria + ']' : '')).join(' | '), '· rows', v.list ? v.list.length : '-');
await s.close(); process.exit(0);
