import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const OUT='../ev/branch';
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const reqs=[]; p.on('request',r=>{ if(/work-orders/.test(r.url())&&r.method()==='GET') reqs.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,'')).slice(0,160)); });
await s.go('/workorders'); await p.waitForTimeout(2500);
const pick=async name=>{ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000); await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1200); for(const e of await p.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()===name){ await e.click(); await p.waitForTimeout(4000); return true; } } return false; };
console.log('to Lethbridge',await pick('Staging Lethbridge - 4310'));
await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(4000);
const nb=await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(b=>/^\s*(add\s*)?New\s*$/i.test(b.innerText.replace('add',''))); if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:b.innerText}; }); console.log('new btn',JSON.stringify(nb));
if(nb){ await p.mouse.click(nb.x,nb.y); await p.waitForTimeout(2500);
  reqs.length=0; await p.click('[data-test-id="select_timesheet_work_order"]').catch(e=>console.log('no wo select')); await p.waitForTimeout(1500); await p.keyboard.type('S10579-1758',{delay:40}); await p.waitForTimeout(3000);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')).slice(0,20)); console.log('options for S10579-1758:',JSON.stringify(opts));
  await p.screenshot({path:OUT+'/timesheet-new-wo-picker-at-lethbridge.png'}); console.log('reqs',reqs.slice(-4).join(' ; ')); }
console.log('back to HD',await pick('Staging Heavy Duty - 9919'));
process.exit(0);
