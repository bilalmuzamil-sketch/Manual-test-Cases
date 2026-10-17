import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const empty=()=>p.evaluate(()=>{
 const txt=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>220&&e.getBoundingClientRect().y<880&&e.getBoundingClientRect().height>0&&!e.closest('thead,tr,header,.q-tabs')).map(e=>e.innerText.trim());
 const svg=[...document.querySelectorAll('svg[data-icon], i.q-icon')].filter(e=>{const r=e.getBoundingClientRect(); return r.y>220&&r.y<700&&r.width>=20&&!e.closest('thead,tr,header,button');}).map(e=>(e.getAttribute('data-icon')||('MAT:'+e.innerText.trim()))+' '+Math.round(e.getBoundingClientRect().width)+'px bg '+getComputedStyle(e.parentElement).backgroundColor);
 const btns=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect(); return r.y>220&&r.y<880&&r.height>0&&!b.closest('thead,tr');}).map(b=>b.innerText.trim()+'#'+(b.dataset.testId||''));
 return {txt:txt.slice(0,6),svg,btns,rows:document.querySelectorAll('tbody tr').length,url:location.search};});
try{
 out.tabs={};
 for(const tab of ['all','estimates','work_orders','completed']){ await s.go(`/workorders?tab=${tab}`); await p.waitForTimeout(4000); out.tabs[tab]=await empty(); console.log('tab',tab,JSON.stringify(out.tabs[tab]).slice(0,200)); }
 await s.go('/workorders?tab=all&search=zzqnomatch'); await p.waitForTimeout(4000); out.search=await empty(); await p.screenshot({path:'/tmp/qa11310/ev08/prod-list-search.png'}); console.log('search',JSON.stringify(out.search).slice(0,400));
 await s.go('/workorders?tab=all&search=zzqnomatch&assigned_to_me=1'); await p.waitForTimeout(4000); out.both=await empty(); console.log('filter+search url',JSON.stringify(out.both).slice(0,400));
 const am=await p.$('[data-test-id=filter_chip_assigned_to_me]'); out.hasChip=!!am;
 await s.go('/workorders?tab=all&search=zzqnomatch'); await p.waitForTimeout(3500); if(am){ await p.click('[data-test-id=filter_chip_assigned_to_me]'); await p.waitForTimeout(3000); out.bothClick=await empty(); await p.screenshot({path:'/tmp/qa11310/ev08/prod-list-filter.png'}); console.log('filter+search click',JSON.stringify(out.bothClick).slice(0,400)); await p.click('[data-test-id=filter_chip_assigned_to_me]'); await p.waitForTimeout(1500);} else console.log('no assigned chip on prod');
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
fs.writeFileSync('/tmp/qa11310/ev08/e11408p.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out.mk)); await s.close();
