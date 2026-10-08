import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op({vp:{width:1600,height:1000}}); const p=s.page; console.log(j(await s.marker()));
const ws=(await s.api('/api/staff/my-workplaces')).json?.data?.collection||[]; console.log('workplaces',j(ws.map(w=>[w.name,w.id.slice(0,8)])));
const L=(await s.api('/api/part-sales?limit=500')).json?.data; const all=L?.partSales||[]; console.log('n',all.length,'footer',L?.pagination?.totalWorkOrderPrice);
const by={}; for(const x of all){by[x.status]=(by[x.status]||0)+1;} console.log(j(by));
const pick=[]; for(const st of ['estimate','approved','complete','invoiced','paid']){ pick.push(...all.filter(x=>x.status===st).slice(0,2)); }
const out=[];
for(const x of pick){ await p.goto(s.host.app+`/parts/part-sale/${x.id}/part-requests`,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  let tot=null; for(let k=0;k<20&&!tot;k++){ await p.waitForTimeout(500); tot=await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.innerText?.trim()==='Financial Info'); if(!h) return null; let c=h; for(let i=0;i<4;i++) c=c.parentElement; const rows=c.innerText.split('\n').map(t=>t.trim()).filter(Boolean); const i=rows.indexOf('Total'); return i>=0? rows.slice(1,i+2).join(' | '):null;}); }
  out.push({n:x.number,status:x.status,list:x.totalPrice,fin:tot,company:x.companyName,id:x.id}); }
fs.writeFileSync('prod-compare.json',JSON.stringify(out,null,1)); console.log(j(out,3000));
await s.close();
