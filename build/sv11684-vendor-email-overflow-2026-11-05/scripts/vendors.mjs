// usage: node vendors.mjs -> vendors list: id, name, email (longest emails first)
import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
let all=[]; for(let pg=1;pg<=10;pg++){ const d=(await s.api(`/api/parts-catalogue/vendors?pagination[page]=${pg}&pagination[rowsPerPage]=100`)).json?.data; const a=arr(d); all=all.concat(a); if(a.length<100) break; }
const em=v=>v.email||v.contact_email||(v.contacts||[])[0]?.email||JSON.stringify(v).match(/"[a-z_]*email[a-z_]*":"([^"]+)"/i)?.[1]||'';
console.log('vendors',all.length,'keys',Object.keys(all[0]||{}).join(','));
console.log(JSON.stringify(all.map(v=>[v.id,v.name||v.company_name,em(v)]).filter(x=>x[2]).sort((a,b)=>b[2].length-a[2].length).slice(0,8)));
await s.close(); process.exit(0);
