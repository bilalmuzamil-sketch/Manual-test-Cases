// The session is already expired, so the downside here is nil and the upside is a self-serve session.
// The QA lead authorised this explicitly: "if that fails, POST /api/quick-login and read the response
// body, which is precisely where a login-minted user object comes from."
// This time the response BODY is captured (the previous run only saw the status).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const browser=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1700,height:1150}});
await ctx.addCookies(cookies.map(c=>({name:c.name,value:c.value,domain:'.qa.shopview.com',path:'/'})));
const page=await ctx.newPage(); page.setDefaultTimeout(60000);

// capture the quick-login response BODY as it happens
let qlBody=null, qlStatus=null;
page.on('response', async r => {
  if (/\/api\/quick-login$/.test(r.url()) && r.request().method()==='POST') {
    qlStatus=r.status(); try { qlBody = await r.json(); } catch(e) { qlBody = {__unparsed:true}; }
  }
});
await page.goto(APP+'/',{waitUntil:'networkidle'});
const handles=await page.$$('button, [role="button"], .q-btn');
let btn=null;
for (const h of handles) {
  const t=await h.evaluate(el=>{const c=el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();});
  if (t==='Admin') { btn=h; break; }
}
if (!btn) { console.log('no Admin quick-login button'); await browser.close(); process.exit(3); }
await btn.click();
await page.waitForLoadState('networkidle').catch(()=>{});
await page.waitForTimeout(4000);
console.log('POST /api/quick-login ->', qlStatus);
if (qlBody && !qlBody.__unparsed) {
  const d = qlBody.data || qlBody;
  console.log('  response keys:', JSON.stringify(Object.keys(qlBody)));
  console.log('  data keys    :', JSON.stringify(Object.keys(d||{})));
  if (d && d.details) console.log('  identity     :',
    [d.details.first_name, d.details.last_name].filter(Boolean).join(' '), '| role =', d.role,
    '| staff_id =', d.details.staff_id);
  if (d && d.token) console.log('  a token IS present in the body (value not printed)');
} else if (qlBody) console.log('  body was not JSON');
console.log('url now =', page.url().replace(APP,'')||'/');
console.log('signedIn =', !/\/login|accounts\.google/.test(page.url()));
console.log('localStorage:', JSON.stringify(await page.evaluate(()=>Object.keys(localStorage))));
const probe = await page.evaluate(async () => {
  const r = await fetch('https://sv9315api.qa.shopview.com/api/auth/me/fe-permissions',
    {credentials:'include',headers:{Accept:'application/json'}});
  return {status:r.status, head:(await r.text()).slice(0,120)};
});
console.log('fe-permissions after login ->', probe.status, probe.status>=400?probe.head.replace(/\s+/g,' '):'OK');
await browser.close();
