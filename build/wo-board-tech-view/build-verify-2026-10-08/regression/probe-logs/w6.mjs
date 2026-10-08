import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w6'); const w=st().woB; const b=await start(w.url.replace(B,'')+'/timesheets','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+800);};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const row=page.locator('tr').filter({hasText:'ZZAUTOTEST worked'}).first(); await row.hover(); await row.locator('button').first().click(); await page.waitForTimeout(2000);
 log('IN',await inputs(page,'.q-dialog'));
 const lf=page.locator('.q-dialog .q-field').filter({hasText:'Line'}).last(); await lf.click(); await page.waitForTimeout(1500); log('LINE OPTS',(await menu(page)).split('||').slice(1).join('||'));
 await page.locator('.q-menu .q-item').filter({hasText:/2\s+Replace/}).first().click(); await page.waitForTimeout(1000); log('DLG',await menu(page));
 await page.locator('.q-dialog button').filter({hasText:'Save'}).click(); await page.waitForTimeout(3500); log('after save',await notes(page), await menu(page)); await dump('W6-ts-after-move');
 await page.goto(w.url+'/lines'); await page.waitForTimeout(7000); log('LINES',await lines()); await dump('W6-lines-after-move');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W6-err');}
await b.browser.close();
