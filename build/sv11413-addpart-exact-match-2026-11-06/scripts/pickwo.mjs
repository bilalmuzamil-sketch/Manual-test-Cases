import {sess,post,arr} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith('b3c8c820')); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&showMyWorkOrders=0')).json?.data)[0];
console.log(W.name,l?.id,l?.number||l?.display_number); fs.writeFileSync(`/tmp/sv11413-${E}-wo.json`,JSON.stringify({id:l.id})); await s.close(); process.exit(0);
