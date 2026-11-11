// s83_groups.mjs — 11 Nov 2026: group behaviour + organisation-wide location lists.
// C715354/C715356 top-left chevron Collapse all / Expand all (A/R Detail, A/P Detail); C715363 pinned group row on A/R Collection (scroll slow
// and fast, reads each group row's position against the headings and the Totals row); C715600 A/R Collection at 1200 px scrolled sideways
// (group label stays at the left); C715384/C715385 every location listed whatever your enrollment (A/R Collection, A/P Unpaid).
// Output exec/s83/<id>.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s83/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const shot = async (o, n) => { const f = await s.shot(o.id + '-' + n); (o.shots ||= []).push(f); return f; };
const groupRows = () => p.evaluate(`[...document.querySelectorAll('main tbody tr')].filter(tr => /keyboard_arrow_(right|down)/.test(tr.innerText)).map(tr => ({ t: tr.innerText.replace(/\\s+/g,' ').trim().slice(0, 120), open: /keyboard_arrow_down/.test(tr.innerText) }))`);
const headBtn = () => p.locator('main thead th').first().locator('button').first();
async function tip() { await headBtn().hover(); await p.waitForTimeout(900); const t = (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' ').trim(); return t; }
async function chevron(o, route) { await s.go(route); await p.waitForTimeout(4000); o.sorted0 = await S.sorted(); o.groups0 = await groupRows(); await shot(o, '0-open');
  const g = p.locator('main tbody tr').filter({ hasText: 'keyboard_arrow_right' }).first(); o.clicked = clean(await g.innerText()).slice(0, 60); await g.locator('button').first().click(); await p.waitForTimeout(2500);
  o.groups1 = await groupRows(); await shot(o, '1-one-open');
  o.btn2 = clean(await headBtn().innerText()); o.btnIcon2 = (await headBtn().innerText()).trim(); o.tip2 = await tip(); await shot(o, '2-hover-collapse');
  await headBtn().click(); await p.waitForTimeout(3000); o.groups3 = await groupRows(); o.sorted3 = await S.sorted(); await p.mouse.move(700, 600); await p.waitForTimeout(500); await shot(o, '3-collapsed');
  o.btnIcon4 = (await headBtn().innerText()).trim(); o.tip4 = await tip(); await shot(o, '4-hover-expand');
  await headBtn().click(); await p.waitForTimeout(4000); o.groups5 = await groupRows(); o.sorted5 = await S.sorted(); await p.mouse.move(700, 600); await p.waitForTimeout(500); await shot(o, '5-expanded'); }
const geo = () => p.evaluate(`(() => { const th = document.querySelector('main thead'); const hb = th.getBoundingClientRect().bottom; const tot = [...document.querySelectorAll('main tr')].find(tr => /^\\s*Totals?\\b/.test(tr.innerText)); const tt = tot ? tot.getBoundingClientRect().top : null;
  const gs = [...document.querySelectorAll('main tbody tr')].filter(tr => /keyboard_arrow_(right|down)/.test(tr.innerText)).map(tr => { const b = tr.getBoundingClientRect(); return { t: tr.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), top: Math.round(b.top), bottom: Math.round(b.bottom), pos: getComputedStyle(tr).position + '/' + getComputedStyle(tr.querySelector('td') || tr).position }; }).filter(g => g.bottom > hb - 60 && (tt === null || g.top < tt + 60));
  return { headBottom: Math.round(hb), totalsTop: tt && Math.round(tt), groups: gs }; })()`);
const T = {
  C715354: (o) => chevron(o, REPORTS.ard),
  C715356: (o) => chevron(o, REPORTS.apd),
  C715363: async (o) => { await s.go(REPORTS.arc); await p.waitForTimeout(4000); await S.clickTh('Customer').catch(() => {}); await S.sorted(); await s.go(REPORTS.arc); await p.waitForTimeout(4000);
    /* expand every group so each customer's rows are in the list, then find two neighbours with many rows: LOC MIX (21) and the next customer */
    await headBtn().hover(); await p.waitForTimeout(600); if (/Expand all/i.test(await tip())) { await headBtn().click(); await p.waitForTimeout(5000); }
    const l = await S.find(/ZZAUTOTEST LOC MIX \(/); o.found = !!l; const SC = S.SC; o.samples = [];
    const step = async (lbl, dy, n, wait) => { for (let i = 0; i < n; i++) { await p.evaluate(`${SC}.scrollTop += ${dy}`); await p.waitForTimeout(wait); const g = await geo(); o.samples.push({ lbl, i, ...g }); if (i % Math.max(1, Math.floor(n / 3)) === 0) await shot(o, lbl + '-' + i); } };
    await p.evaluate(`(() => { const e = ${SC}; const r = [...document.querySelectorAll('main tbody tr')].find(tr => /ZZAUTOTEST LOC MIX \\(/.test(tr.innerText)); if (r) e.scrollTop += r.getBoundingClientRect().top - document.querySelector('main thead').getBoundingClientRect().bottom - 5; })()`); await p.waitForTimeout(800);
    await step('1-2-3-slow-down', 60, 22, 350); await step('4-slow-up', -60, 10, 350); await step('5-fast-down', 900, 6, 120); await step('6-fast-up', -900, 6, 120);
    o.pinned = o.samples.map((x) => ({ lbl: x.lbl, i: x.i, head: x.headBottom, tot: x.totalsTop, g: x.groups.filter((g) => g.top <= x.headBottom + 2 && g.bottom > x.headBottom - 2).map((g) => [g.t.slice(0, 50), g.top, g.bottom]) }));
    o.overlaps = o.samples.filter((x) => x.groups.some((a, i) => x.groups.some((b, j) => j > i && a.top < b.bottom - 1 && b.top < a.bottom - 1))).map((x) => x.lbl + '#' + x.i);
    o.coverHead = o.samples.filter((x) => x.groups.some((g) => g.top < x.headBottom - 2 && g.bottom > x.headBottom + 2 && g.top < x.headBottom - 40)).map((x) => x.lbl + '#' + x.i);
    o.coverTotals = o.samples.filter((x) => x.totalsTop && x.groups.some((g) => g.bottom > x.totalsTop + 2 && g.top < x.totalsTop)).map((x) => x.lbl + '#' + x.i); },
  C715600: async (o) => { await p.setViewportSize({ width: 1200, height: 900 }); await s.go(REPORTS.arc); await p.waitForTimeout(4000); await F.pick('Customer', 'ZZAUTOTEST LOC MIX'); await S.expand(/ZZAUTOTEST LOC MIX \(/);
    const SCX = `(document.querySelector('main .q-table__middle.scroll, main .q-table__middle') )`; o.scroll0 = await p.evaluate(`(() => { const e = ${SCX}; return { sw: e.scrollWidth, cw: e.clientWidth }; })()`); await shot(o, '1-1200');
    const lab = async () => p.evaluate(`(() => { const tr = [...document.querySelectorAll('main tbody tr')].find(tr => /ZZAUTOTEST LOC MIX \\(/.test(tr.innerText)); const td = tr && tr.querySelector('td'); const lb = td && [...td.querySelectorAll('*')].find(x => /ZZAUTOTEST LOC MIX/.test(x.textContent) && !x.children.length) ; const r = (lb || td).getBoundingClientRect(); const m = document.querySelector('main .q-table__middle').getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), tableLeft: Math.round(m.x), vis: r.x >= m.x - 1 && r.x < m.x + 300 }; })()`);
    o.label0 = await lab(); o.scrolled = await p.evaluate(`(() => { const e = ${SCX}; e.scrollLeft = e.scrollWidth; return e.scrollLeft; })()`); await p.waitForTimeout(1200); o.label2 = await lab(); o.heads2 = (await S.ths()).map((h) => h.t); await shot(o, '2-scrolled-right'); await p.setViewportSize({ width: 1440, height: 900 }); },
  C715384: async (o) => { await s.go(REPORTS.arc); await p.waitForTimeout(4000); o.headerLoc = clean(await p.locator('header').innerText().catch(() => '')).slice(0, 200); o.enrolled = await p.evaluate(async () => { try { const r = await fetch('https://sv11315api.qa.shopview.com/api/auth/me/fe-permissions', { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await r.json(); const d = j.data || j; return JSON.stringify(d.workplaces || d.locations || d.user?.workplaces || Object.keys(d)).slice(0, 600); } catch (e) { return String(e); } });
    await headBtn().click().catch(() => {}); await p.waitForTimeout(3000); const rows = await S.collect(); o.locsInRows = [...new Set(rows.map((r) => r.cells[1]).filter((x) => /Staging|Location|-/.test(x || '')))]; await shot(o, '1-rows');
    await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu').last(); o.menu = (await m.innerText()).replace(/\s+/g, ' ').slice(0, 500); o.ticks = await m.evaluate((e) => [...e.querySelectorAll('.q-item, label')].map((x) => [x.innerText.replace(/\s+/g, ' ').trim().slice(0, 60), x.querySelector('[aria-checked]')?.getAttribute('aria-checked')])); await shot(o, '2-menu'); await p.keyboard.press('Escape'); },
};
T.C715385 = async (o) => { const r = T.C715384; const save = REPORTS.arc; REPORTS.arc = REPORTS.apu; try { await r(o); } finally { REPORTS.arc = save; } };
await ensureLoc(p, 'Staging Heavy Duty - 9919');
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
