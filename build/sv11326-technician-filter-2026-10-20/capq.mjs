import {session,toView} from './rec.mjs'; import fs from 'fs'; import {shot} from './cap.mjs';
const V=process.argv[2]||'board_view'; const tag=process.argv[3]||V;
const X='c57d19d7-dc2b-4472-a11d-984c61b01c0e', PIN='3ff0914b-49a3-4d80-b07d-92a10e1a89f8';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={V,mk:await s.marker(),st:{}};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const prof=async()=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(1200); };
const curLoc=async()=>{ await prof(); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); const c=await p.evaluate(()=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/^check/.test(e.innerText.trim())); return it?it.innerText.trim().replace(/^check\s*/,''):null;}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return c; };
const pickLoc=async name=>{ await prof(); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); const ok=await p.evaluate(n=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>e.innerText.trim().replace(/^check\s*/,'')===n); if(!it) return false; it.click(); return true;},name); await p.waitForTimeout(6000); return ok; };
const state=()=>p.evaluate(V=>{ const num=t=>{const m=t.match(/(\d+)\s+work orders?/); return m?+m[1]:null;};
  const groups=V==='tech_view'?[...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].map(e=>{const k=e.dataset.testId.replace('tech_view_group_name_',''); const c=document.querySelector(`[data-test-id=tech_view_group_count_${k}]`); return {name:e.innerText.trim(),count:c?+(c.innerText.match(/\d+/)||[null])[0]:null};})
   :[...document.querySelectorAll('.board-column__panel')].map(c=>{const h=c.querySelector('[data-test-id^=board_column_header_]'); const t=h?h.innerText.replace(/\s+/g,' ').trim():''; return {name:t.replace(/\s*\d+\s+\d+\s+work orders?$/,'').replace(/^[A-Z]{1,2}\s+(?=[A-Z])/,''),count:num(t),cards:[...c.querySelectorAll('.board-card')].filter(x=>/^board_card_[0-9a-f-]{36}$/.test(x.dataset.testId||'')).map(x=>(x.innerText.match(/S\d-\d+/)||[''])[0])};});
  const chip=document.querySelector('[data-test-id=filter_chip_lead_technician]'); const t=document.body.innerText; const em=t.match(/No work orders match these filters[\s\S]{0,120}/);
  return {groups,chip:chip?chip.innerText.replace(/\s+/g,' ').replace('keyboard_arrow_down','').replace('cancel','').trim():null,empty:em?em[0].replace(/\s+/g,' '):null,clearAll:[...document.querySelectorAll('button')].some(b=>/Clear all filters/.test(b.innerText)),url:location.search};},V);
const rec=async k=>{ const st=await state(); st.filters=(await getP()).filters; out.st[k]=st; console.log(k,'| chip',st.chip,'| groups',JSON.stringify(st.groups.map(g=>g.name+':'+g.count)).slice(0,260),'| empty',st.empty,'| clearAll',st.clearAll,'| prefs',JSON.stringify(st.filters)); await p.screenshot({path:`ex26/${tag}-${k}.png`}); return st; };
const open=async()=>{ await p.click('[data-test-id=filter_chip_lead_technician]'); await p.waitForTimeout(1200); };
const setTick=async(id,want)=>{ const cur=await p.evaluate(id=>{const e=document.querySelector(`[data-test-id=filter_option_lead_technician_${id}]`); e.scrollIntoView({block:'center'}); return e.getAttribute('aria-checked');},id); await p.waitForTimeout(300); if((cur==='true')!==want){ await p.click(`[data-test-id=filter_option_lead_technician_${id}]`); await p.waitForTimeout(1200);} };
const close=async()=>{ await p.keyboard.press('Escape'); await p.waitForTimeout(4000); };
const api=async q=>{ const r=await s.api('/api/work-orders?pagination[rowsPerPage]=1000&pagination[page]=1&search='+(q.search||'')+'&showMyWorkOrders='+(q.my?1:0)+(q.f||[]).map((f,i)=>`&filters[${i}][field]=${f[0]}&filters[${i}][value]=${f[1]}`).join('')); return (r.json.data.work_orders||[]).map(w=>({n:w.number,lead:w.techAssignedId,here:w.vehicleHere})); };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); out.loc0=await curLoc(); if(out.loc0!=='Staging Heavy Duty - 9919') out.pick=await pickLoc('Staging Heavy Duty - 9919');
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,V); await p.waitForTimeout(5000);
 if(V==='tech_view'){ for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); }
 const L=q=>p.locator(q); const D='/tmp/qa11310/ex26x/';
 for(let i=0;i<80;i++){ const ok=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Darrell Martinez/.test(e.innerText)); if(h){ h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900; return false;}); if(ok) break; await p.waitForTimeout(300);} await p.waitForTimeout(1500);
 const dcol=p.locator('.board-column__panel').filter({has:p.locator('[data-test-id^=board_column_header_]',{hasText:'Darrell Martinez'})});
 await shot(p,D+'q1-darrell-column.png',{col:dcol,hdr:dcol.locator('[data-test-id^=board_column_header_]')});
 out.darrellHeader=await dcol.locator('[data-test-id^=board_column_header_]').first().innerText().catch(()=>null); console.log('header',JSON.stringify(out.darrellHeader));
 await open(); await p.fill('[data-test-id=filter_search_lead_technician]','Darrell'); await p.waitForTimeout(1500);
 out.darrellOpts=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_option_lead_technician_]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>e.getAttribute('aria-label')));
 out.menuText=await p.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().height>0).pop(); return m?m.innerText.replace(/\s+/g,' ').slice(0,200):null;});
 console.log('options for Darrell',JSON.stringify(out.darrellOpts),'|',out.menuText);
 await shot(p,D+'q2-darrell-search.png',{menu:L('.q-menu'),search:L('[data-test-id=filter_search_lead_technician]'),col:dcol});
 await p.keyboard.press('Escape');
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); await p.screenshot({path:`ex26/${tag}-err.png`}); }
fs.writeFileSync(`ex26/${tag}.json`,JSON.stringify(out,null,1));
try{ if(out.loc0 && out.loc0!=='Staging Heavy Duty - 9919') out.restoreLoc=await pickLoc(out.loc0); }catch(e){}
const cur=await getP(); const vv={...cur}; for(const k of ['display','tab','filters','collapsedGroups']) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})}); out.restored=JSON.stringify(await getP())===JSON.stringify(prefs0);
fs.writeFileSync(`ex26/${tag}.json`,JSON.stringify(out,null,1)); console.log('restored',out.restored,'loc',out.loc0,out.restoreLoc,(await s.marker()).version); await s.close();
