// Tab A: PO receive screen open. Tab B: removes that item from the purchase order (on screen). Tab A: Receive → message.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-rcv2tab`; fs.mkdirSync(out,{recursive:true});
const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env];
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env};
const api=(u,b)=>A.evaluate(async([u,b,base])=>{ const loc=JSON.parse(localStorage.getItem('location')||'null'); const r=await fetch(base+u,{method:b?'POST':'GET',credentials:'include',headers:Object.assign({'content-type':'application/json'},loc?{'x-location-id':loc}:{}),body:b?JSON.stringify(b):undefined}); const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {st:r.status,j,t:t.slice(0,300)}; },[u,b,s.host.api]);
await s.go('/workorders'); await A.waitForTimeout(2000); if(process.env.LOC){ await A.evaluate(l=>localStorage.setItem('location',JSON.stringify(l)),process.env.LOC); } R.loc=await A.evaluate(()=>localStorage.getItem('location')); await s.go(`/workorders/${WO}/lines`); await A.waitForTimeout(4000);
// set-up: a vendor part request on an approved line, ordered
const lines=(await api(`/api/work-orders/lines/${WO}`)).j?.data?.collection||[]; const L=lines.find(l=>/authori/i.test(l.status||l.line_status||''))||lines[0];
const prs=(await api(`/api/work-orders/${WO}/parts/list-requests-by-line`)).j; const cat=(JSON.stringify(prs).match(/"part_category_id":"([0-9a-f-]{36})"/)||[])[1];
const vend=(JSON.stringify(prs).match(/"vendor_id":"([0-9a-f-]{36})"/)||[])[1];
R.pn='ZZRC'+Date.now()%100000;
const mk=await api('/api/work-orders/part/make-request',{line:L.line_id,work_order:WO,description:'ZZAUTOTEST receive after removal',quantity:1,part_source_type:'vendor',part_number:R.pn,price:12.5,part_category_id:cat,vendor_id:vend});
const prq=(JSON.stringify(mk.j).match(/"(?:part_request_id|id)":"([0-9a-f-]{36})"/)||[])[1]; const ord=await api('/api/work-orders/part/perform-request-status-action',{part_request_id:prq}); R.po=ord.j?.data?.orderId; console.log('set-up',mk.st,ord.st,R.pn,R.po);
// tab A: the receive screen
await s.go(`/order/${R.po}?receive=1&workOrderId=${WO}`); await A.waitForTimeout(6000); await A.screenshot({path:out+'/A-receive-open.png'});
R.poNumber=await A.evaluate(()=>document.body.innerText.match(/\b[A-Z0-9]{1,3}-\d{3,6}\b/g)?.slice(0,5));
// tab B: remove the item from the PO on screen
const B=await s.ctx.newPage(); await B.goto(s.host.app+`/order/${R.po}`,{waitUntil:'domcontentloaded'}); await B.waitForTimeout(6000);
const items=(await api('/api/inventory/orders/'+R.po)).j?.data?.order?.items||[]; const mine=items.find(i=>i.part_number===R.pn); R.mineKeys=mine?Object.keys(mine).filter(k=>/id/.test(k)).map(k=>k+'='+String(mine[k]).slice(0,8)).join(','):'none';
const oid=mine&&(mine.order_item_id||mine.id); R.oid=oid; const rm=B.locator(`[data-test-id="button_remove_order_item_${oid}"]`); R.removeButtons=await rm.count();
if(R.removeButtons){ await rm.first().click(); await B.waitForTimeout(1500);
  for(let k=0;k<3;k++){ const btns=await B.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim())); (R.Bdialog=R.Bdialog||[]).push(btns.join(' ; '));
    const yes=B.locator('.q-dialog button',{hasText:/^(Yes|Remove|Delete|Confirm|Are You Sure\?)$/i}); if(await yes.count()){ await yes.last().click(); await B.waitForTimeout(1500);} else break; } }
await B.waitForTimeout(2000); await B.screenshot({path:out+'/B-after-remove.png'}); R.orderAfter=(await api('/api/inventory/orders/'+R.po)).j?.data?.order?.items?.length;
// tab A (no reload): fill the invoice, tick the item, Receive
A.on('response',async r=>{ if(r.request().method()==='POST'&&/receive|accept/.test(r.url())) (R.posts=R.posts||[]).push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,250)); });
R.cardCount=await A.evaluate(pn=>{ const cb=[...document.querySelectorAll('[data-test-id^="checkbox_item_"]')].find(c=>(c.closest('tr')||c.parentElement?.parentElement)?.innerText.includes(pn)); let e=cb; while(e&&!([...e.querySelectorAll('button')].some(b=>/Receive Parts/.test(b.innerText)))) e=e.parentElement; if(e){ e.setAttribute('data-qa-card','1'); return 1;} return 0; },R.pn);
const card=A.locator('[data-qa-card="1"]');
await card.locator('input').filter({hasNot:A.locator('[type=checkbox]')}).nth(0).count();
const invIn=card.locator('.q-field',{hasText:'Vendor Invoice'}).locator('input').first(); await invIn.fill('ZZINV'+Date.now()%10000).catch(e=>R.invErr=e.message.slice(0,80));
R.boxes=await A.evaluate(pn=>{ const out=[]; for(const cb of document.querySelectorAll('[data-test-id^="checkbox_item_"]')){ const row=cb.closest('tr')||cb.parentElement?.parentElement; const mine=!!row&&row.innerText.includes(pn); const on=cb.getAttribute('aria-checked')==='true'||cb.classList.contains('q-checkbox--truthy'); if(on!==mine) cb.click(); out.push((mine?'MINE ':'')+(on?'on':'off')); } return out; },R.pn); await A.waitForTimeout(800);
await card.scrollIntoViewIfNeeded().catch(()=>{}); await A.screenshot({path:out+'/A-ready.png'}); R.cardInfo=await A.evaluate(()=>{const c=document.querySelector('[data-qa-card="1"]'); return {text:c.innerText.replace(/\s+/g,' ').slice(0,400), btn:[...c.querySelectorAll('button')].filter(b=>/Receive Parts/.test(b.innerText)).map(b=>b.innerText.trim()+' disabled='+(b.disabled||b.getAttribute('aria-disabled'))), inv:[...c.querySelectorAll('input')].map(i=>i.value).slice(0,4)};});
R.clicked=await A.evaluate(()=>{const b=[...document.querySelector('[data-qa-card="1"]').querySelectorAll('button')].find(b=>/Receive Parts/.test(b.innerText)); if(b){b.click(); return b.innerText.trim();} return null;});
const toasts=[]; for(let i=0;i<20;i++){ for(const x of await A.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!toasts.includes(x)) toasts.push(x); if(toasts.length&&i>5) break; await A.waitForTimeout(300);} R.toasts=toasts;
await A.screenshot({path:out+'/A-after-receive.png'});
console.log(JSON.stringify(R,null,1).slice(0,2200)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
