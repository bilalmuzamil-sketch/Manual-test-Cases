// usage: [ENV=prod] node wofx.mjs <tag> -> WO Lines tab: part-row Receive buttons; clicks the first and dumps what opens (modal or page)
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${process.argv[2]}.json`,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-explore-${process.argv[2]}`; fs.mkdirSync(OUT,{recursive:true});
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000);
const btns=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/receive|part_request_action/i.test(b.getAttribute('data-test-id')+b.innerText)).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().slice(0,40)));
console.log('buttons',btns); await p.screenshot({path:OUT+'/wo-lines.png'});
const b=p.locator('[data-test-id="button_part_request_action"]').first(); if(await b.count()){ await b.click(); await p.waitForTimeout(4500); }
const d=await p.evaluate(()=>({url:location.pathname+location.search,dialog:[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,600)),
  inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>(i.getAttribute('data-test-id')||i.closest('[data-test-id]')?.getAttribute('data-test-id')||'?')+'='+i.value+(i.readOnly?' RO':'')+(i.disabled?' DIS':''))}));
console.log(JSON.stringify(d).slice(0,2500)); await p.screenshot({path:OUT+'/wo-receive.png'}); await s.close(); process.exit(0);
