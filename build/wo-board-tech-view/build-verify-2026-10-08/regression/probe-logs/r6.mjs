import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('r6'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const IDX={'First Name':0,'Last Name':1,'Email':2,'Role':6,'Dept':7,'Location':8}; const F=(l)=>page.locator('.q-dialog .q-field').nth(IDX[l]);
const api=(p)=>page.evaluate(async(p)=>{const tok=localStorage.getItem('token'); const h={}; if(tok) h.Authorization='Bearer '+tok.replace(/"/g,''); const r=await fetch('https://sv10043api.qa.shopview.com/api/'+p,{credentials:'include',headers:h}); return await r.text();},p);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(1500);
 for(const [fn,ln,role] of [['ZZAUTOTEST Vera','Viewonly','ZZAUTOTEST WO View Only'],['ZZAUTOTEST Nate','Nofinance','ZZAUTOTEST No Financial']]){
  await page.goto(B+'/administration/staff'); await page.waitForTimeout(5000);
  await page.locator('button',{hasText:/New Staff Member/}).first().click(); await page.waitForTimeout(2500);
  await F('First Name').locator('input').fill(fn); await F('Last Name').locator('input').fill(ln); await F('Email').locator('input').fill('zzautotest.'+ln.toLowerCase()+'.'+(Date.now()%100000)+'@example.com');
  await F('Role').click(); await page.waitForTimeout(1200); log('ROLE OPTS',(await menu(page)).split('||').slice(1).join('|').slice(0,400)); await page.locator('[role=option],.q-menu .q-item').filter({hasText:role}).first().click(); await page.waitForTimeout(700);
  await F('Dept').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:/^\s*(check\s*)?Service\s*$/}).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  await F('Location').click(); await page.waitForTimeout(1200); await page.locator('[role=option],.q-menu .q-item').filter({hasText:'Staging Heavy Duty'}).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  log('dlg',(await menu(page)).slice(0,400)); await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click(); await page.waitForTimeout(4000); log('after save',(await menu(page)).slice(0,200));
 }
 for(const q of ['Vera','Nate']){ const j=JSON.parse(await api('staff?limit=50&search=ZZAUTOTEST '+q)); const x=j.data.collection[0]; log(q,x&&x.id,x&&x.role_label); save('u'+q,x&&x.id); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R6-err');}
await b.browser.close();
