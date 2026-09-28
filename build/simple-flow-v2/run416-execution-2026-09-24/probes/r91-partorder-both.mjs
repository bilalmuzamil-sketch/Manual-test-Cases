// C44605 Expected: "POSTing a reorder for a line on an INVOICED work order is rejected with 409".
// The reorder call is PUT /api/work-orders/lines/{lineId}/part-order {parts:[{part_request_id,part_order}]}.
// POSITIVE CONTROL FIRST (rule 104): the same call on an OPEN work order's line must succeed - if it
// does not, my instrument is broken and the invoiced result means nothing.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';      // S2-917, in progress
const INVOICED='068f9856-9d28-4500-a3dd-dd6d7aafb15a';  // S2-908, invoiced
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
const tryOne=async(wo,label)=>{
  const out=await page.evaluate(async(wo)=>{
    const g=async u=>{const r=await fetch(u,{credentials:'include'}); return {s:r.status,j:await r.json().catch(()=>null)};};
    const L=await g(`https://api.shopview.com/api/work-orders/lines/${wo}`);
    const lines=L.j?.data?.collection||[];
    const asArr=o=>Array.isArray(o)?o:(o&&typeof o==='object'?Object.values(o):[]);
    const rows=lines.map(l=>{
      const pr=[...asArr(l.parts),...asArr(l.part_requests)];
      return {id:l.line_id,name:(l.line_name||l.description||'').slice(0,40),
              status:l.status_display||l.status, woStatus:l.work_order_status, editable:l.editable,
              ids:pr.map(p=>p.id||p.part_request_id).filter(Boolean)};
    });
    const cand=rows.filter(x=>x.ids.length>=2);
    const pick=cand.filter(x=>x.editable)[0]||cand.sort((a,b)=>b.ids.length-a.ids.length)[0];
    if(!pick) return {linesRead:L.s, lineCount:lines.length, rows:rows.map(r=>r.name+' ['+r.status+'] parts:'+r.ids.length+' editable:'+r.editable), pick:null};
    // reverse the order - a real change, not a no-op
    const parts=pick.ids.slice().reverse().map((id,i)=>({part_request_id:id,part_order:i+1}));
    const r=await fetch(`https://api.shopview.com/api/work-orders/lines/${pick.id}/part-order`,
      {method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({parts})});
    const body=await r.text();
    return {linesRead:L.s, pick:{id:pick.id,name:pick.name,status:pick.status,woStatus:pick.woStatus,editable:pick.editable,parts:pick.ids.length},
            status:r.status, answer:body.slice(0,240)};
  },wo);
  R[label]=out;
  console.log(`\n--- ${label} ---`);
  console.log(' line read:',out.linesRead,'| line used:',JSON.stringify(out.pick));
  if(out.rows) console.log(' lines seen:',JSON.stringify(out.rows));
  console.log(' the reorder was answered:',out.status,'|',String(out.answer||'').replace(/\s+/g,' ').slice(0,200));
  return out;
};
const a=await tryOne(OPEN,'openWorkOrder');
const b=await tryOne(INVOICED,'invoicedWorkOrder');
console.log('\n>>> positive control (open work order) accepted the reorder:', a.status>=200&&a.status<300);
console.log('>>> invoiced work order answered:', b.status, '- the case expects it to be refused (409)');
fs.writeFileSync(`${EV}/r91-partorder-both.json`,JSON.stringify(R,null,1));
await browser.close();
