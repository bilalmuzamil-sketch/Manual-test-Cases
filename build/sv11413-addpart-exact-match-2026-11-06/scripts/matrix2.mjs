// for each query in QS (| separated, use EMPTY for blank): full option list from the inline Add Part search; saves ../ev/<env>-matrix.json
import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; const out={}; const api={};
p.on('response',async r=>{ const u=r.url(); if(/inventory-parts-as-options-with-remaining-catalogue-parts/.test(u)){ try{ const q=decodeURIComponent((u.match(/search=([^&]*)/)||[])[1]||''); (api[q]=api[q]||[]).push({url:u.replace(/^https:\/\/[^/]+/,''),body:await r.json()}); }catch{} } });
await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000); await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(2500);
for(const q0 of process.env.QS.split('|')){ const q=q0==='EMPTY'?'':q0; const sel=p.locator('[data-test-id="select_inline_part_number"]').first(); await sel.click(); await p.waitForTimeout(800);
  await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.waitForTimeout(1500); if(q) await p.keyboard.type(q,{delay:70}); await p.waitForTimeout(4500);
  // scroll the menu to load everything
  for(let i=0;i<15;i++){ await p.evaluate(()=>{const m=document.querySelector('.q-menu'); if(m) m.scrollTop=m.scrollHeight;}); await p.waitForTimeout(300); }
  out[q0]=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
  console.log(q0,out[q0].length); await p.screenshot({path:`../ev/${E}-q-${q0.replace(/[^A-Za-z0-9]/g,'_')}.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
fs.writeFileSync(`../ev/${E}-matrix.json`,JSON.stringify(out,null,1)); fs.writeFileSync(`../ev/${E}-api2.json`,JSON.stringify(api)); for(const [k,v] of Object.entries(api)) console.log('Q',JSON.stringify(k),'responses',v.length,v.map(x=>(decodeURIComponent(x.url).match(/page\]=(\d+)/)||[])[1]+':'+((x.body.data.collection||x.body.data).length)).join(' ')); await s.close(); process.exit(0);
