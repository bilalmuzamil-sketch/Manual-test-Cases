import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const E='bilal.muzamil+sv11685org2@shopview.com';
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,'->',r.status,JSON.stringify(r.json||r.text).slice(0,300)); return r;};
await P('/api/register',{admin_email:E,admin_first_name:'ZZAUTOTEST',admin_last_name:'Org2',company_name:'ZZAUTOTEST SV11685 Org2',work_order_start_number:100});
await P('/api/forgot-password',{email:E});
console.log('sent at',new Date().toISOString());
process.exit(0);
