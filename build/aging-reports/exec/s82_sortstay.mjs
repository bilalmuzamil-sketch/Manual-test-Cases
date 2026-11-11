// s82_sortstay.mjs — 11 Nov 2026: "the sort stays while changing date, scrolling and filters" on the four 30-at-a-time reports:
// C715316 (A/R Summary, Total), C715318 (A/R Collection, Open Balance), C715319 (A/P Summary, Total), C715321 (A/P Unpaid, Open Balance).
// Customer/vendor A = ZZAUTOTEST LOC MIX / ZZAUTOTEST LOC MIX V (documents at both locations, p33/p57). Location B = Staging Lethbridge - 4310.
// Per step: aria-sort header, the money order of the rows on screen (group rows and line rows kept apart), chips, picture. Output exec/s82/<id>.json.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s82/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const money = (t) => { const m = (t || '').match(/\$-?[\d,]+\.\d\d/g); return m ? Number(m[m.length - 1].replace(/[$,]/g, '')) : null; };
const desc = (xs) => xs.every((x, i) => i === 0 || xs[i - 1] >= x);
const isGroup = (r) => /keyboard_arrow_(right|down)/.test(r.raw || r.text);
const visible = () => p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => ({ text: tr.innerText.replace(/\\s+/g,' ').trim(), cells: [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\\s+/g,' ').trim()) })).filter(r => r.text)`);
function judge(rows, grouped) { const body = rows.filter((r) => !/^Totals?\b|^Total for /.test(clean(r.text)));
  const groups = grouped ? body.filter(isGroup) : body; const lines = grouped ? body.filter((r) => !isGroup(r)) : [];
  const gm = groups.map((r) => money(r.text)).filter((x) => x !== null); const lm = lines.map((r) => money(r.text)).filter((x) => x !== null);
  return { nGroups: groups.length, groupMoney: gm.slice(0, 40), groupDesc: desc(gm), nLines: lines.length, lineMoney: lm.slice(0, 40), lineDesc: desc(lm), names: groups.map((r) => clean(r.cells[0] || r.text).slice(0, 50)).slice(0, 40), locs: [...new Set(body.map((r) => r.cells[1]).filter(Boolean))].slice(0, 6) }; }
const snap = async (o, label, rows) => { const st = { label, sorted: await S.sorted(), chips: await F.chips(), ...judge(rows, o.grouped) }; st.shot = await s.shot(o.id + '-' + label.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)); o.steps.push(st); fs.writeFileSync(OUT + o.id + '.json', JSON.stringify(o, null, 1)); return st; };
async function run(o, route, col, kind, name) { await ensureLoc(p, 'Staging Heavy Duty - 9919'); await s.go(route); await p.waitForTimeout(3500);
  o.click = await S.clickTh(col); await snap(o, '1 sorted', await visible());
  await F.asOf(10); await snap(o, '2 yesterday', await visible());
  const all = await S.collect(); o.allCount = all.length; await snap(o, '3 scrolled all loaded', all);
  await F.chip?.(kind); o.menuOpen = await (async () => { await p.locator('main button', { hasText: new RegExp(kind + ':') }).first().click(); await p.waitForTimeout(1200); const t = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 200); await s.shot(o.id + '-4_menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800); return t; })();
  await F.pick(kind, name); if (o.grouped) await S.expand(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\(')); await snap(o, '5 one ' + kind.toLowerCase(), await S.collect());
  o.locMenu = await F.menuClick('Location', 'Staging Lethbridge - 4310'); /* 11 Nov 14:06: a third A/R location now exists (another session's); the case has two, so untick it too to leave location A only */ if (/V1R-87 Location C/.test(o.locMenu)) o.locMenuC = await F.menuClick('Location', 'ZZAUTOTEST V1R-87 Location C'); if (o.grouped) await S.expand(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\(')); await snap(o, '6 location A only', await S.collect()); }
const T = {
  C715316: (o) => run(o, REPORTS.ars, 'Total', 'Customer', 'ZZAUTOTEST LOC MIX'),
  C715318: (o) => { o.grouped = true; return run(o, REPORTS.arc, 'Open Balance', 'Customer', 'ZZAUTOTEST LOC MIX'); },
  C715319: (o) => run(o, REPORTS.aps, 'Total', 'Vendor', 'ZZAUTOTEST LOC MIX V'),
  C715321: (o) => { o.grouped = true; return run(o, REPORTS.apu, 'Open Balance', 'Vendor', 'ZZAUTOTEST LOC MIX V'); },
};
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id, steps: [] }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await s.shot(id + '-error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', o.steps.map((x) => x.label + ' [' + x.sorted + '] g' + x.nGroups + (x.groupDesc ? '↓' : '×') + ' l' + x.nLines + (x.lineDesc ? '↓' : '×')).join(' | ')); }
await s.close(); process.exit(0);
