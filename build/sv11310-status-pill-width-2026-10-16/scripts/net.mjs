import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
const urls=[]; p.on('request',r=>{const u=r.url(); if(/api\/work-orders/.test(u)&&r.method()==='GET') urls.push(u);});
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
console.log(urls.slice(0,6).join('\n'));
const u=urls.find(x=>/work-orders\?|work-orders\/list/.test(x)); 
for(const pg of [1,2,3,4,5,6,7,8,9,10,11,12,13,14]){ const r=await s.api(`/api/work-orders?pagination%5Bpage%5D=${pg}&pagination%5BrowsPerPage%5D=500&pagination%5BsortBy%5D=status&pagination%5Bdescending%5D=false&search=&showMyWorkOrders=0`); const d=r.json?.data; const rows=d?.work_orders||[]; if(pg===1) console.log(JSON.stringify(d.pagination), Object.keys(rows[0]||{}).join(",")); const c={}; for(const x of rows){const k=x.status?.value||x.status; (c[k]??=[]).push(x.number||x.wo_number||x.code);} console.log(pg, Object.entries(c).map(([k,v])=>k+':'+v.length+':'+v.slice(0,2)).join(' ')); if(rows.length<500) break; }
const st=await s.api('/api/work-orders/statuses'); console.log(JSON.stringify(st.json).slice(0,600));
await s.close();
