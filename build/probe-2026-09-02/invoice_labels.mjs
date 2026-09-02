// Confirm the Invoice UI Refresh suite's quoted labels against the build's own front-end chunks.
// CONTROLS are scanned alongside: if a control misses, the run's negatives are worthless.
// A POSITIVE confirms the string is in the build. A NEGATIVE proves nothing (measured 2026-09-02:
// "View mode" and "Tech view" are on the role screen per screenshot yet absent from a 400-chunk scan).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const CONTROLS=['Work order lines','Create & Edit','Approves Work','Part Sales','View mode','Tech view'];
const TARGETS=['Estimate / Invoice','Invoice #','Print credit memo','Open only','Show declined work',
  'Remit Payment To','Summarize labor total','Summarize parts total','Show % on Estimates and Invoices',
  'New Payment','Add Deposit','Issue Credit','Send Email','Invoice created','Invoice downloaded',
  'Invoice emailed','GST#','CM-'];
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(90000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const html=await get(APP+'/');
const queue=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
const seen=new Set(), hits={};
const CAP=Number(process.env.CAP||1200);
while (queue.length && seen.size<CAP) {
  const s=queue.shift();
  const url=s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/js/'+s.replace(/^\.\//,''));
  if (seen.has(url)) continue; seen.add(url);
  const js=await get(url); if(!js) continue;
  for (const n of [...CONTROLS,...TARGETS]) if (js.includes(n)) (hits[n]=hits[n]||[]).push(url.split('/').pop());
  for (const m of js.matchAll(/["'`](?:\.\/|\/js\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9_-]{6,10}\.js)["'`]/g)) {
    const u2=APP+'/js/'+m[1]; if(!seen.has(u2)) queue.push('/js/'+m[1]);
  }
}
console.log('chunks scanned:', seen.size, '| queue left:', queue.length);
console.log('\nCONTROLS:');
for (const c of CONTROLS) console.log(`  ${JSON.stringify(c).padEnd(24)} ${hits[c]?'FOUND: '+hits[c].slice(0,2).join(','):'NOT FOUND'}`);
console.log('\nINVOICE SUITE LABELS:');
for (const t of TARGETS) console.log(`  ${JSON.stringify(t).padEnd(38)} ${hits[t]?'FOUND: '+hits[t].slice(0,2).join(','):'not found'}`);
fs.writeFileSync('build/probe-2026-09-02/invoice-label-scan.json', JSON.stringify({scanned:seen.size, hits},null,1));
await b.close();
