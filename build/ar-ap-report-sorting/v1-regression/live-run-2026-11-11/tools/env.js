// signed-in Chromium for 'prod' (V1), 'qa' (V2 branch) or 'staging'. Secrets read from /tmp only (/tmp/<env>/).
// Never signs in, never signs out: /logout is aborted in every context (a sign-in or sign-out rotates the QA lead's SSO cookie).
const { chromium } = require('playwright');
const fs = require('fs');
const ENV = {
  prod: { app: 'https://app.shopview.com', api: 'https://api.shopview.com' },
  qa: { app: 'https://sv11315.qa.shopview.com', api: 'https://sv11315api.qa.shopview.com' },
  staging: { app: 'https://app.staging.shopview.com', api: 'https://api.staging.shopview.com' },
};
const DOMAIN = { qa: '.qa.shopview.com', staging: '.staging.shopview.com' };
// location A/B as the app itself reports them (envinfo.py writes this from GET staff/my-workplaces)
const wpFile = (env) => { try { return JSON.parse(fs.readFileSync(`${__dirname}/workplaces-${env}.json`)); } catch (e) { return {}; } };
async function open(env, opts = {}) {
  const W = wpFile(env);
  // the browser's clock runs on location A's zone (Asia/Karachi on staging, Edmonton on QA) unless told otherwise
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 }, ignoreHTTPSErrors: true, acceptDownloads: true, timezoneId: opts.tz || (W.A && W.A.timezone) || 'America/Edmonton' });
  const dir = `/tmp/${env}`;
  if (env === 'prod') {
    const s = JSON.parse(fs.readFileSync(`${dir}/session.json`));
    await ctx.addCookies([{ name: 'PHPSESSID', value: s.PHPSESSID, domain: '.shopview.com', path: '/', secure: true, httpOnly: true }]);
  } else {
    const c = JSON.parse(fs.readFileSync(`${dir}/cookies.json`));
    await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: DOMAIN[env], path: '/', secure: true, httpOnly: name !== 'cf_clearance' })));
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
  // read live per env (staging location A: Asia/Karachi, US, shop 2 - not QA's Edmonton/CA/11315)
  const live = W.A ? [W.A.id, W.A.timezone, W.A.country_code, W.A.shop_id] : null;
  const wp = opts.workplace || live || WP[env];
  await ctx.addInitScript((w) => { try { if (!localStorage.getItem('location')) { localStorage.setItem('location', JSON.stringify(w[0]));
    if (w[1]) localStorage.setItem('timezone', JSON.stringify(w[1])); if (w[2]) localStorage.setItem('country_code', JSON.stringify(w[2])); if (w[3]) localStorage.setItem('current_shop_id', JSON.stringify(w[3])); } } catch (e) {} }, wp);
  await ctx.route(/\/(api\/)?logout(\b|\/|\?|$)/, (r) => r.abort());
  const page = await ctx.newPage();
  return { browser, ctx, page, ...ENV[env] };
}
module.exports = { open, ENV };
