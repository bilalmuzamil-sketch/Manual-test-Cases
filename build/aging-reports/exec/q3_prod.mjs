// q3_prod.mjs — 11 Nov 2026 ~23:45: PRODUCTION (app.shopview.com, the build from before the release) side of q3_qa.mjs: the same clicks for
// C715475 / C715617 / C715618 (one location ticked, link in a new tab, PDF + CSV via q3_common) and C715480's location LIST (pr3 could not open
// it: production puts "Change Location:" inside the user menu as a button with the current location's name). Read-only apart from filter clicks
// and downloads; never switches location. Output exec/prod/q3p/out.json + pictures.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import { linkPdfCsv } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./prod/' + (process.env.OUTDIR || 'q3p') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const o = { side: 'production (before the release)' }; const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version; save(); const ONLY = process.env.ONLY?.split(',');
const shot = async (n, pg = p) => { const f = OUT + n + '.png'; await pg.mouse.move(5, 890).catch(() => {}); await pg.waitForTimeout(400); await pg.screenshot({ path: f }); return f; };
const run = async (id, fn) => { if (ONLY && !ONLY.includes(id)) return; const q = (o[id] = {}); try { await fn(q); } catch (e) { q.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + id + '-error.png' }).catch(() => {}); } save(); console.log(id, q.err || 'ok', JSON.stringify(q).slice(0, 600)); };
const LOC = 'Truck Hill 1';
await run('C715480', async (q) => { await p.goto(B.APP + '/reports/ar-aging-summary', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const av = p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]\S?$/ }).last(); await av.click(); await p.waitForTimeout(1500); q.menu = (await p.locator('.q-menu').last().innerText()).split('\n').map((t) => t.trim()).filter(Boolean); q.pic1 = await shot('C715480-1-menu-open');
  await p.locator('.q-menu').last().getByText(LOC, { exact: true }).first().click(); /* 18:58: not a button element */ await p.waitForTimeout(1500); q.list = (await p.locator('.q-menu:visible, .q-dialog').last().innerText()).split('\n').map((t) => t.trim()).filter(Boolean); q.pic2 = await shot('C715480-2-list'); await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); });
for (const [id, path, tag] of [['C715475', '/reports/inventory-value', 'C715475-iv'], ['C715617', '/reports/sales-by-customer', 'C715617-sbc'], ['C715618', '/reports/work-in-progress', 'C715618-wip']])
  await run(id, async (q) => Object.assign(q, await linkPdfCsv(p.context(), p, B.APP, path, LOC, OUT, tag, shot)));
await B.browser?.close?.().catch(() => {}); process.exit(0);
