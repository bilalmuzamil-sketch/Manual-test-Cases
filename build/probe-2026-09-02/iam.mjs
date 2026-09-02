import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status, keys:j&&typeof j==='object'?Object.keys(j):null, sample:JSON.stringify(j).slice(0,240), head:t.slice(0,140)};
}, path);
console.log('--- the iam namespace');
for (const path of ['/api/iam/me','/api/iam/user','/api/iam/users/me','/api/iam/profile',
                    '/api/iam/current-user','/api/iam/whoami','/api/iam/session','/api/iam']) {
  const r = await get(API+path);
  console.log(`${path.padEnd(30)} ${r.status} ${r.status===200?r.sample:(r.head.replace(/\s+/g,' ').slice(0,90))}`);
}
// and find the fetch that fills the user store
const gtxt=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const html=await gtxt(APP+'/');
const entry=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1])[0];
const js=await gtxt(APP+entry);
console.log('\n--- how the user store is filled (entry chunk)');
for (const re of [/.{60}getUser.{60}/g, /.{50}setUser.{70}/g, /["'`]\/api\/[a-z0-9/_-]*(?:me|user|profile|iam)[a-z0-9/_-]*["'`]/gi]) {
  [...new Set([...js.matchAll(re)].map(m=>m[0].replace(/\s+/g,' ')))].slice(0,6)
    .forEach(h=>console.log('   …'+h.slice(0,150)+'…'));
}
await b.close();
