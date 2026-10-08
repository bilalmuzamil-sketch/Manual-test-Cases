import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l3'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const rows=()=>page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,70)).filter(Boolean));
const tabSel=()=>page.evaluate(()=>[...document.querySelectorAll('.q-tab--active, [role=tab][aria-selected=true]')].map(e=>e.innerText.trim()).join(','));
const atm=()=>page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button],.q-chip,.q-btn')].find(e=>/Assigned to me/.test(e.innerText)); return b? (b.getAttribute('aria-pressed')+'|'+b.className.slice(0,120)):'none';});
const C='ZZAUTOTEST Regression Walk';
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(3000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 log('BASE tab',await tabSel(),'atm',await atm(),'URL',page.url());
 // 194
 await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500); await page.locator('.q-menu').getByText('Days open',{exact:true}).click(); await page.waitForTimeout(1500); await esc(); log('HEADS after on',await heads());
 await page.reload(); await page.waitForTimeout(7000); log('HEADS after reload',await heads(), 'tab',await tabSel());
 await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500); await page.locator('.q-menu').getByText('Days open',{exact:true}).click(); await page.waitForTimeout(1500); await esc(); log('HEADS restored',await heads());
 // 199 rapid tabs
 for(const t of ['Estimates','Completed','Work Orders','Completed']){ await page.getByText(t,{exact:true}).first().click(); await page.waitForTimeout(150);} await page.waitForTimeout(5000);
 const r=await rows(); const statuses=[...new Set(r.map(x=>(x.match(/^(location_on )?(\w+)/)||[])[2]))]; log('RAPID tab',await tabSel(),'URL',page.url(),'statuses',statuses,'n',r.length,'notes',await notes(page));
 // 203/204
 await page.goto(B+'/workorders?tab=estimate&assigned_to_me=1'); await page.waitForTimeout(7000); log('LINK tab',await tabSel(),'atm',await atm(),'URL',page.url()); await dump('L3-link-estimate-atm'); await page.screenshot({path:OUT+'L3-link-estimate-atm.png'});
 await page.getByRole('button',{name:'Work Orders'}).first().click(); await page.waitForTimeout(6000); log('AFTER topmenu tab',await tabSel(),'atm',await atm(),'URL',page.url()); await page.screenshot({path:OUT+'L3-after-topmenu.png'});
 // 205
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); log('ALL count text',(await body()).match(/\$[\d,]+\.\d\d\s*$/)?.[0]);
 await page.goto(B+'/workorders?vehicleHere=2'); await page.waitForTimeout(7000); log('VH2 tab',await tabSel(),'URL',page.url(),'notes',await notes(page)); const aos=page.getByRole('button',{name:/Asset on Site/}).first(); await aos.click(); await page.waitForTimeout(1500); log('AOS menu',await menu(page)); await esc(); await page.screenshot({path:OUT+'L3-vehiclehere2.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L3-err');}
await b.browser.close();
