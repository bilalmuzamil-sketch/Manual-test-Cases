// prod-login-boot.mjs — PRODUCTION access the recorded way: POST /api/login, then hydrate the SPA
// from the LOGIN RESPONSE. Playbook §K "PRODUCTION access & fix-verification", proven 2026-07-29,
// bridge correction 2026-09-03.
//
// 🛑 THE DISTINCTION THAT MATTERS (2026-09-03 correction to my own earlier mistake):
//   - The session blob is SERVER-MINTED. localStorage.user = { data: <login-response data> } and
//     fe_permissions_wrapper come straight from POST /api/login's own reply - role, permissions and
//     token are the SERVER's, not reconstructed and not pasted. That satisfies Rules 12 and 26.
//   - I previously hand-forged { token:'', role:{...} } from read endpoints. That is exactly what
//     NOT to do, and it is why prod-boot.mjs takes opts.session instead of guessing.
//
// 🛑 LOG IN ONCE PER RUN. A fresh login for the same user EXPIRES the prior PHPSESSID (old -> 409).
//   So this uses the SECOND account bilal.muzamil+mainadmin@shopview.com (PROD-VS-STAGING §1), never
//   the QA lead's own, and reuses the one session for API + browser + cleanup.
//
// PHPSESSID only - no SSO cookie on prod; quick-login 500s on prod, do not try it.
// Credentials: /tmp/shopview/prod-login.env (chmod 600, outside the repo, never printed/committed).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://app.shopview.com', APIH='api.shopview.com';
const ENVF=process.env.PROD_ENVF || '/tmp/shopview/prod-login.env';

function creds() {
  const d={}; for (const l of fs.readFileSync(ENVF,'utf8').split('\n')) { const m=/^([A-Z_]+)=(.*)$/.exec(l.trim()); if(m) d[m[1]]=m[2]; }
  if (!d.SV_USER || !d.SV_PASS) throw new Error(`${ENVF} missing SV_USER/SV_PASS`);
  return d;
}

export async function bootProdLogin(route='/', opts={}) {
  const { SV_USER, SV_PASS } = creds();
  const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();  // rotates - never hard-code
  const browser = await chromium.launch({ args:['--no-sandbox'],
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
    proxy: { server: `http://127.0.0.1:${port}` } });
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport: opts.viewport || {width:1680,height:1050} });
  const log = (...a) => console.log(new Date().toISOString().slice(11,19), ...a);

  // 1) LOGIN ONCE via the browser's request context (shares the cookie jar, honours the bridge)
  const r = await ctx.request.post(`https://${APIH}/api/login`,
    { data: { username: SV_USER, password: SV_PASS }, headers: { 'Content-Type':'application/json', Accept:'application/json' }, ignoreHTTPSErrors:true });
  const rbody = await r.text();
  let loginData = r.status()===200 ? JSON.parse(rbody)?.data : null;

  const page = await ctx.newPage(); page.setDefaultTimeout(opts.timeout || 90000);

  if (!loginData) {
    // API login rejected (both accounts 401 at HEAD despite the working UI form) - DRIVE THE FORM.
    // The real form carries the Origin/Referer/CSRF the bare API call lacks, and the APP writes its own
    // localStorage on success: server-minted, nothing forged.
    log(`POST /api/login -> ${r.status()}; driving the login form instead`);
    await page.goto(`${APP}/login`, { waitUntil:'domcontentloaded' }); await page.waitForTimeout(6000);
    await page.locator('input[type=email], input[autocomplete=username]').first().fill(SV_USER);
    await page.locator('input[type=password]').first().fill(SV_PASS);      // never logged
    await page.locator('button:has-text("Login"), button:has-text("Sign in"), button[type=submit]').first().click();
    let ok=false;
    for (let i=0;i<20;i++){ await page.waitForTimeout(2000); if (!/\/login/.test(page.url())) { ok=true; break; }
      const err = await page.evaluate(()=>{ const t=document.body.innerText||''; const m=t.match(/(invalid|incorrect|failed)[^\n]{0,60}/i); return m?m[0]:null; });
      if (err && i>3) { await browser.close(); throw new Error(`form login refused: ${err}`); } }
    if (!ok) { await browser.close(); throw new Error(`form login did not leave /login (still ${page.url()})`); }
    log('form login succeeded; app wrote its own session');
  } else {
    log('logged in as', SV_USER, '- PHPSESSID minted by POST /api/login');
    const fe = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true });
    const fep = fe.status()===200 ? (await fe.json())?.data : null;
    await ctx.addInitScript(([user, fep]) => { try {
      localStorage.setItem('user', JSON.stringify({ data: user }));
      if (fep) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fep));
      if (user?.token) localStorage.setItem('token', user.token);
    } catch(e){} }, [loginData, fep]);
  }
  const feNow = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true });
  const nFePerms = feNow.status()===200 ? ((await feNow.json())?.data?.fe_permissions || []).length : 0;

  await page.goto(`${APP}${route}`, { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(opts.settle || 12000);
  const version = await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content || null);
  log(`prod ${page.url()} | app-version=${version} | fe_permissions=${nFePerms}`);
  if (/\/login/.test(page.url())) log('⚠ still on /login after hydration - investigate before asserting');
  return { browser, page, ctx, APP, APIH, version, nFePerms };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, page } = await bootProdLogin(process.argv[2] || '/reports');
  console.log('final url:', page.url());
  await browser.close();
}
