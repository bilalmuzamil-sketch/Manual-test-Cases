import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const HOST='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1600,height:1100}});
await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${HOST}/login`,{waitUntil:'domcontentloaded'});

// what does the quick-login list offer?
const users = await p.evaluate(async () => {
  const r = await fetch('/api/quick-login/users', {headers:{Accept:'application/json'}});
  return {status:r.status, body: await r.text()};
});
console.log('quick-login/users ->', users.status, users.body.slice(0,400));

const key = process.env.KEY || 'admin';
const login = await p.evaluate(async (key) => {
  const r = await fetch('/api/quick-login', {method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body: JSON.stringify({key})});
  const t = await r.text();
  return {status:r.status, head:t.slice(0,240)};
}, key);
console.log(`quick-login {key:${key}} ->`, login.status, login.head.replace(/"token":"[^"]*"/,'"token":"<redacted>"'));

await p.goto(`${HOST}/workorders`,{waitUntil:'networkidle'});
console.log('after login, url =', p.url().replace(HOST,'').slice(0,70));
console.log('signedIn =', !/accounts\.google|\/login/.test(p.url()));
const who = await p.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>/^[A-Z][a-z]+ [A-Z]/.test((e.textContent||'').trim())&&e.children.length===0);return (document.body.innerText||'').split('\n').slice(0,12);});
console.log('top of page:', JSON.stringify(who));
await ctx.storageState({path:'/tmp/qa-cookies/sv9315-state.json'});
console.log('storage state saved to /tmp/qa-cookies/sv9315-state.json');
await b.close();
