import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const r=await s.api('/api/organizations/invoice-settings/change-design',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({documentDesign:'legacy'})});
const v=await s.api('/api/organizations/invoice-settings/view'); console.log('restore',r.status,'now',v.json?.data?.documentDesign); process.exit(0);
