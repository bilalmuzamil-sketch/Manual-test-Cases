// harness.cjs — Filters runnability harness, 2026-08-12.
//
// Adapted from build/schedule/verify-final-2026-08-12/tools/harness_admin.cjs.
// EVERY estate value below was read LIVE from this branch's API this session
// (see evidence/estate-read.json), not copied from Schedule:
//   org        GET /api/organizations          -> d55bc308-...
//   workplace  GET /api/staff/my-workplaces    -> b3c8c820-... "Staging Heavy Duty - 9919"
//   user/staff GET /api/staff?limit=200        -> id 0eabf741-..., staff_id ccbacb31-...
// They happen to match Schedule's because the org is shared; that was CONFIRMED,
// not assumed.
//
// HYDRATION, sourced from the bundle (HARNESS-FIX.md):
//   localStorage["user"] -> .data.details.intercom_data.company.id   = org id
//   localStorage["user"] -> .data.details.default_workplace          = or every request is blocked
//   localStorage["location"]                                          = X-Location-ID header
//
// HONEST NOTE ON THE SEEDED WORKPLACE: admin@shopview.com's own staff record
// carries defaultWorkplace = null.  Seeding it is what makes the SPA issue any
// request at all.  Nothing this pass asserts may depend on that seed -- the
// Filters cases concern the filter bar and its chips, not any control gated on
// a user's default workplace.  Recorded because a sibling pass once let a seed
// manufacture the very condition under test.
//
// Cookies are read from /tmp/qa-cookies/filters-<who>.txt and are NEVER written
// into the repository nor into any evidence file (the repo is public).
// Response bodies are not stored; only method/status/path.
//
// Usage: node harness.cjs <tag> <path> [admin|tech]

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');

const APP = 'https://sv8785.qa.shopview.com';
const API = 'https://sv8785api.qa.shopview.com';
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const WORKPLACE = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';   // Staging Heavy Duty - 9919
const TZ = 'America/Edmonton';
const OUT = '/home/user/Manual-test-Cases/build/filters/finish2-2026-08-12/evidence';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const IDENT = {
  admin: { ck: '/tmp/qa-cookies/filters-admin.txt', email: 'admin@shopview.com',
           name: 'Admin ShopView', first: 'Admin', last: 'ShopView', role: 'Admin',
           user_id: '0eabf741-019e-4b02-84ce-66097c140b3a',
           staff_id: 'ccbacb31-53f3-488e-9a7e-28f781761e62' },
  tech:  { ck: '/tmp/qa-cookies/filters-tech.txt', email: 'bilal.muzamil+filters@shopview.com',
           name: 'Filters Tech', first: 'Filters', last: 'Tech', role: 'Technician',
           user_id: '02ea3b69-8750-4b7d-b070-a6b642c9cca7',
           staff_id: null }
};

function buildUser(fe, who) {
  const I = IDENT[who];
  return { data: { details: {
      email: I.email, staff_id: I.staff_id, clockable: true, bookkeeping_enabled: false,
      avatar_url: null, default_workplace: WORKPLACE,
      intercom_data: { roleLabel: I.role, userHash: null,
        company: { id: ORG, name: 'Staging Foothills Group Inc', numberOfLocations: 2,
                   numberOfDepartments: 0, numberOfStaff: 39, plans: [], trialDate: null, paidUntilDate: null } }
    }, name: I.name, email: I.email, user_id: I.user_id, created_on: { date: '2026-06-14 06:41:27' } } };
}

async function makeHarness(who = 'admin', viewport = { width: 1680, height: 1080 }) {
  const I = IDENT[who];
  const CK = fs.readFileSync(I.ck, 'utf8').trim();
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-web-security', '--disable-dev-shm-usage']
  });
  // SEPARATE CONTEXT PER IDENTITY -- never merged, never reused across identities.
  const ctx = await browser.newContext({ viewport, ignoreHTTPSErrors: true, userAgent: UA,
    hasTouch: viewport.width < 500, isMobile: viewport.width < 500, deviceScaleFactor: 1 });
  await ctx.addCookies(CK.split('; ').map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/', secure: true };
  }));

  const apiLog = [], bridgeErrors = [], blockedForeign = [];

  await ctx.route('**/*', async (route) => {
    const req = route.request(), url = req.url();
    if (!/qa\.shopview\.com/.test(url)) { blockedForeign.push(url.slice(0, 120)); return route.abort(); }
    try {
      const hdrs = Object.assign({}, req.headers());
      delete hdrs['host']; delete hdrs['content-length'];
      hdrs['cookie'] = CK; hdrs['user-agent'] = UA;
      const r = await fetch(url, { method: req.method(), headers: hdrs, body: req.postDataBuffer() || undefined, redirect: 'manual' });
      const buf = Buffer.from(await r.arrayBuffer());
      const h = {};
      r.headers.forEach((v, k) => { if (!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(k)) h[k] = v; });
      h['access-control-allow-origin'] = '*';
      if (/\/api\//.test(url)) apiLog.push({ m: req.method(), s: r.status, u: url.replace(/^https:\/\/[^/]+/, '') });
      await route.fulfill({ status: r.status, headers: h, body: buf });
    } catch (e) {
      // Never abort: that made a real failure and a request never sent look identical.
      bridgeErrors.push({ m: req.method(), u: url.replace(/^https:\/\/[^/]+/, '').slice(0, 200), e: String(e).slice(0, 200) });
      try { await route.fulfill({ status: 599, headers: { 'content-type': 'application/json' }, body: '{"bridge":"fetch threw"}' }); } catch (_) {}
    }
  });

  const page = await ctx.newPage();
  const consoleErrs = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 200)); });

  const feRes = await fetch(API + '/api/auth/me/fe-permissions',
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  const feBody = await feRes.json();
  const feData = feBody && feBody.data;

  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
  await page.evaluate(({ u, f, loc }) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    localStorage.setItem('location', JSON.stringify(loc));
  }, { u: buildUser(feData, who), f: feData, loc: WORKPLACE });

  return { browser, ctx, page, apiLog, bridgeErrors, blockedForeign, consoleErrs, feData, who };
}

module.exports = { makeHarness, APP, API, ORG, WORKPLACE, TZ, OUT, UA, IDENT };

if (require.main === module) {
  (async () => {
    const tag = process.argv[2] || 'probe';
    const target = APP + (process.argv[3] || '/workorders');
    const who = process.argv[4] || 'admin';
    const h = await makeHarness(who);
    let err = null;
    try { await h.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 120000 }); await h.page.waitForTimeout(11000); }
    catch (e) { err = String(e).slice(0, 300); }
    const landed = h.page.url();
    const body = (await h.page.evaluate(() => document.body ? document.body.innerText.slice(0, 6000) : '').catch(() => '')) || '';
    await h.page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: false }).catch(() => {});
    fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify({
      identity: who, asked_for: target, landed_on: landed, error: err,
      api_calls: h.apiLog, bridge_errors: h.bridgeErrors,
      blocked_foreign: h.blockedForeign.slice(0, 20),
      console_errors: h.consoleErrs.slice(0, 30),
      body_text: body, read_at_utc: new Date().toISOString()
    }, null, 2));
    console.log('IDENTITY:', who);
    console.log('LANDED  :', landed);
    console.log('API 4xx/5xx:', JSON.stringify(h.apiLog.filter(a => a.s >= 400)));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
    console.log('BODY    :', body.replace(/\s+/g, ' ').slice(0, 800));
    await h.browser.close();
  })();
}
