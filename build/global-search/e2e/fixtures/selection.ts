/**
 * WHICH TESTS THIS RUN WILL ACTUALLY RUN — so the run start seeds exactly their data (QA lead,
 * 2026-10-05: a one-test run seeds only that test's data; a full run seeds everything).
 *
 * Global setup is not told the selection, so it asks Playwright the same question the person asked:
 * the run's own filters (spec files, --grep, --grep-invert, --project, --last-failed, --only-changed,
 * -c/--config) are passed to `playwright test --list --reporter=json`, which collects without running
 * anything (and without running global setup - measured 2026-10-05). If the listing fails for any
 * reason, the answer is "everything": seeding too much is safe, seeding too little is not.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { casesOf, dataMap, PLAN_FILE } from './data-check.js';

const KEEP_WITH_VALUE = new Set(['-g', '--grep', '--grep-invert', '--project', '-c', '--config']);
const KEEP_FLAG = new Set(['--last-failed', '--only-changed', '--pass-with-no-tests']);

export type Selection = { all: boolean; tests: number; total: number; cases: string[] };

function list(args: string[]): { titles: string[] } | null {
  let cli = '';
  try { cli = path.join(path.dirname(createRequire(import.meta.url).resolve('playwright/package.json')), 'cli.js'); }
  catch { return null; }                                   // cannot list: the caller seeds everything
  const r = spawnSync(process.execPath, [cli, 'test', '--list', '--reporter=json', ...args], {
    cwd: process.cwd(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GS_SEED: 'skip', PW_TEST_REPORTER: '' },
  });
  try {
    const d = JSON.parse(r.stdout);
    const titles: string[] = [];
    const walk = (s: any) => { for (const sp of s.specs ?? []) titles.push(sp.title); for (const c of s.suites ?? []) walk(c); };
    for (const s of d.suites ?? []) walk(s);
    return { titles };
  } catch { return null; }
}

export function selection(): Selection {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('test');
  const rest = i >= 0 ? argv.slice(i + 1) : argv;
  const config: string[] = [];     // -c / --config: needed to list anything at all
  const filters: string[] = [];    // what narrows the run
  const VALUED = /^(--workers|-j|--reporter|--retries|--repeat-each|--timeout|--max-failures|--output|--shard|--trace)$/;
  for (let k = 0; k < rest.length; k++) {
    const a = rest[k];
    const name = a.split('=')[0];
    const take = () => (a.includes('=') ? [a] : [a, rest[++k]].filter((x) => x !== undefined) as string[]);
    if (name === '-c' || name === '--config') config.push(...take());
    else if (KEEP_WITH_VALUE.has(name)) filters.push(...take());
    else if (KEEP_FLAG.has(a)) filters.push(a);
    else if (!a.startsWith('-')) filters.push(a);                      // a spec file or path filter
    else if (VALUED.test(a) && !a.includes('=')) k++;                  // skip the value of an unrelated option
  }
  const everything = list(config);
  const total = everything?.titles.length ?? 0;
  if (!filters.length) return { all: true, tests: total, total, cases: [] };
  const chosen = list([...config, ...filters]);
  if (!chosen || !chosen.titles.length) return { all: true, tests: total, total, cases: [] };
  const cases = [...new Set(chosen.titles.flatMap(casesOf))];
  return { all: total > 0 && chosen.titles.length >= total, tests: chosen.titles.length, total, cases };
}

/** The steps that are not single records, and the script that makes each. */
export const STEP_SCRIPT: Record<string, { manifest: string; script: string }> = {
  'gs-v2:#statuses': { manifest: 'seed-manifest-gs-v2.json', script: 'set_wo_statuses.py' },
  'gs-v2:#po-invoices': { manifest: 'seed-manifest-gs-v2.json', script: 'seed_po_and_invoices.py' },
  'gs-v2:#complete-invoice': { manifest: 'seed-manifest-gs-v2.json', script: 'complete_and_invoice.py' },
  'gs-v2:#roles': { manifest: 'seed-manifest-gs-v2.json', script: 'seed_roles.py' },
  'gs-v2:#recent': { manifest: 'seed-manifest-gs-v2.json', script: 'touch_recent_entities.py' },
  'ranking:#signals': { manifest: 'seed-manifest-ranking.json', script: 'apply_ranking_signals.py' },
  'e2e:#po': { manifest: 'seed-manifest-e2e.json', script: 'seed_po_from_manifest.py' },
};

export type PlannedStep = { label: string; manifest: string; script: string; args?: string[] };

/**
 * What to seed for these cases: per plan, just the records they name (--only, dependencies included),
 * then any step they need. A step works over its whole plan (statuses need every Fibridge work order),
 * so a plan whose step is needed is seeded in full.
 */
export function planFor(cases: string[]): PlannedStep[] {
  const records = new Map<string, Set<string>>();
  const steps = new Set<string>();
  for (const c of cases) {
    for (const n of dataMap()[c]?.needs ?? []) {
      const [plan, key] = n.split(':');
      if (key?.startsWith('#')) { steps.add(n); continue; }
      if (!records.has(plan)) records.set(plan, new Set());
      records.get(plan)!.add(key);
    }
  }
  const fullPlans = new Set([...steps].map((s) => s.split(':')[0]));
  const out: PlannedStep[] = [];
  for (const [plan, file] of Object.entries(PLAN_FILE)) {
    if (fullPlans.has(plan)) out.push({ label: `${plan}: every record (a step below needs them all)`, manifest: file, script: 'seed.py' });
    else if (records.has(plan)) {
      const keys = [...records.get(plan)!];
      out.push({ label: `${plan}: ${keys.length} record(s) these tests need`, manifest: file, script: 'seed.py', args: ['--only', keys.join(',')] });
    }
  }
  for (const s of steps) {
    const st = STEP_SCRIPT[s];
    if (st) out.push({ label: `step ${s}`, manifest: st.manifest, script: st.script });
  }
  return out;
}

