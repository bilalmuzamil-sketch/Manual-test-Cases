/**
 * PREFLIGHT — runs ONCE, before the first test, and stops the run if the environment cannot
 * support it.
 *
 * 🔴 WHY THIS EXISTS. `npm test` used to go straight into the suite. Nothing checked that seeding
 * had been done, and nothing could: `npm run seed` creates CUSTOMERS and nothing else, while the
 * checks also look for named assets, parts, vendors, part sales, purchase orders and vendor
 * invoices. On 2 October 2026 a full production run spent 1.6 hours to report 116 checks standing
 * down, most of them for records that were simply not there. Whoever ran it learned that at the
 * end. This tells them in about twenty seconds, before anything else happens, and names exactly
 * what is missing.
 *
 * It is a READ-ONLY check. It creates nothing, so it is safe on any environment — including one
 * where you have not decided yet whether you want to write.
 *
 *   GS_PREFLIGHT=warn   report, but let the run continue anyway
 *   GS_PREFLIGHT=off    skip it entirely
 */
import { signIn, api, APP, type Session } from './fixtures/auth.js';
import * as fs from 'node:fs';

// `seeder` is an explicit flag, NOT a string to match on. It was first written as a sentence and
// tested with `.includes('npm run seed')` -- which is true of "NOT seeded by `npm run seed`" too,
// so every record the seeder cannot make was listed under "create these with the seeder". A
// preflight that misdirects is worse than none: it sends someone to run a command that cannot help.
type Need = { term: string; group: string; label: string; seeder: boolean };

/** The search API answers every kind in one call, so one request settles one term. */
const GROUP_LABEL: Record<string, string> = {
  work_orders: 'work order', customers: 'customer', assets: 'asset', parts: 'part',
  vendors: 'vendor', part_sales: 'part sale', purchase_orders: 'purchase order',
  vendor_invoices: 'vendor invoice',
};

const SECTION_GROUP: Record<string, string> = {
  'Assets': 'assets', 'Parts': 'parts', 'Vendors': 'vendors',
  'Part Sales': 'part_sales', 'Purchase Orders': 'purchase_orders',
  'Vendor Invoices': 'vendor_invoices',
};

/**
 * The entity checks' fixtures are read from the SAME config the specs read, so this cannot drift
 * out of step with them. If that file moves or its terms change, the preflight changes with it.
 */
function needsFromEntityConfig(): Need[] {
  const dir = process.env.GS_ENTITY_CONFIG || '../staging-run-2026-09-29';
  const out: Need[] = [];
  let cfg: any;
  try { cfg = JSON.parse(fs.readFileSync(`${dir}/entity-config.json`, 'utf8')); }
  catch { return out; }                       // absence is reported separately, below
  for (const [section, v] of Object.entries<any>(cfg)) {
    const group = SECTION_GROUP[section];
    if (!group) continue;
    const terms = new Set<string>();
    for (const c of Object.values<any>(v?.cases ?? {})) if (c?.term) terms.add(String(c.term));
    for (const t of terms) out.push({ term: t, group, label: section, seeder: false });
  }
  return out;
}

const CUSTOMER_NEEDS: Need[] = [
  { term: 'ZZSPEC', group: 'customers', label: 'Customers', seeder: true },
];

/**
 * One request settles one term. It is allowed to fail: a preflight that dies on a single blip is
 * no more use than no preflight, and "could not read" is a different answer from "not there" --
 * reporting the second when the first is true would send someone off seeding records that already
 * exist. Two attempts, then an honest question mark.
 */
async function groupTotals(s: Session, term: string): Promise<Record<string, number> | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const r: any = await api(s.page, 'GET', `/api/search?q=${encodeURIComponent(term)}`);
      const groups = r?.body?.data?.groups;
      if (Array.isArray(groups)) {
        const out: Record<string, number> = {};
        for (const g of groups) out[g.type] = Number(g.total ?? 0);
        return out;
      }
      if (attempt === 2) console.log(`  (no groups in the answer for "${term}": HTTP ${r?.status})`);
    } catch (e: any) {
      if (attempt === 2) console.log(`  (could not read "${term}": ${String(e?.message ?? e).slice(0, 90)})`);
      else await s.page.waitForTimeout(1500);
    }
  }
  return null;
}

export default async function preflight() {
  const mode = (process.env.GS_PREFLIGHT || 'enforce').toLowerCase();
  if (mode === 'off') { console.log('preflight: skipped (GS_PREFLIGHT=off)'); return; }

  console.log(`\n── Preflight ─────────────────────────────────────────────────────────────────`);
  console.log(`environment: ${APP}`);

  let s: Session;
  try {
    s = await signIn('/customers');
  } catch (e: any) {
    throw new Error(
      `PREFLIGHT FAILED: could not sign in to ${APP}.\n\n${String(e).slice(0, 400)}\n\n` +
      `  • production wants GS_USER and GS_PASS\n` +
      `  • staging signs in through Google: run \`npm run login\` once, then run the tests\n`);
  }

  const needs = [...CUSTOMER_NEEDS, ...needsFromEntityConfig()];
  const seen = new Map<string, Record<string, number> | null>();
  const rows: Array<{ need: Need; found: number | null }> = [];

  for (const need of needs) {
    if (!seen.has(need.term)) seen.set(need.term, await groupTotals(s, need.term));
    const totals = seen.get(need.term);
    rows.push({ need, found: totals ? (totals[need.group] ?? 0) : null });
  }

  const pad = (x: string, n: number) => (x.length > n ? x.slice(0, n - 1) + '…' : x.padEnd(n));
  console.log(`\n${pad('what the checks look for', 42)} ${pad('kind', 15)} found`);
  for (const { need, found } of rows) {
    const mark = found === null ? '?' : found > 0 ? '✓' : '✗';
    const n = found === null ? 'could not read' : String(found);
    console.log(`${mark} ${pad(`"${need.term}"`, 40)} ${pad(GROUP_LABEL[need.group] ?? need.group, 15)} ${n}`);
  }

  // The permission comparisons need two logins that actually DIFFER. Two that match are not an
  // error, but they silently cost eleven checks, so say so rather than let it be discovered later.
  if (process.env.GS_LIMITED_ENVF) {
    try {
      const full: any = await api(s.page, 'GET', '/api/auth/me/fe-permissions');
      const n = (full?.body?.data ?? full?.body ?? []).length;
      console.log(`\nfull-access login: ${n} permissions. A second login is configured — if it holds`);
      console.log(`the same ${n}, the permission comparisons cannot show a difference and will stand down.`);
    } catch { /* reported by the permission specs themselves */ }
  } else {
    console.log(`\nNo second login configured (GS_LIMITED_ENVF). The permission comparisons will stand down.`);
  }

  await s.browser.close();

  const unreadable = rows.filter((r) => r.found === null);
  if (unreadable.length) {
    console.log(`\n${unreadable.length} could not be read — they are NOT reported as missing below, ` +
      `because "could not read" and "not there" are different answers.`);
  }
  const missing = rows.filter((r) => r.found === 0);
  if (!missing.length) {
    console.log(`\npreflight: every record the checks look for is present.\n`);
    return;
  }

  const bySeeder = missing.filter((m) => m.need.seeder);
  const byHand = missing.filter((m) => !m.need.seeder);
  const lines = [
    ``,
    `${missing.length} of ${rows.length} records the checks look for are NOT on ${APP}.`,
    ``,
    ...(bySeeder.length ? [
      `Create these with the seeder:`,
      `    npm run seed`,
      ...bySeeder.map((m) => `      • "${m.need.term}" (${GROUP_LABEL[m.need.group]})`),
      ``] : []),
    ...(byHand.length ? [
      `These the seeder does NOT create, and cannot yet — they have to exist on the`,
      `environment before the checks that use them can judge anything:`,
      ...byHand.map((m) => `      • "${m.need.term}" (${GROUP_LABEL[m.need.group]}, for the ${m.need.label} checks)`),
      ``] : []),
    `Nothing is wrong with the product and nothing here is a test failure. The checks that`,
    `need these records will stand down and say so; the rest will run normally.`,
    ``,
    `    GS_PREFLIGHT=warn npm test    run anyway, with those checks standing down`,
    `    GS_PREFLIGHT=off  npm test    skip this check entirely`,
    ``,
  ];
  const text = lines.join('\n');
  if (mode === 'warn') { console.log(text); return; }
  throw new Error(`PREFLIGHT: the environment is not fully seeded.\n${text}`);
}

// Runnable on its own — `npm run preflight` — so you can ask "is this environment ready?" without
// starting a 1.6-hour suite to find out.
if (process.argv[1] && process.argv[1].endsWith('preflight.ts')) {
  preflight().then(
    () => process.exit(0),
    (e) => { console.error(`\n${e?.message ?? e}\n`); process.exit(1); },
  );
}
