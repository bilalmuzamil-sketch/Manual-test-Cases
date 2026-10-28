import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:process.argv[2],ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/inventory/parts?limit=5&search='); const L=r.json?.data?.parts||r.json?.data?.collection||r.json?.data||[]; const a=Array.isArray(L)?L:[];
console.log(JSON.stringify(a[0]).slice(0,900));
const o=await s.api('/api/work-orders/part/request/inventory-parts-as-options?search=P550848'); console.log('opts',o.status,JSON.stringify(o.json).slice(0,700));
await s.close(); process.exit(0);
