// Atlassian live login — SECRET-FREE SCRIPT (adapted from
// build/atlassian-login/login.mjs, proven 2026-08-04; see build/ATLASSIAN-JIRA-ACCESS-METHOD.md).
// Adds the one-word status contract requested for this pass.
//
// NEVER writes the password or the code into status.txt or any log.
//
// THE MFA RACE: every password submit emails a NEW code and kills all previous ones.
// This script submits the password ONCE and HOLDS at the prompt polling otp.txt.
// NEVER start a second run to "retry".
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const DIR = '/tmp/atlassian';
const OTP = `${DIR}/otp.txt`;
const STATUS = `${DIR}/status.txt`;

// THE CODE IS SIX ALPHANUMERIC CHARACTERS, NOT SIX DIGITS (doc correction 2026-08-04).
const CODE_RX = /\b([0-9A-Za-z]{6})\b/;
const OTP_SEL = 'input[data-testid^="otp-input-index-"]';   // 6 separate maxlength=1 boxes
const POLL_MINUTES = 15;
const HOLD_MINUTES = 90;

const st = (s) => { try { fs.writeFileSync(STATUS, s + '\n'); fs.chmodSync(STATUS, 0o600); } catch {} log(`STATUS=${s}`); };
const log = (m) => { process.stdout.write(`[${new Date().toISOString()}] ${m}\n`); };
const shot = async (p, n) => { try { await p.screenshot({ path: `${DIR}/${n}.png` }); } catch {} };
const fail = async (p, reason, n) => {
  if (p) await shot(p, n || 'error');
  st(`FAILED: ${String(reason).replace(/\s+/g, ' ').slice(0, 120)}`);
  try { fs.writeFileSync(`${DIR}/login-failed`, ''); } catch {}
};

st('STARTED');

let browser, page;
try {
  const creds = JSON.parse(fs.readFileSync(`${DIR}/creds.json`, 'utf8'));
  const port = fs.readFileSync(`${DIR}/bridge-port.txt`, 'utf8').trim();
  log(`bridge=http://127.0.0.1:${port} egress=${process.env.HTTPS_PROXY}`);

  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-dev-shm-usage',
           '--ssl-version-max=tls1.2', `--proxy-server=http://127.0.0.1:${port}`],
  });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });
  page = await ctx.newPage();
  page.setDefaultTimeout(45000);

  await page.goto('https://shopview.atlassian.net/browse/SV-8582', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);
  log(`landed: ${page.url().slice(0, 80)}`);

  // 1) EMAIL -> Continue. Must WAIT for hydration: #username and #password both exist from the
  // start (password merely hidden), so an instantaneous isVisible() probe lies.
  const emailSel = 'input#username, input[name="username"], input[type="email"]';
  const haveEmail = await page.locator(emailSel).first()
    .waitFor({ state: 'visible', timeout: 60000 }).then(() => true).catch(() => false);
  if (haveEmail) {
    await page.locator(emailSel).first().fill(creds.email);
    await page.locator('button#login-submit, button:has-text("Continue"), button[type="submit"]').first().click();
    await page.waitForTimeout(8000);
    st('EMAIL-ENTERED');
  } else {
    log('no email field — already authenticated?');
    st('EMAIL-ENTERED');
  }

  // 2) PASSWORD -> Log in. Clear otp.txt IMMEDIATELY BEFORE submit so a stale code cannot win.
  const pwSel = 'input#password, input[name="password"]';
  const havePw = await page.locator(pwSel).first()
    .waitFor({ state: 'visible', timeout: 45000 }).then(() => true).catch(() => false);
  if (havePw) {
    await page.locator(pwSel).first().fill(creds.password);
    fs.writeFileSync(OTP, ''); fs.chmodSync(OTP, 0o600);
    await page.locator('button#login-submit, button[type="submit"]').first().click();
    st('PASSWORD-ENTERED');
    log('password submitted — a NEW code was just emailed; all older codes are now dead.');
    await page.waitForTimeout(8000);
    await shot(page, 'after-password');
  } else {
    log('no password field — session may already be authenticated');
  }

  // 2b) THE "Security review" INTERSTITIAL (observed 2026-08-26). When the account has NO
  // two-step verification, Atlassian sends NO email code and instead parks you on
  // id.atlassian.com/login/security-screen offering "Enable two-step verification" /
  // "Continue without two-step verification" / "Create a passkey". Clicking CONTINUE only
  // DISMISSES the interstitial — it changes no account setting. Without this click the
  // browser never reaches shopview.atlassian.net and cloud.session.token is never issued.
  const skipSel = 'button:has-text("Continue without two-step verification"), '
                + 'a:has-text("Continue without two-step verification")';
  for (let i = 0; i < 3; i++) {
    const b = page.locator(skipSel).first();
    if (await b.isVisible({ timeout: 5000 }).catch(() => false)) {
      await b.click().catch(() => {});
      log('security-review interstitial dismissed (no account setting changed)');
      await page.waitForTimeout(6000);
    } else break;
  }

  // 3) THE CODE. Hold here and poll otp.txt.
  const boxes = page.locator(OTP_SEL);
  const haveOtp = await boxes.first().isVisible({ timeout: 20000 }).catch(() => false);
  if (haveOtp) {
    fs.writeFileSync(`${DIR}/AWAITING_OTP`, '1');
    st('WAITING-FOR-OTP');
    log(`awaiting the 6-character code at ${OTP} (polling ${POLL_MINUTES} min)`);
    const deadline = Date.now() + POLL_MINUTES * 60000;
    let code = '';
    while (Date.now() < deadline) {
      const m = (fs.existsSync(OTP) ? fs.readFileSync(OTP, 'utf8') : '').trim().match(CODE_RX);
      if (m) { code = m[1]; break; }
      await page.waitForTimeout(5000);
    }
    try { fs.unlinkSync(`${DIR}/AWAITING_OTP`); } catch {}
    if (!code) { await fail(page, 'no code supplied within the poll window', 'otp-timeout'); throw new Error('otp timeout'); }
    st('OTP-RECEIVED');

    // 6 separate boxes: click box 1 and TYPE — the widget auto-advances. Per-box fill is fallback.
    await boxes.nth(0).click();
    await page.keyboard.type(code, { delay: 140 });
    await page.waitForTimeout(800);
    const vals = [];
    for (let i = 0; i < 6; i++) vals.push(await boxes.nth(i).inputValue().catch(() => ''));
    log(`code entered: ${vals.map(v => (v ? 'x' : '_')).join('')}`);
    if (vals.some(v => !v)) {
      for (let i = 0; i < 6; i++) await boxes.nth(i).fill(code[i]);
      await page.waitForTimeout(500);
    }
    try { fs.unlinkSync(OTP); } catch {}
    const verify = page.locator('button:has-text("Verify"), button[type="submit"]').first();
    if (await verify.isVisible().catch(() => false)) await verify.click();
    else await page.keyboard.press('Enter');
    log('code submitted');
    await page.waitForTimeout(15000);
  } else {
    log('no code prompt appeared — password-only login');
  }

  // Second dismissal pass — the interstitial can also appear AFTER the code step.
  for (let i = 0; i < 3; i++) {
    const b = page.locator(skipSel).first();
    if (await b.isVisible({ timeout: 5000 }).catch(() => false)) {
      await b.click().catch(() => {});
      log('security-review interstitial dismissed (post-code)');
      await page.waitForTimeout(6000);
    } else break;
  }

  for (let i = 0; i < 20 && !/shopview\.atlassian\.net/.test(page.url()); i++) await page.waitForTimeout(3000);
  // MUST be on the shopview.atlassian.net ORIGIN before capturing cookies or calling the API:
  // a fetch issued from id.atlassian.com is cross-origin and dies with "Failed to fetch".
  if (!/shopview\.atlassian\.net/.test(page.url())) {
    log('not on shopview origin yet — navigating explicitly');
    await page.goto('https://shopview.atlassian.net/jira/your-work', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(8000);
  }
  log(`final url: ${page.url().slice(0, 80)}`);
  await shot(page, 'final');

  // 4) Persist cookies (chmod 600) + a Netscape jar so curl works without the browser.
  const cookies = await ctx.cookies();
  fs.writeFileSync(`${DIR}/cookies.json`, JSON.stringify(cookies, null, 1)); fs.chmodSync(`${DIR}/cookies.json`, 0o600);
  const jar = ['# Netscape HTTP Cookie File'];
  for (const c of cookies) jar.push([c.domain, c.domain.startsWith('.') ? 'TRUE' : 'FALSE', c.path,
    c.secure ? 'TRUE' : 'FALSE', Math.floor(c.expires > 0 ? c.expires : 2000000000), c.name, c.value].join('\t'));
  fs.writeFileSync(`${DIR}/cookies.txt`, jar.join('\n') + '\n'); fs.chmodSync(`${DIR}/cookies.txt`, 0o600);
  log(`cookies saved: ${cookies.length} (cloud.session.token present: ${cookies.some(c => c.name === 'cloud.session.token')})`);

  // 5) Verify from the RIGHT ORIGIN: Jira myself + a REAL Confluence page via the API.
  // Bodies go to FILES, never to a console/context.
  const probe = await page.evaluate(async () => {
    const out = {};
    for (const [k, u] of [['myself', '/rest/api/3/myself'],
                          ['confluence', '/wiki/api/v2/pages/572030978?body-format=storage']]) {
      try {
        const r = await fetch('https://shopview.atlassian.net' + u, { headers: { Accept: 'application/json' } });
        out[k] = { status: r.status, body: await r.text() };
      } catch (e) { out[k] = { status: -1, body: String(e).slice(0, 200) }; }
    }
    return out;
  });
  log(`GET /rest/api/3/myself -> ${probe.myself.status}`);
  log(`GET /wiki/api/v2/pages/572030978 -> ${probe.confluence.status} (${probe.confluence.body.length} bytes)`);
  fs.writeFileSync(`${DIR}/verify-confluence.json`, probe.confluence.body);
  fs.chmodSync(`${DIR}/verify-confluence.json`, 0o600);
  if (probe.myself.status !== 200 || probe.confluence.status !== 200) {
    await fail(page, `verify: myself=${probe.myself.status} confluence=${probe.confluence.status}`, 'verify-failed');
  } else {
    st('DONE');
    fs.writeFileSync(`${DIR}/login-done`, '');
  }

  // 6) Hold the browser open as a fallback API channel: drop {"method","path","body"} into
  // req-<n>.json and read res-<n>.json.
  fs.writeFileSync(`${DIR}/READY`, '1');
  const end = Date.now() + HOLD_MINUTES * 60000;
  while (Date.now() < end && !fs.existsSync(`${DIR}/STOP`)) {
    for (const f of fs.readdirSync(DIR).filter(f => /^req-\d+\.json$/.test(f)).sort()) {
      const n = f.match(/\d+/)[0];
      let req; try { req = JSON.parse(fs.readFileSync(`${DIR}/${f}`, 'utf8')); } catch { fs.unlinkSync(`${DIR}/${f}`); continue; }
      let out;
      try {
        out = await page.evaluate(async (r) => {
          const o = { method: r.method || 'GET', headers: { Accept: 'application/json', ...(r.headers || {}) } };
          if (r.body != null) { o.body = typeof r.body === 'string' ? r.body : JSON.stringify(r.body); o.headers['Content-Type'] ||= 'application/json'; }
          const resp = await fetch('https://shopview.atlassian.net' + r.path, o);
          return { status: resp.status, body: await resp.text() };
        }, req);
      } catch (e) { out = { status: -1, body: String(e).slice(0, 400) }; }
      fs.writeFileSync(`${DIR}/res-${n}.json`, JSON.stringify(out));
      fs.unlinkSync(`${DIR}/${f}`);
      log(`req ${n} ${req.method || 'GET'} ${req.path} -> ${out.status}`);
    }
    await page.waitForTimeout(1500);
  }
} catch (e) {
  const msg = String(e && e.message ? e.message : e).slice(0, 200);
  log(`ERROR: ${msg}`);
  if (!fs.existsSync(`${DIR}/login-done`) && !fs.existsSync(`${DIR}/login-failed`)) await fail(page, msg, 'error');
  try { if (page) fs.writeFileSync(`${DIR}/html-dump.html`, await page.content()); } catch {}
} finally {
  try { if (browser) await browser.close(); } catch {}
  log('browser closed');
  // Never exit silently without a status.
  try {
    const cur = fs.existsSync(STATUS) ? fs.readFileSync(STATUS, 'utf8').trim() : '';
    if (!cur) st('FAILED: exited with no status');
  } catch {}
}
