import {op,j} from '../lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('prod/wo.json')); const s=await op({dpr:2}); const p=s.page;
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const ls=(await s.api('/api/work-orders/lines/'+wo)).json.data.collection; const pend=ls.filter(l=>l.status==='authorization_required');
console.log('pending',pend.length); if(pend.length>1){ const r=await P('/api/work-orders/lines/delete',{line_id:pend[pend.length-1].line_id}); console.log('del extra',r.status); }
await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(1500);
const badge=async()=>p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim());
console.log('badge',await badge(), j(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>e.innerText.trim()))));
await s.shot('P3x2-still-review','prod');
const geo=await p.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`);if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round);};
 const pl=[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].find(e=>/Approval/.test(e.innerText)); const r=pl.getBoundingClientRect();
 return {badge:g('badge_wo_status'),mark:g('button_mark_reviewed'),pending:[r.x,r.y,r.width,r.height].map(Math.round)};}); console.log('geo',j(geo));
fs.writeFileSync('prod/geo2.json',JSON.stringify(geo));
const b=await s.box('button_mark_reviewed'); await p.mouse.click(b.x,b.y);
for(let i=0;i<60;i++){ await p.waitForTimeout(200); const n=await p.evaluate(()=>{const e=document.querySelector('.q-notification');if(!e)return null;const r=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[r.x,r.y,r.width,r.height].map(Math.round)};}); if(n){ await p.waitForTimeout(700); const n2=await p.evaluate(()=>{const e=document.querySelector('.q-notification');const r=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[r.x,r.y,r.width,r.height].map(Math.round)};}); console.log('toast',j(n2)); fs.writeFileSync('prod/toast2.json',JSON.stringify(n2)); await s.shot('P4x2-error','prod'); break;} }
console.log('badge end',await badge()); console.log('marker',j(await s.marker()));
console.log('writes',s.writes.filter(w=>/change-status|lines/.test(w)).map(w=>w.slice(0,140)).join('\n'));
await s.close();
