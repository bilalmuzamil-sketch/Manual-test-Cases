// d1_design.mjs — 11 Nov 2026: design tests C715481–C715498 (each report at 1440 px light, dark, and 1536 px light+dark). Makes the long-name
// customer and vendor the cases ask for (more than 40 characters, documents at both locations, a credit) if they are not there, then per report
// and per (theme, width): a picture of the top of the page and of the Totals row, and measurements: heading texts and whether any heading wraps
// (its text is taller than one line), sideways scroll (scrollWidth > clientWidth of the table area and of the page), the long name's line count,
// money/date cells that wrap, overlaps between header cells, the Total column's font weight, link colour/weight/underline, the focused link's
// underline (Tab until a link in the table has focus), and the Totals row's background/size/weight next to Sales By Customer's.
// Dark mode is switched from the user menu (avatar) and the result read back from document.body classes. Output exec/d1/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkX } from './xseed.mjs'; import fs from 'fs';
const OUT = new URL('./d1/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const s = await start(OUT); const p = s.page; const a = mk(p); const X = mkX(a, (t) => console.log(t)); const o = { seed: {}, runs: {} };
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const LONGC = 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd', LONGV = 'ZZAUTOTEST Northern Alberta Heavy Haul Parts Supply Ltd';
const ymd = (d) => new Date(Date.UTC(2026, 10, 11 - d)).toISOString().slice(0, 10);
async function seed() {
  const ex = await a.get('/api/reporting/reports/ar-aging-summary?asOfDate=2026-11-11&pagination[page]=1&pagination[rowsPerPage]=100&search=' + encodeURIComponent('Northern Alberta'));
  o.seed.arFound = JSON.stringify(ex.j).includes(LONGC);
  if (!o.seed.arFound) { try { const c = await X.customer(LONGC, 'COD'); await X.invoice(c, 345.67, 20, S.WP.heavy, 'HD'); await X.invoice(c, 210, 50, S.WP.leth, 'LB'); await X.credit(c, 88.5, 3, S.WP.heavy, 'cm'); o.seed.ar = 'made'; } catch (e) { o.seed.ar = 'ERR ' + String(e).slice(0, 200); } }
  try { const vid = await S.vendor(a, LONGV, 'COD'); await S.bill(a, vid, { amount: 456.78, date: ymd(25), number: 'ZZYL' + (Date.now() % 1e7) }); await S.loc(a, S.WP.leth); await S.bill(a, vid, { amount: 123.45, date: ymd(55), number: 'ZZYL' + (Date.now() % 1e7) }); await S.loc(a);
    const rq = await a.post('/api/part/manual-return-request/create', { vendorId: vid, packagingSlip: 'ZZYL-SLIP', items: [{ inventoryPartId: '000657fe-522f-4c3f-9680-621c5449e2bd', partNumber: 'P550848', partDescription: 'FUEL/WATER SEPARATOR, (FS19732, 33732, BF1385-SPS)', quantity: 1, costDecimal: 66 }] });
    const rid = rq.j?.data?.id || rq.j?.data?.return_id || rq.j?.data?.manual_return_id; o.seed.vReturn = { st: rq.st, j: JSON.stringify(rq.j).slice(0, 200) };
    if (rid) { const r2 = await a.post(`/api/part/manual-return/${rid}/create`, { creditMemoNumber: 'ZZYLCM' + (Date.now() % 1e6), creditDate: ymd(3) + 'T18:00:00.000Z', tax: 0, note: null }); o.seed.vCredit = r2.st; } o.seed.ap = 'made ' + vid;
  } catch (e) { o.seed.ap = 'ERR ' + String(e).slice(0, 200); if (/already exists|409/.test(o.seed.ap)) o.seed.ap = 'exists'; }
  save(); }
async function setDark(on) { const isDark = () => p.evaluate(() => document.body.classList.contains('body--dark'));
  if ((await isDark()) === on) return true; const av = p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]{2}$/ }).last();
  await av.click().catch(() => {}); await p.waitForTimeout(1200); o.userMenu ||= (await p.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
  const item = p.locator('.q-menu').last().locator('.q-item, .q-toggle, label, button').filter({ hasText: /dark/i }).first();
  if (await item.count()) { await item.click(); await p.waitForTimeout(1500); } await p.keyboard.press('Escape'); await p.waitForTimeout(800); return (await isDark()) === on; }
const measure = () => p.evaluate(() => {
  const r = {}; const main = document.querySelector('main'); const ths = [...document.querySelectorAll('main thead th')];
  r.heads = ths.map((th) => { const t = th.innerText.replace(/arrow_drop_(up|down)|keyboard_arrow_\w+/g, '').trim(); const rg = document.createRange(); rg.selectNodeContents(th); const rects = [...rg.getClientRects()].filter((x) => x.width > 2); const lines = new Set(rects.map((x) => Math.round(x.top))).size; return { t, lines, w: Math.round(th.getBoundingClientRect().width) }; });
  const sc = [...document.querySelectorAll('main *')].filter((e) => e.scrollWidth > e.clientWidth + 1 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowX)); r.sideScroll = sc.map((e) => ({ cls: String(e.className).slice(0, 60), sw: e.scrollWidth, cw: e.clientWidth }));
  r.pageSide = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  const rows = [...document.querySelectorAll('main tbody tr')]; r.wrapCells = []; for (const tr of rows.slice(0, 60)) [...tr.children].forEach((td, i) => { const txt = td.innerText.trim(); if (/^\$-?[\d,]+\.\d\d$|^[A-Z][a-z]{2} \d{1,2}, \d{4}$|^Staging/.test(txt) && td.getBoundingClientRect().height > 0) { const rg = document.createRange(); rg.selectNodeContents(td); const n = new Set([...rg.getClientRects()].filter((x) => x.width > 2).map((x) => Math.round(x.top))).size; if (n > 1) r.wrapCells.push(txt); } });
  const long = rows.find((tr) => /Northern Alberta/.test(tr.innerText)); if (long) { const td = [...long.children].find((c) => /Northern Alberta/.test(c.innerText)); const rg = document.createRange(); rg.selectNodeContents(td); r.longLines = new Set([...rg.getClientRects()].filter((x) => x.width > 2).map((x) => Math.round(x.top))).size; r.longText = td.innerText.trim(); }
  const link = document.querySelector('main tbody a'); if (link) { const cs = getComputedStyle(link); r.link = { color: cs.color, weight: cs.fontWeight, deco: cs.textDecorationLine }; }
  const tot = [...document.querySelectorAll('main tr, main div')].filter((e) => /^Totals\b/.test(e.innerText.trim()) && e.innerText.length < 300).sort((x, y) => x.innerText.length - y.innerText.length)[0];
  if (tot) { const cs = getComputedStyle(tot); const cell = tot.querySelector('td, div') || tot; const c2 = getComputedStyle(cell); r.totals = { bg: cs.backgroundColor, cellBg: c2.backgroundColor, size: c2.fontSize, weight: c2.fontWeight, pos: cs.position, bottom: Math.round(tot.getBoundingClientRect().bottom) }; }
  const lastTh = ths[ths.length - 1]; if (lastTh) r.lastHead = { t: lastTh.innerText.trim(), weight: getComputedStyle(lastTh).fontWeight, sticky: getComputedStyle(lastTh).position };
  const hr = ths.map((th) => th.getBoundingClientRect()); r.headOverlap = hr.some((b, i) => i && b.left < hr[i - 1].right - 1);
  const chips = [...document.querySelectorAll('main button')].filter((b) => /:/.test(b.innerText)).slice(0, 5).map((b) => ({ t: b.innerText.replace(/\s+/g, ' ').trim(), bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color })); r.chips = chips;
  const title = document.querySelector('main h1, main .text-h5, main .text-h6'); if (title) r.titleTop = Math.round(title.getBoundingClientRect().top);
  return r; });
async function focusLink() { for (let i = 0; i < 40; i++) { await p.keyboard.press('Tab'); const f = await p.evaluate(() => { const e = document.activeElement; return e && e.tagName === 'A' && e.closest('main tbody') ? { t: e.innerText.trim().slice(0, 40), deco: getComputedStyle(e).textDecorationLine, outline: getComputedStyle(e).outlineStyle } : null; }); if (f) return { ...f, tabs: i + 1 }; } return null; }
try {
  await p.waitForTimeout(2000); await seed();
  for (const [k, path] of Object.entries({ ars: REPORTS.ars, ard: REPORTS.ard, arc: REPORTS.arc, aps: REPORTS.aps, apd: REPORTS.apd, apu: REPORTS.apu, sbc: '/reports/sales-by-customer' })) {
    for (const dark of [false, true]) for (const w of [1440, 1536]) {
      const tag = `${k}-${dark ? 'dark' : 'light'}-${w}`; await p.setViewportSize({ width: w, height: 900 }); await s.go(path); await p.waitForTimeout(3500);
      const dk = await setDark(dark); if (dark && !dk) { o.runs[tag] = { err: 'dark mode not switched', menu: o.userMenu }; save(); continue; }
      if (['ard', 'arc', 'apd', 'apu'].includes(k)) { const hb = p.locator('main thead th').first().locator('button').first(); if (await hb.count()) { await hb.hover(); await p.waitForTimeout(500); const tip = (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' '); if (/Expand all/i.test(tip)) { await hb.click(); await p.waitForTimeout(2500); } } }
      const m = await measure(); m.top = await s.shot(tag + '-top');
      if (k !== 'sbc' && w === 1440) { m.focus = await focusLink(); m.focusShot = await s.shot(tag + '-focus'); }
      await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find((x) => x.scrollHeight > x.clientHeight + 50 && ['auto', 'scroll'].includes(getComputedStyle(x).overflowY)); if (e) e.scrollTop = 400; }); await p.waitForTimeout(800); m.scrolled = await s.shot(tag + '-scrolled');
      o.runs[tag] = m; save(); console.log(tag, 'ok', JSON.stringify({ side: m.sideScroll.length, page: m.pageSide, wraps: m.heads.filter((h) => h.lines > 1).map((h) => h.t), long: m.longLines })); }
  }
  await setDark(false);
} catch (e) { o.err = String(e).slice(0, 400); }
save(); await s.close(); process.exit(0);
