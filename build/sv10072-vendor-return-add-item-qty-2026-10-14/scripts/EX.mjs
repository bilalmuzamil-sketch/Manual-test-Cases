// usage: node EX.mjs <env staging|prod> <pn> <partId> <returnId> <qty> <tag>
import {os,op,J,post} from './lib.mjs'; import fs from 'fs';
const [env,pn,pid,rid,qty,tag]=process.argv.slice(2); const API=env==='prod'?'https://api.shopview.com':'https://api.staging.shopview.com';
const s=env==='prod'?await op():await os(); const p=s.page;
await post(s,'/api/iam/change-location',env==='prod'?{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'}:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const inv=async n=>{ await s.go('/parts/inventory'); await p.waitForTimeout(3500);
  const cl=p.locator('[data-test-id^="filter_chip_clear_"]'); for(let i=0;i<4 && await cl.count();i++){ const bb=await cl.first().boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(1800); }
  await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(800); await p.keyboard.type(pn,{delay:40}); await p.waitForTimeout(3500);
  const row=await p.evaluate(id=>{const g=t=>{const e=document.querySelector(`[data-test-id="${t}${id}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return {t:(e.innerText||'').trim().replace(/\s+/g,' '),b:[r.x,r.y,r.width,r.height].map(Math.round)}}; return {name:g('table_cell_name_'),stock:g('stock_quantity_badge_'),hist:g('button_part_history_')};},pid);
  console.log(n,'inventory',J(row,400)); await p.screenshot({path:`ev/${tag}-${n}-inventory.png`});
  await s.go(`/parts/history/${pid}`); await p.waitForTimeout(3500);
  const h=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(0,3).map(r=>{const b=r.getBoundingClientRect();return {t:r.innerText.replace(/\s+/g,' ').slice(0,160),b:[b.x,b.y,b.width,b.height].map(Math.round)}}));
  console.log(n,'history',J(h,700),'url',p.url()); await p.screenshot({path:`ev/${tag}-${n}-history.png`}); return {row,h}; };
const before=await inv('before');
await s.go('/parts/inventory'); await p.waitForTimeout(2500);
const script=`fetch('${API}/api/inventory/returns/add-item',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({return_id:'${rid}',inventory_part_id:'${pid}',quantity:'${qty}',credits:10})}).then(async r=>({status:r.status,body:await r.text()}))`;
const t0=new Date().toISOString(); const res=await p.evaluate(sc=>eval(sc),script); console.log('script',script); console.log('result',t0,J(res,300));
const after=await inv('after');
fs.writeFileSync(`ex-${tag}.json`,JSON.stringify({env,pn,pid,rid,qty,script,t0,res,before,after,marker:await s.marker()},null,1)); console.log('marker',J(await s.marker(),200)); await s.close();
