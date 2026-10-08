import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc6b'); const S=st(); const b=await start(S.woG.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const state=()=>page.evaluate(()=>[...document.querySelectorAll('.q-card, [class*=line-card]')].map(c=>c.innerText.replace(/\s+/g,' ').slice(0,420)).filter(t=>/^\d\./.test(t)));
try{ await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(6000);
 log('S0',await state());
 const ch=page.locator('button').filter({hasText:/^expand_(less|more)$/});
 await page.reload(); await page.waitForTimeout(7000); log('R0',await state());
 await ch.nth(0).click(); await page.waitForTimeout(2500); log('R1 click chev0',await state()); await page.screenshot({path:OUT+'SC6-line1-expanded.png',fullPage:true});
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
