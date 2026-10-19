// SV-11464 (pill widths), SV-11099 (no-result search, staging), SV-11118 (link then top menu) — env = staging|prod
import {session,toView} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex19/${env}-`;
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker()};
const KEYS=['tab','display','density','collapsedGroups','filters','sortBy','descending']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const pills=()=>p.evaluate(()=>{const o={}; for(const b of document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating), [data-test-id^=tech_view_row_] td .q-badge:not(.q-badge--floating)')){ const r=b.getBoundingClientRect(); if(!r.width||r.top<0||r.top>900) continue; const k=b.innerText.trim().replace(/\s+/g,' '); (o[k]=o[k]||new Set()).add(r.width.toFixed(2)); } return Object.fromEntries(Object.entries(o).map(([k,v])=>[k,[...v]]));});
const state=()=>p.evaluate(()=>({url:location.pathname+location.search,tab:[...document.querySelectorAll('[data-test-id^=tab_]')].filter(t=>/q-tab--active/.test(t.className)||t.getAttribute('aria-selected')==='true').map(t=>t.dataset.testId),atm:[...document.querySelectorAll('[data-test-id*=assigned_to_me]')].map(e=>e.dataset.testId+':'+(e.getAttribute('aria-pressed')||e.getAttribute('aria-checked')||e.className.toString().match(/active|selected|primary/)?.[0]||'-'))}));
const empty=()=>p.evaluate(()=>{ const el=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/No work orders match/.test(e.innerText||'')); const box=el[0]?.closest('div[class*=empty],div[class*=no-data],div')?.parentElement; return {msgs:el.map(e=>e.innerText.trim()),btns:box?[...box.querySelectorAll('button')].map(b=>(b.dataset.testId||'')+':'+b.innerText.trim()):[], allBtns:[...document.querySelectorAll('button')].filter(b=>/clear/i.test(b.innerText)).map(b=>(b.dataset.testId||'')+':'+b.innerText.trim())};});
try{
 // ---- SV-11464: List pill widths per tab
 log.pills={};
 for(const t of ['all','work_order','estimate','complete']){ await s.go('/workorders?tab='+t); await p.waitForTimeout(4000); if(env!=='prod') { await toView(p,'list'); await p.waitForTimeout(2500);} log.pills['list_'+t]=await pills(); }
 await p.screenshot({path:SH+'pills-list-complete.png'});
 if(env!=='prod'){ for(const t of ['all','estimate']){ await s.go('/workorders?tab='+t); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(3000); log.pills['tech_'+t]=await pills(); } }
 // ---- SV-11099: no-match search (staging only)
 if(env!=='prod'){ log.empty={};
  for(const v of ['list','tech_view','board_view']){ await s.go('/workorders?tab=all&search=ZZNOMATCH123'); await p.waitForTimeout(3500); await toView(p,v); await p.waitForTimeout(3000); log.empty['search_'+v]=await empty(); await p.screenshot({path:SH+'empty-search-'+v+'.png'}); }
  await s.go('/workorders?tab=all&status=paid&search=ZZNOMATCH123'); await p.waitForTimeout(3500); await toView(p,'list'); await p.waitForTimeout(2500); log.empty['filter_search_list']=await empty(); await p.screenshot({path:SH+'empty-filter-search-list.png'});
 }
 // ---- SV-11118: link then top menu
 if(env!=='prod'){ await s.go('/workorders?tab=all'); await p.waitForTimeout(3000); await toView(p,'list'); await p.waitForTimeout(2000); }
 const L=env==='prod'?'/workorders?tab=estimate&assigned_to_me=1':'/workorders?tab=estimate&assigned_to_me=1';
 await s.go(L); await p.waitForTimeout(4000); log.link1=await state(); await p.screenshot({path:SH+'link-1.png'});
 const nav=await p.$$('[data-test-id=button_desktop_nav_link]'); let clicked=null; for(const n of nav){ if((await n.innerText()).trim()==='Work Orders'){ await n.click(); clicked=true; break; } } log.navClicked=clicked;
 await p.waitForTimeout(3500); log.link2=await state(); await p.screenshot({path:SH+'link-2-topmenu.png'});
 await s.go('/workorders'); await p.waitForTimeout(3500); log.link3=await state(); await p.screenshot({path:SH+'link-3-plain.png'});
 log.prefsAfterLink=await getP().then(v=>({tab:v.tab,filters:v.filters}));
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of KEYS) if(k in prefs0) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); const a=await getP(); log.restored=KEYS.every(k=>JSON.stringify(a[k])===JSON.stringify(prefs0[k])); }catch(e){ log.restoreErr=e.message; }
fs.writeFileSync(`/tmp/qa11310/ex19/x1-${env}.json`,JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
