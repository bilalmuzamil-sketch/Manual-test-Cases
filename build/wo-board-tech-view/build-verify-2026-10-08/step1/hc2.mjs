import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc2.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/administration/staff','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
log('URL',page.url()); await dump('hc-settings-staff');
log('LINKS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('a,.q-item')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+' ->'+(e.getAttribute('href')||'')).filter(x=>x.length<80))));
await b.browser.close();
