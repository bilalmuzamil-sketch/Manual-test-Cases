import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
let n=s.writes.length; await p.locator('[data-test-id="button_part_sale_action_authorized"]').click(); await p.waitForTimeout(3000);
console.log('auth',s.writes.slice(n).filter(x=>/work-orders/.test(x)).join(' || ').slice(0,300));
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.trim().slice(0,20)).filter(t=>/action|pick|button_part_request/i.test(t)));
console.log('tids',J(t,600));
const pick=p.locator('button').filter({hasText:/^\s*Pick\s*$/}).first();
if(await pick.count()){ n=s.writes.length; await pick.click(); await p.waitForTimeout(2500); console.log('dlg',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim())),300));
 console.log('pick',s.writes.slice(n).filter(x=>/work-orders|part/.test(x)).join(' || ').slice(0,300)); }
const v=await s.api('/api/work-orders/'+A.ps_id+'/parts/list-requests-by-line'); console.log('parts',J(v.json,500));
await p.screenshot({path:'ev/ps2.png'}); await s.close();
