// SV-12353: rapid double click on a work-order line's clock button. Records every technician-task request, toasts, dialogs and
// uncaught promise rejections. CLICKS = number of rapid clicks, GAP = ms between them.
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, LINE=process.env.LINE, TAG=process.env.TAG||'run', CLICKS=+(process.env.CLICKS||2), GAP=+(process.env.GAP||40);
const s=await sess(process.env.DEVICE?{device:process.env.DEVICE}:{}); const p=s.page; const ev=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2); const L=x=>ev.push(`${T()} ${x}`);
await p.addInitScript(()=>{ window.__unh=[]; window.addEventListener('unhandledrejection',e=>window.__unh.push(String(e.reason&&(e.reason.message||e.reason)).slice(0,200))); });
p.on('request',r=>{ if(/technician-tasks|time-?sheets|clock/i.test(r.url())&&r.method()!=='GET') L(`REQ ${r.method()} ${new URL(r.url()).pathname} ${(r.postData()||'').slice(0,200)}`); });
p.on('response',async r=>{ if(/technician-tasks|time-?sheets|clock/i.test(r.url())&&r.request().method()!=='GET') L(`RES ${r.status()} ${new URL(r.url()).pathname} ${(await r.text().catch(()=>'')).slice(0,200)}`); });
p.on('pageerror',e=>L(`PAGEERROR ${e.message.slice(0,200)}`));
L('marker '+JSON.stringify(await s.marker()));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(3000);
const tid=(process.env.DEVICE?'button_line_clock_':'button_clock_toggle_task_')+LINE;
const st=async()=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e?{txt:e.innerText.trim(),aria:e.getAttribute('aria-label'),cls:e.className.slice(0,120),dis:e.disabled||e.getAttribute('aria-disabled')}:null},tid);
L('button before: '+JSON.stringify(await st()));
await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),tid); await p.waitForTimeout(400);
let b=await s.box(tid); await p.screenshot({path:`../ev/${TAG}-1-before.png`});
if(process.env.CLOCKOUT==='1'){ await p.mouse.click(b.x,b.y); L('clicked Stop (opens window)'); await p.waitForTimeout(2500);
  const ta=p.locator('.q-dialog [data-test-id="input_tech_story"]').first(); await ta.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('ZZAUTOTEST SV12353 story'); await p.waitForTimeout(500);
  b=await s.box('button_clock_out'); await p.screenshot({path:`../ev/${TAG}-1b-window.png`}); L('now clicking Clock Out'); }
for(let i=0;i<CLICKS;i++){ if(process.env.DEVICE) await p.touchscreen.tap(b.x,b.y); else await p.mouse.click(b.x,b.y); L(`click ${i+1}`); if(i<CLICKS-1) await p.waitForTimeout(GAP); }
const toasts=new Set(); let lastDlg='';
for(let i=0;i<40;i++){ await p.waitForTimeout(150);
  const x=await p.evaluate(()=>({t:[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(t=>!/IBS Location/.test(t)),
    d:[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,160)).join(' || ')}));
  x.t.forEach(t=>{ if(!toasts.has(t)){toasts.add(t); L('TOAST '+t);} }); if(x.d!==lastDlg){ L('DIALOG '+(x.d||'(none)')); lastDlg=x.d; }
  if(i===8) await p.screenshot({path:`../ev/${TAG}-2-after.png`}); }
L('button after: '+JSON.stringify(await st()));
L('uncaught promise rejections: '+JSON.stringify(await p.evaluate(()=>window.__unh)));
const cur=await s.api('/api/technician-tasks/current').catch(()=>null); L('current task: '+JSON.stringify(cur).slice(0,300));
fs.writeFileSync(`../ev/${TAG}-log.txt`,ev.join('\n')+'\n'); console.log(ev.join('\n')); await s.close();
