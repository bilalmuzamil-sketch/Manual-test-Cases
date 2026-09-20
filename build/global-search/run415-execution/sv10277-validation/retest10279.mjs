import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
for(let pass=1;pass<=3;pass++){
  const r=await get('/api/search?q=ZZTABQ');
  const g=(r?.data?.groups||[]).find(x=>x.type==='parts');
  console.log('--- read '+pass+'  (Parts)');
  (g?.items||[]).forEach((i,n)=>{
    const f=i.fields||{};
    console.log('   ',n+1,String(i.primary).slice(0,40).padEnd(40),'score',String(i.score).padEnd(12),(i.match?.kind||'')+' / '+i.match?.field,
      '| qty='+(f.quantityOnHand??'-'),'bin='+(f.binLocation?'y':'n'),'tags='+JSON.stringify(f.tags||[]).slice(0,40),'pn='+(f.partNumber||'-'));
  });
  await page.waitForTimeout(1200);
}
// the inventory record behind each, to see what changed
const l=await get('/api/inventory/parts?pagination[rowsPerPage]=10&search=ZZTABQ');
console.log('--- inventory records matching ZZTABQ');
(l?.data?.collection||[]).forEach(c=>console.log('   ',c.part_number,'|',c.name,'| qty',c.quantity,'| tags',JSON.stringify(c.tags||[])));
await browser.close();
