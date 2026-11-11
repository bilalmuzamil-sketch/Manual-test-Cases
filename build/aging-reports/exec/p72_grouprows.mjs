// p72_grouprows.mjs — 11 Nov 2026: SV-12540 re-measure (developer, comment 80909: "An open customer or vendor draws its first 100 documents.
// When the end of those 100 scrolls into view, the next 100 are added ... count the rows in DevTools before scrolling"). Our ticket measured the
// server reply with a 105-document group (too close to 100 to tell "all at once" from "100 then more"). Here, per report (A/P Unpaid, A/R
// Collection): find the group with the MOST documents (well over 200), tick only it, expand, then count the group's rows ON THE PAGE (DOM rows
// between its header and its "Total for" row), the scroll height, and the reporting requests - after opening, and after each scroll to the
// end of the rows already drawn (8 rounds, 3 s wait). Positive control: the same counts for ZZAUTOTEST OVER100 C/V (105). Output p72/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./p72/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const o = {};
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const groupRows = (name) => p.evaluate((name) => { const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => /keyboard_arrow_(down|right)/.test(t.innerText) && t.innerText.includes(name)); if (i0 < 0) return { n: -1 }; let n = 0, last = null;
  for (let k = i0 + 1; k < all.length; k++) { const tx = all[k].innerText.replace(/\s+/g, ' ').trim(); if (/^Total for /.test(tx) || /keyboard_arrow_(right|down)/.test(all[k].innerText)) break; if (tx) { n++; last = tx.slice(0, 60); } }
  const sc = document.querySelector('main .q-table__middle'); return { n, last, scrollH: sc ? sc.scrollHeight : null, totalFor: !!all.find((t) => /^\s*Total for /.test(t.innerText) && t.innerText.includes(name)) }; }, name);
async function measure(tag, rep, kind, name) { const r = { name, rounds: [] }; await s.go(REPORTS[rep]); await p.waitForTimeout(3500); await F.pick(kind, name); await S.expand(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\(')); await p.waitForTimeout(2500);
  const n0 = s.net.length; r.header = clean(await p.locator('main tbody tr').filter({ hasText: name }).first().innerText()).slice(0, 80); r.open = await groupRows(name); await s.shot(tag + '-0-open');
  for (let i = 1; i <= 8; i++) { await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(3000); const g = await groupRows(name); r.rounds.push(g); if (i <= 3) await s.shot(`${tag}-${i}-scrolled`); if (g.totalFor && i > 2 && r.rounds[i - 2] && r.rounds[i - 2].n === g.n) break; }
  r.requests = s.net.slice(n0).filter((c) => /reporting/.test(c.u)).map((c) => c.st + ' ' + decodeURIComponent(c.u.replace(/^.*\/api/, '/api')).slice(0, 140) + ' n=' + ((c.body?.data?.collection?.[0]?.rows || c.body?.data?.collection || []).length));
  return r; }
async function biggest(rep) { await s.go(REPORTS[rep]); await p.waitForTimeout(3500); const rows = await S.collect(); const g = rows.filter((r) => /keyboard_arrow_(right|down)/.test(r.raw || r.text)).map((r) => { const t = clean(r.text); const m = t.match(/^(.*?) \((\d+)\)/); return m ? [m[1], +m[2]] : null; }).filter(Boolean).sort((a, b) => b[1] - a[1]); return g.slice(0, 5); }
try { await ensureLoc(p, 'Staging Heavy Duty - 9919');
  o.apuTop = await biggest('apu'); save(); o.apu = await measure('apu', 'apu', 'Vendor', o.apuTop[0][0]); save();
  o.arcTop = await biggest('arc'); save(); o.arc = await measure('arc', 'arc', 'Customer', o.arcTop[0][0]); save();
  o.ctlV = await measure('ctlV', 'apu', 'Vendor', 'ZZAUTOTEST OVER100 V'); save();
} catch (e) { o.err = String(e).slice(0, 300); }
save(); const brief = (r) => r && [r.header, r.open?.n, (r.rounds || []).map((x) => x.n).join('>'), (r.requests || []).length]; console.log('p72', JSON.stringify({ apuTop: o.apuTop?.slice(0, 2), apu: brief(o.apu), arcTop: o.arcTop?.slice(0, 2), arc: brief(o.arc), ctlV: brief(o.ctlV), err: o.err })); await s.close(); process.exit(0);
