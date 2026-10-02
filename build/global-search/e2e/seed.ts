/**
 * SEED EVERYTHING — `npm run seed`, and the first thing every `npm test` does.
 *
 * Puts every record this suite reads onto the environment, then proves search returns them.
 * It drives the reseed system in `../seeding/` — five data sets built over three weeks for exactly
 * these cases, plus this suite's own (`seed-manifest-e2e.json`) — in the order its own
 * `reseed_everything.sh` proved, with the same rules: measure first, create only what is missing,
 * read every write back. Safe to run any number of times.
 *
 * 🔴 WHY IT RUNS BEFORE EVERY RUN. The branch is refreshed, and a refresh wipes what was seeded.
 * A run against a wiped branch does not fail — its checks stand down for lack of data, and a
 * standing-down suite looks like a suite that ran. So the run seeds first, every time, and only
 * then lets a test start.
 *
 * NEEDS: Node (this suite) and Python 3 (the seeder; standard library only, nothing to install).
 * SIGN-IN, nothing else: production GS_USER + GS_PASS · staging / QA branches GS_SSO.
 *
 * It never writes into the repository. The seeder keeps record ids and state in files next to
 * itself, so it runs from a temporary copy; the ids are kept between runs in a cache outside the
 * repo (GS_SEED_CACHE, default ~/.cache/shopview-e2e). Without that cache, work orders — found by
 * the ids recorded when they were made, because their search is broken — would be created again
 * on every run against a branch that was NOT wiped.
 *
 *   npm run seed                 seed + prove
 *   GS_SEED=check npm run seed   measure only, write nothing
 */
import { request, type APIRequestContext } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP, APIH, IS_PROD, IS_STAGING, credentials, ssoCookie, standardProxy, workplaceHint } from './fixtures/boot.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SEEDING = path.resolve(HERE, '../seeding');
const CHECK = (process.env.GS_SEED || '').toLowerCase() === 'check';

/** One label per environment, so one estate's record ids never overwrite another's. */
function envLabel(): string {
  if (IS_PROD) return 'prod';
  if (IS_STAGING) return 'staging';
  const branch = new URL(APP).host.split('.')[0];
  return `qa-${branch}`;
}

/**
 * The steps, in the order reseed_everything.sh proved (each depends on the one before), then the
 * three data sets added after it was written, then this suite's own. A step that fails STOPS the
 * run: seeding the second half on top of a broken first half produces data that looks complete.
 */
type Step = { label: string; manifest: string; script: string; args?: string[]; proof?: boolean };
const STEPS: Step[] = [
  { label: 'V1-regression records',              manifest: 'seed-manifest.json',        script: 'seed.py' },
  { label: 'Fibridge records',                   manifest: 'seed-manifest-gs-v2.json',  script: 'seed.py' },
  { label: 'work-order status spread',           manifest: 'seed-manifest-gs-v2.json',  script: 'set_wo_statuses.py' },
  { label: 'purchase orders + vendor invoices',  manifest: 'seed-manifest-gs-v2.json',  script: 'seed_po_and_invoices.py' },
  { label: 'two work orders completed + invoiced', manifest: 'seed-manifest-gs-v2.json', script: 'complete_and_invoice.py' },
  { label: 'role fixtures (creates roles; never edits a shared one)', manifest: 'seed-manifest-gs-v2.json', script: 'seed_roles.py' },
  { label: 'recent-activity list',               manifest: 'seed-manifest-gs-v2.json',  script: 'touch_recent_entities.py' },
  { label: 'ranking + fuzzy records',            manifest: 'seed-manifest-ranking.json', script: 'seed.py' },
  { label: 'ranking signals',                    manifest: 'seed-manifest-ranking.json', script: 'apply_ranking_signals.py' },
  { label: 'toggle records',                     manifest: 'seed-manifest-toggle.json', script: 'seed.py' },
  { label: 'per-tab records',                    manifest: 'seed-manifest-pertab.json', script: 'seed.py' },
  { label: 'this suite\'s own records',          manifest: 'seed-manifest-e2e.json',    script: 'seed.py' },
  { label: 'this suite\'s purchase orders + invoices', manifest: 'seed-manifest-e2e.json', script: 'seed_po_from_manifest.py' },
  { label: 'PROOF — Fibridge',                   manifest: 'seed-manifest-gs-v2.json',  script: 'verify_gsv2.py',    proof: true },
  { label: 'PROOF — ranking',                    manifest: 'seed-manifest-ranking.json', script: 'verify_ranking.py', proof: true },
  { label: 'PROOF — toggle',                     manifest: 'seed-manifest-toggle.json', script: 'verify_toggle.py',  proof: true },
];

/** The per-environment files the seeder writes: ids, state, plans it records as it goes. */
const isStateFile = (name: string, label: string) =>
  name.endsWith('.json') && !name.startsWith('seed-manifest') && name.includes(label);

function python(): string {
  for (const p of [process.env.GS_PYTHON, 'python3', 'python'].filter(Boolean) as string[]) {
    const r = spawnSync(p, ['-c', 'import sys; print(sys.version_info >= (3, 8))'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === 'True') return p;
  }
  throw new Error('Seeding needs Python 3.8 or newer on PATH (python3). Nothing else to install — '
    + 'the seeder uses only the standard library. Set GS_PYTHON to point at a specific one.');
}

/** A server-minted session for the seeder, by the same route the tests sign in by. */
async function mintSession(): Promise<{ PHPSESSID: string; sv_sso_session?: string }> {
  const ctx: APIRequestContext = await request.newContext({ proxy: standardProxy(), ignoreHTTPSErrors: true });
  const json = { 'Content-Type': 'application/json', Accept: 'application/json' };
  let sso: string | undefined;
  if (IS_PROD) {
    const { user, pass } = credentials();
    const r = await ctx.post(`https://${APIH}/api/login`, { data: { username: user, password: pass }, headers: json });
    if (r.status() !== 200) throw new Error(`production sign-in refused (HTTP ${r.status()})`);
  } else {
    sso = ssoCookie();
    if (!sso) throw new Error(`no Google session for ${APP}: set GS_SSO (see .env.example)`);
    await ctx.storageState();                                       // initialise the jar
    const r = await ctx.post(`https://${APIH}/api/quick-login`, {
      data: { key: 'admin' }, headers: { ...json, Cookie: `sv_sso_session=${sso}` },
    });
    if (r.status() !== 200) {
      throw new Error(r.status() === 401
        ? 'the Google session (GS_SSO) has expired — sign in to this environment in a browser and copy a fresh sv_sso_session'
        : `quick-login answered HTTP ${r.status()}`);
    }
  }
  const sid = (await ctx.storageState()).cookies.find((c) => c.name === 'PHPSESSID' && c.value && c.value !== 'deleted');
  await ctx.dispose();
  if (!sid) throw new Error('signed in, but the server set no PHPSESSID');
  return { PHPSESSID: sid.value, ...(sso ? { sv_sso_session: sso } : {}) };
}

export default async function seedEverything(): Promise<void> {
  const label = envLabel();
  const shop = workplaceHint();
  console.log(`\n── Seeding ${APP}  (shop: ${shop}${CHECK ? ', MEASURE ONLY' : ''}) ──────────────────────────`);
  const py = python();

  // A private working copy of the seeder, so nothing it writes lands in the repository.
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'shopview-seed-'));
  fs.chmodSync(work, 0o700);
  for (const f of fs.readdirSync(SEEDING)) {
    if (/\.(py|json)$/.test(f)) fs.copyFileSync(path.join(SEEDING, f), path.join(work, f));
  }
  const cache = path.join(process.env.GS_SEED_CACHE || path.join(os.homedir(), '.cache', 'shopview-e2e'), label);
  fs.mkdirSync(cache, { recursive: true });
  for (const f of fs.readdirSync(cache)) {
    if (isStateFile(f, label)) fs.copyFileSync(path.join(cache, f), path.join(work, f));   // last run's ids win
  }

  // The session file the seeder reads. Its directory name IS the environment label it keys files by.
  const profDir = path.join(work, label);
  fs.mkdirSync(profDir, { mode: 0o700 });
  const profile = path.join(profDir, 'cookies.json');
  fs.writeFileSync(profile, JSON.stringify({ host: new URL(APP).host, api: APIH, ...(await mintSession()) }), { mode: 0o600 });

  const env = { ...process.env, SEED_PROFILE: profile, SEED_WORKPLACE: shop, PYTHONUNBUFFERED: '1' };
  const failures: string[] = [];
  try {
    for (const st of STEPS) {
      if (CHECK && st.script !== 'seed.py' && !st.proof) continue;      // only the measuring steps
      const args = st.proof ? [] : [CHECK ? '--check' : '--confirm'];
      console.log(`\n──── ${st.label}  [${st.script}${args.length ? ' ' + args.join(' ') : ''} · ${st.manifest}]`);
      // 🔴 ONE RETRY, BECAUSE EVERY STEP DECIDES FROM THE ENVIRONMENT. Claude's cloud egress drops a
      // connection now and then (twice in one reseed on 2026-10-02). A step re-run finds what its
      // first attempt made and creates only what is still missing, so a retry cannot duplicate — and
      // a second failure is a real one.
      let r = spawnSync(py, [st.script, ...args], { cwd: work, env: { ...env, SEED_MANIFEST: st.manifest }, stdio: 'inherit' });
      if (r.status !== 0 && !st.proof) {
        console.log(`\n──── ${st.label}: failed once — retrying, because a re-run finds what the first attempt made`);
        r = spawnSync(py, [st.script, ...args], { cwd: work, env: { ...env, SEED_MANIFEST: st.manifest }, stdio: 'inherit' });
      }
      if (r.status !== 0) {
        failures.push(st.label);
        if (!st.proof) break;                      // a broken seed step stops the run; a proof keeps going so all are reported
      }
    }
  } finally {
    // Keep the ids for next time, even after a failure — they are true about the records that exist.
    for (const f of fs.readdirSync(work)) {
      if (isStateFile(f, label)) fs.copyFileSync(path.join(work, f), path.join(cache, f));
    }
    fs.rmSync(work, { recursive: true, force: true });                  // the session file goes with it
  }

  if (failures.length) {
    throw new Error(`SEEDING DID NOT COMPLETE on ${APP}. Failed: ${failures.join(' · ')}.\n`
      + 'Nothing below this point would be measuring the product, so the run stops here. The step\'s '
      + 'own output above says why; build/global-search/seeding/RESEED.md lists the usual causes.');
  }
  console.log(`\nseeding: every step completed${CHECK ? ' (measured only)' : ''}.\n`);
}

if (process.argv[1] && /seed\.ts$/.test(process.argv[1])) {
  seedEverything().then(() => process.exit(0), (e) => { console.error(`\n${e?.message ?? e}\n`); process.exit(1); });
}
