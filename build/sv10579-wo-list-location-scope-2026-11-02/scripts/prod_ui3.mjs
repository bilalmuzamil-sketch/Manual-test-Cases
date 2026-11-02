import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const S=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8')); const EV='/home/user/Manual-test-Cases/build/sv10579-wo-list-location-scope-2026-11-02/ev/prod';
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const ctx=p.context(); const log=[];
const watch=pg=>pg.on('request',r=>{const u=r.url(); if(u.includes('/api/')&&!u.includes('envelope')&&!u.includes('recent-entities')&&r.method()!=='GET') log.push(r.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,220));}); watch(p);
const pickLoc=async(pg,name)=>{ await pg.click('[data-test-id="profile_menu_button"]'); await pg.waitForTimeout(1000); await pg.click('[data-test-id="select_location"]'); await pg.waitForTimeout(1200);
  for(const e of await pg.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()===name){ await e.click(); await pg.waitForTimeout(3500); return true; } } return false; };
// tab 1 at Trucks Hill 2 with the WO parts open
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; 
await s.go('/workorders'); if(!(await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText)).includes('Trucks Hill 2')) console.log('tab1 back to TH2', await pickLoc(p,'Trucks Hill 2'));
await s.go(`/workorders/${S.woId}/part-requests`); await p.waitForTimeout(3500); await s.shot('p11-tab1-wo-parts-TH2',EV);
// tab 2 switches location
const p2=await ctx.newPage(); watch(p2); await p2.goto(p.url().replace(/\/workorders.*/,'/workorders'),{waitUntil:'commit'}); await p2.waitForTimeout(5000);
console.log('tab2 switch', await pickLoc(p2,'Truck Hill 1')); await p2.screenshot({path:EV+'/p12-tab2-switched-TH1.png'});
// tab 1: click Order on our part row
await p.bringToFront(); const row=`table_row_part_request_${S.lineId}_${S.part.id}`;
const ok=await p.evaluate(rid=>{const r=document.querySelector(`[data-test-id="${rid}"]`); const b=r&&r.querySelector('[data-test-id="button_part_request_action"]'); if(!b) return 'no button'; b.scrollIntoView({block:'center'}); const bb=b.getBoundingClientRect(); return {t:b.innerText.trim(),x:bb.x+bb.width/2,y:bb.y+bb.height/2};},row);
console.log('order btn',JSON.stringify(ok)); await s.shot('p13-tab1-before-order',EV);
if(ok.x){ await p.mouse.click(ok.x,ok.y); await p.waitForTimeout(3000); await s.shot('p14-tab1-after-order',EV);
  const dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button, .q-menu .q-item')].map(e=>e.innerText.trim()+'|'+(e.getAttribute('data-test-id')||''))); console.log('dialog after order',JSON.stringify(dlg).slice(0,400)); }
console.log('writes:\n'+log.join('\n'));
process.exit(0);
