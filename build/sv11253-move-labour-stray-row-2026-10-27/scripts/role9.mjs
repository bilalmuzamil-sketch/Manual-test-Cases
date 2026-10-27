import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')); const cat={};
for(const [env,ticket] of [['staging',null],['branch','11253'],['branch','11565']]){
  const s=await open({env,ticket,cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
  const r=await s.api('/api/fe-permissions'); cat[env+(ticket||'')]=[...new Set([...JSON.stringify(r.json).matchAll(/"code":"([^"]+)"/g)].map(m=>m[1]))];
  await s.browser.close();
}
const st=cat.staging; for(const k of Object.keys(cat)) console.log(k,cat[k].length,'missing vs staging:',st.filter(x=>!cat[k].includes(x)).join(','),'| extra:',cat[k].filter(x=>!st.includes(x)).join(','));
process.exit(0);
