// s80_cancel_scroll.mjs — 11 Nov 2026: C715418 (A/R Collection, Cancel) and C797944 (A/R Detail, ×) as the cases set them up. s78 filtered
// and never scrolled, so "the same rows at the top and bottom of the screen (the same scroll position)" was not observed. Here:
// C715418: all customers, "Past due: 1-30 days", Amount once, customer A's (ZZAUTOTEST LOC MIX) group expanded; C797944: customer A ticked,
// Amount once, every bucket expanded. Then invoice A (S11315-17724, Lethbridge) is scrolled to the middle of the table, and before/after
// the dialog we read: address, chips, sorted column, scrollTop, the first and last rows fully visible, notifications, header location.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s80/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p);
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null; const INV = 'S11315-17724';
const shot = async (o, n) => { const f = await s.shot(o.id + '-' + n); (o.shots ||= []).push({ name: n, f }); };
const dialog = async () => (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' ');
const view = () => p.evaluate(`(() => { const e = ${S.SC}; const r = e.getBoundingClientRect(); const head = document.querySelector('main thead'); const hb = head ? head.getBoundingClientRect().bottom : r.top;
  const rows = [...document.querySelectorAll('main tbody tr')].map((t) => ({ t: t.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), b: t.getBoundingClientRect() })).filter((x) => x.b.top >= hb - 1 && x.b.bottom <= r.bottom + 1 && x.t);
  return { top: e.scrollTop, first: rows[0]?.t || null, last: rows[rows.length - 1]?.t || null, n: rows.length }; })()`);
const state = async () => ({ url: p.url(), chips: await F.chips(), sorted: await S.sorted(), view: await view(), notes: await p.locator('.q-notification').allInnerTexts().catch(() => []), dialog: await dialog(), switcher: (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-40) });
const T = {};
for (const [id, close] of [['C715418', 'Cancel'], ['C797944', 'x']]) T[id] = async (o) => { const rep = id === 'C715418' ? 'arc' : 'ard'; await s.go(REPORTS[rep]); await p.waitForTimeout(3000);
  if (id === 'C715418') { await F.menuClick('Past due', '1-30'); await p.waitForTimeout(2000); await S.clickTh('Amount'); await S.expand(/ZZAUTOTEST LOC MIX \(/); }
  else { await F.pick('Customer', 'ZZAUTOTEST LOC MIX'); await S.clickTh('Amount'); const b = p.locator('main thead th').first().locator('button').first(); await b.hover(); await p.waitForTimeout(600); if (/Expand all/.test((await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join())) { await b.click(); await p.waitForTimeout(3000); } }
  const row = p.locator('main tbody tr').filter({ hasText: INV }).first(); o.found = await row.count(); if (!o.found) throw new Error('invoice A not on screen');
  await row.scrollIntoViewIfNeeded(); await p.evaluate(`(() => { const e = ${S.SC}; const t = [...document.querySelectorAll('main tbody tr')].find((x) => x.innerText.includes('${INV}')); const r = e.getBoundingClientRect(); const b = t.getBoundingClientRect(); e.scrollTop += (b.top + b.height / 2) - (r.top + r.height / 2); })()`); await p.waitForTimeout(1500);
  o.before = await state(); await shot(o, '0-before');
  await row.locator('a').first().click(); await p.waitForTimeout(2000); o.dialog = await dialog(); o.hasX = await p.locator('.q-dialog button').filter({ hasText: /^close$|^×$/ }).count(); await shot(o, '2-dialog');
  if (close === 'Cancel') await p.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }).click(); else await p.locator('.q-dialog button').filter({ hasText: /^close$|^×$/ }).first().click(); await p.waitForTimeout(2500);
  o.after = await state(); await shot(o, '3-after'); o.same = { url: o.before.url === o.after.url, chips: JSON.stringify(o.before.chips) === JSON.stringify(o.after.chips), sorted: JSON.stringify(o.before.sorted) === JSON.stringify(o.after.sorted), top: o.before.view.top === o.after.view.top, first: o.before.view.first === o.after.view.first, last: o.before.view.last === o.after.view.last }; };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id };
  try { await s.go(REPORTS.ard); await p.waitForTimeout(2000); await ensureLoc(p, 'Staging Heavy Duty - 9919'); await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify({ same: o.same, top: o.before?.view?.top })); }
await s.close(); process.exit(0);
