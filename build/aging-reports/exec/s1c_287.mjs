// s1c_287.mjs — 11 Nov 2026: C715287 on A/R Summary. Customer A = "Abode Trucking & Repair" (its only work order is Paid); customer B =
// "10 Trucking" (one invoice made today, 10 Nov at the location, nothing before; seeded by seed_s1). Read the full list today, then pick
// 9 in the As of calendar and read again. Pictures with row boxes. Output exec/s1c/.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1c/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
async function collect() { const seen = [], has = new Set(); let stall = 0; await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(600);
  for (let i = 0; i < 400 && stall < 4; i++) { const rs = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => tr.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)`); let add = 0; for (const r of rs) if (!has.has(r)) { has.add(r); seen.push(r); add++; }
    const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(600); stall = (!moved && !add) ? stall + 1 : 0; } return seen; }
const box = async (re) => { const l = p.locator('main tbody tr').filter({ hasText: re }).first(); if (!(await l.count())) return null; const b = await l.boundingBox(); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
await s.go(REPORTS.ars); await p.waitForTimeout(3000); o.chips0 = await s.chips();
let rows = await collect(); o.today = { n: rows.length, A: rows.filter((r) => /Abode Trucking/.test(r)), B: rows.filter((r) => /^10 Trucking/.test(r)), around: rows.filter((r) => /^(@|#|-|\d|A-|a1|Ab|Ac|Ad)/.test(r)).slice(0, 14) };
await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(800); o.today.boxB = await box(/^10 Trucking/); o.today.shotTop = await s.shot('today-top');
const ad = p.locator('main tbody tr').filter({ hasText: /^Ac|^Ad|^Af/ }).first(); for (let i = 0; i < 20 && !(await ad.count()); i++) { await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = e.scrollTop + e.clientHeight * 0.5; })()`); await p.waitForTimeout(500); }
if (await ad.count()) { await ad.scrollIntoViewIfNeeded(); await p.waitForTimeout(600); } o.today.shotA = await s.shot('today-A-area'); o.today.rowsA = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => { const b = tr.getBoundingClientRect(); return [tr.innerText.replace(/\\s+/g,' ').trim().slice(0, 60), Math.round(b.y)]; })`);
const n0 = s.net.length; await p.locator('main button', { hasText: /As of:/ }).first().click(); await p.waitForTimeout(1200);
await p.locator('.q-menu').last().locator('button, .q-date__calendar-item').filter({ hasText: /^9$/ }).first().click(); await p.waitForTimeout(3500);
o.chips1 = await s.chips(); o.calls = s.net.slice(n0).map((c) => c.st + ' ' + c.u.replace(/^.*reports\//, '')).slice(0, 5);
rows = await collect(); o.yday = { n: rows.length, B: rows.filter((r) => /^10 Trucking/.test(r)), top: rows.slice(0, 8) };
await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(800); o.yday.shot = await s.shot('yesterday-top'); o.yday.rowsTop = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].slice(0, 10).map(tr => { const b = tr.getBoundingClientRect(); return [tr.innerText.replace(/\\s+/g,' ').trim().slice(0, 60), Math.round(b.y)]; })`);
s.save('s1c', o); console.log(JSON.stringify(o).slice(0, 4000)); await s.close(); process.exit(0);
