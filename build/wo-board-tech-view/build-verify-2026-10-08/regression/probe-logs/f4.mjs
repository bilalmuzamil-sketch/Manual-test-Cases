import {start,mk,L,menu,inputs,btns,notes,st,save,createWO,addLine,setLead,B,OUT} from './h.mjs';
const log=L('f4'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000});
 const w=await createWO(page,'ZZAUTOTEST Regression Walk',log); save('woC',w);
 await addLine(page,'Service - Full grease service',true,log,{close:true,canned:true});
 await page.reload(); await page.waitForTimeout(6000); let t=await body(); log('STATUS0',(t.match(/S10043-\d+ (\w+( \w+)?)/)||[])[0]); let i=t.indexOf('Name/Description'); log('LINES0',t.slice(i,i+400));
 await setLead(page,'ZZAUTOTEST Ana',log);
 const c=page.getByRole('button',{name:/^Complete$/}); await c.first().click(); await page.waitForTimeout(2500); log('CDLG',await menu(page)); await page.locator('.q-dialog textarea').first().fill('ZZAUTOTEST done'); await page.locator('.q-dialog button').filter({hasText:'Complete Line'}).click(); await page.waitForTimeout(3500); log('after complete',await notes(page), await menu(page));
 await page.reload(); await page.waitForTimeout(6000); t=await body(); log('STATUS1',(t.match(/S10043-\d+ (\w+( \w+)?)/)||[])[0]); log('BTNS',(await btns(page)).slice(10,40)); await dump('F4-after-complete');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F4-err');}
await b.browser.close();
