import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={net:[]};
p.on('request',r=>{ if(r.method()!=='GET' && /\/api\/work-orders/.test(r.url())) out.net.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200)); });
const F='07253c44-3af0-4164-8a6d-0039dd74034c', P='55319163-e4c8-4099-82b2-4f5e9e98c125', WO='32d52d69-7ec4-4a26-b4d8-0c42feb5fe38';
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const ex=async g=>p.getAttribute(`[data-test-id=button_tech_view_group_toggle_${g}]`,'aria-expanded');
for(const g of [F,P]) if(await ex(g)!=='true'){ await p.click(`[data-test-id=button_tech_view_group_toggle_${g}]`); await p.waitForTimeout(2000); }
const where=()=>p.evaluate(wo=>{const r=document.querySelector(`[data-test-id=tech_view_row_${wo}]`); if(!r) return null; const y=r.getBoundingClientRect().y; const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({y:b.getBoundingClientRect().y,name:b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').slice(0,30)})).filter(h=>h.y<y).sort((a,b)=>b.y-a.y); return hs[0]?.name;},WO);
out.w0=await where(); await p.screenshot({path:'/tmp/qa11310/d20d-0.png'});
const gb=await p.locator(`[data-test-id=tech_view_row_drag_handle_${WO}]`).boundingBox(); const fh=await p.locator(`[data-test-id=button_tech_view_group_toggle_${F}]`).boundingBox();
const fx=gb.x+gb.width/2, fy=gb.y+gb.height/2, tx=600, ty=fh.y+fh.height/2;
await p.mouse.move(fx,fy); await p.mouse.down(); for(let i=1;i<=20;i++){ await p.mouse.move(fx+(tx-fx)*i/20,fy+(ty-fy)*i/20); await p.waitForTimeout(40);} await p.waitForTimeout(400); await p.screenshot({path:'/tmp/qa11310/d20d-hold.png'}); await p.mouse.up(); await p.waitForTimeout(1500);
out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)));
await p.waitForTimeout(2500); out.w1=await where(); await p.screenshot({path:'/tmp/qa11310/d20d-1.png'});
fs.writeFileSync('/tmp/qa11310/d20d.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out)); await s.close();
