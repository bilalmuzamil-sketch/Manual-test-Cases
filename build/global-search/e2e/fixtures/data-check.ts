/**
 * THE PER-TEST DATA CHECK (QA lead, 2026-10-05): immediately before each test, make sure the records
 * THAT test needs are on the branch; seed any that are missing; if one still cannot be made, the test
 * stands down naming it - before it starts, never half-way through.
 *
 * What each test needs comes from data/test-data.json (tools/build_data_map.py builds it; every case
 * is mapped, and the build fails if one is not). The check runs the same seeding engine the run
 * start uses, with `--only` (just those records and what they depend on):
 *   1. --check   are they there, with the declared fields?
 *   2. --confirm only for the ones that are not - creates exactly those
 *   3. --check   again; anything still missing ⇒ the test stands down, naming the record.
 *
 * 🔴 IT USES THE SESSION THE TEST ALREADY HOLDS (fixtures/seedwork.ts says why), and only while that
 * session is the FULL-ACCESS person. The permission checks switch the session to a lesser person for
 * a while; checking then would read every hidden record as "missing" and try to create it as someone
 * who may not. So the session is asked who it is first, and a lesser one skips the live check - those
 * tests rely on the check made at the start of the run, and the annotation says so.
 *
 * Steps that are not single records (work-order statuses, purchase orders and invoices, ranking
 * signals) are made at the start of the run and are not re-run per test.
 *
 * Knobs:  GS_DATA_CHECK=off           skip the per-test check (the run-start seeding still happens)
 *         GS_DATA_RECHECK_SECS=120    a record confirmed this recently by an earlier test is trusted
 */
import fs from 'node:fs';
import path from 'node:path';
import type { TestInfo } from 'playwright/test';
import { DATA_DIR } from './data.js';
import { currentSession, envLabel, makeWorkDir, runEngine, saveWorkDir, writeProfile } from './seedwork.js';
import { workplaceHint } from './boot.js';

export const PLAN_FILE: Record<string, string> = {
  v1reg: 'seed-manifest.json', 'gs-v2': 'seed-manifest-gs-v2.json', ranking: 'seed-manifest-ranking.json',
  toggle: 'seed-manifest-toggle.json', pertab: 'seed-manifest-pertab.json', e2e: 'seed-manifest-e2e.json',
  fixtures: 'seed-manifest-fixtures.json',
};

type Entry = { needs?: string[]; own?: string; none?: string; baseline?: string };
let MAP: Record<string, Entry> | null = null;
export function dataMap(): Record<string, Entry> {
  if (!MAP) {
    try { MAP = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'test-data.json'), 'utf8')).cases ?? {}; }
    catch { MAP = {}; }
  }
  return MAP!;
}

/** The case ids a test carries in its title (@C12345 tags, else a bare C12345), or its title key. */
export function casesOf(title: string): string[] {
  const tags = [...title.matchAll(/@C(\d{5,6})/g)].map((m) => m[1]);
  const bare = tags.length ? tags : [...title.matchAll(/\bC(\d{5,6})\b/g)].map((m) => m[1]);
  return bare.length ? bare : [`title:${title.replace(/\s*@C\d+/g, '').trim()}`];
}

/** Every record (not step) the given cases need, grouped by plan. */
export function recordsFor(cases: string[]): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const c of cases) {
    for (const n of dataMap()[c]?.needs ?? []) {
      const [plan, key] = n.split(':');
      if (!key || key.startsWith('#')) continue;
      if (!out.has(plan)) out.set(plan, new Set());
      out.get(plan)!.add(key);
    }
  }
  return out;
}

let WORK = '';
const confirmedAt = new Map<string, number>();        // "<plan>:<key>" -> when last proved present
const FAIL = new Set(['MISSING', 'CREATE_FAILED', 'CREATED_NOT_FOUND', 'SHORT', 'BLOCKED', 'DUPLICATE', 'UNVERIFIED']);

function engine(plan: string, args: string[], profile: string): { status: number | null; report: any[]; out: string } {
  const report = path.join(WORK, `report-${Date.now()}.json`);
  const r = runEngine(WORK, 'seed.py', [...args, '--report', report], {
    SEED_PROFILE: profile, SEED_MANIFEST: PLAN_FILE[plan], SEED_WORKPLACE: workplaceHint(),
  });
  let rep: any[] = [];
  try { rep = JSON.parse(fs.readFileSync(report, 'utf8')); } catch { /* engine stopped early - see out */ }
  return { status: r.status, report: rep, out: r.out };
}

export async function ensureTestData(info: TestInfo): Promise<void> {
  if ((process.env.GS_DATA_CHECK || '').toLowerCase() === 'off') return;
  const cases = casesOf(info.title);
  const unmapped = cases.filter((c) => !dataMap()[c]);
  if (unmapped.length) {
    info.annotations.push({ type: 'data', description: `no data entry for ${unmapped.join(', ')} - run tools/build_data_map.py` });
  }
  const groups = recordsFor(cases);
  if (!groups.size) return;                              // needs none of ours (UI-only, own data, baseline)

  const sess = currentSession();
  if (!sess) {
    info.annotations.push({ type: 'data', description: 'no full-access session recorded yet; relying on the run-start seeding' });
    return;
  }
  if (!WORK) WORK = makeWorkDir();
  // The recorded session goes to the engine as recorded (host and api apart, every cookie as is).
  const { host, api, ...cookies } = sess as Record<string, string>;
  delete (cookies as Record<string, string>).at;
  const profile = writeProfile(WORK, host, api, cookies as { PHPSESSID: string });

  // Who is the session right now? A lesser person must not check or create anything.
  const who = runEngine(WORK, 'seed.py', ['--whoami'], { SEED_PROFILE: profile, SEED_MANIFEST: PLAN_FILE.e2e });
  let perms = 0, status = 0;
  try { ({ permissions: perms = 0, status = 0 } = JSON.parse(who.out.trim().split('\n').pop() || '{}')); } catch { /* below */ }
  if (status === 401) {
    // the recorded session has ended (a permission check switching people ends it) - not a lesser person
    info.annotations.push({ type: 'data', description: 'the recorded full-access session has ended since the last sign-in; relying on the run-start check' });
    return;
  }
  if (perms < Number(process.env.GS_FULL_PERMS_MIN || 40)) {
    info.annotations.push({ type: 'data', description: `the session is acting as a lesser person (${perms} permissions) right now; relying on the run-start check` });
    return;
  }

  const window = Number(process.env.GS_DATA_RECHECK_SECS ?? 120) * 1000;
  const missingNow: string[] = [];
  for (const [plan, keys] of groups) {
    if (!PLAN_FILE[plan]) continue;
    const due = [...keys].filter((k) => Date.now() - (confirmedAt.get(`${plan}:${k}`) ?? 0) > window);
    if (!due.length) continue;
    const check = engine(plan, ['--check', '--only', due.join(',')], profile);
    const bad = check.report.filter((r) => FAIL.has(r.state) && due.includes(r.key)).map((r) => r.key);
    const ok = check.report.filter((r) => r.state === 'PRESENT').map((r) => r.key);
    ok.forEach((k) => confirmedAt.set(`${plan}:${k}`, Date.now()));
    if (!check.report.length) {
      info.annotations.push({ type: 'data', description: `could not check ${plan} records (${check.out.split('\n').filter(Boolean).pop()?.slice(0, 120)}); relying on the run-start seeding` });
      continue;
    }
    if (!bad.length) continue;
    // Seed just the missing ones, then look again.
    console.log(`   data for "${info.title.slice(0, 60)}": ${bad.length} record(s) missing in ${plan} — seeding ${bad.join(', ')}`);
    engine(plan, ['--confirm', '--only', bad.join(','), '--wait-findable', process.env.GS_INDEX_WAIT_SECS || '45'], profile);
    saveWorkDir(WORK);
    const again = engine(plan, ['--check', '--only', bad.join(',')], profile);
    const still = again.report.filter((r) => FAIL.has(r.state) && bad.includes(r.key)).map((r) => r.key);
    again.report.filter((r) => r.state === 'PRESENT').forEach((r) => confirmedAt.set(`${plan}:${r.key}`, Date.now()));
    info.annotations.push({ type: 'data', description: `seeded before this test: ${bad.filter((k) => !still.includes(k)).map((k) => `${plan}:${k}`).join(', ') || 'none'}` });
    missingNow.push(...still.map((k) => `${plan}:${k}`));
  }
  const all = [...groups].flatMap(([plan, keys]) => [...keys].map((k) => `${plan}:${k}`));
  const fresh = all.filter((k) => !missingNow.includes(k));
  info.annotations.push({ type: 'data', description: `confirmed on the branch before this test: ${fresh.length} of ${all.length} record(s)` });
  if (missingNow.length) {
    info.skip(true, `its data is not on the branch and could not be seeded: ${missingNow.join(', ')} (see the seeding output above)`);
  }
}

export { envLabel };
