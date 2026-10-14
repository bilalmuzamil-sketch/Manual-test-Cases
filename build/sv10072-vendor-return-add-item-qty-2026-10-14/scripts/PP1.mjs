import {op,J,post} from './lib.mjs'; import fs from 'fs';
const s=await op(); console.log('marker',J(await s.marker(),200));
const wps=(await s.api('/api/staff/my-workplaces')).json?.data?.collection||[]; console.log('wps',J(wps.map(w=>[w.id,w.name,w.timezone]),500));
const r=(await s.api('/api/inventory/returns?rowsPerPage=10')).json?.data; const rc=r?.collection||r||[]; console.log('returns',J((Array.isArray(rc)?rc:[]).slice(0,5).map(x=>[x.vendor_return_id,x.credit_memo_number,x.vendor_name,x.workplaceId]),700));
let all=[]; for(let pg=1;pg<=100;pg++){ const d=(await s.api(`/api/inventory/parts?pagination[rowsPerPage]=100&pagination[page]=${pg}`)).json?.data; const c=d?.collection||[]; all=all.concat(c); if(c.length<100) break; }
const lead=id=>(id.match(/^\d+/)||[''])[0];
const c=all.filter(p=>!p.is_core&&!+p.core_charge&&lead(p.id).length>=2&&lead(p.id)[0]!=='0'&&+lead(p.id)<=99&&+p.quantity>=+lead(p.id)+5&&+p.quantity<1000);
console.log('parts',all.length,'cands',c.length,J(c.slice(0,6).map(p=>[p.id,p.part_number,p.name.slice(0,25),p.quantity,p.workplace_id,p.vendor_id]),900));
fs.writeFileSync('prod-cands.json',JSON.stringify(c.slice(0,10),null,1)); await s.close();
