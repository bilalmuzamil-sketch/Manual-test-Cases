import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa42',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}});
const id='99997e1d-f641-4deb-b774-273adddfe690';
for(const w of (await s.api('/api/staff/my-workplaces')).json.data.collection){ await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:w.id,workplace_timezone:w.timezone})});
  const r=await s.api('/api/work-orders/view/'+id); if(r.status<300){ const x=r.json.data.work_order||r.json.data; console.log('found at',w.name,x.number,x.type||''); break; } }
console.log('marker',JSON.stringify(await s.marker()));
await s.close(); process.exit(0);
