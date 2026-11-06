import {sess,post} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'staging'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const out=[];
if(E==='staging') await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/schedule'); await p.waitForTimeout(5000); await p.locator('[data-test-id=schedule_view_toggle]').getByText('Day',{exact:true}).first().click(); await p.click('[data-test-id=button_schedule_today]'); await p.waitForTimeout(3500);
const bl=p.locator('[data-test-id=schedule_shift_block]'); const n=await bl.count(); console.log('blocks',n);
for(let i=0;i<n;i++){ const b=bl.nth(i); await b.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); const bb=await b.boundingBox(); if(!bb) continue;
  const x=Math.max(bb.x,0)+Math.min(50,bb.width/2), y=bb.y+bb.height/2; await p.mouse.move(5,5); await p.waitForTimeout(400); await p.mouse.move(x-20,y,{steps:4}); await p.mouse.move(x,y,{steps:4}); await p.waitForTimeout(1800);
  const tt=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,.q-menu,[role=tooltip]')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect(); return {role:m.getAttribute('role'),box:[r.x,r.y,r.width,r.height].map(Math.round),text:m.innerText.replace(/\s+/g,' ').slice(0,120)}}));
  await p.screenshot({path:`../ev/${E}-r3-hover-${i+1}.png`}); const ok=tt.length>0&&tt.every(t=>t.box.every(Number.isFinite)&&t.box[0]>=0&&t.box[1]>=0&&t.box[0]+t.box[2]<=1601&&t.box[1]+t.box[3]<=901);
  out.push({i:i+1,block:[bb.x,bb.y,bb.width,bb.height].map(Math.round),at:[Math.round(x),Math.round(y)],ok,tt}); console.log(JSON.stringify(out.at(-1)).slice(0,500)); }
fs.writeFileSync(`../ev/${E}-r3-hover.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
