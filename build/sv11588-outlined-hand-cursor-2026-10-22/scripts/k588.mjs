import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const o= env==='prod'?{env:'prod',user:'bilal.muzamil@shopview.com'}:{env:'branch',ticket:'11588',cookies:JSON.parse(fs.readFileSync('/tmp/qa11588/cookies.json')),quick:'admin'};
const s=await open({...o,dir:'/tmp/qa21',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const R={env};
const N=v=>{if(!v)return v; if(v.includes('url(')){const m=v.match(/%20'([a-z-]+)'%20/); return 'CUSTOM['+(m?m[1]:'?')+'] '+v.slice(v.lastIndexOf(')')+1).trim();} return v;};
R.prefBefore=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value?.collapsedGroups;
await s.go('/workorders'); await p.waitForTimeout(5000);
const b=await p.$('[data-test-id=display_option_tech_view]'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForSelector('[data-test-id^=tech_view_row_]',{timeout:60000}); await p.waitForTimeout(3000);
const hdr=(await p.$$('[data-test-id^=tech_view_group_]'))
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_group_]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^tech_view_group_[0-9a-f]{8}-/.test(t)).slice(0,3));
R.groupIds=ids;
const el=await p.$('[data-test-id="'+ids[0]+'"]'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
const r=await p.evaluate(id=>{const e=document.querySelector('[data-test-id="'+id+'"]'); const h=e.querySelector('[class*=tech-view-group-header]')||e; const r=h.getBoundingClientRect(); return {x:r.left,y:r.top,w:r.width,h:r.height,cls:h.className.slice(0,60)};},ids[0]); R.hdrRect=r;
const x=r.x+r.w*0.25, y=r.y+r.h/2; const rd=(x,y)=>p.evaluate(([x,y])=>{const t=document.elementFromPoint(x,y);return t?getComputedStyle(t).cursor:null},[x,y]);
await p.mouse.move(x,y); await p.waitForTimeout(300); R.hover=N(await rd(x,y)); await p.mouse.down(); R.steps=[];
for(const [dx,dy] of [[0,6],[0,20],[0,60],[0,120],[0,60],[0,0]]){ await p.mouse.move(x+dx,y+dy,{steps:5}); await p.waitForTimeout(250); R.steps.push(N(await rd(x+dx,y+dy))); }
await p.mouse.up(); await p.waitForTimeout(2000);
// restore collapsed groups to exactly what it was before this whole test (production: unassigned was not collapsed)
const target = env==='prod' ? [] : R.prefBefore;
const pr=await s.api('/api/users/me/preferences/work-orders-list',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({value:{collapsedGroups:target||[]}})}); R.restore=pr.status;
R.prefAfter=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value?.collapsedGroups;
R.writes=(s.writes||[]).filter(w=>!/envelope/.test(w)); fs.writeFileSync(`/tmp/qa11588/k-${env}.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R)); await s.close();
