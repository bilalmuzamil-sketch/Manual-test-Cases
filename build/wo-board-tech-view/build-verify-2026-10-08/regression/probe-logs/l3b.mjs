import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l3b'); const b=await start('/workorders?tab=estimate&assigned_to_me=1','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const tabSel=()=>page.evaluate(()=>[...document.querySelectorAll('.q-tab--active, [role=tab][aria-selected=true]')].map(e=>e.innerText.trim()).join(','));
const atm=()=>page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/Assigned to me/.test(e.innerText)); return b? b.getAttribute('aria-pressed'):'none';});
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 log('LINK tab',await tabSel(),'atm',await atm());
 await page.locator('header a, nav a, a').filter({hasText:/^Work Orders$/}).first().click(); await page.waitForTimeout(6000); log('AFTER topmenu tab',await tabSel(),'atm',await atm(),'URL',page.url()); await page.screenshot({path:OUT+'L3-after-topmenu.png'});
 // 205
 const cnt=async()=>page.evaluate(()=>document.querySelectorAll('tbody tr').length);
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); log('BASE tab',await tabSel(),'URL',page.url());
 const aosBtn=page.getByRole('button',{name:/Asset on Site/}).first(); log('aos text',await aosBtn.innerText());
 await page.goto(B+'/workorders?vehicleHere=2'); await page.waitForTimeout(7000); log('VH2 tab',await tabSel(),'URL',page.url(),'notes',await notes(page),'aos text',await page.getByRole('button',{name:/Asset on Site/}).first().innerText()); await page.getByRole('button',{name:/Asset on Site/}).first().click(); await page.waitForTimeout(1500); log('AOS menu',await menu(page)); await esc(); await page.screenshot({path:OUT+'L3-vehiclehere2.png'});
 // column selection structure
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000);
 await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500);
 log('CS html',await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const it=[...m.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText==='Days open'); let p=it; for(let i=0;i<4;i++) p=p.parentElement; return p.outerHTML.slice(0,700);}));
 const item=page.locator('.q-menu .q-item, .q-menu [role=checkbox], .q-menu label').filter({hasText:'Days open'}).first(); await item.click(); await page.waitForTimeout(2000); log('after item click',await page.evaluate(()=>[...document.querySelectorAll('.q-menu [aria-checked]')].map(e=>(e.closest('.q-item,label')?.innerText||'').trim()+':'+e.getAttribute('aria-checked')).join(' | ')));
 await esc(); log('HEADS',await heads()); await page.reload(); await page.waitForTimeout(7000); log('HEADS reload',await heads());
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L3b-err');}
await b.browser.close();
