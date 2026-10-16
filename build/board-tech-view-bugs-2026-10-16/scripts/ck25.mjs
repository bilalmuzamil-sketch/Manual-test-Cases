import {session} from './rec.mjs'; import fs from 'fs';
const [,,quick,act]=process.argv; const WO='0c643903-e7a3-4143-b1df-320b4ea0d11d';
const s=await session({quick,vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000);
const btns=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_clock_toggle_task_]')].map(b=>({t:b.getAttribute('data-test-id'),txt:b.innerText.trim(),dis:b.disabled||b.getAttribute('aria-disabled')==='true'})));
console.log(quick,'buttons',JSON.stringify(btns));
if(act==='start'){ const b=btns.find(x=>/start/i.test(x.txt)&&!x.dis); if(b){ await p.click(`[data-test-id=${b.t}]`); await p.waitForTimeout(3000); console.log('clicked',b.t, JSON.stringify(s.writes.slice(-3)));} }
if(act==='stop'){ const b=btns.find(x=>/stop/i.test(x.txt)); if(b){ await p.click(`[data-test-id=${b.t}]`); await p.waitForTimeout(2000); if(await p.$('[data-test-id=input_tech_story]')){ await p.fill('[data-test-id=input_tech_story] textarea, [data-test-id=input_tech_story] input, textarea[data-test-id=input_tech_story]','ZZAUTOTEST clock check SV-11325').catch(async()=>{await p.click('[data-test-id=input_tech_story]'); await p.keyboard.type('ZZAUTOTEST clock check SV-11325');}); } await p.click('[data-test-id=button_clock_out]').catch(e=>console.log('no clock out btn')); await p.waitForTimeout(3000); console.log('stopped',b.t,JSON.stringify(s.writes.slice(-3)));} }
await p.screenshot({path:`/tmp/qa11310/ck25-${quick}-${act}.png`}); await s.close();
