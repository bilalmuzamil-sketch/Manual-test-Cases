// C44605 step 3: two people reorder the same line at once.
// Person A loads the line and works out their new order. Before they save, person B reorders the
// same line and saves. Then person A saves the order they decided on, built from what they saw.
// What does the product do with person A's save?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000});
const R={};
const out=await page.evaluate(async(wo)=>{
  const api=async(u,o)=>{const r=await fetch('https://api.shopview.com'+u,{credentials:'include',...o});
    const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {s:r.status,j,t:t.slice(0,220)};};
  const lines=async()=>(await api(`/api/work-orders/lines/${wo}`)).j.data.collection;
  const L=(await lines()).filter(l=>(l.parts||[]).length>=3).sort((a,b)=>b.parts.length-a.parts.length)[0];
  if(!L) return {err:'no line with three or more parts'};
  const put=(lineId,parts)=>api(`/api/work-orders/lines/${lineId}/part-order`,
    {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({parts})});
  // person A reads the line - this is the view they will save from
  // core rows ride along with their parent and are not reorderable - the product's own call sends
  // only the top-level parts, so match that
  const top=L.parts.filter(p=>!p.parent_wo_part_id);
  const idsA=[...new Set(top.map(p=>p.part_request_id).filter(Boolean))];
  const personAWillSave=idsA.slice().reverse().map((id,i)=>({part_request_id:id,part_order:i+1}));
  // person B reorders first and saves
  const rotated=[...idsA.slice(1),idsA[0]].map((id,i)=>({part_request_id:id,part_order:i+1}));
  const B=await put(L.line_id,rotated);
  // now person A saves the order they decided on, from their older view
  const A=await put(L.line_id,personAWillSave);
  const finalIds=[...new Set(((((await lines()).find(x=>x.line_id===L.line_id))||{}).parts||[]).filter(p=>!p.parent_wo_part_id).map(p=>p.part_request_id).filter(Boolean))];
  return {line:L.line_name,parts:idsA.length,
    personB:{status:B.s,answer:B.t},personA:{status:A.s,answer:A.t},
    finalMatchesA: JSON.stringify(finalIds)===JSON.stringify(idsA.slice().reverse()),
    finalMatchesB: JSON.stringify(finalIds)===JSON.stringify([...idsA.slice(1),idsA[0]])};
},OPEN);
R.race=out;
console.log('line:',out.line,'| parts:',out.parts);
console.log('person B saved first ->',out.personB&&out.personB.status,String(out.personB&&out.personB.answer).replace(/\s+/g,' ').slice(0,160));
console.log('person A saved second ->',out.personA&&out.personA.status,String(out.personA&&out.personA.answer).replace(/\s+/g,' ').slice(0,160));
console.log('the line ended up in person A\'s order:',out.finalMatchesA,'| in person B\'s order:',out.finalMatchesB);
fs.writeFileSync(`${EV}/r95-race.json`,JSON.stringify(R,null,1));
await browser.close();
