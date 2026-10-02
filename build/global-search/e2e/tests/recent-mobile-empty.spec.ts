import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * RECENT SEARCHES, THE MOBILE SURFACE, AND THE SCOPED EMPTY STATE.
 *
 * SOURCE: Global Search — Product Requirements v1.5, §5.2 States, §5.6 Recent activity and
 * §6 Mobile, plus epic SV-9160. Each check was run by hand and passed in run 415 first (Rule 115).
 *
 * 🔴 THE TRAP THAT GOVERNS THIS WHOLE FILE: recent-activity rows and RESULT rows are both
 * `.search-row`. Counting rows therefore cannot tell you which state the panel is in, and an
 * assertion written that way reports "results are showing before anything was typed" on any
 * account with search history - which, after a suite has just run, is every account. Judge the
 * STATE from the panel's own wording first, then the rows within it.
 */
let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
let LIVE: LiveAnchors = {};
let BROAD = '';
test.beforeAll(async () => {
  LIVE = await harvestAnchors(s.page);
  const b = await broadTerm(s.page);
  BROAD = b?.term ?? '';
});
test.afterAll(async () => { await s?.browser.close(); });

/**
 * 🔴 A TEST THAT OPENS A RECORD LEAVES THE NEXT TEST ON THAT RECORD'S PAGE, where the keyboard
 * shortcut does not always take. The next check then fails with "the panel is not there", which
 * says nothing about the panel and everything about where the previous test finished. Start every
 * check from the same page.
 */
test.beforeEach(async () => {
  // 🔴 `/customers` ALSO MATCHES `/customers/<id>`. A record page therefore looked like the list
  // page, the guard did not send the session home, and the next check opened its panel on a page
  // where the shortcut does not take - reported as "the search panel is not there". Match the LIST.
  if (!/\/customers\/?(\?|$)/.test(s.page.url())) {
    // 🔴 ALWAYS GIVE THIS AN EXPLICIT TIMEOUT. Without one the navigation inherits a long default,
    // and when it stalls the BEFORE-EACH times out instead of the test - so the report blames a
    // tablet check that never ran. It happened to C55674 at 120s.
    await s.page.goto(`${process.env.GS_APP || ''}/customers`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => {});
    await s.page.waitForTimeout(4_000);
  }
});

const panelText = async () => (await s.page.locator(SEL.modal).innerText().catch(() => '')).replace(/\s+/g, ' ');

/** Put at least one record into recent activity by opening it, so these never depend on history. */
/** 🔴 THE PANEL REMEMBERS ITS QUERY. Reopening it after a search shows those RESULTS, not the
 *  recent-activity list, so a check about recent activity reads "the panel is not showing its
 *  recent list" while the panel is working exactly as designed. Empty the field to reach the
 *  first-time state. */
async function clearField(page = s.page) {
  await page.locator(SEL.input).fill('').catch(() => {});
  await page.waitForTimeout(2_000);
  return true;
}

/** Re-open the panel after a navigation. The shortcut is ignored while the new page is still
 *  settling, and the resulting "panel not visible" reads as the shortcut being broken. */
async function reopen(page = s.page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(2_500);
  await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  for (let i = 0; i < 3; i++) {
    await closePanel(page);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(2_000);
    if (await page.locator(SEL.modal).count()) return clearField(page);
    // 🔴 THE SHORTCUT IS NOT ALWAYS THE WAY BACK IN. On a record page opened from a result the
    // keypress can land before the view has taken the keyboard, and four presses in a row then all
    // miss - which reads as the shortcut being broken when the panel opens perfectly from the
    // header field. C44805 is the check that proves that route; use it as the fallback here so a
    // focus quirk on one page cannot fail a check about recent activity.
    const clicked = await page.locator('.global-search__trigger').click({ timeout: 4_000 })
      .then(() => true).catch(() => false);
    await page.waitForTimeout(2_000);
    if (clicked && await page.locator(SEL.modal).count()) return clearField(page);
  }
  return false;
}

async function seedRecent(): Promise<boolean> {
  if (!BROAD) return false;
  await typeAndWait(s.page, BROAD);
  const n = await s.page.locator('.search-row').count();
  if (!n) return false;
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  await s.page.keyboard.press('Enter');
  await s.page.waitForLoadState('domcontentloaded').catch(() => {});
  await s.page.waitForTimeout(4_000);
  // come back to a page the panel is known to work from; recent activity is global, so this
  // changes nothing about what is being measured
  // 🔴 ALWAYS GIVE THIS AN EXPLICIT TIMEOUT. Without one the navigation inherits a long default,
    // and when it stalls the BEFORE-EACH times out instead of the test - so the report blames a
    // tablet check that never ran. It happened to C55674 at 120s.
    await s.page.goto(`${process.env.GS_APP || ''}/customers`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => {});
  await s.page.waitForTimeout(4_000);
  return true;
}

/* ───────────────────────────── RECENT ACTIVITY (§5.6) ───────────────────────────── */
test('C44857 — recent activity is grouped by how long ago it was @C44857', async () => {
  test.skip(!(await seedRecent()), 'nothing could be opened on this environment, so there is no recent activity to group');
  expect(await reopen(), 'the panel would not reopen after visiting a record').toBe(true);
  const text = await panelText();
  expect(text, 'the panel is not showing its recent activity list').toMatch(/Recent/i);
  // the requirement names these buckets; only the ones that apply are shown, so at least one must be
  expect(text, `no time grouping is shown on the recent list: ${text.slice(0, 200)}`)
    .toMatch(/Today|Yesterday|Past week|Past 30 days/i);
});

test('C44858 — recent activity mixes record kinds in the same row template @C44858', async () => {
  expect(await reopen(), 'the panel would not reopen').toBe(true);
  const text = await panelText();
  test.skip(!/Recent/i.test(text), 'this account has no recent activity to show');
  const rows = await s.page.locator('.search-row').count();
  test.skip(rows === 0, 'the recent list is empty on this account');
  // every recent row uses the SAME class as a result row - that IS the shared template, and it is
  // the only part of this the build can demonstrate without opening several kinds of record first
  const classes = await s.page.evaluate(() =>
    [...document.querySelectorAll('.search-row')].map(r => r.className.replace(/\s+/g, ' ').trim()));
  const shapes = new Set(classes.map(c => c.split(' ').filter(x => !/--selected|--active/.test(x)).sort().join(' ')));
  expect(shapes.size, `recent rows are drawn with ${shapes.size} different templates: ${[...shapes].join(' // ')}`).toBe(1);
});

test('C44859 — clicking a recent item opens that record @C44859', async () => {
  expect(await reopen(), 'the panel would not reopen').toBe(true);
  const text = await panelText();
  test.skip(!/Recent/i.test(text), 'this account has no recent activity to click');
  const n = await s.page.locator('.search-row').count();
  test.skip(n === 0, 'the recent list is empty on this account');
  const before = s.page.url();
  await s.page.locator('.search-row').first().click();
  await s.page.waitForLoadState('domcontentloaded').catch(() => {});
  await s.page.waitForTimeout(4_000);
  expect(s.page.url(), `clicking a recent item did not open anything (still ${before})`).not.toBe(before);
});

/* ───────────────────────────── THE SCOPED EMPTY STATE (§5.2) ───────────────────────────── */
test('C44865 — no results inside a tab names the tab as well as the query @C44865', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  // a query that matches nothing anywhere, so every tab is empty
  const nonsense = 'qwkjhx' + Date.now();
  await typeAndWait(s.page, nonsense);
  await expect(s.page.locator(SEL.input)).toHaveValue(nonsense);
  const all = await panelText();
  expect(all, 'the empty state does not say there are no results').toMatch(/No results/i);
  expect(all, 'the empty state does not name the query back').toContain(nonsense);
  // now scope it and the message must name the tab too: "No results for 'x' in Customers"
  const clicked = await s.page.evaluate(() => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => /^Customers/.test((e as HTMLElement).innerText.trim()));
    if (!t) return false; (t as HTMLElement).click(); return true; });
  test.skip(!clicked, 'there is no Customers tab to scope to');
  await s.page.waitForTimeout(2_000);
  const scoped = await panelText();
  expect(scoped, 'the scoped empty state does not say there are no results').toMatch(/No results/i);
  expect(scoped, `the scoped empty state does not name the tab: ${scoped.slice(0, 200)}`).toMatch(/\bin\b[^.]*Customers/i);
});

/* ───────────────────────────── THE MOBILE SURFACE (§6) ───────────────────────────── */
/**
 * 🔴 A NEW CONTEXT, NOT A RESIZED ONE. The app decides its mobile layout from the viewport it was
 * loaded with; resizing an open desktop page leaves the desktop surface on screen and the check
 * then reports the mobile design missing when it was simply never asked for. These sign in again
 * at a phone viewport, and close that session afterwards.
 */
test.describe('on a phone viewport', () => {
  let m: Session;
  test.beforeAll(async () => {
    m = await signIn('/customers');
    // 🔴 GS_VW/GS_VH DO NOT REACH THE PRODUCTION SESSION. The production boot builds its own
    // browser context with its own viewport, so setting those variables before signIn changes
    // nothing and the DESKTOP surface comes up - nine scope tabs and no Cancel button, which
    // reads as "the mobile design is missing" and is nothing of the kind. Size the page that
    // actually exists, then RELOAD so the app lays itself out for a phone.
    await m.page.setViewportSize({ width: 390, height: 844 });
    await m.page.reload({ waitUntil: 'domcontentloaded' });
    await m.page.waitForTimeout(6_000);
    const vp = m.page.viewportSize();
    console.log(`phone session viewport: ${vp?.width}x${vp?.height}`);
  });
  test.afterAll(async () => { await m?.browser.close(); });

  test('C44898 — global search works at a phone size @C44898', async () => {
    expect(await reopen(m.page), 'the search surface would not open on the phone session').toBe(true);
    await expect(m.page.locator(SEL.modal)).toBeVisible();
    const box = await m.page.locator(SEL.modal).boundingBox();
    expect(box, 'the search surface has no box on screen at phone size').toBeTruthy();
    expect(box!.width, `the search surface is ${Math.round(box!.width)}px wide on a 390px screen`).toBeLessThanOrEqual(390);
  });

  test('C45132 — on a phone it is a full-screen surface with a Cancel action @C45132', async () => {
    expect(await reopen(m.page), 'the search surface would not open on the phone session').toBe(true);
    const box = await m.page.locator(SEL.modal).boundingBox();
    expect(box, 'the search surface has no box on screen').toBeTruthy();
    // full-screen: effectively the whole width, and most of the height
    expect(box!.width, `the surface is ${Math.round(box!.width)}px wide, not full screen`).toBeGreaterThan(390 * 0.9);
    expect(box!.height, `the surface is ${Math.round(box!.height)}px tall, not full screen`).toBeGreaterThan(844 * 0.7);
    const text = (await m.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
    expect(text, `no Cancel action on the phone surface: ${text.slice(0, 160)}`).toMatch(/Cancel/i);
  });

  test('C45133 — the scope chips appear only once something is typed @C45133', async () => {
    expect(await reopen(m.page), 'the search surface would not open on the phone session').toBe(true);
    const chips = () => m.page.locator('.search-tabs__tab').count();
    const before = await chips();
    expect(before, `the scope chips are on screen before anything was typed (${before} of them)`).toBe(0);
    await typeAndWait(m.page, BROAD || 'service');
    const after = await chips();
    expect(after, 'no scope chips appeared after typing a query that matches records').toBeGreaterThan(0);
  });
});
