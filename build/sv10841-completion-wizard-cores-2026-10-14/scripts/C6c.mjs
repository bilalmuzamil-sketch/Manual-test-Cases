import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {openWizard,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json'));
const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\//.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
const step=async(n)=>{ const c=await readCores(p); const b=await dlgButtons(p); console.log('\n#',n,'title',c?.title,'| pills',J(c?.pills,300),'\n rows',J(c?.rows.map(r=>[r.key.slice(0,8),r.subtitle,r.charge,r.note,r.done,r.ok?.cls?.includes('selected')]),900),'\n text',(c?.all||'').slice(0,600),'\n btns',J(b,700)); await p.screenshot({path:`ev/${A.tag}-${n}.png`}); fs.writeFileSync(`data-${A.tag}-${n}.json`,JSON.stringify(c,null,1)); return {c,b}; };
await openWizard(s,A); await p.waitForTimeout(1000);
await p.locator('.q-dialog [data-test-id="pill_step_resolve-cores"]').click().catch(e=>console.log('pill click err',e.message.slice(0,100))); await p.waitForTimeout(2000);
let {c,b}=await step('p1-pill');
if(c?.rows?.length){ for(const r of c.rows){ await p.locator(`[data-test-id="button_resolve_core_ok_${r.key}"]`).click(); await p.waitForTimeout(800);} ({c,b}=await step('p2-okbeforepick'));
  console.log('writes so far',J(W,800));
  await p.locator('.q-dialog [data-test-id="pill_step_pick"], .q-dialog [data-test-id^="pill_step_pick"]').first().click().catch(e=>console.log('pick pill err',e.message.slice(0,80))); await p.waitForTimeout(2000);
  ({c,b}=await step('p3-pickstep'));
  W.length=0; await p.locator('.q-dialog [data-test-id="button_pick_all"]').click().catch(e=>console.log('pickall err',e.message.slice(0,80))); await p.waitForTimeout(4000);
  console.log('writes on pick',J(W,1500)); ({c,b}=await step('p4-afterpick'));
  W.length=0; await p.locator('.q-dialog [data-test-id="button_complete_work_order"]').click(); await p.waitForTimeout(5000); console.log('writes on finish',J(W.filter(x=>!/envelope/.test(x)),1500)); ({c,b}=await step('p5-afterfinish'));
}
console.log('console',cons.length,J(cons,600)); await s.close();
