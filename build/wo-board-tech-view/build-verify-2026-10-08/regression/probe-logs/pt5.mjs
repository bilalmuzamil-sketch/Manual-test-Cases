import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt5'); const b=await start('/parts/returns','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.locator('.q-btn,button').filter({hasText:/Vendorkeyboard|Vendor\s*keyboard/}).first().click().catch(async()=>{ await page.getByText('Vendor',{exact:true}).first().click(); }); await page.waitForTimeout(2000);
 log('MENU HTML',await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m? m.outerHTML.replace(/\s+/g,' ').slice(0,1500):'none';}));
 await esc(); await page.locator('.q-btn,button,.q-tab').filter({hasText:/^\s*Credits\s*$/}).first().click(); await page.waitForTimeout(4000); log('CREDITS url',page.url(),'btns',(await btns(page)).slice(18,34).join(' ; ')); const t=await body(); const i=t.indexOf('arrow_drop_up'); log('CREDITS head',t.slice(Math.max(0,i-200),i+300)); await dump('PT5-credits');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
