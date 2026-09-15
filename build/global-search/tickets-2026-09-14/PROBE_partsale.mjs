// The part-sale blocker is fixed and a part sale now exists. Find out what it is, then run the
// checks that were waiting on one.
//
// Waiting on this: finding a part sale by its customer's name; clicking a part sale result and
// landing on the right record; whether part sales are limited to the current location; and whether a
// newly created part sale becomes findable inside the allowed time.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ID='e41ab646-b7ee-444e-bfbe-c280fda74c92';
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{
  try{ const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,120)}; }}, `https://${APIH}${p}`);
const out={at:new Date().toISOString(), id:ID};

// what IS this part sale -- its number and whose it is
for(const p of [`/api/part-sales/view/${ID}`, `/api/part-sales/${ID}`, `/api/part-sales?limit=50`]){
  const r=await api(p);
  out[p]={status:r.status};
  if(r.status===200&&r.json){
    const d=r.json.data!==undefined?r.json.data:r.json;
    const one=(d&&(d.part_sale||d.partSale))||null;
    const list=Array.isArray(d)?d:((d&&(d.collection||d.part_sales))||null);
    const hit=one||(Array.isArray(list)?(list.find(x=>x.id===ID)||list[0]):null);
    if(hit){ out.partSale=Object.fromEntries(Object.entries(hit).filter(([k,v])=>
      v===null||['string','number','boolean'].includes(typeof v)).slice(0,30)); out.foundVia=p; break; }
    out[p].shape=JSON.stringify(d).slice(0,200);
  }
}
fs.writeFileSync(`${DIR}/PROBE-PARTSALE.json`, JSON.stringify(out,null,2));
console.log(JSON.stringify({foundVia:out.foundVia, partSale:out.partSale,
  tried:Object.fromEntries(Object.entries(out).filter(([k])=>k.startsWith('/api')).map(([k,v])=>[k,v.status]))},null,1).slice(0,1400));
await browser.close();
