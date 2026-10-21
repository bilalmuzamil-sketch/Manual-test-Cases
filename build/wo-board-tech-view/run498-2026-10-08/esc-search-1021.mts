/** esc-search-1021.mts — 21 Oct 2026, staging, defect re-check before the ask (Rule 62 c gate 3): PRD v73 S11-R5 "Escape closes an open menu,
 *  dialog or tooltip without changing anything." In Board View and Tech View: (control) open the Technician list, press Escape → it closes;
 *  (finding) open it, click into "Search technician", press Escape → is it still open? Then a second Escape. Also: Escape after typing a
 *  name, and whether the typed text / ticks changed. Pictures before and after each Escape. Records only. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, ensureLocation } from './wob.mts';
const OUT = path.join(EV, 'esc-search-1021.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms); const R: any = { build: await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null) };
const chip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const openMenus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).length`) as Promise<number>;
const focus = () => p.evaluate(`document.activeElement ? (document.activeElement.getAttribute('placeholder') || document.activeElement.getAttribute('aria-label') || document.activeElement.tagName) : null`).catch(() => null);
const box = () => p.getByPlaceholder('Search technician').last();
try {
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  R.location = await ensureLocation(p, a, HEAVY); await tab(p, 'All').catch(() => {});
  for (const view of ['Board View', 'Tech View']) {
    const v: any = {}; R[view] = v; const tag = view === 'Board View' ? 'board' : 'tech';
    await display(p, view); await W(2000);
    // control: Escape with focus where the click left it
    await chip().click(); await W(1500); v.ctlOpen = await openMenus(); v.ctlFocus = await focus();
    await p.keyboard.press('Escape'); await W(1200); v.ctlAfterEscape = await openMenus(); await shot(p, `ESC-1021-${tag}-control-after-escape`);
    // finding: click into the search box, press Escape
    await chip().click(); await W(1500); await box().click(); await W(500); v.boxFocus = await focus(); await shot(p, `ESC-1021-${tag}-search-focused`);
    await p.keyboard.press('Escape'); await W(1200); v.afterEscape = await openMenus(); v.focusAfter = await focus(); await shot(p, `ESC-1021-${tag}-after-escape`);
    await p.keyboard.press('Escape'); await W(1200); v.afterSecondEscape = await openMenus(); await shot(p, `ESC-1021-${tag}-after-second-escape`);
    // with a name typed
    if (await openMenus() === 0) { await chip().click(); await W(1500); }
    await box().click(); await box().fill('Ralph'); await W(900); v.typed = await box().inputValue().catch(() => null);
    await p.keyboard.press('Escape'); await W(1200); v.typedAfterEscape = { open: await openMenus(), text: await box().inputValue().catch(() => null) }; await shot(p, `ESC-1021-${tag}-typed-after-escape`);
    await box().fill('').catch(() => {}); await p.mouse.click(5, 450); await W(1200); v.closedByClickOutside = (await openMenus()) === 0;
  }
} catch (e: any) { R.err = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); console.log('ESC', JSON.stringify(R));
await RUN.end().catch(() => {});
await done(browser);
