import {open} from './qa.mjs'; import fs from 'fs';
const [env,W]=[process.argv[2],+(process.argv[3]||1600)]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:W,height:1000},dpr:2})); const p=s.page; const mk=await s.marker();
const toList=async()=>{ if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(3500);} };
const vis=()=>p.evaluate(()=>{const H=innerHeight; return [...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].filter(b=>{const r=b.getBoundingClientRect();return r.top>0&&r.bottom<H&&r.width>0;}).map(b=>{const tr=b.closest('tr');return {n:(tr.innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+b.getBoundingClientRect().width.toFixed(2),td:+b.closest('td').getBoundingClientRect().width.toFixed(1)};});});
const sortState=()=>p.evaluate(()=>{const th=[...document.querySelectorAll('th')].find(t=>/^Status/.test(t.innerText.trim()));return th?.className;});
const out={env,W,mk,tabs:{},byStatus:{}};
for(const tab of ['all','estimates','work_orders','completed']){
  await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toList();
  await p.click(`[data-test-id=tab_${tab}]`).catch(()=>{}); await p.waitForTimeout(4000);
  const screens=[]; let prev='';
  for(let i=0;i<25;i++){ const v=await vis(); const key=v.map(x=>x.n).join(); if(key===prev) break; prev=key;
    for(const x of v){ (out.byStatus[x.t]??=new Set()).add(x.n); }
    screens.push({i,rows:v.length,statuses:[...new Set(v.map(x=>x.t))],widths:[...new Set(v.map(x=>x.w))],td:[...new Set(v.map(x=>x.td))]});
    if(i===0) await p.screenshot({path:`/tmp/qa11310/${env}-${W}-${tab}-s0.png`});
    await p.evaluate(()=>{const sc=document.querySelector('.q-table__middle');if(sc) sc.scrollTop+=Math.max(300,sc.clientHeight-80); else scrollBy(0,700);}); await p.waitForTimeout(900); }
  out.tabs[tab]={sort:await sortState(),screens};
}
for(const k in out.byStatus) out.byStatus[k]=[...out.byStatus[k]].slice(0,4);
fs.writeFileSync(`/tmp/qa11310/mx-${env}-${W}.json`,JSON.stringify(out,null,1));
console.log(env,W,mk.version); for(const [t,v] of Object.entries(out.tabs)){ const mixed=v.screens.filter(x=>x.widths.length>1); console.log(t,v.sort,'screens',v.screens.length,'unequal-within-screen',mixed.length,'widths-seen',[...new Set(v.screens.flatMap(x=>x.widths))],'statuses',[...new Set(v.screens.flatMap(x=>x.statuses))].join('|'));}
console.log(JSON.stringify(out.byStatus));
await s.close();
