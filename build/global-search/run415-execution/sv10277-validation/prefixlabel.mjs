import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
const norm=s=>String(s||'').toLowerCase().replace(/^[^a-z0-9]+/,'');
console.log('DOES A RECORD WHOSE DISPLAYED NAME *BEGINS* WITH THE TYPED TEXT GET THE STRONGER "PREFIX" CREDIT?');
const TESTS=[['ZZTABQ','parts','controlled pair, no stock, same bin, never sold'],
             ['ZZPREFIX','customers','controlled trio, no work orders, never viewed'],
             ['ZZTOGVEN','vendors','seeded vendor'],
             ['mobile','assets','real data'],
             ['fleetwise','customers','real data'],
             ['stillwater','vendors','real data'],
             ['brake','parts','real data']];
for(const [q,type,why] of TESTS){
  const r=await get('/api/search?q='+encodeURIComponent(q));
  const g=(r?.data?.groups||[]).find(x=>x.type===type);
  const it=(g?.items||[]);
  const begins=it.filter(i=>norm(i.primary).startsWith(q.toLowerCase())).slice(0,2);
  console.log('\n"'+q+'" ['+type+']  ('+why+')');
  if(!begins.length){ console.log('   no row whose displayed name begins with it'); continue; }
  for(const i of begins) console.log('   ',String(i.primary).slice(0,40).padEnd(40),'score',String(i.score).padEnd(10),'labelled:',(i.match?.kind||'?')+' on '+i.match?.field, i.match?.kind==='prefix'?'  <- correct':'  <- NOT given the prefix credit');
}
await browser.close();
