import {start,mk,L,menu,notes,btns,B,OUT} from './h.mjs';
const log=L('i9'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(20000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const colsel=async()=>{ await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1500); const r=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [role=checkbox], .q-menu .q-toggle')].map(e=>e.innerText.replace(/\s+/g,' ').trim()+':'+(e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked')))); await esc(); return r;};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(4000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(4000);
 log('ADMIN heads',await heads()); log('ADMIN colsel',await colsel()); log('LS keys',await page.evaluate(()=>Object.keys(localStorage)));
 await page.goto(B+'/impersonate-user/db7729af-b3f0-42a6-8ed4-68d71d68de78'); await page.waitForTimeout(9000);
 log('IMP top',(await body()).slice(0,120));
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(4000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(4000);
 log('ANA heads',await heads()); log('ANA colsel',await colsel()); await dump('I9-ana-list');
 await page.getByRole('button',{name:'Tech View'}).click(); await page.waitForTimeout(4000); log('ANA TV heads',await heads()); 
 const d=page.getByRole('button',{name:/Density|format_line_spacing/}); log('density btn',await d.count()); if(await d.count()){await d.first().click(); await page.waitForTimeout(1200); log('ANA density menu',await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ')+':'+e.className.includes('active')))); await esc();}
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:'Exit'}).click(); await page.waitForTimeout(8000); log('EXITED',(await body()).slice(0,150));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('I9-err');}
await b.browser.close();
