// production part sale: cored inventory part qty 2 -> Authorize -> Return Core dialog (cancel, confirm), stale second tab
import {prod1,post} from '../common.mjs'; import fs from 'fs'; const PN=process.argv[2]||'1237944'; const s=await prod1('/tmp/qa75'); const p=s.page; await p.setViewportSize({width:1900,height:1100});
const R={marker:await s.marker(),utc:new Date().toISOString(),pn:PN}; let n=0; const shot=async t=>{n++; await p.screenshot({path:`sv11715/${String(n).padStart(2,'0')}-${t}.png`});};
const box=async id=>p.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},id);
const C='bd77eaa6-963f-43fc-9a91-b950810ebf67'; let id=process.env.ID; if(!id){ const cr=await post(s,'/api/part-sales',{company_id:C}); id=cr.j?.data?.[0]?.id; R.create=cr.st; } R.id=id;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
if(!process.env.ID){
if(!(await box('select_part'))){ const b=await box('button_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500); }
let b=await box('select_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500); await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3000);
const o=await p.evaluate(pn=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(pn)&&/Inventory/.test(x.innerText)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\n+/g,' | ')};},PN); R.opt=o?.t; await p.mouse.click(o.x,o.y); await p.waitForTimeout(2000);
const bins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id'))); R.bins=bins;
if(bins.length){ const l=p.locator(`[data-test-id="${bins[0]}"]`); const tag=await l.evaluate(e=>e.tagName); await (tag==='INPUT'?l:l.locator('input')).fill('2'); await p.waitForTimeout(500); }
await shot('add-part-qty2'); b=await box('button_workorder_part_save'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500);
} // end add
// authorize
const au=p.locator('button:has-text("Authorize")').first(); R.authBtn=await au.count(); if(R.authBtn&&!process.env.ID){ await au.click(); await p.waitForTimeout(2500); const d=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText?.replace(/\n+/g,' | ')); R.authDlg=d; if(d){ const y=p.locator('.q-dialog button',{hasText:/yes|confirm|authorize/i}).last(); if(await y.count()) await y.click(); await p.waitForTimeout(2500);} }
const tot=async()=>{const v=(await s.api('/api/work-orders/view/'+id)).json?.data?.work_order||{}; return {status:v.status,total:v.total_cost,parts:v.total_parts_cost,tax:v.total_tax_cost,num:v.display_number};};
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(4000);
const pk=p.locator('tbody tr button:has-text("Pick")').first(); R.pickBtn=await pk.count(); if(R.pickBtn){ await pk.click(); await p.waitForTimeout(2500); R.pickDlg=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText?.replace(/\n+/g,' | ')?.slice(0,400)); await shot('pick-dialog');
  if(R.pickDlg){ const y=p.locator('.q-dialog button',{hasText:/pick|confirm|yes|save/i}).last(); if(await y.count()) await y.click(); await p.waitForTimeout(3000); } await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(4000); }
R.t0=await tot(); await shot('authorized-before-return');
R.rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim().slice(0,160)).filter(Boolean).slice(0,6));
const rc=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="button_return_core_"]')].map(e=>e.getAttribute('data-test-id'))); R.returnCoreBtns=rc;
if(!rc.length){ fs.writeFileSync('sv11715/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1)); await s.close(); process.exit(0); }
const clickRC=async(pg)=>{ await pg.waitForSelector(`[data-test-id="${rc[0]}"]`,{timeout:30000}); const t=await pg.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`); e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},rc[0]); await pg.mouse.click(t.x,t.y); await pg.waitForTimeout(2000);
  return pg.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.replace(/\n+/g,' | '),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()+'['+(b.getAttribute('data-test-id')||'')+']')}:null;}); };
// 1) dialog, Cancel
const reqs=[]; p.on('request',q=>{ if(q.method()!=='GET'&&/core|return/i.test(q.url())) reqs.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'')); });
R.d1=await clickRC(p); await shot('return-core-dialog'); await p.locator('.q-dialog button',{hasText:/^Cancel$/}).first().click(); await p.waitForTimeout(2000); R.cancelReqs=[...reqs]; R.t1=await tot(); await shot('after-cancel');
// 2) open a stale second tab showing the same sale
const p2=await p.context().newPage(); await p2.setViewportSize({width:1900,height:1100}); await p2.goto(p.url()); await p2.waitForTimeout(6000);
// confirm in tab 1
R.d2=await clickRC(p); const conf=R.d2?.btns.find(b=>!/cancel|close/i.test(b)); R.confirmBtn=conf; await p.locator('.q-dialog button',{hasText:conf.split('[')[0]}).last().click(); await p.waitForTimeout(3500);
R.toast1=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); R.t2=await tot(); R.confirmReqs=reqs.slice(R.cancelReqs.length); await shot('after-confirm');
R.rowsAfter=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim().slice(0,160)).filter(Boolean).slice(0,6));
// stale tab: click Return Core and confirm
const resp2=[]; p2.on('response',async r=>{ if(r.request().method()!=='GET'&&/core|return/i.test(r.url())) resp2.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,200)); });
R.d3=await clickRC(p2); if(R.d3){ await p2.locator('.q-dialog button',{hasText:conf.split('[')[0]}).last().click(); await p2.waitForTimeout(3500); }
R.staleToast=await p2.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); R.staleResp=resp2; R.staleDlgOpen=await p2.evaluate(()=>!!document.querySelector('.q-dialog')); await p2.screenshot({path:'sv11715/09-stale-tab.png'}); R.t3=await tot();
fs.writeFileSync('sv11715/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,6000)); await s.close(); process.exit(0);
