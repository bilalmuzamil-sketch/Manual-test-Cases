// s19_custmenu.mjs — 14 Nov 2026: why the A/R Customer menu shows only ~51 names. Reads the menu's full text end, scroll metrics, and what the search box does. Read-only.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s19/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = {};
const resp = []; p.on('response', (r) => { if (/customer/i.test(r.url()) && r.request().resourceType() !== 'image') resp.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 200)); });
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000); resp.length = 0;
await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(2500); const menu = p.locator('.q-menu').last();
const txt = await menu.innerText(); o.head = txt.split('\n').slice(0, 6); o.tail = txt.split('\n').slice(-6); o.n = await menu.locator('.filter-panel__option').count();
o.list = await menu.evaluate((e) => { const l = e.querySelector('.filter-panel__list'); return l && { sh: l.scrollHeight, ch: l.clientHeight, kids: [...l.children].slice(-3).map((c) => c.className + ' | ' + c.innerText.slice(0, 60)) }; });
o.respOpen = [...resp]; resp.length = 0;
await menu.locator('input:not([type=checkbox])').first().fill(process.env.Q || 'ZZAUTOTESTAbcdefghij'); await p.waitForTimeout(3000); o.nAfterSearch = await menu.locator('.filter-panel__option').count(); o.afterSearch = (await menu.innerText()).split('\n').slice(0, 14); o.respSearch = [...resp];
o.pic = await s.shot('custmenu-search');
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
