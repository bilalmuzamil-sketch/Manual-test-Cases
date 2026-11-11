// q4_sbcmenus.mjs — 11 Nov 2026 19:10 UTC: C715584 (Sales By Customer's filter menus behave as before the release), QA side; production side is
// prod/pr1.json C715584 (Clear selection -> "Location: No locations", Select all -> "Location: All locations" + address unchanged
// /reports/sales-by-customer, Customer search typed "tru" with the cursor kept in the box, 900 px filter row). Same clicks here, plus the list
// length before/after typing (step 4 "narrows") with letters of a customer that exists ("Des" - Desert Edge Truck Service & Repair).
import { start } from './lib.mjs'; import { settle, chipsOf } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./' + (process.env.OUTDIR || 'q4') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {}; const r = (o.C715584 = {});
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const shot = async (n) => { const f = OUT + 'C715584-' + n + '.png'; await p.waitForTimeout(400); await p.screenshot({ path: f }); return f; };
try { await s.go('/reports/sales-by-customer'); await p.waitForTimeout(4000); await settle(p); r.chips0 = await chipsOf(p); r.url0 = p.url();
  await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu:visible').last(); r.menu0 = (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  await m.getByText('Clear selection', { exact: true }).first().click(); await p.waitForTimeout(2000); r.afterClear = { chips: await chipsOf(p), url: p.url(), menu: (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean) }; r.pic1 = await shot('1-cleared');
  await m.getByText('Select all', { exact: true }).first().click(); await p.waitForTimeout(2500); r.afterAll = { chips: await chipsOf(p), url: p.url(), menu: (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean) }; r.pic2 = await shot('2-select-all');
  await p.keyboard.press('Escape'); await settle(p); r.afterClose = { chips: await chipsOf(p), url: p.url() };
  await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(1500); const cm = p.locator('.q-menu:visible').last(); const inp = cm.locator('input').first(); r.hasSearch = await inp.count(); r.placeholder = await inp.getAttribute('placeholder').catch(() => null);
  const lines = async () => (await cm.innerText()).split('\n').map((t) => t.trim()).filter(Boolean); r.list0 = (await lines()).length; r.pic3 = await shot('3-customer-menu');
  await inp.click(); r.steps = []; for (const ch of 'Des') { await p.keyboard.type(ch); await p.waitForTimeout(900); r.steps.push({ value: await inp.inputValue(), focus: await inp.evaluate((e) => document.activeElement === e), n: (await lines()).length, first: (await lines()).slice(0, 6) }); }
  r.typed = await inp.inputValue(); r.focusInInput = await inp.evaluate((e) => document.activeElement === e); r.pic4 = await shot('4-typing'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  await p.setViewportSize({ width: 900, height: 900 }); await p.waitForTimeout(2500); r.row900 = await chipsOf(p); r.row900Text = (await p.locator('main').innerText()).split('\n').slice(0, 8); r.pic5 = await shot('5-900px'); await p.setViewportSize({ width: 1440, height: 900 });
} catch (e) { r.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'C715584-error.png' }).catch(() => {}); }
save(); console.log('C715584', r.err || 'ok', JSON.stringify(r).slice(0, 700)); await s.close(); process.exit(0);
