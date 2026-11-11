// s1_check.mjs — 11 Nov 2026: folder S1 "Reports open in QuickBooks name order" readings on sv11315 (run 557). For each report: which
// heading carries the sorted mark (read from the header cell's own classes/aria-sort and the arrow icon's state, positive control = the
// other headings), and the full list of names in screen order (the table is scrolled until no more rows load). Then exports PDF+CSV of
// A/R and A/P Summary and a reload, for the capitals tests. Output exec/s1/ (readings s1.json + pictures).
import { start, REPORTS, T } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const sortState = () => p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => ({ text: th.innerText.replace(/\\s+/g,' ').replace(/arrow_drop_up|arrow_drop_down|keyboard_arrow_right|keyboard_arrow_down/g,'').trim(), cls: th.className, aria: th.getAttribute('aria-sort'), icon: (() => { const i = th.querySelector('.q-table__sort-icon, i'); if (!i) return null; const cs = getComputedStyle(i); return { cls: i.className, op: cs.opacity, tr: cs.transform, vis: cs.visibility }; })() }))`);
const scrollAll = async () => { let last = -1; for (let i = 0; i < 80; i++) { const n = await p.evaluate(`document.querySelectorAll('main tbody tr').length`); if (n === last) break; last = n;
    await p.evaluate(`(() => { const sc = document.querySelector('main .q-table__middle, main .q-virtual-scroll, main .scroll') || document.scrollingElement; sc.scrollTop = sc.scrollHeight; window.scrollTo(0, document.body.scrollHeight); })()`); await p.waitForTimeout(1200); }
  return p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => tr.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)`); };
for (const k of ['ars', 'aps', 'ard', 'apd', 'arc', 'apu']) { await s.go(REPORTS[k]); await p.waitForTimeout(2500); o[k] = { sort: await sortState() }; await s.shot(k + '-open'); }
for (const k of ['ars', 'aps']) { await s.go(REPORTS[k]); await p.waitForTimeout(2500); o[k].list = await scrollAll(); await s.shot(k + '-scrolled'); }
s.save('s1', o); console.log(JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.sort.map((h) => h.text + (/sorted/.test(h.cls) ? '[SORTED]' : '') + (h.aria ? '[aria ' + h.aria + ']' : '')).join(' | ') + ' · rows ' + (v.list?.length ?? '-')]))), null, 1));
await s.close(); process.exit(0);
