import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1920,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const out={mk};
// Tech View: expand all? use search for mixed statuses
await toView(p,'tech_view');
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(600); await p.keyboard.type('S2-363',{delay:30}); await p.waitForTimeout(4000);
const ex=await p.getAttribute('[data-test-id=button_tech_view_group_toggle_unassigned]','aria-expanded'); console.log('unassigned expanded',ex); if(ex!=='true'){ await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(3000);} 
const pills=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_row_] .q-badge:not(.q-badge--floating)')].filter(b=>/[A-Za-z]/.test(b.innerText)).map(b=>{const r=b.getBoundingClientRect(); const tr=b.closest('tr'); return {n:(tr.innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+r.width.toFixed(2),h:+r.height.toFixed(2),cnt:[...tr.querySelectorAll('.q-badge--floating')].map(f=>f.innerText.trim()+':'+getComputedStyle(f).backgroundColor).join(',')};}));
for(const d of ['compact','regular','comfortable']){ await dens(p,d); out['tech_'+d]=await pills(); const v=out['tech_'+d]; console.log('tech',d,v.length,'h',[...new Set(v.map(x=>x.h))],'w',[...new Set(v.map(x=>x.w))],[...new Set(v.map(x=>x.t))].join('|')); }
await dens(p,'regular'); await p.screenshot({path:'/tmp/qa11310/p18-reg.png'}); if(ex!=='true'){ await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(1500);}
await toView(p,'list'); await p.waitForTimeout(2000);
out.list=await p.evaluate(()=>[...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].map(b=>{const r=b.getBoundingClientRect(); return {n:(b.closest('tr').innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+r.width.toFixed(2),h:+r.height.toFixed(2)};}));
console.log('list',out.list.length,'h',[...new Set(out.list.map(x=>x.h))],'w',[...new Set(out.list.map(x=>x.w))]);
fs.writeFileSync('/tmp/qa11310/p18.json',JSON.stringify(out,null,1)); await s.close();
