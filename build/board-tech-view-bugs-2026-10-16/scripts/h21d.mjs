import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={mk:await s.marker(),runs:[]};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const b0=await get(); const before=b0.techViewColumns, bd=b0.density;
const ALL={vin:true,daysOpen:true,technician:true,vehicleHere:true,invoicedDate:true,assignedTechs:true,partRequestsCount:true,partReturnRequestsCount:true};
const m=()=>p.evaluate(()=>{const L=[...document.querySelectorAll('[data-test-id=table_tech_view] thead tr th')].filter(t=>t.innerText.trim()).map(th=>{const w=document.createTreeWalker(th,NodeFilter.SHOW_TEXT);let n,a=[];while(n=w.nextNode()) if(n.textContent.trim()) a.push(n); const r=document.createRange(); r.setStart(a[0],0); r.setEnd(a[a.length-1],a[a.length-1].textContent.length); const b=r.getBoundingClientRect(); const cs=getComputedStyle(a[0].parentElement); return {x0:b.x,x1:b.x+b.width,h:b.height,st:cs.fontSize+'/'+cs.fontWeight+'/'+cs.color};}); let g=1e9; for(let i=1;i<L.length;i++) g=Math.min(g,L[i].x0-L[i-1].x1); return {n:L.length,st:[...new Set(L.map(l=>l.st))],min:+g.toFixed(1),tall:L.filter(l=>l.h>20).length};});
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
for(const set of ['default','all']){
 if(set==='all'){ await put({...(await get()),techViewColumns:ALL}); await s.go('/workorders?tab=all'); await p.waitForTimeout(4500);} 
 for(const d of ['compact','regular','comfortable']){ await p.setViewportSize({width:1440,height:900}); await p.waitForTimeout(600); await dens(p,d);
  for(const w of [1024,1280,1440,1536,1920]){ await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(1300); const r=await m(); out.runs.push({set,d,w,...r}); console.log(set,d,w,r.n,r.st.join(','),r.min,r.tall); } } }
await p.setViewportSize({width:1440,height:900}); await dens(p,bd||'regular');
await put({...(await get()),techViewColumns:before}); const a=await get(); out.restored=JSON.stringify(a.techViewColumns)===JSON.stringify(before)&&a.density===bd; console.log('restored',out.restored,a.density);
fs.writeFileSync('/tmp/qa11310/h21d.json',JSON.stringify(out,null,1)); await s.close();
