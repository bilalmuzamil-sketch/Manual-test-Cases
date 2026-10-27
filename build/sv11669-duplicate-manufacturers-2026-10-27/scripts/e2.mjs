import {sess} from './lib.mjs';
const s=await sess(); const r=await s.api('/api/parts-catalogue/manufacturers'); const arr=Object.values(r.json?.data||{}).find(Array.isArray)||r.json?.data||[];
console.log('status',r.status,'count',arr.length,'sample',JSON.stringify(arr.slice(0,2)));
const names=arr.map(m=>m.name??m.label??m.manufacturer_name);
const hit=n=>names.filter(x=>String(x??'').trim().toLowerCase().replace(/\s+/g,' ')===n);
for(const n of ['accuride','dorman','gates','napa']) console.log(n,hit(n).length);
const norm={}; for(const x of names){const k=String(x??'').trim().toLowerCase().replace(/\s+/g,' '); norm[k]=(norm[k]||0)+1;}
console.log('blank-name entries',norm['']||0,'| duplicated names',Object.entries(norm).filter(([k,v])=>v>1).length, JSON.stringify(Object.entries(norm).filter(([k,v])=>v>1).slice(0,8)));
const me=await s.api('/api/auth/me'); console.log('orgs?',JSON.stringify(me.json).match(/organization[^,]{0,80}/g)?.slice(0,3));
const ws=await s.api('/api/staff/my-workplaces'); console.log('workplaces',JSON.stringify((ws.json?.data?.collection||[]).map(w=>w.name)));
await s.browser.close(); process.exit(0);
