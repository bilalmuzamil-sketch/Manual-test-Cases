import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const log={mk:await s.marker()};
const R=()=>p.evaluate(()=>{const e=document.querySelector('[data-test-id=select_sales_rep]'); const f=e.closest('.q-field')||e; const c=e.closest('.q-card'); const a=f.getBoundingClientRect(), b=c.getBoundingClientRect(); return {v:e.innerText.replace(/\s+/g,' ').trim(),field:{x:a.x,y:a.y,w:a.width,h:a.height},card:{x:b.x,y:b.y,w:b.width,h:b.height}};});
const pick=async name=>{ const r=await R(); await p.mouse.click(r.field.x+r.field.w/2,r.field.y+r.field.h/2); await p.waitForTimeout(1200); const it=await p.$(`.q-menu .q-item:has-text("${name}")`); const b=await it.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(2500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(500); };
try{ const id='4bd134c2-12c7-4721-8c0d-f9100a1d3576';
 await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(5000); await p.mouse.move(700,880); log.r0=await R(); await p.screenshot({path:'/tmp/qa11310/ex21/ps-0.png'});
 await pick('Ahtasham Admin'); log.r1=await R(); await p.mouse.move(700,880); await p.screenshot({path:'/tmp/qa11310/ex21/ps-1-changed.png'});
 await p.reload(); await p.waitForTimeout(6000); await p.mouse.move(700,880); log.r2=await R(); await p.screenshot({path:'/tmp/qa11310/ex21/ps-2-reloaded.png'});
 await pick('Unassigned'); await p.reload(); await p.waitForTimeout(5000); log.r3=await R();
}catch(e){ log.err=e.message.slice(0,300); }
fs.writeFileSync('/tmp/qa11310/ex21/cap23.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log).slice(0,1500)); await s.close();
