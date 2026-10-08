import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt7'); const b=await start('/parts/returns','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const fb=(re)=>page.locator('.q-btn,button').filter({hasText:re}).first();
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.locator('.q-btn,button,.q-tab').filter({hasText:/^\s*Credits\s*$/}).first().click(); await page.waitForTimeout(4000); log('CRED date now (after reload earlier)',(await fb(/Date:/).innerText()).replace(/\s+/g,' '));
 await fb(/Date:/).click(); await page.waitForTimeout(1200); await page.locator('.q-menu [role=radio], .q-menu .q-item').filter({hasText:/90 days/}).first().click().catch(e=>log('90',e.message.slice(0,40))); await page.waitForTimeout(2500); await esc(); log('picked',(await fb(/Date:/).innerText()).replace(/\s+/g,' '),'url',page.url());
 await page.reload(); await page.waitForTimeout(8000); log('RELOAD url',page.url(),'tab active',await page.evaluate(()=>[...document.querySelectorAll('.q-btn')].filter(e=>/^(Returns|Credits)$/.test(e.innerText.trim())).map(e=>e.innerText.trim()+':'+e.className.includes('active')+':'+e.getAttribute('aria-pressed')).join(',')),'date btn',await fb(/Date:/).count()); await page.screenshot({path:OUT+'PT7-after-reload.png'});
 await page.locator('.q-btn,button,.q-tab').filter({hasText:/^\s*Credits\s*$/}).first().click(); await page.waitForTimeout(4000); log('back on Credits date',(await fb(/Date:/).innerText()).replace(/\s+/g,' '));
 await fb(/Date:/).click(); await page.waitForTimeout(1200); await page.locator('.q-menu [role=radio], .q-menu .q-item').filter({hasText:/30 days/}).first().click(); await page.waitForTimeout(2000); await esc(); log('restored',(await fb(/Date:/).innerText()).replace(/\s+/g,' '));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
