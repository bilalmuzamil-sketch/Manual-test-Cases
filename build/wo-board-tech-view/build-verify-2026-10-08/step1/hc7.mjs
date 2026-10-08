import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc7.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
const T=async(n,f)=>{try{await f();}catch(e){log('ERR',n,e.message.slice(0,200));}};
const openWO=async(num)=>{ await go('/workorders',7000); await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(num,{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:num}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000); };
const status=async()=>{const t=await body(); return (t.match(/\b(Estimate|Approved|In Progress|In progress|Ready For Review|Review|Complete|Invoiced|Paid|Declined)\b/g)||[]).slice(0,4).join(',');};
const addLine=async(approved)=>{ const nl=page.locator('button:has-text("New Line")').first(); if(!(await page.locator('text=What Are You Doing?').count())) { await nl.click(); await page.waitForTimeout(2500);} 
  const w=page.locator('input').filter({has:page.locator('xx')}); const f=page.getByLabel('What Are You Doing?').first(); await f.click(); await f.pressSequentially('grease',{delay:90}); await page.waitForTimeout(3000); log('LINE OPTS',(await ov()).split('||').pop().slice(0,200));
  await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1200);
  if(approved){ await page.locator('text=Line Approved').first().click(); await page.waitForTimeout(600);} 
  await page.locator('button:has-text("Save & Close")').first().click(); await page.waitForTimeout(5000); };
await T('declined',async()=>{ await openWO('S10043-17595'); log('before',await status());
  await page.locator('tbody button:has-text("Decline"), button:has-text("Decline")').first().click(); await page.waitForTimeout(3000); log('DECLINE DLG',await ov());
  const c=page.locator('.q-dialog button').filter({hasText:/^(Decline|Confirm|Yes|OK)$/}).last(); if(await c.count()){await c.click(); await page.waitForTimeout(4000);}
  await page.reload(); await page.waitForTimeout(7000); log('17595 after decline',await status()); await dump('hc-17595-declined');
});
await T('inprogress',async()=>{ await openWO('S10043-17594'); log('17594 before',await status());
  await addLine(true); log('17594 after approved line',await status());
  const st=page.locator('button:has-text("Start")').first(); log('start count',await page.locator('button:has-text("Start")').count()); await st.click(); await page.waitForTimeout(3000); log('START DLG',await ov());
  await page.reload(); await page.waitForTimeout(7000); log('17594 after start',await status()); await dump('hc-17594-started');
  const sp=page.locator('button:has-text("Stop")').first(); if(await sp.count()){await sp.click(); await page.waitForTimeout(3000); log('STOP',await ov());}
  await page.reload(); await page.waitForTimeout(6000); log('17594 after stop',await status());
});
await b.browser.close();
