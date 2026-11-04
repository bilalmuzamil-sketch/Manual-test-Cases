// prints, per test work order: open/closed time records with location, and the list row (names + count)
import {sess,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12112/seed-${ENV}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const wn=Object.fromEntries((arr((await s.api('/api/staff/my-workplaces')).json?.data)).map(w=>[w.id,w.name]));
const list=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&pagination[sortBy]=clockedInTechnicians&pagination[descending]=true&search='+encodeURIComponent(process.env.SEARCH||'')+'&showMyWorkOrders=0')).json?.data);
const out={};
for(const [t,w] of Object.entries(S.W)){ const recs=arr((await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${w.id}&search=`)).json?.data);
  const row=list.find(x=>x.id===w.id); out[t]={number:w.number,records:recs.map(r=>({id:r.id.slice(0,8),who:(r.technician_first_name||'')+' '+(r.technician_last_name||''),at:wn[r.workplace_id]||r.workplace_id,open:!r.end_date&&!r.check_out,start:r.start_date,end:r.end_date})),listNames:row?.clockedInTechnicians,listCount:row?.clockedInTechniciansCount};
  console.log(t,w.number,'| list names:',JSON.stringify(row?.clockedInTechnicians),'| count:',row?.clockedInTechniciansCount,'| records:',JSON.stringify(out[t].records.map(r=>`${r.who}@${r.at}${r.open?' OPEN':' closed'}`))); }
console.log('list order (desc):',list.map(x=>x.number+':'+x.clockedInTechniciansCount).join(' '));
fs.writeFileSync(`/tmp/sv12112/state-${ENV}-${process.env.TAG||'now'}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
