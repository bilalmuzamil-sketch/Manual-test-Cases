// Genuine server refusal a user can reach: two tabs. Tab 2 clocks into line A; tab 1 (still showing line B's Start) taps Start on B.
// The server refuses ("already clocked into different line"). What does tab 1 show? Any uncaught error? Does the button recover?
import {sess} from './common.mjs'; import fs from 'fs';
const {WO,A,B,TAG}=process.env; const s=await sess(process.env.DEVICE?{device:process.env.DEVICE}:{}); const p=s.page; const ev=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2); const L=x=>ev.push(`${T()} ${x}`);
const pre=(tid)=>(process.env.DEVICE?'button_line_clock_':'button_clock_toggle_task_')+tid;
await p.addInitScript(()=>{ window.__unh=[]; window.addEventListener('unhandledrejection',e=>window.__unh.push(String(e.reason&&(e.reason.message||e.reason)).slice(0,200))); });
p.on('request',r=>{ if(/technician-tasks|tasks\/create/.test(r.url())&&r.method()!=='GET') L(`TAB1 REQ ${r.method()} ${new URL(r.url()).pathname}`); });
p.on('response',async r=>{ if(/technician-tasks|tasks\/create/.test(r.url())&&r.request().method()!=='GET') L(`TAB1 RES ${r.status()} ${new URL(r.url()).pathname} ${(await r.text().catch(()=>'')).slice(0,160)}`); });
p.on('pageerror',e=>L(`PAGEERROR ${e.message.slice(0,200)}`));
L('marker '+JSON.stringify(await s.marker()));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(3500); L('tab 1 open, line B button: '+await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText.trim(),pre(B)));
const r2=await s.api('/api/technician-tasks/check-in',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({task_id:process.env.TASKA,line_id:A,work_order_id:process.env.WOA||WO,refresh_lines:true})}); L(`other device clocks into line A (same user, sent outside this tab): HTTP ${r2.status}`);
await p.bringToFront(); await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),pre(B)); await p.waitForTimeout(500);
L('tab 1 line B still shows: '+await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText.trim(),pre(B)));
const b=await s.box(pre(B)); await p.screenshot({path:`../ev/${TAG}-1-before.png`}); if(process.env.DEVICE) await p.touchscreen.tap(b.x,b.y); else await p.mouse.click(b.x,b.y); L('tab 1: Start on line B');
const toasts=[]; let lastDlg=null; for(let i=0;i<40;i++){ await p.waitForTimeout(150); const x=await p.evaluate(()=>({t:[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(t=>!/IBS Location/.test(t)),d:[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,120)).join(' || ')}));
  x.t.forEach(t=>{ if(!toasts.includes(t)){ toasts.push(t); L('TOAST '+t);} }); if(x.d!==lastDlg){ L('DIALOG '+(x.d||'(none)')); lastDlg=x.d; } if(i===6) await p.screenshot({path:`../ev/${TAG}-2-after.png`}); }
L('toast elements on screen now: '+await p.evaluate(()=>document.querySelectorAll('.q-notification').length));
L('tab 1 line B button after: '+await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e?e.innerText.trim()+' disabled='+(e.disabled||e.getAttribute('aria-disabled')||false):null},pre(B)));
L('uncaught promise rejections: '+JSON.stringify(await p.evaluate(()=>window.__unh)));
fs.writeFileSync(`../ev/${TAG}-log.txt`,ev.join('\n')+'\n'); console.log(ev.join('\n')); await s.close();
