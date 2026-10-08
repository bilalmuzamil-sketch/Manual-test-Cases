import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc8.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500);
 await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 await page.locator('button:has-text("Stop")').first().click(); await page.waitForTimeout(2500);
 log('DLG BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()))));
 await dump('hc-stop-dialog');
 const ta=page.locator('.q-dialog textarea, .q-dialog input[type=text]').first(); await ta.click(); await ta.fill('ZZAUTOTEST check'); await page.waitForTimeout(1500);
 log('DLG BTNS 2',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()))));
 log('CLICKABLES',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog [role=button], .q-dialog .q-btn, .q-dialog a, .q-dialog [tabindex]')].filter(e=>e.offsetParent).map(e=>e.tagName+':'+(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,40)))));
 await page.locator('.q-dialog button:has-text("Clock Out")').last().click(); await page.waitForTimeout(3000); log('AFTER CLOCKOUT',await ov()); const cf=page.locator('.q-dialog button').filter({hasText:/^(Clock Out|Confirm|Yes|OK)$/}).last(); if(await cf.count()){await cf.click(); await page.waitForTimeout(3000);} log('AFTER CONFIRM',await ov()); await page.waitForTimeout(4000); log('AFTER',await ov());
 await page.reload(); await page.waitForTimeout(6000); const t=await body(); log('TOPBAR',t.slice(t.indexOf('timer'),t.indexOf('timer')+60)); log('LABOR BTN',(t.match(/\b(Start|Stop)\b/g)||[]).join(','));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
