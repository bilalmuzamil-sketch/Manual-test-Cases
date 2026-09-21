// Which searchable entity exposes a LAST-UPDATED timestamp I can actually observe?
// Without one I cannot prove the precondition of the recency tie-break (Rule 104).
import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/parts','admin');
await page.waitForTimeout(3000);
const req=(m,u,b)=>page.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return{s:r.status,t:t.slice(0,200),j}},[m,API+u,b]);
const paths=[
 ['parts','/api/inventory-parts?pagination[rowsPerPage]=5&search=ZZSORTX'],
 ['parts2','/api/parts?pagination[rowsPerPage]=5&search=ZZSORTX'],
 ['vendors','/api/vendors?pagination[rowsPerPage]=5&search=ZZVORTAC'],
 ['assets','/api/vehicles?pagination[rowsPerPage]=5&search=ZZOBSIDIAN'],
 ['workorders','/api/work-orders?pagination[rowsPerPage]=3'],
];
for (const [label,p] of paths){
  const r=await req('GET',p);
  const col=r.j?.data?.collection||r.j?.data||[];
  const first=Array.isArray(col)?col[0]:null;
  const keys=first?Object.keys(first):[];
  const dateKeys=keys.filter(k=>/updat|modif|chang|_at$|date/i.test(k));
  console.log(label+' status='+r.s+' rows='+(Array.isArray(col)?col.length:'?')+' | date-ish keys: '+JSON.stringify(dateKeys));
  if(first && dateKeys.length) console.log('              sample:', JSON.stringify(Object.fromEntries(dateKeys.map(k=>[k,first[k]]))));
}
await browser.close();
