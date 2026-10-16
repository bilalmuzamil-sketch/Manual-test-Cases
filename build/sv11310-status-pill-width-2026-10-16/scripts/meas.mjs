import {open} from './qa.mjs'; import fs from 'fs';
const [env,W]=[process.argv[2],+(process.argv[3]||1600)]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:W,height:1000},dpr:2})); const p=s.page;
const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
const meta=await p.evaluate(()=>({tabs:[...document.querySelectorAll('[role=tab],.q-tab')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(Boolean),
 display:[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/display|view|list|board/i.test(t)).slice(0,20),
 zoom:window.devicePixelRatio, iw:innerWidth}));
const sel=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=display_option_wrapper_]')].map(e=>e.getAttribute('data-test-id')+':'+e.className.slice(0,80)));
meta.before=await sel();
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]').catch(()=>{}); await p.waitForTimeout(800); await p.click('[data-test-id=display_option_list]').catch(e=>console.log('clickfail',e.message)); await p.waitForTimeout(4000); meta.after=await sel(); }
const res={}; const seen=new Set();
async function collect(tab){
  for(let i=0;i<80;i++){
    const rows=await p.evaluate(()=>[...document.querySelectorAll('td.cell.status .q-badge')].filter(b=>!b.parentElement.closest('.q-badge')).map(b=>{const tr=b.closest('tr');const r=b.getBoundingClientRect();const cs=getComputedStyle(b);
      return {n:(tr.innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||[tr.innerText.slice(0,30)])[0],sub:[...b.querySelectorAll('.q-badge')].map(x=>x.innerText.trim()).join(','),t:b.innerText.trim(),w:+r.width.toFixed(2),minw:cs.minWidth,wd:cs.width,pad:cs.paddingLeft+'/'+cs.paddingRight,td:+b.closest('td').getBoundingClientRect().width.toFixed(1)};}));
    for(const r of rows){const k=tab+'|'+r.n+'|'+r.t; if(seen.has(k))continue; seen.add(k); (res[r.t]??=[]).push({tab,...r});}
    const more=await p.evaluate(()=>{const sc=document.querySelector('.q-table__middle.scroll,.q-virtual-scroll,.q-table__middle'); if(!sc) {window.scrollBy(0,800);return false;} const b=sc.scrollTop; sc.scrollTop+=700; return sc.scrollTop!==b;});
    await p.waitForTimeout(500); if(!more && i>2) break;
  }
}
await collect('All');
const sum={}; for(const [t,a] of Object.entries(res)){const ws=[...new Set(a.map(x=>x.w))]; sum[t]={n:a.length,widths:ws,minw:[...new Set(a.map(x=>x.minw))],pad:[...new Set(a.map(x=>x.pad))],td:[...new Set(a.map(x=>x.td))],ex:a.slice(0,2).map(x=>x.n)};}
const out={env,W,mk,meta,sum}; fs.writeFileSync(`/tmp/qa11310/meas-${env}-${W}.json`,JSON.stringify({out,res},null,1)); console.log(JSON.stringify(out,null,1));
await s.close();
