import {sess} from './lib.mjs';
const s=await sess();
let r=await s.api('/api/fe-permissions'); const cat=(r.json?.data?.collection||r.json?.data||[]); console.log('catalogue',cat.length, JSON.stringify(cat).includes('woMoveLabor'));
r=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); const d=r.json?.data; const codes=(d?.fe_permissions||d?.role?.fe_permissions||[]).map(x=>x.code||x.name);
console.log('role',r.status,d?.name||d?.role?.name,codes.length,'woMoveLabor',codes.includes('woMoveLabor'));
r=await s.api('/api/auth/me/fe-permissions'); const me=r.json?.data?.fe_permissions||[]; console.log('me',me.length,'woMoveLabor',me.includes('woMoveLabor'));
r=await s.api('/api/auth/me'); console.log('me role', JSON.stringify(r.json?.data).match(/"role[^,]*,[^,]*/)?.[0]);
const html=await (await fetch('https://sv11253.qa.shopview.com/')).text().catch(()=>''); 
await s.browser.close(); process.exit(0);
