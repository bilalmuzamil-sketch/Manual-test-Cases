import {start,mk,L,B} from './h.mjs';
const log=L('i5'); const b=await start('/administration/staff','admin'); const {page}=b; page.setDefaultTimeout(15000);
try{ await page.waitForTimeout(1500);
 const idx=await page.evaluate(async()=>await (await fetch('/js/index.Ci7w97pr.js')).text());
 const files=[...new Set(idx.match(/js\/[A-Za-z0-9_.\-]+\.js/g))]; log('N',files.length);
 const res=await page.evaluate(async(files)=>{const out=[]; for(const f of files){ try{const t=await (await fetch(location.origin+'/'+f)).text(); if(f.includes('ImpersonationBar')) out.push('CTRL '+f+' len '+t.length); for(const k of ['impersonate-user','Account Access','Access Account','accessAccount','Log in as','Login as','Sign in as']){ let i=t.indexOf(k); if(i>=0) out.push(f+' :: '+k+' :: '+t.slice(Math.max(0,i-250),i+250).replace(/\s+/g,' ')); } }catch(e){out.push('ERRF '+f+' '+e.message)} } return out;},files);
 for(const r of res) log('HIT',r); log('RESN',res.length);
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
