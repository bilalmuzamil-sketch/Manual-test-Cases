import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const cases=[
 ['this_year',''],['this_month',''],['this_week',''],['last_month',''],
 ['this_year','&search=BRAKECLEAN'],['this_year','&search=GREASE'],['this_year','&search=REC'],['this_year','&search=HDEO'],
 ['this_year','&type=special_order'],['this_year','&type=inventory'],
];
for(const [range,extra] of cases){
 const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?range=${range}&type=both${extra}&pagination[page]=1&pagination[rowsPerPage]=1`);
 console.log(range, extra||'-', 'rows=', r.body?.data?.pagination?.rowsNumber, r.status);
}
