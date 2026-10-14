// usage: node W4.mjs <tag> '<json: {"<invoice#>":"ok"|"notok"}>' [finish]
import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {toCores,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const plan=JSON.parse(process.argv[3]); const finish=process.argv[4]==='finish';
const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
await toCores(s,A);
const c0=await readCores(p); console.log('before',J(c0.rows.map(r=>[r.subtitle,r.charge,r.note]),600));
console.log('aria',J(c0.rows.map(r=>[r.ok?.aria,r.notok?.aria]),800));
for(const [inv,dec] of Object.entries(plan)){ const r=c0.rows.find(x=>(x.subtitle||'').includes(inv)); if(!r){console.log('no row for',inv);continue;}
  await p.locator(`[data-test-id="button_resolve_core_${dec==='ok'?'ok':'not_ok'}_${r.key}"]`).click(); await p.waitForTimeout(900); }
const c1=await readCores(p); console.log('after',J(c1.rows.map(r=>[r.subtitle,r.charge,r.note,r.done]),900));
const txt=c1.all; console.log('counter',(txt.match(/\d+ \/ \d+ resolved/)||[])[0],'| total',(txt.match(/\+\$[\d,.]+ to invoice/)||['(none)'])[0]);
console.log('btns',J(await dlgButtons(p),500));
fs.writeFileSync(`data-${A.tag}-decided.json`,JSON.stringify({c0,c1},null,1));
await p.screenshot({path:`ev/${A.tag}-decided.png`});
if(finish){ const n=s.writes.length; await p.locator('[data-test-id="button_complete_work_order"]').click(); await p.waitForTimeout(3500);
  console.log('after finish dialog',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300))),600));
  console.log('btns2',J(await dlgButtons(p),400));
  await p.screenshot({path:`ev/${A.tag}-finish1.png`});
  console.log('finish writes',J(s.writes.slice(n).filter(w=>!/sentry|recent-entities/i.test(w)),1500)); }
fs.writeFileSync(`console-${A.tag}.txt`,cons.join('\n')); console.log('console',cons.length,J(cons.filter(c=>/error|duplicate key/i.test(c)),600));
await s.close();
