import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const ENV=process.env.ENV;
const ids=process.env.WOS.split(','); const pages=[s.page]; for(let i=1;i<ids.length;i++) pages.push(await s.ctx.newPage());
const log=[]; pages.forEach((p,i)=>p.on('response',async r=>{ if(/invoices\/create/.test(r.url())) log.push({tab:i+1,status:r.status(),body:(await r.text().catch(()=>'')).slice(0,200)}); }));
const host=new URL(s.page.url()).origin;
await Promise.all(pages.map((p,i)=>p.goto(host+'/workorders/'+ids[i]+'/finance',{waitUntil:'commit'}))); await Promise.all(pages.map(p=>p.waitForTimeout(7000)));
const btns=await Promise.all(pages.map(p=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||'').trim().slice(0,30)).filter(x=>/invoice/i.test(x)))));
console.log(JSON.stringify(btns));
if(process.env.GO){ const sel=process.env.BTN||'[data-test-id="button_create_invoice"]';
  for(const [i,p] of pages.entries()) await p.screenshot({path:`../ev/${ENV}-tab${i+1}-before.png`});
  await Promise.all(pages.map(p=>p.click(sel))); await Promise.all(pages.map(p=>p.waitForTimeout(800)));
  // a confirm dialog may follow
  for(const p of pages){ const c=p.locator('.q-dialog [data-test-id="button_confirm_dialog"]'); if(await c.count()) {} }
  await Promise.all(pages.map(p=>p.waitForTimeout(4000)));
  for(const [i,p] of pages.entries()){ await p.screenshot({path:`../ev/${ENV}-tab${i+1}-after.png`}); console.log('tab',i+1,JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification, .q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,200))))); }
  console.log(JSON.stringify(log)); }
await s.close(); process.exit(0);
