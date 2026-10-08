import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc7'); const S=st(); const b=await start('/schedule','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+600);};
try{ await page.setViewportSize({width:1800,height:1100}); await page.waitForTimeout(2000);
 await page.getByRole('button',{name:'Today'}).first().click().catch(()=>{}); await page.waitForTimeout(2500); await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(5000);
 await page.locator('text=ZZAUTOTEST Ezra Echo').last().scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
 const bl=page.locator('text=/Service - Full gr/'); let target=null; for(let j=0;j<await bl.count();j++){ await bl.nth(j).click(); await page.waitForTimeout(2000); const m=await menu(page); if(m.includes(S.woG.num)){ target=j; log('PANEL G',m.slice(0,300)); break;} await esc(); await page.waitForTimeout(800); }
 if(target!==null){ await page.getByRole('button',{name:'Delete shift'}).click(); await page.waitForTimeout(3000); log('after delete',await notes(page),await menu(page)); await dump('SC7-after-delete'); }
 await page.goto(S.woG.url+'/lines'); await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(7000); log('G LINES after delete',await lines()); await dump('SC7-G-lines-after-delete');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('SC7-err');}
await b.browser.close();
