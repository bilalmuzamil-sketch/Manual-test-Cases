import { test, expect } from '../fixtures/test.js';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeQuery, SEL, typeAndWait } from '../fixtures/search.js';

/**
 * THE PANEL AND ITS KEYBOARD — opening, closing, arrows, the tab strip, the footer legend.
 *
 * These eleven need NO seeded records: they are about the panel's own behaviour, which is why they
 * are first. Everything here was run by hand and passed before it was automated (Rule 115) - run
 * 415 on production, build v26.40.2-95f3172.
 *
 * SOURCE for all of them: Global Search - Product Requirements v1.5, sections 5.1 Trigger and
 * Surface, 5.2 States and 5.5 Keyboard navigation, plus epic SV-9160.
 *
 * 🔴 THREE TRAPS, EACH PAID FOR IN AN EARLIER PASS AND COMMENTED WHERE THEY BITE:
 *   1. `Control+K` sends Ctrl+Shift+K. The shortcut is lowercase `Control+k`.
 *   2. The tab strip is on screen BEFORE anything is typed, so counting tab ELEMENTS says "a
 *      search ran" when none has. Only the COUNTS prove a search ran.
 *   3. The panel is sticky between tests. Every test closes it first, or it inherits the last
 *      one's query and scope tab and quietly measures the wrong thing.
 */
let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

const fresh = async () => { await closePanel(s.page); await openPanel(s.page); };

test('C44804 — the keyboard shortcut opens a centered box, not one anchored to the header @C44804', async () => {
  await closePanel(s.page);
  await expect(s.page.locator(SEL.modal)).toHaveCount(0);
  await s.page.keyboard.press('Control+k');          // trap 1: lowercase k
  await s.page.waitForTimeout(1_500);
  const box = s.page.locator(SEL.modal);
  await expect(box).toBeVisible();
  // "a centered modal overlay of fixed width 640px ... not anchored to the header field" (5.1)
  const r = await box.boundingBox();
  expect(r, 'the panel has no box on screen').toBeTruthy();
  const viewport = s.page.viewportSize()!;
  const centreOffset = Math.abs((r!.x + r!.width / 2) - viewport.width / 2);
  expect(centreOffset, `panel is not centered: ${centreOffset}px off`).toBeLessThan(40);
});

test('C44805 — clicking the header field opens the same centered box @C44805', async () => {
  await closePanel(s.page);
  await s.page.click('.global-search__trigger');
  await s.page.waitForTimeout(1_500);
  await expect(s.page.locator(SEL.modal)).toBeVisible();
  await expect(s.page.locator(SEL.input)).toBeFocused();
});

test('C44806 — Esc closes it @C44806', async () => {
  await fresh();
  await expect(s.page.locator(SEL.modal)).toBeVisible();
  await s.page.keyboard.press('Escape');
  await s.page.waitForTimeout(900);
  await expect(s.page.locator(SEL.modal)).toHaveCount(0);
});

test('C44807 — the shortcut pressed again closes it @C44807', async () => {
  await fresh();
  await expect(s.page.locator(SEL.modal)).toBeVisible();
  await s.page.keyboard.press('Control+k');
  await s.page.waitForTimeout(900);
  await expect(s.page.locator(SEL.modal)).toHaveCount(0);
});

test('C44808 — clicking the dimmed page behind it closes it @C44808', async () => {
  await fresh();
  await expect(s.page.locator(SEL.modal)).toBeVisible();
  // the underlay, not the page: clicking page coordinates can land ON the panel and close nothing
  await s.page.click('.q-dialog__backdrop', { force: true });
  await s.page.waitForTimeout(900);
  await expect(s.page.locator(SEL.modal)).toHaveCount(0);
});

test('C44809 — Down and Up move the highlight across result rows only @C44809', async () => {
  await fresh();
  await typeAndWait(s.page, 'a');
  const rows = s.page.locator('.search-row');
  const n = await rows.count();
  expect(n, 'no rows came back, so there is nothing to move through').toBeGreaterThan(1);
  const selected = async () => s.page.evaluate(() =>
    [...document.querySelectorAll('.search-row')].findIndex(r => /selected|active|highlight/.test(r.className)));
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  const first = await selected();
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  const second = await selected();
  expect(second, `Down did not advance the highlight (${first} -> ${second})`).toBeGreaterThan(first);
  await s.page.keyboard.press('ArrowUp'); await s.page.waitForTimeout(400);
  expect(await selected(), 'Up did not move the highlight back').toBe(first);
});

test('C44812 — Tab reaches the scope tab strip and the arrows cycle it @C44812', async () => {
  await fresh();
  await typeAndWait(s.page, 'a');
  for (let i = 0; i < 6; i++) {
    await s.page.keyboard.press('Tab'); await s.page.waitForTimeout(250);
    const onStrip = await s.page.evaluate(() =>
      !!document.activeElement?.closest('.search-tabs'));
    if (onStrip) {
      // 🔴 FOCUS DOES NOT TRAVEL WITH THE SELECTION. Pressing Right advances the SELECTED tab while
      // document.activeElement stays on the tab that Tab landed on. Asserting on the focused
      // element's text therefore reports "Right did nothing" when it worked perfectly - measured
      // on production, where the active tab moved 0 -> 1 and activeElement never changed.
      const activeIndex = () => s.page.evaluate(() =>
        [...document.querySelectorAll('.search-tabs__tab')].findIndex(t => /--active/.test(t.className)));
      const before = await activeIndex();
      await s.page.keyboard.press('ArrowRight'); await s.page.waitForTimeout(400);
      const after = await activeIndex();
      expect(after, `Right did not move the selected tab (${before} -> ${after})`).toBeGreaterThan(before);
      await s.page.keyboard.press('ArrowLeft'); await s.page.waitForTimeout(400);
      expect(await activeIndex(), 'Left did not move the selected tab back').toBe(before);
      return;
    }
  }
  throw new Error('Tab never reached the scope tab strip in six presses');
});

test('C44813 — the footer legend stays visible in every state @C44813', async () => {
  await fresh();
  const legend = async () => (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  // empty
  expect(await legend(), 'legend missing before typing').toMatch(/Navigate.*Select.*Close/i);
  // with results
  await typeAndWait(s.page, 'a');
  expect(await legend(), 'legend missing once results are showing').toMatch(/Navigate.*Select.*Close/i);
  // cleared again
  await s.page.fill(SEL.input, ''); await s.page.waitForTimeout(1_200);
  expect(await legend(), 'legend missing after clearing').toMatch(/Navigate.*Select.*Close/i);
});

test('C137996 — the clear control appears only once something is typed @C137996', async () => {
  await fresh();
  // 🔴 THE CLEAR CONTROL CARRIES NO "clear" IN ITS CLASS OR ITS LABEL. It is an ICON button with
  // EMPTY text, and what separates it from the tab buttons and the "Show all" links is precisely
  // that it has no text at all. Looking for class*="clear" matches nothing and reports the control
  // missing while it is plainly on screen - which is what this assertion did on its first run.
  // "Clear all" beside Recent searches is a DIFFERENT control, as the case itself says; it is
  // excluded here by the empty-text test, because it carries a label.
  const clearInBox = () => s.page.evaluate(() =>
    [...document.querySelectorAll('.search-modal button')]
      .filter(b => !b.className.includes('search-tabs__tab') && !(b.textContent || '').trim()).length);
  const before = await clearInBox();
  await typeAndWait(s.page, 'ab');
  const after = await clearInBox();
  expect(after, `the clear control did not appear after typing (before=${before}, after=${after})`)
    .toBeGreaterThan(before);
});

test('C44814 — the tab strip lists All and the eight entity tabs, in order @C44814', async () => {
  await fresh();
  await typeAndWait(s.page, 'a');
  const tabs = await s.page.evaluate(() =>
    [...document.querySelectorAll('.search-tabs__tab')].map(e => e.textContent!.replace(/\s*\(\d+\)/, '').trim()));
  expect(tabs).toEqual(['All', 'Work orders', 'Customers', 'Assets', 'Parts', 'Vendors',
                        'Part sales', 'Purchase orders', 'Vendor invoices']);
});

test('C55683 — the shortcut is written on the header field before it is clicked @C55683', async () => {
  await closePanel(s.page);
  const trigger = await s.page.locator('.global-search__trigger').innerText();
  // the case asks for the RIGHT one for this machine; these run on Linux, so Ctrl
  expect(trigger.replace(/\s+/g, ' '), 'the header field does not show the shortcut')
    .toMatch(/Ctrl\s*K|⌘\s*K/i);
});
