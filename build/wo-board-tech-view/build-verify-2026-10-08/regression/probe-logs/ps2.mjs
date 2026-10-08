import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ps2'); const S=st(); const b=await start(S.psUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 for(const [k,d] of [[0,'ZZAUTOTEST Brake Pads'],[1,'ZZAUTOTEST Air Filter']]){
  if(!(await page.locator('.q-dialog').filter({hasText:'Add Part'}).count())){ await page.getByRole('button',{name:/^Add Part$/}).first().click(); await page.waitForTimeout(2500);} 
  const d0=page.locator('.q-dialog').filter({hasText:'Add Part'}).last();
  await d0.getByLabel('Description').fill(d); await d0.getByLabel('Quantity').fill('1');
  await d0.getByLabel('Vendor').click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item,[role=option]').first().click(); await page.waitForTimeout(800);
  await d0.getByLabel('Cost',{exact:true}).first().fill('100'); await d0.getByLabel('Sell price').first().fill('290.91');
  log('ADD',k,(await d0.innerText()).replace(/\s+/g,' ').slice(0,300));
  await d0.getByRole('button',{name:k===0?'Save and add part':'Save & close'}).click(); await page.waitForTimeout(4000); log('after',k,await notes(page),(await menu(page)).slice(0,200));
 }
 await page.reload(); await page.waitForTimeout(6000); const t=await body(); const i=t.indexOf('Parts ('); log('PS PAGE',t.slice(i,i+900)); await dump('PS2-part-sale-with-parts');
 // status card click candidates
 log('CARD',t.slice(t.indexOf('P10043'),t.indexOf('Financial Info')));
 await page.goto(B+'/parts/part-sales'); await page.waitForTimeout(6000); const num=(t.match(/P10043-\d+/)||[])[0]; log('NUM',num);
 await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); await page.keyboard.type(num,{delay:30}); await page.waitForTimeout(4000);
 log('LIST ROW',await page.evaluate((n)=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).find(x=>x.includes(n)),num)); log('HEADS',await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).join('|')));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PS2-err');}
await b.browser.close();
