import type { Page } from 'playwright/test';
import { APIH } from './boot.js';

/**
 * SEEDING REAL RECORDS, SO A RANKING CHECK HAS A FAIR PAIR TO JUDGE.
 *
 * 🔴 THE ROUTE WAS DISCOVERED, NOT GUESSED. `POST /api/customers` answers **405 Method Not
 * Allowed (Allow: GET)** - the refusal names the method, which is the clue. Driving the app's own
 * "New Customer" form and watching what it sends gives the real one:
 *     POST /api/customers/create  ->  201  {"data":{"company_id":"…"}}
 * Guessing a REST-shaped endpoint would have produced a confident "seeding is not possible here".
 *
 * 🔴 WHY SEEDING AT ALL. Ranking cannot be judged on whatever the environment happens to hold:
 * "a name starting with the query ranks above one that merely contains it" needs two records
 * identical in every other respect. On this environment almost every record shares one test
 * prefix, so no such pair occurs naturally and the checks could only ever skip. Creating the pair
 * is the difference between a check that runs and a check that is permanently theoretical.
 *
 * Everything seeded is named `ZZSPEC…` so it is obvious whose it is and easy to find. The QA lead
 * has confirmed this environment holds no real customers' records and that cleanup is not wanted;
 * the helper still returns the ids so a caller may remove them if it prefers.
 */
export type Seeded = { id: string; name: string };

export async function createCustomer(page: Page, name: string, extra: Record<string, unknown> = {}): Promise<Seeded | null> {
  // 🔴 THE API HOST COMES FROM THE ENVIRONMENT UNDER TEST. This was the literal production host, so
  // on staging every create went to production, was refused there, and six ranking checks failed on
  // "Failed to fetch" - a fault in this helper reported as six product failures (2026-10-02).
  const out = await page.evaluate(async ([n, ex, host]) => {
    const r = await fetch(`https://${host}/api/customers/create`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, state_or_province: null, country_code: '', require_po: false,
        shop_supplies_charge: null, min_shop_supplies_charge: null, max_shop_supplies_charge: null,
        pin_notes: false, notes: null, ...(ex as object) }),
    });
    const t = await r.text();
    let id = '';
    try { const j = JSON.parse(t); id = j?.data?.company_id || j?.data?.id || j?.id || ''; } catch { /* non-JSON */ }
    return { status: r.status, id, body: t.slice(0, 200) };
  }, [name, extra, APIH] as const);
  if (out.status !== 201 && out.status !== 200) {
    console.log(`seed customer "${name}" failed: HTTP ${out.status} ${out.body}`);
    return null;
  }
  return { id: out.id, name };
}

/**
 * Wait until a seeded record is findable. The requirement allows the index up to 30 seconds, so a
 * check that searches immediately measures the indexer's lag and calls it a findability defect.
 * Returns the time it took, or null if it never appeared.
 */
export async function waitUntilFindable(page: Page, q: string, needle: string, ms = 35_000): Promise<number | null> {
  const started = Date.now();
  const { typeAndWait } = await import('./search.js');
  while (Date.now() - started < ms) {
    await typeAndWait(page, q);
    const hit = await page.evaluate(n => [...document.querySelectorAll('.search-row')]
      .some(r => (r.textContent || '').toLowerCase().includes(String(n).toLowerCase())), needle);
    if (hit) return Date.now() - started;
    await page.waitForTimeout(3_000);
  }
  return null;
}

export async function deleteCustomer(page: Page, id: string): Promise<number> {
  return page.evaluate(async ([i, host]) => {
    for (const [m, p] of [['DELETE', `/api/customers/${i}`], ['POST', `/api/customers/${i}/delete`]] as const) {
      const r = await fetch(`https://${host}` + p, { method: m, credentials: 'include' });
      if (r.status < 400) return r.status;
    }
    return 0;
  }, [id, APIH] as const);
}
