// p21b_edit.mjs — 11 Nov 2026: p21 created "ZZAUTOTEST Aging no Reports" from the Admin template but did NOT switch Reports off (its
// Page Access control is a checkbox, not a toggle). Open the role's edit page, search "Reports", list what the Page Access card offers,
// untick Reports there, Save, confirm; read the role back. Output exec/p21/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p21/', import.meta.url).pathname; const s = await start(OUT, '/administration/roles-permissions'); const p = s.page; const o = {};
await p.waitForTimeout(2500); const row = p.locator('tr', { hasText: 'ZZAUTOTEST Aging no Reports' }).first(); o.row = (await row.innerText()).replace(/\s+/g, ' ');
await row.locator('button, a').filter({ hasText: /edit/i }).first().click().catch(async () => { await row.locator('button').first().click(); });
await p.waitForTimeout(3000); o.url = p.url(); await s.shot('e1-edit');
const pa = p.locator('div.q-card, div[class*=card], section').filter({ hasText: /^\s*Page Access/ }).last();
o.cards = await p.evaluate(() => [...document.querySelectorAll('main *')].filter(e => /^Page Access$/.test((e.innerText || '').trim())).map(e => e.tagName + '.' + e.className).slice(0, 5));
const h = p.getByText('Page Access', { exact: true }).first(); await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); await s.shot('e2-page-access');
o.paText = await h.locator('xpath=ancestor::div[contains(@class,"q-card") or contains(@class,"card")][1]').innerText().catch(() => null);
fs.writeFileSync(OUT + 'edit-explore.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 3000)); await s.close(); process.exit(0);
