import {start,mk,L,menu,inputs,btns,createWO,addLine,setLead,leadVal,notes,save,st,B} from './h.mjs';
const log=L('w2'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+800);};
try{ await page.setViewportSize({width:1600,height:1000});
 const w=await createWO(page,'ZZAUTOTEST Regression Walk',log); save('woB',w);
 await addLine(page,'ZZAUTOTEST Clock One',true,log,{close:false});
 await addLine(page,'ZZAUTOTEST Clock Two',true,log,{close:true});
 await page.reload(); await page.waitForTimeout(7000); log('LINES0',await lines()); log('STATUS',(await body()).match(/S10043-\d+ (\w+)/)?.[0]);
 const startBtn=page.getByRole('button',{name:/^Start$/}); log('start btns',await startBtn.count());
 await startBtn.first().click(); await page.waitForTimeout(3000); log('after Start ov',await menu(page), await notes(page)); await dump('W2-after-start'); log('LINES1',await lines());
 await page.waitForTimeout(62000);
 log('btns now',(await btns(page)).filter(x=>/Stop|Start|timer|Clock/.test(x)));
 const stop=page.getByRole('button',{name:/^Stop$/}); log('stop count',await stop.count()); if(await stop.count()){ await stop.first().click(); await page.waitForTimeout(3000); log('after Stop ov',await menu(page), await notes(page)); }
 await page.reload(); await page.waitForTimeout(7000); log('LINES2',await lines()); await dump('W2-after-stop');
 // labor row more_vert on line 1
 const mv=page.locator('button[aria-label="Add labor fee or discount"]'); log('labor mv count',await mv.count()); await mv.first().click(); await page.waitForTimeout(1500); log('LABOR MENU',await menu(page)); await dump('W2-labor-menu'); await esc();
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W2-err');}
await b.browser.close();
