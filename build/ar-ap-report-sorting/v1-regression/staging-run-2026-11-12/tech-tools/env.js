// Signed-in Chromium for 'staging' (the QA lead's session, /tmp/staging) or 'staging-tech' (tech@shopview.com's own
// session, /tmp/staging-tech, made by tech_session.py with quick-login from sv_sso_session + cf_clearance only - never
// the QA lead's PHPSESSID). Secrets are read from /tmp only. /logout is aborted in every context.
// Location A as the app reports it (../../live-run-2026-11-11/tools/workplaces-staging.json): Asia/Karachi, US, shop 2.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const APP = { app: 'https://app.staging.shopview.com', api: 'https://api.staging.shopview.com' };
const ENV = { staging: APP, 'staging-tech': APP };
const W = JSON.parse(fs.readFileSync(path.join(__dirname, '../../live-run-2026-11-11/tools/workplaces-staging.json')));
async function open(env, opts = {}) {
  if (!ENV[env]) throw new Error('env must be staging or staging-tech');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 }, deviceScaleFactor: opts.dpr || 2, ignoreHTTPSErrors: true, acceptDownloads: true, timezoneId: opts.tz || W.A.timezone });
  const dir = `/tmp/${env}`;
  const c = JSON.parse(fs.readFileSync(`${dir}/cookies.json`));
  await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: '.staging.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance' })));
  if (fs.existsSync(`${dir}/login-resp.json`) && fs.existsSync(`${dir}/fe-perms.json`)) {
    const login = JSON.parse(fs.readFileSync(`${dir}/login-resp.json`)); const perms = JSON.parse(fs.readFileSync(`${dir}/fe-perms.json`));
    await ctx.addInitScript(([u, p]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); } catch (e) {} }, [login.data, perms.data || perms]);
  }
  const wp = opts.workplace || [W.A.id, W.A.timezone, W.A.country_code, W.A.shop_id];
  await ctx.addInitScript((w) => { try { if (!localStorage.getItem('location')) { localStorage.setItem('location', JSON.stringify(w[0]));
    if (w[1]) localStorage.setItem('timezone', JSON.stringify(w[1])); if (w[2]) localStorage.setItem('country_code', JSON.stringify(w[2])); if (w[3]) localStorage.setItem('current_shop_id', JSON.stringify(w[3])); } } catch (e) {} }, wp);
  await ctx.route(/\/(api\/)?logout(\b|\/|\?|$)/, (r) => r.abort());
  const page = await ctx.newPage();
  return { browser, ctx, page, ...ENV[env] };
}
module.exports = { open, ENV };
