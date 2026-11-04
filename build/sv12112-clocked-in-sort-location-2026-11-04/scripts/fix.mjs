import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12112/seed-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const at=L=>P('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
const f=(x,tz)=>{const q=new Intl.DateTimeFormat('en-GB',{timeZone:tz,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(x).reduce((a,o)=>(a[o.type]=o.value,a),{}); return `${q.day}/${q.month}/${q.year} ${q.hour}:${q.minute}`;};
const used=new Set(Object.values(S.W).flatMap(w=>w.entries.map(e=>e.staff)).filter(Boolean));
const staff=arr((await s.api('/api/staff?limit=300')).json?.data).filter(x=>x.is_active!==false&&x.staff_id&&!used.has(x.staff_id)&&x.email!=='admin@shopview.com');
const busy=new Set(); let k=0;
const entry=async(L,w,note)=>{ for(;k<staff.length;k++){ const st=staff[k]; await at(L); const r=await P('/api/technician-tasks/create',{start_date:f(new Date(Date.now()-(20+k)*60e3),L.timezone),tech_assigned_id:st.staff_id,work_order_id:w.id,line_id:w.line,description:'ZZAUTOTEST SV-12112 '+note,resolve_overlaps:true});
  if(r.status<300){ k++; return {who:st.first_name+' '+st.last_name,staff:st.staff_id,at:L.name,st:r.status,res:JSON.stringify(r.json).slice(0,100)}; } } return {err:'no free staff'}; };
const W=S.W; W.A.entries=W.A.entries.filter(e=>e.st===201); W.D.entries=W.D.entries.filter(e=>e.st===201);
while(W.A.entries.length<3) W.A.entries.push(await entry(S.O,W.A,'other loc'));
while(W.D.entries.filter(e=>e.at===S.O.name).length<2) W.D.entries.push(await entry(S.O,W.D,'other loc'));
// C: the admin clicks Start on the line on screen (the app's own clock-in)
await at(S.H); await s.go(`/workorders/${W.C.id}/lines`); await p.waitForTimeout(6000); const caps=[]; p.on('response',async r=>{ if(/technician-tasks|tasks\/create/.test(r.url())&&r.request().method()==='POST'){ let b=''; try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.url().replace(/^https:\/\/[^/]+/,'')+' '+r.status()+' '+(r.request().postData()||'').slice(0,200)+' -> '+b);} });
await p.click(`[data-test-id="button_clock_toggle_task_${W.C.line}"]`); await p.waitForTimeout(4000);
const dlg=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,300):null;}); 
if(dlg){ const b=p.locator('.q-dialog button',{hasText:/clock in|start|confirm|yes/i}).first(); if(await b.count()){ await b.click(); await p.waitForTimeout(4000);} }
W.C.entries=[{who:'Admin (signed-in user, Start button on screen)',dialog:dlg,caps}]; await p.screenshot({path:'/tmp/sv12112/c-start.png'});
fs.writeFileSync(`/tmp/sv12112/seed-${ENV}.json`,JSON.stringify(S,null,1));
for(const [t,w] of Object.entries(W)) console.log(t,w.number,JSON.stringify(w.entries.map(e=>(e.who||'')+'@'+(e.at||'')+' '+(e.st||'')+(e.caps?' '+e.caps.join(' || '):'')+(e.dialog?' DIALOG '+e.dialog:''))).slice(0,600));
await s.close(); process.exit(0);
