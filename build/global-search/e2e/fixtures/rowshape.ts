import type { Page } from 'playwright/test';
import { SEL, typeQuery, closePanel } from './search.js';

/**
 * ROW SHAPE — what a result row actually DRAWS, not what its text flattens to.
 *
 * The Search Results Integrity cases (C146197–C146306) ask questions `innerText` cannot answer:
 * is the whole value shown, is the match highlighted INSIDE the text, is anything cut off, do two
 * rows differ anywhere a person can see. So this reads the row's structure and its GEOMETRY.
 *
 * ── THE TRAP THAT MADE THIS FILE NECESSARY ─────────────────────────────────────────────────────
 * 🔴 A CSS ELLIPSIS IS INVISIBLE TO `innerText`. `text-overflow: ellipsis` paints the "…" and
 * clips the overflow at RENDER time; the text node is untouched. So a row that a tester sees as
 * "S2-34379 ZZLONGROW Heavy Haul…" reads back through innerText as the complete string, and a
 * script that looks for a literal "..." — which is exactly what case SRI-WO-A2 tells a HUMAN to
 * do — finds nothing and reports the row as whole. That is a false PASS on the one case whose
 * entire subject is truncation. Clipping is therefore measured as `scrollWidth > clientWidth`,
 * and the question "was the MATCH cut off" is answered by comparing the <mark>'s bounding box
 * against the container's visible box. Never by looking at characters.
 *
 * 🔴 SECOND TRAP: the All tab lists only FIVE rows per group. Every reader here opens the record
 * type's own tab first — reading All and reporting a record missing produced eight false failures
 * on this project in one pass.
 *
 * 🔴 THIRD TRAP: the mouse pointer owns the panel's selected row (SV-10061, OBSOLETE as a report
 * but still true of the build). `aria-selected` therefore says where the POINTER is, not what the
 * keyboard would open, so nothing here asserts on it. The pointer is parked at 0,0 before reading.
 */

export type Seg = { text: string; marked: boolean; italic: boolean; visible: boolean };

export type Line = {
  text: string;
  segs: Seg[];
  /** True when the element paints less than it holds — a real CSS clip, ellipsis or not. */
  clipped: boolean;
  scrollW: number;
  clientW: number;
  /** null when the line carries no highlight at all. */
  markVisible: boolean | null;
  /** Segment texts whose box falls outside the visible box — what the reader cannot see. */
  hiddenSegs: string[];
};

export type RowShape = {
  index: number;
  text: string;
  title: Line;
  meta: Line;
  metaParts: string[];
  badge: string | null;
  marks: string[];
  /** A "≈" anywhere on the row — the soft-match marker named in PRD v1.5 §7. */
  approx: boolean;
  /** Highlighted text drawn in italics — the OTHER treatment §7 allows. */
  italicMarks: string[];
  html: string;
};

/** Click a tab by its leading label. Returns false when no such tab exists. */
async function clickTab(page: Page, label: string) {
  return page.evaluate(([sel, l]) => {
    const el = [...document.querySelectorAll(sel)].find((e) =>
      new RegExp('^\\s*' + l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test((e as HTMLElement).innerText.trim()));
    if (el) { (el as HTMLElement).click(); return true; }
    return false;
  }, [SEL.tab, label] as const);
}

export async function tabCounts(page: Page): Promise<Record<string, number | null>> {
  return page.evaluate((s) => Object.fromEntries([...document.querySelectorAll(s.tab)].map((e) => {
    const t = (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
    const m = t.match(/^(.*?)\s*\((\d+)\)$/);
    return m ? [m[1].trim(), Number(m[2])] : [t, null];
  })), SEL);
}

/**
 * Search `term`, open `tab`, and read every row's shape and geometry.
 * The panel is left OPEN so a caller can take a screenshot of exactly what was measured.
 */
/**
 * Park the pointer AND prove it is parked.
 *
 * 🔴 `mouse.move(0,0)` is a claim, not a proof: a modal that covers the origin, or a move the page
 * swallows, leaves the pointer over a row and the row hovered. L0117 is three wrong findings from
 * exactly that. So the parked position is read back with elementFromPoint and the answer is
 * returned, to be recorded with the verdict rather than asserted in a comment.
 */
export async function parkPointer(page: Page): Promise<{ parked: boolean; over: string }> {
  await page.mouse.move(0, 0);
  return page.evaluate(() => {
    const el = document.elementFromPoint(0, 0) as HTMLElement | null;
    const desc = el ? `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)}` : 'none';
    return { parked: !el || !el.closest('.search-row'), over: desc };
  });
}

/** What the last read found under the pointer — recorded with every verdict this file supports. */
export let lastPointerCheck: { parked: boolean; over: string } = { parked: false, over: 'not yet read' };

export async function groupRows(page: Page, term: string, tab: string): Promise<RowShape[]> {
  lastPointerCheck = await parkPointer(page);   // park the pointer AND verify it (third trap)
  await typeQuery(page, term);
  await page.waitForTimeout(4_500);
  const opened = await clickTab(page, tab);
  if (!opened) return [];
  await page.waitForTimeout(2_500);
  lastPointerCheck = await parkPointer(page);   // re-verified AFTER the tab switch re-laid the panel

  return page.evaluate((s) => {
    const VIS_SLACK = 1.5;                     // sub-pixel rounding, not a real overflow

    const lineOf = (el: HTMLElement | null) => {
      if (!el) return { text: '', segs: [], clipped: false, scrollW: 0, clientW: 0, markVisible: null, hiddenSegs: [] };
      const box = el.getBoundingClientRect();
      const clientW = el.clientWidth, scrollW = el.scrollWidth;
      // Leaf spans only: a parent span would be counted twice and its rect would span the whole line.
      const leaves = [...el.querySelectorAll('span')].filter((sp) => !sp.querySelector('span'));
      const segs = leaves.map((sp) => {
        const r = sp.getBoundingClientRect();
        const cs = getComputedStyle(sp);
        const mk = sp.closest('mark');
        return {
          text: (sp.textContent || ''),
          marked: !!mk,
          italic: cs.fontStyle === 'italic' || (mk ? getComputedStyle(mk).fontStyle === 'italic' : false),
          // A segment is visible when its box lies inside the container's painted box.
          visible: r.width === 0 ? true : (r.left >= box.left - VIS_SLACK && r.right <= box.right + VIS_SLACK),
        };
      }).filter((x) => x.text !== '');
      const marked = segs.filter((x) => x.marked);
      return {
        text: (el.innerText || '').replace(/\s+/g, ' ').trim(),
        segs,
        clipped: scrollW > clientW + VIS_SLACK,
        scrollW, clientW,
        markVisible: marked.length ? marked.every((x) => x.visible) : null,
        hiddenSegs: segs.filter((x) => !x.visible).map((x) => x.text),
      };
    };

    return [...document.querySelectorAll(s.row)].map((r, index) => {
      const row = r as HTMLElement;
      const title = row.querySelector('.search-row__title') as HTMLElement | null;
      const meta = row.querySelector('.search-row__meta') as HTMLElement | null;
      const badgeEl = row.querySelector('[data-test-id="search_row_status_badge"]') as HTMLElement | null;
      const t = lineOf(title), m = lineOf(meta);
      return {
        index,
        text: row.innerText.replace(/\s+/g, ' ').trim(),
        title: t,
        meta: m,
        metaParts: [...row.querySelectorAll('.search-row__meta-part')].map((e) => (e as HTMLElement).innerText.trim()),
        badge: badgeEl ? (badgeEl.getAttribute('aria-label') || badgeEl.innerText).trim() : null,
        marks: [...row.querySelectorAll('mark.search-highlight')].map((e) => (e as HTMLElement).innerText.trim()),
        approx: /≈/.test(row.innerText) || /≈/.test(row.innerHTML),
        italicMarks: [...t.segs, ...m.segs].filter((x) => x.marked && x.italic).map((x) => x.text),
        html: row.outerHTML.slice(0, 4_000),
      };
    });
  }, SEL);
}

export async function shut(page: Page) { await closePanel(page); }
