import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const out={};
for(const [tag,id] of [['p2162','90a95f29-f405-4763-834d-6e3a237f8c33'],['p2109','48ba5757-175a-4701-8c4a-810791ac2ede']]){
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,scrollbars:true,touch:true});
const p=s.page; await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(7000);
const tip=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip, .q-menu')].filter(t=>t.getBoundingClientRect().height>0).map(t=>(t.className.includes('q-menu')?'MENU:':'TIP:')+t.innerText.trim().replace(/\n/g,' / ').slice(0,140)));
const find=(sel)=>p.evaluate(sel=>{ const rows=[...document.querySelectorAll('.base-table tbody tr')].filter(r=>r.getBoundingClientRect().height>10); for(const r of rows){ const n=r.querySelector(sel); if(!n) continue; const sp=[...n.children].find(x=>x.tagName!=='INPUT')||n; if(sp.scrollWidth>sp.clientWidth+0.5||sel.includes('avatar')){ n.scrollIntoView({block:'center'}); const b=n.getBoundingClientRect(); return {t:sp.textContent.trim(),b:[b.x,b.y,b.width,b.height]}; } } return null; },sel);
const res={};
for(const [name,sel] of [['description','.description-cell .q-field__native'],['category','.category-cell .q-field__native'],['avatar','.q-avatar']]){
  await p.touchscreen.tap(5,5); await p.waitForTimeout(500);
  const f=await find(sel); if(!f){res[name]='none truncated';continue;}
  const bx=Math.max(f.b[0]+8, 2), by=f.b[1]+f.b[3]/2; await p.touchscreen.tap(bx,by); await p.waitForTimeout(1500);
  res[name]={value:f.t,tapAt:[Math.round(bx),Math.round(by)],shown:await tip()}; await p.screenshot({path:`/tmp/qa11631/w/hov/tap-${tag}-${name}.png`}); }
out[tag]=res; await s.close?.(); }
console.log(JSON.stringify(out,null,1)); process.exit(0);
