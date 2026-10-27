import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const before=(await s.api('/api/bookkeeping/integration')).json.data; const t=JSON.parse(JSON.stringify(before.toggles)); t.advancedModeEnabled=false;
const PUT=async(b)=>{const r=await s.api('/api/bookkeeping/settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('PUT',JSON.stringify(b).slice(0,120),'->',r.status,JSON.stringify(r.json||r.text).slice(0,400)); return r;};
let r=await PUT({settings:{toggles:t}}); if(r.status>=300) r=await PUT({settings:t}); if(r.status>=300) r=await PUT({settings:{...before,toggles:t}});
const after=(await s.api('/api/bookkeeping/integration')).json.data; console.log('advanced now',after.toggles.advancedModeEnabled);
console.log('mapping',JSON.stringify((await s.api('/api/bookkeeping/adjustment-item-mapping-status')).json));
process.exit(0);
