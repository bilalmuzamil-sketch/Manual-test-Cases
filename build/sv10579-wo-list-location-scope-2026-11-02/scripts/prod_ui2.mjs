import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const S=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8')); const EV='/home/user/Manual-test-Cases/build/sv10579-wo-list-location-scope-2026-11-02/ev/prod';
fs.mkdirSync(EV,{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const log=[]; p.on('request',r=>{const u=r.url(); if(u.includes('/api/')&&!u.includes('envelope')&&r.method()!=='GET') log.push(r.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200).replace(/\n/g,' '));});
await s.go(`/workorders/${S.woId}/part-requests`); await p.waitForTimeout(3500); await s.shot('p01-wo-parts-at-TH2',EV);
// switch location on screen
await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1200);
await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1500);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, [role=option]')].map(e=>(e.innerText||'').trim()).filter(Boolean)); console.log('location options',JSON.stringify(opts));
await s.shot('p02-location-options',EV);
const tgt=await p.$$('.q-menu .q-item, [role=option]'); let clicked=false;
for(const e of tgt){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()==='Truck Hill 1'){ await e.click(); clicked=true; break; } }
console.log('clicked TH1',clicked); await p.waitForTimeout(4000);
console.log('url after switch',p.url()); await s.shot('p03-after-switch',EV);
const hdr=await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\n/g,' | ')); console.log('header',hdr);
const btn=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="button_part_request_action"]')].map(e=>{const r=e.getBoundingClientRect(); return (e.innerText||'').trim()+'@'+Math.round(r.y);})); console.log('action buttons',JSON.stringify(btn));
console.log('writes',log.join('\n'));
process.exit(0);
