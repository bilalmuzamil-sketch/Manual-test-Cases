// node s4.mjs -> Schedule Day view today: move the pointer onto the visible left part of each booking (up to 3) and read the details box. ../ev/<env>-S4b-*.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':process.env.ENV==='staging'?'staging':'branch'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const out=[];
if(E==='staging'){ await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}); }
if(E==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
await s.go('/schedule'); await p.waitForTimeout(4000); await p.locator('[data-test-id=schedule_view_toggle]').getByText('Day',{exact:true}).first().click(); await p.click('[data-test-id=button_schedule_today]'); await p.waitForTimeout(3000);
const blocks=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>/shift/.test(e.getAttribute('data-test-id'))).map(e=>{const r=e.getBoundingClientRect();return {tid:e.getAttribute('data-test-id'),x:r.x,y:r.y,w:r.width,h:r.height}}).filter(b=>b.w>20&&b.h>20&&b.y>0&&b.y<880).slice(0,3));
console.log('blocks',JSON.stringify(blocks).slice(0,400));
let i=0; for(const b of blocks){ i++; await p.mouse.move(5,5); await p.waitForTimeout(500); const x=Math.max(b.x,0)+Math.min(60,b.w/2), y=b.y+b.h/2; await p.mouse.move(x-30,y,{steps:5}); await p.mouse.move(x,y,{steps:5}); await p.waitForTimeout(1800);
 const tt=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,.q-menu,[role=tooltip]')].filter(m=>{const r=m.getBoundingClientRect();return r.width>0}).map(m=>{const r=m.getBoundingClientRect();return {role:m.getAttribute('role'),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),style:(m.getAttribute('style')||'').slice(0,120),text:m.innerText.replace(/\s+/g,' ').slice(0,100)}}));
 await p.screenshot({path:`../ev/${E}-S4b-${i}.png`}); const r={b:b.tid,at:[Math.round(x),Math.round(y)],tt}; out.push(r); console.log(JSON.stringify(r).slice(0,600)); }
fs.writeFileSync(`../ev/${E}-S4b.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
