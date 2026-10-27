import {sess} from './lib.mjs'; const s=await sess(); const r=await s.api('/api/organizations'); const o=(r.json.data.organizations||[]).find(x=>/SV-11669/.test(x.name)); console.log(JSON.stringify(o).slice(0,800));
for(const p of [`/api/organizations/${o.id}`,`/api/organizations/${o.id}/users`,`/api/organizations/${o.id}/staff`,`/api/organizations/${o.id}/roles`]){const q=await s.api(p); console.log(p,q.status,JSON.stringify(q.json??q.text).slice(0,300));}
await s.browser.close(); process.exit(0);
