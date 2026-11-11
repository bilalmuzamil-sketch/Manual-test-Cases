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
  // A real sign-in also stores the active workplace (services/location.ts: location, timezone, country_code,
  // current_shop_id). Without them the reports cannot tell which location is active, so document links that
  // depend on it fall back to plain text (found 11 Nov 2026 on V1R-66). opts.workplace overrides the default.
  const WP = { qa: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'America/Edmonton', 'CA', '11315'], prod: ['555206ea-2a33-4ca1-a29a-5431b0f7648c', null, null, null] };
  const wp = opts.workplace || WP[env];
  await ctx.addInitScript((w) => { try { if (!localStorage.getItem('location')) { localStorage.setItem('location', JSON.stringify(w[0]));
    if (w[1]) localStorage.setItem('timezone', JSON.stringify(w[1])); if (w[2]) localStorage.setItem('country_code', JSON.stringify(w[2])); if (w[3]) localStorage.setItem('current_shop_id', JSON.stringify(w[3])); } } catch (e) {} }, wp);
  await ctx.route(/\/(api\/)?logout(\b|\/|\?|$)/, (r) => r.abort());
  const page = await ctx.newPage();
  return { browser, ctx, page, ...ENV[env] };
}
module.exports = { open, ENV };
