import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
const inv=await s.api('/api/inventory/parts?search=MD668D'); console.log('stock MD668D',J((inv.json?.data?.collection||[]).map(x=>[x.part_number,x.quantity]),200));
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
if(await p.locator('.q-dialog [data-test-id="button_close_dialog"]').count()){ await p.locator('.q-dialog [data-test-id="button_close_dialog"]').click(); await p.waitForTimeout(1000); }
await p.locator('[data-test-id="button_part_sale_nav_bar_menu"]').click(); await p.waitForTimeout(800);
console.log('menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim().replace(/\s+/g,' ')+(e.classList.contains('disabled')?'(dis)':''))),400));
const n=s.writes.length; const c=await s.confirm('menu_item_onDelete'); await p.waitForTimeout(1500);
console.log('dlg',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim())),300));
const b=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim()));
const del=(b.find(x=>/\|(Delete|Yes|Confirm)$/i.test(x))||'').split('|')[0]; if(del) await s.confirm(del); await p.waitForTimeout(2500);
console.log('writes',s.writes.slice(n).filter(x=>/work-orders|part-sales/.test(x)).join(' || ').slice(0,300));
const v=await s.api('/api/work-orders/view/'+A.ps_id); console.log('ps after',v.status,J(v.json,120));
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company; console.log('counts',J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable/.test(k))),300));
await s.close();
