// signed-in Chromium for 'prod' (V1) or 'qa' (V2). Secrets read from /tmp only.
const { chromium } = require('playwright');
const fs = require('fs');
const ENV = {
  prod: { app: 'https://app.shopview.com', api: 'https://api.shopview.com' },
  qa: { app: 'https://sv11315.qa.shopview.com', api: 'https://sv11315api.qa.shopview.com' },
};
async function open(env, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 }, ignoreHTTPSErrors: true, acceptDownloads: true, timezoneId: opts.tz || 'America/Edmonton' });
  const dir = `/tmp/${env}`;
  if (env === 'prod') {
    const s = JSON.parse(fs.readFileSync(`${dir}/session.json`));
    await ctx.addCookies([{ name: 'PHPSESSID', value: s.PHPSESSID, domain: '.shopview.com', path: '/', secure: true, httpOnly: true }]);
  } else {
    const c = JSON.parse(fs.readFileSync(`${dir}/cookies.json`));
    await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: '.qa.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance' })));
  }
  if (fs.existsSync(`${dir}/login-resp.json`) && fs.existsSync(`${dir}/fe-perms.json`)) {
    const login = JSON.parse(fs.readFileSync(`${dir}/login-resp.json`)); const perms = JSON.parse(fs.readFileSync(`${dir}/fe-perms.json`));
    await ctx.addInitScript(([u, p]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); } catch (e) {} }, [login.data, perms.data || perms]);
  }
  // safety: a test browser must never end the shared session
  await ctx.route(/\/(api\/)?logout(\b|\/|\?|$)/, (r) => r.abort());
  const page = await ctx.newPage();
  return { browser, ctx, page, ...ENV[env] };
}
module.exports = { open, ENV };
