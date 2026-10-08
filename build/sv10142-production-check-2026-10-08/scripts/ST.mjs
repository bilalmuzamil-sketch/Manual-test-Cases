import {op} from './lib.mjs';
const s=await op({dpr:1}); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
for (const pn of ['1237932','1238042','1237821']){ const r=await s.api('/api/inventory/parts?limit=10&search='+pn); const c=r.json?.collection||r.json?.data?.collection||r.json?.data||[]; const it=(Array.isArray(c)?c:[]).find(x=>(x.part_number||x.partNumber)==pn); console.log(pn, it? JSON.stringify({name:it.name||it.description, qty:it.quantity??it.qty??it.total_quantity, avail:it.available_quantity??it.available}) : 'nf '+JSON.stringify(r.json).slice(0,200)); }
const d=await s.api('/api/organizations/invoice-settings/view'); console.log('design',JSON.stringify(d.json).match(/documentDesign":"(\w+)/)?.[1]);
await s.close();
