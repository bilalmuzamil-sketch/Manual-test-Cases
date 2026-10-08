import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('r3'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000); await page.getByText('Roles & Permissions').first().click(); await page.waitForTimeout(5000);
 log('B',(await btns(page)).filter(x=>/Create|Role/i.test(x))); await page.getByText('Create Custom Role').first().click(); await page.waitForTimeout(4000); log('URL',page.url()); log('IN',await inputs(page));
 const t=await body(); const i=t.indexOf('Basic Details'); log('FORM',t.slice(i,i+3000)); await dump('R3-create-role');
 log('SWITCHES',await page.evaluate(()=>[...document.querySelectorAll('[role=switch],[role=checkbox],[role=radio]')].filter(e=>e.offsetParent).map((e,i)=>{let p=e; let lab=''; for(let k=0;k<5&&p&&!lab;k++){p=p.parentElement; const t=(p.innerText||'').trim(); if(t&&t.length<60) lab=t;} return i+':'+(e.getAttribute('aria-label')||lab).replace(/\s+/g,' ')+':'+e.getAttribute('aria-checked');})));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R3-err');}
await b.browser.close();
