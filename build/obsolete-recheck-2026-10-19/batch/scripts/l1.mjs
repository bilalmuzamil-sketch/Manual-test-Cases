import {session} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex20/${env}-`; const cfg=JSON.parse(process.argv[3]);
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker()}; const reqs=[]; p.on('response',async r=>{const q=r.request(); if(/\/api\//.test(q.url())&&!/sentry|preferences|notifications/.test(q.url())) reqs.push({m:q.method(),u:q.url().replace(/^https:\/\/[^/]+/,'').slice(0,160),st:r.status(),b:(q.postData()||'').slice(0,300)});});
const J={method:'POST',headers:{'Content-Type':'application/json'}};
try{
 const c=await s.api('/api/work-orders/create',{...J,body:JSON.stringify({company_id:cfg.company,vehicle_id:cfg.vehicle,workplace_id:cfg.wp,start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true})}); const wo=c.json?.data?.work_order_id; log.wo=[c.status,wo];
 const l=await s.api(`/api/work-orders/${wo}/lines/create-from-canned-line`,{...J,body:JSON.stringify({canned_line_id:cfg.canned,status:'authorized'})}); log.line=[l.status,JSON.stringify(l.json).slice(0,200)];
 const m=await s.api(`/api/work-orders/${wo}/board-move`,{...J,body:JSON.stringify({technicianId:cfg.lead})}); log.move=m.status;
 const v=(await s.api('/api/work-orders/view/'+wo)).json.data; const W=v.work_order||v; log.number=W.number;
 await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(5500); log.url=await p.evaluate(()=>location.pathname);
 log.lineText=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').slice(0,160)).filter(Boolean).slice(0,6));
 log.lineTids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('tbody [data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f-]{36}/,'{id}')))]);
 await p.screenshot({path:SH+'wo.png'});
 fs.writeFileSync(`/tmp/qa11310/ex20/wo-${env}.json`,JSON.stringify({wo,number:W.number}));
}catch(e){ log.err=e.message.slice(0,300); }
fs.writeFileSync(`/tmp/qa11310/ex20/l1-${env}.json`,JSON.stringify({log,reqs},null,1)); console.log(JSON.stringify(log).slice(0,2500)); await s.close();
