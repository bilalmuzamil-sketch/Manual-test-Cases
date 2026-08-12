// harness.cjs — Schedule VIU harness, 2026-08-12.
//
// TWO REPAIRS over the 2026-08-11 harness, both recorded in HARNESS-FIX.md:
//
//  (1) THE REQUEST BRIDGE NO LONGER DESTROYS EVIDENCE.  The old bridge called
//      route.abort() on any fetch exception, so a genuine network failure and a
//      request the app never sent looked identical (both produced nothing but a
//      net::ERR_FAILED in the console).  This bridge FULFILS with an explicit
//      synthetic 599 and records the URL + the exception in bridgeErrors[], so
//      "the app never asked for /api/staff" is now a provable statement rather
//      than an inference.
//
//  (2) HYDRATION IS SOURCED FROM THE BUNDLE, NOT GUESSED.  index.D4lWI4An.js
//      reads the organisation id at
//          localStorage["user"] -> .data.details.intercom_data.company.id
//      (`k.getUser()` where `Tt="user"`), and BLOCKS every request when
//          !user.data.details.default_workplace
//      is truthy-user-but-no-workplace.  The X-Location-ID header is read from
//      localStorage["location"].  Seeding those three keys is what makes
//      /administration/roles-permissions and /administration/staff render.
//
// Cookies come from /tmp/qa-cookies/sched-hdr.txt and are never
// written into the repository, nor into any evidence file (Standing Rule: the
// repo is public).  Response bodies are NOT stored; only method/status/path.
//
// Usage: node harness.cjs <tag> <path> [<script.js to run in page>]

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');

const APP = 'https://sv8685.qa.shopview.com';
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const WORKPLACE = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';   // Staging Heavy Duty - 9919
const TZ = 'America/Edmonton';
const OUT = '/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence';
const CK = fs.readFileSync('/tmp/qa-cookies/sched-hdr.txt', 'utf8').trim();
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// The user object, built to the shape the bundle actually reads.  Every value
// here was read live from the API this session, not invented.
function buildUser(fe) {
  return {
    data: {
      details: {
        email: 'admin@shopview.com',
        staff_id: 'ccbacb31-53f3-488e-9a7e-28f781761e62',
        clockable: true,
        bookkeeping_enabled: false,
        avatar_url: null,
        default_workplace: WORKPLACE,
        intercom_data: {
          roleLabel: 'Admin',
          userHash: null,
          company: {
            id: ORG,
            name: 'Staging Foothills Group Inc',
            numberOfLocations: 2,
            numberOfDepartments: 0,
            numberOfStaff: 64,
            plans: [],
            trialDate: null,
            paidUntilDate: null
          }
        }
      },
      name: 'Admin ShopView',
      email: 'admin@shopview.com',
      user_id: '0eabf741-019e-4b02-84ce-66097c140b3a',
      created_on: { date: '2026-06-14 06:41:27' }
    }
  };
}

async function makeHarness(tag) {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-web-security', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ viewport: { width: 1680, height: 1080 }, ignoreHTTPSErrors: true, userAgent: UA });
  await ctx.addCookies(CK.split('; ').map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/', secure: true };
  }));

  const apiLog = [];
  const bridgeErrors = [];      // (1) failures are now VISIBLE, not aborted into silence
  const blockedForeign = [];

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
      r.headers.forEach((v, k) => { if (!['content-encoding', 'content-length', 'transfer-encoding', 'set-cookie'].includes(k)) h[k] = v; });
      h['access-control-allow-origin'] = '*';
      if (/\/api\//.test(url)) apiLog.push({ m: req.method(), s: r.status, u: url.replace(/^https:\/\/[^/]+/, '') });
      await route.fulfill({ status: r.status, headers: h, body: buf });
    } catch (e) {
      // (1) DO NOT abort — that is what made a failure indistinguishable from a
      // request the app never made.  Record it and answer with a synthetic 599.
      bridgeErrors.push({ m: req.method(), u: url.replace(/^https:\/\/[^/]+/, '').slice(0, 200), e: String(e).slice(0, 200) });
      try {
        await route.fulfill({ status: 599, headers: { 'content-type': 'application/json' }, body: '{"bridge":"fetch threw"}' });
      } catch (_) { }
    }
  });

  const page = await ctx.newPage();
  const consoleErrs = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 200)); });

  // (2) land somewhere cheap on the app origin so localStorage is writable,
  //     then seed the three keys the bundle actually reads.
  const feRes = await fetch('https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions',
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  const feBody = await feRes.json();
  const feData = feBody && feBody.data;

  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => { });
  await page.evaluate(({ u, f, loc }) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    localStorage.setItem('location', JSON.stringify(loc));
  }, { u: buildUser(feData), f: feData, loc: WORKPLACE });

  return { browser, ctx, page, apiLog, bridgeErrors, blockedForeign, consoleErrs, feData };
}

module.exports = { makeHarness, APP, ORG, WORKPLACE, TZ, OUT, CK, UA };

if (require.main === module) {
  (async () => {
    const tag = process.argv[2] || 'probe';
    const target = APP + (process.argv[3] || '/schedule');
    const h = await makeHarness(tag);
    let err = null;
    try { await h.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 120000 }); await h.page.waitForTimeout(12000); }
    catch (e) { err = String(e).slice(0, 300); }
    const landed = h.page.url();
    const body = (await h.page.evaluate(() => document.body ? document.body.innerText.slice(0, 6000) : '').catch(() => '')) || '';
    await h.page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: false }).catch(() => { });
    fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify({
      asked_for: target, landed_on: landed, error: err,
      api_calls: h.apiLog, bridge_errors: h.bridgeErrors,
      blocked_foreign: h.blockedForeign.slice(0, 20),
      console_errors: h.consoleErrs.slice(0, 30),
      body_text: body, read_at_utc: new Date().toISOString()
    }, null, 2));
    console.log('LANDED :', landed);
    console.log('API 4xx/5xx:', JSON.stringify(h.apiLog.filter(a => a.s >= 400)));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length, JSON.stringify(h.bridgeErrors.slice(0, 5)));
    console.log('BODY   :', body.replace(/\s+/g, ' ').slice(0, 700));
    await h.browser.close();
  })();
}
