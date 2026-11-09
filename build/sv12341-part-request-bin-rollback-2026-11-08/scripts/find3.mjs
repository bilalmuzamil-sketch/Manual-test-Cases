import {sess} from './common.mjs'; const s=await sess();
const l=await s.api(`/api/work-orders/lines/e4215cb8-1388-4db9-b69d-fc5b93c0a121`); console.log('lines',(l.json?.data?.collection||[]).map(x=>`${x.line_id.slice(0,8)}|${x.status}|${x.line_name.slice(0,25)}`).join(' ; '));
const r=await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=200'); const a=r.json?.data?.collection||r.json?.data?.parts||[]; console.log('parts',a.length);
let multi=0, core=0;
for(const x of a){ if(multi>=2&&core>=2) break; const d=(await s.api(`/api/inventory/parts/${x.id}`)).json?.data?.part||{}; const b=d.binLocations||[];
 if(b.length>1&&multi<2&&d.quantity>2){ multi++; console.log('MULTI',x.id,x.partNumber||x.part_number,d.quantity,d.category,JSON.stringify(b)); }
 if(d.core_part_id&&core<2&&d.quantity>1){ core++; console.log('CORE',x.id,x.partNumber||x.part_number,d.quantity,d.category,'core',d.core_part_id,d.core_charge,JSON.stringify(b)); } }
const st=await s.api('/api/organizations/settings'); const S=st.json?.data||{}; console.log('settings',Object.keys(S).filter(k=>/pick|order|auto/i.test(k)).map(k=>k+'='+JSON.stringify(S[k])).join(' '));
await s.close();
