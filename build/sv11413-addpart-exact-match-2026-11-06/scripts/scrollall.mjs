// type Q in the Add Part search, scroll the dropdown step by step and collect every rendered row; report whether LOOK strings appear
import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000); await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(2500);
await p.click('[data-test-id="select_inline_part_number"]'); await p.waitForTimeout(800); await p.keyboard.type(process.env.Q,{delay:80}); await p.waitForTimeout(5000);
await p.screenshot({path:`../ev/${E}-scroll-${process.env.Q}-top.png`}); const seen=new Set();
for(let i=0;i<400;i++){ const rows=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim())); rows.forEach(r=>seen.add(r));
  const done=await p.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return true; const at=m.scrollTop+m.clientHeight>=m.scrollHeight-2; m.scrollTop+=m.clientHeight*0.8; return at;}); await p.waitForTimeout(120); if(done) break; }
await p.screenshot({path:`../ev/${E}-scroll-${process.env.Q}-bottom.png`});
console.log(E,'rows seen on screen',seen.size); for(const l of process.env.LOOK.split('|')) console.log('  ',JSON.stringify(l),[...seen].some(r=>r.toUpperCase().includes(l.toUpperCase()))?'SHOWN':'NOT SHOWN');
fs.writeFileSync(`../ev/${E}-scroll-${process.env.Q}.json`,JSON.stringify([...seen],null,1)); await s.close(); process.exit(0);
