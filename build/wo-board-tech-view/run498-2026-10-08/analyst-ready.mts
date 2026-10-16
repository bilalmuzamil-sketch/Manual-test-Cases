/** 16 Oct 2026 — step 1 of run-full-1016.sh (block A). Opens a browser as the QA lead's "Analyst 1" (the SECOND staging company) with
 *  analyst.mts: its saved cookies first; if the app shows the sign-in page, analyst.mts signs in through the app's own Email/Password
 *  form and saves the new PHPSESSID back to /tmp/qa-cookies/staging-analyst1.json (never printed). Then, read only: the permissions call
 *  (positive control: 200 = signed in), the top bar, and the build marker the app shows (vNN.NN.NN-xxxxxxx). Exit 0 only when Analyst 1
 *  is signed in; exit 3 otherwise, so the queue skips the rest of block A instead of running it signed out.
 *  WHY IT EXISTS: since 16 Oct ~18:35 UTC Analyst 1 shares the Admin's Google sign-in, so any Admin quick-login ends the Analyst 1
 *  session; block A runs first and this step proves the session before anything is judged in company B. Nothing is changed in the app. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts';
import { EV, t } from './wob.mts';
let code = 3; const o: any = {};
try {
  const A = await analystBrowser('/workorders?tab=all'); const p = A.page;
  o.info = { url: A.info.url, top: A.info.top, formSignIn: A.info.formSignIn ?? null, savedNewSession: A.info.savedNewSession ?? false };
  o.permissions = (await A.api.get('/api/auth/me/fe-permissions')).status;
  o.build = await p.evaluate(`(document.body.innerText.match(/v\\d+\\.\\d+\\.\\d+-[0-9a-f]{7}/) || [null])[0]`).catch(() => null);
  await p.screenshot({ path: path.join(EV, 'analyst-ready.png') }).catch(() => {});
  code = o.permissions === 200 && !/\/login/.test(String(A.info.url)) ? 0 : 3;
  await Promise.race([A.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 200); }
fs.writeFileSync(path.join(EV, 'analyst-ready.json'), JSON.stringify(o, null, 1));
console.log(t(), code === 0 ? 'ANALYST 1 SIGNED IN' : 'ANALYST 1 NOT SIGNED IN', JSON.stringify(o).slice(0, 600));
process.exit(code);
