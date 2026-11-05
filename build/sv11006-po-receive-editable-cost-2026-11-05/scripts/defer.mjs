// usage: node defer.mjs <tag> -> marks every seeded part "received later" (POST /api/work-orders/parts/received-later)
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${process.argv[2]}.json`,'utf8'));
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const r=await post(s,'/api/work-orders/parts/received-later',{partRequestIds:S.parts.map(x=>x.pr)}); console.log('received-later',r.status,JSON.stringify(r.json).slice(0,200)); await s.close(); process.exit(0);
