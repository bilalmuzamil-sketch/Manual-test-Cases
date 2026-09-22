import { expect, type Page } from 'playwright/test';

/**
 * The search panel, as a page object — and, more usefully, as a record of the traps that produced
 * sixteen false readings during run 415 before they were caught. Every comment below marks a
 * mistake actually made, not a hypothetical one.
 */
export const SEL = {
  modal: '.search-modal',
  // 🔴 `.search-modal__input` is the Quasar <label> WRAPPER, not the field. Selecting it reports
  // placeholder "undefined" and focused=false, which reads exactly like a broken box and is not.
  input: '.search-modal input',
  tab: '.search-tabs__tab',
  tabActive: '.search-tabs__tab--active',
  tabCount: '.search-tabs__count',
  group: '.search-group',
  groupHeader: '.search-group__header',
  row: '.search-row',
  rowSelected: '.search-row--selected',
  body: '.search-modal__body',
} as const;

/** ⌘K / Ctrl+K TOGGLES. Pressing it when the panel is open CLOSES it, and the next fill() then
 *  waits 60s for a field that is not there — which reads as the feature being broken. */
export async function openPanel(page: Page) {
  const already = await page.locator(SEL.modal).count();
  if (!already) { await page.keyboard.press('Control+k'); await page.waitForTimeout(1_400); }
  await expect(page.locator(SEL.modal)).toBeVisible();
}

export async function closePanel(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

/** The panel REMEMBERS its query and its tab across close/reopen. Every probe that does not clear
 *  first is reading the previous search — that is how "33 recent items" turned out to be 33 results. */
export async function typeQuery(page: Page, q: string) {
  await closePanel(page);
  await openPanel(page);
  const input = page.locator(SEL.input);
  await input.click({ clickCount: 3 });
  await input.fill('');
  await input.type(q, { delay: 45 });
}

export type Panel = {
  counts: Record<string, number | null>;
  groups: { head: string; rows: string[] }[];
  scopedRows: string[] | null;
  body: string;
};

/**
 * Read the panel once it has SETTLED.
 *
 * 🔴 Counts settle late: a query can still read All (0) at 2s and be right at 4s. Requiring two
 * identical reads AND the counts to be present avoids recording a half-loaded panel as the answer.
 */
async function snapshot(page: Page) {
  return page.evaluate((s) => ({
    counts: Object.fromEntries([...document.querySelectorAll(s.tab)].map((e) => {
      const t = (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
      const m = t.match(/^(.*?)\s*\((\d+)\)$/);
      return m ? [m[1].trim(), Number(m[2])] : [t, null];
    })),
    groups: [...document.querySelectorAll(s.group)].map((g) => ({
      head: (g.querySelector(s.groupHeader) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? '',
      rows: [...g.querySelectorAll(s.row)].map((r) => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()),
    })),
    body: (document.querySelector(s.body) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim().slice(0, 300) ?? '',
  }), SEL);
}

async function clickTab(page: Page, label: string) {
  return page.evaluate(([sel, l]) => {
    const el = [...document.querySelectorAll(sel)]
      .find((e) => new RegExp('^\\s*' + l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        .test((e as HTMLElement).innerText.trim()));
    if (el) { (el as HTMLElement).click(); return true; }
    return false;
  }, [SEL.tab, label] as const);
}

/**
 * Search for `q` and read the named group.
 *
 * 🔴 THE ONE THAT MATTERED MOST. The combined "All" view lists only FIVE rows per group. Reading
 * the group there and reporting "the record is missing" produced EIGHT false failures in one pass.
 * "Read the <X> group" means the record type's own tab, where up to twenty are listed — so this
 * always opens that tab and reads there, keeping the All view as context.
 */
export async function search(page: Page, q: string, group?: string): Promise<Panel> {
  await typeQuery(page, q);
  await clickTab(page, 'All');                       // land on All deliberately; the tab is sticky
  let last = '', settled: Awaited<ReturnType<typeof snapshot>> | null = null;
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(1_500);
    settled = await snapshot(page);
    const key = JSON.stringify(settled);
    if (key === last && Object.values(settled.counts).some((v) => v !== null)) break;
    last = key;
  }
  let scopedRows: string[] | null = null;
  if (group && await clickTab(page, group)) {
    await page.waitForTimeout(2_200);
    scopedRows = (await snapshot(page)).groups.flatMap((g) => g.rows);
    await clickTab(page, 'All');
    await page.waitForTimeout(800);
  }
  await closePanel(page);
  return { ...settled!, scopedRows };
}

/** Rows for a group — the scoped tab's twenty if we opened it, else the All view's five. */
export function rowsOf(p: Panel, group: string): string[] {
  if (p.scopedRows?.length) return p.scopedRows;
  const g = p.groups.find((x) => new RegExp('^' + group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(x.head));
  return g ? g.rows : [];
}

/** 🔴 Match the WHOLE seeded name, never a fragment. "Brake Chamber" also matches two unrelated
 *  stock parts, so a loose expectation can pass on the wrong record — which it did. */
export const contains = (rows: string[], needle: string) =>
  rows.some((r) => r.toLowerCase().includes(needle.toLowerCase()));

export const positionOf = (rows: string[], needle: string) =>
  rows.findIndex((r) => r.toLowerCase().includes(needle.toLowerCase()));

/**
 * Wait until an edit is visible in search before judging anything about ordering.
 * The requirement allows the index up to 30s. Judging before the entry rebuilds measures the OLD
 * state — the single most common way a working feature gets reported as broken.
 */
export async function waitForIndex(page: Page, q: string, group: string, expectText: string, ms = 40_000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    const p = await search(page, q, group);
    if (contains(rowsOf(p, group), expectText)) return true;
    await page.waitForTimeout(6_000);
  }
  return false;
}
