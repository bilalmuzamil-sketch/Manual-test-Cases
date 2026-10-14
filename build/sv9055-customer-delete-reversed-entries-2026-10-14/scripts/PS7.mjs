import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_part_sale_nav_bar_menu"]').click(); await p.waitForTimeout(800);
await p.locator(`[data-test-id="menu_item_set_status"]`).click(); await p.waitForTimeout(1200);
const sub=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim().replace(/\s+/g,' ')));
console.log('submenu',J(sub,600));
const ap=sub.find(x=>/approved$/i.test(x)||/\|Approved/i.test(x));
if(ap){ const n=s.writes.length; await p.locator(`[data-test-id="${ap.split('|')[0]}"]`).click(); await p.waitForTimeout(1500);
  const c=await s.confirm('button_confirm_dialog').catch(e=>({e:String(e)})); await p.waitForTimeout(2000);
  console.log('setstatus',s.writes.slice(n).filter(x=>/work-orders/.test(x)).join(' || ').slice(0,300)); }
const v=await s.api('/api/work-orders/view/'+A.ps_id); console.log('ps status',v.json?.data?.work_order?.status);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3000);
await p.locator('[data-test-id^="button_part_request_menu_"]').first().click(); await p.waitForTimeout(1000);
console.log('part menu now',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim())),500));
await s.close();
