import {open} from './qa.mjs'; import fs from 'fs';
const [env,W,terms]=[process.argv[2],+process.argv[3],process.argv[4].split(',')]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:W,height:1000},dpr:2})); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(3500);}
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(800);
const inp=(await p.evaluateHandle(()=>document.activeElement)).asElement(); const out=[];
for(const t of terms){ await inp.fill(''); await inp.type(t,{delay:30}); await p.waitForTimeout(4000);
  const v=await p.evaluate(()=>{const H=innerHeight;return [...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].filter(b=>{const r=b.getBoundingClientRect();return r.top>0&&r.bottom<H}).map(b=>{const r=b.getBoundingClientRect();return {n:(b.closest('tr').innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+r.width.toFixed(2),x:+r.x.toFixed(1),y:+r.y.toFixed(1),h:+r.height.toFixed(1)};});});
  const st=[...new Set(v.map(x=>x.t))]; out.push({term:t,rows:v.length,statuses:st,widths:[...new Set(v.map(x=>x.w))],v}); console.log(t,v.length,st.join('|'),[...new Set(v.map(x=>x.w))]);
  await p.screenshot({path:`/tmp/qa11310/mix-${env}-${W}-${t.replace(/\W/g,'_')}.png`}); }
fs.writeFileSync(`/tmp/qa11310/mix-${env}-${W}.json`,JSON.stringify({mk,out},null,1)); await s.close();
