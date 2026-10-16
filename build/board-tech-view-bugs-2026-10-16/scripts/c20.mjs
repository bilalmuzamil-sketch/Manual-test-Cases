import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'admin';
const s=await session({quick,vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={quick,net:[]};
p.on('request',r=>{ if(r.method()!=='GET' && /\/api\/work-orders/.test(r.url())) out.net.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)); });
const F='07253c44-3af0-4164-8a6d-0039dd74034c', P='55319163-e4c8-4099-82b2-4f5e9e98c125', WO='32d52d69-7ec4-4a26-b4d8-0c42feb5fe38', WO2='2c136a90-2a48-4d7b-b50d-43a80fdc14ac';
const open=async()=>{ await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} 
 for(const g of [F,P]){ await p.click(`[data-test-id=button_tech_view_group_toggle_${g}]`); await p.waitForTimeout(2000);} };
await open();
let b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox();
await p.mouse.click(b.x+500,b.y+b.height/2); await p.waitForTimeout(3500); out.click=p.url(); await p.screenshot({path:`/tmp/qa11310/c20-${quick}-click.png`});
await open(); b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox();
await p.mouse.move(b.x+500,b.y+b.height/2); await p.mouse.down(); await p.mouse.move(b.x+502,b.y+b.height/2+1); await p.mouse.up(); await p.waitForTimeout(3500); out.wobble=p.url();
if(quick!=='admin'){ await open(); b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox(); const t=await p.locator(`[data-test-id=tech_view_row_${WO2}]`).boundingBox();
 const fx=b.x+500,fy=b.y+b.height/2,tx=t.x+500,ty=t.y+t.height/2+10; await p.mouse.move(fx,fy); await p.mouse.down(); for(let i=1;i<=20;i++){ await p.mouse.move(fx+(tx-fx)*i/20,fy+(ty-fy)*i/20); await p.waitForTimeout(40);} await p.waitForTimeout(400); await p.screenshot({path:`/tmp/qa11310/c20-${quick}-drag-hold.png`}); await p.mouse.up(); await p.waitForTimeout(3000);
 out.dragUrl=p.url(); out.dragToast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)));
 out.after=await p.evaluate(wo=>{const r=document.querySelector(`[data-test-id=tech_view_row_${wo}]`); if(!r) return null; const y=r.getBoundingClientRect().y; const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({y:b.getBoundingClientRect().y,name:b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').slice(0,30)})).filter(h=>h.y<y).sort((a,b)=>b.y-a.y); return hs[0]?.name;},WO); }
fs.writeFileSync(`/tmp/qa11310/c20-${quick}.json`,JSON.stringify(out,null,1)); console.log(JSON.stringify(out)); await s.close();
