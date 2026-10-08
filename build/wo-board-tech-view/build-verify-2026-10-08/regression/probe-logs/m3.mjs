import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,B,OUT} from './h.mjs';
const log=L('m3'); const b=await start('/workorders?search=S2-17578','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(4000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); log('SEARCH 17578',(await body()).match(/No work orders[^.]*\.|S2-17578 \S+ \S+/g));
 await page.goto(B+'/dashboard'); await page.waitForTimeout(9000);
 const card=page.locator('.q-card').filter({hasText:'At Risk Customers'}).last();
 const col=(i)=>card.evaluate((c,i)=>[...c.querySelectorAll('tbody tr')].map(r=>r.children[i]?.innerText.trim()).filter(Boolean).slice(0,5),i);
 log('heads',await card.evaluate(c=>[...c.querySelectorAll('th')].map(e=>e.innerText.trim())));
 log('C0',await col(0));
 await card.locator('th').filter({hasText:'Customer'}).first().click({force:true}); await page.waitForTimeout(2500); log('C sort1',await col(0)); await card.locator('th').filter({hasText:'Customer'}).first().click({force:true}); await page.waitForTimeout(2500); log('C sort2',await col(0));
 await card.locator('th').filter({hasText:'Revenue'}).first().click({force:true}); await page.waitForTimeout(2500); log('Rev sort1',await col(3));
 await page.screenshot({path:OUT+'M3-dashboard-arc.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('M3-err');}
await b.browser.close();
