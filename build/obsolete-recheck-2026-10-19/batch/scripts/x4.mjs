import {session,toView} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex19/${env}-`;
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker()}; const reqs=[]; p.on('request',q=>{ if(/\/api\/work-orders\?/.test(q.url())) reqs.push(decodeURIComponent(q.url()).replace(/.*\?/,'').slice(0,300)); });
const KEYS=['tab','display','filters']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
try{
 await s.go('/workorders?tab=all&status=imported'); await p.waitForTimeout(5000); if(env!=='prod'){ await toView(p,'list'); await p.waitForTimeout(3000);} 
 log.rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(0,4).map(t=>t.innerText.replace(/\s+/g,' ').slice(0,160)));
 log.req=reqs.slice(-2);
 const row=await p.$('tbody tr:has-text("ZZAUTOTEST-IMP-001") td:nth-child(4)'); if(row){ await row.click({force:true}); await p.waitForTimeout(5000); }
 log.url=await p.evaluate(()=>location.pathname); log.text=await p.evaluate(()=>(document.querySelector('.q-page')||document.body).innerText.replace(/\s+/g,' ').slice(0,700));
 log.lead=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>/lead|tech|advisor|sales_rep/i.test(e.dataset.testId)).map(e=>e.dataset.testId+':'+(e.innerText||'').replace(/\s+/g,' ').slice(0,50)));
 log.hasLeadWord=await p.evaluate(()=>/Lead technician/i.test(document.body.innerText));
 await p.screenshot({path:SH+'imported.png'});
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of KEYS) if(k in prefs0) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){ log.restoreErr=e.message; }
fs.writeFileSync(`/tmp/qa11310/ex19/x4-${env}.json`,JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
