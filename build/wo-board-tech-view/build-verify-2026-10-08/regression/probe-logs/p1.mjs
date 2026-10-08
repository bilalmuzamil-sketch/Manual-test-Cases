import {start,mk,L,menu,inputs,btns,st} from './h.mjs';
const log=L('p1'); const w=st().woA; const b=await start(w.url.replace('https://sv10043.qa.shopview.com','')+'/lines','admin'); const {page}=b; const {dump}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 log('has NL form',await page.locator('text=What Are You Doing?').count());
 if(!(await page.locator('text=What Are You Doing?').count())){ await page.getByRole('button',{name:'New Line'}).first().click(); await page.waitForTimeout(2500);} 
 log('container',await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&x.innerText==='What Are You Doing?'); let p=e; const ch=[]; for(let i=0;i<10&&p;i++){ch.push(p.tagName+'.'+(p.className||'').toString().slice(0,60)); p=p.parentElement;} return ch;}));
 log('IN',await inputs(page)); await dump('P1-newline');
 log('toggles',await page.evaluate(()=>[...document.querySelectorAll('.q-toggle,[role=switch],[role=checkbox]')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ')+'|'+e.getAttribute('aria-label')+'|'+e.getAttribute('aria-checked'))));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
