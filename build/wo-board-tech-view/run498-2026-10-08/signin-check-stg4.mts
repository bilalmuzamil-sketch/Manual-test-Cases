/**
 * signin-check-stg4.mts — 15 Oct 2026. Runs FIRST in the fourth pass (stg-after4.sh): the third pass ends with signout-fix.mts,
 * which signs the shared staging session out (C368240). Before 27 re-runs start, prove a normal sign-in (session.mts open(),
 * the same route every script uses) still works: exit 0 and "SIGN-IN OK" when the permissions call answers 200, exit 3 otherwise.
 * Nothing is changed on staging.
 */
import { open, done, API } from './session.mts';
const t = () => new Date().toISOString().slice(11, 19);
let code = 3;
try {
  const { browser, page } = await open('/workorders?tab=all');
  const st = await page.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include' }).then(r => r.status).catch(() => 0)`).catch(() => 0);
  console.log(t(), 'sign-in check: permissions call answered', st, '| page', page.url().replace(/^https:\/\/[^/]+/, ''));
  code = st === 200 && !/login/.test(page.url()) ? 0 : 3;
  console.log(t(), code === 0 ? 'SIGN-IN OK' : 'SIGN-IN FAILED');
  await done(browser, code);
} catch (e: any) { console.log(t(), 'SIGN-IN FAILED', String(e?.message || e).slice(0, 200)); process.exit(3); }
