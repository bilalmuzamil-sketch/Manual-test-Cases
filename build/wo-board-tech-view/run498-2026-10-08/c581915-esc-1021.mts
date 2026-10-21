/** c581915-esc-1021.mts — 21 Oct 2026, staging: C581915 steps 8-10 exactly as written (Board View → click "Technician" → press Escape),
 *  because c581915-1021 typed into "Search technician" before its Escape (not a step of the case) and then read the list still open.
 *  Reads: list open after the click; list open after Escape (twice: plain, and after a click in the search box as the control). Records only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, ensureLocation } from './wob.mts';
const OUT = path.join(EV, 'c581915-esc-1021.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms); const R: any = {};
const chip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const openMenus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).length`) as Promise<number>;
try {
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  R.location = await ensureLocation(p, a, HEAVY); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
  await chip().click(); await W(1500); R.afterClick = await openMenus(); R.focus = await p.evaluate(`document.activeElement ? (document.activeElement.getAttribute('placeholder') || document.activeElement.tagName) : null`);
  await shot(p, 'C581915-1021-s9-board-list-open');
  await p.keyboard.press('Escape'); await W(1200); R.afterEscape = await openMenus(); await shot(p, 'C581915-1021-s10-after-escape');
  await chip().click(); await W(1500); await p.getByPlaceholder('Search technician').last().click(); await p.getByPlaceholder('Search technician').last().fill('Aimee'); await W(800); await p.getByPlaceholder('Search technician').last().fill(''); await W(600);
  await p.keyboard.press('Escape'); await W(1200); R.afterEscapeFromSearchBox = await openMenus();
  await p.keyboard.press('Escape'); await W(1200); R.afterSecondEscape = await openMenus();
} catch (e: any) { R.err = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
await RUN.end().catch(() => {});
await done(browser);
