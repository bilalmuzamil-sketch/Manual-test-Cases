import {op,j} from '../lib.mjs'; import fs from 'fs';
const s=await op(); const p=s.page; console.log('url',p.url()); console.log(j(await s.marker()));
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log('wps',wps.map(w=>w.id.slice(0,8)+' '+w.name).join(' | '));
const st=(await s.api('/api/organizations/settings')).json.data; console.log('settings',j(st,500));
const TH='b617914c-16e9-4485-8e8b-193cd86aa416';
const loc=await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'}); console.log('loc',loc.status);
const cl=(await s.api('/api/work-orders/canned-lines')).json.data.collection.filter(x=>!x.total_parts&&x.workplace_id===TH); console.log('canned noparts',cl.length,cl.slice(0,4).map(x=>x.canned_line_name).join(' | '));
const cs=(await s.api('/api/customers?limit=40')).json.data.collection; let pick=null;
for(const c of cs){ const v=(await s.api('/api/vehicles?company_id='+c.id)).json?.data; const vs=v?.vehicles||v?.collection||[]; const ct=(await s.api('/api/customers/view/'+c.id)).json?.data?.company?.contacts||[]; if(vs.length&&ct.length&&vs[0].vin){pick={company_id:c.id,name:c.name,vehicle:vs[0],contact:ct[0]};break;} }
console.log('pick',pick?.name,pick?.vehicle?.id,pick?.contact?.id);
fs.writeFileSync('prod/setup.json',JSON.stringify({pick,canned:cl.slice(0,4),settings:st,wps}));
await s.close();
