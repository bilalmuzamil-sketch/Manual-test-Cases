// s4x_paging.mjs — 11 Nov 2026: re-test C715360 (A/R Detail) and C715361 (A/P Detail) with the fixed reader (sortlib collect inserts each
// new line after its on-screen neighbour; before, lines loaded on scroll were filed after the bucket's "Total for" line and only 100 were
// compared). Opens the biggest bucket, records the first screenful count of lines before any more load (network: page=1, 100 rows), then
// scrolls and reads the bucket: A/R all lines; A/P up to CAP lines (the 91+ bucket has ~11,900). Checks no line repeated and that the lines
// keep the opening order (Customer/Vendor name A to Z, case ignored), then Expand all and the same first-100 check. Output s4/<id>x.json.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./s4/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const S = mkSort(p); const ONLY = process.env.ONLY?.split(','); const CAP = +(process.env.CAP || 500);
const boxes = () => p.evaluate(`[...document.querySelectorAll('main tbody tr, main thead th')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(b => b[3] > 0 && b[2] >= 0 && b[2] < 900)`);
const shot = async (o, name) => { const f = await s.shot(o.id + '-' + name); o.shots.push({ name, f, boxes: await boxes() }); };
const headBtn = () => p.locator('main thead th').first().locator('button').first();
const calls = (n0) => s.net.slice(n0).filter((c) => /buckets/.test(c.u)).map((c) => c.st + ' ' + decodeURIComponent(c.u.replace(/^.*buckets\//, '')).replace(/asOfDate=[^&]*&?/, '').slice(0, 120) + ' n=' + (c.body?.data?.collection?.length ?? '?'));
async function readBucket(re, cap) { const seen = []; const has = new Set(); let stall = 0; const SC = S.SC;
  // read only this bucket's rows, in screen order, until its "Total for" row is reached or cap lines were read
  for (let i = 0; i < 2000 && stall < 6 && seen.length < cap; i++) { const rs = await p.evaluate((src) => { const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => new RegExp(src).test(t.innerText.replace(/\s+/g, ' '))); if (i0 < 0) return { rows: [], end: false };
        const out = []; let end = false; for (let k = i0 + 1; k < all.length; k++) { const tx = all[k].innerText.replace(/\s+/g, ' ').trim(); if (/^Total for /.test(tx) || /keyboard_arrow_(right|down)/.test(all[k].innerText)) { end = /^Total for /.test(tx); break; } out.push([...all[k].querySelectorAll('td')].map((td) => td.innerText.replace(/\s+/g, ' ').trim())); } return { rows: out, end }; }, re.source);
    let add = 0; for (const r of rs.rows) { const k = r.join('|'); if (!has.has(k)) { has.add(k); seen.push(r); add++; } }
    if (rs.end && add === 0) { stall++; } const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`);
    await p.waitForTimeout(moved ? 400 : 1100); if (!moved) { await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = Math.max(0, e.scrollTop - 400); })()`); await p.waitForTimeout(250); await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(1100); }
    stall = (!moved && !add) ? stall + 1 : (add ? 0 : stall); }
  return seen; }
const check = (rows, nameCol) => { const keys = rows.map((r) => r.join('|')); const dups = keys.filter((k, i) => keys.indexOf(k) !== i); const names = rows.map((r) => (r[nameCol] || '').toLowerCase()); const bad = []; for (let i = 0; i < names.length - 1; i++) if (names[i] > names[i + 1]) bad.push([i, names[i], names[i + 1]]); return { n: rows.length, dups: dups.length, orderBreaks: bad.slice(0, 5), nOrderBreaks: bad.length }; };
const T = {};
for (const [id, rep, nameCol] of [['C715360', 'ard', 4], ['C715361', 'apd', 4]]) T[id] = async (o) => { await s.go(REPORTS[rep]); await p.waitForTimeout(3000);
  await headBtn().hover(); await p.waitForTimeout(700); if (/Collapse all/.test((await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join())) { await headBtn().click(); await p.waitForTimeout(2500); }
  const heads = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ')).filter((t) => /days past due \(|Current \(/.test(t)).map((t) => [t.replace(/keyboard_arrow_\w+/g, '').trim().split(' Total')[0], +(t.match(/\((\d+)\)/) || [])[1]]));
  o.heads = heads; const big = heads.slice().sort((a, b) => b[1] - a[1])[0]; o.big = big; const label = big[0].split(' (')[0]; const re = new RegExp('^\\s*(keyboard_arrow_\\w+\\s*)?' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\(');
  let n0 = s.net.length; await S.expand(new RegExp(label)); await p.waitForTimeout(1500); o.callsOpen = calls(n0);
  o.firstScreen = await p.evaluate((src) => { const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => new RegExp(src).test(t.innerText.replace(/\s+/g, ' '))); let n = 0; for (let k = i0 + 1; k < all.length; k++) { if (/^Total for /.test(all[k].innerText.trim()) || /keyboard_arrow_(right|down)/.test(all[k].innerText)) break; n++; } return n; }, re.source);
  await shot(o, '1-open'); n0 = s.net.length; const cap = rep === 'ard' ? 100000 : CAP; const rows = await readBucket(re, cap); o.callsScroll = calls(n0).slice(0, 8); o.nCallsScroll = calls(n0).length; o.check1 = check(rows, nameCol); await shot(o, '3-scrolled');
  await S.collapse(new RegExp(label)); o.afterCollapse = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].filter((t) => /keyboard_arrow_down/.test(t.innerText)).length);
  n0 = s.net.length; await headBtn().click(); await p.waitForTimeout(3000); o.callsExpandAll = calls(n0);
  o.firstScreen2 = await p.evaluate((src) => { const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => new RegExp(src).test(t.innerText.replace(/\s+/g, ' '))); let n = 0; for (let k = i0 + 1; k < all.length; k++) { if (/^Total for /.test(all[k].innerText.trim()) || /keyboard_arrow_(right|down)/.test(all[k].innerText)) break; n++; } return n; }, re.source);
  await shot(o, '5-expand-all'); n0 = s.net.length; const rows2 = await readBucket(re, rep === 'ard' ? 100000 : 300); o.nCallsScroll2 = calls(n0).length; o.check2 = check(rows2, nameCol); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id: id + 'x', shots: [] }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); }
  fs.writeFileSync(OUT + id + 'x.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify({ big: o.big, first: o.firstScreen, c1: o.check1, first2: o.firstScreen2, c2: o.check2 })); }
await s.close(); process.exit(0);
