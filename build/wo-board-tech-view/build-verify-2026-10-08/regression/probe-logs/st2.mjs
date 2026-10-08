import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('st2'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000);
 for(const n of ['ZZAUTOTEST Ana','ZZAUTOTEST Ben','ZZAUTOTEST Cal']){
  await page.goto(B+'/administration/staff'); await page.waitForTimeout(5000);
  await page.locator('main').getByText('Search',{exact:true}).first().click(); await page.waitForTimeout(800); await page.keyboard.type(n,{delay:50}); await page.waitForTimeout(3500);
  await page.locator('tbody tr').filter({hasText:n.split(' ')[1]}).first().locator('button').last().click(); await page.waitForTimeout(3000);
  const tg=page.locator('.q-dialog [aria-label="Set working hours for this technician"]'); if((await tg.getAttribute('aria-checked'))!=='true'){ await tg.click(); await page.waitForTimeout(1500);} 
  if(n.includes('Ana')){ log('HOURS DLG',await menu(page)); log('IN',(await inputs(page,'.q-dialog')).slice(9)); await dump('ST2-hours-on'); }
  await page.locator('.q-dialog button').filter({hasText:'Save & Close'}).click(); await page.waitForTimeout(3500); log(n,'saved',await notes(page),(await menu(page)).slice(0,200));
 }
 await page.goto(B+'/schedule'); await page.waitForTimeout(7000); for(let i=0;i<15;i++){ await page.mouse.move(400,700); await page.mouse.wheel(0,800); await page.waitForTimeout(400); }
 const t=await body(); log('SCHED ZZ',(t.match(/ZZAUTOTEST \w+ \w+/g)||[]).join(','));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('ST2-err');}
await b.browser.close();
