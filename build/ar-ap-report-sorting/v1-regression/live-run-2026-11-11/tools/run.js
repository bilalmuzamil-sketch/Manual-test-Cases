// node run.js qa V1R-01 V1R-02 ...   -> runs the named cases through the UI and merges verdicts into run-<env>.json
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const lib = require('./lib.js');
const env = process.argv[2]; const keys = process.argv.slice(3);
const CASES = require(`./cases_${env}.js`);
const OUT = path.join(__dirname, `run-${env}.json`);
const L = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeded-qa.json')));
const marker = () => { try { return execSync(`curl -s ${env === 'qa' ? 'https://sv11315.qa.shopview.com/' : 'https://app.shopview.com/'} | grep -o 'app-version" content="[^"]*"'`).toString().split('"')[2]; } catch (e) { return 'unread'; } };
(async () => {
  const res = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : {};
  const m = marker(); console.log('marker', m);
  for (const key of keys) {
    const fn = CASES[key]; if (!fn) { console.log(key, 'no implementation'); continue; }
    const { browser, page, app } = await lib.open(env);
    const ev = []; const t0 = new Date().toISOString();
    let r;
    try { r = await fn({ page, app, L, lib, key, ev, env }); }
    catch (e) { r = { verdict: 'ERROR', observed: 'harness error: ' + e.message.split('\n')[0] }; try { ev.push(await lib.shot(page, key, 'error')); } catch (x) {} }
    await browser.close();
    if (/sso_required|401/.test(r.observed || '') && env === 'qa') console.log('POSSIBLE SESSION LOSS');
    res[key] = { ...r, evidence: [...ev, ...(r.evidence || [])], marker: m, utc_start: t0, utc_end: new Date().toISOString() };
    fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
    console.log(key, r.verdict, '-', (r.observed || '').slice(0, 300));
  }
})();
