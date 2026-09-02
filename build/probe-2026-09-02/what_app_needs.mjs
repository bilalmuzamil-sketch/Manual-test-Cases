// What does the SPA read to decide it is signed in? Ask the code, not the guesswork.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'networkidle'});

console.log('localStorage keys the app itself set:',
  JSON.stringify(await p.evaluate(()=>Object.keys(localStorage))));

const get=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const html=await get(APP+'/');
const entry=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
const js=await get(APP+entry[0]);
console.log('\nentry chunk:', entry[0], js.length, 'bytes');
const keys=[...new Set([...js.matchAll(/(?:getItem|setItem|removeItem)\(["'`]([^"'`]{2,40})["'`]/g)].map(m=>m[1]))];
console.log('storage keys referenced in the entry chunk:', JSON.stringify(keys));
// what does the auth guard look at?
for (const re of [/sso[^,;{}]{0,80}/gi, /isAuthenticated[^,;{}]{0,60}/g, /redirect_after[^,;{}]{0,60}/g]) {
  const hits=[...new Set([...js.matchAll(re)].map(m=>m[0].replace(/\s+/g,' ')))].slice(0,8);
  if (hits.length) { console.log('\npattern', re.source.slice(0,24)); hits.forEach(h=>console.log('   '+h.slice(0,140))); }
}
await b.close();
