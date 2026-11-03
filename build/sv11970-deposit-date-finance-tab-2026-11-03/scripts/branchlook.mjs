import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900}});
console.log(JSON.stringify(await s.marker()));
const w=(await s.api('/api/workplaces')).json?.data?.collection||[]; for(const x of w) console.log('WP',x.id,'|',x.name,'|',x.timezone);
const mine=(await s.api('/api/staff/my-workplaces')).json?.data?.collection||[]; console.log('mine',mine.map(x=>x.name).join(' | '));
for(const [wpName,num] of [['DVI Test','S1-38221'],['Staging Heavy Duty - 9919','S2-32989']]){
  const wp=w.find(x=>x.name===wpName); if(!wp){console.log('no wp',wpName); continue;}
  await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:wp.id,workplace_timezone:wp.timezone})});
  const L=(await s.api(`/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5&search=${num}`)).json?.data; const r=(L?.work_orders||[]).find(x=>x.number===num);
  console.log(num, r? `${r.id} | ${r.status} | company ${r.company?.id||r.company_id} ${r.company?.name||''}`:'NOT FOUND');
}
await s.close(); process.exit(0);
