// usage: [ENV=prod] node explore.mjs <tag> [url-suffix] -> opens the PO page and its receive view; dumps buttons, inputs (readonly/disabled), headers; screenshots
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${process.argv[2]}.json`,'utf8')); const po=S.parts[0].order.orderId;
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-explore-${process.argv[2]}`; fs.mkdirSync(OUT,{recursive:true});
const dump=async()=>p.evaluate(()=>({url:location.pathname+location.search,
  headers:[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()),
  buttons:[...document.querySelectorAll('button,[role=button]')].filter(b=>b.offsetParent&&b.getAttribute('data-test-id')).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().slice(0,30)+(b.disabled?'(disabled)':'')),
  inputs:[...document.querySelectorAll('input,textarea')].filter(i=>i.offsetParent).map(i=>(i.getAttribute('data-test-id')||i.closest('[data-test-id]')?.getAttribute('data-test-id')||i.name||'?')+'='+i.value+(i.readOnly?' RO':'')+(i.disabled?' DIS':'')),
  rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,200))}));
await s.go('/order/'+po); await p.waitForTimeout(3500); await p.screenshot({path:OUT+'/po.png'}); const a=await dump(); console.log('PO PAGE',JSON.stringify(a,null,0).slice(0,2500));
await s.go('/order/'+po+'?receive=1'+(process.argv[3]||'')); await p.waitForTimeout(4000); await p.screenshot({path:OUT+'/receive.png'}); const b=await dump(); console.log('RECEIVE',JSON.stringify(b,null,0).slice(0,3000));
fs.writeFileSync(OUT+'/dump.json',JSON.stringify({a,b},null,1)); await s.close(); process.exit(0);
