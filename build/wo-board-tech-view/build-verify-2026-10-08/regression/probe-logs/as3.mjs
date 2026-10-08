import {start,mk,L,menu,inputs,btns,notes,st,save,newAsset,setLead,leadVal,B,OUT} from './h.mjs';
const log=L('as3'); const S=st(); const AU='/customers/vehicle/ab4a56d0-dc99-438e-9b5b-b3157eee2cc9/work-orders?companyId=e96eba51-d939-483a-881f-a4837380b998';
const b=await start(S.custUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 // second asset + WO on it
 await newAsset(page,{year:'1999',make:'Ford',model:'Explorer',unit:'RW-2'},log);
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000);
 await page.locator('button',{hasText:'Create Work Order'}).first().click(); await page.waitForTimeout(2500);
 const cf=page.locator('.q-dialog .q-field').nth(0); await cf.click(); await page.keyboard.type('ZZAUTOTEST Regression Walk',{delay:50}); await page.waitForTimeout(3000); await page.locator('.q-menu .q-item,[role=option]').filter({hasText:'ZZAUTOTEST Regression Walk'}).first().click(); await page.waitForTimeout(2000);
 const af=page.locator('.q-dialog .q-field').nth(1); await af.click(); await page.waitForTimeout(2000); log('ASSET OPTS',(await menu(page)).split('||').slice(1).join('|')); await page.locator('.q-menu .q-item,[role=option]').filter({hasText:'RW-2'}).first().click(); await page.waitForTimeout(1000);
 await page.locator('.q-dialog button',{hasText:/^Save$/}).first().click(); await page.waitForTimeout(5000); if(await page.locator('.q-dialog').filter({hasText:'Confirmation'}).count()){ await page.locator('.q-dialog').filter({hasText:'Confirmation'}).getByRole('button',{name:'Create'}).click(); await page.waitForTimeout(7000);} 
 const num=((await body()).match(/S10043-\d+/)||[])[0]; log('WO on RW-2',num); save('woRW2',{num,url:page.url().replace(/\/lines.*$/,'')});
 await page.goto(B+AU); await page.waitForTimeout(6000); log('RW-1 tab has RW-2 WO',(await body()).includes(num),'rows',(await body()).match(/S10043-\d+/g)?.length);
 await page.goto(S.custUrl); await page.waitForTimeout(6000); log('CUST tab label',(await btns(page)).find(x=>/Work Orders \(/.test(x)),'has',(await body()).includes(num),'rows',await page.locator('tbody tr:visible').count());
 // 188/189
 const W=S.woA.num; const p2=await page.context().newPage(); await page.goto(B+AU); await page.waitForTimeout(6000);
 await p2.goto(S.woA.url+'/lines'); await p2.waitForTimeout(7000); log('p2 lead before',await leadVal(p2)); await setLead(p2,'ZZAUTOTEST Ben',log); log('p2 lead after',await leadVal(p2));
 const ic=page.locator('tbody tr').filter({hasText:W}).first().locator('button,i').filter({hasText:'location_on'}).first(); const c0=await ic.evaluate(e=>getComputedStyle(e).color); await ic.click(); await page.waitForTimeout(2500); log('STALE AOS',c0,'->',await ic.evaluate(e=>getComputedStyle(e).color),await notes(page));
 await p2.reload(); await p2.waitForTimeout(7000); log('AFTER lead',await leadVal(p2)); await p2.screenshot({path:OUT+'AS3-lead-after-stale-toggle.png'});
 await page.reload(); await page.waitForTimeout(6000); log('AOS after reload',await page.locator('tbody tr').filter({hasText:W}).first().locator('button,i').filter({hasText:'location_on'}).first().evaluate(e=>getComputedStyle(e).color));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('AS3-err');}
await b.browser.close();
