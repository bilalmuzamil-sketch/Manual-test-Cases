import {op,j} from './lib.mjs'; import fs from 'fs';
const {ps}=JSON.parse(fs.readFileSync('prod/ps.json')); const s=await op({dpr:1}); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
await s.go(`/parts/part-sale/${ps}/part-requests`); await p.waitForTimeout(3000);
const ids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')));
console.log('ids0',(await ids()).filter(x=>/add|part/i.test(x)).join(','));
const b=await s.box('button_add_part')||await s.box('button_part_sale_add_part'); if(b) await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
console.log('ids1',(await ids()).filter(x=>/part|bin|select|save|input/i.test(x)).join(','));
const sp=await s.box('select_part')||await s.box('select_inline_part_number'); if(sp){ await p.mouse.click(sp.x,sp.y); await p.keyboard.type('1238042',{delay:60}); await p.waitForTimeout(3000);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\s+/g,' ').slice(0,100),x:r.x+r.width/2,y:r.y+r.height/2}})); console.log('opts',j(opts,500));
  const o=opts.find(x=>/1238042/.test(x.t)&&/Inventory/i.test(x.t))||opts.find(x=>/1238042/.test(x.t)); if(o){ await p.mouse.click(o.x,o.y); await p.waitForTimeout(2500); } }
const all=await ids(); console.log('ids2',all.filter(x=>/bin|save|qty|quantity/i.test(x)).join(','));
const bin=all.find(x=>/^input_bin_quantity_/.test(x)); if(bin){ const bb=await s.box(bin); await p.mouse.click(bb.x,bb.y); await p.keyboard.press('Control+A'); await p.keyboard.type('1'); }
const q=all.find(x=>x==='input_inline_part_quantity'); if(q){ const bb=await s.box(q); await p.mouse.click(bb.x,bb.y); await p.keyboard.press('Control+A'); await p.keyboard.type('1'); }
await p.waitForTimeout(800); const sv=await s.box('button_workorder_part_save')||await s.box('button_save_inline_part'); if(sv){ await p.mouse.click(sv.x,sv.y); } await p.waitForTimeout(4000);
const l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); console.log('lines',j(l.json,500));
await s.close();
