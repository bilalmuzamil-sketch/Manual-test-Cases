import {os,J,post} from './lib.mjs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const r=(await s.api('/api/inventory/returns?rowsPerPage=15')).json; const rc=r?.data?.collection||r?.data||[];
console.log('returns',Array.isArray(rc)?rc.length:typeof rc,J((Array.isArray(rc)?rc:[]).slice(0,6).map(x=>[x.id,x.credit_memo_number,x.vendor_name||x.vendor,x.status,x.created_at||x.credit_date,x.total]),900));
console.log('return keys',J(Object.keys((Array.isArray(rc)?rc[0]:{})||{}),500));
let all=[]; for(let pg=1;pg<=200;pg++){ const d=(await s.api(`/api/inventory/parts?pagination[rowsPerPage]=100&pagination[page]=${pg}`)).json?.data; const c=d?.collection||[]; all=all.concat(c); if(c.length<100) break; }
const stock=all.filter(p=>+p.quantity>=5 && !p.is_core && !+p.core_charge);
const lead=id=>{const m=id.match(/^\d+/);return m?m[0]:''};
const g={big:stock.filter(p=>lead(p.id).length>=3&&+lead(p.id)>=100), multi:stock.filter(p=>lead(p.id).length>=3), one:stock.filter(p=>lead(p.id).length===1), letter:stock.filter(p=>lead(p.id)==='')};
console.log('parts',all.length,'stock>=5',stock.length);
for(const k in g) console.log(k,g[k].length,J(g[k].slice(0,4).map(p=>[p.id,p.part_number,p.name.slice(0,30),p.quantity,p.vendor_id]),700));
await s.close();
