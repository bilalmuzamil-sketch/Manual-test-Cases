import {sess,arr} from './common.mjs'; const s=await sess(); const p=s.page;
for(const num of (process.env.NUMS||'S2-17292|S2-16913').split('|')){
 const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&search='+encodeURIComponent(num)+'&showMyWorkOrders=0');
 const w=arr(r.json?.data).find(x=>JSON.stringify(x).includes(num)); if(!w){console.log(num,'not found');continue;}
 await s.go('/workorders/'+w.id+'/finance'); await p.waitForTimeout(5000);
 const t=await p.evaluate(()=>document.body.innerText); const lines=t.split('\n').filter(l=>/check|cheque|ZZ12038/i.test(l));
 console.log(num, w.id.slice(0,8), JSON.stringify(lines.slice(0,8)));
 await p.screenshot({path:`../ev/recheck-finance-${num}.png`}); }
await s.close(); process.exit(0);
