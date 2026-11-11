// p29_filter.mjs — 11 Nov 2026: learn the Customer / Vendor filter chip: open it on A/P Detail, picture, menu text and structure, type a
// vendor name in its search box, tick it, close, read the chip and the calls made. Output exec/p29/.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p29/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
await s.go(REPORTS.apd); await p.waitForTimeout(2500);
await p.locator('main button', { hasText: /Vendor:/ }).first().click(); await p.waitForTimeout(1500); await s.shot('vendor-open');
const m = p.locator('.q-menu').last(); o.menu = (await m.innerText().catch(() => '')).slice(0, 700); o.inputs = await m.locator('input').count(); o.html = (await m.innerHTML().catch(() => '')).slice(0, 2500);
if (o.inputs) { await m.locator('input').first().type('ZZAUTOTEST VCREDIT'); await p.waitForTimeout(2000); await s.shot('vendor-typed'); o.menu2 = (await m.innerText()).slice(0, 500); }
const n0 = s.net.length; await m.locator('.q-item, label, .q-checkbox').filter({ hasText: 'ZZAUTOTEST VCREDIT V' }).first().click().catch((e) => { o.tickErr = String(e).slice(0, 200); }); await p.waitForTimeout(1500); await s.shot('ticked'); o.menu3 = (await m.innerText().catch(() => '')).slice(0, 500);
await p.keyboard.press('Escape'); await p.waitForTimeout(2500); await s.shot('closed');
o.chips = await p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /:/.test(t)).slice(0, 6)); o.calls = s.net.slice(n0).map((c) => c.st + ' ' + decodeURIComponent(c.u.replace(/^.*reports\//, '')).slice(0, 200)); o.url = p.url();
o.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ')).slice(0, 8));
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ ...o, html: undefined }).slice(0, 3500)); await s.close(); process.exit(0);
