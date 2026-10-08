import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w8'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+330);};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.locator('text=ZZAUTOTEST Oil change').first().click(); await page.waitForTimeout(2500);
 log('chip html',await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const els=[...d.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()==='ZZAUTOTEST Cal Charlie'); return els.map(e=>e.parentElement.outerHTML.slice(0,400));}));
 const x=page.locator('.q-dialog').locator('xpath=//*[normalize-space(text())="ZZAUTOTEST Cal Charlie"]/following-sibling::*[1]').first(); log('x count',await x.count()); await x.click(); await page.waitForTimeout(800); log('after x',await menu(page));
 await page.locator('.q-dialog button').filter({hasText:'Save & Close'}).click(); await page.waitForTimeout(3500); await page.reload(); await page.waitForTimeout(6000); log('L',await lines());
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W8-err');}
await b.browser.close();
