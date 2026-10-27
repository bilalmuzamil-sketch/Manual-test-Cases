import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const f=(await s.api('/api/feature-flags')).json.data.featureFlags; console.log(f.map(x=>x.name+'='+JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k,v])=>typeof v!=='object'||v===null).filter(([k])=>!/^(id|name)$/.test(k))))).join('\n').slice(0,2500));
process.exit(0);
