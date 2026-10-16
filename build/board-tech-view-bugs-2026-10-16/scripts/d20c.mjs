import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={net:[]};
p.on('request',r=>{ if(r.method()!=='GET' && /api/.test(r.url())) out.net.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200)); });
const F='07253c44-3af0-4164-8a6d-0039dd74034c', P='55319163-e4c8-4099-82b2-4f5e9e98c125', WO='32d52d69-7ec4-4a26-b4d8-0c42feb5fe38';
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);}
for(const g of [F,P]){ await p.click(`[data-test-id=button_tech_view_group_toggle_${g}]`); await p.waitForTimeout(2000); }
const where=()=>p.evaluate(wo=>{const r=document.querySelector(`[data-test-id=tech_view_row_${wo}]`); if(!r) return null; let e=r.previousElementSibling, y=r.getBoundingClientRect().y; // find nearest header above
 const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({id:b.getAttribute('data-test-id').slice(31),y:b.getBoundingClientRect().y,name:b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').slice(0,30)})).filter(h=>h.y<y).sort((a,b)=>b.y-a.y); return {y:Math.round(y),group:hs[0]};},WO);
const drag=async(fx,fy,tx,ty,tag)=>{ await p.mouse.move(fx,fy); await p.mouse.down(); for(let i=1;i<=20;i++){ await p.mouse.move(fx+(tx-fx)*i/20,fy+(ty-fy)*i/20); await p.waitForTimeout(40);} await p.waitForTimeout(400); await p.screenshot({path:`/tmp/qa11310/d20c-${tag}-hold.png`}); await p.mouse.up(); await p.waitForTimeout(1500); await p.screenshot({path:`/tmp/qa11310/d20c-${tag}-drop.png`}); out[tag+'_dialog']=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog,.q-notification,[role=dialog],[role=alert]')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300))); };
out.w0=await where(); console.log('w0',JSON.stringify(out.w0));
const rb=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox(); const tb=await p.locator(`[data-test-id=tech_view_row_2c136a90-2a48-4d7b-b50d-43a80fdc14ac]`).boundingBox();
await drag(rb.x+500,rb.y+rb.height/2,tb.x+500,tb.y+tb.height/2+10,'mid');
console.log('dlg',JSON.stringify(out.mid_dialog)); await p.waitForTimeout(2500); out.w1=await where(); console.log('w1',JSON.stringify(out.w1));
fs.writeFileSync('/tmp/qa11310/d20c.json',JSON.stringify(out,null,1)); console.log(out.net.join('\n')); await s.close();
