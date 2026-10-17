import {open} from './qa.mjs'; import {C,toView} from './rec.mjs'; import fs from 'fs';
const env=process.argv[2]||'staging';
const s=await open(env==='prod'?{env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900},dpr:2}:{env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2});
const p=s.page; const out={env,mk:await s.marker(),runs:[]};
const rd=()=>p.evaluate(()=>{const t=document.querySelector('[data-test-id=page_search_toggle]'); const cands=[...document.querySelectorAll('svg[data-icon*=search], i.q-icon')].filter(e=>{const r=e.getBoundingClientRect(); return r.y>60&&r.y<140&&r.width>0&&(e.tagName!=='I'||/search/.test(e.innerText));});
 return cands.map(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); const d=[...e.querySelectorAll('path,circle,line')].map(x=>x.outerHTML.replace(/ data-v-[a-z0-9]+=""/g,'')).join(''); return {kind:e.tagName==='I'?'MAT:'+e.innerText.trim():e.getAttribute('data-icon'),w:+r.width.toFixed(1),h:+r.height.toFixed(1),x:Math.round(r.x),y:Math.round(r.y),color:cs.color,stroke:cs.stroke,shape:d.length,shapeHash:[...d].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7),inToggle:!!t?.contains(e)};});});
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const views=env==='prod'?['list']:['list','tech_view','board_view'];
for(const v of views){ if(env!=='prod'){ await toView(p,v); await p.waitForTimeout(1500);} await p.mouse.move(5,890); await p.waitForTimeout(500);
 const closed=await rd(); const t=await s.box('page_search_toggle'); await p.screenshot({path:`/tmp/qa11310/s04-${env}-${v}-closed.png`,clip:{x:t.bx-20,y:t.by-12,width:t.bw+40,height:t.bh+24}});
 await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(800); await p.keyboard.type('S2-33'); await p.waitForTimeout(2000);
 const open_=await rd(); await p.screenshot({path:`/tmp/qa11310/s04-${env}-${v}-open.png`,clip:{x:Math.max(0,t.bx-320),y:t.by-12,width:700,height:t.bh+24}});
 out.runs.push({v,closed,open:open_}); console.log(env,v,'closed',JSON.stringify(closed),'open',JSON.stringify(open_.map(x=>x.kind+'@'+x.w+' '+x.color+' h'+x.shapeHash)));
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); }
if(env!=='prod') await toView(p,'tech_view');
fs.writeFileSync(`/tmp/qa11310/s04-${env}.json`,JSON.stringify(out,null,1)); await s.close();
