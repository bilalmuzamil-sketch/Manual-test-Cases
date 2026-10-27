import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
let r=await s.api('/api/work-orders/view/f90ee121-2b16-4846-9939-2bb0451fbc34'); console.log('wo',r.status,r.json?.data?.work_order?.display_number,r.json?.data?.work_order?.status_value);
r=await s.api('/api/work-orders/lines/f90ee121-2b16-4846-9939-2bb0451fbc34'); console.log('lines',r.status,JSON.stringify((r.json?.data?.collection||[]).map(l=>[l.line_id,l.line_name.trim()])).slice(0,800));
await s.browser.close(); process.exit(0);
