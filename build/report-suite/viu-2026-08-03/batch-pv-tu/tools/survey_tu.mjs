import { login, api } from './qa8582.mjs';
const t = await login('admin'); const S=t.sessCookie;
const WP={HD:'b3c8c820-f815-4cf1-8938-10956c5ee71a',LE:'f8a8b802-7780-4b16-bf10-343caeb616b2',QB:'d5366a95-582d-4a06-96e2-20f8cb937866'};
const wps = (await api(S,'GET','/api/staff/my-workplaces')).body.data.collection;
console.log('workplaces:', wps.map(w=>[w.name,w.id]));
for (const [k,v] of Object.entries(WP)){
  const r = await api(S,'GET',`/api/reporting/reports/technician-utilization?range=this_year&locations=${v}`);
  const c=r.body?.data?.collection||[];
  console.log(`\n== ${k} rows=${c.length}`);
  for(const x of c) console.log('  ',x.technician_name,'tot',(x.total_seconds/3600).toFixed(2),'wo',(x.wo_seconds/3600).toFixed(2),'int',(x.internal_seconds/3600).toFixed(2),'ell',x.est_lost_labor_cents,'loc',x.location);
}
// all locations
const all = await api(S,'GET',`/api/reporting/reports/technician-utilization?range=this_year&locations=${WP.HD},${WP.LE},${WP.QB}`);
const c=all.body.data.collection;
console.log('\n== ALL3 rows=',c.length);
for(const x of c) console.log('  ',x.technician_name,'int',(x.internal_seconds/3600).toFixed(2),'ell',JSON.stringify(x.est_lost_labor_cents),'loc',JSON.stringify(x.location));
// labor rates per workplace
for (const w of wps){ const r=await api(S,'GET',`/api/workplaces/${w.id}`); console.log('\nWP',w.name,r.status, JSON.stringify(r.body).slice(0,300)); }
