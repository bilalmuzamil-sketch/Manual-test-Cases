import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
const empty=()=>p.evaluate(()=>{
 const main=document.querySelector('[data-test-id=table_tech_view],[data-test-id=board_view]')?.closest('main,.q-page')||document.body;
 const txt=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>220&&e.getBoundingClientRect().y<880&&e.getBoundingClientRect().height>0&&!e.closest('thead,tr,[data-test-id^=board_column_header],header,.q-tabs')).map(e=>e.innerText.trim());
 const svg=[...document.querySelectorAll('svg[data-icon], i.q-icon')].filter(e=>{const r=e.getBoundingClientRect(); return r.y>220&&r.y<700&&r.width>=20&&!e.closest('thead,tr,header,button,[data-test-id^=board_column_header]');}).map(e=>{const r=e.getBoundingClientRect(); const w=e.parentElement; const cs=getComputedStyle(w); return {icon:e.getAttribute('data-icon')||('MAT:'+e.innerText.trim()),size:Math.round(r.width),wrapBg:cs.backgroundColor,wrapRadius:cs.borderRadius,wrapW:Math.round(w.getBoundingClientRect().width),wrapH:Math.round(w.getBoundingClientRect().height),color:getComputedStyle(e).color};});
 const btns=[...document.querySelectorAll('button,a.q-btn')].filter(b=>{const r=b.getBoundingClientRect(); return r.y>220&&r.y<880&&r.height>0&&!b.closest('thead,tr,[data-test-id^=board_column_header],[data-test-id^=board_card_]');}).map(b=>({t:b.innerText.trim(),tid:b.dataset.testId||''}));
 const rows=document.querySelectorAll('[data-test-id^=tech_view_row_],[data-test-id^=board_card_],tbody tr').length;
 return {txt:txt.slice(0,8),svg:svg.slice(0,3),btns:btns.slice(0,4),rows};});
const pageBtn=async()=>p.evaluate(()=>[...document.querySelectorAll('button,a')].filter(b=>/Create Work Order/i.test(b.innerText)&&b.getBoundingClientRect().y<200).map(b=>({t:b.innerText.trim(),tid:b.dataset.testId||'',y:Math.round(b.getBoundingClientRect().y)})));
const opened=async()=>{ await p.waitForTimeout(2500); return await p.evaluate(()=>({url:location.pathname+location.search,dialogs:[...document.querySelectorAll('.q-dialog')].map(d=>({tid:(d.querySelector('[data-test-id]')||{}).dataset?.testId||'',title:(d.innerText||'').trim().split('\n').slice(0,3).join(' / ')}))})); };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); out.loc0=await where();
 if(!/Empty Shop/.test(out.loc0)) await loc('ZZAUTOTEST F2 Empty Shop'); out.loc1=await where();
 out.cells={};
 for(const tab of ['all','estimates','work_orders','completed']){ await p.click(`[data-test-id=tab_${tab}]`); await p.waitForTimeout(2500);
  for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(2000); const e=await empty(); out.cells[tab+'|'+v]=e; console.log(tab,v,JSON.stringify(e).slice(0,500)); if(e.rows===0) await p.screenshot({path:`/tmp/qa11310/ev08/${tab}-${v}.png`}); } }
 // pick an empty tab
 const emptyTab=['all','estimates','work_orders','completed'].find(t=>out.cells[t+'|tech_view'].rows===0); out.emptyTab=emptyTab; console.log('emptyTab',emptyTab);
 if(emptyTab){ await p.click(`[data-test-id=tab_${emptyTab}]`); await p.waitForTimeout(2000);
  for(const v of ['tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(2000);
   out['pageBtn_'+v]=await pageBtn();
   const eb=await p.locator('button').filter({hasText:'Create Work Order'}).evaluateAll(bs=>bs.map(b=>({tid:b.dataset.testId||'',y:Math.round(b.getBoundingClientRect().y)})));
   out['allCreateBtns_'+v]=eb;
   const low=eb.filter(b=>b.y>220); if(low.length){ const sel=low[0].tid?`[data-test-id=${low[0].tid}]`:null; if(sel) await p.click(sel); else { const bb=p.locator('button').filter({hasText:'Create Work Order'}); await bb.nth(eb.findIndex(b=>b.y>220)).click(); } out['emptyClick_'+v]=await opened(); await p.screenshot({path:`/tmp/qa11310/ev08/${v}-empty-btn-opened.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(1200); if(!/workorders\?/.test(p.url())&&!/workorders$/.test(p.url())){ await p.goBack(); await p.waitForTimeout(2500);} }
   const top=eb.filter(b=>b.y<=220); if(top.length){ if(top[0].tid) await p.click(`[data-test-id=${top[0].tid}]`); else await p.locator('button').filter({hasText:'Create Work Order'}).nth(eb.findIndex(b=>b.y<=220)).click(); out['pageClick_'+v]=await opened(); await p.screenshot({path:`/tmp/qa11310/ev08/${v}-page-btn-opened.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(1200); if(!/workorders(\?|$)/.test(p.url())){ await p.goBack(); await p.waitForTimeout(2500);} }
   console.log(v,'pageBtn',JSON.stringify(out['allCreateBtns_'+v]),'emptyClick',JSON.stringify(out['emptyClick_'+v]),'pageClick',JSON.stringify(out['pageClick_'+v]));
  }
  // filtered: search only
  await s.go(`/workorders?tab=${emptyTab}&search=zzqnomatch`); await p.waitForTimeout(3000);
  for(const v of ['tech_view','board_view','list']){ await toView(p,v); await p.waitForTimeout(2000); const e=await empty(); out['search|'+v]=e; console.log('search',v,JSON.stringify(e).slice(0,400)); await p.screenshot({path:`/tmp/qa11310/ev08/search-${v}.png`}); }
 }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
try{ await s.go('/workorders?tab=all'); await p.waitForTimeout(2500); await toView(p,'tech_view'); if(!/Heavy Duty/.test(await where())) await loc('Staging Heavy Duty - 9919'); out.locEnd=await where(); console.log('restored',out.locEnd);}catch(e){console.log('restore err',e.message);}
fs.writeFileSync('/tmp/qa11310/ev08/e11408.json',JSON.stringify(out,null,1)); await s.close();
