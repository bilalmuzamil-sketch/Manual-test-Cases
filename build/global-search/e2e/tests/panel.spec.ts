import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { search, rowsOf, contains, openPanel, closePanel, typeQuery, SEL } from '../fixtures/search.js';

/**
 * THE PANEL ITSELF — opening, typing, keyboard, states, icons, counts.
 * Measured 22 September 2026: 14 of 15 passed. Several of these encode a mistake I made first.
 */
let s: Session;
test.beforeAll(async () => { s = await signIn('/work-orders'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

test('C45156 — the keyboard shortcut opens it with the field ready to type', async () => {
  await closePanel(s.page);
  await expect(s.page.locator(SEL.modal)).toHaveCount(0);
  await s.page.keyboard.press('Control+k');            // lowercase k — Control+K sends Ctrl+Shift+K
  await s.page.waitForTimeout(1_500);
  await expect(s.page.locator(SEL.modal)).toBeVisible();
  await expect(s.page.locator(SEL.input)).toBeFocused();
});

/**
 * 🔴 THE TRAP: the tab strip is on screen BEFORE anything is typed. Counting tab ELEMENTS says
 * "a search ran" when none has. What proves a search ran is the tabs carrying COUNTS.
 */
test('C45161 — one character runs no search, two characters do', async () => {
  await closePanel(s.page);
  await openPanel(s.page);
  const input = s.page.locator(SEL.input);
  await input.click({ clickCount: 3 }); await input.fill('');
  await input.type('B', { delay: 60 });
  await s.page.waitForTimeout(4_500);
  expect(await s.page.locator(SEL.tabCount).count(),
    'one character already ran a search — the tabs are carrying counts').toBe(0);
  expect(await s.page.locator(SEL.body).innerText()).toMatch(/recent/i);

  await input.type('r', { delay: 60 });
  await s.page.waitForTimeout(5_500);
  expect(await s.page.locator(SEL.tabCount).count(),
    'two characters ran no search — no counts appeared').toBeGreaterThan(0);
  await closePanel(s.page);
});

test('C45155 — the group is called Assets, never Vehicles', async () => {
  const p = await search(s.page, 'Cascadia', 'Assets');
  expect(p.groups.some((g) => /^Assets/i.test(g.head))).toBe(true);
  expect(p.groups.some((g) => /vehicle/i.test(g.head)), 'a Vehicles heading is showing').toBe(false);
  expect(Object.keys(p.counts).some((t) => /vehicle/i.test(t)), 'a Vehicles tab is showing').toBe(false);
});

test('C55675 — a search that matches nothing says so', async () => {
  const p = await search(s.page, 'ZZNOSUCHRECORD9999');
  expect(p.body, `the panel read: ${p.body}`).toMatch(/no results/i);
});

test('C55673 — Enter opens the top result with no arrow key first', async () => {
  await typeQuery(s.page, 'Bridgeport');
  await s.page.waitForTimeout(6_000);
  const before = s.page.url();
  await s.page.keyboard.press('Enter');
  await s.page.waitForTimeout(4_000);
  expect(s.page.url(), 'Enter alone did nothing — the page never changed').not.toBe(before);
  await s.page.goto('/work-orders', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(2_500);
});

test('C55680 — arrowing moves through rows and never lands on a heading', async () => {
  await typeQuery(s.page, 'ZZAUTOTEST');
  await s.page.waitForTimeout(6_000);
  const seen: string[] = [];
  for (let i = 0; i < 12; i++) {
    await s.page.keyboard.press('ArrowDown');
    await s.page.waitForTimeout(260);
    seen.push(await s.page.evaluate((sel) =>
      (document.querySelector(sel) as HTMLElement)?.innerText.replace(/\s+/g, ' ').slice(0, 50) ?? 'none', SEL.rowSelected));
  }
  expect(new Set(seen.filter((t) => t !== 'none')).size, 'the highlight never moved').toBeGreaterThan(1);
  const HEADING = /^(Work orders|Customers|Assets|Parts|Vendors|Part sales|Purchase orders|Vendor invoices)\s*\(\d+\)$/i;
  expect(seen.some((t) => HEADING.test(t.trim())), 'the highlight landed on a group heading').toBe(false);
  await closePanel(s.page);
});

/**
 * 🔴 THE TRAP: every row icon carries the SAME class, `lucide-icon`. Reading the class says
 * "one icon for everything". The shape is in the drawing — read the path, and there are eight.
 */
test('C55682 — every row carries an icon, one per record type', async () => {
  await typeQuery(s.page, 'ZZAUTOTEST');
  await s.page.waitForTimeout(6_500);
  const icons = await s.page.evaluate((sel) => {
    const out: { head: string; hasIcon: boolean; shape: string | null }[] = [];
    for (const g of document.querySelectorAll(sel.group)) {
      const head = (g.querySelector(sel.groupHeader) as HTMLElement)?.innerText.replace(/\s*\(\d+\)$/, '').trim() ?? '';
      for (const r of g.querySelectorAll(sel.row)) {
        const svg = r.querySelector('svg');
        out.push({ head, hasIcon: !!svg,
          shape: svg ? [...svg.querySelectorAll('path,circle,rect,line,polyline')]
            .map((n) => n.getAttribute('d') ?? n.tagName).join('|').slice(0, 90) : null });
      }
    }
    return out;
  }, SEL);
  expect(icons.length).toBeGreaterThan(0);
  expect(icons.filter((i) => !i.hasIcon), 'some rows carry no icon').toHaveLength(0);
  const perType = new Map<string, Set<string>>();
  for (const i of icons) if (i.shape) (perType.get(i.head) ?? perType.set(i.head, new Set()).get(i.head)!).add(i.shape);
  for (const [head, shapes] of perType) expect(shapes.size, `${head} rows use more than one icon`).toBe(1);
  expect(new Set([...perType.values()].map((v) => [...v][0])).size,
    'different record types share one icon').toBeGreaterThan(1);
  await closePanel(s.page);
});

test('C45157 — a record matching more than once is listed once', async () => {
  const p = await search(s.page, 'Bridgeport', 'Customers');
  const rows = rowsOf(p, 'Customers').filter((r) => /ZZAUTOTEST Bridgeport Hauling/i.test(r));
  // 🔴 Two DIFFERENT customers start with the same words. Compare the leading names, not a count.
  const names = new Set(rows.map((r) => r.split(/\s{2,}|\n|·/)[0].trim()));
  expect(names.size, `the same customer appears twice: ${JSON.stringify(rows)}`).toBe(rows.length);
});

test('C53589 — typing through a search in flight loses nothing', async () => {
  await closePanel(s.page); await openPanel(s.page);
  const input = s.page.locator(SEL.input);
  await input.click({ clickCount: 3 }); await input.fill('');
  await input.type('Bridge', { delay: 25 });
  await s.page.waitForTimeout(400);                      // let the first search start
  await input.type('port Hauling', { delay: 25 });       // keep typing over it
  await s.page.waitForTimeout(6_000);
  expect(await input.inputValue(), 'characters were swallowed while a search was running').toBe('Bridgeport Hauling');
  expect(await s.page.locator(SEL.body).innerText()).toMatch(/Bridgeport/i);
  await closePanel(s.page);
});

test('C44861 — the query is kept after closing and restored on reopening', async () => {
  await typeQuery(s.page, 'Fibridge');
  await s.page.waitForTimeout(6_000);
  await closePanel(s.page);
  await s.page.waitForTimeout(2_000);
  const header = await s.page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  expect(header, 'the header did not keep the last search').toMatch(/Fibridge/);
  await openPanel(s.page);
  await s.page.waitForTimeout(2_500);
  const input = s.page.locator(SEL.input);
  expect(await input.inputValue()).toBe('Fibridge');
  expect(await s.page.locator(SEL.row).count(), 'the results were not restored').toBeGreaterThan(0);
  const selected = await input.evaluate((e: HTMLInputElement) => e.selectionEnd! - e.selectionStart! > 0);
  expect(selected, 'the kept text is not pre-selected, so typing would append rather than replace').toBe(true);
  await closePanel(s.page);
});

/** Known failure — reproduces a reported fault, expected red until it is fixed. */
test('C55685 — a correct spelling returns only related records [expected to fail: SV-10025]', async () => {
  const p = await search(s.page, 'Marlene', 'Customers');
  const rows = rowsOf(p, 'Customers');
  const unrelated = rows.filter((r) => !/marlene/i.test(r));
  expect(unrelated,
    `known fault SV-10025 — ${unrelated.length} of ${rows.length} returned customers do not contain the word typed`).toHaveLength(0);
});
