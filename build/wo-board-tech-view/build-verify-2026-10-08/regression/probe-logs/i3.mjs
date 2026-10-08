import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('i3'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{ await page.waitForTimeout(2000);
 const urls=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)));
 log('NJS',urls.length);
 for(const u of urls){ const t=await page.evaluate(async(u)=>{try{return await (await fetch(u)).text()}catch(e){return ''}},u); let i=-1; let k=0; while((i=t.indexOf('switch-user',i+1))>=0 && k<4){ log('HIT',u.split('/').pop(),t.slice(Math.max(0,i-300),i+200).replace(/\s+/g,' ')); k++; } let j=t.search(/[Ii]mpersonat/); if(j>=0) log('IMP',u.split('/').pop(),t.slice(Math.max(0,j-200),j+300).replace(/\s+/g,' ')); }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
