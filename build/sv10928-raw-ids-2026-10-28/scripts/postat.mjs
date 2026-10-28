import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:process.argv[2],ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa25'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/inventory/orders?limit=300');  const L=r.json?.data?.orders||r.json?.data?.collection||r.json?.data; const a=Array.isArray(L)?L:[];
const c={}; for(const o of a){ const k=(o.workOrderId?'WO':'stock')+':'+o.status; c[k]=(c[k]||0)+1; } console.log(a.length,JSON.stringify(c));
await s.close(); process.exit(0);
