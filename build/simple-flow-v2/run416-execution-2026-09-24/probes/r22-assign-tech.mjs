// As the administrator: put the technician on the seeded work order, so they can open it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const techs = await (await ctx.request.get(`https://${APIH}/api/technicians`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
const list = techs.collection || techs.data?.collection || techs.data || [];
console.log('technicians in this shop:', JSON.stringify(list.map(x=>({n:(x.first_name||'')+' '+(x.last_name||''), e:x.email})).slice(0,12)));
await openWo(page, WO); await page.waitForTimeout(5000);
// the work order card carries "Lead Technician"; open it and pick the limited person
const opened = await page.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0 && (e.textContent||'').trim()==='Lead Technician');
  if(!el) return 'no Lead Technician field on the card';
  let row=el.parentElement; for(let i=0;i<4&&row;i++){ const clickable=row.querySelector('.q-field, .q-select, [role=button]'); if(clickable){ clickable.click(); return 'opened the lead technician field'; } row=row.parentElement; }
  el.parentElement.click(); return 'clicked near the field'; });
console.log(opened); await page.waitForTimeout(3500);
const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,15));
console.log('offered:', JSON.stringify(items));
await page.screenshot({ path: `${EV}/assign-tech.png`, fullPage: true });
await browser.close();
