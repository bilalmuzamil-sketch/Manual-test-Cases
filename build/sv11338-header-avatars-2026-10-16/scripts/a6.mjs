import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(!await p.$('[data-test-id=board_view]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(5000);}
const seen={};
for(let i=0;i<80;i++){ const r=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=board_column_avatar_]')].map(a=>{const cs=getComputedStyle(a);const sp=a.querySelector('span')||a;return [a.getAttribute('data-test-id'),!!a.querySelector('img'),cs.backgroundColor,getComputedStyle(sp).color,a.title||a.innerText.trim()];}));
  for(const x of r) seen[x[0]]=x; const more=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); const b=sc.scrollLeft; sc.scrollLeft+=1200; return sc.scrollLeft!==b;}); await p.waitForTimeout(500); if(!more) break; }
const v=Object.values(seen); const agg={}; for(const x of v){const k=(x[1]?'PHOTO':'initials')+' '+x[2]+' '+x[3]; agg[k]=(agg[k]||0)+1;}
console.log(v.length, JSON.stringify(agg), JSON.stringify(v.filter(x=>x[1]).map(x=>x[4])));
await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0);
await s.close();
