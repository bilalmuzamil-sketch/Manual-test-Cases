/**
 * RESET THE TECHNICIAN ROLE TO ITS TEMPLATE, ON THE ROLES SCREEN, BEFORE EVERY RUN (Rule 118).
 *
 * 🔴 WHY THIS EXISTS — A FAULT OF OURS THAT REACHED SHARED DATA (2026-10-02/03).
 * access-and-location.spec.ts edits the Technician role and puts it back. It took "back" to mean
 * "whatever the role was when the file started". But when a test times out Playwright starts the
 * file again in a fresh worker, and that fresh start read the role AS THE PREVIOUS CHECK HAD LEFT IT
 * (time-clock only), called it the baseline, and faithfully "restored" it to that. Staging's
 * Technician role - held by 62 people - was left without work orders, customers or schedule until
 * it was reset by hand on 2026-10-03.
 *
 * So the default is never read from the live role. It is PROVED: open the role's edit page, press
 * "Reset to Template", and - if Save becomes clickable, which means the role had drifted - press
 * Save and accept the confirmation. Then the role is read back and written to a file; the access
 * tests take their baseline from that file and nowhere else. A run cut off half way (a container
 * restart, a kill) is repaired by the next run's reset.
 *
 * Staging and QA branches only: production's role ids differ and the access tests stand down there.
 */
import fs from 'node:fs';
import path from 'node:path';
import { signInWithSso, APIH, APP, IS_PROD, ssoCookie } from './boot.js';
import { RESULTS_DIR, writeRunStatus } from './data.js';

export const TECH_ROLE = process.env.GS_TECH_ROLE || 'af8d02b5-ecd1-4205-a82f-32a4d5bb1015';
export const BASELINE_FILE = path.join(RESULTS_DIR, 'technician-baseline.json');

export async function resetTechnicianRole(): Promise<void> {
  try { fs.rmSync(BASELINE_FILE, { force: true }); } catch { /* none yet */ }
  if (IS_PROD || !ssoCookie()) {
    console.log('role reset: not on this environment (production, or no staging sign-in) — skipped');
    writeRunStatus('technician_role', { reset: false, reason: 'not applicable here' });
    return;
  }
  const s = await signInWithSso('/dashboard', { key: 'admin' });
  const p = s.page;
  p.setDefaultTimeout(15_000);
  const read = () => p.evaluate(async ([h, id]) => {
    const r = await fetch(`https://${h}/api/roles/${id}`, { credentials: 'include' });
    return r.ok ? (await r.json()).data : null;
  }, [APIH, TECH_ROLE] as const);
  try {
    const before = await read();
    if (!before) {
      console.log(`role reset: role ${TECH_ROLE} does not exist here — skipped`);
      writeRunStatus('technician_role', { reset: false, reason: 'role not on this environment' });
      return;
    }
    await p.goto(`${APP}/administration/roles-permissions/${TECH_ROLE}/edit`, { waitUntil: 'load' });
    await p.waitForTimeout(3_000);
    const save = p.getByRole('button', { name: /^\s*Save\s*$/i }).first();
    await p.getByRole('button', { name: /Reset\s*to\s*Template/i }).first().click();
    await p.waitForTimeout(1_000);
    const confirmReset = p.locator('.q-dialog button').filter({ hasText: /^\s*Reset\s*$/i });
    if (await confirmReset.count()) { await confirmReset.first().click(); await p.waitForTimeout(1_000); }
    const drifted = await save.isEnabled();
    if (drifted) {
      await save.click();
      await p.waitForTimeout(1_500);
      // "Confirm Permission Updates" lists what is removed and added; accept it.
      const ok = p.locator('.q-dialog').last().locator('button').filter({ hasText: /^\s*(Confirm|Save|Yes|OK|Continue)\s*$/i });
      if (await ok.count()) await ok.first().click();
      await p.waitForTimeout(3_000);
    }
    const after = await read();
    const codes = (r: any) => (r?.fe_permissions ?? []).map((x: any) => x.code).sort();
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(after, null, 2));
    console.log(`role reset: Technician ${drifted ? 'HAD DRIFTED and was reset to its template' : 'was already at its template'}`
      + ` — ${codes(after).join(', ')}`);
    writeRunStatus('technician_role', { reset: true, had_drifted: drifted, before: codes(before), after: codes(after) });
  } catch (e) {
    // Never stalls the run. Without the file the access tests stand down rather than guess.
    console.log(`🔴 role reset did not complete: ${(e as Error).message.split('\n')[0]} — the role-editing checks will stand down`);
    writeRunStatus('technician_role', { reset: false, reason: (e as Error).message.split('\n')[0] });
  } finally {
    await s.browser.close();
  }
}

/** The proven default, or null when this run did not establish one. */
export function technicianBaseline(): any | null {
  try { return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')); } catch { return null; }
}
