import {start,mk,L,B} from './h.mjs';
const log=L('i4'); const b=await start('/administration/staff','admin'); const {page}=b; page.setDefaultTimeout(15000);
try{ await page.waitForTimeout(1500);
 const urls=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/index\.Ci7w97pr\.js|ImpersonationBar|ImpersonateUser/.test(u)));
 log('U',urls);
 const base=urls[0].replace(/[^/]+$/,'');
 for(const f of ['index.Ci7w97pr.js','ImpersonationBar.B_moNWth.js','ImpersonateUser.wzdZAdhu.js']){ const t=await page.evaluate(async(u)=>{try{return await (await fetch(u)).text()}catch(e){return 'ERR'}},base+f);
  if(f.startsWith('index')){ let i=-1,k=0; while((i=t.indexOf('ImpersonateUser',i+1))>=0&&k<6){log('IDX',t.slice(Math.max(0,i-250),i+120)); k++;} }
  else log(f, t.length, t.replace(/\s+/g,' ').match(/"[^"]{3,60}"/g)?.filter(x=>/[A-Z][a-z]/.test(x)&&!/\.js|\.css|vue|class|q-/.test(x)).slice(0,80).join(' '));
 }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
