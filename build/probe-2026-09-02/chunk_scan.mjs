// READ-ONLY. Scan EVERY front-end chunk, not just the entry one.
// WHY: the entry chunk (178 KB) did not contain "Work order lines" or "View mode", which the QA
// lead's screenshots prove are on the role screen. The app is code-split, so a negative from one
// chunk is worthless. Control strings are scanned alongside the unknowns: if the controls are not
// found, the method has failed and no negative may be reported.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(90000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const fetchText = u => p.evaluate(async x => { const r=await fetch(x,{credentials:'include'}); return r.ok? await r.text():''; }, u);

const CONTROLS = ['Work order lines','View mode','Tech view','Create & Edit'];
const UNKNOWNS = ['Approves Work','Approve Work','Approves work','approves work','Part Sales','Approve work'];
const html = await fetchText(APP+'/');
const entry = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
const queue=[...entry], seen=new Set(), hits={};
while (queue.length && seen.size < 400) {
  const s = queue.shift();
  const url = s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/js/'+s.replace(/^\.\//,''));
  if (seen.has(url)) continue; seen.add(url);
  const js = await fetchText(url);
  if (!js) continue;
  for (const n of [...CONTROLS, ...UNKNOWNS])
    if (js.includes(n)) (hits[n] = hits[n]||[]).push(url.split('/').pop());
  // discover sibling chunks referenced by name inside this one
  for (const m of js.matchAll(/["'`](?:\.\/|\/js\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9_-]{6,10}\.js)["'`]/g))
    if (!seen.has(APP+'/js/'+m[1])) queue.push('/js/'+m[1]);
}
console.log('chunks scanned:', seen.size);
console.log('\nCONTROLS (known to exist from the screenshots) — if these miss, the method failed:');
for (const c of CONTROLS) console.log(`  ${JSON.stringify(c).padEnd(22)} ${hits[c]?'FOUND in '+hits[c].length+' chunk(s): '+hits[c].slice(0,3):'NOT FOUND'}`);
console.log('\nUNKNOWNS:');
for (const u of UNKNOWNS) console.log(`  ${JSON.stringify(u).padEnd(22)} ${hits[u]?'FOUND in '+hits[u].length+' chunk(s): '+hits[u].slice(0,3):'not found'}`);
fs.writeFileSync('build/probe-2026-09-02/chunk-scan.json', JSON.stringify({scanned:seen.size, hits},null,1));
await b.close();
