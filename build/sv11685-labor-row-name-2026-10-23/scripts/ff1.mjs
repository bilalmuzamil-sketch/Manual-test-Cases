import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const g=await s.api('/api/organization/feature-flags?organization_id='+ORG); fs.writeFileSync('/tmp/qa11685/w/fee/flags-before.json',JSON.stringify(g.json)); const feats=g.json?.data?.features||[]; console.log('GET',g.status,feats.map(f=>f.name).join(','));
const keep=feats.map(f=>f.featureFlagId);
const r=await s.api('/api/organization/feature-flags',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({organization_id:ORG,feature_flag_ids:keep})}); console.log('POST same list',r.status,JSON.stringify(r.json).slice(0,200));
process.exit(0);
