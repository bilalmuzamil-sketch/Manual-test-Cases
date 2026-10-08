import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin,listRow} from './fin.mjs';
const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
const r=await s.api('/api/part-sales',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company_id:'91067a7e-46e1-4019-8e40-ff436abcc4cc'})}); const id=r.json?.data?.[0]?.id; console.log('create',r.status,id);
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(2000);
if(!(await s.box('select_part'))){ const b=await s.box('button_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200); }
const add=async(pn,last)=>{ let b=await s.box('select_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500); await p.keyboard.type(pn,{delay:60}); await p.waitForTimeout(2800);
  const o=await p.evaluate(pn=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(pn)&&/Inventory/.test(x.innerText));if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\n+/g,' | ')};},pn); console.log('opt',o?.t); await p.mouse.click(o.x,o.y); await p.waitForTimeout(1800);
  const bins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id')));
  if(bins.length){const l=p.locator(`[data-test-id="${bins[0]}"]`); const tag=await l.evaluate(e=>e.tagName); await (tag==='INPUT'?l:l.locator('input')).fill('1'); await p.waitForTimeout(500);}
  b=await s.box(last?'button_workorder_part_save':'button_workorder_part_save_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000); };
await add('2208H476',true);
const v=(await s.api('/api/work-orders/view/'+id)).json.data.work_order; const num=v.display_number; fs.writeFileSync('y.json',JSON.stringify({id,num}));
console.log(num,'fin',j(await fin(s,id))); await p.waitForTimeout(1000);
const kb=await p.evaluate(()=>[...document.querySelectorAll('button,i')].filter(x=>x.innerText.trim()==='more_vert'&&x.getBoundingClientRect().y>190&&x.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}));
for(const k of kb){ await p.mouse.click(k.x,k.y); await p.waitForTimeout(900); console.log('rowmenu',j(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n.*/,'')+' ['+(e.getAttribute('data-test-id')||'')+']')),500)); await p.keyboard.press('Escape'); await p.waitForTimeout(400);}
console.log('rows',j(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160))),800));
await s.close();
