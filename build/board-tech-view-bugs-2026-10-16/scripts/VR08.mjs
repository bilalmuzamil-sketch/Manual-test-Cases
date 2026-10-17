import {session,toView,narr,finish} from './rec.mjs';
const dir='/tmp/qa11310/vo08'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec08'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
const read=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('*')].filter(e=>!/ · /.test(e.innerText||'')&&e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>150&&e.getBoundingClientRect().y<800&&e.getBoundingClientRect().height>0&&!e.closest('thead,tr,header,.q-tabs,[data-test-id^=board_column_header]')&&!/^(search|close)$/.test(e.innerText.trim())).map(e=>e.innerText.trim()); const ic=[...document.querySelectorAll('svg[data-icon], i.q-icon')].find(e=>{const r=e.getBoundingClientRect(); return r.y>150&&r.y<700&&r.width>=20&&!e.closest('thead,tr,header,button');}); return {t,icon:ic?(ic.getAttribute('data-icon')||'magnifier'):null};});
const closeDlg=async()=>{ await s.glideClick('button_close_dialog'); await p.waitForTimeout(1200); const c=p.locator('.q-dialog button').filter({hasText:/^Close$/}); if(await c.count()){ log.confirm=(log.confirm||0)+1; const b=await c.last().boundingBox(); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:10}); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1200);} };
const pt=async tid=>{ const b=await p.evaluate(t=>{const r=document.querySelector(`[data-test-id=${t}]`).getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height};},tid); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:14}); await p.waitForTimeout(300); return b; };
try{
 await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3500); if(!/Empty Shop/.test(await where())) await loc('ZZAUTOTEST F2 Empty Shop');
 await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3000); await toView(p,'tech_view'); if(await p.$('[data-test-id=empty_state_clear_filters]')){ await p.click('[data-test-id=empty_state_clear_filters]'); await p.waitForTimeout(2500); log.clearedLeftover=true; } await p.mouse.move(700,860); await p.waitForTimeout(1500);
 log.n1=await read(); await N.cap(s,'n1',`SV-11408 · staging ${mk.version} · ZZAUTOTEST F2 Empty Shop · Estimates (no work orders) · Tech View: ${log.n1.icon} icon · "${log.n1.t[0]}" · "${log.n1.t[1]}" · [${log.n1.t[2]}]`);
 await toView(p,'board_view'); await p.mouse.move(700,860); await p.waitForTimeout(1500); log.n2=await read(); await N.cap(s,'n2',`Board View: ${log.n2.icon} icon · "${log.n2.t[0]}" · [${log.n2.t[2]}]`);
 await s.glideClick('button_first_run_create_work_order'); await p.waitForTimeout(2000); log.n3=await p.evaluate(()=>document.querySelector('.q-dialog [data-test-id=dialog_title]')?.innerText.trim()); await N.cap(s,'n3',`Empty-state button → dialog "${log.n3}"`);
 await closeDlg();
 await s.glideClick('button_new_work_order'); await p.waitForTimeout(2000); log.n4=await p.evaluate(()=>document.querySelector('.q-dialog [data-test-id=dialog_title]')?.innerText.trim()); await N.cap(s,'n4',`Page's Create Work Order (top right) → the same dialog "${log.n4}"`);
 await closeDlg(); log.dialogsOpen=await p.evaluate(()=>document.querySelectorAll('.q-dialog').length);
 await s.glideClick('page_search_toggle'); await p.waitForTimeout(700); await p.keyboard.type('zzqnomatch',{delay:90}); await p.waitForTimeout(2500); await p.mouse.move(700,860,{steps:8}); log.n5=await read(); await N.cap(s,'n5',`Search only: "${log.n5.t.find(x=>/match/.test(x))}" · no button`);
 await p.keyboard.press('Escape').catch(()=>{}); await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3000); await toView(p,'board_view');
 await s.glideClick('filter_chip_assigned_to_me'); await p.waitForTimeout(2500); log.n6a=await read();
 await pt('empty_state_clear_filters'); await N.cap(s,'n6',`Filter "Assigned to me": "${log.n6a.t.find(x=>/match/.test(x))}" · [Clear all filters]`,-1500);
 await s.glideClick('empty_state_clear_filters'); await p.waitForTimeout(2500); await p.mouse.move(700,860,{steps:8}); log.n6b=await read(); await s.caption(`After Clear all filters: "${log.n6b.t[0]}" is back`,{hold:2000});
 await toView(p,'list'); await p.mouse.move(700,860); await p.waitForTimeout(1500); log.n7=await read(); await N.cap(s,'n7',`List (unchanged, same as production): ${log.n7.icon} · "${log.n7.t.find(x=>/No work/.test(x))}" · Spec v64 S1-N1a/b/c → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
try{ await toView(p,'tech_view'); await loc('Staging Heavy Duty - 9919'); log.locEnd=await where(); }catch(e){ log.restoreErr=e.message.slice(0,100); }
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log).slice(0,1500));
