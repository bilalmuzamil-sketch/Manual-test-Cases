import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';
import fs from 'node:fs';
import net from 'node:net';
import { relayWanted, startRelay } from './relay.js';
import { rememberSession } from './seedwork.js';

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
 * Where the saved sign-in lives, one file per environment so staging and production do not
 * overwrite each other. Git-ignored: it holds a live session.
 */
export function authStatePath(): string {
  if (process.env.GS_AUTH_STATE) return process.env.GS_AUTH_STATE;
  const host = new URL(APP).host.replace(/[^a-z0-9.]/gi, '_');
  return `.auth/${host}.json`;
}

/**
 * A local relay, ONLY if one is already running. Some sandboxes cannot open TLS directly and put a
 * relay in front; an ordinary machine needs none. Optional in both directions — never required.
 */
/** Is anything actually listening there? A dead proxy is worse than no proxy. */
function listening(host: string, port: number, ms = 600): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    const done = (ok: boolean) => { sock.destroy(); resolve(ok); };
    sock.setTimeout(ms);
    sock.once('connect', () => done(true));
    sock.once('timeout', () => done(false));
    sock.once('error', () => done(false));
    sock.connect(port, host);
  });
}

/**
 * An optional local proxy — never required, and never used unless it answers.
 *
 * 🔴 A PORT FILE IS NOT A RUNNING PROXY. This used to trust `/tmp/atlassian/bridge-port.txt`
 * merely because it existed. On 2 October 2026 the process behind it stopped while the file stayed
 * on disk, and from then on every run died with `ECONNREFUSED 127.0.0.1:36901` at sign-in — which
 * looks like the product being unreachable and is nothing of the sort. The file is a leftover, so
 * the port is now dialled before it is believed, and an unanswered one is ignored and announced.
 *
 * An explicit GS_PROXY is obeyed without this check: if someone names a proxy, a silent fallback to
 * a direct connection could send their traffic somewhere they deliberately routed it away from.
 */
async function proxy() {
  if (process.env.GS_PROXY) return { server: process.env.GS_PROXY };
  // Claude's cloud: Chromium cannot hold TLS through the egress proxy, so relay it (see relay.ts).
  if (relayWanted()) return { server: await startRelay() };
  const f = process.env.GS_BRIDGE_PORT_FILE || '/tmp/atlassian/bridge-port.txt';
  try {
    if (!fs.existsSync(f)) return undefined;
    const port = Number(fs.readFileSync(f, 'utf8').trim());
    if (!Number.isFinite(port) || port <= 0) return undefined;
    if (await listening('127.0.0.1', port)) return { server: `http://127.0.0.1:${port}` };
    console.log(`  (ignoring ${f}: nothing is listening on 127.0.0.1:${port})`);
  } catch { /* fall through to the standard variables */ }
  return standardProxy();
}

/**
 * The machine's own proxy setting, honoured the way curl and every other tool honour it.
 *
 * 🔴 THE BROWSER DOES NOT READ HTTPS_PROXY BY ITSELF. Measured 2 October 2026 in a cloud
 * container whose outbound traffic must go through a local proxy: `curl` reached staging and got
 * 200 from every endpoint, the sign-in succeeded, the app wrote its session — and the page stayed
 * BLANK, because Chromium fetched the app's own JavaScript and CSS directly and every request died
 * with ERR_TOO_MANY_RETRIES. Nothing about it looked like a network problem: the API calls worked,
 * the URL was right, there was simply no page.
 *
 * Without this, a nightly run in Claude's cloud would never render anything. On a laptop with no
 * proxy configured it changes nothing at all. NO_PROXY becomes the browser's bypass list.
 */
export function standardProxy() {
  const raw = process.env.HTTPS_PROXY || process.env.https_proxy
    || process.env.HTTP_PROXY || process.env.http_proxy || '';
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    // 🔴 NO_PROXY CANNOT BE HANDED TO CHROMIUM AS IT IS. Measured 2 October 2026 in Claude's cloud
    // container: proxy alone -> 200; proxy with the raw NO_PROXY as its bypass list ->
    // ERR_TOO_MANY_RETRIES on every page, i.e. exactly as broken as no proxy at all. The list holds
    // IP ranges and `::` that curl understands and Chromium reads as "bypass everything". Keep only
    // plain hosts and domain suffixes (16 of that list's 26); the ranges are private addresses this
    // suite never visits anyway.
    const bypass = (process.env.NO_PROXY || process.env.no_proxy || '').split(',')
      .map((x) => x.trim())
      .filter((x) => x && x !== '::' && /^(\*|\.)?[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(x))
      .map((x) => (x.startsWith('.') ? `*${x}` : x))
      .join(',') || undefined;
    return {
      server: `${u.protocol}//${u.host}`,
      ...(u.username ? { username: decodeURIComponent(u.username) } : {}),
      ...(u.password ? { password: decodeURIComponent(u.password) } : {}),
      ...(bypass ? { bypass } : {}),
    };
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

async function launch(opts: { viewport?: { width: number; height: number }; deviceScaleFactor?: number; storageState?: string } = {}) {
  const headed = process.env.GS_HEADED === '1';
  const browser = await chromium.launch({
    // Headless unless the run asked to watch (--headed / --debug / --ui, or GS_HEADED=1) — see
    // playwright.config.ts for why that has to be passed on by hand.
    headless: !headed,
    ...(headed && process.env.GS_SLOWMO ? { slowMo: Number(process.env.GS_SLOWMO) } : {}),
    args: ['--no-sandbox'],
    // 🔴 NO HARD-CODED BROWSER PATH. Playwright resolves the browser it installed. CHROME_BIN is
    // honoured for a sandbox that ships its own, but it is not required.
    ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
    proxy: await proxy(),
  });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    ...(opts.storageState ? { storageState: opts.storageState } : {}),
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
    log(`signed in as ${user} — shop: ${await selectWorkplace(ctx)}`);
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
/**
 * The shop the seeder fills, per environment. GS_WORKPLACE overrides. Matched by "contains", the
 * way the seeder matches it, so "Staging Heavy Duty" finds "Staging Heavy Duty - 9919".
 */
export function workplaceHint(): string {
  if (process.env.GS_WORKPLACE) return process.env.GS_WORKPLACE;
  if (IS_PROD) return 'Trucks Hill 2';
  if (IS_STAGING) return 'Staging Heavy Duty';
  return 'Heavy Duty';
}

/**
 * Sign the session into the shop the data was seeded into.
 *
 * 🔴 PARTS SEARCH IS SCOPED BY SHOP. Measured on staging 2 October 2026 with the same session,
 * same records, nothing else changed:
 *     in "Staging Lethbridge - 4310"   ZZKRYPTON -> nothing        PERTAB-7001 -> nothing
 *     in "Staging Heavy Duty - 9919"   ZZKRYPTON -> 3 parts        PERTAB-7001 -> 1 part
 * Customers, vendors and assets came back from either shop, so a run signed into the wrong one
 * looks almost healthy and reports the seeded PARTS as missing — a false "no data" that the
 * seeder's own check (which works inside the right shop) would never reproduce.
 *
 * Never falls back to "the first shop": on production the first one is a different shop from
 * the one the data lives in, and seeding or testing the wrong shop is silent and wrong.
 */
export async function selectWorkplace(ctx: BrowserContext): Promise<string> {
  const hint = workplaceHint();
  const r = await ctx.request.get(`https://${APIH}/api/staff/my-workplaces`,
    { headers: { Accept: 'application/json' }, ignoreHTTPSErrors: true });
  if (r.status() !== 200) throw new Error(`could not list workplaces (HTTP ${r.status()})`);
  const d = (await r.json())?.data;
  const list: any[] = Array.isArray(d) ? d : (d?.workplaces || d?.collection || []);
  const pick = list.find((w) => String(w?.name || '').toLowerCase().includes(hint.toLowerCase()));
  if (!pick) {
    throw new Error(`no workplace on ${APP} matches "${hint}". It has: `
      + `${list.map((w) => w?.name).join(' · ')}. Set GS_WORKPLACE to one of these.`);
  }
  const c = await ctx.request.post(`https://${APIH}/api/iam/change-location`, {
    data: { workplace_id: pick.id, workplace_timezone: pick.timezone || 'America/Edmonton' },
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, ignoreHTTPSErrors: true,
  });
  if (c.status() !== 200) throw new Error(`could not switch to "${pick.name}" (HTTP ${c.status()})`);
  return String(pick.name);
}

/** The Google session cookie, from the environment or the staging env file. Never logged. */
export function ssoCookie(): string {
  const f = readEnvFile(process.env.GS_STAGING_ENVF || '/tmp/shopview/gs-staging.env');
  return process.env.GS_SSO || f.SV_SSO_SESSION || '';
}

/**
 * UNATTENDED SIGN-IN FOR STAGING AND QA BRANCHES — one cookie, no browser window, no person.
 *
 * 🔴 THIS REVERSES WHAT THIS FILE USED TO SAY. Until 2 October 2026 the comment below
 * `signInStaging` read "there is no longer any way to script a BROWSER session from cookies
 * alone", because staging's DEV MODE quick-login PANEL had been removed and its login page goes
 * straight to Google. The panel is gone; the endpoint behind it is not. Measured that day:
 *
 *     POST /api/quick-login {"key":"admin"}   no cookies               -> 401 sso_required
 *     POST /api/quick-login {"key":"admin"}   sv_sso_session only      -> 200, Admin, 59 permissions
 *     POST /api/quick-login {"key":"admin"}   sv_sso_session + Cloudflare -> 200 (Cloudflare not needed)
 *
 * So it IS gated — a cold start cannot get in — but the gate is the Google session, and that is
 * one cookie a person copies once and stores as a secret. The answer carries the user details and
 * role, and Set-Cookie carries a fresh PHPSESSID (24 hours). Those are exactly what the production
 * sign-in uses, so the app is put into its signed-in state the same way.
 *
 * That is what makes an unattended nightly run possible at all: nothing here needs a window.
 *
 * Traps, each measured:
 *   • HOST-ONLY COOKIE. The SSO cookie is added by `url`, never by `domain`. A domain-scoped copy
 *     sits alongside the host-only one the server sets, and the next call reads the wrong one and
 *     answers 409 right after a 200 — which looks like a dead session and is not (playbook §A).
 *   • ONE QUICK-LOGIN PER RUN. Each call mints a new session for the quick-login account and ends
 *     the previous one, so two workers sharing it log each other out. The suite runs one worker.
 *   • THE KEY IS NOT THE ROLE. `tech` was an ADMINISTRATOR on a QA branch once. What the session
 *     can do is read back from fe-permissions, never assumed from the key that was pressed.
 */
export async function signInWithSso(route = '/customers', opts: { key?: string; settle?: number } = {}): Promise<Session> {
  const sso = ssoCookie();
  if (!sso) {
    throw new Error(
      `No Google session for ${APP}. Set GS_SSO to the value of the sv_sso_session cookie from a `
      + 'browser signed in to this environment (DevTools › Application › Cookies). It is the only '
      + 'secret needed; everything else is minted from it. Never commit it.');
  }
  const key = opts.key || process.env.GS_LOGIN_AS || 'admin';
  const { browser, ctx, page } = await launch();
  const log = (...a: unknown[]) => console.log(new Date().toISOString().slice(11, 19), ...a);

  // Host-only on both hosts: `url`, not `domain` (see the trap above).
  await ctx.addCookies([
    { name: 'sv_sso_session', value: sso, url: `https://${APIH}`, secure: true, sameSite: 'None' },
    { name: 'sv_sso_session', value: sso, url: APP, secure: true, sameSite: 'None' },
  ]);

  const r = await ctx.request.post(`https://${APIH}/api/quick-login`, {
    data: { key },
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ignoreHTTPSErrors: true,
  });
  let loginData: any = null;
  if (r.status() === 200) { try { loginData = (await r.json())?.data; } catch { /* non-JSON */ } }
  if (!loginData) {
    await browser.close();
    const why = r.status() === 401
      ? 'the Google session has expired or was never valid. Sign in to this environment in a '
        + 'browser and copy a fresh sv_sso_session into GS_SSO.'
      : `quick-login answered HTTP ${r.status()}.`;
    throw new Error(`Could not sign in to ${APP}: ${why}`);
  }
  log(`signed in through quick-login as "${key}" — shop: ${await selectWorkplace(ctx)}`);

  // The app's own signed-in state, in its own shape, before any page loads — the same three
  // writes the production sign-in makes (see signInWithPassword for why each one matters).
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
  const nPerms = (fep?.fe_permissions || []).length;

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
  // 🔴 ONE COOKIE IS ENOUGH NOW. This older route needed a session id copied by hand as well, so
  // under the unattended setup (GS_SSO alone) it threw and C146306 failed on a sign-in message
  // (2026-10-02). With the sign-in cookie present and no session id, use the route every other
  // test uses: it mints the session itself, with the key asked for.
  if (valueOf('sv_sso_session') && !valueOf('PHPSESSID')) return signInWithSso(route, opts);
  if (!valueOf('sv_sso_session') || !valueOf('PHPSESSID')) {
    throw new Error(
      'Staging needs a live session cookie. Sign in to app.staging.shopview.com in a browser, then '
      + 'set GS_SSO and GS_PHPSESSID (and GS_CF if Cloudflare is in front) — or point GS_STAGING_ENVF '
      + 'at a file holding SV_SSO_SESSION=, PHPSESSID= and CF_CLEARANCE=. Staging uses Google '
      + 'sign-in, so there is no username and password to script. See e2e/.env.example.');
  }
  const { browser, ctx, page } = await launch();

  /**
   * 🔴 COOKIES AUTHENTICATE THE API; THE APP'S SESSION LIVES IN localStorage.
   * Measured 2 Oct 2026 on staging: a valid cookie set answers 200 from
   * /api/auth/me/fe-permissions while the browser still bounces to /login — and staging's login
   * now goes straight to Google, with the old DEV MODE quick-login panel gone. So there is no
   * longer any way to script a BROWSER session from cookies alone.
   *
   * What the app needs is the `user` object (and usually `token`) it writes at sign-in. Copy them
   * from a signed-in browser — DevTools › Application › Local Storage — and set GS_STAGING_USER
   * and GS_STAGING_TOKEN, or put USER_JSON= and TOKEN= in the staging env file. They are read here
   * and written before any page loads, exactly as the app does it; nothing is forged, and nothing
   * is committed.
   */
  const userJson = process.env.GS_STAGING_USER || f.USER_JSON || '';
  const token = process.env.GS_STAGING_TOKEN || f.TOKEN || '';
  if (userJson) {
    let parsed: any = null;
    try { parsed = JSON.parse(userJson); } catch {
      throw new Error('GS_STAGING_USER is not valid JSON. Copy the whole value of the `user` key '
        + 'from Local Storage, exactly as it appears.');
    }
    await ctx.addInitScript(([u, t]: [any, string]) => {
      try {
        localStorage.setItem('user', JSON.stringify(u));
        if (t) localStorage.setItem('token', t);
      } catch { /* storage unavailable */ }
    }, [parsed, token] as any);
  }

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
  /**
   * 🔴 THE API ACCEPTING THE COOKIE IS NOT THE APP BEING SIGNED IN, AND CONFUSING THE TWO SKIPS THE
   * STEP THAT MATTERS. Measured 2 Oct 2026: the cookies answered 200 from
   * /api/auth/me/fe-permissions while the browser sat on /login?redirect=/customers. This check
   * therefore reported success, the DEV MODE quick-login was never clicked, and every test then
   * looked at a sign-in screen — reported as the search panel being missing.
   *
   * The app keeps its session in localStorage, which only the quick-login writes. So "signed in"
   * means BOTH: the API accepts the cookie AND the page is not sitting on the login screen.
   */
  const apiOk = async () => {
    try {
      const res = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, { ignoreHTTPSErrors: true });
      return res.status() === 200;
    } catch { return false; }
  };
  const appReady = async () => {
    if (/\/login/.test(page.url())) return false;
    const shell = await page.locator('.global-search__trigger').count().catch(() => 0);
    return shell > 0;
  };
  const signedIn = async () => (await apiOk()) && (await appReady());

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
    const where = page.url();
    throw new Error(
      `Staging did not sign in — the page is on ${where}.\n`
      + (await apiOk()
        ? 'The cookies are valid — the API accepts them — but the app itself has no session. '
          + 'Staging signs in through Google and keeps its session in localStorage, so cookies '
          + 'alone are not enough. From a signed-in browser, open DevTools › Application › Local '
          + 'Storage and copy the `user` value (and `token` if present) into GS_STAGING_USER and '
          + 'GS_STAGING_TOKEN. See .env.example.'
        : 'The cookies are not valid. If the page shows a Google sign-in screen they have expired — '
          + 'take a fresh set from a signed-in browser.')
      + '\nThis is reported rather than worked around, because a session that half-works makes '
      + 'every later result meaningless.');
  }
  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle ?? 8_000);
  return { browser, ctx, page };
}

/**
 * Reuse a session saved by `npm run login`.
 *
 * 🔴 THIS IS THE ROUTE THAT ACTUALLY WORKS WHERE SIGN-IN CANNOT BE SCRIPTED. Staging goes through
 * Google, so there is nothing to automate — but a person can sign in once, and Playwright can keep
 * the whole session, localStorage included. That is what `npm run login` saves here.
 */
export async function signInWithSavedState(route = '/customers', opts: { settle?: number } = {}): Promise<Session> {
  const file = authStatePath();
  const { browser, ctx, page } = await launch({ storageState: file });
  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle ?? 8_000);
  if (/\/login/.test(page.url())) {
    await browser.close();
    throw new Error(
      `The saved session in ${file} is no longer valid — the app sent the browser back to the `
      + 'login screen. Run `npm run login` again to sign in and save a fresh one.');
  }
  return { browser, ctx, page };
}

/**
 * Sign in to whichever environment GS_APP names.
 *
 * Order of preference, and the reason for it:
 *   1. a session saved by `npm run login` — works everywhere, including where sign-in goes through
 *      Google and cannot be scripted at all;
 *   2. a username and password, where the environment accepts one;
 *   3. pasted cookies plus the app's stored session, for a headless machine where nobody can open
 *      a browser to do step 1.
 */
export async function boot(route = '/customers', opts: { envFile?: string; key?: string } = {}): Promise<Session> {
  // Order of preference, most unattended first:
  //   1. production       username + password           (scriptable)
  //   2. anything else    the Google session cookie     (scriptable — one secret, GS_SSO)
  //   3. a saved session  from `npm run login`           (one person, once)
  //   4. pasted cookies + Local Storage                  (the old manual route, kept as a fallback)
  // A password file only means something where there are passwords. Off production the same
  // request is answered by a quick-login KEY (admin, tech) behind the Google session.
  const s = IS_PROD ? await signInWithPassword(route, opts)
    : ssoCookie() ? await signInWithSso(route, opts)
    : opts.envFile ? await signInWithPassword(route, opts)
    : fs.existsSync(authStatePath()) ? await signInWithSavedState(route)
    : IS_STAGING ? await signInStaging(route, opts) : await signInWithPassword(route, opts);
  // Hand the FULL-ACCESS session to the per-test data check (fixtures/seedwork.ts says why). The
  // lower-permission person - another quick-login key, or another password file - is never recorded.
  const fullAccess = (opts.key ?? 'admin') === 'admin' && (!opts.envFile || opts.envFile === (process.env.PROD_ENVF || '/tmp/shopview/prod-gs.env'));
  if (fullAccess) {
    const jar = await s.ctx.cookies(`https://${APIH}`).catch(() => []);
    const sid = jar.find((c) => c.name === 'PHPSESSID' && c.value && c.value !== 'deleted')?.value;
    if (sid) rememberSession(new URL(APP).host, APIH, { PHPSESSID: sid, ...(ssoCookie() ? { sv_sso_session: ssoCookie() } : {}) });
  }
  return s;
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
