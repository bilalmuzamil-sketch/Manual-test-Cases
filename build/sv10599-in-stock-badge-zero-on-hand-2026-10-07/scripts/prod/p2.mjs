import {op,j} from '../lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('prod/wo.json')); const s=await op({dpr:2}); const p=s.page;
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(1500);
const add=async(pn,shot)=>{ let b=await s.box('button_add_part'); await p.mouse.click(b.x,b.y); await s.waitFor('select_inline_part_number');
 b=await s.box('select_inline_part_number'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500); await p.keyboard.type(pn,{delay:60}); await p.waitForTimeout(3500);
 const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\n+/g,' | ').slice(0,160),x:r.x+r.width/2,y:r.y+r.height/2,g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
 console.log('opts',j(opts.map(o=>o.t),500)); if(shot){await s.shot(shot,'prod'); fs.writeFileSync(`prod/${shot}.json`,JSON.stringify(opts));}
 const o=opts.find(x=>x.t.includes(pn)&&/Inventory/.test(x.t))||opts[0]; await p.mouse.click(o.x,o.y); await p.waitForTimeout(1800);
 const q=p.locator('[data-test-id="input_inline_part_quantity"]'); const tag=await q.evaluate(e=>e.tagName); await (tag==='INPUT'?q:q.locator('input')).fill('1');
 b=await s.box('button_save_inline_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(4000); };
await add(W.zero,'P1-picker'); await add(W.pos,null);
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(2000);
const rows=await p.evaluate(pns=>{const out=[];const leaves=[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&pns.includes((e.innerText||'').trim()));
 for(const l of leaves){let e=l;for(let i=0;i<8;i++){if(e.parentElement&&e.parentElement.innerText.length<250)e=e.parentElement;else break;}
 const chips=[...e.querySelectorAll('.q-badge,.q-chip')].map(c=>{const g=c.getBoundingClientRect();return {t:c.innerText.trim(),g:[g.x,g.y,g.width,g.height].map(Math.round)};}); const g=e.getBoundingClientRect(); out.push({part:l.innerText.trim(),chips,g:[g.x,g.y,g.width,g.height].map(Math.round)});} return out;},[W.zero,W.pos]);
console.log('rows',j(rows,800)); fs.writeFileSync('prod/P2-lines.json',JSON.stringify(rows)); await s.shot('P2-lines','prod');
const ls=(await s.api('/api/work-orders/lines/'+W.wo)).json.data.collection.flatMap(l=>l.part_requests||[]).map(r=>({pn:r.part_number,st:r.status,id:r.id||r.part_request_id})); console.log('api',j(ls)); fs.writeFileSync('prod/parts.json',JSON.stringify(ls));
const inv=[]; for(const pn of [W.zero,W.pos]){const x=(await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.find(y=>y.part_number===pn); inv.push([pn,x?.quantity]);} console.log('inventory',j(inv));
console.log(j(await s.marker()));
await s.close();
