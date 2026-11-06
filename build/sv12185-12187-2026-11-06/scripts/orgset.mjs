import {sess} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const rr=await s.api('/api/organizations/settings'); const t=JSON.stringify(rr.json||rr.text||rr); console.log('status',rr.status); console.log((t.match(/"[a-zA-Z_]*(mileage|Mileage|odometer|hours|Hours)[a-zA-Z_]*":[^,}]*/g)||[]).join(' '));
await s.close(); process.exit(0);
