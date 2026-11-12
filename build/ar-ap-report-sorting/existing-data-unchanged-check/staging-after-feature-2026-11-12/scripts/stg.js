// shared: a Chromium page signed in to STAGING with the QA lead's browser cookies, WITHOUT signing in.
// Secrets are read from /tmp/staging only (cookies.json, login-resp.json, fe-perms.json — built by hydrate.py from
// GET /api/iam/view-profile/, /api/staff/my-workplaces and /api/auth/me/fe-permissions). Logout is blocked so a test
// page can never end his session. Never call login, quick-login, logout or change-location from these scripts.
const { chromium } = require('playwright');
const fs = require('fs');
const APP = 'https://app.staging.shopview.com';
const OUT = process.env.OUT || 'out';
const stamp = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
async function open(opts = {}) {
  const c = JSON.parse(fs.readFileSync('/tmp/staging/cookies.json'));
  const login = JSON.parse(fs.readFileSync('/tmp/staging/login-resp.json'));
  const perms = JSON.parse(fs.readFileSync('/tmp/staging/fe-perms.json'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 }, ignoreHTTPSErrors: true, acceptDownloads: true, timezoneId: opts.tz || 'Asia/Karachi' });
  await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: '.staging.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance' })));
  await ctx.addInitScript(([u, p]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); } catch (e) {} }, [login.data, perms.data || perms]);
  await ctx.route(/\/(api\/)?(logout|login|quick-login)(\b|\/|\?|$)/, (r) => r.abort());
  await ctx.route(/\/api\/iam\/change-location/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on('framenavigated', (f) => { if (f === page.mainFrame() && /\/login/.test(f.url())) console.error('!! bounced to login: ' + f.url()); });
  return { browser, ctx, page };
}
function dir(sub) { const d = `${OUT}/${sub}`; fs.mkdirSync(d, { recursive: true }); return d; }
async function rows(page) { return page.evaluate(() => [...document.querySelectorAll('table tr')].map((tr) => [...tr.children].map((c) => c.innerText.trim().replace(/\s+/g, ' ')).join(' | '))); }
module.exports = { open, APP, OUT, stamp, dir, rows };
