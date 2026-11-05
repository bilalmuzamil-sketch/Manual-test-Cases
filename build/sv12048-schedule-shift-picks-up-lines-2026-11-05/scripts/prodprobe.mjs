import {sess} from './common.mjs'; const s=await sess({dpr:1}); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(5000);
const d=new Date(Date.now()+86400000).toISOString().slice(0,10); const r=await s.api(`/api/schedule/board?from=${d}T00:00:00Z&to=${d}T23:59:59Z`); const b=r.json?.data?.board;
console.log('board',r.status,'shifts',b?.shifts?.length,'sample',JSON.stringify(b?.shifts?.[0]||{}).slice(0,300));
const R=[]; JSON.stringify(b?.resources||{},(k,v)=>{ if(v&&v.id&&(v.firstName||v.name)) R.push((v.firstName||v.name)+' '+(v.lastName||'')+' '+v.id.slice(0,8)); return v;}); console.log(R.slice(0,12));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-resource-id^="group:"]')].map(e=>e.innerText.trim()).filter(Boolean)));
console.log('version',await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
await p.screenshot({path:'/tmp/sv12048/prod-sched.png'}); await s.close(); process.exit(0);
