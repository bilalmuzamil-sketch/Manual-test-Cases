// admin: stop own hand-added entry (W1) from Timesheet Activities, then Start on W8's line from the work order screen
import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()==='POST'&&/technician-tasks|tasks\/create/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
const dlgIds=()=>p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.disabled?'(off)':'')):null;});
if(process.env.STOP!=='0'){ await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(8000);
const row=p.locator('tbody tr',{hasText:'Admin ShopView'}).filter({hasText:'S12193-17580'}).first(); await row.hover(); await p.waitForTimeout(500); await row.locator('[data-test-id="button_stop_timesheet"]').click(); await p.waitForTimeout(2500);
console.log('stop dialog',JSON.stringify(await dlgIds()));
await p.locator('[data-test-id="input_tech_story"] textarea, textarea[data-test-id="input_tech_story"]').first().fill('ZZAUTOTEST SV-12193'); await p.waitForTimeout(500);
const cb=p.locator('.q-dialog button',{hasText:/^\s*Clock Out\s*$/}).last(); console.log('clock out btns',await cb.count()); await cb.click(); await p.waitForTimeout(3000); console.log('after',JSON.stringify(await dlgIds())); }
if(process.env.START!=='0'){ await s.go('/workorders/'+S.W.W8.id+'/lines'); await p.waitForTimeout(8000); const b=p.locator(`[data-test-id="button_clock_toggle_task_${S.W.W8.line}"]`); console.log('start btn',await b.count()); await b.click(); await p.waitForTimeout(3500); console.log('dlg',JSON.stringify(await dlgIds())); await p.screenshot({path:'../ev/w8-after-start.png'}); }
console.log(JSON.stringify(caps)); await s.close(); process.exit(0);
