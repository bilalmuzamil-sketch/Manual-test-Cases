import {session,toView} from './rec.mjs'; import fs from 'fs';
const out={};
for(const q of ['admin','tech']){
  const s=await session({quick:q,vp:{width:1920,height:900},dpr:2}); const p=s.page; out.mk=await s.marker();
  await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.mouse.move(1900,880); await p.waitForTimeout(1000);
  out[q]=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_tech_view] th')].map(t=>{const r=t.getBoundingClientRect();return {t:t.innerText.trim(),x:r.x,y:r.y,w:r.width,h:r.height};}).filter(x=>x.t));
  await p.screenshot({path:`/tmp/qa11310/c7-${q}.png`}); console.log(q,out[q].map(x=>x.t).join(' | '),'right edge',Math.max(...out[q].map(x=>x.x+x.w))); await s.close(); }
fs.writeFileSync('/tmp/qa11310/c7.json',JSON.stringify(out,null,1));
