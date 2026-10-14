import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {openWizard,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json'));
const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/(work|orders|inventory)/.test(r.url().replace(/.*\.com/,''))) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
await openWizard(s,A);
for(let i=0;i<4;i++){ const c=await readCores(p); const b=await dlgButtons(p); console.log('step',c?.title,'| pills',J(c?.pills,200),'| rows',J(c?.rows?.map(r=>[r.subtitle,r.charge,r.note]),400),'| btns',J(b,400));
  if(!c) break; await p.screenshot({path:`ev/${A.tag}-fin${i}.png`});
  const st=p.locator('.q-dialog [data-test-id^="input_tech_story_"]');
  if(/tech stor/i.test(c.title) && await st.count()){ const e=st.first(); if(!(await e.inputValue())){ await e.click(); await p.keyboard.type('ZZAUTOTEST tech story',{delay:10}); } await p.keyboard.press('Tab'); await p.waitForTimeout(3000); continue; }
  const fin=b.map(x=>x.split('|')).find(([t,x])=>t==='button_complete_work_order'&&!/\(dis\)/.test(x)); if(fin){ await p.locator('.q-dialog [data-test-id="button_complete_work_order"]').click(); await p.waitForTimeout(5000); continue; }
  break; }
console.log('writes',J(W,1500)); console.log('console',cons.length,J(cons,400)); await s.close();
