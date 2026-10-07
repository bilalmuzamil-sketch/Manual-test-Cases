import {ob,j} from './lib.mjs'; import fs from 'fs';
const {ps}=JSON.parse(fs.readFileSync('ps.json')); const s=await ob(); const p=s.page;
await s.go(`/parts/part-sale/${ps}/part-requests`);
const ids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')));
console.log('ids0',(await ids()).filter(x=>/add|part/i.test(x)).join(','));
const b=await s.box('button_add_part')||await s.box('button_part_sale_add_part'); if(b) await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
console.log('ids1',(await ids()).filter(x=>/part|bin|select|save|input/i.test(x)).join(','));
const sp=await s.box('select_part'); if(sp){ await p.mouse.click(sp.x,sp.y); await p.keyboard.type('84-2005',{delay:60}); await p.waitForTimeout(3000);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().slice(0,80),x:r.x+r.width/2,y:r.y+r.height/2}})); console.log('opts',j(opts,400));
  const o=opts.find(x=>/84-2005/.test(x.t)); if(o){ await p.mouse.click(o.x,o.y); await p.waitForTimeout(2500); } }
console.log('ids2',(await ids()).filter(x=>/bin|save|qty|quantity/i.test(x)).join(','));
const bin=(await ids()).find(x=>/^input_bin_quantity_/.test(x)); if(bin){ await p.fill(`[data-test-id="${bin}"] input, input[data-test-id="${bin}"]`,'1').catch(async()=>{const bb=await s.box(bin); await p.mouse.click(bb.x,bb.y); await p.keyboard.type('1');}); }
await p.waitForTimeout(800); const sv=await s.box('button_workorder_part_save'); if(sv){ await p.mouse.click(sv.x,sv.y); } await p.waitForTimeout(4000);
console.log(s.writes.slice(-6).join('\n'));
const l=await s.api(`/api/work-orders/${ps}/parts/list-requests-by-line`); console.log('lines',j(l.json,500));
await s.shot('ps-after-add','/tmp/qa10142/raw'); await s.close();
