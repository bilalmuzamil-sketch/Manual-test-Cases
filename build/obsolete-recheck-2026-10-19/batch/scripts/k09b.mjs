import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{
 const heads=[...document.querySelectorAll('[data-test-id=table_tech_view] thead th')].map(th=>({t:th.innerText.trim(),x:th.getBoundingClientRect().x,w:th.getBoundingClientRect().width}));
 const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)).slice(0,8);
 return {heads:heads.map(h=>h.t),rows:rows.map(row=>{ const num=row.querySelector('[data-test-id^=tech_view_row_number_link_]')?.innerText;
  const cells=[...row.children].map((td,i)=>({col:heads[i]?.t,tids:[...td.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f-]{36}/,'<id>')).slice(0,6),focusables:[...td.querySelectorAll('a,button,[tabindex]')].map(e=>e.tagName+'#'+(e.dataset.testId||'').replace(/[0-9a-f-]{36}/,'<id>')+' ti='+e.getAttribute('tabindex')+' aria='+(e.getAttribute('aria-label')||'')),text:td.innerText.trim().replace(/\s+/g,' ').slice(0,30)})).filter(c=>/Tech|Advisor|Clocked|Lead/i.test(c.col||''));
  return {num,cells};})};});
console.log(JSON.stringify(r.heads)); for(const x of r.rows) console.log(x.num,JSON.stringify(x.cells).slice(0,900));
const av=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id^=tech_view_row_] [class*=avatar]')].slice(0,6); return e.map(a=>({cls:a.className.toString().slice(0,60),tid:a.dataset.testId||'',ti:a.getAttribute('tabindex'),aria:a.getAttribute('aria-label'),title:a.getAttribute('title'),role:a.getAttribute('role'),html:a.outerHTML.slice(0,240)}));});
console.log(JSON.stringify(av,null,0).slice(0,2500));
await s.close();
