// q1c_memory.mjs — 11 Nov 2026 ~16:25: QA ("after the release") side of C715583 / C715619 / C715620, redone. q1's untick read `.q-item` rows (none
// on this build), so nothing changed and its "kept" is VOID. Also the QA reports open on the CURRENT location only (L0657), where production's
// opened on All locations - so "untick location B" is not always possible here. Change the Location filter by its own menu lines (getByText
// exact): if every location is ticked, untick the second; otherwise tick the second. The chip MUST change (else VOID). Then A/R Aging Summary
// from the left menu, back from the left menu, chip read again: kept / forgotten / other. Output q1c/out.json + pictures.
import { start } from './lib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./q1c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/reports'); const p = s.page; const o = {};
const chips = () => p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /:/.test(t) && t.length < 90).slice(0, 8));
const left = async (label) => { await s.go('/reports'); await p.waitForTimeout(2500); await p.getByText(label, { exact: true }).first().click(); await p.waitForTimeout(5000); };
async function change() { await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); const menu = p.locator('.q-menu:visible').last(); const lines = (await menu.innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  const locs = lines.filter((t) => !/^(Select all|Clear selection|search)$/i.test(t) && !/selected$/i.test(t)); const target = locs[1]; if (target) await menu.getByText(target, { exact: true }).first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(3000); return { lines, target }; }
await ensureLoc(p, 'Staging Heavy Duty - 9919');
for (const [id, label] of [['C715583', 'Sales By Customer'], ['C715619', 'Inventory Value'], ['C715620', 'Work In Progress']]) { const r = (o[id] = {});
  try { await left(label); r.url0 = p.url(); r.chips0 = await chips(); r.ch = await change(); r.chips1 = await chips(); r.url1 = p.url(); r.changed = JSON.stringify(r.chips1) !== JSON.stringify(r.chips0); r.p1 = await s.shot(id + '-1-changed');
    await left('A/R Aging Summary'); r.p2 = await s.shot(id + '-2-ar'); await left(label); r.chips3 = await chips(); r.url3 = p.url(); r.p3 = await s.shot(id + '-3-back');
    const loc = (c) => (c || []).find((x) => /Location:/.test(x)); r.verdict = !r.changed ? 'VOID (the chip did not change)' : loc(r.chips3) === loc(r.chips1) ? 'kept' : loc(r.chips3) === loc(r.chips0) ? 'forgotten' : 'other';
  } catch (e) { r.err = String(e).slice(0, 200); } fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
console.log('q1c', JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, [v.verdict || v.err, (v.chips0 || []).find((x) => /Location/.test(x)), (v.chips1 || []).find((x) => /Location/.test(x)), (v.chips3 || []).find((x) => /Location/.test(x))]]))).slice(0, 900)); await s.close(); process.exit(0);
