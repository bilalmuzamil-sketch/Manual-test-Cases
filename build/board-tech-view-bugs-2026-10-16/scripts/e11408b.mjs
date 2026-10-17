import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
const snap=()=>p.evaluate(()=>({url:location.pathname+location.search,dialogs:[...document.querySelectorAll('.q-dialog, [role=dialog]')].filter(d=>d.getBoundingClientRect().height>0).map(d=>({text:(d.innerText||'').trim().replace(/\n+/g,' / ').slice(0,300),tids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId).slice(0,25)}))}));
try{
 await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3500); if(!/Empty Shop/.test(await where())) await loc('ZZAUTOTEST F2 Empty Shop');
 for(const v of ['tech_view','board_view']){
  for(const which of ['button_first_run_create_work_order','button_new_work_order']){
   await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3500); await toView(p,v); await p.waitForTimeout(2000);
   const b=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id=${t}]`); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,label:e.getAttribute('aria-label')||e.innerText.trim()};},which);
   if(!b){ out[v+'|'+which]='missing'; continue; }
   await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000);
   const o=await snap(); out[v+'|'+which]={btn:b,...o}; await p.screenshot({path:`/tmp/qa11310/ev08/${v}-${which}.png`});
   console.log(v,which,JSON.stringify(out[v+'|'+which]).slice(0,700));
  }
 }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
try{ await s.go('/workorders?tab=all'); await p.waitForTimeout(3000); if(!/Heavy Duty/.test(await where())) await loc('Staging Heavy Duty - 9919'); out.locEnd=await where(); console.log('restored',out.locEnd);}catch(e){console.log('restore err',e.message);}
fs.writeFileSync('/tmp/qa11310/ev08/e11408b.json',JSON.stringify(out,null,1)); await s.close();
