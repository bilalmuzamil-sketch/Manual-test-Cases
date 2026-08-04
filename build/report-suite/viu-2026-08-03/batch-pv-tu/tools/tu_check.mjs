import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a', LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
for (const [lbl,qs] of [['this_month HD','range=this_month'],['this_month LE',`range=this_month&locations=${LE}`],['this_month BOTH',`range=this_month&locations=${HD},${LE}`],['today BOTH',`range=today&locations=${HD},${LE}`]]){
  const r=await api(S,'GET','/api/reporting/reports/technician-utilization?'+qs);
  const c=r.body?.data?.collection||[];
  console.log('\n==',lbl,r.status,'rows',c.length);
  for(const x of c) console.log('  ',x.technician_name,'tot_s',x.total_seconds,'wo_s',x.wo_seconds,'int_s',x.internal_seconds,'ell_c',JSON.stringify(x.est_lost_labor_cents),'loc',JSON.stringify(x.location));
}
