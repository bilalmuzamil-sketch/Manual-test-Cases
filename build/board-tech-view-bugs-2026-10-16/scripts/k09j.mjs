import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page;
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);
const grab=()=>p.evaluate(()=>{const out=[]; for(const row of document.querySelectorAll('[data-test-id^=tech_view_row_]')){ if(!/^tech_view_row_[0-9a-f-]{36}$/.test(row.dataset.testId)) continue; const num=row.querySelector('[data-test-id^=tech_view_row_number_link_]')?.innerText; for(const a of row.querySelectorAll('[data-test-id^=avatar_technician_]')) out.push({num,id:a.dataset.testId.slice(18),label:a.getAttribute('aria-label')}); const o=row.querySelector('[data-test-id=avatar_group_overflow]'); if(o) out.push({num,id:'overflow',label:o.getAttribute('aria-label')}); } return out;});
await p.mouse.move(700,600); let av=[]; for(let i=0;i<40;i++){ av=av.concat(await grab()); await p.mouse.wheel(0,500); await p.waitForTimeout(500);} const key=a=>a.num+a.id+a.label; av=[...new Map(av.map(a=>[key(a),a])).values()]; console.log('avatars',av.length,'rows',new Set(av.map(a=>a.num)).size);
const res=[]; const seen={};
for(const a of av){ if(a.id==='overflow'||seen[a.id]) continue; seen[a.id]=1; const last=a.label.split(' ').slice(-1)[0]; const r=await s.api('/api/staff?pagination[rowsPerPage]=500&search='+encodeURIComponent(last)); const c=r.json?.data?.collection||[]; const m=c.find(x=>x.id===a.id||x.staff_id===a.id); const nm=m?(m.first_name+' '+m.last_name).trim():null; res.push({label:a.label,id:a.id.slice(0,8),staff:nm,ok:nm===a.label}); }
console.log(JSON.stringify(res)); console.log('overflow',JSON.stringify(av.filter(a=>a.id==='overflow').slice(0,5)));
const cur=await getP(); const ch=Object.keys(prefs0).filter(k=>JSON.stringify(prefs0[k])!==JSON.stringify(cur[k])); if(ch.length){ const v={...cur}; for(const k of ch) v[k]=prefs0[k]; await putP(v);} console.log('restored keys',ch);
fs.writeFileSync('/tmp/qa11310/ev09/k09j.json',JSON.stringify({av,res},null,1)); await s.close();
