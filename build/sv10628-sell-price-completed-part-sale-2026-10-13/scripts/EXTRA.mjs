// Parts Manager (reset+assigned): totals before/after on a vendor-only completed part sale, the part-dialog path, a paid part sale
import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {resetRole,assignRole} from './roles.mjs';
const roles=JSON.parse(fs.readFileSync('roles.json')); const tech=JSON.parse(fs.readFileSync('tech-before.json')); const role=roles.find(r=>r.name==='Parts Manager');
const HD={id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',tz:'America/Edmonton'}, LB={id:'f8a8b802-7780-4b16-bf10-343caeb616b2',tz:'America/Edmonton'};
const setLoc=async(x,l)=>{ await post(x,'/api/iam/change-location',{workplace_id:l.id,workplace_timezone:l.tz}); await x.page.evaluate(l=>{localStorage.setItem('location',JSON.stringify(l.id)); localStorage.setItem('timezone',JSON.stringify(l.tz));},l); };
const out={};
let a=await ob({dpr:1}); const rr=await resetRole(a,role.id); out.reset={n0:rr.before.length,n1:rr.after.length,added:rr.added,removed:rr.removed}; out.assign=await assignRole(a,tech,role.id);
const paid=JSON.parse(fs.readFileSync('paid.json'));
await a.close();
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[];
p.on('response',async r=>{ if(/parts\/change|change-request|part-sales|work-orders\/parts/.test(r.url())&&r.request().method()!=='GET'){ let b=''; try{b=(await r.text()).slice(0,200);}catch(e){} net.push({st:r.status(),url:new URL(r.url()).pathname,req:(r.request().postData()||'').slice(0,260),res:b}); } });
const fin=()=>p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText?.trim()==='Financial Info'); let n=h; for(let i=0;i<4&&n;i++) n=n.parentElement; return n?n.innerText.replace(/\n+/g,' | '):null;});
const geo=t=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];},t);
const finGeo=()=>p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText?.trim()==='Financial Info'); let n=h; for(let i=0;i<4&&n;i++) n=n.parentElement; const r=n.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];});
// 1. vendor-only completed part sale P2-209 (closest to the customer's)
await setLoc(s,HD); await s.go('/parts/part-sale/e71fd04b-aa1c-4b9a-b895-857803117877/part-requests'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_sell_price_"]')].map(e=>e.getAttribute('data-test-id').replace('input_sell_price_','')));
const PR=ids[0]; const tid='input_sell_price_'+PR; out.ps={num:await p.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText),status0:await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText),pstat:await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText,'badge_part_request_status_'+PR),pn:await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.value,'input_part_number_'+PR)};
out.ps.price0=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).value,tid); out.ps.fin0=await fin();
out.ps.geo0={price:await geo(tid),status:await geo('badge_wo_status'),num:await geo('text_wo_number'),pstat:await geo('badge_part_request_status_'+PR),fin:await finGeo()};
await p.screenshot({path:'ev/after-1-before-edit.png'});
const inp=p.locator(`[data-test-id="${tid}"]`); await inp.click(); await inp.press('Control+a'); out.ps.typed='35.00'; await inp.pressSequentially('35.00',{delay:90}); await inp.press('Enter'); await p.waitForTimeout(3500);
out.ps.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## '));
await p.reload(); await p.waitForTimeout(5000);
out.ps.price1=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.value,tid); out.ps.status1=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText); out.ps.fin1=await fin();
out.ps.geo1={price:await geo(tid),status:await geo('badge_wo_status'),num:await geo('text_wo_number'),pstat:await geo('badge_part_request_status_'+PR),fin:await finGeo()};
await p.screenshot({path:'ev/after-2-after-edit-reload.png'});
// 2. the open-a-part path: part menu
const mb='button_part_request_menu_'+ids[1]; let b=await s.box(mb); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
out.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu, [role=menu]')].map(m=>m.innerText.replace(/\s+/g,' ')+' :: '+[...m.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(',')).join(' ## '));
await p.screenshot({path:'ev/after-3-menu.png'});
const edit=p.locator('.q-menu .q-item, [role=menu] [role=menuitem]').filter({hasText:/edit/i}).first();
if(await edit.count()){ await edit.click(); await p.waitForTimeout(2500); out.dialog=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,600)+' :: '+[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(',')).join(' ## ')); await p.screenshot({path:'ev/after-4-dialog.png'}); }
else { await p.keyboard.press('Escape'); }
// 3. paid part sale
const loc=paid.number.startsWith('P3')?LB:HD; await setLoc(s,loc); await s.go('/parts/part-sale/'+paid.id+'/part-requests'); await p.waitForTimeout(4000);
out.paid={num:await p.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText),status:await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText),inputs:await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_sell_price_"]')].map(e=>({v:e.value,dis:!!(e.disabled||e.readOnly)})))};
await p.screenshot({path:'ev/after-5-paid.png'});
out.net=net; fs.writeFileSync('runs/extra.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1).slice(0,4000));
await s.close();
