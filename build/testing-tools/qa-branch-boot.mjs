// qa-branch-boot.mjs — open a ShopView QA branch (sv<n>.qa.shopview.com) in Chromium with the QA lead's own cookie set,
// WITHOUT quick-login (quick-login rotates the shared sv_sso_session and signs out other branches — playbook trap 5).
// SECRET-FREE: cookies come from /tmp/cln/<dir>/cookies.json ({sv_sso_session, PHPSESSID, cf_clearance}), chmod 600.
// Rule 99: pass the location's zone; it is set as browser timezoneId and as the app's localStorage 'timezone' key,
// with localStorage 'location' = the workplace id. The SPA signs itself in through SSO from the cookies.
// Usage: import { qaBoot } from './qa-branch-boot.mjs'; const { browser, page } = await qaBoot({ branch: 'sv11839', cookieFile, workplaceId, timezone })
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
export async function qaBoot({ branch, cookieFile, workplaceId, timezone, viewport = { width: 1600, height: 1000 }, deviceScaleFactor = 1, dest = '/dashboard' }) {
  const APP = `https://${branch}.qa.shopview.com`;
  const c = JSON.parse(fs.readFileSync(cookieFile, 'utf8'));
  const cookies = Object.entries(c).map(([name, value]) => ({ name, value, domain: '.qa.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance', sameSite: 'Lax' }));
  const browser = await chromium.launch({ executablePath: process.env.SV_CHROME || '/opt/pw-browsers/chromium', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor, ignoreHTTPSErrors: true, ...(timezone ? { timezoneId: timezone } : {}) });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  // The SPA treats "signed in" as localStorage user + fe_permissions_wrapper (playbook "THIS SPA AUTHENTICATES FROM localStorage").
  // Build them from the session's own profile + permissions, fetched from the page (cookies included) — no quick-login.
  const API = `https://${branch}api.qa.shopview.com/api`;
  const seeded = await page.evaluate(async ([API, w, z]) => {
    const get = async p => { const r = await fetch(API + p, { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: r.status, j: await r.json().catch(() => null) }; };
    const prof = await get('/iam/view-profile/'); const fe = await get('/auth/me/fe-permissions');
    const u = prof.j?.data?.user || {};
    const user = { data: { details: { user_id: u.id || u.user_id || null, name: `${u.first_name || ''} ${u.last_name || ''}`.trim(), email: u.email, default_workplace: w, workplace_timezone: z,
      staff_id: u.staff_id || null, created_on: null, bookkeeping_enabled: null, last_page_visited: null, avatar_url: u.avatar_url || null, roles: [], clockable: false },
      role: { id: u.role_id, system_role: fe.j?.data?.system_role, view_mode: fe.j?.data?.view_mode } } };
    localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fe.j?.data));
    if (w) localStorage.setItem('location', JSON.stringify(w)); if (z) localStorage.setItem('timezone', JSON.stringify(z));
    if (w) await fetch(API + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) });
    return [prof.s, fe.s];
  }, [API, workplaceId, timezone]);
  if (seeded[0] !== 200 || seeded[1] !== 200) console.log('QA_BOOT_SEED_FAILED', seeded);
  await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(9000);
  // the SSO round trip may overwrite localStorage; set the two keys again and reload once
  await page.evaluate(([w, z]) => { if (w) localStorage.setItem('location', JSON.stringify(w)); if (z) localStorage.setItem('timezone', JSON.stringify(z)); }, [workplaceId, timezone]);
  await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(8000);
  return { browser, ctx, page, APP };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, page } = await qaBoot({ branch: process.env.BRANCH || 'sv11839', cookieFile: process.env.COOKIES || '/tmp/cln/qa11839/cookies.json', workplaceId: process.env.WP, timezone: process.env.TZ });
  console.log('url', page.url(), 'zone', await page.evaluate(() => [Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage.getItem('timezone'), localStorage.getItem('location')]));
  console.log('header', (await page.locator('header, .q-header').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200));
  await page.screenshot({ path: process.env.SHOT || '/tmp/cln/qa11839/boot.png' });
  await browser.close();
}
