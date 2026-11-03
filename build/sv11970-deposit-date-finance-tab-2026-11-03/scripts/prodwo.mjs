import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const WP='59b42f18-31d3-4f91-b51a-b463966fd007', TZ='Pacific/Kiritimati';
const s=await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},tz:TZ});
const mine=(await s.api('/api/staff/my-workplaces')).json.data.collection.map(x=>x.name); console.log('mine',mine.join(' | '));
const ch=await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:WP,workplace_timezone:TZ})}); console.log('change-location',ch.status);
for(const st of ['estimate','approved','in_progress','ready_for_review']){
 const L=(await s.api(`/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=20&filters%5B0%5D%5Bfield%5D=status&filters%5B0%5D%5Bvalue%5D=${st}`)).json.data;
 const rows=L.work_orders||[]; console.log(st,rows.length, rows.slice(0,5).map(r=>`${r.number}|${r.id}|${r.company?.name||r.companyName||r.customerName||''}|${r.totalPrice}`).join(' ; '));
}
console.log('browser now',await s.page.evaluate(()=>new Date().toString()));
await s.close(); process.exit(0);
