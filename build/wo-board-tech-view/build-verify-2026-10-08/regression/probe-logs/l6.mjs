import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('l6e'); const S=st(); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const rowOf=(n)=>page.evaluate((n)=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).find(t=>t.includes(n))||'none',n);
const C='ZZAUTOTEST Regression Walk';
const search=async(v)=>{ await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); await page.keyboard.type(v,{delay:30}); await page.waitForTimeout(3500); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await search(C);
 // 202
 await page.getByRole('button',{name:'Create Work Order'}).click(); await page.waitForTimeout(2500);
 const cf=page.locator('.q-dialog .q-field').nth(0); await cf.click(); await page.keyboard.type(C,{delay:50}); await page.waitForTimeout(3000); await page.locator('.q-menu .q-item,[role=option]').filter({hasText:C}).first().click(); await page.waitForTimeout(2000);
 const af=page.locator('.q-dialog .q-field').nth(1); await af.click(); await page.waitForTimeout(2000); await page.locator('.q-menu .q-item,[role=option]').first().click(); await page.waitForTimeout(1000);
 await page.locator('.q-dialog button',{hasText:/^Save$/}).first().click(); await page.waitForTimeout(5000); if(await page.locator('.q-dialog').filter({hasText:'Confirmation'}).count()){ await page.locator('.q-dialog').filter({hasText:'Confirmation'}).getByRole('button',{name:'Create'}).click(); await page.waitForTimeout(7000);} 
 const num=((await body()).match(/S10043-\d+/)||[])[0]; log('NEW',num,page.url()); save('woH',{num,url:page.url().replace(/\/lines.*$/,'')});
 await page.locator('.q-dialog button').filter({hasText:/^close$/}).first().click().catch(()=>{}); await page.waitForTimeout(1200); log('dialogs left',await page.locator('.q-dialog').count());
 await page.locator('a').filter({hasText:/^Work Orders$/}).first().click(); await page.waitForTimeout(5000); log('LIST url',page.url()); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await search(C); log('NEW ROW',await rowOf(num)); await page.screenshot({path:OUT+'L6-new-wo-listed.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L6-err');}
await b.browser.close();
