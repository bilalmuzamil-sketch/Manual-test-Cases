import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const S=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8')); const EV='/home/user/Manual-test-Cases/build/sv10579-wo-list-location-scope-2026-11-02/ev/prod';
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const ctx=p.context(); const log=[];
const watch=pg=>pg.on('response',async r=>{const q=r.request(); const u=r.url(); if(u.includes('/api/')&&!u.includes('envelope')&&!u.includes('recent-entities')&&q.method()!=='GET'){ let b=''; try{b=(await r.text()).slice(0,200);}catch(e){} log.push(q.method()+' '+r.status()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').slice(0,160)+' => '+b);}}); watch(p);
const pickLoc=async(pg,name)=>{ await pg.click('[data-test-id="profile_menu_button"]'); await pg.waitForTimeout(1000); await pg.click('[data-test-id="select_location"]'); await pg.waitForTimeout(1200);
  for(const e of await pg.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()===name){ await e.click(); await pg.waitForTimeout(3500); return true; } } return false; };
await s.go('/workorders'); await p.waitForTimeout(2500); const hdr=await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText); if(!hdr.includes('Trucks Hill 2')) await pickLoc(p,'Trucks Hill 2');
await s.go(`/workorders/${S.woId}/lines`); await p.waitForTimeout(4000);
const tid='button_clock_toggle_task_'+S.lineId; console.log('clock btn present', !!(await s.box(tid)));
const p2=await ctx.newPage(); watch(p2); await p2.goto('https://app.shopview.com/workorders',{waitUntil:'commit'}); await p2.waitForTimeout(5000); console.log('tab2 switch', await pickLoc(p2,'Truck Hill 1'));
await p.bringToFront(); await s.shot('p21-tab1-lines-before-clock',EV);
const b=await s.box(tid); if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500); await s.shot('p22-tab1-after-clock',EV); }
const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\n/g,' ')).join(' || ')); console.log('toasts',toasts);
console.log(log.join('\n'));
process.exit(0);
