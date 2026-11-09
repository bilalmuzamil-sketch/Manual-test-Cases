// production: for common words, how many inventory parts at this location contain the word vs how many the Add Part picker returns; list the missing ones
import {sess,arr} from './common.mjs'; import fs from 'fs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(4000);
console.log('marker',await s.page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
const me=(await s.api('/api/auth/me')).json; console.log('workplace', JSON.stringify(me?.data?.workplace?.name||me?.data?.current_workplace||'').slice(0,80));
const out={}; for(const w of (process.env.WORDS||'brake,filter,seal,oil,light,hose,valve,bolt,kit,lamp,air').split(',')){
  let inv=[]; for(let pg=1;pg<=10;pg++){ const d=arr((await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=500&search=${encodeURIComponent(w)}`)).json?.data); if(!d.length) break; inv.push(...d); }
  const hit=inv.filter(x=>((x.name||'')+' '+(x.part_number||'')).toLowerCase().includes(w));
  const pk=(await s.api(`/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination%5BrowsPerPage%5D=200&search=${encodeURIComponent(w)}`)).json?.data?.collection||[];
  const pinv=new Set(pk.filter(r=>r.part_type==='inventory_part').map(r=>r.part_number));
  const miss=hit.filter(h=>!pinv.has(h.part_number));
  out[w]={contain:hit.length,pickerRows:pk.length,pickerInv:pinv.size,missing:miss.length,ex:miss.slice(0,6).map(m=>m.part_number+' | '+m.name+' | qty '+(m.quantity??m.total_quantity??''))};
  console.log(w,JSON.stringify(out[w]).slice(0,500)); }
fs.writeFileSync('../ev/prod-probe-0911.json',JSON.stringify(out,null,1)); await s.close(); process.exit(0);
