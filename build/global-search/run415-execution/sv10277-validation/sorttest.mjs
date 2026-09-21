import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const req=(m,u,b)=>page.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return{s:r.status,t:t.slice(0,200),j}},[m,API+u,b]);
// does the response carry any score other than the clamped one?
const s0=await req('GET','/api/search?q=ZZVORTAC');
const it=((s0.j?.data?.groups||[]).find(g=>g.type==='parts')?.items||[])[0];
console.log('FULL SHAPE of one result item (looking for an unclamped score):');
console.log(JSON.stringify(it,null,1).slice(0,700));
// ---- the experiment: BETA gets the stock advantage, ALPHA is created LAST so it wins any recency tie
const l0=await req('GET','/api/inventory/parts?pagination[rowsPerPage]=3&search=ZZT-FIB');
const binId=(l0.j?.data?.collection||[])[0]?.binLocations?.[0]?.binLocationId;
const mk=async(name,pn,qty)=>{
  await req('POST','/api/parts-catalogue/add-catalogue-part',{name, part_number:pn, tags:['ZZAUTOTEST']});
  await page.waitForTimeout(1500);
  const l=await req('GET','/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=20&search='+encodeURIComponent(pn));
  const cp=(l.j?.data?.collection||[]).find(x=>x.part_number===pn);
  if(!cp){ console.log('no catalogue part',pn); return; }
  const inv=await req('POST','/api/inventory/parts/create',{catalog_part_id:cp.id, category_id:cp.category||cp.category_id, quantity:qty, cost:10, tags:[], min:0, max:50, sell_price:20, bins:[{id:binId,isDefault:true,quantity:qty}]});
  console.log('created',pn,name,'qty',qty,'->',inv.s);
};
// BETA first (older), WITH stock ; ALPHA second (newer), NO stock
await mk('Beta ZZSORTX Widget','SRT-9002',25);
await page.waitForTimeout(2000);
await mk('ZZSORTX Alpha Widget','SRT-9001',0);
await page.waitForTimeout(8000);
for(let p=1;p<=2;p++){
  const r=await req('GET','/api/search?q=ZZSORTX');
  const g=(r.j?.data?.groups||[]).find(x=>x.type==='parts');
  console.log('--- read '+p);
  (g?.items||[]).forEach((i,n)=>console.log('   ',n+1,String(i.primary).slice(0,34).padEnd(34),'score',String(i.score).padEnd(8),(i.match?.kind||'')+'/'+i.match?.field,'qty='+(i.fields?.quantityOnHand??'-')));
  await page.waitForTimeout(1500);
}
await browser.close();
