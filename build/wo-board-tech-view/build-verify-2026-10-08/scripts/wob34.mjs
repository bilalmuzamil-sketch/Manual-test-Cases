import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob34.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {go}=mk(page);
const seen=[];
page.on('response',async r=>{const u=r.url(); if(/api/.test(u)&&!/\.(js|css|png|svg)/.test(u)){let t='';try{t=(await r.text()).slice(0,600);}catch{} seen.push(r.request().method()+' '+r.status()+' '+u+' :: '+t.replace(/\s+/g,' ').slice(0,300));}});
await go('/schedule',12000);
for(const s of seen) log(s);
await b.browser.close();
