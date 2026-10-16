import {open} from './qa.mjs'; import fs from 'fs';
const env=process.argv[2]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:1600,height:1000},dpr:2})); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(800); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(4000);}
const r=await p.evaluate(()=>{const b=[...document.querySelectorAll('td.cell.status .q-badge')].find(x=>/[A-Za-z]/.test(x.innerText)); const out=[];
 const els=[b,b.parentElement,b.closest('td')]; const th=[...document.querySelectorAll('th')].find(t=>/^Status/.test(t.innerText.trim()));
 for(const sh of document.styleSheets){let rules;try{rules=sh.cssRules}catch(e){continue}
  const walk=rs=>{for(const ru of rs){ if(ru.cssRules) walk(ru.cssRules); if(!ru.selectorText) continue; for(const [i,e] of [...els,th].entries()){ try{ if(e&&e.matches(ru.selectorText)&&/width|flex|display|justify|padding/.test(ru.style.cssText)) out.push(['bpt h'[i]||i,ru.selectorText.slice(0,120),ru.style.cssText.slice(0,200)]);}catch(e){} } }}; walk(rules);}
 return {cls:[b.className,b.parentElement.className,b.closest('td').className,th?.className, th?.getAttribute('style')],thW:th?.getBoundingClientRect().width,out:out.filter(x=>!/^\.q-badge$|^\.flex$|^\.inline$|^\.items-center$|^\.no-wrap$/.test(x[1]))};});
console.log(JSON.stringify(r,null,1)); await s.close();
