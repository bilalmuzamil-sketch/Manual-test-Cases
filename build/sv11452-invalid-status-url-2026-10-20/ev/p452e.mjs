import {open} from './qa.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={};
for(const [k,q] of [['bogus','status=bogus'],['capital','status=Approved'],['valid','status=approved']]){
  await s.go('/workorders?'+q); await p.waitForTimeout(3500);
  const c=await p.evaluate(()=>{const b=document.querySelector('[data-test-id=filter_chip_status]').getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height};});
  await p.mouse.move(c.x+c.w/2,c.y+c.h/2,{steps:6}); await p.waitForTimeout(900);
  out[k]=await p.evaluate(()=>{const ch=document.querySelector('[data-test-id=filter_chip_status]'); const ic=[...ch.querySelectorAll('i,.q-icon')].map(i=>({t:i.innerText.trim(),op:getComputedStyle(i).opacity,vis:getComputedStyle(i).visibility,disp:getComputedStyle(i).display})); const tip=[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText.trim()); return {ic,tip,txt:ch.innerText.replace(/\s+/g,' ').trim()};});
  await p.screenshot({path:`/tmp/qa11310/p452/e-${k}-hover.png`}); console.log(k,JSON.stringify(out[k]));
}
fs.writeFileSync('/tmp/qa11310/p452/e.json',JSON.stringify(out,null,1)); await s.close();
