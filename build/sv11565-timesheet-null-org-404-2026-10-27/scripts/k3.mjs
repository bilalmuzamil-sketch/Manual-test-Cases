import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const M=JSON.parse(fs.readFileSync('../data/matrix-branch.json')); const P=s.page; const urls=[];
P.on('request',q=>{const u=q.url(); if(/technician-tasks|lines/.test(u)&&q.method()==='GET') urls.push(u.split('/api')[1]);});
for(const p of [`/api/work-orders/${M.W1.w}/lines`,`/api/work-orders/lines?work_order_id=${M.W1.w}`,`/api/work-orders/${M.W1.w}/lines/list`]){const r=await s.api(p); const t=JSON.stringify(r.json??r.text); console.log(p,r.status,'l1',t.includes(M.W1.l1),'l2',t.includes(M.W1.l2),t.slice(0,120));}
await s.go('/reports/punch-clock-activities'); await P.waitForTimeout(3500);
console.log(urls.join('\n'));
await s.browser.close(); process.exit(0);
