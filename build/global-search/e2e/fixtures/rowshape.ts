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

export type Seg = {
  text: string;
  marked: boolean;
  italic: boolean;
  /** True only when the WHOLE segment lies inside the painted box. */
  visible: boolean;
  /**
   * The part of the segment a person can actually READ — measured character by character.
   *
   * 🔴 WHY THIS IS NOT JUST `visible`. A clipped line is usually ONE long text span with a few
   * characters past the edge. Treating the span as all-or-nothing throws the whole span away, so
   * two rows that differ only inside it collapse to the same visible string and the reader reports
   * "these rows are indistinguishable" — which is a fact about the reader. That is exactly what
   * happened on C146212 (29 Sep): two customers whose names differ at "…Fernvale 123786" against
   * "…Fernvale 185786", with 19px of 553px clipped. Three characters are hidden; the digits that
   * separate them are plainly on screen. The finer measurement is the difference between a false
   * defect and the truth.
   */
  visibleText: string;
};

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
      // How much of one text node is painted inside `box`: the longest prefix whose last character
      // still ends left of the container's right edge, found by binary search over a Range.
      const readableLength = (node: Text): number => {
        const full = node.data;
        if (!full.length) return 0;
        const rng = document.createRange();
        const endsInside = (n: number) => {
          rng.setStart(node, 0); rng.setEnd(node, n);
          const rects = rng.getClientRects();
          const last = rects[rects.length - 1];
          return !last || last.right <= box.right + VIS_SLACK;
        };
        if (endsInside(full.length)) return full.length;
        let lo = 0, hi = full.length;
        while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (endsInside(mid)) lo = mid; else hi = mid - 1; }
        return lo;
      };

      // 🔴 EVERY TEXT NODE, NOT EVERY <span>. Reading leaf spans only drops any text the markup
      // does not wrap — the " · " separator between an asset's unit number and its vehicle sits
      // directly in the line, in no span at all. The segments then failed to reconstruct the line
      // and C146226 went red claiming "the pieces do not add up", which is a fact about the
      // reader: nothing was missing from the ROW, only from my list of it. Walking text nodes
      // makes the reconstruction faithful for every row variant. Measured 29 Sep 2026.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);

      const segs = nodes.map((tn) => {
        const parent = tn.parentElement!;
        const rng = document.createRange();
        rng.selectNodeContents(tn);
        const r = rng.getBoundingClientRect();
        const cs = getComputedStyle(parent);
        const mk = parent.closest('mark');
        const text = tn.data;
        const whole = r.width === 0 ? true : (r.left >= box.left - VIS_SLACK && r.right <= box.right + VIS_SLACK);
        return {
          text,
          marked: !!mk,
          italic: cs.fontStyle === 'italic' || (mk ? getComputedStyle(mk).fontStyle === 'italic' : false),
          // A segment is visible when its box lies inside the container's painted box.
          visible: whole,
          // …and this is how much of it a person can read, which is not the same question.
          visibleText: whole ? text : text.slice(0, readableLength(tn)),
        };
      }).filter((x) => x.text !== '');
      const marked = segs.filter((x) => x.marked);
      return {
        text: (el.innerText || '').replace(/\s+/g, ' ').trim(),
        segs,
        clipped: scrollW > clientW + VIS_SLACK,
        scrollW, clientW,
        markVisible: marked.length ? marked.every((x) => x.visible) : null,
        // The characters actually hidden, not the whole segment they live in.
        hiddenSegs: segs.filter((x) => !x.visible).map((x) => x.text.slice(x.visibleText.length)).filter(Boolean),
      };
    };

    return [...document.querySelectorAll(s.row)].map((r, index) => {
      const row = r as HTMLElement;
      const title = row.querySelector('.search-row__title') as HTMLElement | null;
      const meta = row.querySelector('.search-row__meta') as HTMLElement | null;
      // 🔴 EVERY BADGE CLASS THE ROW VARIANTS USE, NOT THE FIRST ONE THAT WORKED.
      // Work-order rows carry [data-test-id="search_row_status_badge"] ("Estimate"); CUSTOMER rows
      // use `.search-row__badge` for the open-WO count ("30 open") and have no test id at all.
      // Reading only the work-order selector reported badge=null on every customer row, and the
      // "control" — finding a badge on a WORK ORDER row — passed while the selector was still
      // wrong for the row being judged. It nearly became "the customer row has no count badge",
      // which is false. A control belongs on the SAME row type as the claim. Measured 29 Sep 2026.
      const badgeEl = row.querySelector(
        '[data-test-id="search_row_status_badge"], .search-row__badge, .q-badge') as HTMLElement | null;
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

/**
 * Hover a row and report what APPEARS that was not there before.
 *
 * PRD v1.5 §4 puts the customer telephone "on hover", and the quick-action buttons live in the same
 * hover cluster. A read that never hovers therefore reports both as missing, which is a statement
 * about the reader.
 *
 * 🔴 AND HOVERING IS NOT FREE: the pointer that hovers a row also SELECTS it (SV-10061). So this
 * returns the pointer to the origin afterwards and re-verifies, and no caller may read selection
 * state from a panel this has touched.
 */
export async function hoverRow(page: Page, index: number):
  Promise<{ before: string; after: string; gained: string[]; reached: boolean }> {
  const read = () => page.evaluate(([s, i]) => {
    const r = document.querySelectorAll(s.row)[i as number] as HTMLElement | undefined;
    return r ? r.innerText.replace(/\s+/g, ' ').trim() : '';
  }, [SEL, index] as const);

  const before = await read();
  const box = await page.locator(SEL.row).nth(index).boundingBox();
  if (!box) return { before, after: before, gained: [], reached: false };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(900);
  // 🔴 READ `reached` WHILE THE POINTER IS STILL THERE. The first version of this checked
  // `.search-row:hover` in the CALLER, after parkPointer had already moved the mouse back to the
  // origin - so it always answered false and declared every hover measurement unproven. A control
  // that cannot pass is not a control. Measured and fixed 29 Sep 2026.
  const reached = await page.evaluate((s) => !!document.querySelector(`${s.row}:hover`), SEL);
  const after = await read();
  await parkPointer(page);
  // Word-level difference: what hovering ADDED, in the row's own words.
  const b = new Set(before.split(/\s+/));
  const gained = after.split(/\s+/).filter((w) => w && !b.has(w));
  return { before, after, gained, reached };
}

/**
 * THE WHOLE PANEL, not one group — tabs, group order, per-group counts, "Show all" links and the
 * empty-state message. The All-tab sheet asks about the shape of the panel rather than the content
 * of a row, so it needs a different reader.
 *
 * 🔴 Counts settle late. A query can read All (0) at two seconds and be right at four, so this
 * requires two identical reads before it returns — a half-loaded panel recorded as the answer is
 * how a working feature gets reported as broken.
 */
export type PanelShape = {
  tabs: { label: string; count: number | null }[];
  groups: { head: string; count: number | null; rows: number; showAll: string | null }[];
  /** Rows sitting ABOVE the first group heading — the "best match" slot. */
  topRows: string[];
  body: string;
  empty: string | null;
};

export async function panelShape(page: Page, term: string): Promise<PanelShape> {
  await parkPointer(page);
  await typeQuery(page, term);
  // 🔴 LAND ON "All" DELIBERATELY — THE TAB IS STICKY ACROSS SEARCHES.
  // Whatever tab the last search left open is still selected when the next query is typed, so a
  // reader that does not reset reads a SCOPED tab and reports "no groups on the All tab". That is
  // what made C146287 and C146291 go red: both were measuring the Parts tab a previous test had
  // opened. fixtures/search.ts has always done this; this reader was written without it.
  await clickTab(page, 'All');
  await page.waitForTimeout(1_200);
  let last = '', shape: PanelShape | null = null;
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(1_500);
    shape = await page.evaluate((s) => {
      const num = (t: string) => { const m = t.match(/\((\d+)\)\s*$/); return m ? Number(m[1]) : null; };
      const tabs = [...document.querySelectorAll(s.tab)].map((e) => {
        const t = (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
        return { label: t.replace(/\s*\(\d+\)\s*$/, '').trim(), count: num(t) };
      });
      const groups = [...document.querySelectorAll(s.group)].map((g) => {
        const head = (g.querySelector(s.groupHeader) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? '';
        const link = [...g.querySelectorAll('a,button')]
          .map((e) => (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim())
          .find((t) => /show all/i.test(t)) ?? null;
        return { head: head.replace(/\s*\(\d+\)\s*$/, '').replace(/show all.*/i, '').trim(),
                 count: num(head), rows: g.querySelectorAll(s.row).length, showAll: link };
      });
      // Rows before the first group element in document order.
      const firstGroup = document.querySelector(s.group);
      const topRows = [...document.querySelectorAll(s.row)]
        .filter((r) => !firstGroup || (firstGroup.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_PRECEDING))
        .map((r) => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim());
      const body = (document.querySelector(s.body) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? '';
      const empty = /no results/i.test(body) ? body.slice(0, 200) : null;
      return { tabs, groups, topRows, body: body.slice(0, 400), empty };
    }, SEL);
    const key = JSON.stringify(shape);
    if (key === last) break;
    last = key;
  }
  return shape!;
}

/** Click a tab and report the rows it then shows. */
export async function openTab(page: Page, label: string) {
  const ok = await clickTab(page, label);
  await page.waitForTimeout(2_200);
  return { opened: ok, rows: await page.evaluate((s) =>
    [...document.querySelectorAll(s.row)].map((r) => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()), SEL) };
}
