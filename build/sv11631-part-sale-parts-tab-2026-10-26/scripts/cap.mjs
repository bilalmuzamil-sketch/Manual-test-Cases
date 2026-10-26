import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')); const O='/tmp/qa11631/w/cap/'; fs.mkdirSync(O,{recursive:true}); const B={};
const P109='48ba5757-175a-4701-8c4a-810791ac2ede', P162='90a95f29-f405-4763-834d-6e3a237f8c33';
const R=`e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}`;
const boxOf=(p,fn)=>p.evaluate(`(()=>{const R=${R}; ${fn}})()`);
const s=await open({env:'branch',ticket:'11631',cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true}); const p=s.page;
B.marker=await s.marker();
// A: 1440 P2-109 — real PN + Requested badge + scrollbar
await s.go(`/parts/part-sale/${P109}/part-requests`); await p.waitForTimeout(6500); await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
B.A=await boxOf(p,`const t=document.querySelector('.base-table'); const m=t; const r=[...t.querySelectorAll('tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value==='WK4707Q-23KW'));
 return {table:R(m), pn:R(r.querySelector('.part-number-cell input')), badge:R(r.querySelector('.status-cell .q-badge')), actTh:R([...t.querySelectorAll('thead th')].find(h=>h.innerText.trim()==='Actions')), sw:m.scrollWidth, cw:m.clientWidth, row:R(r)}`);
await p.screenshot({path:O+'A-1440-p2109.png'});
const pn=B.A.pn; await p.mouse.move(pn[0]+pn[2]/2,pn[1]+pn[3]/2,{steps:5}); await p.waitForTimeout(1800);
B.A.tipsOnPn=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText)); await p.screenshot({path:O+'A-1440-pn-hover.png'});
// D: tooltip over dropdown on stress row
await p.mouse.move(5,5); await p.waitForTimeout(500);
const dsel=await boxOf(p,`const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value==='ZZ12CHARPN01')); return R(r.querySelector('.description-cell .q-field__control'))`);
await p.mouse.move(dsel[0]+dsel[2]*0.4,dsel[1]+dsel[3]/2,{steps:5}); await p.waitForTimeout(1500); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(2200);
B.D=await boxOf(p,`const tip=[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0)[0]; const m=[...document.querySelectorAll('.q-menu')].filter(t=>t.getBoundingClientRect().height>0)[0]; const it=m?m.querySelector('.q-item'):null; return {tip:tip?R(tip):null,tipText:tip?tip.innerText:null,firstOption:it?R(it):null,optText:it?it.innerText.replace(/\\n/g,' / '):null,field:R([...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value==='ZZ12CHARPN01')).querySelector('.description-cell .q-field__control'))}`);
await p.screenshot({path:O+'D-1440-tooltip-over-dropdown.png'}); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
// B: 1440 P2-162 — category + Actions heading
await s.go(`/parts/part-sale/${P162}/part-requests`); await p.waitForTimeout(6500); await p.mouse.move(5,5);
B.B=await boxOf(p,`const t=document.querySelector('.base-table'); const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>10); const r=rows.find(r=>r.querySelector('.category-cell').innerText.includes('HD-Filters')||[...r.querySelectorAll('.category-cell .q-field__native *')].some(x=>x.textContent.includes('HD-Filters')));
 const th=[...t.querySelectorAll('thead th')].find(h=>h.innerText.trim()==='Actions'); const w=document.createTreeWalker(th,NodeFilter.SHOW_TEXT); let n,tx=null; while(n=w.nextNode()){ if(n.textContent.trim()==='Actions'){const g=document.createRange(); g.selectNodeContents(n); tx=R(g);} }
 return {cat:R(r.querySelector('.category-cell .q-field__control')), catCell:R(r.querySelector('.category-cell')), actTh:R(th), actText:tx, rowsTop:R(rows[0]), rowsBottom:R(rows[rows.length-1]), header:R(t.querySelector('thead tr'))}`);
await p.screenshot({path:O+'B-1440-p2162.png'});
// C: 1024 P2-109 sell price under Actions
await p.setViewportSize({width:1024,height:900}); await s.go(`/parts/part-sale/${P109}/part-requests`); await p.waitForTimeout(6500); await p.mouse.move(5,5);
B.C=await boxOf(p,`const t=document.querySelector('.base-table'); const r=[...t.querySelectorAll('tbody tr')].find(r=>[...r.querySelectorAll('input')].some(i=>i.value==='251903321')); return {sell:R(r.querySelector('.sell-price-cell .q-field__control')), act:R(r.querySelector('.part-sale-primary-cell')), actTh:R([...t.querySelectorAll('thead th')].find(h=>h.innerText.trim()==='Actions')), sellTh:R([...t.querySelectorAll('thead th')].find(h=>h.innerText.trim()==='Sell Price'))}`);
await p.screenshot({path:O+'C-1024-p2109.png'});
B.marker2=await s.marker(); fs.writeFileSync(O+'boxes.json',JSON.stringify(B,null,1)); console.log(JSON.stringify(B).slice(0,1800)); process.exit(0);
