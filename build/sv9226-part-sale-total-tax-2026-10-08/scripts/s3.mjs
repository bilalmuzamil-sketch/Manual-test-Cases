import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
const v=(await s.api('/api/work-orders/view/a5c60dcd-95ef-4f99-b937-eec856ee7692')).json.data.work_order; console.log('company',j(v.company||v.company_id||Object.keys(v),400));
const inv=(await s.api('/api/inventory/parts?limit=100&search=')).json.data.collection; const cored=inv.filter(x=>Number(x.core_charge)>0&&x.quantity>0); const plain=inv.filter(x=>!(Number(x.core_charge)>0)&&x.quantity>3);
console.log('cored',j(cored.slice(0,5).map(x=>[x.part_number,x.name.slice(0,25),x.quantity,x.core_charge,x.sell_price])));
console.log('plain',j(plain.slice(0,5).map(x=>[x.part_number,x.name.slice(0,25),x.quantity,x.sell_price])));
await s.go(`/parts/part-sale/a5c60dcd-95ef-4f99-b937-eec856ee7692/part-requests`); await p.waitForTimeout(2500);
const b=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,i')].find(x=>x.innerText.trim()==='more_vert'&&x.getBoundingClientRect().y<130&&x.getBoundingClientRect().x>1300);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('kebab',j(b)); if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(1000); console.log('menu',j(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+' ['+(e.getAttribute('data-test-id')||'')+']')),800)); }
await s.close();
