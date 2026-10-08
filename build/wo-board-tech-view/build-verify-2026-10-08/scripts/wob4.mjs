import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/administration/staff'); const {dump,ov,tip,go,esc,body}=mk(page);
const IDX={'First Name':0,'Last Name':1,'Email':2,'Role':6,'Dept':7,'Location':8}; const F=(lbl)=>page.locator('.q-dialog .q-field').nth(IDX[lbl]);
const pickOpt=async(txt)=>{const o=page.getByRole('option').filter({hasText:txt}).first(); if(await o.count()){await o.click();return true;} const q=page.locator('.q-menu .q-item').filter({hasText:txt}).first(); if(await q.count()){await q.click();return true;} return false;};
try{
  for(const [fn,ln] of [['ZZAUTOTEST Ana','Alpha'],['ZZAUTOTEST Ben','Bravo']]){
    await go('/administration/staff',7000);
    if((await body()).includes(fn)) { log('exists',fn); continue; }
    await page.locator('button',{hasText:/New Staff Member/}).first().click(); await page.waitForTimeout(2500);
    log('fields:',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field')].map((f,i)=>i+':'+(f.querySelector('.q-field__label')||{}).innerText).join(' | '))); await F('First Name').locator('input').fill(fn); await F('Last Name').locator('input').fill(ln);
    await F('Email').locator('input').fill(`zzautotest.${ln.toLowerCase()}.${Date.now()%100000}@example.com`);
    await F('Role').click(); await page.waitForTimeout(1200); log('role options:',(await page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.trim()).join(' | '))).slice(0,400)); log('picked Technician',await pickOpt(/^Technician$/)); await page.waitForTimeout(700);
    await F('Dept').click(); await page.waitForTimeout(1200); const dopts=await page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.trim())); log('dept options:',dopts.join(' | ').slice(0,300)); await page.locator('[role=option],.q-menu .q-item').first().click().catch(()=>{}); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    await F('Location').click(); await page.waitForTimeout(1200); log('loc options:',(await page.evaluate(()=>[...document.querySelectorAll('[role=option],.q-menu .q-item')].map(e=>e.innerText.trim()).join(' | '))).slice(0,300)); log('picked loc',await pickOpt('Staging Heavy Duty')); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    const tc=page.locator('.q-dialog .q-toggle').filter({hasText:'Time Clock'}).first(); log('time clock toggle count',await tc.count(), 'aria-checked', await tc.getAttribute('aria-checked').catch(()=>null)); if(await tc.getAttribute('aria-checked')!=='true'){ await tc.click(); await page.waitForTimeout(500);} log('time clock now',await tc.getAttribute('aria-checked').catch(()=>null));
    log('dialog before save:',(await ov()).slice(0,500)); await dump('staff-new-filled-'+ln);
    await page.locator('.q-dialog button',{hasText:'Save & Close'}).first().click(); await page.waitForTimeout(4000); log('after save:',(await ov()).slice(0,300));
  }
  await go('/administration/staff',7000); const b=await body(); log('staff list has Ana:',b.includes('ZZAUTOTEST Ana'),'Ben:',b.includes('ZZAUTOTEST Ben'));
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
