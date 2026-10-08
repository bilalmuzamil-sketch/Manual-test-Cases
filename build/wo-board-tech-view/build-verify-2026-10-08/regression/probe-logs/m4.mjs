import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,setLead,B,OUT} from './h.mjs';
const log=L('m4'); const b=await start('/workorders?search=S2-17578','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(4000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); log('ROW',await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).find(t=>t.includes('S2-17578'))));
 await page.locator('tbody tr').filter({hasText:'S2-17578'}).first().locator('td').nth(2).click(); await page.waitForTimeout(8000); log('URL',page.url()); const t=await body(); log('CARD',t.slice(t.indexOf('S2-17578'),t.indexOf('S2-17578')+400)); log('lead dropdown',await page.locator('.q-field').filter({hasText:'Lead Technician'}).count()); await page.screenshot({path:OUT+'M4-S2-17578.png'}); await dump('M4-S2-17578');
 const lt=page.locator('text=/Lead [Tt]echnician/').first(); await lt.click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('after click menu',await menu(page));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('M4-err');}
await b.browser.close();
