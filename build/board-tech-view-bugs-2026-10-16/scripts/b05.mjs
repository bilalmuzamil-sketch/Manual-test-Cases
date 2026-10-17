import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={mk:await s.marker()};
await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); await toView(p,'board_view'); await p.waitForTimeout(2500);
const cards=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=board_card_]')].filter(c=>/^board_card_[0-9a-f-]{36}$/.test(c.getAttribute('data-test-id'))&&c.getBoundingClientRect().width>0).map(c=>{const cb=c.getBoundingClientRect(); const pill=c.querySelector('.q-badge:not(.q-badge--floating)'); const pb=pill?.getBoundingClientRect(); const cs=pill?getComputedStyle(pill):null; const fl=[...c.querySelectorAll('.q-badge--floating')].map(f=>({t:f.innerText.trim(),bg:getComputedStyle(f).backgroundColor}));
 return {num:c.querySelector('[data-test-id=board_card_number]')?.innerText.trim()||c.innerText.match(/S2-\d+/)?.[0],pill:pill?.innerText.trim(),cls:pill?.className.match(/bg-\S+|text-\S+/g)?.join(' '),h:pb?+pb.height.toFixed(1):null,w:pb?+pb.width.toFixed(1):null,fs:cs?.fontSize,fw:cs?.fontWeight,dxR:pb?+(cb.right-pb.right).toFixed(1):null,dyT:pb?+(pb.top-cb.top).toFixed(1):null,counts:fl};}));
const all=new Map();
for(const d of ['compact','regular','comfortable']){ await dens(p,d); await p.waitForTimeout(1500); const seen=new Map();
 for(let i=0;i<8;i++){ for(const c of await cards()) seen.set(c.num,c); await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollBy({left:1100})); await p.waitForTimeout(900); }
 await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollTo({left:0})); await p.waitForTimeout(600);
 const v=[...seen.values()]; out[d]={n:v.length,h:[...new Set(v.map(c=>c.h))],dxR:[...new Set(v.map(c=>c.dxR))],dyT:[...new Set(v.map(c=>c.dyT))],statuses:[...new Set(v.map(c=>c.pill))],withCounts:v.filter(c=>c.counts.length).length,font:[...new Set(v.map(c=>c.fs+'/'+c.fw))]};
 if(d==='regular') v.forEach(c=>all.set(c.num,c));
 console.log(d,JSON.stringify(out[d])); }
await dens(p,'regular');
out.cards=[...all.values()]; fs.writeFileSync('/tmp/qa11310/b05.json',JSON.stringify(out,null,1)); await toView(p,'tech_view'); await s.close();
