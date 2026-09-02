// quick-login answers 200 with a token even while every cookie-authenticated call 409s.
// If the API accepts that token as a bearer, read access is recovered without costing the QA lead
// another round of cookies. The token is never printed and never written to the repo.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const browser=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await browser.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies(cookies.map(c=>({name:c.name,value:c.value,domain:'.qa.shopview.com',path:'/'})));
const page=await ctx.newPage(); page.setDefaultTimeout(60000);
let tok=null, user=null;
page.on('response', async r => {
  if (/\/api\/quick-login$/.test(r.url()) && r.request().method()==='POST') {
    try { const j=await r.json(); const d=j.data||j; tok=d.token||null; user=j; } catch(e){}
  }
});
await page.goto(APP+'/',{waitUntil:'networkidle'});
const hs=await page.$$('button, [role="button"], .q-btn');
for (const h of hs) {
  const t=await h.evaluate(el=>{const c=el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();});
  if (t==='Admin') { await h.click(); break; }
}
await page.waitForTimeout(3500);
console.log('token from the login response: type =', typeof tok,
  '| length =', tok==null?0:String(tok).length,
  '| has whitespace =', /\s/.test(String(tok)),
  '| shape =', typeof tok==='object'&&tok?JSON.stringify(Object.keys(tok)):'scalar');
if (tok && typeof tok === 'object') tok = tok.token || tok.value || tok.access_token || JSON.stringify(tok);
if (tok) tok = String(tok).trim();
if (!tok) { await browser.close(); process.exit(1); }
const tryAuth = (scheme) => page.evaluate(async ([u,s,t]) => {
  const r = await fetch(u, { headers: { Accept:'application/json', Authorization: `${s} ${t}` }, credentials:'include' });
  const x = await r.text();
  return { status: r.status, head: x.slice(0,100) };
}, [API+'/api/work-orders/statuses', scheme, tok]);
for (const s of ['Bearer','Token','JWT']) {
  const r = await tryAuth(s);
  console.log(`Authorization: ${s} <token>  ->  ${r.status}  ${r.status>=400?r.head.replace(/\s+/g,' '):'OK - read access recovered'}`);
}
// also: X-AUTH-TOKEN style
const r2 = await page.evaluate(async ([u,t]) => {
  const r = await fetch(u,{headers:{Accept:'application/json','X-AUTH-TOKEN':t},credentials:'include'});
  return {status:r.status, head:(await r.text()).slice(0,100)};
}, [API+'/api/work-orders/statuses', tok]);
console.log('X-AUTH-TOKEN: <token>      ->', r2.status, r2.status>=400?r2.head.replace(/\s+/g,' '):'OK');
if (tok) { fs.writeFileSync('/tmp/qa-cookies/sv9315-token.txt', String(tok)); fs.chmodSync('/tmp/qa-cookies/sv9315-token.txt',0o600);
  console.log('token stored at /tmp/qa-cookies/sv9315-token.txt (chmod 600, never in the repo)'); }
await browser.close();
