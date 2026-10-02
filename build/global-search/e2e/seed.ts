/**
 * SEED THE ENVIRONMENT BEFORE THE FIRST RUN.
 *
 *     npm run seed              # against whatever GS_APP names
 *
 * 🔴 WHY THIS EXISTS, AND WHAT IT IS NOT.
 * The specs do not NEED seeded data to be correct: each one looks for a record with the property it
 * is about, and stands down with a reason when the environment holds none. So a fresh environment
 * gives honest results either way. What it does not give is COVERAGE — a great many checks skip,
 * and a suite that mostly skips tells the next person very little.
 *
 * This creates the handful of records those checks look for, so a first run on a fresh staging
 * exercises the product instead of reporting an empty cupboard. It is:
 *   • IDEMPOTENT — a name that already exists is left alone, not duplicated. Safe to re-run.
 *   • ADDITIVE — it creates; it never edits or deletes anything that was already there.
 *   • VISIBLE — everything is named `ZZSPEC…`, so what the suite put there is obvious and easy to
 *     find or remove afterwards.
 *
 * 🛑 IT WRITES REAL RECORDS. Point it at a test environment. It refuses to touch production unless
 * GS_SEED_ALLOW_PROD=1 is set, because "I ran the seeder against the wrong URL" should take more
 * than one mistake.
 */
import { boot, APIH, APP, IS_PROD, type Session } from './fixtures/boot.js';

type Made = { what: string; name: string; status: 'created' | 'already there' | 'failed'; detail?: string };
const made: Made[] = [];

/** The long name the "a long value is not cut off" checks need something to measure. */
const LONG = 'ZZSPEC Industrial Parts And Equipment Supply Company Of Greater Fernvale 123786';

const CUSTOMERS: Array<{ name: string; extra?: Record<string, unknown> }> = [
  // a long name, for the truncation and full-value checks
  { name: LONG, extra: { city: 'Fernvale', state_or_province: null, telephone: '(264) 400-0900',
                         address_1: '21 Result Row Way', postal_code: '44872' } },
  // two that share a first line, for "two records that look alike can be told apart"
  { name: 'ZZSPEC Identical Name Haulage', extra: { city: 'Fernvale', address_1: '88 Different Street' } },
  { name: 'ZZSPEC Identical Name Haulage 2', extra: { city: 'Fernvale', address_1: '4 Sameface Road' } },
  // a prefix/contains pair, so the ranking checks have something they can fairly judge
  { name: 'ZZSPECRANK Alpha Transport', extra: { city: 'Fernvale' } },
  { name: 'Northern ZZSPECRANK Freight', extra: { city: 'Fernvale' } },
  // one with a telephone, for the number-punctuation checks
  { name: 'ZZSPEC Telephone Haulage', extra: { telephone: '(614) 555-0188', city: 'Marnston' } },
  // one whose name carries a dash, for the "punctuation is optional" checks
  { name: 'ZZSPEC Dash-Carrier Logistics', extra: { city: 'Fernvale' } },
];

/**
 * 🔴 CALL THROUGH THE BROWSER'S REQUEST CONTEXT, NOT THE PAGE.
 * `page.evaluate` runs inside the page, so any navigation while it is in flight destroys it:
 * "Execution context was destroyed, most likely because of a navigation" — which looks like the
 * environment refusing the call and is nothing of the kind. `ctx.request` shares the same cookie
 * jar and session but is not tied to whatever the page happens to be doing.
 */
async function api(s: Session, method: 'GET' | 'POST', path: string, body?: unknown) {
  const url = `https://${APIH}${path}`;
  const r = method === 'GET'
    ? await s.ctx.request.get(url, { ignoreHTTPSErrors: true })
    : await s.ctx.request.post(url, { data: body ?? {}, ignoreHTTPSErrors: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
  const text = await r.text();
  let json: any = null; try { json = JSON.parse(text); } catch { /* non-JSON */ }
  return { status: r.status(), json, text };
}

async function existing(s: Session, name: string): Promise<boolean> {
  const r = await api(s, 'GET', `/api/customers?limit=100&search=${encodeURIComponent(name)}`);
  const rows = r.json?.data?.collection || r.json?.collection || [];
  return rows.some((c: any) => String(c?.name || '').toLowerCase() === name.toLowerCase());
}

async function createCustomer(s: Session, name: string, extra: Record<string, unknown> = {}) {
  if (await existing(s, name)) { made.push({ what: 'customer', name, status: 'already there' }); return; }
  // 🔴 THE ROUTE IS /api/customers/create. A plain POST to /api/customers answers 405 and names GET
  // as the only method allowed — which reads as "writing is forbidden here" and is not. This is the
  // call the app's own New Customer form makes.
  const out = await api(s, 'POST', '/api/customers/create', {
    name, state_or_province: null, country_code: '', require_po: false,
    shop_supplies_charge: null, min_shop_supplies_charge: null, max_shop_supplies_charge: null,
    pin_notes: false, notes: null, ...extra,
  });
  if (out.status === 200 || out.status === 201) made.push({ what: 'customer', name, status: 'created' });
  else if (/already exists/i.test(out.text)) made.push({ what: 'customer', name, status: 'already there' });
  else made.push({ what: 'customer', name, status: 'failed', detail: `HTTP ${out.status} ${out.text.slice(0, 160)}` });
}

/** Wait until what was just created can actually be found; the index is allowed up to 30 seconds. */
async function waitForIndex(s: Session, needle: string, ms = 40_000): Promise<number | null> {
  const started = Date.now();
  while (Date.now() - started < ms) {
    // 🔴 THE PARAMETER IS `q`, NOT `query`. `/api/search?query=…` answers 400 and the refusal says
    // so in words: "Parameter q is required and must be at least 2 characters". With the wrong name the
    // call returned nothing, and the checks that read workplace ids out of it skipped for a reason that
    // had nothing to do with the product.
    const r = await api(s, 'GET', `/api/search?q=${encodeURIComponent(needle)}`);
    if (r.text.toLowerCase().includes(needle.toLowerCase())) return Date.now() - started;
    await s.page.waitForTimeout(3_000);
  }
  return null;
}

async function main() {
  if (IS_PROD && process.env.GS_SEED_ALLOW_PROD !== '1') {
    console.error(
      `\nRefusing to seed ${APP}.\n`
      + 'That is production. If you genuinely mean to, re-run with GS_SEED_ALLOW_PROD=1.\n'
      + 'Otherwise set GS_APP to a test environment, for example:\n'
      + '  export GS_APP=https://app.staging.shopview.com\n');
    process.exit(2);
  }
  console.log(`seeding ${APP}\n`);
  const s = await boot('/customers');
  try {
    for (const c of CUSTOMERS) await createCustomer(s, c.name, c.extra);

    const created = made.filter(m => m.status === 'created');
    if (created.length) {
      process.stdout.write('waiting for the new records to become searchable… ');
      const took = await waitForIndex(s, 'ZZSPEC');
      console.log(took === null ? 'still not searchable after 40s' : `found after ${Math.round(took / 1000)}s`);
    }

    console.log('\n  what        status         name');
    console.log('  ----------- -------------- ------------------------------------------------');
    for (const m of made) {
      console.log(`  ${m.what.padEnd(11)} ${m.status.padEnd(14)} ${m.name.slice(0, 60)}`
        + (m.detail ? `\n              ${m.detail}` : ''));
    }
    const failed = made.filter(m => m.status === 'failed');
    console.log(`\n${made.filter(m => m.status === 'created').length} created, `
      + `${made.filter(m => m.status === 'already there').length} already there, ${failed.length} failed.`);
    if (failed.length) {
      console.log(
        '\nA failure here is usually a permission: the account needs to be able to create customers. '
        + 'The suite still runs without seeding — the affected checks stand down and say what was '
        + 'missing, rather than reporting a fault.');
    }
    console.log('\nNothing was edited or deleted. Everything created is named ZZSPEC…\n');
  } finally {
    await s.browser.close();
  }
}

main().catch((e) => { console.error('\nseeding failed:', e?.message ?? e, '\n'); process.exit(1); });
