// Is the search index healthy after the ~2.5h outage, or still rebuilding? Queries that returned
// plenty at 11:00 today are the control. If these are now thin or empty, every zero measured now is
// about the index's state, not about the product -- and nothing may be concluded from them.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), baseline:'11:00 UTC today, same branch', controls:{}};
const { browser, page } = await boot('sv9160','/','admin');
const api=(q)=>page.evaluate(async(qq)=>{
  const r=await fetch(`https://sv9160api.qa.shopview.com/api/search?q=${encodeURIComponent(qq)}`,{credentials:'include'});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
  const count=(o)=>{let n=0; const walk=x=>{if(Array.isArray(x)) n+=x.length; else if(x&&typeof x==='object') Object.values(x).forEach(walk);}; walk(o); return n;};
  return {s:r.status, total:j?count(j):null, bytes:t.length};}, q);
// left = what it returned around 11:00 today
for(const [q,then] of [['Brake Chamber',61],['ZZAUTOTEST',10],['Bridgeport',14],['aqeel','many'],['Kestrel',3]]){
  const r=await api(q);
  R.controls[q]={then, now:r};
  L(`${q.padEnd(16)} then ~${String(then).padEnd(6)} now: HTTP ${r.s}, ${r.total} items, ${r.bytes} bytes`);
}
fs.writeFileSync(`${DIR}/GS6.json`, JSON.stringify(R,null,1));
await browser.close();
