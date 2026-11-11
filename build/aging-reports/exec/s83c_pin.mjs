// s83c_pin.mjs — 11 Nov 2026 ~16:00: re-runs of two s83 checks whose instrument was wrong.
// C715363 (pinned group row): s83's geometry read "Totals" with /^Totals?\b/ (hits "Total for ..." rows and a vendor named "Total ...", L0660) and
// a thead far off-screen, and its customers had 1-3 rows. Here: only two customers with many rows AND a phone on their card ("Desert Edge Truck
// Service & Repair" 74, "Tucson Truck Center" 39), both expanded; at each scroll step read what sits ON SCREEN just under the visible headings
// (elementFromPoint) and just above the visible Totals row, plus the pinned row's box; pictures at each phase.
// C715600 (group label at the left on a sideways scroll): at 1200 px the table overflows only ~23 px, so "stays visible" cannot tell a pinned
// label from one that scrolls (data at the edge - QA lead's note). Measured at 1200 (as written) AND at 1000 px (a real sideways scroll).
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s83c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const shot = async (o, n) => { const f = OUT + o.id + '-' + n + '.png'; await p.mouse.move(5, 890); await p.screenshot({ path: f }); (o.shots ||= []).push(f); return f; };
const A1 = 'Desert Edge Truck Service & Repair', B1 = 'Tucson Truck Center';
const probe = () => p.evaluate(() => { const vis = (e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
  const ths = [...document.querySelectorAll('main thead th')].filter(vis); const hb = ths.length ? Math.max(...ths.map((t) => t.getBoundingClientRect().bottom)) : null;
  const tot = [...document.querySelectorAll('main tr')].filter((t) => /^\s*Totals(\s|$)/.test(t.innerText) && vis(t)).pop(); const tt = tot ? tot.getBoundingClientRect().top : null; const x = 700;
  const rowAt = (y) => { const e = document.elementFromPoint(x, y); const tr = e && e.closest('tr'); return tr ? tr.innerText.replace(/keyboard_arrow_\w+/g, '').replace(/\s+/g, ' ').trim().slice(0, 90) : null; };
  const groups = [...document.querySelectorAll('main tbody tr')].filter((t) => /keyboard_arrow_(down|right)/.test(t.innerText) && vis(t)).map((t) => { const r = t.getBoundingClientRect(); return { t: t.innerText.replace(/keyboard_arrow_\w+/g, '').replace(/\s+/g, ' ').trim().slice(0, 80), top: Math.round(r.top), bottom: Math.round(r.bottom), pos: getComputedStyle(t).position + '/' + getComputedStyle(t.querySelector('td') || t).position }; });
  return { hb: hb && Math.round(hb), tt: tt && Math.round(tt), under: hb ? rowAt(hb + 4) : null, overTotals: tt ? rowAt(tt - 4) : null, groups }; });
const T = {
  C715363: async (o) => { await s.go(REPORTS.arc); await p.waitForTimeout(3500); await F.pick('Customer', A1); await F.pick('Customer', B1); o.chips = await F.chips(); await p.waitForTimeout(1500);
    for (const n of [A1, B1]) await S.expand(new RegExp(n.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&') + ' \\(')).catch((e) => (o.expandErr = String(e).slice(0, 120)));
    await p.waitForTimeout(1500); o.samples = []; const SC = S.SC; await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(600); o.start = await probe(); await shot(o, '0-start');
    const step = async (lbl, dy, n, wait, every) => { for (let i = 1; i <= n; i++) { await p.evaluate(`${SC}.scrollTop += ${dy}`); await p.waitForTimeout(wait); const g = await probe(); o.samples.push({ lbl, i, ...g }); if (i % every === 0) await shot(o, lbl + '-' + i); } };
    await step('1-3-slow-down', 120, 40, 250, 8); await step('4-slow-up', -120, 16, 250, 4); await step('5-fast-down', 1500, 6, 100, 2); await step('6-fast-up', -1500, 6, 100, 2);
    const ga = (t) => (t || '').startsWith(A1) ? 'A' : (t || '').startsWith(B1) ? 'B' : (t || '').slice(0, 20);
    o.timeline = o.samples.map((x) => `${x.lbl}#${x.i}: under=${ga(x.under)} overTotals=${(x.overTotals || '').slice(0, 25)} pinnedGroups=${x.groups.filter((g) => g.top <= x.hb + 2 && g.bottom >= x.hb).map((g) => ga(g.t)).join('+')}`);
    o.twoPinned = o.samples.filter((x) => x.groups.filter((g) => g.top < x.hb + 40 && g.bottom > x.hb).length > 1 && x.groups.some((a, i) => x.groups.some((b, j) => j > i && a.top < b.bottom - 1 && b.top < a.bottom - 1))).map((x) => x.lbl + '#' + x.i);
    o.coverHead = o.samples.filter((x) => x.groups.some((g) => g.top < x.hb - 3)).map((x) => x.lbl + '#' + x.i); o.coverTotals = o.samples.filter((x) => x.tt && x.groups.some((g) => g.bottom > x.tt + 2 && g.top < x.tt)).map((x) => x.lbl + '#' + x.i); },
  C715600: async (o) => { for (const w of [1200, 1000]) { await p.setViewportSize({ width: w, height: 900 }); await s.go(REPORTS.arc); await p.waitForTimeout(3500); await F.pick('Customer', A1); await S.expand(new RegExp(A1.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&') + ' \\(')).catch(() => {}); await p.waitForTimeout(1500);
      const lab = () => p.evaluate((n) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => t.innerText.includes(n)); const els = tr ? [...tr.querySelectorAll('*')].filter((x) => !x.children.length && x.textContent.includes(n.slice(0, 10))) : []; const e = els[0]; const sc = document.querySelector('main .q-table__middle'); const m = sc.getBoundingClientRect(); const r = e ? e.getBoundingClientRect() : null;
        return { sw: sc.scrollWidth, cw: sc.clientWidth, left: sc.scrollLeft, x: r && Math.round(r.x), right: r && Math.round(r.right), tableLeft: Math.round(m.x), fullyVisible: !!r && r.x >= m.x - 1, pos: e && getComputedStyle(e.closest('td') || e).position }; }, A1);
      const r = { before: await lab() }; await shot(o, w + '-1-before'); await p.evaluate(() => { const e = document.querySelector('main .q-table__middle'); e.scrollLeft = e.scrollWidth; }); await p.waitForTimeout(1200); r.after = await lab(); await shot(o, w + '-2-scrolled-right'); o['w' + w] = r; }
    await p.setViewportSize({ width: 1440, height: 900 }); },
};
await ensureLoc(p, 'Staging Heavy Duty - 9919');
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify({ two: o.twoPinned, head: o.coverHead?.length, tot: o.coverTotals?.length, w1200: o.w1200, w1000: o.w1000 }).slice(0, 600)); }
await s.close(); process.exit(0);
