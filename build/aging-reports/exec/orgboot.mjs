// orgboot.mjs — 12 Nov 2026: sign in to sv11315 as a NAMED user with email + password (the QA lead's new empty organization for C797943 /
// C715468, account in /tmp/qa-cookies/sv11315-reportsFM.json, chmod 600, never committed). Same browser set-up as qa-branch-boot (bridge proxy,
// host-only sv_sso_session for the QA gate), but the /login form is filled instead of the DEV MODE quick-login. Used by lib.start when ORG_LOGIN=1.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg; import fs from 'fs';
export async function orgBoot(route = '/', credsFile = '/tmp/qa-cookies/sv11315-reportsFM.json') {
  const APP = 'https://sv11315.qa.shopview.com', APIH = 'sv11315api.qa.shopview.com', APPH = 'sv11315.qa.shopview.com';
  const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim(); const c = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
  const sso = /sv_sso_session=([^;\s]+)/.exec(fs.readFileSync('/tmp/qa-cookies/sv11315-sso.txt', 'utf8'))[1];
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  await ctx.addCookies([APIH, APPH].map((domain) => ({ name: 'sv_sso_session', value: sso, domain, path: '/', secure: true, sameSite: 'None' })));
  const page = await ctx.newPage(); page.setDefaultTimeout(30000);
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
  if (/sleep\.qa/.test(page.url())) { await page.locator('button:has-text("Wake Up")').first().click().catch(() => {}); for (let w = 0; w < 24 && /sleep\.qa/.test(page.url()); w++) await page.waitForTimeout(5000); await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000); }
  const email = page.locator('input[type=email], input[name=email], input[autocomplete=username]').first(); const pass = page.locator('input[type=password]').first();
  await email.fill(c.email); await pass.fill(c.password); await page.waitForTimeout(500);
  const submit = page.locator('button[type=submit]').or(page.getByRole('button', { name: /^(Sign in|Log in|Login|Sign In|Log In)$/i })).first(); await submit.click();
  for (let w = 0; w < 20; w++) { await page.waitForTimeout(1500); if (!/\/login/.test(page.url()) && await page.evaluate(() => !!localStorage.getItem('user'))) break; }
  const ok = !/\/login/.test(page.url()); if (!ok) { await page.screenshot({ path: '/tmp/orgboot-fail.png' }).catch(() => {}); throw new Error('orgBoot: still on ' + page.url().split('?')[0] + ' (picture /tmp/orgboot-fail.png)'); }
  if (route !== '/') { await page.goto(APP + route, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000); }
  return { browser, ctx, page, APP, APIH };
}
