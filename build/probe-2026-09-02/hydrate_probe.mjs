// READ-ONLY against the app; seeds only the browser's own localStorage so the SPA renders.
// Recipe reused from build/testing-tools/staging-boot2.mjs (Rule 27), minus the quick-login POST:
// the QA lead's cookies already authenticate against the API host, so only hydration is needed.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1700,height:1200}});
await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status,json:j,head:t.slice(0,200)};
}, API+path);

const me = await get('/api/auth/me/fe-permissions');
console.log('fe-permissions ->', me.status, me.json?Object.keys(me.json):me.head.slice(0,120));
const usr = await get('/api/users/me') ;
console.log('users/me       ->', usr.status, usr.json?Object.keys(usr.json):usr.head.slice(0,120));

if (me.status===200) {
  await p.evaluate(f=>{ localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); }, me.json);
  if (usr.status===200) await p.evaluate(u=>{
    localStorage.setItem('user', JSON.stringify(u));
    if (u.data && u.data.token) localStorage.setItem('token', JSON.stringify(u.data.token));
  }, usr.json);
  await p.goto(`${APP}/workorders`,{waitUntil:'networkidle'});
  console.log('after hydration url =', p.url().replace(APP,'').slice(0,60),
              '| signedIn =', !/accounts\.google|\/login/.test(p.url()));
  console.log('page head:', JSON.stringify((await p.evaluate(()=>document.body.innerText)).split('\n').slice(0,10)));
}
await b.close();
