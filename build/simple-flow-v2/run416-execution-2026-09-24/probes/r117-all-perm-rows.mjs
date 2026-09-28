// List every permission row in the role editor, by its exact name, so no future pass has to guess.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
console.log(await page.evaluate(()=>{const r=[...document.querySelectorAll('tr')].find(t=>/ZZAUTOTEST Review Only/.test(t.innerText||''));
  const b=r&&[...r.querySelectorAll('.q-btn,button')].find(e=>/edit/.test(e.innerText||'')); if(!b)return 'not found'; b.click(); return 'opened a role';}));
await page.waitForTimeout(12000);
const rows=await page.evaluate(()=>{
  const out=[];
  for(const row of document.querySelectorAll('tr,div')){
    const r=row.getBoundingClientRect(); if(r.width<400||!r.height) continue;
    const cbs=[...row.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
    if(cbs.length<2||cbs.length>4) continue;
    const txt=(row.innerText||'').replace(/\s+/g,' ').trim();
    if(txt.length>120) continue;
    const on=c=>c.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test(c.className)||!!c.querySelector('.q-checkbox__inner--truthy');
    out.push({name:txt.slice(0,60), boxes:cbs.map(on)});
  }
  const seen=new Set(); return out.filter(o=>{if(seen.has(o.name))return false; seen.add(o.name); return true;});});
console.log('\nevery permission row, with View / Create&Edit / Delete as it stands:');
rows.forEach(r=>console.log('  ',JSON.stringify(r.boxes),r.name));
const tgs=await page.evaluate(()=>{const out=[];
  for(const t of document.querySelectorAll('.q-toggle')){ if(!t.getBoundingClientRect().width) continue;
    let row=t.parentElement,label='';
    for(let i=0;i<5&&row;i++){ const x=(row.innerText||'').replace(/\s+/g,' ').trim(); if(x&&x.length<70){label=x;break;} row=row.parentElement; }
    out.push({label:label.slice(0,50), on:t.getAttribute('aria-checked')==='true'});}
  return out;});
console.log('\nthe switches inside permissions:');
tgs.forEach(t=>console.log('  ',t.on?'ON ':'off',t.label));
fs.writeFileSync(`${EV}/r117-all-perm-rows.json`,JSON.stringify({rows,tgs},null,1));
await browser.close();
