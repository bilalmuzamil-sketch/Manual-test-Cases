import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const gtxt=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const html=await gtxt(APP+'/');
const entry=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1])[0];
const js=await gtxt(APP+entry);
const show=(label,re,n=4,w=190)=>{
  const hits=[...new Set([...js.matchAll(re)].map(m=>m[0].replace(/\s+/g,' ')))].slice(0,n);
  console.log('\n'+label); hits.forEach(h=>console.log('   '+h.slice(0,w)));
};
// the block that defines the storage keys and the ie/oe helpers
show('key definitions around fe_permissions_wrapper:', /.{200}fe_permissions_wrapper.{80}/g, 1, 300);
show('the ie / oe / Te helpers:', /(?:function|const)\s*(?:ie|oe|Te)\s*[=(][^;]{0,220}/g, 8, 230);
// which storage API is used at all
for (const api of ['localStorage','sessionStorage','document.cookie','Cookies.get','useCookies','q-app'])
  console.log(`   uses ${api}: ${js.split(api).length-1} time(s)`);
await b.close();
