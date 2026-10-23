import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2], wo=process.argv[3], who=process.argv[4]||'admin'; const OUT=`/tmp/qa11685/w/fin-${env}-${who}/`; fs.mkdirSync(OUT,{recursive:true});
const s=env==='branch'?await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:who,dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const p=s.page; const P=async(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const d0=(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign; console.log('design',d0,'perm sample',JSON.stringify((await s.api('/api/auth/me/fe-permissions')).json?.data?.fe_permissions?.filter(x=>/financ|Financ|seeF/.test(x))));
if(env==='prod'&&d0!=='modern') console.log('switch',(await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'})).status);
const reqs=[]; p.on('request',r=>{ if(/invoice|estimate|preview|pdf|print|email/i.test(r.url())&&!/\.js|\.css/.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200)); });
await s.go(`/workorders/${wo}/finance`); await p.waitForTimeout(7000);
await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
const info=await p.evaluate(()=>{ const T=e=>e?e.innerText.replace(/\s+/g,' ').trim():''; const roots=[document,...[...document.querySelectorAll('iframe')].map(f=>{try{return f.contentDocument}catch(e){return null}}).filter(Boolean)];
  const out=[]; for(const d of roots) for(const j of d.querySelectorAll('.job')){ const lab=[...j.querySelectorAll('.chargesec')].filter(c=>/labor/i.test(T(c.querySelector('.csec-head')))).flatMap(c=>[...c.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('td')].map(T)));
    const r=j.getBoundingClientRect(); out.push({title:T(j.querySelector('.job-ttl')),labor:lab,box:[r.x,r.y,r.width,r.height],inIframe:d!==document}); } return {n:out.length,iframes:document.querySelectorAll('iframe').length,jobs:out}; });
console.log('preview jobs',info.n,'iframes',info.iframes); info.jobs.forEach(j=>console.log('  ',JSON.stringify(j).slice(0,220)));
fs.writeFileSync(OUT+'preview.json',JSON.stringify(info,null,1)); await p.screenshot({path:OUT+'finance-full.png',fullPage:true});
// print button
const pb=await p.$('[data-test-id=button_print_invoice]'); if(pb){ const popupP=p.context().waitForEvent('page',{timeout:8000}).catch(()=>null); await pb.click().catch(e=>console.log('print click',e.message)); await p.waitForTimeout(5000); const pop=await popupP; console.log('print popup',pop?pop.url().slice(0,150):'none'); }
console.log('requests:\n'+[...new Set(reqs)].join('\n'));
if(env==='prod'&&d0!=='modern') console.log('restore',(await P('/api/organizations/invoice-settings/change-design',{documentDesign:d0})).status, (await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
process.exit(0);
