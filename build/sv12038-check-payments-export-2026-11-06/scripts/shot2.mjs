import {sess,arr} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page; const out={};
await s.go('/administration/settings'); await p.waitForTimeout(5000);
const link=await p.$('text=Payment Methods'); if(link){ await link.click(); await p.waitForTimeout(4000);}
out.pmUrl=p.url();
out.pm=await p.evaluate(()=>{const r=[];for(const el of document.querySelectorAll('td,div,span')){const t=(el.innerText||'').trim(); if(/^(Check|Cheque)$/.test(t)&&el.children.length===0){const b=el.getBoundingClientRect(); if(b.width>0) r.push({t,x:b.x,y:b.y,w:b.width,h:b.height});}} return r;});
await p.screenshot({path:'../ev/recheck-pm-list.png'});
const rr=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&search=S2-17292&showMyWorkOrders=0'); const w=arr(rr.json?.data).find(x=>JSON.stringify(x).includes('S2-17292')); await s.go('/workorders/'+w.id+'/finance'); await p.waitForTimeout(5000);
out.fin=await p.evaluate(()=>{const r=[];for(const el of document.querySelectorAll('*')){const t=(el.innerText||'').trim(); if(/^Nov 6, 2026 - Check$/.test(t)&&el.children.length===0){const b=el.getBoundingClientRect(); r.push({t,x:b.x,y:b.y,w:b.width,h:b.height});}} return r;});
await p.screenshot({path:'../ev/recheck-finance-shot.png'});
fs.writeFileSync('../ev/recheck-boxes.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,600));
await s.close(); process.exit(0);
