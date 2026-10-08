import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc36.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {body,go,dump}=mk(page); page.setDefaultTimeout(15000);
try{
 const r=await page.evaluate(async()=>{const out={};for(const id of ['8699f19d-ff85-4f49-b380-e6156794c57f']){const x=await fetch('https://sv10043api.qa.shopview.com/api/staff/'+id,{method:'DELETE',credentials:'include',headers:{Accept:'application/json'}});out[id]=x.status+' '+(await x.text()).slice(0,300);}return out;});
 log('API DELETE',JSON.stringify(r));
 const s=await page.evaluate(async()=>{const x=await fetch('https://sv10043api.qa.shopview.com/api/staff?limit=200&search=ZZAUTOTEST%20Del',{credentials:'include',headers:{Accept:'application/json'}});const j=await x.json();return j.data.collection.map(s=>s.first_name+' '+s.last_name+' active='+s.is_active+' deletable='+s.deletable);});
 log('STAFF NOW',JSON.stringify(s));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
