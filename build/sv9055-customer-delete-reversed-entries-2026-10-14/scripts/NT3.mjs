import {op,J} from './lib.mjs'; import {loc,invoiced,payUI} from './seed.mjs'; import fs from 'fs';
const s=await op(); const p=s.page; await loc(s);
// try 2: invoiced, not paid
const B=await invoiced(s,'ZZAUTOTEST SV9055 delete-invoiced-WO '+Date.now()%100000); fs.writeFileSync('NT3.json',JSON.stringify(B));
await s.go('/workorders/'+B.work_order_id+'/finance'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
console.log('B status',J(await p.evaluate(()=>document.querySelector('.q-badge, .q-chip')?.innerText),80),'menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())),200));
await p.keyboard.press('Escape');
const out=await p.evaluate(async()=>{const r=await fetch('https://api.shopview.com/api/work-orders/delete',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:location.pathname.split('/')[2]})}); return r.status+' '+(await r.text()).slice(0,200);});
console.log('B DELETE ->',out);
const after=await s.api('/api/work-orders/view/'+B.work_order_id); console.log('B after',after.status);
// ready example: paid, left in place
const E=await invoiced(s,'ZZAUTOTEST SV9055 paid-WO example '+Date.now()%100000); await payUI(s,E,'ZZ9055-EX'); fs.writeFileSync('NT4.json',JSON.stringify(E));
const w=(await s.api('/api/work-orders/view/'+E.work_order_id)).json?.data; console.log('example',E.work_order_id,J(w?.work_order?.number||w?.number,80),'customer',E.company_id);
await s.go('/workorders/'+E.work_order_id+'/finance'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
console.log('E menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())),200), 'title',J(await p.evaluate(()=>document.body.innerText.match(/S2-\d+/)?.[0]),40));
await s.close();
