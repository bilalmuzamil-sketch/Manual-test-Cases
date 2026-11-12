// node run.js <qa|staging|prod> V1R-01 V1R-02 ...   -> runs the named cases through the UI and merges verdicts into run-<env>.json
// qa and staging run the V2 cases (cases_qa.js); prod runs cases_prod.js. Each verdict carries the build marker read
// off that environment's own app page and the UTC start/end (Rule 110: attributed, identified, dated).
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const env = process.argv[2]; const keys = process.argv.slice(3);
if (!['qa', 'staging', 'prod'].includes(env)) { console.log('usage: node run.js <qa|staging|prod> V1R-01 ...'); process.exit(2); }
process.env.RUN_ENV = env;                       // envctx.js / lib.js read it: ledger, dates, shop numbers, evidence folder
const E = require('./envctx.js');
const lib = require('./lib.js');
const CASES = require(`./cases_${env === 'prod' ? 'prod' : 'qa'}.js`);
const OUT = path.join(__dirname, `run-${env}.json`);
const L = E.L;
const APP = { qa: 'https://sv11315.qa.shopview.com/', staging: 'https://app.staging.shopview.com/', prod: 'https://app.shopview.com/' }[env];
const marker = () => { try { return execSync(`curl -s ${APP} | grep -o 'app-version" content="[^"]*"'`).toString().split('"')[2]; } catch (e) { return 'unread'; } };
(async () => {
  const res = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : {};
  const m = marker(); console.log('marker', m);
  if (env === 'staging') {
    // the cases' dates are the seed's dates: running on another calendar day (at location A) shifts every
    // "N days ago" by a day and produces false verdicts. Location A's zone (Asia/Karachi) has no DST ambiguity.
    if (E.unseeded) console.log('WARNING: no seeded-staging.json - run `python3 seed.py staging` first; record-based cases will ERROR');
    const nowA = E.WP.A ? E.localToday(E.WP.A.timezone) : null;
    if (!E.unseeded && nowA && nowA !== E.anchor.A) {
      console.log(`STOP: today at location A is ${nowA} but the seed is anchored on ${E.anchor.A}. Move seeded-staging.json aside, reseed, then run.`);
      if (!process.env.ALLOW_OTHER_DAY) process.exit(3);
    }
    console.log(`anchor A ${E.anchor.A} / B ${E.anchor.B} | shop A ${E.shop('A')} / B ${E.shop('B')} | browser zone ${E.WP.A && E.WP.A.timezone}`);
  }
  for (const key of keys) {
    const fn = CASES[key]; if (!fn) { console.log(key, 'no implementation'); continue; }
    const { browser, page, app } = await lib.open(env);
    const ev = []; const t0 = new Date().toISOString();
    let r;
    try { r = await fn({ page, app, L, lib, key, ev, env }); }
    catch (e) { r = { verdict: 'ERROR', observed: 'harness error: ' + e.message.split('\n')[0] }; try { ev.push(await lib.shot(page, key, 'error')); } catch (x) {} }
    await browser.close();
    if (/sso_required|401/.test(r.observed || '') && env !== 'prod') console.log('POSSIBLE SESSION LOSS - stop and ask for fresh cookies');
    res[key] = { ...r, evidence: [...ev, ...(r.evidence || [])], marker: m, env, utc_start: t0, utc_end: new Date().toISOString() };
    fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
    console.log(key, r.verdict, '-', (r.observed || '').slice(0, 300));
  }
})();
