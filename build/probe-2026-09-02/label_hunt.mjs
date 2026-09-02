// READ-ONLY. Do the labels "Approves Work" and "Part Sales" exist on this build?
// Two sources: the permission payload the role screen is built from, and the front-end bundle,
// which is where every UI string lives. A NEGATIVE from the bundle is conclusive (the string is
// not in the build at all); a POSITIVE still needs the screen to say WHERE it appears.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});

const fe = await p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  return await r.json();
}, API+'/api/auth/me/fe-permissions');
const flat = JSON.stringify(fe);
console.log('fe-permissions size:', flat.length, 'bytes');
for (const s of ['Approves Work','Approve Work','approves_work','APPROVE','Part Sales','part_sales','PART_SALE']) {
  const n = flat.split(s).length-1;
  console.log(`  fe-permissions contains ${JSON.stringify(s)}: ${n?('YES x'+n):'no'}`);
}
// what permission-ish strings DOES it carry?
const codes = [...new Set((flat.match(/ROLE_[A-Z_:]+/g)||[]))].sort();
console.log('\npermission codes in the payload:', codes.length);
console.log(codes.filter(c=>/APPROV|PART|SALE/.test(c)).join('\n') || '  (none matching APPROV/PART/SALE)');

// the front-end bundle: every UI string is in here
const html = await p.evaluate(async u => (await fetch(u,{credentials:'include'})).text(), APP+'/');
const srcs = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
console.log('\nentry chunks:', srcs.join(' '));
let hits = {};
for (const s of srcs) {
  const url = s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/'+s);
  const js = await p.evaluate(async u => { const r=await fetch(u,{credentials:'include'}); return r.ok? await r.text() : ''; }, url);
  for (const needle of ['Approves Work','Approve Work','Approves work','Part Sales','Part sales','Parts Sales','Work order lines','View mode','Work order printed']) {
    if (js.includes(needle)) hits[needle] = (hits[needle]||0) + js.split(needle).length-1;
  }
  console.log(`  scanned ${url.split('/').pop()} (${js.length} bytes)`);
}
console.log('\nSTRINGS FOUND IN THE FRONT-END BUNDLE:');
for (const k of ['Approves Work','Approve Work','Approves work','Part Sales','Part sales','Parts Sales','Work order lines','View mode','Work order printed'])
  console.log(`  ${JSON.stringify(k).padEnd(24)} ${hits[k]?('FOUND x'+hits[k]):'not present'}`);
fs.writeFileSync('build/probe-2026-09-02/label-hunt.json', JSON.stringify({fe_codes:codes, bundle_hits:hits, chunks:srcs},null,1));
await b.close();
