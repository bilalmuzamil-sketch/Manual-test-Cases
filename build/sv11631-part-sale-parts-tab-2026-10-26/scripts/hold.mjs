import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')); const out=[];
for(const [name,sel,rowKey] of [['desc','.description-cell .q-field__native','Engine Oil'],['avatar','.q-avatar','Engine Oil']]){
 const s=await open({env:'branch',ticket:'11631',cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,scrollbars:true,touch:true});
 const p=s.page; await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(7000);
 await p.evaluate(([sel,k])=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value.includes(k))||r.innerText.includes(k)); r.querySelector(sel).scrollIntoView({block:'center'});},[sel,rowKey]); await p.waitForTimeout(600);
 const b=await p.evaluate(([sel,k])=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value.includes(k))||r.innerText.includes(k)); const x=r.querySelector(sel).getBoundingClientRect(); return [x.x,x.y,x.width,x.height]},[sel,rowKey]);
 const x=b[0]+Math.min(b[2]/2,30), y=b[1]+b[3]/2; const cdp=await p.context().newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await p.waitForTimeout(1200);
 const during=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()));
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(1200);
 const after=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()));
 await p.screenshot({path:`/tmp/qa11631/w/hov/hold-${name}.png`}); out.push({name,during,after}); await s.close?.(); }
console.log(JSON.stringify(out)); process.exit(0);
