/**
 * SIGN IN ONCE, BY HAND, AND KEEP THE SESSION.
 *
 *     npm run login
 *
 * 🔴 WHY THIS IS THE RIGHT WAY IN, AND PASTING COOKIES IS NOT.
 * Staging signs in through Google. There is no username and password to script, and the DEV MODE
 * quick-login panel an earlier version of this suite clicked no longer exists. Cookies alone are
 * not enough either: measured 2 October 2026, a valid cookie set answers 200 from
 * `/api/auth/me/fe-permissions` while the browser still sits on `/login`, because the app keeps its
 * session in localStorage and only a real sign-in writes it.
 *
 * So do the real sign-in — once. This opens a browser, you sign in as you normally would, and the
 * whole session (cookies AND localStorage) is saved to `.auth/`. Every later run reuses it and
 * needs nothing from you. When it expires, run this again.
 *
 * 🛑 `.auth/` IS GIT-IGNORED AND MUST STAY THAT WAY. It holds a live session that authenticates as
 * you. This repository is public.
 */
import { chromium } from 'playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { APP, APIH, authStatePath } from './fixtures/boot.js';

async function main() {
  const out = authStatePath();
  fs.mkdirSync(path.dirname(out), { recursive: true });

  console.log(`\nOpening ${APP} — sign in as you normally would.`);
  console.log('This window is yours: complete Google sign-in, and wait until the app has loaded.\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox'],
    ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
  });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1480, height: 950 } });
  const page = await ctx.newPage();
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' });

  // Wait until the app is genuinely signed in: the API accepts the session AND the page is off the
  // login screen. Either alone is not enough — that is the mistake this whole file exists to avoid.
  const deadline = Date.now() + 10 * 60_000;
  let ready = false;
  while (Date.now() < deadline) {
    await page.waitForTimeout(2_000);
    if (/\/login/.test(page.url())) continue;
    const api = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, { ignoreHTTPSErrors: true })
      .then(r => r.status() === 200).catch(() => false);
    if (!api) continue;
    const shell = await page.locator('.global-search__trigger').count().catch(() => 0);
    if (shell > 0) { ready = true; break; }
  }

  if (!ready) {
    await browser.close();
    console.error('\nTimed out waiting for a signed-in app. Nothing was saved.\n');
    process.exit(1);
  }

  await ctx.storageState({ path: out });
  await browser.close();
  console.log(`\nSaved the session to ${out}`);
  console.log('It is git-ignored. Run `npm test` now; re-run this when it expires.\n');
}

main().catch((e) => { console.error('\nsign-in failed:', e?.message ?? e, '\n'); process.exit(1); });
