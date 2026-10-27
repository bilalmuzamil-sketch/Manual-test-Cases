import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const o=(await s.api('/api/organizations/settings')).json.data; console.log('org settings keys w/ book/quick/qb/fee:',JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k])=>/book|quick|qb|fee|adjust|integr/i.test(k)))));
for(const u of ['/api/feature-flags','/api/organizations/feature-flags','/api/features','/api/auth/me/features']){const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,400));}
const u=JSON.parse(await s.page.evaluate(()=>localStorage.getItem('user')||'{}')); console.log('login details book keys',JSON.stringify(Object.fromEntries(Object.entries(u?.data?.details||{}).filter(([k])=>/book|quick|feature|flag/i.test(k)))));
process.exit(0);
