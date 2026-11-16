import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
fs.mkdirSync('/tmp/qa94',{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa94',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:1});
const p=s.page; const CID='164013e0-2148-402e-b0e2-4f9390b72c29', ORIG='ZZAUTOTEST SV12299 Charge Account';
const LONG='ZZAUTOTEST SV12831 Superlongunbrokencustomernamewithoutanyspacesatalltotestoverflowandtruncationbehaviouroncardsandheaders';
const reqs=[]; p.on('response',r=>{if(r.url().includes('/api/customers/change')) reqs.push(r.status()+' '+r.url());});
const name=async()=>p.evaluate(async c=>{const r=await fetch('https://api.shopview.com/api/customers/view/'+c,{credentials:'include'}); const j=await r.json(); return (j.data?.company||j.data)?.name},CID);
async function rename(n){ await s.go('/customers/'+CID); await p.waitForTimeout(4000); await p.click('[data-test-id=button_base]'); await p.waitForTimeout(3000);
  await p.fill('[data-test-id=input_customer_name]',n); await p.waitForTimeout(500); await p.click('[data-test-id=button_save_customer]'); await p.waitForTimeout(4000); console.log('rename ->',await name(),reqs.splice(0).join(' | ')); }
await rename(LONG);
if((await name())===LONG){
 for(const r of ['summary','detail','collections']){
  const u='https://api.shopview.com/api/reporting/account-receivable/pdf?report='+r+'&asOfDate=2026-11-16T23:59:59.999Z';
  const x=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
  fs.writeFileSync(`../ev/n/prod-${r}-long.pdf`,Buffer.from(x.b,'base64')); console.log(r,x.st); }
 await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(5000); await p.screenshot({path:'../ev/n/prod-screen-summary-long.png'});
}
await rename(ORIG);
await s.close(); process.exit(0);
