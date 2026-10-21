/**
 * c698883-1021.mts — 21 Oct 2026, staging: C698883 "Opening the Technician list never shows the 50-value limit message" (run 498, test
 * 4093190), by its CURRENT steps (case text read live 21 Oct; 7 steps). Location switched on screen and read back (L0490: a run can land at
 * another location). At each step: is the red 50-value message drawn inside the open list, which options are ticked, a picture.
 * Positive control, only if the message never shows: tick technicians one by one until the total would pass 50 — the message must then
 * appear (proves the reading can see it); the ticks are cleared afterwards. Raw readings only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, switchLocUI } from './wob.mts';
const OUT = path.join(EV, 'c698883-1021.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: any = { started: new Date().toISOString() }; const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const MSG = /exceed the 50-value limit across all filters/;
const chip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const read = async () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop();
  if (!m) return { open: false };
  const t = m.innerText; const items = [...m.querySelectorAll('.q-item, .q-checkbox')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean);
  const ticked = [...m.querySelectorAll('.q-checkbox')].filter(e => e.getAttribute('aria-checked') === 'true' || e.querySelector('.q-checkbox__inner--truthy')).map(e => e.innerText.replace(/\\s+/g, ' ').trim());
  return { open: true, message: /exceed the 50-value limit across all filters/.test(t), first: items[0] || null, ticked }; })()`) as Promise<any>;
const unassigned = () => p.locator('.q-menu').last().locator('.q-checkbox').filter({ hasText: /^\s*Unassigned\s*$/ }).first();
try {
  R.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  R.location = await switchLocUI(p, 'Staging Heavy Duty - 9919'); if (!/Staging Heavy Duty/.test(R.location)) throw new Error('not at Staging Heavy Duty: ' + R.location);
  await tab(p, 'All').catch(() => {}); await display(p, 'Tech View');
  R.build = R.build || await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
  R.start = { chips: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`), search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) };
  await chip().click(); await W(1500); R.s1_2 = await read(); await shot(p, 'C698883-1021-s2-list-open');
  await unassigned().click(); await W(1200); R.s3 = await read(); await shot(p, 'C698883-1021-s3-unassigned');
  await p.keyboard.press('Escape'); await W(900); R.s4 = await read();
  await display(p, 'Board View'); R.s5 = await p.evaluate(`!!document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller')`);
  await chip().click(); await W(1500); R.s6 = await read(); await shot(p, 'C698883-1021-s6-board-list');
  await unassigned().click(); await W(1200); R.s7 = await read(); await shot(p, 'C698883-1021-s7-untick');
  const shown = [R.s1_2, R.s3, R.s6, R.s7].some((x: any) => x?.message);
  if (!shown) {   // positive control: the reading must be able to see the message when it is due
    const boxes = p.locator('.q-menu').last().locator('.q-checkbox'); R.control = { ticks: 0 };
    for (let i = 1; i < 60; i++) { const b = boxes.nth(i); if (!(await b.count())) break; await b.click().catch(() => {}); await W(250); R.control.ticks = i; const r = await read(); if (r.message) { R.control.messageAt = i; break; } }
    await shot(p, 'C698883-1021-control-over-50');
    await p.locator('.q-menu').last().getByText('Clear selection').click().catch(() => {}); await W(1000); R.control.afterClear = await read();
  }
  await p.keyboard.press('Escape'); await W(600);
} catch (e: any) { R.err = String(e?.message || e).slice(0, 400); await shot(p, 'C698883-1021-error').catch(() => {}); }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); save(); console.log(JSON.stringify(R).slice(0, 3000));
await RUN.end().catch(() => {});
await done(browser);
