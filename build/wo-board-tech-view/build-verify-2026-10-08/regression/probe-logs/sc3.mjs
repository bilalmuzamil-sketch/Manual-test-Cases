import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc3'); const b=await start('/schedule','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const S=st(); const E=S.woE.num, G=S.woG.num;
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+600);};
const toDay=async()=>{ await page.getByRole('button',{name:'Today'}).first().click().catch(()=>{}); await page.waitForTimeout(2500); await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(5000); };
try{ await page.setViewportSize({width:1800,height:1100}); await page.waitForTimeout(2000); await toDay(); log('DAY',(await body()).match(/[A-Z][a-z]{2}, [A-Z][a-z]{2} \d+/)?.[0]);
 await page.locator('text=ZZAUTOTEST Dan Delta').last().scrollIntoViewIfNeeded(); await page.waitForTimeout(1000); await page.screenshot({path:OUT+'SC3-rows.png'});
 const all=page.getByText('2 Lines'); const blocks=[]; for(let j=0;j<await all.count();j++){ const bb=await all.nth(j).boundingBox(); if(bb&&bb.x>520) blocks.push(all.nth(j)); }
 for(let i=0;i<blocks.length;i++){ const bb=await blocks[i].boundingBox().catch(()=>null); log('BB',i,JSON.stringify(bb)); if(!bb) continue; await blocks[i].click(); await page.waitForTimeout(2500); log('PANEL',i,await menu(page)); log('PBTNS',i,await btns(page,'.q-dialog').catch(()=>'nodlg')); await dump('SC3-panel-'+i); await page.screenshot({path:OUT+'SC3-panel-'+i+'.png'}); await esc(); await page.waitForTimeout(1000); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('SC3-err');}
await b.browser.close();
