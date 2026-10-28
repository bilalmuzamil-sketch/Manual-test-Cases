// Credit memo "requested quantity exceeds available" reached ON SCREEN with two tabs:
// seed a part sale (new customer, 2 x stocked inventory part, invoiced), open Issue Credit in tab A and tab B,
// issue the credit in tab B, then press Issue Credit in tab A and read the pop-up. Usage: node cm2tab.mjs <branch|prod>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const PN={branch:'ZZPV590814',prod:'ZZPV737915'}[env]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416';
const out=`ev/messages/${env}-cm2tab`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const A=s.page; const H=env==='prod'?{'x-location-id':LOC}:{};
if(env==='prod'){ await s.go('/workorders'); await A.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(b)});
const toast=pg=>pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
let invId=process.env.INV, cid=process.env.CID, cname='', psId='', inv={json:null};
if(!invId){
// 1. customer + part sale
 if(process.env.CUST){ cname=process.env.CUST; const r=await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),{headers:H}); cid=(r.json?.data?.collection||[]).find(x=>x.name===cname)?.id; console.log('customer (existing)',cname,cid); }
else { cname='ZZAUTOTEST SV10928 credit '+Date.now()%100000; const c=await post('/api/customers/create',{name:cname}); cid=c.json?.data?.company_id; console.log('customer',c.status,cname,cid); }
await s.go('/parts/part-sales'); await A.waitForTimeout(4000); await A.locator('[data-test-id="button_new_part_sale"]').click(); await A.waitForTimeout(1500);
await A.locator('[data-test-id="select_customer"]').click(); await A.waitForTimeout(500); await A.keyboard.type(cname.slice(0,26),{delay:50}); await A.waitForTimeout(3000);
const co=await A.evaluate(n=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(n)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};},cname); console.log('customer option',JSON.stringify(co));
await A.mouse.click(co.x,co.y); await A.waitForTimeout(1000); await A.locator('[data-test-id="button_save_part_sale"]').click(); await A.waitForTimeout(5000);
psId=(A.url().match(/part-sale\/([0-9a-f-]{36})/)||[])[1]; console.log('part sale (on screen)',psId,A.url().replace(/^https:\/\/[^/]+/,''));
// 2. first part on screen (creates the Default line)
if(!/part-requests/.test(A.url())){ await s.go(`/parts/part-sale/${psId}/part-requests`); } await A.waitForTimeout(3000);
if(!(await A.locator('[data-test-id="select_part"]').count())){ await A.locator('[data-test-id="button_add_part"]').first().click(); await A.waitForTimeout(1500); }
await A.locator('[data-test-id="select_part"]').first().click(); await A.waitForTimeout(500); await A.keyboard.type(PN,{delay:60}); await A.waitForTimeout(3000);
const o=await A.evaluate(pn=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(pn)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\n+/g,' | ')};},PN); console.log('option',JSON.stringify(o));
await A.mouse.click(o.x,o.y); await A.waitForTimeout(2000);
const bins=await A.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id'))); console.log('bins',bins);
const bl=A.locator(`[data-test-id="${bins[0]}"]`); await ((await bl.evaluate(e=>e.tagName))==='INPUT'?bl:bl.locator('input')).fill('2'); await A.waitForTimeout(600);
await A.locator('[data-test-id="button_workorder_part_save"]').click(); await A.waitForTimeout(3500);
// 3. invoice it
for(const st of ['approved','complete']) console.log('status',st,(await post('/api/work-orders/change-status',{id:psId,status:st})).status);
inv=await post('/api/invoices/create',{work_order_id:psId}); console.log('invoice',inv.status,JSON.stringify(inv.json).slice(0,200));
invId=inv.json?.data?.invoice_id; }
console.log('invoice id',invId,'customer',cid);
// 4. two tabs on the customer's Invoices tab, Issue Credit open in both
const B=await A.context().newPage(); await B.setViewportSize({width:1440,height:900});
const openDlg=async pg=>{ await pg.goto(s.host.app+`/customers/${cid}/invoices`,{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(6000);
  const n=await pg.locator(`[data-test-id^="checkbox_transaction_"]`).count();
  for(let i=0;i<Math.min(n,8);i++){ const cb=pg.locator(`[data-test-id^="checkbox_transaction_"]`).nth(i); await cb.click(); await pg.waitForTimeout(800);
    await pg.locator('[data-test-id="button_issue_credit_customer"]').click(); await pg.waitForTimeout(3500);
    const txt=await pg.evaluate(()=>document.querySelector('.q-dialog')?.innerText||''); if(!process.env.PART||txt.includes(process.env.PART)) break;
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200); await cb.click(); await pg.waitForTimeout(600); }
  await pg.locator('[data-test-id="input_credit_memo_reason"]').fill('ZZAUTOTEST SV-10928 two tabs'); await pg.waitForTimeout(1500);
  return pg.evaluate(()=>({rows:[...document.querySelectorAll('[data-test-id^="input_parts_return_quantity_"]')].map(e=>(e.querySelector('input')||e).value), dlg:document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)})); };
console.log('tab A dialog',JSON.stringify(await openDlg(A))); console.log('tab B dialog',JSON.stringify(await openDlg(B)));
await A.bringToFront(); await A.screenshot({path:`${out}/1-tabA-dialog-open.png`});
await B.bringToFront(); await B.locator('.q-dialog [data-test-id="button_confirm_dialog"]').click(); await B.waitForTimeout(4000); console.log('tab B after Issue Credit',JSON.stringify(await toast(B)));
await B.screenshot({path:`${out}/2-tabB-credited.png`});
await A.bringToFront(); const w0=s.writes.length; await A.locator('.q-dialog [data-test-id="button_confirm_dialog"]').click(); await A.waitForTimeout(1500);
const t=await toast(A); console.log('TAB A POP-UP',JSON.stringify(t)); await A.screenshot({path:`${out}/3-tabA-popup.png`});
console.log('writes',JSON.stringify(s.writes.slice(w0).map(w=>w.slice(0,200))));
fs.writeFileSync(`${out}/result.json`,JSON.stringify({env,cname,cid,psId,part:PN,invoice:inv.json,popup:t},null,1));
await s.close(); process.exit(0);
