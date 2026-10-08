import {start,mk,L,menu,inputs,st} from './h.mjs';
const log=L('s2b'); const u=st().custUrl.replace('https://sv10043.qa.shopview.com',''); const b=await start(u,'admin'); const {page}=b; const {dump}=mk(page); page.setDefaultTimeout(15000);
try{ await page.getByRole('tab',{name:/Contacts/}).first().click(); await page.waitForTimeout(4000);
 await page.getByRole('button',{name:/New Contact/i}).first().click(); await page.waitForTimeout(3000); log('OV',await menu(page)); log('IN',await inputs(page,'.q-dialog'));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
