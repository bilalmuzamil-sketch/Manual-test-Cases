// staging-boot.mjs — sign a headless browser into app.staging.shopview.com with the EMAIL + PASSWORD
// form on the login card, and return a hydrated SPA page.
//
// WHY THIS EXISTS. build/BLOCKED-shopview-app-session.md records staging as 🔴 BLOCKED with the cause
// stated exactly: "No valid sv_sso_session is held; stored cookies 401." Every recorded staging login
// in this repo hand-mints a session (POST /api/quick-login under three cookies, then hand-written
// localStorage) - which needs a session you already have, so it cannot bootstrap. The playbook records
// that the staging login card carries a normal email + password form ABOVE the DEV MODE panel
// (§A, QA lead's screenshot 2026-09-02), and that form needs no prior session at all. The QA lead
// supplied credentials on 2026-09-03, so this is the bootstrap that was missing.
//
// SECRETS: read from /tmp/shopview/staging.env (chmod 600, outside the repo). NEVER printed, never
// written to a log or a screenshot path, never committed - the repo is PUBLIC (Rule 82).
//
// Shape deliberately mirrors qa-branch-boot.mjs so callers are interchangeable: boot() returns
// { browser, page, APP, APIH, templateSlug, nFePerms }.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const APP  = process.env.SV_APP  || 'https://app.staging.shopview.com';
const APIH = process.env.SV_APIH || 'api.staging.shopview.com';
const ENVF = process.env.SV_ENVF || '/tmp/shopview/staging.env';

function creds() {
  if (!fs.existsSync(ENVF))
    throw new Error(`no credentials at ${ENVF} - write SV_USER/SV_PASS there at chmod 600. Never inline them.`);
  const d = {};
  for (const l of fs.readFileSync(ENVF, 'utf8').split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(l.trim()); if (m) d[m[1]] = m[2];
  }
  if (!d.SV_USER || !d.SV_PASS) throw new Error(`${ENVF} is missing SV_USER or SV_PASS`);
  return d;
}

export async function boot(route = '/', opts = {}) {
  const { SV_USER, SV_PASS } = creds();
  const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
    proxy: { server: `http://127.0.0.1:${port}` },
  });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 1000 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(opts.timeout || 90000);
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const version = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content || null);
  log('staging login page loaded; app-version =', version);

  // The email/password inputs, located by TYPE rather than by a guessed name attribute.
  const email = page.locator('input[type="email"], input[autocomplete="username"]').first();
  const pass  = page.locator('input[type="password"]').first();
  if (!(await email.count()) || !(await pass.count()))
    throw new Error('no email/password form on the staging login card - re-read playbook §A before improvising');
  await email.click(); await email.fill(SV_USER);
  await pass.click();  await pass.fill(SV_PASS);          // value never logged
  // the submit control: a button inside the same card, matched by its own text
  const submit = page.locator('button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Login"), button[type="submit"]').first();
  await submit.click({ timeout: 30000 });

  // wait for the SPA to leave /login, or for an error message to appear
  let landed = null;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    const u = page.url();
    if (!/\/login/.test(u)) { landed = u; break; }
    const err = await page.evaluate(() => {
      const t = (document.body.innerText || '');
      const m = t.match(/(invalid|incorrect|not found|failed|error)[^\n]{0,90}/i);
      return m ? m[0] : null;
    });
    if (err && i > 3) throw new Error(`staging login refused: ${err}`);
  }
  if (!landed) throw new Error(`still on ${page.url()} after the submit - login did not complete`);
  log('landed', landed);

  if (route && route !== '/') {
    await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(9000);
  }
  // identity read the recorded way: template_slug + permission count, NEVER role.name
  const who = await page.evaluate(() => {
    let w = null; try { w = JSON.parse(localStorage.getItem('fe_permissions_wrapper') || 'null'); } catch {}
    const perms = w?.fe_permissions || w?.data?.fe_permissions || [];
    let user = null; try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}
    return { templateSlug: w?.template_slug || w?.data?.template_slug || null,
             nFePerms: Array.isArray(perms) ? perms.length : null,
             roleNameUNRELIABLE: user?.data?.role?.name || user?.role?.name || null };
  });
  log(`identity: template_slug=${who.templateSlug} fe_permissions=${who.nFePerms} (role.name is unreliable: ${who.roleNameUNRELIABLE})`);
  return { browser, page, ctx, APP, APIH, version, ...who };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, page } = await boot(process.argv[2] || '/');
  console.log('final url:', page.url());
  await browser.close();
}
