import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const out={};
for(const [name,vp,dx,dy] of [['vertical-18px',{width:1440,height:520},0,18],['sideways-1024',{width:1024,height:700},300,0]]){
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp,dpr:2,scrollbars:true});
const p=s.page; await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(6500);
const tip=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect();return t.innerText.trim()+' @'+Math.round(r.x)+','+Math.round(r.y)}));
const av=await p.evaluate(()=>{const e=document.querySelectorAll('.base-table tbody .q-avatar')[2]; const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]});
const px=av[0]+av[2]/2, py=av[1]+av[3]/2;
await p.mouse.move(px,py,{steps:5}); await p.waitForTimeout(1500); const before=await tip(); await p.screenshot({path:`/tmp/qa11631/w/hov/${name}-before.png`});
await p.evaluate(([dx,dy])=>{const m=document.querySelector('.base-table .q-table__middle')||document.querySelector('.q-table__middle'); m.scrollBy(dx,dy);},[dx,dy]); await p.waitForTimeout(1500);
const under=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y); return (e.className||e.tagName).toString().slice(0,60)+' avatar='+!!e.closest('.q-avatar')},[px,py]);
const after=await tip(); await p.screenshot({path:`/tmp/qa11631/w/hov/${name}-after.png`});
const sc=await p.evaluate(()=>{const m=document.querySelector('.q-table__middle'); return [m.scrollLeft,m.scrollTop]});
out[name]={before,after,under,scroll:sc}; await s.close?.();
}
console.log(JSON.stringify(out,null,1)); process.exit(0);
