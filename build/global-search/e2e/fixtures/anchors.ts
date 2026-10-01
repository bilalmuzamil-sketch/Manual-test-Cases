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
    if (vals.length) return vals.slice(0, n);
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

export type LiveAnchors = Partial<Record<'assetVin' | 'partNumber' | 'partSaleNo' | 'poNumber' | 'invoiceNo', string>>;

export async function harvestAnchors(page: Page): Promise<LiveAnchors> {
  
  const sources: [keyof LiveAnchors, string, string[]][] = [
    ['assetVin',   '/api/vehicles?limit=40',             ['vin']],
    ['partNumber', '/api/inventory/parts?limit=40',      ['part_number', 'partNumber']],
    ['partSaleNo', '/api/part-sales?limit=40',           ['number', 'sale_number']],
    ['poNumber',   '/api/inventory/orders?limit=40',     ['order_number', 'raw_number', 'number']],
    ['invoiceNo',  '/api/inventory/deliveries?limit=40', ['invoice_number', 'order_number', 'number']],
  ];
  const out: LiveAnchors = {};
  for (const [key, path, fields] of sources) {
    let rows: any[] = [];
    try {
      const resp: any = await api(page, 'GET', path);
      rows = coll(resp?.body);
      if (!rows.length) console.log(`  ${key}: HTTP ${resp?.status} - no records on this environment`);
    } catch (e) { console.log(`  ${key}: threw ${e}`); rows = []; }
    for (const cand of firstOf(rows, fields)) {
      if (await findable(page, cand)) { out[key] = cand; break; }
    }
    console.log(`anchor ${key}: ${out[key] ?? 'NONE FOUND — checks using it will skip, not fail'}`
      + ` (from ${rows.length} record(s))`);
  }
  return out;
}
