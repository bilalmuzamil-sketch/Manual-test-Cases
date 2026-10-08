import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l3c'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const tabSel=()=>page.evaluate(()=>[...document.querySelectorAll('.q-tab--active, [role=tab][aria-selected=true]')].map(e=>e.innerText.trim()).join(','));
const atm=()=>page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/Assigned to me/.test(e.innerText)); return b? b.getAttribute('aria-pressed'):'none';});
const toggleCol=async(name)=>{ await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item').filter({hasText:name}).locator('.q-toggle').first().click(); await page.waitForTimeout(2000); await esc(); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); log('saved now tab',await tabSel(),'atm',await atm());
 await toggleCol('Days open'); log('HEADS on',await heads()); await page.reload(); await page.waitForTimeout(7000); log('HEADS reload',await heads()); await dump('L3c-days-open-reload');
 await toggleCol('Days open'); log('HEADS restored',await heads());
 // 204 again with saved = All, atm off
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); log('BASE2 tab',await tabSel(),'atm',await atm(),'URL',page.url());
 await page.goto(B+'/workorders?tab=estimate&assigned_to_me=1'); await page.waitForTimeout(7000); log('LINK2 tab',await tabSel(),'atm',await atm());
 const wl=page.locator('a').filter({hasText:/^Work Orders$/}).first(); log('topmenu href',await wl.getAttribute('href')); await wl.click(); await page.waitForTimeout(6000); log('TOPMENU2 tab',await tabSel(),'atm',await atm(),'URL',page.url()); await page.screenshot({path:OUT+'L3c-topmenu-after-link.png'});
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); log('DIRECT tab',await tabSel(),'atm',await atm(),'URL',page.url());
 // restore: All, atm off
 if(await atm()==='true'){ await page.getByRole('button',{name:/Assigned to me/}).click(); await page.waitForTimeout(2000);} await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); log('RESTORED tab',await tabSel(),'atm',await atm());
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L3c-err');}
await b.browser.close();
