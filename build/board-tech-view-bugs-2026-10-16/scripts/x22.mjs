import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
await s.go('/workorders?tab=all'); await p.waitForTimeout(4500);
for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(1500); await p.mouse.move(5,890); await p.waitForTimeout(500);
 await p.screenshot({path:`/tmp/qa11310/x22-${v}-rest.png`});
 const bx=await s.box(`display_option_${v}`); await p.mouse.move(bx.x,bx.y); await p.waitForTimeout(1600);
 out[v]=await p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].find(e=>e.getBoundingClientRect().width>0); const r=t?.getBoundingClientRect(); const sw=document.querySelector('[data-test-id=toggle_display_option]')?.getBoundingClientRect(); const h=document.querySelector('[data-test-id=table_tech_view] thead, .q-table thead, [data-test-id^=board_column_header_]')?.getBoundingClientRect();
  const q=x=>x?{x:x.x,y:x.y,w:x.width,h:x.height}:null; return {tip:q(r),text:t?.innerText.trim(),sw:q(sw),hdr:q(h)};});
 out[v].btn=bx; await p.screenshot({path:`/tmp/qa11310/x22-${v}-hover.png`}); }
await toView(p,'tech_view'); fs.writeFileSync('/tmp/qa11310/x22.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,900)); await s.close();
