import {op as ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {toCores,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json'));
const s=await ob(); const p=s.page; await loc(s);
const cons=[]; p.on('console',m=>{ if(['error','warning'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,200)); });
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/(work|orders|inventory)/.test(r.url().replace(/.*\.com/,''))) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
const show=async n=>{ const c=await readCores(p); const b=await dlgButtons(p); console.log('\n#',n,c?.title,'|',J(c?.rows?.map(r=>[r.subtitle,r.charge,r.note]),500),'|',(c?.all?.match(/\d+ \/ \d+ resolved/)||[''])[0],(c?.all?.match(/\+\$[\d,.]+ to invoice/)||[''])[0],'| text',(c?.all||'').slice(0,300),'| btns',J(b.filter(x=>!/^button_resolve_core/.test(x)),400)); await p.screenshot({path:`ev/${A.tag}-${n}.png`}); return {c,b}; };
await toCores(s,A); let {c,b}=await show('c0');
await p.locator('.q-dialog button:has-text("OK · Returned")').first().click(); await p.waitForTimeout(900);
({c,b}=await show('c1-oneok'));
W.length=0; await p.locator('.q-dialog [data-test-id="button_defer_cores"]').click(); await p.waitForTimeout(5000);
console.log('writes on defer',J(W,1200)); ({c,b}=await show('c2-afterdefer'));
for(let i=0;i<3 && c;i++){ const nx=b.map(x=>x.split('|')).find(([t,x])=>!/cancel|close/i.test(t)&&!/\(dis\)/.test(x)&&!/^button_resolve_core_/.test(t)); if(!nx) break; console.log('click',nx.join('|')); W.length=0; await p.locator(`.q-dialog [data-test-id="${nx[0]}"]`).click(); await p.waitForTimeout(5000); console.log('writes',J(W,1200)); ({c,b}=await show('c3-'+i)); }
console.log('console',cons.length,J(cons,400)); await s.close();
