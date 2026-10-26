import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2], wo=process.argv[3];
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; const out={};
for(const w of [1440,1024]){ await p.setViewportSize({width:w,height:900}); await s.go(`/workorders/${wo}/part-requests`); await p.waitForTimeout(7000);
 out[w]=await p.evaluate(()=>{ const t=[...document.querySelectorAll('table.q-table')].sort((a,b)=>b.querySelectorAll('tr').length-a.querySelectorAll('tr').length)[0]; if(!t) return {none:location.pathname};
  const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.width*10)/10,Math.round(r.height*10)/10]};
  const ths=[...t.querySelectorAll('thead th')].map(h=>h.innerText.trim()+'@'+R(h)[0]+(getComputedStyle(h).position==='sticky'?'(sticky)':''));
  const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>10);
  const fh=[...new Set([...t.querySelectorAll('.q-field__control')].map(c=>Math.round(c.getBoundingClientRect().height)))];
  const labels=[...new Set([...t.querySelectorAll('.q-field__label')].filter(l=>l.getBoundingClientRect().height>0).map(l=>l.innerText.trim()))];
  const cellCls=[...new Set([...t.querySelectorAll('tbody td')].map(td=>(td.className.match(/[\w-]+-cell/)||['-'])[0]))];
  const m=t.closest('.q-table__middle'); return {ths,rowH:rows.map(r=>Math.round(r.getBoundingClientRect().height)),fieldH:fh,labels,cellCls,table:[m.scrollWidth,m.clientWidth]}; });
 await p.screenshot({path:`/tmp/qa11631/w/wo-${env}-${w}.png`}); }
console.log(JSON.stringify(out,null,1)); process.exit(0);
