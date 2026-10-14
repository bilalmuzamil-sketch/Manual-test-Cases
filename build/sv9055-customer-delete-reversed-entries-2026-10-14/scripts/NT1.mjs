import {op,J,post} from './lib.mjs'; import {loc,invoiced,payUI} from './seed.mjs'; import fs from 'fs';
const s=await op(); const p=s.page; await loc(s);
console.log('marker',J(await s.marker(),200));
const A=await invoiced(s,'ZZAUTOTEST SV9055 delete-paid-WO '+Date.now()%100000);
await payUI(s,A,'ZZ9055-NT1'); fs.writeFileSync('NT1.json',JSON.stringify(A));
const wo=(await s.api('/api/work-orders/view/'+A.work_order_id)); console.log('wo view',wo.status,J(wo.json?.data?.work_order?.number||wo.json?.data,300));
// finance tab before
await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(4000);
await p.screenshot({path:'ev/NT1-1-finance.png'});
const fin=await p.evaluate(()=>document.body.innerText.slice(0,1500)); fs.writeFileSync('NT1.fin.txt',fin);
// menu
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1200);
const menu=await p.evaluate(()=>{const m=document.querySelector('.q-menu'); const r=m.getBoundingClientRect();
 return {items:[...m.querySelectorAll('.q-item')].map(e=>e.innerText.trim()),box:{x:r.x,y:r.y,w:r.width,h:r.height}}});
const btn=await s.box('button_work_order_nav_bar_menu'); console.log('menu',J(menu,500),'btn',J(btn,200));
fs.writeFileSync('NT1.menu.json',JSON.stringify({menu,btn,url:p.url()}));
await p.screenshot({path:'ev/NT1-2-menu.png'});
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
// the literal console script a reader would paste
const host=await p.evaluate(()=>location.host); console.log('host',host);
const out=await p.evaluate(async()=>{const r=await fetch('https://api.shopview.com/api/work-orders/delete',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:location.pathname.split('/')[2]})}); return r.status+' '+(await r.text()).slice(0,300);});
console.log('DELETE ->',out); fs.writeFileSync('NT1.delete.txt',out);
await p.reload(); await p.waitForTimeout(4000); await p.screenshot({path:'ev/NT1-3-after.png'});
const after=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo view after',after.status,J(after.json||after.text,300));
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
console.log('customer after',J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable|balance/.test(k))),400));
await s.close();
