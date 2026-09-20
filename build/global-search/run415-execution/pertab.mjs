import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
for(const [q,tab] of [['ZZKRYPTON','parts'],['ZZMAGENTA','vendors'],['ZZOBSIDIAN','assets']]){
  for(let pass=1;pass<=2;pass++){
    const r=await get('/api/search?q='+encodeURIComponent(q));
    const g=(r?.data?.groups||[]).find(x=>x.type===tab);
    console.log('=== "'+q+'" ['+tab+'] read '+pass+'  rows:'+((g?.items||[]).length));
    (g?.items||[]).forEach((i,n)=>console.log('   ',n+1,String(i.primary).slice(0,44).padEnd(44),'score',String(i.score).padEnd(12),((i.match?.kind||'?')+' / '+(i.match?.field||'?'))));
    await page.waitForTimeout(900);
  }
}
await browser.close();
