import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const empty=()=>p.evaluate(()=>{
 const txt=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>220&&e.getBoundingClientRect().y<880&&e.getBoundingClientRect().height>0&&!e.closest('thead,tr,header,.q-tabs')).map(e=>e.innerText.trim());
 const svg=[...document.querySelectorAll('svg[data-icon], i.q-icon')].filter(e=>{const r=e.getBoundingClientRect(); return r.y>220&&r.y<700&&r.width>=20&&!e.closest('thead,tr,header,button');}).map(e=>(e.getAttribute('data-icon')||('MAT:'+e.innerText.trim()))+' '+Math.round(e.getBoundingClientRect().width)+'px bg '+getComputedStyle(e.parentElement).backgroundColor);
 return {txt:txt.slice(0,6),svg,rows:[...document.querySelectorAll('tbody tr')].filter(r=>!/No work orders/.test(r.innerText)).length};});
const tabsIds=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tab_]')].map(e=>e.dataset.testId));
try{
 await s.go('/workorders'); await p.waitForTimeout(3500); out.loc0=await where(); console.log('loc0',out.loc0,'tabs',JSON.stringify(await tabsIds()));
 let found=null;
 for(const L of [null,'Inventory 2']){
  if(L){ await loc(L); console.log('switched',await where()); }
  for(const t of await tabsIds()){ await p.click(`[data-test-id=${t}]`); await p.waitForTimeout(3000); const e=await empty(); console.log(L||'cur',t,JSON.stringify(e).slice(0,250)); if(e.txt.includes('No work orders found.')&&!found){ found={L,t,e}; await p.screenshot({path:'/tmp/qa11310/ev08/prod-list-firstrun.png'}); } }
  if(found) break;
 }
 out.found=found;
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
try{ if((await where())!==out.loc0){ await loc(out.loc0.split(' ').slice(0,3).join(' ').replace(/ \d+\.\d+.*/,'')); } out.locEnd=await where(); console.log('restored',out.locEnd);}catch(e){console.log('restore err',e.message);}
fs.writeFileSync('/tmp/qa11310/ev08/e11408p3.json',JSON.stringify(out,null,1)); await s.close();
