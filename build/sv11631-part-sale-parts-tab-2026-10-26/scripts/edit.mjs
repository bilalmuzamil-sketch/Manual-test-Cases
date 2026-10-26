import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; const WO='48ba5757-175a-4701-8c4a-810791ac2ede', ID='67f881ab-7fd1-45e0-970e-c88a43f864e3';
await s.go(`/parts/part-sale/${WO}/part-requests`); await p.waitForTimeout(6500);
const writes0=s.writes.length;
const costSel=`.base-table tbody tr:nth-child(2) .cost-cell input`;
const rowOf=await p.evaluate(()=>[...document.querySelectorAll('.base-table tbody tr')].findIndex(r=>[...r.querySelectorAll('input')].some(i=>i.value==='ZZ12CHARPN01')));
await p.evaluate(()=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value==='ZZ12CHARPN01')); r.setAttribute('data-qa-stress','1');}); const sel='tr[data-qa-stress] .cost-cell input';
const rest=await p.$eval(sel,i=>i.value); const c=await p.$(sel); await c.click(); await p.waitForTimeout(800);
const editing=await p.$eval(sel,i=>i.value); await p.screenshot({path:'/tmp/qa11631/w/hov/cost-editing.png'});
await p.keyboard.press('Tab'); await p.waitForTimeout(1500); const after=await p.$eval(sel,i=>i.value);
const api=(await s.api(`/api/work-orders/${WO}/parts/list-requests-by-line?search=`)).json.data.collection.flatMap(l=>l.part_requests).find(x=>x.id===ID);
console.log(JSON.stringify({rest,editing,afterBlur:after,writesDuringEdit:s.writes.slice(writes0),stored:{cost:api.cost,cost_decimal:api.cost_decimal}}));
// R17: open description dropdown of an editable row, check option overlap
const dsel='tr[data-qa-stress] .description-cell .q-field__control'; const d=await p.$(dsel); const db=await d.boundingBox(); await p.mouse.click(db.x+db.width/2,db.y+db.height/2); await p.waitForTimeout(2500);
const ov=await p.evaluate(()=>{ const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().height>0)[0]; if(!m) return null; const items=[...m.querySelectorAll('.q-item')].map(i=>{const r=i.getBoundingClientRect(); const kids=[...i.querySelectorAll('.q-item__label, .q-item__section')].map(k=>{const b=k.getBoundingClientRect();return [b.y,b.height]}); return {y:r.y,h:r.height,t:i.innerText.replace(/\n/g,' / ').slice(0,80),sh:i.scrollHeight,ch:i.clientHeight}}).filter(x=>x.h>0);
  let overlaps=0, inner=0; for(let k=1;k<items.length;k++){ if(items[k].y < items[k-1].y+items[k-1].h-0.5) overlaps++; } for(const it of items){ if(it.sh>it.ch+1) inner++; }
  // text-level overlap inside items: compare text line boxes
  const lines=[...m.querySelectorAll('.q-item__label')].map(l=>{const b=l.getBoundingClientRect();return [b.y,b.y+b.height]}).sort((a,b)=>a[0]-b[0]); let lo=0; for(let k=1;k<lines.length;k++) if(lines[k][0]<lines[k-1][1]-0.5) lo++;
  return {count:items.length,overlaps,itemsWithOverflow:inner,labelOverlaps:lo,first:items.slice(0,4)}; });
await p.screenshot({path:'/tmp/qa11631/w/hov/desc-dropdown.png'}); console.log(JSON.stringify(ov)); process.exit(0);
