import {start,mk,L,menu,inputs,btns,notes,st,save,createWO,B,OUT} from './h.mjs';
const log=L('loc1'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const chLoc=async(name)=>{ await page.getByRole('button',{name:'Profile'}).click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Change Location'}).click(); await page.waitForTimeout(2000); log('CL dlg',await menu(page)); await page.locator('.q-menu .q-item, .q-dialog .q-item, [role=option]').filter({hasText:name}).first().click(); await page.waitForTimeout(1500); const ok=page.locator('.q-dialog button').filter({hasText:/Save|Change|Confirm|OK/}); if(await ok.count()){ await ok.last().click(); } await page.waitForTimeout(6000); log('LOC now',(await body()).match(/Staging [A-Za-z ]+ - \d+/)?.[0]); };
const search=async(v)=>{ await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); await page.keyboard.type(v,{delay:30}); await page.waitForTimeout(4000); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await chLoc('Lethbridge');
 const w=await createWO(page,'ZZAUTOTEST Regression Walk',log); save('woL2',w); log('L2 WO',w.num);
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await search('ZZAUTOTEST Regression Walk'); log('AT L2 rows',(await body()).match(/S10043-\d+/g));
 await chLoc('Heavy Duty');
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await search('ZZAUTOTEST Regression Walk'); const r=(await body()).match(/S10043-\d+/g); log('AT 9919 rows',r,'has L2 WO',(r||[]).includes(w.num));
 await page.goto(B+'/workorders?search='+w.num); await page.waitForTimeout(6000); log('9919 search number',(await body()).match(/No work orders[^.]*\.|S10043-\d+/g));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('LOC1-err');}
await b.browser.close();
