import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const WO='286b53ca-b5f7-44c4-9366-d4a1d7bdbb58';
const ws=(await s.api('/api/staff/my-workplaces')).json.data.collection; let found=null;
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
for(const w of ws){ await post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone}); const r=await s.api('/api/work-orders/view/'+WO); if(r.status===200&&r.json?.data){found=w; console.log('found in',w.name,w.timezone); break;} }
if(found){ const t=await s.api('/api/reporting/punch-clock-activities/this_year?range=this_year&pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=500'); const c=t.json.data.collection.filter(x=>x.staff_id==='a1d7fb4a-8d44-4557-bb7e-cb7d2b0c6acb'||/^53364ad4/.test(x.id));
 console.log('tech rows in this workplace this year:',c.length); console.log(c.map(x=>`${x.id.slice(0,8)} ${x.formatted_start_date_time} -> ${x.formatted_end_date_time} ${x.clock_activity} ${x.hours}h`).join('\n'));}
const home=ws.find(w=>w.name==='Trucks Hill 2'); await post('/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone}); console.log('restored to Trucks Hill 2');
process.exit(0);
