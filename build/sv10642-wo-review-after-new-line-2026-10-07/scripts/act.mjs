// usage: node act.mjs <label> <approve|decline|delete|markreviewed|look> [shotname]
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,action,shot]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const badge=async()=>p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim());
console.log('badge before:',await badge());
const lines=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>({id:e.getAttribute('data-test-id').replace('badge_line_status_',''),st:e.innerText.trim()})));
console.log('lines',j(lines,400));
const pending=lines.find(l=>/approval|declined/i.test(l.st))||lines[lines.length-1];
const tids=await p.evaluate(id=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>t.includes(id)),pending.id);
console.log('tids for pending',j(tids,600));
const clickText=async(re)=>{const c=await p.evaluate(src=>{const re=new RegExp(src,'i');const e=[...document.querySelectorAll('button')].find(b=>re.test(b.innerText.trim())&&b.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};},re.source); if(c){await p.mouse.click(c.x,c.y);} return c;};
if(action==='approve') console.log('clicked',j(await clickText(/^Approve$/)));
if(action==='decline') console.log('clicked',j(await clickText(/^Decline$/)));
if(action==='complete') console.log('clicked',j(await clickText(/^Complete$/)));
if(action==='markreviewed') console.log('clicked',j(await clickText(/^Mark Reviewed$/)));
await p.waitForTimeout(2500);
const dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog,.q-notification')].map(e=>e.innerText.trim().slice(0,300)));
console.log('dialogs',j(dlg,600)); if(shot) await s.shot(shot+'-dialog','shots');
// confirm button in a dialog if present
const conf=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>/^(yes|confirm|approve|decline|ok|save)/i.test(b.innerText.trim()));if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};});
if(conf && action!=='look'){ console.log('confirm',conf.t); await p.mouse.click(conf.x,conf.y); await p.waitForTimeout(3000);}
console.log('writes',s.writes.filter(w=>!/envelope/.test(w)).join('\n'));
const notes=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.trim()));console.log('toasts',j(notes));
if(shot) await s.shot(shot+'-toast','shots');
await s.go(`/workorders/${wo}/lines`); console.log('badge after reload:',await badge());
const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(e=>e.innerText.trim()).filter(t=>/review|complete|approve|decline/i.test(t))); console.log('buttons',j(btns));
if(shot) await s.shot(shot,'shots');
const v=await s.api('/api/work-orders/view/'+wo); console.log('api status',v.json?.data?.work_order?.status??v.json?.data?.status);
await s.close();
