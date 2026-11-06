// usage: ORG=B node probeB.mjs <path...> -> org B (or A without ORG) session; GET each path, print status + body
import {sess} from './common.mjs'; const s=await sess(); console.log('login',s.loginStatus); await s.go('/workorders'); await s.page.waitForTimeout(1500); console.log('url',s.page.url());
for(const u of process.argv.slice(2)){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,Number(process.env.N||400))); }
await s.close(); process.exit(0);
