import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('r7'); const S=st(); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const search=async(v)=>{ await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); await page.keyboard.type(v,{delay:30}); await page.waitForTimeout(3500); };
const C='ZZAUTOTEST Regression Walk';
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 // Vera
 await page.goto(B+'/impersonate-user/'+S.uVera); await page.waitForTimeout(9000); log('VERA top',(await body()).slice(0,140));
 await page.getByRole('button',{name:'List'}).click().catch(()=>{}); await page.waitForTimeout(3000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 log('VERA create btn',await page.getByRole('button',{name:'Create Work Order'}).count(), 'btns',(await btns(page)).slice(8,24));
 await search(C); const W=S.woG.num; const row=page.locator('tbody tr').filter({hasText:W}).first(); const ic=row.locator('button,i').filter({hasText:'location_on'}).first();
 const st0=await ic.evaluate(e=>{const b=e.closest('button')||e; return (b.disabled||b.getAttribute('aria-disabled'))+'|'+b.className.slice(-80)+'|'+getComputedStyle(e).color;}); await ic.click({force:true}).catch(e=>log('click err',e.message.slice(0,60))); await page.waitForTimeout(2500);
 const st1=await ic.evaluate(e=>{const b=e.closest('button')||e; return (b.disabled||b.getAttribute('aria-disabled'))+'|'+b.className.slice(-80)+'|'+getComputedStyle(e).color;}); log('VERA aos before',st0,'after',st1,'url',page.url(),'notes',await notes(page)); await page.screenshot({path:OUT+'R7-vera-list.png'});
 await page.reload(); await page.waitForTimeout(7000); const ic2=page.locator('tbody tr').filter({hasText:W}).first().locator('button,i').filter({hasText:'location_on'}).first(); log('VERA aos reload',await ic2.evaluate(e=>getComputedStyle(e).color));
 await page.getByRole('button',{name:'Exit'}).click(); await page.waitForTimeout(8000); log('EXIT1',(await body()).slice(0,100));
 // Nate
 await page.goto(B+'/impersonate-user/'+S.uNate); await page.waitForTimeout(9000); log('NATE top',(await body()).slice(0,140));
 await page.getByRole('button',{name:'List'}).click().catch(()=>{}); await page.waitForTimeout(3000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 log('NATE heads',await heads()); await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500); log('NATE colsel',await menu(page)); await esc();
 await page.evaluate(()=>{const el=[...document.querySelectorAll('.q-virtual-scroll')][0]; if(el) el.scrollTop=el.scrollHeight;}); await page.waitForTimeout(2500); log('NATE tail',(await body()).slice(-250)); await page.screenshot({path:OUT+'R7-nate-list.png'}); await dump('R7-nate-list');
 await page.getByRole('button',{name:'Exit'}).click(); await page.waitForTimeout(8000); log('EXIT2',(await body()).slice(0,100));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R7-err'); await page.getByRole('button',{name:'Exit'}).click().catch(()=>{}); await page.waitForTimeout(5000);}
await b.browser.close();
