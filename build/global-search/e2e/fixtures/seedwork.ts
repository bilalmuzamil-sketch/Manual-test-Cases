/**
 * THE SEEDING ENGINE, DRIVEN FROM NODE — shared by the run-start seeding (seed.ts) and the per-test
 * data check (data-check.ts), so both prepare it, run it and keep its memory the same way.
 *
 *  · A PRIVATE WORKING COPY. The engine writes state files next to itself (record ids it created,
 *    what it has driven to which status). It never runs from the repository: it runs from a copy in
 *    the system temp folder, with the ids remembered from earlier runs laid in, and they are saved
 *    back to the cache afterwards (GS_SEED_CACHE, default ~/.cache/shopview-e2e/<environment>).
 *  · A SESSION FILE THE ENGINE READS, 0600, in that private copy, never in the repository and never
 *    in results/ (which CI uploads). Its folder name is the environment label, which the engine uses
 *    to keep each environment's ids apart.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { APP, IS_PROD, IS_STAGING } from './boot.js';
import { seedingDir } from './data.js';

/** One label per environment, so one estate's record ids never overwrite another's. */
export function envLabel(): string {
  if (IS_PROD) return 'prod';
  if (IS_STAGING) return 'staging';
  return `qa-${new URL(APP).host.split('.')[0]}`;
}

export function python(): string {
  for (const p of [process.env.GS_PYTHON, 'python3', 'python'].filter(Boolean) as string[]) {
    const r = spawnSync(p, ['-c', 'import sys; print(sys.version_info >= (3, 8))'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === 'True') return p;
  }
  throw new Error('Seeding needs Python 3.8 or newer on PATH (python3). Nothing else to install — '
    + 'the seeder uses only the standard library. Set GS_PYTHON to point at a specific one.');
}

/** The per-environment files the engine writes: ids, state, plans it records as it goes. */
export const isStateFile = (name: string, label: string) =>
  name.endsWith('.json') && !name.startsWith('seed-manifest') && name.includes(label);

export function cacheDir(label = envLabel()): string {
  const d = path.join(process.env.GS_SEED_CACHE || path.join(os.homedir(), '.cache', 'shopview-e2e'), label);
  fs.mkdirSync(d, { recursive: true });
  return d;
}

/** A fresh private copy of the engine with this environment's remembered ids laid in. */
export function makeWorkDir(label = envLabel()): string {
  const SEEDING = seedingDir();
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'shopview-seed-'));
  fs.chmodSync(work, 0o700);
  for (const f of fs.readdirSync(SEEDING)) {
    if (/\.(py|json)$/.test(f)) fs.copyFileSync(path.join(SEEDING, f), path.join(work, f));
  }
  const cache = cacheDir(label);
  for (const f of fs.readdirSync(cache)) {
    if (isStateFile(f, label)) fs.copyFileSync(path.join(cache, f), path.join(work, f));
  }
  return work;
}

/** Save what the engine learned (ids, state) back to the cache. True about records that exist. */
export function saveWorkDir(work: string, label = envLabel()): void {
  const cache = cacheDir(label);
  for (const f of fs.readdirSync(work)) {
    if (isStateFile(f, label)) fs.copyFileSync(path.join(work, f), path.join(cache, f));
  }
}

/** Write the session the engine will use. Returns the profile path to pass as SEED_PROFILE. */
export function writeProfile(work: string, host: string, api: string,
  cookies: { PHPSESSID: string; sv_sso_session?: string }, label = envLabel()): string {
  const dir = path.join(work, label);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const profile = path.join(dir, 'cookies.json');
  fs.writeFileSync(profile, JSON.stringify({ host, api, ...cookies }), { mode: 0o600 });
  return profile;
}

export type EngineRun = { status: number | null; out: string };

/** Run one engine script in the working copy. stdio is captured (and echoed when `echo`). */
export function runEngine(work: string, script: string, args: string[], env: Record<string, string>,
  echo = false): EngineRun {
  const r = spawnSync(python(), [script, ...args], {
    cwd: work, env: { ...process.env, PYTHONUNBUFFERED: '1', ...env },
    encoding: 'utf8', stdio: echo ? 'inherit' : 'pipe', maxBuffer: 64 * 1024 * 1024,
  });
  return { status: r.status, out: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/* ───────────── THE CURRENT FULL-ACCESS SESSION, FOR CHECKS MADE DURING THE RUN ───────────── */
/**
 * 🔴 WHY THE TESTS' OWN SESSION. Every sign-in ends the same account's previous session, and each
 * test file signs in afresh. A data check that signed in by itself would sign the running test out.
 * So the full-access sign-in records its session here (0600, system temp folder, per environment),
 * and the per-test data check uses exactly that session - the one the test is already holding.
 * The lower-permission sign-in never records itself: it cannot see parts or suppliers, so it must
 * never be the one that checks or creates data.
 */
export function sessionFile(label = envLabel()): string {
  return path.join(os.tmpdir(), 'shopview-e2e-session', label, 'session.json');
}

export function rememberSession(host: string, api: string, cookies: { PHPSESSID: string; sv_sso_session?: string }): void {
  try {
    const f = sessionFile();
    fs.mkdirSync(path.dirname(f), { recursive: true, mode: 0o700 });
    fs.writeFileSync(f, JSON.stringify({ host, api, ...cookies, at: new Date().toISOString() }), { mode: 0o600 });
  } catch { /* a check that cannot find a session stands down; it never breaks a sign-in */ }
}

export function currentSession(): { host: string; api: string; PHPSESSID: string; sv_sso_session?: string } | null {
  try { return JSON.parse(fs.readFileSync(sessionFile(), 'utf8')); } catch { return null; }
}
