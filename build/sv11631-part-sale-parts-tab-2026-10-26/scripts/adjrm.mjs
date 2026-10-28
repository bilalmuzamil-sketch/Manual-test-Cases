import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:(process.env.QA_DIR||'/tmp/qa26')});
for(const id of process.argv.slice(3)){ const r=await s.api('/api/work-orders/adjustments/remove',{method:'POST',body:JSON.stringify({adjustmentId:id,workOrderId:process.argv[2]})}); console.log(id,JSON.stringify(r).slice(0,150)); }
await s.close(); process.exit(0);
