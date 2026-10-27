import {sess} from './lib.mjs'; const s=await sess();
for(const p of ['/api/organizations','/api/auth/me','/api/iam/my-organizations','/api/organizations/my','/api/staff/my-organizations','/api/user/organizations']){const r=await s.api(p); const t=JSON.stringify(r.json??r.text); console.log(p,r.status,(t.match(/"organization[a-z_]*":\{?[^}]{0,150}/gi)||[t.slice(0,160)]).slice(0,3).join(' || '));}
await s.browser.close(); process.exit(0);
