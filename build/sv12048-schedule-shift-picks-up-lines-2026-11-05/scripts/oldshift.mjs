import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2500);
const day=o=>new Date(Date.now()+o*86400000).toISOString().slice(0,10); const b=(await s.api(`/api/schedule/board?from=${day(1)}T00:00:00Z&to=${day(14)}T23:59:59Z`)).json?.data?.board;
const c=(b.shifts||[]).filter(x=>!/ZZAUTOTEST/.test(JSON.stringify(x.workOrder||{}))&&x.workOrder).map(x=>({id:x.id,cov:x.coverage,wo:x.workOrder.id,num:x.workOrder.displayNumber||x.workOrder.number,cust:(x.workOrder.customerName||x.workOrder.company?.name||'').slice(0,30),start:x.startsAt,created:x.createdAt,lines:(x.lines||[]).length,status:x.workOrder.status}));
console.log(c.length, JSON.stringify(c.slice(0,8))); await s.close(); process.exit(0);
