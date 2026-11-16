import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
fs.mkdirSync('/tmp/qa92',{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa92',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:1});
const p=s.page; const tag=process.argv[2]||'base';
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000);
for(const r of ['summary','detail','collections']){
 const u='https://api.shopview.com/api/reporting/account-receivable/pdf?report='+r+'&asOfDate=2026-11-16T23:59:59.999Z';
 const x=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,ct:r.headers.get('content-type'),b:btoa(s)}},u);
 const f=`../ev/n/prod-${r}-${tag}.pdf`; fs.writeFileSync(f,Buffer.from(x.b,'base64')); console.log(r,x.st,x.ct,fs.statSync(f).size); }
await s.close(); process.exit(0);
