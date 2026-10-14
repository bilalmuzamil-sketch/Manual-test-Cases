/** 15 Oct 2026 — STAGING re-check of the filter cases wave 7 sent back (judge/wave7.json), each by its CURRENT steps:
 *  C368224 Catalog / C368225 Inventory keep ONE ticked value after a reload (wave 7: the script ticked "All …", so no single
 *  value was tested) · C368226 Work In Progress / C368231 Sales By Representative keep Location = + Lethbridge after a reload, and
 *  C368232 / C368237 Location untick / tick / Select all / Clear (wave 7: the runner user had one location, so no Location filter)
 *  — run as Admin ShopView, who has both locations · C368236 Technician Utilization with step 6 "Select all" done ·
 *  C368233 Sales By Customer / C368234 Parts Velocity / C368235 Inventory Value: one option, again, the "All …" box (twice if
 *  ticked), Clear selection, back to All — then the SAME steps on production (prod-login-boot, the recorded second account).
 *  Helpers copied from medium-fix3.mts (its menu readers are proven on this build). */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { EV, t } from './wob.mts';
// @ts-ignore
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const PROD = 'https://app.shopview.com';
const OUT = path.join(EV, 'report-filters-stg.json');
const R: Record<string, any> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const shotOn = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return; R[id] = {};
  try { await f(); } catch (e: any) { R[id].error = String(e?.message || e).slice(0, 400); await shotOn(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2500)); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
}
const H = (pg: Page) => ({
  toasts: () => pg.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>,
  nav: async (base: string, top: string, sub?: string) => { await pg.goto(base + '/workorders', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
    const link = pg.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: top }).first();
    if (await link.count()) await link.click(); else await pg.getByText(top, { exact: true }).first().click(); await pg.waitForTimeout(4500);
    if (sub) { await pg.getByText(sub, { exact: true }).last().click(); await pg.waitForTimeout(6000); } },
  table: async () => ({ rows: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).length`), first: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].slice(0, 4).map(r => r.innerText.replace(/\\s+/g, ' ').trim().slice(0, 90))`), totals: await pg.evaluate(`[...document.querySelectorAll('.q-card, [class*=summary], [class*=total]')].filter(e => e.getBoundingClientRect().y < 500 && /\\$|\\d/.test(e.innerText)).map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80)).slice(0, 4)`) }),
  filterEl: (label: string) => pg.locator('.q-page-container, main').first().locator('button, .q-btn, .q-chip, .q-field, [data-test-id^="filter_chip_"]').filter({ hasText: new RegExp('^\\s*(?:[a-z_]+\\s*)?' + label, 'i') }).first(),
  items: () => pg.locator('.q-menu').filter({ visible: true }).last().locator('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio').filter({ hasText: /\S/ }),
  state: () => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio')].filter(e => e.innerText.trim()).map(e => { const on = !!(e.querySelector('.q-checkbox__inner--truthy, .q-radio__inner--truthy, [aria-checked=true], [aria-selected=true]') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || e.classList.contains('q-item--active'));
      return (on ? '[x] ' : '[ ] ') + e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 50); }).filter((x, i, a) => a.indexOf(x) === i).slice(0, 14); })()`) as Promise<string[] | null>,
  buttons: () => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); return m ? [...m.querySelectorAll('button, .q-btn')].map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean) : []; })()`) as Promise<string[]>,
  close: async () => { await pg.keyboard.press('Escape'); await pg.waitForTimeout(900); },
});
const isAll = (x: string) => /^\s*(All\b|Select all)/i.test(x);
/** first option that is a real value (not "All …"/"Select all"), optionally matching `pick` */
async function realOption(h: ReturnType<typeof H>, pick?: string) {
  const items = h.items(); const n = await items.count();
  for (let i = 0; i < n; i++) { const tx = (await items.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); if (!tx || isAll(tx) || /Clear/i.test(tx)) continue; if (pick && !tx.includes(pick)) continue; return { loc: items.nth(i), text: tx }; }
  return null;
}
async function keepAfterReload(pg: Page, id: string, label: string, pick?: string) {
  const h = H(pg); const o: any = {}; const f = h.filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) { await shotOn(pg, `${id}-no-filter`); return o; }
  await f.click(); await pg.waitForTimeout(1500); o.menuBefore = await h.state();
  if ((await h.items().count()) < 3) { await pg.keyboard.type('a', { delay: 60 }); await pg.waitForTimeout(2500); }
  const op = await realOption(h, pick); if (!op) { o.noOption = await h.state(); await h.close(); return o; }
  o.picked = op.text; await op.loc.click(); await pg.waitForTimeout(2500); o.menuAfterPick = await h.state(); await h.close(); await pg.waitForTimeout(2500);
  o.tableBefore = await h.table(); o.chip = (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await shotOn(pg, `${id}-before-reload`);
  await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(8000);
  o.tableAfter = await h.table(); o.chipAfter = (await h.filterEl(label).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); o.url = pg.url().replace(/^https:\/\/[^/]+/, '');
  await h.filterEl(label).click().catch(() => {}); await pg.waitForTimeout(1500); o.menuAfterReload = await h.state(); await shotOn(pg, `${id}-after-reload`); await h.close(); o.toasts = await h.toasts();
  o.sameRows = JSON.stringify(o.tableBefore.first) === JSON.stringify(o.tableAfter.first) && o.tableBefore.rows === o.tableAfter.rows;
  return o;
}
/** untick one, tick it again, Select all, Clear selection (C368232 C368236 C368237) */
async function tickSelectClear(pg: Page, id: string, label: string) {
  const h = H(pg); const o: any = {}; const f = h.filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) { await shotOn(pg, `${id}-no-filter`); return o; }
  await f.click(); await pg.waitForTimeout(1500); o.start = await h.state(); o.buttons = await h.buttons(); o.tableStart = await h.table();
  const op = await realOption(h); if (!op) return o; o.option = op.text;
  await op.loc.click(); await pg.waitForTimeout(2500); o.step4 = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-step4-untick`);
  const again = await realOption(h, op.text.split(' ').slice(0, 3).join(' ')); await (again ?? op).loc.click(); await pg.waitForTimeout(2500); o.step5 = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-step5-tick`);
  const sel = pg.locator('.q-menu:visible').locator('.q-item, button, [role=option], .q-checkbox').filter({ hasText: /^\s*Select all\s*$/i }).first(); o.selectAllFound = await sel.count();
  if (o.selectAllFound) { await sel.click(); await pg.waitForTimeout(2500); o.step6 = { menu: await h.state(), table: await h.table(), toasts: await h.toasts() }; await shotOn(pg, `${id}-step6-select-all`); }
  const clr = pg.locator('.q-menu:visible').locator('.q-item, button').filter({ hasText: /^\s*Clear( selection)?\s*$/i }).first(); o.clearFound = await clr.count(); o.clearWord = o.clearFound ? (await clr.innerText()).trim() : null;
  if (o.clearFound) { await clr.click(); await pg.waitForTimeout(2500); o.step7 = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-step7-clear`); }
  await h.close(); o.step8 = { chip: (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(), table: await h.table(), toasts: await h.toasts() }; await shotOn(pg, `${id}-step8-closed`);
  return o;
}
/** C368233-235: one option, again, the All box (twice if ticked), Clear selection, back to All */
async function allBox(pg: Page, id: string, label: string, tag: string) {
  const h = H(pg); const o: any = {}; const f = h.filterEl(label); o.filterFound = await f.count(); if (!o.filterFound) { await shotOn(pg, `${id}-${tag}-no-filter`); return o; }
  await f.click(); await pg.waitForTimeout(1500); if ((await h.items().count()) < 3) { await pg.keyboard.type('a', { delay: 60 }); await pg.waitForTimeout(2500); }
  o.step3 = { menu: await h.state(), buttons: await h.buttons(), table: await h.table() }; await shotOn(pg, `${id}-${tag}-step3`);
  const op = await realOption(h); if (!op) return o; o.option = op.text;
  await op.loc.click(); await pg.waitForTimeout(3500); o.step4 = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-${tag}-step4-one`);
  const again = await realOption(h, op.text.split(' ').slice(0, 3).join(' ')); await (again ?? op).loc.click(); await pg.waitForTimeout(3500); o.step5 = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-${tag}-step5-again`);
  const allLoc = h.items().filter({ hasText: /^\s*All\b/ }).first(); o.allFound = await allLoc.count();
  if (o.allFound) { const before = await h.state(); await allLoc.click(); await pg.waitForTimeout(3500); o.step6 = { before, menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-${tag}-step6-all`);
    if ((o.step6.menu ?? []).some((x: string) => /^\[x\] All\b/.test(x))) { await h.items().filter({ hasText: /^\s*All\b/ }).first().click(); await pg.waitForTimeout(3500); o.step6b = { menu: await h.state(), table: await h.table() }; await shotOn(pg, `${id}-${tag}-step6b-all-again`); } }
  o.step7 = { buttons: await h.buttons() }; const clr = pg.locator('.q-menu:visible').locator('.q-item, button').filter({ hasText: /Clear( selection)?/i }).first(); o.step7.clearFound = await clr.count();
  if (o.step7.clearFound) { o.step7.word = (await clr.innerText()).trim(); await clr.click(); await pg.waitForTimeout(3000); o.step7.menu = await h.state(); }
  // step 8: close, set back to All
  const st = await h.state(); if (st && !st.some((x) => /^\[x\] All\b/.test(x))) { const al = h.items().filter({ hasText: /^\s*All\b/ }).first(); if (await al.count()) { await al.click(); await pg.waitForTimeout(2500); } }
  await h.close(); o.step8 = { chip: (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(), toasts: await h.toasts() }; await shotOn(pg, `${id}-${tag}-step8`);
  return o;
}

const hs = H(p);
await run('C368224', async () => { await hs.nav(APP, 'Parts', 'Catalog'); Object.assign(R.C368224, { page: p.url().replace(APP, '') }, await keepAfterReload(p, 'C368224', 'Manufacturer')); });
await run('C368225', async () => { await hs.nav(APP, 'Parts', 'Inventory'); Object.assign(R.C368225, { page: p.url().replace(APP, '') }, await keepAfterReload(p, 'C368225', 'Category')); });
for (const [id, rep] of [['C368226', 'Work In Progress'], ['C368231', 'Sales By Representative']] as const)
  await run(id, async () => { await hs.nav(APP, 'Reports', rep); Object.assign(R[id], { page: p.url().replace(APP, '') }, await keepAfterReload(p, id, 'Location', 'Lethbridge')); });
for (const [id, rep, label] of [['C368232', 'Work In Progress', 'Location'], ['C368236', 'Technician Utilization', 'Technician'], ['C368237', 'Sales By Representative', 'Location']] as const)
  await run(id, async () => { await hs.nav(APP, 'Reports', rep); Object.assign(R[id], { page: p.url().replace(APP, '') }, await tickSelectClear(p, id, label)); });
const ALLBOX = [['C368233', 'Sales By Customer', 'Customer'], ['C368234', 'Parts Velocity', 'Vendor'], ['C368235', 'Inventory Value', 'Category']] as const;
for (const [id, rep, label] of ALLBOX) await run(id, async () => { await hs.nav(APP, 'Reports', rep); R[id].staging = await allBox(p, id, label, 'staging'); });
if (ALLBOX.some(([id]) => want(id))) {
  let prod: any = null; try { prod = await bootProdLogin('/workorders', { deviceScaleFactor: Number(process.env.QA_DPR || 1) }); } catch (e: any) { for (const [id] of ALLBOX) if (want(id)) R[id].production = { error: 'production sign-in: ' + String(e?.message || e).slice(0, 200) }; }
  if (prod) { const pp: Page = prod.page; const hp = H(pp);
    const ver = await pp.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
    for (const [id, rep, label] of ALLBOX) { if (!want(id)) continue; try { await hp.nav(PROD, 'Reports', rep); R[id].production = { build: ver, ...(await allBox(pp, id, label, 'production')) }; } catch (e: any) { R[id].production = { error: String(e?.message || e).slice(0, 300) }; await shotOn(pp, `${id}-production-error`); }
      console.log(t(), id, 'production', JSON.stringify(R[id].production).slice(0, 1500)); fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
    await prod.browser.close().catch(() => {}); }
}
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await done(browser);
