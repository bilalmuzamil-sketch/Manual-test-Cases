import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
const L=(await s.api('/api/part-sales?limit=500')).json.data; const all=L.partSales; const out=[];
fs.writeFileSync('ps-list.json',JSON.stringify({data:L},null,1));
for(const x of all){ await p.goto(s.host.app+`/parts/part-sale/${x.id}/part-requests`,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  let tot=null; for(let k=0;k<20&&!tot;k++){ await p.waitForTimeout(500);
    tot=await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.innerText?.trim()==='Financial Info'); if(!h) return null; let c=h; for(let i=0;i<4;i++) c=c.parentElement; const rows=c.innerText.split('\n').map(t=>t.trim()).filter(Boolean); const i=rows.indexOf('Total'); return i>=0? rows[i+1]:null;}); }
  const cents=tot?Math.round(parseFloat(tot.replace(/[$,]/g,''))*100):null;
  out.push({n:x.number,status:x.status,list:x.totalPrice,detail:tot,detailCents:cents,match:cents===x.totalPrice,company:x.companyName,id:x.id});
  fs.writeFileSync('all-compare.json',JSON.stringify(out,null,1)); }
const mm=out.filter(o=>!o.match); console.log('done',out.length,'mismatch',mm.length,j(mm.slice(0,10),1500));
console.log('footer',L.pagination.totalWorkOrderPrice,'sum',all.reduce((a,b)=>a+b.totalPrice,0),'rows',all.length);
await s.close();
