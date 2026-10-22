/**
 * ONE SIGN-IN PER WINDOW, REUSED BY EVERY SCRIPT (2026-10-08). On sv10043 a fresh Google sign-in cookie
 * stopped being accepted after two or three quick-logins within ~15 minutes, so scripts must not each sign
 * in. The first script signs in through the Global Search harness and saves the browser state to /tmp
 * (0600, never committed); later scripts load it and only sign in again if it no longer works.
 */
import fs from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { signIn } from '../../global-search/e2e/fixtures/auth.js';

import { APP as P_APP, API as P_API, STATE as P_STATE } from './profile.mts';
const STATE = P_STATE;
export const APP = P_APP;
export const API = P_API;

const t = () => new Date().toISOString().slice(11, 19);
async function works(page: Page) {
  // every wait here is bounded: an unanswered read must not hang the whole run
  const read = page.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include' }).then(r => r.status)`);
  const r = await Promise.race([read, new Promise((res) => setTimeout(() => res(0), 20_000))]).catch(() => 0);
  console.log(t(), 'saved session check ->', r);
  return r === 200;
}
// Third-party traffic the cases do not depend on, and that the session's network drops mid-request
// (maps, chat widget, error reporting, and the live-update channel — a WebSocket the proxy cannot carry).
// Blocking it keeps a dropped side-request from stalling a page the check is waiting on.
// WOB_LIVE=1 lets the live-update channel (mercure) through on the main page too, so a 'no warning' check can be judged fairly
const NOISE = process.env.WOB_LIVE ? /maps\.googleapis|intercom|sentry\.io|googletagmanager|google-analytics|hotjar|fullstory/i : /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i;
async function quiet(page: Page) {
  // WOB_NOBLOCK=1 (10 Oct 2026): block nothing at all — for checks where a blocked request could itself be the cause (dashboard charts)
  if (!process.env.WOB_NOBLOCK) await page.context().route((u) => NOISE.test(u.toString()), (r) => r.abort()).catch(() => {});
  // The QA branch pauses itself when idle and redirects to sleep.qa.shopview.com ("Environment Sleeping", one Wake Up
  // button; playbook 2026-09-03). If any page lands there mid-batch, press Wake Up and say so in the log: every reading
  // taken around that line is void and the check is re-run.
  page.on('framenavigated', async (fr) => { if (fr !== page.mainFrame() || !/sleep\.qa\.shopview\.com/.test(fr.url())) return;
    console.log(t(), 'BRANCH ASLEEP — pressing Wake Up; readings around this line are void');
    await page.getByRole('button', { name: /Wake Up/i }).first().click({ timeout: 10_000 }).catch(() => {}); });
}

/** 15 Oct 2026 (Rule 130): by default (WOB_SHOT_EACH=0 turns it off) photographs the current screen at the end of every test as <id>-end.png, so each
 *  result has a picture even where a script took none. The page is the last one opened (open() or asRunner's runner page). */
export function registerShotPage(pg: Page) { (globalThis as any).__wobPage = pg;
  (globalThis as any).__shotEach = async (id: string) => { if (process.env.WOB_SHOT_EACH === '0') return; const p2 = (globalThis as any).__wobPage as Page | undefined; if (!p2) return;
    const dir = process.env.WOB_EV || new URL('./evidence/', import.meta.url).pathname; await p2.screenshot({ path: `${dir.replace(/\/$/, '')}/${id}-end.png` }).catch(() => {}); }; }
export async function open(route = '/workorders'): Promise<{ browser: Browser; page: Page }> {
  // 22 Oct 2026 (QA lead: run the suite on PRODUCTION once the release is there): production has no quick-login and no Google
  // sign-in cookie — it signs in with a password (testing-tools/prod-login-boot.mjs, the second admin test account in
  // /tmp/shopview/prod-login.env, never the QA lead's own). Only when WOB_PROD_LOGIN=1; every other environment is unchanged.
  if (process.env.WOB_PROD_LOGIN) {
    const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any;
    const r = await bootProdLogin(route, { deviceScaleFactor: Number(process.env.WOB_SCALE || 1), viewport: { width: 1600, height: 1000 } });
    await quiet(r.page); registerShotPage(r.page); return { browser: r.browser, page: r.page };
  }
  // 14 Oct 2026 (Rule 125, L0312/L0330): WOB_NORMAL_SIGNIN=1 signs in through the sign-in page (bootOrigin, quick-login), the
  // way a person does — the harness sign-in below shows the Schedule clock in UTC. Cookies: WOB_SSO_FILE (+ its -full.json).
  if (process.env.WOB_NORMAL_SIGNIN) {
    const { bootOrigin } = await import('../../testing-tools/qa-branch-boot.mjs') as any;
    const r = await bootOrigin({ app: APP, apiHost: new URL(API).host, ssoFile: process.env.WOB_SSO_FILE || '/tmp/qa-cookies/staging-sso.txt', label: APP, route, key: 'admin' });
    await quiet(r.page);
    // WOB_PIN_NAMES="Ayesha Khan,…" (14 Oct 2026, staging has ~119 technicians at Heavy Duty): pin them for this user first,
    // so their Tech View group / Board View column sits right after Unassigned. A script that sets its own pins still wins.
    if (process.env.WOB_PIN_NAMES) {
      const r2 = await r.page.evaluate(`(async () => { const H = { 'Content-Type': 'application/json', Accept: 'application/json' }; const A = ${JSON.stringify(API)};
        const want = ${JSON.stringify(process.env.WOB_PIN_NAMES.split(',').map((x) => x.trim()))};
        const c = await (await fetch(A + '/api/work-orders/lead-technician-candidates', { credentials: 'include', headers: H })).json();
        const ids = (c?.data?.technicians ?? []).filter(t => want.includes(((t.firstName || '') + ' ' + (t.lastName || '')).trim())).map(t => t.staffId).slice(0, 3);
        const pv = (await (await fetch(A + '/api/users/me/preferences/work-orders-list', { credentials: 'include', headers: H })).json())?.data?.value ?? {};
        const put = await fetch(A + '/api/users/me/preferences/work-orders-list', { method: 'PUT', credentials: 'include', headers: H, body: JSON.stringify({ value: { ...pv, pinnedTechnicianIds: ids } }) });
        return { ids: ids.length, put: put.status }; })()`).catch((e) => ({ error: String(e).slice(0, 100) }));
      console.log(t(), 'pinned for this run', JSON.stringify(r2));
    }
    registerShotPage(r.page); return { browser: r.browser, page: r.page };
  }
  if (fs.existsSync(STATE)) {
    console.log(t(), 'trying the saved session');
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ storageState: STATE, viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.WOB_SCALE || 1) });
    const page = await ctx.newPage();
    await quiet(page);
    await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 45_000 }).catch(() => {});
    await page.waitForTimeout(3000);
    if (!/\/login/.test(page.url()) && await works(page)) { console.log(t(), 'reused the saved session'); return { browser, page }; }
    await browser.close();
    console.log(t(), 'saved session no longer works — signing in once');
  }
  const s = await signIn(route);
  await quiet(s.page);
  fs.writeFileSync(STATE, JSON.stringify(await s.ctx.storageState()), { mode: 0o600 });
  // the sign-in helper's window is 1x; when a sharp (2x) capture is asked for, reopen the saved state at that scale
  const scale = Number(process.env.WOB_SCALE || 1);
  if (scale !== 1) { const ctx2 = await s.browser.newContext({ storageState: STATE, viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale, ignoreHTTPSErrors: true }); const pg2 = await ctx2.newPage(); await quiet(pg2);
    await pg2.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 45_000 }).catch(() => {}); await pg2.waitForTimeout(3000); await s.ctx.close().catch(() => {}); return { browser: s.browser, page: pg2 }; }
  registerShotPage(s.page); return { browser: s.browser, page: s.page };
}

/** End a script: closing the browser can hang on this network, so it is capped and the process exits. */
export async function done(browser: Browser, code = 0): Promise<never> {
  await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5_000))]);
  process.exit(code);
}
