import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const NUM='S10043-17581';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await page.getByText('All',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
  const x=page.locator('.q-btn,.q-chip').filter({hasText:/Status:/}).first().locator('i').filter({hasText:/^cancel$/}); if(await x.count()){ await x.click({force:true}); await page.waitForTimeout(2500);} 
  await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
  await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(NUM,{delay:40}); await page.waitForTimeout(4500);
  const hdrs=async()=>page.evaluate(()=>[...document.querySelectorAll('button[aria-label^="Pin "],button[aria-label^="Unpin "]')].map(b=>b.getAttribute('aria-label')));
  let all=new Set((await hdrs())); 
  for(let i=0;i<30;i++){ await page.evaluate(()=>{const els=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+50 && getComputedStyle(e).overflowX!='visible'); els.forEach(e=>e.scrollLeft+=600);}); await page.waitForTimeout(400); (await hdrs()).forEach(h=>all.add(h)); }
  const arr=[...all]; log('pin buttons seen',arr.length, arr.filter(a=>/ZZ|Unpin/.test(a)).join(' | '), '| last:',arr.slice(-5).join(' | '));
  const t=await body(); log('has NUM',t.includes(NUM),'| has Ana',t.includes('ZZAUTOTEST Ana'));
  const i=t.indexOf(NUM); log('around card:',t.slice(Math.max(0,i-300),i+250));
  await dump('board-search-num');
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
