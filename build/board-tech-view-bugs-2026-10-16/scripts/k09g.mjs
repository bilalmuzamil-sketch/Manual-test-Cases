import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
const av=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=avatar_technician_]')].map(e=>({id:e.dataset.testId.slice(18),label:e.getAttribute('aria-label')})));
const st=await s.api('/api/staff?limit=300'); const list=st.json?.data?.collection||st.json?.data||[];
const byId={}; for(const x of list){ for(const k of ['id','user_id','userId','staff_id']) if(x[k]) byId[x[k]]=x; }
const seen={}; for(const a of av){ if(seen[a.id]) continue; seen[a.id]=1; const r=byId[a.id]; const nm=r?((r.first_name||r.firstName||'')+' '+(r.last_name||r.lastName||'')).trim()||r.name||r.full_name:null; console.log(a.label,'|',nm,'|',r?(nm===a.label?'MATCH':'DIFF'):'not found', r?Object.keys(r).slice(0,8).join(','):''); }
console.log('staff count',list.length,'avatars',av.length);
fs.writeFileSync('/tmp/qa11310/ev09/k09g.json',JSON.stringify({av},null,1)); await s.close();
