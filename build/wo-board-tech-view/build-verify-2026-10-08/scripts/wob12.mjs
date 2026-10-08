import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines', NUM='S10043-17581';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
const opts=async()=>page.evaluate(()=>[...document.querySelectorAll('[role=option]')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
try{
  await go(WO,9000); const c=page.locator('.q-dialog i:text("close")').first(); if(await c.count()) await c.click({force:true}).catch(()=>{}); await page.waitForTimeout(800);
  await page.locator('[data-test-id="select_lead_technician"]').click({force:true}); await page.waitForTimeout(1500);
  let seen=new Set(); for(let i=0;i<15;i++){ (await opts()).forEach(x=>seen.add(x)); await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(m) m.scrollTop+=400;}); await page.waitForTimeout(500);} 
  const all=[...seen]; log('lead option count',all.length,'last ones:',all.slice(-8).join(' | '));
  const o=page.getByRole('option').filter({hasText:'ZZAUTOTEST Ana'}).first(); log('Ana visible',await o.count());
  if(await o.count()){ await o.click(); await page.waitForTimeout(4000); log('after pick overlay:',(await ov()).slice(0,500)); await dump('lead-pick-result'); }
  const t=await body(); log('lead now:',t.slice(t.indexOf('Lead Technician'),t.indexOf('Lead Technician')+60));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
