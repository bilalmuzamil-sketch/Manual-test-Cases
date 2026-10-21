/** c698884-1021.mts — 21 Oct 2026: C698884 (SV-11580) "Board View has no Density control and Column Selection sits centred", all 5 steps,
 *  as the signed-in Admin at Staging Heavy Duty. Run by the hourly check-ins (QA lead: "test this in next 5 hours") once staging's build
 *  changes. Reads, per step:
 *   1 Board View toolbar: density button present? the card-fields button's name (aria-label / title / hover tooltip / text) and its
 *     test-id; the toolbar dividers either side of it and the gaps (centred = gaps within 4 px); two dividers side by side = double divider.
 *   2 click the card-fields button: menu opens, its items.   3 Escape: menu closed; card spacing (gap between the first two cards of a
 *     column, before the click and after Escape).   4 Tech View: density button present.   5 density menu offers Compact/Regular/Comfortable.
 *  Positive control: the display switcher must be found in the toolbar, or every "absent" reading is void. Pictures EV/C698884-1021-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { HEAVY } from './staff.mts';
import { EV, t, display, tab, ensureLocation } from './wob.mts';
const OUT = path.join(EV, 'c698884-1021.json');
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(20_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C698884-1021-${n}.png`) }).catch(() => {});
const o: any = { at: new Date().toISOString(), build: await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null) };
const vis = (sel: string) => p.evaluate(`[...document.querySelectorAll('${sel}')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length`) as Promise<number>;
const menus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(m => m.innerText.replace(/\\s+/g, ' ').trim().slice(0, 400))`) as Promise<string[]>;
/** the toolbar row that holds the display switcher: every visible child with its box, kind and name */
const toolbar = () => p.evaluate(`(() => {
  const sw = document.querySelector('[aria-label="Board View"], [aria-label="Tech View"]'); if (!sw) return null;
  let row = sw; for (let i = 0; i < 8 && row; i++) { row = row.parentElement; if (row && row.querySelector('[data-test-id^="button_"]') && row.getBoundingClientRect().width > 600) break; }
  const items = [...row.querySelectorAll('button, [role=separator], .q-separator, hr, [class*="divider"]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
    .map(e => { const r = e.getBoundingClientRect(); const sep = e.matches('[role=separator], .q-separator, hr, [class*="divider"]');
      return { kind: sep ? 'divider' : 'button', tid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'), title: e.getAttribute('title'), text: (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40), x: Math.round(r.left), w: Math.round(r.width), y: Math.round(r.top), h: Math.round(r.height) }; });
  const r = row.getBoundingClientRect(); return { box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], items: items.sort((x, y) => x.x - y.x) }; })()`) as Promise<any>;
const cardGap = () => p.evaluate(`(() => { const cols = [...document.querySelectorAll('[data-test-id^="board_column_"]')]; for (const c of cols) { const cards = [...c.querySelectorAll('[data-test-id^="board_card_"], [data-test-id^="work_order_card_"]')].filter(e => e.getBoundingClientRect().height > 40); if (cards.length > 1) { const a = cards[0].getBoundingClientRect(), b = cards[1].getBoundingClientRect(); return { gap: Math.round(b.top - a.bottom), h: Math.round(a.height) }; } } return null; })()`).catch(() => null);
const FIELDS = '[data-test-id="button_board_fields_selection"], [data-test-id="button_column_selection"], [data-test-id="button_board_column_selection"]';
try {
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  o.location = await ensureLocation(p, a, HEAVY); await tab(p, 'All').catch(() => {});
  await display(p, 'Board View'); await W(2500); await p.mouse.move(5, 600); await W(600);
  // Step 1
  const tb = await toolbar(); o.s1 = { switcherFound: !!tb, densityButtons: await vis('[data-test-id="button_density"]'), toolbar: tb };
  const fi = tb ? tb.items.findIndex((x: any) => x.kind === 'button' && /fields_selection|column_selection/.test(x.tid || '')) : -1;
  if (fi >= 0) { const f = tb.items[fi]; const L = tb.items.slice(0, fi).reverse().find((x: any) => x.kind === 'divider'); const R = tb.items.slice(fi + 1).find((x: any) => x.kind === 'divider');
    o.s1.fields = f; o.s1.leftDivider = L ?? null; o.s1.rightDivider = R ?? null;
    if (L && R) { o.s1.gapLeft = f.x - (L.x + L.w); o.s1.gapRight = R.x - (f.x + f.w); o.s1.centred = Math.abs(o.s1.gapLeft - o.s1.gapRight) <= 4; }
    o.s1.betweenLeftAndFields = tb.items.slice(tb.items.indexOf(L), fi).map((x: any) => x.tid || x.kind);
    o.s1.betweenFieldsAndRight = tb.items.slice(fi + 1, tb.items.indexOf(R)).map((x: any) => x.tid || x.kind);
    let dbl = false; for (let i = 1; i < tb.items.length; i++) if (tb.items[i].kind === 'divider' && tb.items[i - 1].kind === 'divider') dbl = true; o.s1.doubleDivider = dbl;
    await p.locator(FIELDS).first().hover().catch(() => {}); await W(1200);
    o.s1.tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`).catch(() => []);
  }
  await shot('s1-board-toolbar'); await p.mouse.move(5, 600); await W(500);
  o.gapBefore = await cardGap();
  // Step 2
  await p.locator(FIELDS).first().click().catch((e) => { o.s2err = String(e).slice(0, 120); }); await W(1500); o.s2 = { menus: await menus() }; await shot('s2-picker');
  // Step 3
  await p.keyboard.press('Escape'); await W(1200); o.s3 = { menusOpen: (await menus()).length, gapAfter: await cardGap() }; await shot('s3-after-escape');
  // Step 4
  await display(p, 'Tech View'); await W(2500); o.s4 = { densityButtons: await vis('[data-test-id="button_density"]') }; await shot('s4-tech-toolbar');
  // Step 5
  await p.locator('[data-test-id="button_density"]').first().click().catch(() => {}); await W(1000);
  o.s5 = { options: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []) };
  await shot('s5-density-menu'); await p.keyboard.press('Escape');
  o.summary = { boardDensityGone: o.s1.switcherFound && o.s1.densityButtons === 0, fieldsName: [o.s1.fields?.aria, o.s1.fields?.title, ...(o.s1.tooltip || [])].filter(Boolean),
    centred: o.s1.centred ?? null, doubleDivider: o.s1.doubleDivider ?? null, pickerOpened: (o.s2.menus || []).length > 0, closedByEscape: o.s3.menusOpen === 0,
    techDensity: o.s4.densityButtons > 0, techOptions: o.s5.options };
  console.log(t(), 'SUMMARY C698884', JSON.stringify(o.summary));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); console.log(t(), 'ERROR', o.error); await shot('error'); }
fs.writeFileSync(OUT, JSON.stringify(o, null, 1)); await done(browser);
