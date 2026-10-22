import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const R={}; const cnt=p=>p.evaluate(()=>({page:[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).map(e=>(e.getAttribute('data-test-id')||e.className.toString()).slice(0,28)),now:new Date().toISOString()}));
for(const [iso,tag] of [['2026-10-31T06:50:00Z','load-06:50'],['2026-10-30T12:00:00Z','load-30-oct']]){
 const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; await p.context().clock.install({time:new Date(iso)});
 await s.go('/workorders'); await p.waitForTimeout(6000); R[tag]=await cnt(p); console.log(tag,JSON.stringify(R[tag]));
 await p.setViewportSize({width:390,height:844}); await s.go('/workorders'); await p.waitForTimeout(5000); await p.click('[data-test-id=button_open_mobile_menu]').catch(()=>{}); await p.waitForTimeout(1800);
 R[tag+'-menu']=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-drawer')].pop(); return {new:d?[...d.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).length:null,now:new Date().toISOString()}}); console.log(tag,'phone menu',JSON.stringify(R[tag+'-menu'])); await s.close(); }
fs.writeFileSync('/tmp/qa21/x636b.json',JSON.stringify(R,null,1));
