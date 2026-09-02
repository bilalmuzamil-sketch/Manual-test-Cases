// One probe, four questions (Rule 78 - piggyback rather than spend four spawns).
//
// APPLYING THE 2026-09-02 LESSON. C45123's phantom label came from reading a whole <tr> with
// innerText, which glued a clock icon's text onto the event name. So EVERY read here targets the
// smallest element that owns the value, and every list is read per-item, never as one flattened blob.
//
// Q1  Does a work order with NO CUSTOMER exist?  (C45097 said the state is impossible - but the only
//     evidence was the CREATE form refusing to save. A refusing create path is not proof no such
//     record exists: an import, an API or an older schema could have made one.)
// Q2  Does a work order with NO ASSET exist?     (C45098, same reasoning)
// Q3  Does the SCREEN ever offer a "Cancelled" line status? (C45104 was called impossible from an
//     internal status enum returned by an API. An internal enum is not a screen label - that is
//     exactly the mistake C45123 punished.)
// Q4  Do the labels "Approves Work" and "Part Sales" exist? (quoted by 5 Invoice cases, never observed)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const HOST = 'https://sv9315.qa.shopview.com';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cookieHeader = fs.readFileSync('/tmp/qa-cookies/sv9315-live-session.txt', 'utf8').trim();
const out = { host: HOST, at: new Date().toISOString(), q: {} };

const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 1200 } });
await ctx.addCookies(cookieHeader.split(';').map(kv => {
  const i = kv.indexOf('='); return { name: kv.slice(0, i).trim(), value: kv.slice(i + 1).trim(),
    domain: 'sv9315.qa.shopview.com', path: '/' };
}));
const page = await ctx.newPage();
page.setDefaultTimeout(45000);

// capture the app's OWN api calls - guessed routes 404 on this project (playbook)
const seen = [];
page.on('response', async r => {
  const u = r.url();
  if (!/\/api\//.test(u)) return;
  seen.push(`${r.status()} ${r.request().method()} ${u.replace(HOST, '')}`);
});

await page.goto(`${HOST}/workorders`, { waitUntil: 'networkidle' });
out.landed = page.url().replace(HOST, '');
out.signedIn = !/login|sign-in/i.test(page.url());
out.q.pageTitleText = await page.evaluate(() => (document.querySelector('h1,h2')?.textContent || '').trim());
out.apiCallsObserved = [...new Set(seen)].slice(0, 40);

fs.mkdirSync('build/probe-2026-09-02', { recursive: true });
fs.writeFileSync('build/probe-2026-09-02/probe-step1.json', JSON.stringify(out, null, 1));
console.log('signedIn=', out.signedIn, 'landed=', out.landed);
console.log('api calls seen:'); out.apiCallsObserved.forEach(x => console.log('  ', x));
await browser.close();
