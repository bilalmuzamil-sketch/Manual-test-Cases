import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const HOST='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1600,height:1100}});
await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
const apis=[];
p.on('response',r=>{const u=r.url(); if(/\/api\//.test(u)&&/shopview/.test(u)) apis.push(`${r.status()} ${u.replace(/https:\/\/[^/]+/,'')}`);});
await p.goto(`${HOST}/workorders`,{waitUntil:'networkidle'});
const signedIn=!/accounts\.google|\/login/.test(p.url());
console.log('signedIn =',signedIn);
console.log('url      =',p.url().replace(HOST,'').slice(0,80));
console.log('build    =',await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content||'(none)'));
console.log('api calls:'); [...new Set(apis)].slice(0,8).forEach(x=>console.log('  ',x));
if(signedIn){
  const rows=await p.evaluate(()=>{
    const t=document.querySelector('table'); if(!t) return null;
    const heads=[...t.querySelectorAll('thead th')].map(th=>(th.textContent||'').trim());
    return {heads, firstRow:[...(t.querySelector('tbody tr')?.cells||[])].map(c=>(c.textContent||'').trim())};
  });
  console.log('work order list columns:', JSON.stringify(rows?.heads));
}
await b.close();
