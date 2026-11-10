// on screen: Timesheet Activities > own row Stop > story > Clock Out (follows any second confirmation)
import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/technician-tasks/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(8000);
const row=p.locator('tbody tr',{hasText:'Admin ShopView'}).filter({hasText:'S12292-17587'}).first(); await row.hover(); await p.waitForTimeout(600);
await row.locator('[data-test-id="button_clock_out_timesheet"],[data-test-id="button_stop_timesheet"]').first().click(); await p.waitForTimeout(2000);
await p.locator('[data-test-id="input_tech_story"] textarea, [data-test-id="input_tech_story"] input, textarea[data-test-id="input_tech_story"]').first().fill('ZZAUTOTEST SV-12292 regression');
await p.click('[data-test-id="button_clock_out"]'); await p.waitForTimeout(2500);
for(let i=0;i<3;i++){ const d=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim()):null;}); console.log('dialog',JSON.stringify(d)); if(!d) break; const b=p.locator('.q-dialog [data-test-id*="confirmation_answer"], .q-dialog button:has-text("Clock Out"), .q-dialog button:has-text("Yes")').last(); if(!(await b.count())) break; await b.click(); await p.waitForTimeout(2500); }
console.log('caps',JSON.stringify(caps)); await s.close(); process.exit(0);
