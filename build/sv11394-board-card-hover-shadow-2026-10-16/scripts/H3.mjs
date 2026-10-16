import {start,J} from './drv.mjs'; import fs from 'fs';
const s=await start({vp:{width:1440,height:900}}); const p=s.page; const out={};
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
const tid='board_card_097f416b-4476-4317-b9ad-706fc31ce25f';
out.var=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return {onCard:getComputedStyle(e).getPropertyValue('--sv-shadow-card'),onRoot:getComputedStyle(document.documentElement).getPropertyValue('--sv-shadow-card'),strong:getComputedStyle(e).getPropertyValue('--sv-border-strong')};},tid);
out.noShadowRules=await p.evaluate(()=>{const res=[]; for(const sh of document.styleSheets){let rs; try{rs=sh.cssRules}catch(e){continue} for(const r of rs){const t=r.cssText||''; if(/\.no-shadow/.test(t)) res.push(t.slice(0,200));}} return res.slice(0,6);});
const c=await p.evaluate(t=>JSON.parse(JSON.stringify(document.querySelector(`[data-test-id="${t}"]`).getBoundingClientRect())),tid);
await p.mouse.move(c.x+c.width/2,c.y+c.height/2,{steps:6}); await p.waitForTimeout(800);
out.hoverWithClass=await p.evaluate(t=>getComputedStyle(document.querySelector(`[data-test-id="${t}"]`)).boxShadow,tid);
// diagnostic only, in this browser: take the no-shadow class off and hover again
await p.mouse.move(5,890); await p.waitForTimeout(400);
await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).classList.remove('no-shadow'),tid);
await p.mouse.move(c.x+c.width/2,c.y+c.height/2,{steps:6}); await p.waitForTimeout(900);
out.hoverWithoutClass=await p.evaluate(t=>getComputedStyle(document.querySelector(`[data-test-id="${t}"]`)).boxShadow,tid);
await p.screenshot({path:'ev/h-diag-noShadowRemoved-hover.png',clip:{x:c.x-24,y:c.y-24,width:c.width+48,height:c.height+48}});
fs.writeFileSync('ev/h3.json',JSON.stringify(out,null,1)); console.log(J(out,3000)); await s.close();
