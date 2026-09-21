import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const req=(m,u,b)=>page.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return{s:r.status,t:t.slice(0,180),j}},[m,API+u,b]);
const l0=await req('GET','/api/inventory/parts?pagination[rowsPerPage]=3&search=ZZT-FIB');
const binId=(l0.j?.data?.collection||[])[0]?.binLocations?.[0]?.binLocationId;
const mk=async(name,pn)=>{
  await req('POST','/api/parts-catalogue/add-catalogue-part',{name, part_number:pn, tags:['ZZAUTOTEST']});
  await page.waitForTimeout(1500);
  const l=await req('GET','/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=20&search='+encodeURIComponent(pn));
  const cp=(l.j?.data?.collection||[]).find(x=>x.part_number===pn);
  if(!cp) return null;
  const inv=await req('POST','/api/inventory/parts/create',{catalog_part_id:cp.id, category_id:cp.category||cp.category_id, quantity:0, cost:10, tags:[], min:0, max:10, sell_price:20, bins:[{id:binId,isDefault:true,quantity:0}]});
  console.log('created',pn,name,'->',inv.s);
  return inv.j?.data?.part_id;
};
// A begins with the token, B has it mid-name. Both 0 stock, same bin.
const idA=await mk('ZZPRXQ Alpha Widget','PRX-9101');
await page.waitForTimeout(1500);
const idB=await mk('Gamma ZZPRXQ Widget','PRX-9102');
await page.waitForTimeout(8000);
const show=async(lbl)=>{const r=await req('GET','/api/search?q=ZZPRXQ');
  const g=(r.j?.data?.groups||[]).find(x=>x.type==='parts');
  console.log(lbl);
  (g?.items||[]).forEach((i,n)=>console.log('   ',n+1,String(i.primary).slice(0,26).padEnd(26),'score',String(i.score).padEnd(8),(i.match?.kind||'')+'/'+i.match?.field));};
await show('--- BEFORE viewing either (both 0 stock, same bin)');
// give B the "viewed recently" credit, worth +0.10, by opening its page as this same user
if(idB){ await page.goto('https://sv9160.qa.shopview.com/parts/inventory/'+idB,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000); console.log('opened B page:',page.url().replace('https://sv9160.qa.shopview.com','')); }
await page.waitForTimeout(6000);
await show('--- AFTER opening B (B should now carry viewed-recently +0.10)');
console.log('\nPREDICTIONS');
console.log('  if a begins-with match IS credited 0.70 internally: A = 0.70+0.50+0.05 = 1.25 vs B = 0.50+0.50+0.05+0.10 = 1.15  -> A stays FIRST');
console.log('  if it is NOT credited (scored 0.50 like the label says): A = 1.05 vs B = 1.15                                  -> B moves FIRST');
await browser.close();
