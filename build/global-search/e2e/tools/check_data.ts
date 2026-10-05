/**
 * Ask the seeding engine about specific records, the same way the per-test check does, and print its
 * full answer - so "its data is not on the branch" can be explained instead of guessed at.
 *
 *   npx tsx tools/check_data.ts <plan> <key,key,...>            check only (reads, writes nothing)
 *   npx tsx tools/check_data.ts <plan> <key,key,...> --repair   create what is missing, then check again
 *   npx tsx tools/check_data.ts <plan> <keys> --script <file.py> also run a READ-ONLY probe with the engine's call()
 *
 * <plan> is one of: v1reg gs-v2 ranking toggle pertab e2e fixtures (fixtures/data-check.ts PLAN_FILE).
 * Uses the full-access session the last run recorded (fixtures/seedwork.ts), so it signs nobody out.
 */
import { PLAN_FILE } from '../fixtures/data-check.js';
import { currentSession, makeWorkDir, runEngine, writeProfile } from '../fixtures/seedwork.js';

const [plan, keys, flag] = process.argv.slice(2);
if (!plan || !keys || !PLAN_FILE[plan]) {
  console.error(`usage: tsx tools/check_data.ts <${Object.keys(PLAN_FILE).join('|')}> <key,key,...> [--repair]`);
  process.exit(2);
}
const sess = currentSession();
if (!sess) { console.error('no recorded session - run any test first (it records one)'); process.exit(2); }
const work = makeWorkDir();
const { host, api, ...cookies } = sess as Record<string, string>;
delete (cookies as Record<string, string>).at;
const profile = writeProfile(work, host, api, cookies as { PHPSESSID: string });
const env = { SEED_PROFILE: profile, SEED_MANIFEST: PLAN_FILE[plan] };
const show = (args: string[]) => {
  const r = runEngine(work, 'seed.py', args, env);
  console.log(`\n$ seed.py ${args.join(' ')}   (exit ${r.status})\n${r.out}`);
};
show(['--whoami']);
show(['--check', '--only', keys]);
if (flag === '--script') {                      // run a read-only python file inside the engine's folder
  const r = runEngine(work, process.argv[5], [], env);
  console.log(r.out);
}
if (flag === '--repair') {
  show(['--confirm', '--only', keys, '--wait-findable', '45']);
  show(['--check', '--only', keys]);
}
