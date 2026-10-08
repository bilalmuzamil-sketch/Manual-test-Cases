import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('st3'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const IDX={'First Name':0,'Last Name':1,'Email':2,'Role':6,'Dept':7,'Location':8}; const F=(l)=>page.locator('.q-dialog .q-field').nth(IDX[l]);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000);
 for(const [fn,ln] of [['ZZAUTOTEST Dan','Delta'],['ZZAUTOTEST Ezra','Echo']]){
  await page.goto(B+'/administration/staff'); await page.waitForTimeout(5000);
  await page.locator('button',{hasText:/New Staff Member/}).first().click(); await page.waitForTimeout(2500);
  await F('First Name').locator('input').fill(fn); await F('Last Name').locator('input').fill(ln); await F('Email').locator('input').fill('zzautotest.'+ln.toLowerCase()+'.'+(Date.now()%100000)+'@example.com');
  await F('Role').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:/^\s*Technician\s*$/}).first().click(); await page.waitForTimeout(700);
  await F('Dept').click(); await page.waitForTimeout(1200); log('DEPT OPTS',(await menu(page)).split('||').slice(1).join('|')); await page.locator('[role=option],.q-menu .q-item').filter({hasText:/^\s*(check\s*)?Service\s*$/}).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  await F('Location').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:'Staging Heavy Duty'}).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  const tc=page.locator('.q-dialog .q-toggle').filter({hasText:'Time Clock'}).first(); if(await tc.getAttribute('aria-checked')!=='true'){await tc.click(); await page.waitForTimeout(500);} 
  log('dlg',(await menu(page)).slice(0,500)); await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click(); await page.waitForTimeout(4000); log('after save',(await menu(page)).slice(0,200));
 }
 await page.goto(B+'/schedule'); await page.waitForTimeout(7000); for(let i=0;i<15;i++){ await page.mouse.move(400,700); await page.mouse.wheel(0,800); await page.waitForTimeout(400); }
 const t=await body(); log('SCHED ZZ',(t.match(/ZZAUTOTEST \w+ \w+/g)||[]).join(','));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('ST3-err');}
await b.browser.close();
