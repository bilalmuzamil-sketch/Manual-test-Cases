// shared: a Chromium page signed in to production as the user in /tmp/prod (one login, reused)
const { chromium } = require('playwright');
const fs = require('fs');
async function open(opts = {}) {
  const login = JSON.parse(fs.readFileSync('/tmp/prod/login-resp.json'));
  const perms = JSON.parse(fs.readFileSync('/tmp/prod/fe-perms.json'));
  const jar = fs.readFileSync('/tmp/prod/cookies.txt', 'utf8').split('\n').filter((l) => l.includes('PHPSESSID'));
  const sess = jar[0].trim().split('\t').pop();
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 }, ignoreHTTPSErrors: true, acceptDownloads: true, timezoneId: opts.tz || 'Asia/Karachi' });
  await ctx.addCookies([{ name: 'PHPSESSID', value: sess, domain: '.shopview.com', path: '/', secure: true, httpOnly: true }]);
  await ctx.addInitScript(([u, p]) => {
    try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); } catch (e) {}
  }, [login.data, perms.data || perms]);
  const page = await ctx.newPage();
  return { browser, ctx, page };
}
module.exports = { open };
