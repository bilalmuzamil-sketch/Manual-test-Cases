// s1b_sort.mjs — 11 Nov 2026: run C715280 (A/R Detail), C715281 (A/P Detail), C715282 (A/R Collection), C715283 (A/P Unpaid) on the
// seeded data of p20/p20b: bucket order (collapsed), the sorted-column mark (aria-sort on the th), then expand the "1-30 days past due"
// bucket / the Alpha group and read the rows in screen order (virtual scroll: rows collected while scrolling). Pictures + row boxes for
// annotation. Output exec/s1b/.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1b/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
const trs = () => p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => tr.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)`);
const ths = () => p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => ({ t: th.innerText.replace(/\\s+/g,' ').trim(), aria: th.getAttribute('aria-sort'), cls: th.className }))`);
async function scrollTo(re) { await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(600);
  for (let i = 0; i < 300; i++) { const loc = p.locator('main tbody tr').filter({ hasText: re }).first(); if (await loc.count()) { await loc.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); return loc; }
    const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(600); if (!moved) break; } return null; }
async function collect() { const seen = [], has = new Set(); let stall = 0; await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(600);
  for (let i = 0; i < 400 && stall < 4; i++) { const rs = await trs(); let add = 0; for (const r of rs) if (!has.has(r)) { has.add(r); seen.push(r); add++; }
    const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(600); stall = (!moved && !add) ? stall + 1 : 0; } return seen; }
const boxes = async (res) => { const b = {}; for (const [k, re] of Object.entries(res)) { const l = p.locator('main tbody tr').filter({ hasText: re }).first(); if (await l.count()) { const bb = await l.boundingBox(); if (bb) b[k] = [Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height)]; } } return b; };
const plan = [
  { id: 'C715280', r: 'ard', sortCol: 'Customer Full Name', open: /1-30 days past due/, who: /ZZAUTOTEST S1R5 (Alpha|Bravo)/, marks: { invB: /11315-7195/, invC: /11315-17611/, invA_bravo: /11315-17612/ } },
  { id: 'C715281', r: 'apd', sortCol: 'Vendor Name', open: /1-30 days past due/, who: /ZZAUTOTEST S1R5 V (Alpha|Bravo)/, marks: { billB: /\b9917\b/, billC: /\b10023\b/, billA_bravo: /ZZBR-1/ } },
  { id: 'C715282', r: 'arc', sortCol: 'Date', open: /ZZAUTOTEST S1R5 Alpha/, groups: /ZZAUTOTEST S1R5 (Alpha|Bravo)/, who: /11315-(17610|7195|17611)/, marks: { grpAlpha: /ZZAUTOTEST S1R5 Alpha/, grpBravo: /ZZAUTOTEST S1R5 Bravo/, invA: /11315-17610/, invB: /11315-7195/, invC: /11315-17611/ } },
  { id: 'C715283', r: 'apu', sortCol: 'Date', open: /ZZAUTOTEST S1R5 V Alpha/, groups: /ZZAUTOTEST S1R5 V (Alpha|Bravo)/, who: /ZZAL-A|\b9917\b|\b10023\b/, marks: { grpAlpha: /ZZAUTOTEST S1R5 V Alpha/, grpBravo: /ZZAUTOTEST S1R5 V Bravo/, billA: /ZZAL-A/, billB: /\b9917\b/, billC: /\b10023\b/ } },
];
for (const t of plan) { const x = (o[t.id] = {});
  await s.go(REPORTS[t.r]); await p.waitForTimeout(3000); x.chips = await s.chips(); x.collapsed = (await trs()).slice(0, 12); x.ths = await ths();
  if (t.groups) x.groupOrder = (await collect()).filter((r) => t.groups.test(r));
  x.collapsedShot = await s.shot(t.id + '-collapsed');
  const row = await scrollTo(t.open); x.found = !!row;
  if (row) { await row.locator('button, i.q-icon').first().click(); await p.waitForTimeout(3500); await row.scrollIntoViewIfNeeded();
    const all = await collect(); x.openRows = all.filter((r) => t.who.test(r)); x.allCount = all.length;
    const r2 = await scrollTo(t.open); if (r2) await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = Math.max(0, e.scrollTop - 60); })()`); await p.waitForTimeout(500);
    const first = p.locator('main tbody tr').filter({ hasText: t.who }).first(); if (await first.count()) { await first.scrollIntoViewIfNeeded(); await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = e.scrollTop + 150; })()`); await p.waitForTimeout(600); }
    x.openShot = await s.shot(t.id + '-open'); x.boxes = await boxes(t.marks); x.thBoxes = await p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => { const b = th.getBoundingClientRect(); return [th.innerText.trim(), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; })`);
  }
  s.save('s1b', o); console.log(t.id, 'found', x.found, '| sorted th', x.ths.filter((h) => h.aria && h.aria !== 'none').map((h) => h.t + ':' + h.aria).join(','), '| groups', JSON.stringify(x.groupOrder || null).slice(0, 200), '| rows', JSON.stringify(x.openRows || null).slice(0, 700));
}
await s.close(); process.exit(0);
