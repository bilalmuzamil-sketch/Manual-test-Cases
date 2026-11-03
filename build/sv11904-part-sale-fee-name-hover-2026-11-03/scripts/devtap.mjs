// usage: node devtap.mjs "<preset or 'touch-desktop-ua'>" <quick|hold>
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [DEV,G]=process.argv.slice(2); const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim(); const PS='90a95f29-f405-4763-834d-6e3a237f8c33';
const OUT='/tmp/sv11904/dev'; fs.mkdirSync(OUT,{recursive:true}); const tag=(DEV+'-'+G).replace(/\s+/g,'_');
const base={env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41'};
const s=await open(DEV==='touch-desktop-ua'?{...base,vp:{width:390,height:844},dpr:3,touch:true}:DEV==='touch-laptop-1440'?{...base,vp:{width:1440,height:900},dpr:2,touch:'laptop',scrollbars:true}:DEV==='touch-laptop-1024'?{...base,vp:{width:1024,height:768},dpr:2,touch:'laptop',scrollbars:true}:{...base,device:DEV}); const p=s.page;
const env=await p.evaluate(()=>({ua:navigator.userAgent,w:innerWidth,h:innerHeight,dpr:devicePixelRatio,touch:navigator.maxTouchPoints}));
await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(7000); await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
const q=await p.evaluate(()=>({mobile:document.body.classList.contains('mobile'),desktop:document.body.classList.contains('desktop'),touchCls:document.body.classList.contains('touch'),plat:[...document.body.classList].filter(c=>/platform|mobile|desktop|touch|ios|android/.test(c)).join(' ')}));
await p.evaluate(()=>{const w=[...document.querySelectorAll('.q-table__middle')].sort((a,b)=>b.scrollWidth-a.scrollWidth)[0]; if(w) w.scrollLeft=w.scrollWidth;}); await p.waitForTimeout(600);
const L=p.locator('[data-test-id^="text_part_adjustment_name_"]').first(); await L.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); const b=await L.boundingBox();
const hit=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y); return e&&(e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')||e.tagName);},[b.x+Math.min(b.width/2,30),b.y+b.height/2]); console.log('tap lands on',hit);
const x=b.x+Math.min(b.width/2,30), y=b.y+b.height/2;
const st=async()=>p.evaluate(()=>({tips:[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()),tipB:[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect(); return [r.x,r.y,r.width,r.height].map(Math.round);}),dlgB:[...document.querySelectorAll('.q-dialog .q-card')].map(c=>{const r=c.getBoundingClientRect(); return [r.x,r.y,r.width,r.height].map(Math.round);}),viewer:document.querySelectorAll('.q-dialog').length}));
await p.screenshot({path:`${OUT}/${tag}-0-before.png`});
const cdp=await p.context().newCDPSession(p); const t0=Date.now(); let held=0;
if(G==='quick'){ await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await p.waitForTimeout(80); await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); held=Date.now()-t0; }
else { await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await p.waitForTimeout(800); const mid=await st(); console.log(tag,'during hold',JSON.stringify(mid)); await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); held=Date.now()-t0; }
const out={tag,env,quasar:q,tapAt:[Math.round(x),Math.round(y)],heldMs:held,states:[]};
for(const ms of [500,3000,6000]){ const now=Date.now()-t0-held; if(ms>now) await p.waitForTimeout(ms-now); const r=await st(); out.states.push({ms,...r}); await p.screenshot({path:`${OUT}/${tag}-${ms}ms.png`}); }
fs.writeFileSync(`${OUT}/${tag}.json`,JSON.stringify(out,null,1));
console.log(tag,'| ua',env.ua.slice(0,60),'| vp',env.w+'x'+env.h,'dpr',env.dpr,'| body',q.plat,'| held',held+'ms');
for(const s2 of out.states) console.log('   +'+s2.ms+'ms tooltip',JSON.stringify(s2.tips),'viewer open',s2.viewer);
await s.close(); process.exit(0);
