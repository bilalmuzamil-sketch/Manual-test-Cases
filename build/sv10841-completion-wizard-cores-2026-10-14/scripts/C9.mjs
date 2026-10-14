import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {openWizard,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json'));
const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/(work|orders|inventory)/.test(r.url().replace(/.*\.com/,''))) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
await openWizard(s,A);
for(let i=0;i<6;i++){ const c=await readCores(p); const b=await dlgButtons(p); if(!c) break;
  console.log('\nstep',c.title,'| pills',J(c.pills,250),'| rows',J(c.rows.map(r=>[r.subtitle,r.charge,r.note]),500),'|',(c.all.match(/\d+ \/ \d+ resolved/)||[''])[0],(c.all.match(/\+\$[\d,.]+ to invoice/)||[''])[0],'| btns',J(b.filter(x=>!/^button_resolve_core/.test(x)),400));
  await p.screenshot({path:`ev/${A.tag}-w${i}.png`}); fs.writeFileSync(`data-${A.tag}-w${i}.json`,JSON.stringify(c,null,1));
  const st=p.locator('.q-dialog [data-test-id^="input_tech_story_"]');
  if(/tech stor/i.test(c.title) && await st.count()){ const e=st.first(); if(!(await e.inputValue())){ await e.click(); await p.keyboard.type('ZZAUTOTEST tech story',{delay:10}); } await p.keyboard.press('Tab'); await p.waitForTimeout(3000); continue; }
  if(/core/i.test(c.title) && c.rows.some(r=>!r.note)){ for(const r of c.rows){ await p.locator(`[data-test-id="button_resolve_core_not_ok_${r.key}"]`).click(); await p.waitForTimeout(800);} continue; }
  if(b.some(x=>x.startsWith('button_complete_work_order|')&&!/\(dis\)/.test(x))){ await p.locator('.q-dialog [data-test-id="button_complete_work_order"]').click(); await p.waitForTimeout(5000); continue; }
  const nx=b.map(x=>x.split('|')).find(([t,x])=>!/cancel|close|defer/i.test(t)&&!/\(dis\)/.test(x)&&!/^button_resolve_core_/.test(t)); if(nx){ console.log('click',nx[0]); await p.locator(`.q-dialog [data-test-id="${nx[0]}"]`).click(); await p.waitForTimeout(4000); continue; }
  break; }
console.log('\nwrites',J(W,1500)); console.log('console',cons.length,J(cons,400)); await s.close();
