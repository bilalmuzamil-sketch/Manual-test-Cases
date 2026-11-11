// s2_run.mjs — 11 Nov 2026: runs S2 sort scenarios (scenario file JSON: [{id, report, pre:[{expand|collapse: "regex"}], acts:[{th:"Label"}|
// {nav:"/reports/…"}|{reload:true}], segs:["regex"...], full:bool}]). After the opening and after every action it records the headers
// (label + aria-sort + cursor), the rows of each watched bucket/group (or the whole list when full), the report API calls made, and a
// picture scrolled to the first watched segment. Output exec/s2/<id>.json + pictures. One admin session for the whole file.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const FILE = process.argv[2]; const SC_ = JSON.parse(fs.readFileSync(FILE)); const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const OUT = new URL('./s2/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const S = mkSort(p);
for (const sc of SC_) { if (ONLY && !ONLY.includes(sc.id)) continue; const res = { id: sc.id, steps: [] };
  try {
    await s.go(REPORTS[sc.report]); await p.waitForTimeout(2500);
    for (const pr of sc.pre || []) { if (pr.expand) res['pre-' + pr.expand] = await S.expand(new RegExp(pr.expand)); if (pr.collapse) res['pre-' + pr.collapse] = await S.collapse(new RegExp(pr.collapse)); }
    const snap = async (label) => { const rows = await S.collect(); const st = { label, ths: await S.ths(), segs: {} };
      if (sc.full) st.full = rows.map((r) => r.cells); for (const g of sc.segs || []) st.segs[g] = S.segment(rows, new RegExp(g));
      if (sc.groups) st.groups = rows.filter((r) => new RegExp(sc.groups).test(r.text)).map((r) => r.raw);
      if (sc.focus) { const l = await S.find(new RegExp(sc.focus)); if (l) await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollTop + 300; })()`); await p.waitForTimeout(400); } /* +300: the found row sits at the bottom after scrollIntoView; moving the list up brings it to mid-screen */
      else if (sc.segs?.[0]) { const l = await S.find(new RegExp(sc.segs[0])); if (l) await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = Math.max(0, e.scrollTop - 40); })()`); }
      st.shot = await s.shot(sc.id + '-' + label.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)); st.boxes = await p.evaluate(`[...document.querySelectorAll('main tbody tr, main thead th')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 70), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(x => x[2] > 0 && x[2] < 900)`);
      res.steps.push(st); };
    await snap('open');
    for (const [i, a] of (sc.acts || []).entries()) { const n0 = s.net.length;
      if (a.th) res['act' + i] = await S.clickTh(a.th); if (a.nav) { await s.go(a.nav); await p.waitForTimeout(2000); } if (a.expand) res['act' + i] = await S.expand(new RegExp(a.expand)); if (a.menu) { await p.locator('a, .q-item').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + a.menu + '\\s*$') }).first().click(); await p.waitForTimeout(3000); res.steps.push({ label: 'menu ' + a.menu, url: p.url(), title: await s.title(), shot: await s.shot(sc.id + '-menu-' + a.menu.replace(/\W+/g, '_')) }); if (!a.snap) continue; }
      if (a.hover) { await p.locator('main thead th').filter({ hasText: a.hover }).first().hover(); await p.waitForTimeout(600); }
      if (a.nav && !a.snap) { res.steps.push({ label: 'nav ' + a.nav, url: p.url(), title: await s.title(), shot: await s.shot(sc.id + '-nav') }); continue; }
      await snap((a.th ? 'click ' + a.th : a.expand ? 'expand' : a.hover ? 'hover ' + a.hover : 'nav') + ' #' + (i + 1)); res.steps[res.steps.length - 1].calls = s.net.slice(n0).map((c) => c.st + ' ' + decodeURIComponent(c.u.replace(/^.*reports\//, '')).slice(0, 220)); }
  } catch (e) { res.err = String(e).slice(0, 400); }
  fs.writeFileSync(OUT + sc.id + '.json', JSON.stringify(res, null, 1)); console.log(sc.id, res.err || 'ok', res.steps.map((x) => x.label + ' [' + (x.ths || []).filter((h) => h.aria && h.aria !== 'none').map((h) => h.t + ':' + h.aria).join(',') + ']').join(' | '));
}
await s.close(); process.exit(0);
