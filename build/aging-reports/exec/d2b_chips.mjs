// d2b_chips.mjs — 11 Nov 2026: the chip states d2 did not capture. C715511 step 3: A/R Summary, tick the long-named customer
// "ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd" in the Customer menu - chip text (shortened with "..."?) and style (resting or not).
// C715513 / C715514 step 3-4: A/R Summary / A/P Summary, tick "91+ days" in Past due - chip text and style; then open the Location menu next to it
// (box, tick boxes) for the side-by-side with the Past due menu. Output exec/d2b/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./d2b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const chip = (re) => p.locator('main button', { hasText: re }).first();
const style = (re) => chip(re).evaluate((b) => { const c = getComputedStyle(b); const r = b.getBoundingClientRect(); return { text: b.innerText.replace(/\s+/g, ' ').trim(), bg: c.backgroundColor, color: c.color, w: Math.round(r.width) }; });
const menuInfo = async () => { const m = p.locator('.q-menu').last(); return m.evaluate((e) => { const b = e.getBoundingClientRect(); return { lines: e.innerText.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 8), box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)], cbs: e.querySelectorAll('.q-checkbox').length }; }); };
try { await s.go(REPORTS.ars); await p.waitForTimeout(4000); o.c511before = await style(/Customer:/);
  await chip(/Customer:/).click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu').last(); await m.locator('input').first().type('Northern Alberta Heavy Haul and Towing'); await p.waitForTimeout(1800);
  await m.locator('.q-item, label, .q-checkbox').filter({ hasText: 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd' }).first().click(); await p.waitForTimeout(1200); await s.shot('C715511-3-ticked-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  o.c511after = await style(/Customer:/); await s.shot('C715511-3-chip');
} catch (e) { o.err511 = String(e).slice(0, 200); }
for (const [id, rep] of [['C715513', 'ars'], ['C715514', 'aps']]) { const r = (o[id] = {}); try { await s.go(REPORTS[rep]); await p.waitForTimeout(4000); r.before = await style(/Past due:/);
    await chip(/Past due:/).click(); await p.waitForTimeout(1200); r.pdMenu = await menuInfo(); await p.locator('.q-menu').last().locator('.q-item, label, .q-checkbox').filter({ hasText: '91+ days' }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
    r.after = await style(/Past due:/); await s.shot(id + '-3-chip'); await chip(/Location:/).click(); await p.waitForTimeout(1200); r.locMenu = await menuInfo(); await s.shot(id + '-4-location-menu'); await p.keyboard.press('Escape');
    await chip(/Past due:/).click(); await p.waitForTimeout(1200); r.pdMenu2 = await menuInfo(); await s.shot(id + '-4-pastdue-menu'); await p.keyboard.press('Escape'); } catch (e) { r.err = String(e).slice(0, 200); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('d2b', JSON.stringify({ c511: o.c511after, e: o.err511, pd: [o.C715513?.after, o.C715514?.after] }).slice(0, 700)); await s.close(); process.exit(0);
