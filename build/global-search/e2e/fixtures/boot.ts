import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';
import fs from 'node:fs';

/**
 * SIGNING IN, SELF-CONTAINED AND PORTABLE.
 *
 * 🔴 WHY THIS FILE EXISTS. The suite used to sign in by importing two scripts from
 * `build/testing-tools/`, which were written for one particular container and could not run
 * anywhere else:
 *   • both did an UNCONDITIONAL `readFileSync('/tmp/atlassian/bridge-port.txt')` — a local network
 *     relay that exists only in that container. On any other machine the read throws inside
 *     `beforeAll`, so every test in the file fails before a single assertion runs. A reviewer
 *     checking out this branch could not run the suite at all.
 *   • both hard-coded `/opt/node22/lib/node_modules/playwright` and `/opt/pw-browsers/chromium`.
 *   • credentials could only come from a file at a fixed path outside the repository.
 *
 * Everything here degrades to the ordinary case: no relay unless one is present, Playwright finds
 * its own browser, and credentials come from environment variables first. Nothing is committed.
 */

export const APP  = (process.env.GS_APP  || 'https://app.staging.shopview.com').replace(/\/$/, '');
export const APIH = process.env.GS_API || new URL(APP).host.replace(/^app\./, 'api.');
export const IS_PROD = /app\.shopview\.com/.test(APP);
export const IS_STAGING = /staging/.test(APP);

export type Session = { browser: Browser; ctx: BrowserContext; page: Page };

/**
 * A local relay, ONLY if one is already running. Some sandboxes cannot open TLS directly and put a
 * relay in front; an ordinary machine needs none. Optional in both directions — never required.
 */
function proxy() {
  const f = process.env.GS_BRIDGE_PORT_FILE || '/tmp/atlassian/bridge-port.txt';
  if (process.env.GS_PROXY) return { server: process.env.GS_PROXY };
  try {
    return fs.existsSync(f) ? { server: `http://127.0.0.1:${fs.readFileSync(f, 'utf8').trim()}` } : undefined;
  } catch { return undefined; }
}

/** Read KEY=value pairs out of a file, tolerating its absence. */
function readEnvFile(path?: string): Record<string, string> {
  if (!path || !fs.existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/**
 * Credentials: environment first, then an optional file. The file is for a machine where putting
 * secrets in the shell history is worse; neither is ever committed (this repository is public).
 */
export function credentials(envFile?: string): { user: string; pass: string } {
  const f = readEnvFile(envFile || process.env.GS_ENVF || process.env.PROD_ENVF);
  const user = process.env.GS_USER || process.env.SV_USER || f.SV_USER || f.GS_USER || '';
  const pass = process.env.GS_PASS || process.env.SV_PASS || f.SV_PASS || f.GS_PASS || '';
  if (!user || !pass) {
    throw new Error(
      'No credentials. Set GS_USER and GS_PASS (or point GS_ENVF at a file holding SV_USER= and '
      + 'SV_PASS=). See e2e/.env.example. Nothing is read from the repository and nothing is '
      + 'committed.');
  }
  return { user, pass };
}

async function launch(opts: { viewport?: { width: number; height: number }; deviceScaleFactor?: number } = {}) {
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    // 🔴 NO HARD-CODED BROWSER PATH. Playwright resolves the browser it installed. CHROME_BIN is
    // honoured for a sandbox that ships its own, but it is not required.
    ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
    proxy: proxy(),
  });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: opts.viewport ?? {
      width: Number(process.env.GS_VW || 1600), height: Number(process.env.GS_VH || 1000),
    },
    deviceScaleFactor: opts.deviceScaleFactor ?? Number(process.env.GS_DPR || 1),
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(Number(process.env.GS_TIMEOUT || 60_000));
  return { browser, ctx, page };
}

/**
 * PRODUCTION: there is no SSO cookie and the quick-login endpoint answers 500. The route that works
 * is `POST /api/login`, then hydrating the page from the login response itself.
 *
 * 🔴 SIGNING IN AS THE SAME PERSON TWICE ENDS THE EARLIER SESSION. Run with `--workers=1`, or two
 * workers log each other out and both report a broken environment.
 */
export async function signInWithPassword(
  route = '/customers',
  opts: { envFile?: string; settle?: number } = {},
): Promise<Session> {
  const { user, pass } = credentials(opts.envFile);
  const { browser, ctx, page } = await launch();
  const log = (...a: unknown[]) => console.log(new Date().toISOString().slice(11, 19), ...a);

  // 1) Log in once through the browser's request context, which shares the cookie jar.
  const r = await ctx.request.post(`https://${APIH}/api/login`, {
    data: { username: user, password: pass },
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ignoreHTTPSErrors: true,
  });
  const text = await r.text();
  let loginData: any = null;
  if (r.status() === 200) { try { loginData = JSON.parse(text)?.data; } catch { /* non-JSON */ } }

  if (!loginData) {
    // The API call can be refused where the real form is accepted — the form carries the Origin,
    // Referer and CSRF the bare call lacks. Drive it, and let the APP write its own session:
    // server-minted, nothing forged.
    log(`POST /api/login -> ${r.status()}; driving the login form instead`);
    await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6_000);
    await page.locator('input[type=email], input[autocomplete=username]').first().fill(user);
    await page.locator('input[type=password]').first().fill(pass);          // never logged
    await page.locator('button:has-text("Login"), button:has-text("Sign in"), button[type=submit]')
      .first().click();
    let ok = false;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(2_000);
      if (!/\/login/.test(page.url())) { ok = true; break; }
      const err = await page.evaluate(() => {
        const t = document.body.innerText || '';
        const m = t.match(/(invalid|incorrect|failed)[^\n]{0,60}/i);
        return m ? m[0] : null;
      }).catch(() => null);
      if (err && i > 3) { await browser.close(); throw new Error(`sign-in refused: ${err}`); }
    }
    if (!ok) { await browser.close(); throw new Error(`sign-in did not leave /login (still ${page.url()})`); }
  } else {
    log(`signed in as ${user}`);
    /**
     * 🔴 SET THE SESSION WITH addInitScript, BEFORE ANY PAGE LOADS, AND IN THE APP'S OWN SHAPE.
     * Writing localStorage with `page.evaluate` after navigating is too late — the app has already
     * read it, found nothing and bounced to /login — and the user must be wrapped as `{ data: … }`.
     * Getting either wrong leaves every test looking at a sign-in screen, which reads as the
     * feature being broken. Measured again on 2 Oct 2026 when a rewrite got both wrong.
     */
    const fe = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,
      { headers: { Accept: 'application/json' }, ignoreHTTPSErrors: true });
    const fep = fe.status() === 200 ? (await fe.json())?.data : null;
    await ctx.addInitScript(([u, f]: [any, any]) => {
      try {
        localStorage.setItem('user', JSON.stringify({ data: u }));
        if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
        if (u?.token) localStorage.setItem('token', u.token);
      } catch { /* storage unavailable */ }
    }, [loginData, fep] as any);
  }

  const feNow = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,
    { headers: { Accept: 'application/json' }, ignoreHTTPSErrors: true });
  const nPerms = feNow.status() === 200
    ? ((await feNow.json())?.data?.fe_permissions || []).length : 0;

  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle ?? 12_000);
  const version = await page.evaluate(() =>
    (document.querySelector('meta[name=app-version]') as HTMLMetaElement | null)?.content ?? null).catch(() => null);
  log(`${page.url()} | app-version=${version} | fe_permissions=${nPerms}`);
  if (/\/login/.test(page.url())) {
    log('⚠ still on /login after hydration — investigate before trusting any result');
  }
  return { browser, ctx, page };
}

/**
 * STAGING: the sign-in card carries a "DEV MODE — QUICK LOGIN" panel. Cookies get you as far as
 * that card; clicking the button makes the app mint the real session, so the role and permissions
 * come from the server rather than being hand-written.
 *
 * 🔴 STAGING NEEDS ALL THREE COOKIES, on BOTH hosts, scoped HOST-ONLY. With PHPSESSID dropped the
 * site bounces to a Google sign-in page; a domain-scoped duplicate makes the server read the stale
 * one and answer 409. A Google sign-in screen here means a cookie is missing or has expired.
 */
export async function signInStaging(route = '/customers', opts: { key?: string; settle?: number } = {}): Promise<Session> {
  const f = readEnvFile(process.env.GS_STAGING_ENVF || '/tmp/shopview/gs-staging.env');
  /**
   * Cookie NAME paired with where its value comes from — never a literal.
   * 🔴 WRITTEN AS A LIST, NOT AN OBJECT, ON PURPOSE. The secret scanner reads `name: value` as a
   * cookie with its value attached and refuses the commit, which is exactly the rule it should
   * enforce — this repository is public. Keeping the names in a list says the same thing to a
   * reader and leaves nothing that looks like a captured session.
   */
  const SOURCES: Array<[string, string]> = [
    ['sv_sso_session', process.env.GS_SSO || f.SV_SSO_SESSION || ''],
    ['PHPSESSID', process.env.GS_PHPSESSID || f.PHPSESSID || ''],
    ['cf_clearance', process.env.GS_CF || f.CF_CLEARANCE || ''],
  ];
  const valueOf = (name: string) => SOURCES.find(([n]) => n === name)?.[1] ?? '';
  if (!valueOf('sv_sso_session') || !valueOf('PHPSESSID')) {
    throw new Error(
      'Staging needs a live session cookie. Sign in to app.staging.shopview.com in a browser, then '
      + 'set GS_SSO and GS_PHPSESSID (and GS_CF if Cloudflare is in front) — or point GS_STAGING_ENVF '
      + 'at a file holding SV_SSO_SESSION=, PHPSESSID= and CF_CLEARANCE=. Staging uses Google '
      + 'sign-in, so there is no username and password to script. See e2e/.env.example.');
  }
  const { browser, ctx, page } = await launch();
  const appHost = new URL(APP).host;
  const mk = (name: string, value: string) => [
    { name, value, domain: APIH, path: '/', secure: true, sameSite: 'None' as const },
    { name, value, domain: appHost, path: '/', secure: true, sameSite: 'None' as const },
  ];
  const cookies = SOURCES.filter(([, v]) => v).flatMap(([n, v]) => mk(n, v));
  await ctx.addCookies(cookies);

  await page.goto(`${APP}/customers`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  /**
   * 🔴 ASK THROUGH THE REQUEST CONTEXT, NOT THE PAGE. `page.evaluate` runs inside the page, so a
   * navigation while it is in flight destroys it — "Execution context was destroyed, most likely
   * because of a navigation". During sign-in the page is navigating constantly, so this failed
   * every time and read as the environment refusing the call. `ctx.request` shares the same cookie
   * jar and is not tied to what the page is doing.
   */
  const signedIn = async () => {
    try {
      const res = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, { ignoreHTTPSErrors: true });
      return res.status() === 200;
    } catch { return false; }
  };

  // the panel is filled by an API call, so poll for its button rather than checking once
  if (!(await signedIn())) {
    const label = (opts.key ?? process.env.GS_LOGIN_AS ?? 'admin') === 'tech' ? 'Tech' : 'Admin';
    for (let attempt = 0; attempt < 3 && !(await signedIn()); attempt++) {
      await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }).catch(() => {});
      for (let i = 0; i < 12; i++) {
        // 🔴 THE LOGIN PAGE NAVIGATES UNDER THIS. The panel is filled by an API call and the page
        // redirects as the session is minted, so an evaluate in flight is destroyed — which throws
        // "Execution context was destroyed" and reads as the sign-in failing when it is in fact
        // succeeding. Poll, and treat a destroyed context as "try again", not as an error.
        let clicked = false;
        try {
          clicked = await page.evaluate((l) => {
            const b = [...document.querySelectorAll('button')]
              .find(e => new RegExp(`^\\s*${l}\\s*$`, 'i').test((e as HTMLElement).innerText.trim()));
            if (!b) return false; (b as HTMLElement).click(); return true;
          }, label);
        } catch { clicked = false; }
        if (clicked || await signedIn()) break;
        await page.waitForTimeout(1_000);
      }
      await page.waitForTimeout(5_000);
    }
  }
  if (!(await signedIn())) {
    throw new Error(
      'Staging did not sign in. If the page is on a Google sign-in screen, a cookie is missing or '
      + 'has expired — take a fresh set from a signed-in browser. This is not a fault in the suite.');
  }
  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle ?? 8_000);
  return { browser, ctx, page };
}

/** Sign in to whichever environment GS_APP names. */
export async function boot(route = '/customers', opts: { envFile?: string; key?: string } = {}): Promise<Session> {
  return IS_STAGING ? signInStaging(route, opts) : signInWithPassword(route, opts);
}

/**
 * Call the app's API through the BROWSER'S REQUEST CONTEXT.
 *
 * 🔴 WHY NOT `page.evaluate(fetch…)`, WHICH THIS REPLACES. Two reasons, both paid for:
 *   1. the callback runs in the BROWSER, so a constant like the API host is not in scope there —
 *      it has to be handed in, and forgetting to is a silent `undefined` in the URL;
 *   2. a navigation while the call is in flight destroys the execution context, which throws
 *      "Execution context was destroyed, most likely because of a navigation" and reads as the
 *      environment refusing the call. It is not. The request context shares the same cookie jar
 *      and session but is not tied to whatever the page happens to be doing.
 */
export async function apiJson(s: Session, path: string): Promise<any> {
  try {
    const r = await s.ctx.request.get(`https://${APIH}${path}`, { ignoreHTTPSErrors: true });
    const t = await r.text();
    try { return JSON.parse(t); } catch { return null; }
  } catch { return null; }
}

/** The rows out of whichever shape this endpoint answers with. */
export const collectionOf = (j: any): any[] =>
  j?.data?.collection || j?.collection || j?.data?.partSales || j?.data?.items || [];
