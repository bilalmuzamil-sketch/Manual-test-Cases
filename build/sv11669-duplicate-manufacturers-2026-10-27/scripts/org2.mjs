import {sess} from './lib.mjs'; const s=await sess(); const r=await s.api('/api/organizations'); const o=r.json.data.organizations||r.json.data; console.log('count',o.length,JSON.stringify(o.map(x=>[x.id.slice(0,8),x.name])).slice(0,600));
await s.browser.close(); process.exit(0);
