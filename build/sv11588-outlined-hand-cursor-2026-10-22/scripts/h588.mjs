import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const o= env==='prod'?{env:'prod',user:'bilal.muzamil@shopview.com'}:{env:'branch',ticket:'11588',cookies:JSON.parse(fs.readFileSync('/tmp/qa11588/cookies.json')),quick:'admin'};
const s=await open({...o,dir:'/tmp/qa21',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const R={env};
const N=v=>{if(!v)return v; if(v.includes('url(')){const m=v.match(/%20'([a-z-]+)'%20/); return 'CUSTOM['+(m?m[1]:'?')+'] '+v.slice(v.lastIndexOf(')')+1).trim();} return v;};
const view=async(v,wait)=>{const b=await p.$('[data-test-id=display_option_'+v+']'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForSelector(wait,{timeout:60000}); await p.waitForTimeout(3000); await p.mouse.move(3,600);};
const raw={};
async function dragRead(sel,label){ const el=(await p.$$(sel))[1]||(await p.$$(sel))[0]; if(!el) return {err:'none '+sel}; await el.scrollIntoViewIfNeeded(); const bb=await el.boundingBox(); const x=bb.x+Math.min(30,bb.width/3), y=bb.y+bb.height/2;
  const rd=(x,y)=>p.evaluate(([x,y])=>{const t=document.elementFromPoint(x,y); return {under:t?getComputedStyle(t).cursor:null, body:getComputedStyle(document.body).cursor, html:getComputedStyle(document.documentElement).cursor}},[x,y]);
  await p.mouse.move(x,y); await p.waitForTimeout(300); const hover=await rd(x,y); await p.mouse.down(); const steps=[];
  for(const [dx,dy] of [[6,0],[20,4],[60,8],[120,10],[200,12],[120,8],[40,4],[0,0]]){ await p.mouse.move(x+dx,y+dy,{steps:5}); await p.waitForTimeout(250); steps.push(await rd(x+dx,y+dy)); }
  await p.mouse.up(); await p.waitForTimeout(2000);
  raw[label]=[hover,...steps]; return {hover:N(hover.under),steps:steps.map(s=>N(s.under)+(s.body!=='auto'?' | body '+N(s.body):'')+(s.html!=='auto'?' | html '+N(s.html):''))}; }
await s.go('/workorders'); await p.waitForTimeout(5000);
const start=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=display_option_]')].filter(e=>/selected|active|--on/.test(e.className)).map(e=>e.getAttribute('data-test-id'))[0]);
await view('board_view','[data-test-id^=board_card_]');
R.dragCard=await dragRead('[data-test-id^=board_card_][class*=board-card]','card');
R.dragColumnHeader=await dragRead('[data-test-id^=board_column_header_]:not([data-test-id$=unassigned])','colhdr');
await view('tech_view','[data-test-id^=tech_view_row_]');
// collapse Unassigned so technician groups come into view
const tg=await p.$('[data-test-id=button_tech_view_group_toggle_unassigned]'); if(tg){const b=await tg.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(3000);} await p.mouse.move(3,600);
R.groupTids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id^=tech_view_group]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>')))]);
R.groupHeaders=await p.evaluate((ns)=>{const N=eval(ns); const out={}; const hs=[...document.querySelectorAll('[class*=tech-view-group-header]')].filter(e=>e.getBoundingClientRect().height); for(const h of hs.slice(0,10)){const r=h.getBoundingClientRect(); for(let i=1;i<8;i++){const t=document.elementFromPoint(r.left+r.width*i/16,r.top+r.height/2); if(!t||!h.contains(t))continue; const k=N(getComputedStyle(t).cursor)+' @ '+(t.getAttribute('data-test-id')||t.className||t.tagName).toString().replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>').slice(0,40); out[k]=(out[k]||0)+1;}} return {headers:hs.length,points:out};},N.toString());
R.dragTechRow=await dragRead('[data-test-id^=tech_view_row_drag_handle_]','row');
R.dragGroupHeader=await dragRead('[class*=tech-view-group-header]:not(:first-child)','grphdr');
await p.screenshot({path:`/tmp/qa11588/h-${env}-tech-groups.png`});
fs.writeFileSync(`/tmp/qa11588/h-${env}-raw.json`,JSON.stringify(raw,null,1));
await s.go('/workorders'); await p.waitForTimeout(4000); if(start){const b=await p.$('[data-test-id='+start+']'); if(b){const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(3000);}}
R.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content); R.writes=s.writes?s.writes.slice(-10):null;
fs.writeFileSync(`/tmp/qa11588/h-${env}.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,0).slice(0,3500)); await s.close();
