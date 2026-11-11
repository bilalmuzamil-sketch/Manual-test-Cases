// p59_untick.mjs — 11 Nov 2026: C715402 step 7 instrument. Two attempts (s5i, s5i3) to untick the two ticked customers left the chip at
// "Customer: 2 customers": the click landed on something that is not the row's checkbox. This ticks B then A as the case does, then opens the
// Customer menu and records every element whose text holds each name (tag, class, role, aria-checked, box) with a picture, then unticks each
// by clicking the CHECKBOX inside the list row that is checked (aria-checked=true), and reads the chip and its style. Output p59/out.json.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p59/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const A = "Andrews' Truck & Trailer Repair LLC", B = 'Mobile Truck & Trailer Repair Blackfoot';
const style = async () => p.locator('main button', { hasText: /Customer:/ }).first().evaluate((e) => { const c = getComputedStyle(e); return { text: e.innerText.replace(/\s+/g, ' '), bg: c.backgroundColor, color: c.color }; });
try {
  await s.go(REPORTS.ard); await p.waitForTimeout(3000); await F.pick('Customer', B); await F.pick('Customer', A); o.c5 = await style(); await s.shot('1-two-ticked');
  await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(1500); await s.shot('2-menu-open');
  const m = p.locator('.q-menu').last();
  o.els = await m.evaluate((root, names) => names.map((n) => [...root.querySelectorAll('*')].filter((e) => e.children.length < 6 && (e.innerText || '').includes(n)).slice(0, 8).map((e) => { const b = e.getBoundingClientRect(); return { n: n.slice(0, 12), tag: e.tagName, cls: (e.className || '').toString().slice(0, 80), role: e.getAttribute('role'), checked: e.getAttribute('aria-checked'), box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] }; })), [A, B]);
  for (const n of [B, A]) { const inp = m.locator('input').first(); await inp.fill(''); await inp.type(n.split(' ').slice(-1)[0]); await p.waitForTimeout(1800);
    const row = m.locator('.q-item').filter({ hasText: n }).filter({ has: p.locator('[aria-checked="true"]') }).first(); const cnt = await row.count(); o['row-' + n.slice(0, 6)] = cnt;
    if (cnt) await row.locator('[aria-checked="true"]').first().click(); else await m.locator('[aria-checked="true"]').filter({ hasText: n }).first().click().catch((e) => { o['err-' + n.slice(0, 6)] = String(e).slice(0, 120); });
    await p.waitForTimeout(1500); await s.shot('3-after-untick-' + n.split(' ')[0]); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(2500); o.c7 = await style(); o.url7 = p.url(); await s.shot('4-none');
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p59', JSON.stringify({ c5: o.c5?.text, c7: o.c7, url7: o.url7, err: o.err })); await s.close(); process.exit(0);
