import type { Page } from 'playwright/test';
import { api } from './auth.js';
import { typeAndWait } from './search.js';

/**
 * ANCHORS HARVESTED LIVE, AND PROVED FINDABLE BEFORE ANY TEST RELIES ON THEM.
 *
 * 🔴 WHY THIS EXISTS, MEASURED ON PRODUCTION 1 OCTOBER 2026.
 * The identifier checks were anchored to values frozen into a JSON file earlier the same day:
 * part number `bj030275`, part sale `P1-71`, purchase order `S-818`. Within the hour all three
 * stopped returning anything at all, while the vehicle VIN in the same file still worked. The
 * specs went red and the product was fine - this is a shared environment and its records move.
 *
 * A frozen anchor file cannot survive that, and nor can a seeded record: seeding fixes today's
 * run and leaves the same trap for the next person. So the suite now ASKS the environment, at run
 * time, for a record that exists, and then CONFIRMS the search can actually find it before any
 * assertion is built on it. A candidate the index has not picked up yet is skipped, not asserted
 * on - otherwise the suite reports an indexing lag as a matching defect.
 *
 * The happy consequence is portability: the same spec runs against staging, a QA branch or
 * production with no configuration, because it reads whatever that environment actually holds.
 */
const coll = (o: any) => o?.data?.collection || o?.collection || o?.data?.partSales || [];
/**
 * Candidate identifiers from a collection.
 * 🔴 THE FIELD IS NOT CALLED THE SAME THING ON EVERY ENDPOINT. Purchase orders carry
 * `order_number` and vendor invoices `invoice_number`; neither has a plain `number`, so a single
 * guessed field name harvested nothing from 134 perfectly good records and the checks skipped.
 * Try the known names in order and take the first that is actually populated.
 */
const firstOf = (rows: any[], fields: string[], n = 10): string[] => {
  for (const f of fields) {
    const vals = rows.map(r => String(r?.[f] ?? '').trim()).filter(v => v.length >= 4);
    // 🔴 PREFER A VALUE THAT CARRIES PUNCTUATION. The normalization checks exist to prove a dash
    // is optional, so anchoring them on a plain numeric identifier makes them skip for want of a
    // dash to strip - two checks skipped that way on 1 Oct 2026. Punctuated candidates first.
    // 🔴 ONE RANKING CANNOT SERVE BOTH NEEDS. Preferring punctuation picked the VIN "LJM." and then
    // "341.20" over real ones; preferring length leaves the normalization checks with no dash to
    // strip. So rank by length here, and harvest a SEPARATE punctuated anchor below for the checks
    // that specifically need one.
    const usable = vals.filter(v => v.replace(/[^A-Za-z0-9]/g, '').length >= 4);
    if (usable.length) return [...usable].sort((a, b) => b.length - a.length).slice(0, n);
  }
  return [];
};

/** does the search actually return a row carrying this identifier? */
async function findable(page: Page, id: string): Promise<boolean> {
  await typeAndWait(page, id);
  const norm = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  const rows: string[] = await page.evaluate(() =>
    [...document.querySelectorAll('.search-row')].map(r => r.textContent || ''));
  return rows.some(t => norm(t).includes(norm(id)));
}

export type AnchorKey = 'assetVin' | 'partNumber' | 'partSaleNo' | 'poNumber' | 'invoiceNo';
export type LiveAnchors = Partial<Record<AnchorKey, string>> & {
  /** the same kinds, but only values that CARRY punctuation - for the "a dash is optional" checks */
  punct?: Partial<Record<AnchorKey, string>>;
};

export async function harvestAnchors(page: Page): Promise<LiveAnchors> {
  
  const sources: [keyof LiveAnchors, string, string[]][] = [
    ['assetVin',   '/api/vehicles?limit=40',             ['vin']],
    ['partNumber', '/api/inventory/parts?limit=40',      ['part_number', 'partNumber']],
    ['partSaleNo', '/api/part-sales?limit=40',           ['number', 'sale_number']],
    ['poNumber',   '/api/inventory/orders?limit=40',     ['order_number', 'raw_number', 'number']],
    ['invoiceNo',  '/api/inventory/deliveries?limit=40', ['invoice_number', 'order_number', 'number']],
  ];
  const out: LiveAnchors = { punct: {} };
  for (const [key, path, fields] of sources) {
    let rows: any[] = [];
    try {
      const resp: any = await api(page, 'GET', path);
      rows = coll(resp?.body);
      if (!rows.length) console.log(`  ${key}: HTTP ${resp?.status} - no records on this environment`);
    } catch (e) { console.log(`  ${key}: threw ${e}`); rows = []; }
    const cands = firstOf(rows, fields);
    for (const cand of cands) {
      if (await findable(page, cand)) { out[key] = cand; break; }
    }
    // A punctuated one, for the normalization checks only.
    // 🔴 IT HAS TO LOOK LIKE AN IDENTIFIER. Taking the longest punctuated value picked
    // "56+56+56+56+56+" as an invoice number; stripping its punctuation gives "5656565656", which
    // of course finds nothing, and the check reported that normalization had lost the record. A
    // value worth testing normalization on has a real alphanumeric core and a separator or two -
    // "S-818", "P1-71" - not a run of repeats.
    const identifierish = (v: string) => {
      const marks = (v.match(/[^A-Za-z0-9]/g) || []).length;
      const core = v.replace(/[^A-Za-z0-9]/g, '');
      return marks >= 1 && marks <= 3 && core.length >= 4 && !/(.{1,3})\1{2,}/.test(v);
    };
    for (const cand of cands.filter(identifierish).slice(0, 4)) {
      if (cand === out[key]) { out.punct![key] = cand; break; }
      if (await findable(page, cand)) { out.punct![key] = cand; break; }
    }
    console.log(`anchor ${key}: ${out[key] ?? 'NONE FOUND — checks using it will skip, not fail'}`
      + `${out.punct![key] ? ` (punctuated: ${out.punct![key]})` : ''} (from ${rows.length} record(s))`);
  }
  return out;
}

/**
 * A query broad enough to light up SEVERAL record kinds on whichever environment is under test.
 *
 * 🔴 TWO MISTAKES THIS REPLACES, BOTH MADE ON 1 OCTOBER 2026.
 *  1. Using "a" as the broad query. A one-letter query renders the scope strip with NO COUNTS at
 *     all ("All | Work orders | ..."), so every count-based check skipped or failed while the
 *     product was fine. Five checks in the structure suite skipped for exactly this reason.
 *  2. Counting the "All" tab as one of the kinds. All ALWAYS carries a count whenever any result
 *     exists, so "more than one tab has a count" was true for a query matching a single customer -
 *     the assertion passed without testing anything. Entity tabs only, All excluded.
 *
 * Candidates are tried against the live index and the first that actually spans two or more entity
 * tabs wins. If none does, the caller SKIPS with that reason rather than asserting on thin data.
 */
export async function broadTerm(page: Page, extra: string[] = []): Promise<{ term: string; tabs: string[] } | null> {
  const candidates = [...extra, 'transport', 'service', 'repair', 'truck', 'auto', 'oil', 'ford'];
  // 🔴 TAKE THE WIDEST, NOT THE FIRST. Returning the first term that spans two kinds left the
  // purchase-order checks skipping because that term happened to match none. Trying them all costs
  // one pass in beforeAll and buys several checks that would otherwise never run.
  let best: { term: string; tabs: string[]; n: number } | null = null;
  for (const term of candidates) {
    if (term.length < 2) continue;
    await typeAndWait(page, term);
    const tabs: string[] = await page.evaluate(() =>
      [...document.querySelectorAll('.search-tabs__tab')].map(t => (t as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
    const entityHits = tabs.filter(t => !/^All\b/.test(t) && /\((\d+)\)/.test(t) && !/\(0\)/.test(t));
    if (!best || entityHits.length > best.n) best = { term, tabs, n: entityHits.length };
    if (entityHits.length >= 7) break;                       // every entity tab lit - cannot do better
  }
  if (best && best.n >= 2) {
    console.log(`broad term "${best.term}" spans ${best.n} kinds: ${best.tabs.filter(t => !/^All\b/.test(t) && !/\(0\)/.test(t)).join(' | ')}`);
    return { term: best.term, tabs: best.tabs };
  }
  console.log('no broad term spans two record kinds on this environment');
  return null;
}

/**
 * Candidate SEARCH TERMS for one kind of record, taken from that kind's own records.
 *
 * 🔴 WHY SEEDING FROM THE SCREEN IS NOT ENOUGH. The ranking and highlighting checks hunt for a
 * query that gives them something to judge, and they used to take their candidate words from the
 * rows already on screen. But when the broad term matches NOTHING in that tab, the tab is empty -
 * so there are no words to take, the hunt tries nothing at all, and the check skips reporting
 * "none found on this environment" when the environment is full of suitable records. Measured on
 * production 1 Oct 2026: Parts and Vendors both skipped this way while holding 100 records each.
 *
 * So ask the API for that kind's records and take the words from THEM. Nothing is written.
 */
const ENTITY_SOURCES: Record<string, [string, string[]]> = {
  'Parts':           ['/api/inventory/parts?limit=60',      ['name', 'description', 'part_number']],
  'Vendors':         ['/api/vendors?limit=60',              ['name', 'company_name']],
  'Assets':          ['/api/vehicles?limit=60',             ['vehicle_make', 'vehicle_model', 'unit']],
  'Customers':       ['/api/customers?limit=60',            ['name']],
  'Part sales':      ['/api/part-sales?limit=40',           ['number', 'customer_name']],
  'Purchase orders': ['/api/inventory/orders?limit=40',     ['order_number', 'vendor_name']],
  'Vendor invoices': ['/api/inventory/deliveries?limit=40', ['invoice_number', 'vendor_name']],
  'Work orders':     ['/api/work-orders?limit=40',          ['number', 'customer_name']],
};

export async function entityTerms(page: Page, tab: string, max = 10): Promise<string[]> {
  const src = ENTITY_SOURCES[tab];
  if (!src) return [];
  const [path, fields] = src;
  let rows: any[] = [];
  try {
    const resp: any = await api(page, 'GET', path);
    rows = coll(resp?.body);
  } catch { return []; }
  const words = new Set<string>();
  for (const r of rows) {
    for (const f of fields) {
      for (const w of String(r?.[f] ?? '').split(/[^A-Za-z0-9]+/)) {
        // long enough to be a real query, short enough to match more than one record
        if (w.length >= 4 && w.length <= 14) words.add(w);
      }
    }
  }
  // the most common words first: a word several records share is the one likeliest to give a pair
  const counted = new Map<string, number>();
  for (const r of rows) for (const f of fields) for (const w of String(r?.[f] ?? '').split(/[^A-Za-z0-9]+/))
    if (words.has(w)) counted.set(w, (counted.get(w) ?? 0) + 1);
  return [...counted.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w).slice(0, max);
}

/**
 * The fixture term if this environment still has it, otherwise one that works here.
 *
 * 🔴 WHY THE OLDER SPECS NEEDED THIS. They were written against staging's seeded records and name
 * them directly — `ZZLONGROW`, `ZZSOFTHIT`, `ZZBROAD`. On production those fixtures exist only in
 * part: measured 2 October 2026, `ZZLONGROW` returns customers, assets and vendors but **no work
 * orders**, and `ZZBROAD` returns nothing at all. The specs then failed with "the fixture data is
 * gone" — an honest message, but it made a whole file red on an environment where the behaviour
 * they test is perfectly observable on other records.
 *
 * None of those checks is actually ABOUT the fixture: they ask whether a row shows the whole
 * matched value, whether a highlight sits inside the text, whether two similar rows can be told
 * apart. Any record that matches will do. So prefer the fixture — it keeps the checks reading the
 * way they were written, and on staging nothing changes at all — and fall back to a term harvested
 * from the environment under test, saying in the log which one was used so a result can never be
 * read against the wrong data.
 */
export async function resolveTerm(
  page: Page, preferred: string, tab?: string,
  opts: { requireMark?: boolean; requireSoft?: boolean } = {},
): Promise<string | null> {
  /**
   * 🔴 SCOPE TO THE TAB BEFORE JUDGING ANYTHING ABOUT IT. Counting marks on the All view and the
   * tab's total separately accepted "service": the All view is full of highlighted customers, and
   * the Work orders tab reported fourteen matches — but inside that tab not one row was marked,
   * because the query matched a field the row does not display. The check then reported "row 0 has
   * no highlight at all" about a product highlighting correctly everywhere it should. Click the
   * tab, then look at what is actually in it.
   */
  const usable = async (q: string): Promise<number> => {
    await typeAndWait(page, q);
    if (tab) {
      const clicked = await page.evaluate((l) => {
        const t = [...document.querySelectorAll('.search-tabs__tab')]
          .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === String(l).toLowerCase());
        if (!t) return false; (t as HTMLElement).click(); return true;
      }, tab);
      if (!clicked) return 0;
      await page.waitForTimeout(2_200);
    }
    return page.evaluate(([needMark, needSoft]) => {
      const rows = [...document.querySelectorAll('.search-row')];
      // 🔴 A SOFT-MATCH CHECK NEEDS A SOFT MATCH TO LOOK AT. A term every row contains literally
      // gives nothing to judge, and the check then "fails" while saying in its own message that it
      // is a statement about the data rather than the product. Find a term that actually produces
      // a close match, or let the caller skip.
      if (needSoft && !rows.some(r => /≈|close match/i.test(r.textContent || ''))) return 0;
      if (!needMark) return rows.length;
      // 🔴 THE SAME ELEMENT THE CHECKS READ, OR THIS PROVES NOTHING. They look for
      // `mark.search-highlight` inside `.search-row__title`; a plain `mark` anywhere in the row —
      // in the meta line, say — let "service" through while the titles carried no highlight at
      // all, and the check then failed on row 0. Match their reading exactly, and require it on
      // EVERY row, because that is what they assert.
      const lit = (r: Element) => {
        const title = r.querySelector('.search-row__title');
        return !!(title ?? r).querySelector('mark.search-highlight');
      };
      return rows.length && rows.every(lit) ? rows.length : 0;
    }, [!!opts.requireMark, !!opts.requireSoft] as const);
  };

  if (preferred && await usable(preferred) > 0) {
    console.log(`term for ${tab ?? 'any kind'}: "${preferred}" (the seeded fixture, still present)`);
    return preferred;
  }
  const candidates = tab ? await entityTerms(page, tab, 10) : [];
  const generic = opts.requireSoft
    // deliberately damaged words: a close match is what is wanted, so give the matcher something
    // to be approximate about
    ? ['servcie', 'trasnport', 'repiar', 'trcuk', 'ZZSOFTHIT', 'Fibrdige']
    : ['service', 'transport', 'repair', 'truck', 'auto', 'ZZAUTOTEST', 'ZZLONGROW'];
  for (const q of [...candidates, ...generic]) {
    if (q && await usable(q) > 0) {
      console.log(`term for ${tab ?? 'any kind'}: "${q}" — the fixture "${preferred}" `
        + `${opts.requireMark ? 'gives no highlighted row' : 'is not on this environment'}`);
      return q;
    }
  }
  console.log(`term for ${tab ?? 'any kind'}: NONE — nothing tried returns `
    + `${opts.requireMark ? 'a highlighted row' : 'a row'}`);
  return null;
}
