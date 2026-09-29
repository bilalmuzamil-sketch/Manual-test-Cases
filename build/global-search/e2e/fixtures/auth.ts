import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';
import fs from 'node:fs';

export const BRANCH = process.env.GS_BRANCH || 'sv9160';
export const APP    = process.env.GS_APP    || `https://${BRANCH}.qa.shopview.com`;
export const APIH   = process.env.GS_API    || `${BRANCH}api.qa.shopview.com`;   // NO dot before `api`

type Jar = { sv_sso_session?: string; PHPSESSID?: string; cf_clearance?: string };

function readCookies(): Jar {
  const path = process.env.GS_COOKIES || `/tmp/qa-cookies/${BRANCH}-full.json`;
  if (!fs.existsSync(path)) {
    throw new Error(
      `No cookies at ${path}. The branch uses Google sign-in and cannot be logged in by script — ` +
      `paste a live session's cookies into that file as {"sv_sso_session":"…","PHPSESSID":"…"}. ` +
      `Never commit it (Rule 82).`);
  }
  const jar = JSON.parse(fs.readFileSync(path, 'utf8')) as Jar;
  if (!jar.sv_sso_session || !jar.PHPSESSID) {
    throw new Error(
      'Both sv_sso_session AND PHPSESSID are required. Measured 22 Sep 2026: either alone answers ' +
      '401 sso_required. Older notes saying the sign-in cookie is enough predate Google sign-in.');
  }
  return jar;
}

/**
 * Chromium cannot TLS through this environment's egress proxy, so a local relay is required and
 * its port rotates per run. `source build/testing-tools/ensure_bridge.sh` writes the port here.
 * A connection failure almost always means that relay is not running — it dies with the container.
 */
function proxy() {
  const f = '/tmp/atlassian/bridge-port.txt';
  return fs.existsSync(f) ? { server: `http://127.0.0.1:${fs.readFileSync(f, 'utf8').trim()}` } : undefined;
}

export type Session = { browser: Browser; ctx: BrowserContext; page: Page };

export async function signIn(route = '/work-orders', device?: string): Promise<Session> {
  // 🔴 STAGING SIGNS IN DIFFERENTLY, AND WE ALREADY HAVE THAT WORKING. On a QA branch the cookies
  // WERE the session; on staging they only reach the sign-in screen and the app mints the session
  // when the DEV MODE button is clicked. build/testing-tools/staging-cookie-boot.mjs does that,
  // with the retries and the cookie scoping already proven, and is what every probe in the
  // 28-29 September run used. Reuse it rather than keeping a second copy that drifts (Rule 97).
  if (/staging\./.test(APP)) {
    const mod: any = await import('../../../testing-tools/staging-cookie-boot.mjs');
    // Sign in on a route staging definitely has, THEN go where the test asked. Handing the
    // requested route straight to the sign-in page breaks the sign-in itself when that route does
    // not exist here - this suite asks for /work-orders and staging spells it /workorders, and the
    // symptom is "no DEV MODE button", which reads as a broken environment and is not.
    const b = await mod.boot('/customers', { key: process.env.GS_LOGIN_AS || 'admin', settle: 11_000 });
    b.page.setDefaultTimeout(60_000);
    if (route && route !== '/customers') {
      await b.page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await b.page.waitForTimeout(3_000);
    }
    return { browser: b.browser, ctx: b.ctx, page: b.page };
  }

  const jar = readCookies();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    proxy: proxy(),
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });
  const ctx = await browser.newContext({
    viewport: { width: Number(process.env.GS_VW || 1600), height: Number(process.env.GS_VH || 1000) },
    deviceScaleFactor: Number(process.env.GS_DPR || 1),
    ignoreHTTPSErrors: true,
  });
  // 🔴 HOST-ONLY on both hosts, never `.qa.shopview.com`. A domain-scoped copy sits alongside the
  // host-only one, the server reads the stale one, and the API answers 409 right after a good login.
  const appHost = new URL(APP).host;
  const mk = (name: string, value: string) =>
    [{ name, value, domain: APIH, path: '/', secure: true, sameSite: 'None' as const },
     { name, value, domain: appHost, path: '/', secure: true, sameSite: 'None' as const }];
  const cookies = [...mk('sv_sso_session', jar.sv_sso_session!), ...mk('PHPSESSID', jar.PHPSESSID!)];
  if (jar.cf_clearance) cookies.push(...mk('cf_clearance', jar.cf_clearance));
  await ctx.addCookies(cookies);

  const page = await ctx.newPage();
  page.setDefaultTimeout(60_000);
  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  let who = await api(page, 'GET', '/api/auth/me/fe-permissions');

  // 🔴 STAGING NEEDS ONE MORE STEP THAN A QA BRANCH DID. There the cookies alone were a session;
  // here they only get you as far as the sign-in screen, and the app mints the real session when
  // the DEV MODE quick-login button is clicked. Without this the API answers 401 sso_required on
  // the very first call, which reads as "the cookies have aged out" and is nothing of the kind.
  // Measured 29 September 2026, and it is why this suite could not run on staging at all.
  if (who.status !== 200) {
    const key = process.env.GS_LOGIN_AS || 'admin';
    const label = key === 'tech' ? 'Tech' : 'Admin';
    for (let attempt = 1; attempt <= 3 && who.status !== 200; attempt++) {
      // Sign in at /login on its own. Carrying the requested route into the redirect made the
      // login itself fail whenever that route does not exist on this environment - staging spells
      // the work-order list /workorders, and this suite asks for /work-orders.
      await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2_000);
      const btn = page.locator(`button:has-text("${label}")`).first();
      for (let w = 0; w < 20 && !(await btn.count()); w++) await page.waitForTimeout(1_500);
      if (await btn.count()) { await btn.click().catch(() => {}); await page.waitForTimeout(9_000); }
      who = await api(page, 'GET', '/api/auth/me/fe-permissions');
    }
    if (who.status === 200) {
      await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3_000);
    }
  }

  if (who.status !== 200) {
    throw new Error(`Signed out: the API answered ${who.status} ${JSON.stringify(who.body).slice(0, 120)}. ` +
                    `Cookies are in ${process.env.GS_COOKIES || 'the default path'} — refresh them, and check ` +
                    `the local relay is up (build/testing-tools/ensure_bridge.sh).`);
  }
  return { browser, ctx, page };
}

/** The build the assertions were made against — every report must name it. */
export async function buildMarker(page: Page): Promise<string> {
  return page.evaluate(() => (document.querySelector('meta[name=app-version]') as HTMLMetaElement)?.content ?? 'unknown');
}

/**
 * Call the app's API through the PAGE, so it inherits the session. A bare fetch from Node is
 * refused, and a fetch to the app host instead of the api host returns the app's HTML — which
 * parses as "no results" and silently fails open.
 */
export async function api(page: Page, method: string, path: string, body?: unknown) {
  return page.evaluate(async ([m, u, b]) => {
    const r = await fetch(u as string, {
      method: m as string, credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: b ? JSON.stringify(b) : undefined,
    });
    const text = await r.text();
    let json: unknown = null; try { json = JSON.parse(text); } catch { /* html or empty */ }
    return { status: r.status, body: json, text: text.slice(0, 400) };
  }, [method, `https://${APIH}${path}`, body ?? null] as const);
}
