import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const R={};
const cnt=p=>p.evaluate(()=>({page:[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).map(e=>(e.getAttribute('data-test-id')||e.className.toString()).slice(0,28)),now:new Date().toISOString()}));
const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const ctx=p.context();
const hasClock=!!ctx.clock; console.log('clock api',hasClock);
async function fresh(iso,tag){ await ctx.clock.install({time:new Date(iso)}); await s.go('/workorders'); await p.waitForTimeout(6000); const r=await cnt(p); R[tag]=r; console.log(tag,iso,JSON.stringify(r)); await p.screenshot({path:`/tmp/qa21/x636-${tag}.png`}); }
// 1) just before expiry, then run the clock across it WITHOUT reloading (open tab)
await fresh('2026-10-31T06:58:00Z','open-before');
await ctx.clock.runFor(60*1000); await p.waitForTimeout(1500); R['open-06:59']=await cnt(p); console.log('open 06:59',JSON.stringify(R['open-06:59']));
await ctx.clock.runFor(65*1000); await p.waitForTimeout(2500); R['open-07:00:05']=await cnt(p); console.log('open after 07:00:05',JSON.stringify(R['open-07:00:05'])); await p.screenshot({path:'/tmp/qa21/x636-open-after.png'});
await s.close();
for(const [iso,tag] of [['2026-10-31T06:59:59Z','load-06:59:59'],['2026-10-31T07:00:00Z','load-07:00:00'],['2026-10-31T07:00:01Z','load-07:00:01'],['2026-11-02T12:00:00Z','load-2-nov']]){
  const s2=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p2=s2.page; const c2=p2.context();
  await c2.clock.install({time:new Date(iso)}); await s2.go('/workorders'); await p2.waitForTimeout(6000); R[tag]=await cnt(p2); console.log(tag,JSON.stringify(R[tag]));
  if(tag==='load-07:00:01'||tag==='load-2-nov'){ await p2.setViewportSize({width:390,height:844}); await s2.go('/workorders'); await p2.waitForTimeout(5000); await p2.click('[data-test-id=button_open_mobile_menu]').catch(()=>{}); await p2.waitForTimeout(1800); R[tag+'-menu']=await p2.evaluate(()=>{const d=[...document.querySelectorAll('.q-drawer')].pop(); return {txt:d?d.innerText.replace(/\s+/g,' ').slice(0,200):null,new:d?[...d.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).length:null}}); console.log(tag,'phone menu',JSON.stringify(R[tag+'-menu'])); }
  await s2.close(); }
fs.writeFileSync('/tmp/qa21/x636.json',JSON.stringify(R,null,1));
