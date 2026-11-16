import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
fs.mkdirSync('/tmp/qa93',{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa93',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:1});
const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000);
const api=(m,u,b)=>p.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined}); return {st:r.status,t:(await r.text())}},[m,'https://api.shopview.com'+u,b]);
const rep=JSON.parse((await api('GET','/api/reporting/account-receivable/aging-summary-report?pagination[page]=1&pagination[rowsPerPage]=200&pagination[sortBy]=customerName&pagination[descending]=false&asOfDate=2026-11-16T23:59:59.999Z')).t);
const rows=rep.data?.collection||rep.data?.rows||rep.data||[]; const row=(Array.isArray(rows)?rows:[]).find(r=>JSON.stringify(r).includes('SV12299 Charge Account'));
console.log('row',JSON.stringify(row).slice(0,300));
const cid=row.customerId||row.customer_id||row.companyId||row.id;
const view=JSON.parse((await api('GET','/api/customers/view/'+cid)).t); const c=view.data?.company||view.data; const orig={name:c.name,credit_term:c.credit_term,country_code:c.country_code};
console.log('orig',JSON.stringify(orig));
const LONG='ZZAUTOTEST SV12831 Superlongunbrokencustomernamewithoutanyspacesatalltotestoverflowandtruncationbehaviouroncardsandheaders';
console.log('rename',(await api('POST','/api/customers/change',{id:cid,...orig,name:LONG})).st);
console.log('check',JSON.parse((await api('GET','/api/customers/view/'+cid)).t).data?.company?.name);
for(const r of ['summary','detail','collections']){
 const u='https://api.shopview.com/api/reporting/account-receivable/pdf?report='+r+'&asOfDate=2026-11-16T23:59:59.999Z';
 const x=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
 fs.writeFileSync(`../ev/n/prod-${r}-long.pdf`,Buffer.from(x.b,'base64')); console.log(r,x.st); }
// screen capture with the long name, then restore
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(5000); await p.screenshot({path:'../ev/n/prod-screen-summary-long.png'});
console.log('restore',(await api('POST','/api/customers/change',{id:cid,...orig})).st);
console.log('after',JSON.parse((await api('GET','/api/customers/view/'+cid)).t).data?.company?.name);
await s.close(); process.exit(0);
