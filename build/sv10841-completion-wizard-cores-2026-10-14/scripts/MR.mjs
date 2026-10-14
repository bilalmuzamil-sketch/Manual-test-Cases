import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/(work|orders|inventory)/.test(r.url().replace(/.*\.com/,''))) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(5000);
await p.locator('[data-test-id="button_mark_reviewed"]').click(); await p.waitForTimeout(3000);
const c=await readCores(p); const b=await dlgButtons(p);
console.log('dialog',c?.title,'|',J(c?.rows?.map(r=>[r.subtitle,r.charge,r.note]),600),'|',(c?.all||'').slice(0,500),'\nbtns',J(b,700),'\nwrites',J(W,500),'\nconsole',J(cons,300));
await p.screenshot({path:`ev/${A.tag}-markreviewed.png`}); fs.writeFileSync(`data-${A.tag}-markreviewed.json`,JSON.stringify(c,null,1)); await s.close();
