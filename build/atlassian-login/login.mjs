// Atlassian live login for shopview.atlassian.net — SECRET-FREE SCRIPT.
// Reads credentials from /tmp at runtime; never contains or logs a secret value.
//
// Proven working 2026-08-04 (see build/ATLASSIAN-JIRA-ACCESS-METHOD.md).
//
//   /tmp/atlassian/creds.json   {"email":"...","password":"..."}   chmod 600
//   /tmp/atlassian/otp.txt      the 6-char code the QA lead relays  chmod 600
//   /tmp/atlassian/cookies.json captured session cookies (output)   chmod 600
//   /tmp/atlassian/cookies.txt  Netscape jar for curl (output)      chmod 600
//
// Run (bridge must already be listening — see bridge.mjs):
//   cd /tmp/atlassian && node .../bridge.mjs &            # writes bridge-port.txt
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
//   CHROME_BIN=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1) \
//   NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_USE_ENV_PROXY=1 \
//   setsid nohup node .../login.mjs > /tmp/atlassian/run.log 2>&1 < /dev/null &
//
// THE MFA RACE: every password submit emails a NEW code and kills all previous ones, and a
// NEWER code kills an OLDER one. This script submits the password ONCE and then HOLDS at the
// prompt polling otp.txt. NEVER start a second run to "retry" — that invalidates the code the
// QA lead is reading out.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const DIR = '/tmp/atlassian';
const OTP = `${DIR}/otp.txt`;
const creds = JSON.parse(fs.readFileSync(`${DIR}/creds.json`, 'utf8'));

// THE CODE IS SIX ALPHANUMERIC CHARACTERS, NOT SIX DIGITS. A \d{6} validator will never match.
const CODE_RX = /\b([0-9A-Za-z]{6})\b/;
const OTP_SEL = 'input[data-testid^="otp-input-index-"]';   // 6 separate maxlength=1 boxes
const POLL_MINUTES = 25;
const HOLD_MINUTES = 90;

const log = (m) => {
  const l = `[${new Date().toISOString()}] ${m}\n`;
  fs.appendFileSync(`${DIR}/status.txt`, l);
  process.stdout.write(l);
};
const shot = async (p, n) => { try { await p.screenshot({ path: `${DIR}/${n}.png` }); } catch {} };

const port = fs.readFileSync(`${DIR}/bridge-port.txt`, 'utf8').trim();
log(`start; bridge=http://127.0.0.1:${port} egress=${process.env.HTTPS_PROXY}`);

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-dev-shm-usage',
         '--ssl-version-max=tls1.2', `--proxy-server=http://127.0.0.1:${port}`],
});
const ctx = await browser.newContext({
  ignoreHTTPSErrors: true,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();
page.setDefaultTimeout(45000);

try {
  await page.goto('https://shopview.atlassian.net/browse/SV-8582', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);
  log(`landed: ${page.url().slice(0, 80)}`);

  // 1) EMAIL -> Continue.  Must WAIT for hydration: the form renders a moment after DOM ready,
  // and both #username and #password exist in the markup from the start (password hidden).
  const emailSel = 'input#username, input[name="username"], input[type="email"]';
  const haveEmail = await page.locator(emailSel).first()
    .waitFor({ state: 'visible', timeout: 60000 }).then(() => true).catch(() => false);
  if (haveEmail) {
    await page.locator(emailSel).first().fill(creds.email);
    await page.locator('button#login-submit, button:has-text("Continue"), button[type="submit"]').first().click();
    await page.waitForTimeout(8000);
    log('email submitted');
  } else {
    log('no email field — already authenticated?');
  }

  // 2) PASSWORD -> Log in.  Clear otp.txt IMMEDIATELY BEFORE submitting so a stale code cannot win.
  await page.locator('input#password, input[name="password"]').first().waitFor({ state: 'visible', timeout: 45000 });
  await page.locator('input#password, input[name="password"]').first().fill(creds.password);
  fs.writeFileSync(OTP, ''); fs.chmodSync(OTP, 0o600);
  await page.locator('button#login-submit, button[type="submit"]').first().click();
  log('PASSWORD SUBMITTED — a NEW code was just emailed; all older codes are now dead.');
  await page.waitForTimeout(8000);
  await shot(page, 'after-password');

  // 3) THE CODE. Hold here and poll. Tell the operator plainly that we are waiting.
  const boxes = page.locator(OTP_SEL);
  if (await boxes.first().isVisible({ timeout: 20000 }).catch(() => false)) {
    fs.writeFileSync(`${DIR}/AWAITING_OTP`, '1');
    log(`AWAITING CODE — write the 6 alphanumeric characters to ${OTP} (polling ${POLL_MINUTES} min)`);
    const deadline = Date.now() + POLL_MINUTES * 60000;
    let code = '';
    while (Date.now() < deadline) {
      const m = (fs.existsSync(OTP) ? fs.readFileSync(OTP, 'utf8') : '').trim().match(CODE_RX);
      if (m) { code = m[1]; break; }
      await page.waitForTimeout(2000);
    }
    try { fs.unlinkSync(`${DIR}/AWAITING_OTP`); } catch {}
    if (!code) { await shot(page, 'otp-timeout'); throw new Error('no code supplied within the poll window'); }

    // 6 separate boxes: click the first and TYPE — the widget auto-advances. Per-box fill is the fallback.
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
    const verify = page.locator('button:has-text("Verify"), button[type="submit"]').first();
    if (await verify.isVisible().catch(() => false)) await verify.click();
    else await page.keyboard.press('Enter');
    log('code submitted');
    await page.waitForTimeout(15000);
  } else {
    log('no code prompt appeared');
  }

  for (let i = 0; i < 30 && !/shopview\.atlassian\.net/.test(page.url()); i++) await page.waitForTimeout(3000);
  log(`final url: ${page.url().slice(0, 80)}`);
  await shot(page, 'final');

  // 4) Persist cookies (chmod 600) + a Netscape jar so curl can work without the browser.
  const cookies = await ctx.cookies();
  fs.writeFileSync(`${DIR}/cookies.json`, JSON.stringify(cookies, null, 1)); fs.chmodSync(`${DIR}/cookies.json`, 0o600);
  const jar = ['# Netscape HTTP Cookie File'];
  for (const c of cookies) jar.push([c.domain, c.domain.startsWith('.') ? 'TRUE' : 'FALSE', c.path,
    c.secure ? 'TRUE' : 'FALSE', Math.floor(c.expires > 0 ? c.expires : 2000000000), c.name, c.value].join('\t'));
  fs.writeFileSync(`${DIR}/cookies.txt`, jar.join('\n') + '\n'); fs.chmodSync(`${DIR}/cookies.txt`, 0o600);
  log(`cookies saved: ${cookies.length} (cloud.session.token present: ${cookies.some(c => c.name === 'cloud.session.token')})`);

  // 5) Verify. 200 = authenticated.
  const me = await page.evaluate(async () => {
    const r = await fetch('https://shopview.atlassian.net/rest/api/3/myself', { headers: { Accept: 'application/json' } });
    return { status: r.status, body: (await r.text()).slice(0, 300) };
  });
  log(`GET /rest/api/3/myself -> ${me.status} ${me.status === 200 ? 'LOGIN SUCCESS' : 'NOT AUTHENTICATED'}`);

  // 6) Hold the browser open as a fallback API channel: drop {"method","path","body"} into
  // req-<n>.json and read res-<n>.json. Usually unnecessary — jira.sh + cookies.txt is easier.
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
  log(`ERROR: ${String(e).slice(0, 600)}`);
  await shot(page, 'error');
  try { fs.writeFileSync(`${DIR}/html-dump.html`, await page.content()); } catch {}
} finally {
  try { await browser.close(); } catch {}
  log('browser closed');
}
