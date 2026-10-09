/**
 * ONE SIGN-IN PER WINDOW, REUSED BY EVERY SCRIPT (2026-10-08). On sv10043 a fresh Google sign-in cookie
 * stopped being accepted after two or three quick-logins within ~15 minutes, so scripts must not each sign
 * in. The first script signs in through the Global Search harness and saves the browser state to /tmp
 * (0600, never committed); later scripts load it and only sign in again if it no longer works.
 */
import fs from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { signIn } from '../../global-search/e2e/fixtures/auth.js';

const STATE = '/tmp/shopview/sv10043-state.json';
export const APP = process.env.GS_APP || 'https://sv10043.qa.shopview.com';
export const API = 'https://sv10043api.qa.shopview.com';

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
const NOISE = /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i;
async function quiet(page: Page) {
  await page.context().route((u) => NOISE.test(u.toString()), (r) => r.abort()).catch(() => {});
}
export async function open(route = '/workorders'): Promise<{ browser: Browser; page: Page }> {
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
  return { browser: s.browser, page: s.page };
}

/** End a script: closing the browser can hang on this network, so it is capped and the process exits. */
export async function done(browser: Browser, code = 0): Promise<never> {
  await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5_000))]);
  process.exit(code);
}
