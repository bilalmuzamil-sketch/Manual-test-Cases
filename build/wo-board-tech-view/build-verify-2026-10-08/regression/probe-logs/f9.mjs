import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,createWO,addLine,setLead,B,OUT} from './h.mjs';
const log=L('f9'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const status=async(p=page)=>((await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '))).match(/S10043-\d+ (\w+( \w+)?)/)||[])[1];
try{ await page.setViewportSize({width:1600,height:1000});
 const w=await createWO(page,'ZZAUTOTEST Regression Walk',log); save('woD',w);
 await addLine(page,'Service - Full grease service',true,log,{close:true,canned:true});
 await page.reload(); await page.waitForTimeout(6000); await setLead(page,'ZZAUTOTEST Ana',log);
 await page.getByRole('button',{name:/^Complete$/}).first().click(); await page.waitForTimeout(2500); await page.locator('.q-dialog textarea').first().fill('ZZAUTOTEST done');
 if(await page.locator('.q-dialog').getByText(/Missing Details/).count()){ await page.locator('.q-dialog').getByText(/Missing Details/).click(); await page.waitForTimeout(1500); log('MD',await inputs(page,'.q-dialog')); const m=page.locator('.q-dialog').getByLabel('Mileage'); if(await m.count()) await m.fill('120700'); await page.locator('.q-dialog button').filter({hasText:'Complete All Lines'}).click(); } else { await page.locator('.q-dialog button').filter({hasText:/Complete Line|Complete All Lines/}).first().click(); }
 await page.waitForTimeout(4000); log('after complete',await notes(page)); await page.reload(); await page.waitForTimeout(6000); log('STATUS a',await status());
 await page.getByRole('button',{name:'Mark Reviewed'}).click(); await page.waitForTimeout(2500); log('MR IN',await inputs(page,'.q-dialog')); const vin=page.locator('.q-dialog').getByLabel(/VIN/); if(await vin.count() && !(await vin.inputValue())) await vin.fill('1FVACWDT1BDAZ0001'); await page.locator('.q-dialog button').filter({hasText:'Confirm Review'}).click(); await page.waitForTimeout(3500);
 await page.reload(); await page.waitForTimeout(6000); log('STATUS b',await status()); log('LEAD on Complete',await leadVal(page)); log('lead field (dropdown) count',await page.locator('.q-field').filter({hasText:'Lead Technician'}).count());
 // page 2 invoices
 const p2=await page.context().newPage(); await p2.goto(w.url+'/finance'); await p2.waitForTimeout(8000); await p2.locator('.q-tab').filter({hasText:'Finance'}).first().click().catch(()=>{}); await p2.waitForTimeout(3000);
 await p2.getByRole('button',{name:/Create Invoice/i}).first().click(); await p2.waitForTimeout(4000); log('P2 dlg',(await p2.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,80)).join('|'))));
 await p2.keyboard.press('Escape'); await p2.waitForTimeout(1000); await p2.reload(); await p2.waitForTimeout(6000); log('P2 status',await status(p2));
 // page 1 stale: change lead
 await page.bringToFront(); log('P1 stale status shown',await status());
 await setLead(page,'ZZAUTOTEST Ben',log); log('P1 notes after lead',await notes(page)); log('P1 lead shown',await leadVal(page)); await dump('F9-stale-lead');
 const m=page.getByLabel('Mileage'); if(await m.count()){ await m.fill('120900'); await page.keyboard.press('Tab'); await page.waitForTimeout(3000); log('P1 notes after mileage',await notes(page)); }
 await page.reload(); await page.waitForTimeout(6000); log('P1 after reload status',await status(),'lead',await leadVal(page)); const t=await body(); const i=t.indexOf('Mileage'); log('mileage',t.slice(i,i+30)); await dump('F9-after-reload');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F9-err');}
await b.browser.close();
