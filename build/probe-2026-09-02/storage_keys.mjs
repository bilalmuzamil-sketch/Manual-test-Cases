// Which localStorage keys does the app read to consider itself signed in? Scan every chunk.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(90000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const html=await get(APP+'/');
const queue=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
const seen=new Set(); const keys=new Map(); const bases=new Set(); const ssoBits=new Set();
while (queue.length && seen.size<700) {
  const s=queue.shift();
  const url=s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/js/'+s.replace(/^\.\//,''));
  if (seen.has(url)) continue; seen.add(url);
  const js=await get(url); if(!js) continue;
  for (const m of js.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(["'`]([^"'`]{2,40})["'`]/g))
    keys.set(m[1], (keys.get(m[1])||new Set()).add(url.split('/').pop()));
  for (const m of js.matchAll(/https?:\/\/[a-z0-9.-]*shopview[a-z0-9.\/-]*/gi)) bases.add(m[0]);
  for (const m of js.matchAll(/.{40}sso\/check.{40}/g)) ssoBits.add(m[0].replace(/\s+/g,' '));
  for (const m of js.matchAll(/["'`](?:\.\/|\/js\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9_-]{6,10}\.js)["'`]/g)) {
    const u2=APP+'/js/'+m[1]; if(!seen.has(u2)) queue.push('/js/'+m[1]);
  }
}
console.log('chunks scanned:', seen.size);
console.log('\nlocalStorage keys the app reads/writes:');
for (const [k,v] of [...keys].sort()) console.log(`  ${JSON.stringify(k).padEnd(26)} in ${[...v].slice(0,2).join(', ')}`);
console.log('\nhard-coded shopview URLs in the bundle:'); [...bases].slice(0,8).forEach(x=>console.log('  '+x));
console.log('\nhow sso/check is called:'); [...ssoBits].slice(0,4).forEach(x=>console.log('  …'+x+'…'));
fs.writeFileSync('build/probe-2026-09-02/storage-keys.json', JSON.stringify({scanned:seen.size, keys:Object.fromEntries([...keys].map(([k,v])=>[k,[...v]])), bases:[...bases], ssoBits:[...ssoBits]},null,1));
await b.close();
