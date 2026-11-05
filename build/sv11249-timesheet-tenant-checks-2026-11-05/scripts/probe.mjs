// usage: node probe.mjs <path...> -> signs in (admin), prints status + first 300 chars per GET
import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
for(const u of process.argv.slice(2)){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,Number(process.env.N||300))); }
await s.close(); process.exit(0);
