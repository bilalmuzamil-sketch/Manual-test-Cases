import {open} from './qa.mjs'; import fs from 'fs';
const [env,W,list]=[process.argv[2],+process.argv[3],process.argv[4].split(',')]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:W,height:1000},dpr:2})); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(3500);}
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(800);
const inp=await p.evaluateHandle(()=>document.activeElement.tagName==='INPUT'?document.activeElement:[...document.querySelectorAll('input')].find(i=>/search/i.test(i.placeholder||'')||/search/i.test(i.getAttribute('data-test-id')||'')));
const res=[];
for(const n of list){ await inp.asElement().fill(''); await inp.asElement().type(n,{delay:30}); await p.waitForTimeout(3500);
  const v=await p.evaluate(()=>[...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].map(b=>{const tr=b.closest('tr');return {n:(tr.innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+b.getBoundingClientRect().width.toFixed(2),td:+b.closest('td').getBoundingClientRect().width.toFixed(1),th:+[...document.querySelectorAll('th')].find(t=>/^Status/.test(t.innerText.trim())).getBoundingClientRect().width.toFixed(1)};}));
  const row=v.find(x=>x.n===n)||v[0]; res.push({q:n,rows:v.length,...row}); await p.screenshot({path:`/tmp/qa11310/sr-${env}-${W}-${n}.png`}); }
await inp.asElement().fill(''); await p.waitForTimeout(2500);
fs.writeFileSync(`/tmp/qa11310/sr-${env}-${W}.json`,JSON.stringify({mk,res},null,1)); console.log(env,W,mk.version); for(const r of res) console.log(JSON.stringify(r));
await s.close();
