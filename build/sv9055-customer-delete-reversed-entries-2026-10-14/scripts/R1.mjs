import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs';
const s=await ob(); const p=s.page; await loc(s);
const bad=[]; p.on('response',r=>{ try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.status()>=500) bad.push(r.status()+' '+u.pathname);}catch(e){} });
for (const r of ['sales','sales-by-customer','sales-tax','ar-aging-summary','ar-aging-detail','ar-aging-collection','batch-transactions']){
  bad.length=0; await s.go('/reports/'+r); await p.waitForTimeout(5000);
  const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
  const txt=await p.evaluate(()=>document.body.innerText);
  const hits=(txt.match(/ZZAUTOTEST SV9055[^\n]{0,40}/g)||[]);
  console.log(r,'| 5xx',J(bad,200),'| toasts',J(toasts,200),'| SV9055 rows',J([...new Set(hits)],400));
  await p.screenshot({path:`ev/report-${r}.png`});
}
await s.close();
