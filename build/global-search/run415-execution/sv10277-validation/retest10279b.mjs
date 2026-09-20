import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
for(let pass=1;pass<=2;pass++){
  const r=await get('/api/search?q=ZZTABQ');
  const g=(r?.data?.groups||[]).find(x=>x.type==='parts');
  console.log('--- read '+pass);
  (g?.items||[]).forEach((i,n)=>{
    const f=i.fields||{};
    console.log('   ',n+1,String(i.primary).slice(0,38).padEnd(38),'score',String(i.score).padEnd(12),((i.match?.kind||'')+' / '+i.match?.field).padEnd(22),
      '| qty='+String(f.quantityOnHand??'-').padEnd(4),'bin='+(f.binLocation?'y':'n'),'cat='+String(f.category||'-').slice(0,16).padEnd(16),'tags='+JSON.stringify(f.tags||[]).slice(0,28));
  });
  await page.waitForTimeout(1200);
}
const l=await get('/api/inventory/parts?pagination[rowsPerPage]=10&search=ZZTABQ');
console.log('--- inventory records matching ZZTABQ');
(l?.data?.collection||[]).forEach(c=>console.log('   ',String(c.part_number).padEnd(16),'|',String(c.name).slice(0,38).padEnd(38),'| qty',String(c.quantity).padEnd(4),'| tags',JSON.stringify(c.tags||[]).padEnd(12),'| cat',c.category_name||c.category||'-'));
await browser.close();
