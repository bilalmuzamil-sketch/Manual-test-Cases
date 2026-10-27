import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11253',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const r=await s.api('/api/fe-permissions'); const t=JSON.stringify(r.json); const arr=Object.values(r.json?.data||{}).find(Array.isArray)||r.json?.data||[];
console.log('catalogue',r.status,Array.isArray(arr)?arr.length:'?','woMoveLabor',/woMoveLabor/i.test(t),'woReceivedLater',/woReceivedLater/i.test(t));
const role=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); console.log('admin role has move labor',/moveLabor/i.test(JSON.stringify(role.json)));
await s.browser.close(); process.exit(0);
