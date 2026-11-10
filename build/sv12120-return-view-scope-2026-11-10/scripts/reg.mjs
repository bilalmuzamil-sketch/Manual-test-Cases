import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
const r=await s.api('/api/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({admin_email:'bilal.muzamil+sv12120b@shopview.com',admin_first_name:'ZZAUTOTEST',admin_last_name:'OrgB',company_name:'ZZAUTOTEST SV12120 Org B',work_order_start_number:1000})});
console.log('register',r.status,JSON.stringify(r.json).slice(0,300));
const f=await s.api('/api/forgot-password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'bilal.muzamil+sv12120b@shopview.com'})});
console.log('forgot',f.status,JSON.stringify(f.json).slice(0,200));
await s.close(); process.exit(0);
