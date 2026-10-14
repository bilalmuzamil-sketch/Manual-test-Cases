import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {toCores,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('S8.json')); const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
await toCores(s,A); const c0=await readCores(p);
for(const r of c0.rows){ await p.locator(`[data-test-id="button_resolve_core_not_ok_${r.key}"]`).click(); await p.waitForTimeout(700); }
const c1=await readCores(p); console.log('after',J(c1.rows.map(r=>[r.subtitle,r.charge,r.note]),700)); console.log('counter',(c1.all.match(/\d+ \/ \d+ resolved/)||[])[0],'| total',(c1.all.match(/\+\$[\d,.]+ to invoice/)||['(none)'])[0]);
await p.screenshot({path:'ev/S8-decided.png'}); fs.writeFileSync('data-S8-decided.json',JSON.stringify(c1,null,1));
const b=await dlgButtons(p); console.log('btns',J(b,900));
const next=b.map(x=>x.split("|")).find(([t,x])=>t==="button_resolve_cores_continue");
console.log('next',J(next));
if(next){ await p.locator(`.q-dialog [data-test-id="${next[0]}"]`).click(); await p.waitForTimeout(2500);
  const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return {t:d?.querySelector('[data-test-id="dialog_title"]')?.innerText,txt:d?.innerText.replace(/\s+/g,' ').slice(0,900),tids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,60)};});
  console.log('step2',J(d,2000)); await p.screenshot({path:'ev/S8-receive-step.png'});
  const b2=await dlgButtons(p); console.log('btns2',J(b2,700));
  const back=b2.map(x=>x.split('|')).find(([t,x])=>/back/i.test(t+x));
  if(back){ await p.locator(`.q-dialog [data-test-id="${back[0]}"]`).click(); } else { await p.locator('.q-dialog [data-test-id="pill_step_resolve-cores"]').click(); }
  await p.waitForTimeout(2000); const c2=await readCores(p);
  console.log('back via',back?back[0]:'pill','| rows',J(c2?.rows.map(r=>[r.subtitle,r.charge,r.note]),800),'| counter',(c2?.all.match(/\d+ \/ \d+ resolved/)||[])[0],'| total',(c2?.all.match(/\+\$[\d,.]+ to invoice/)||['(none)'])[0]);
  await p.screenshot({path:'ev/S8-back.png'}); fs.writeFileSync('data-S8-back.json',JSON.stringify(c2,null,1)); }
console.log('console',cons.length,J(cons,500)); await s.close();
