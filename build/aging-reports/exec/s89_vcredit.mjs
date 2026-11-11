// s89_vcredit.mjs — 11 Nov 2026: vendor credits and where they link / which location they show. Seeds (ZZY ... P89, Net 30):
//   V1 "ZZY VCredit Links P89": credit RA from a vendor return at Heavy Duty (current location), RB from a return at Lethbridge, DC entered directly
//      on the vendor's Unpaid Invoices tab ("New credit", amount 23.45) while at Heavy Duty  -> C715420 (A/P Detail), C715421 (A/P Unpaid Invoices)
//   V2 "ZZY VCredit Loc P89": RB from a return at Lethbridge, DC entered directly at Heavy Duty -> C715391 (A/P Unpaid Invoices, Location cells, untick A)
// The direct credit is made ON SCREEN (the request it sends is recorded, so the route is known next time). Output exec/s89/<id>.json + pictures.
import { start, A, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import * as SL from './seedlib.mjs'; import { mkV } from './vseed.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s89/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const p = s.page; const a = mk(p); const S = mkSort(p); const F = mkFilt(p);
const o = { seed: {} }; const log = (t) => { console.log(t); (o.seed.log ||= []).push(t); }; const V = mkV(a, p, log, ''); const LB = SL.WP.leth || Object.values(SL.WP).find((w) => w !== SL.WP.heavy);
const boxes = () => p.evaluate(`[...document.querySelectorAll('main tbody tr, main thead th, main tbody td')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(b => b[3] > 0 && b[2] >= 0 && b[2] < 900)`);
const shot = async (r, name) => { const f = await s.shot(r.id + '-' + name); (r.shots ||= []).push({ name, f, boxes: await boxes() }); };
async function direct(v, amount) { const seen = []; const h = (rq) => { if (/credit/i.test(rq.url()) && rq.method() !== 'GET') seen.push({ url: rq.url(), body: (rq.postData() || '').slice(0, 400) }); }; p.on('request', h);
  await p.goto(A + '/parts/vendor/' + v.id + '/unpaid-invoices'); await p.waitForTimeout(5000); await s.shot('seed-' + v.name.replace(/\W+/g, '-') + '-0');
  const btn = p.getByRole('button', { name: /New credit|Add credit/i }).first(); await btn.click(); await p.waitForTimeout(2000); const dlg = p.locator('.q-dialog').last(); o.seed.form = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 300);
  const inputs = dlg.locator('input:visible, textarea:visible'); const n = await inputs.count(); o.seed.inputs = [];
  for (let i = 0; i < n; i++) { const el = inputs.nth(i); const lab = await el.evaluate((e) => (e.closest('.q-field')?.innerText || e.getAttribute('aria-label') || e.getAttribute('data-test-id') || '').replace(/\s+/g, ' ').trim()); o.seed.inputs.push(lab);
    if (/amount/i.test(lab)) { await el.click(); await el.fill(String(amount)); } else if (/memo|note|description|reference|number/i.test(lab)) { await el.fill('ZZY direct credit P89'); } }
  await s.shot('seed-' + v.name.replace(/\W+/g, '-') + '-1-form'); await dlg.getByRole('button', { name: /^Save/i }).first().click(); await p.waitForTimeout(3500); await s.shot('seed-' + v.name.replace(/\W+/g, '-') + '-2-saved');
  p.off('request', h); o.seed.directReq = seen; const d = { tag: 'DC', amount: -amount, direct: true, wp: 'HD' }; v.docs.push(d); log('  direct credit ' + amount + ' ' + JSON.stringify(seen).slice(0, 300)); return d; }
async function rows(vid, key) { const r = await a.get(`/api/reporting/reports/${key}?asOfDate=2026-11-11&vendors=${vid}`); return JSON.stringify(r.j?.data || r.j).slice(0, 1500); }
await ensureLoc(p, 'Staging Heavy Duty - 9919');
const V1 = await V.vendor('ZZY VCredit Links P89', 'Net 30'); const ra = await V.credit(V1, 31.5, 0, SL.WP.heavy, 'RA'); const rb = await V.credit(V1, 42.75, 0, LB, 'RB'); const dc = await direct(V1, 23.45);
const V2 = await V.vendor('ZZY VCredit Loc P89', 'Net 30'); const rb2 = await V.credit(V2, 52.25, 0, LB, 'RB'); const dc2 = await direct(V2, 19.95);
o.seed.v1 = { name: V1.name, id: V1.id, ra: ra.number, rb: rb.number }; o.seed.v2 = { name: V2.name, id: V2.id, rb: rb2.number }; o.seed.apu1 = await rows(V1.id, 'ap-unpaid-invoices'); fs.writeFileSync(OUT + 'seed.json', JSON.stringify(o.seed, null, 1));
await ensureLoc(p, 'Staging Heavy Duty - 9919');
const expandAll = async () => { for (const b of [/^Current/, /^1-30/, /^31-60/, /^61-90/, /^91/]) await S.expand(b).catch(() => {}); };
async function openVendor(name) { const g = p.locator('main tbody tr').filter({ hasText: name }).first(); const n0 = await p.locator('main tbody tr').count(); if (await g.count()) { await g.click().catch(() => {}); await p.waitForTimeout(1500); if ((await p.locator('main tbody tr').count()) <= n0) { await g.click().catch(() => {}); await p.waitForTimeout(1500); } } }
async function cell(r, re, tag) { const td = p.locator('main tbody td').filter({ hasText: re }).first(); const x = { found: await td.count() }; if (!x.found) return x; x.text = (await td.innerText()).trim(); x.hasLink = await td.locator('a, [role=link]').count();
  x.style = await td.evaluate((e) => { const t = e.querySelector('a, span, div') || e; const c = getComputedStyle(t); return { color: c.color, cursor: c.cursor }; }); await td.hover(); await p.waitForTimeout(600); x.cursorHover = await td.evaluate((e) => getComputedStyle(e.querySelector('a, span, div') || e).cursor); return x; }
async function click(r, re, tag) { const td = p.locator('main tbody td').filter({ hasText: re }).first(); const u0 = p.url(); const n0 = p.context().pages().length; await (await td.locator('a, [role=link]').count() ? td.locator('a, [role=link]').first() : td).click(); await p.waitForTimeout(3500);
  const pages = p.context().pages(); const np = pages.length > n0 ? pages[pages.length - 1] : null; if (np) { await np.waitForLoadState().catch(() => {}); await np.waitForTimeout(2500); }
  const x = { urlAfter: (np || p).url(), sameUrl: !np && p.url() === u0, newTab: !!np, heading: ((await (np || p).locator('main').innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 300), dialog: (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' ') };
  if (np) { await np.screenshot({ path: OUT + r.id + '-' + tag + '.png' }); (r.shots ||= []).push({ name: tag, f: OUT + r.id + '-' + tag + '.png', boxes: [] }); await np.close(); } else { await shot(r, tag); } return x; }
const re = (n) => new RegExp('^' + n + '$'); const DC1 = /^-?\$?-?23\.45$|^\$-23\.45$/;
async function links(r, key) { await s.go(REPORTS[key]); await p.waitForTimeout(3500); await F.pick('Vendor', V1.name); r.chips = await F.chips(); if (key === 'apd') await expandAll(); else await openVendor(V1.name);
  r.rows = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).filter((t) => /Credit|ZZYCM|23\.45/.test(t)); r.ra = await cell(r, re(ra.number)); r.rb = await cell(r, re(rb.number));
  const dcRow = p.locator('main tbody tr').filter({ hasText: /23\.45/ }).first(); r.dcRow = (await dcRow.innerText().catch(() => '')).replace(/\s+/g, ' '); const cells = await dcRow.locator('td').all(); r.dcLinks = 0; for (const c of cells) r.dcLinks += await c.locator('a, [role=link]').count();
  await shot(r, '1-numbers'); r.clickRA = await click(r, re(ra.number), '2-ra-opened'); }
const T = {
  C715420: (r) => links(r, 'apd'),
  C715421: (r) => links(r, 'apu'),
  C715391: async (r) => { await s.go(REPORTS.apu); await p.waitForTimeout(3500); await F.pick('Vendor', V2.name); await openVendor(V2.name); r.rows = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')); await shot(r, '1-locations');
    await F.menuClick('Location', 'Staging Heavy Duty - 9919'); await F.menuClick('Location', 'ZZAUTOTEST V1R-87 Location C').catch(() => {}); await p.keyboard.press('Escape'); await p.waitForTimeout(3000); r.chips2 = await F.chips(); await shot(r, '2-narrowed');
    await openVendor(V2.name); r.rows3 = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')); await shot(r, '3-expanded'); },
};
const ONLY = process.env.ONLY?.split(',');
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const r = { id, seed: { v1: o.seed.v1, v2: o.seed.v2 } }; try { await fn(r); } catch (e) { r.err = String(e).slice(0, 300); try { await shot(r, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(r, null, 1)); console.log(id, r.err || 'ok', JSON.stringify({ ra: r.ra && [r.ra.text, r.ra.hasLink], rb: r.rb && [r.rb.text, r.rb.hasLink], dc: [r.dcRow, r.dcLinks], open: r.clickRA && [r.clickRA.urlAfter, r.clickRA.newTab], rows: r.rows3 || undefined }).slice(0, 500)); }
await s.close(); process.exit(0);
