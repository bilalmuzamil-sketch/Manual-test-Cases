import {sess,post,arr,j} from './common.mjs';
const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(3000);
console.log('build',await s.page.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];}));
const r=await post(s,'/api/schedule/shifts',{}); console.log('empty POST',r.status,j(r.json));
const b=(await s.api('/api/schedule/board?from=2026-11-09T00:00:00Z&to=2026-11-15T23:59:59Z')).json?.data?.board; console.log('board keys',Object.keys(b||{}), 'shifts',b?.shifts?.length, j(b?.shifts?.[0]));
const st=(await s.api('/api/schedule/staff')).status; console.log('staff ep',st);
await s.close(); process.exit(0);
