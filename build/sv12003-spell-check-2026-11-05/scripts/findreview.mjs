import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa94'});
const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=200&pagination[sortBy]=status&pagination[descending]=true&search=&showMyWorkOrders=0');
const wos=(r.json?.data?.work_orders||[]); const cnt={}; for(const w of wos) cnt[w.status]=(cnt[w.status]||0)+1; console.log('statuses',JSON.stringify(cnt),'total',wos.length);
const rev=wos.filter(w=>/review/i.test(w.status)).slice(0,25); let found=0;
for(const w of rev){ const l=await s.api('/api/work-orders/lines/'+(w.id||w.ID)); const lines=(l.json?.data?.collection||l.json?.data||[]); const arr=Array.isArray(lines)?lines:[];
  const miss=arr.filter(x=>!x.tech_story&&!x.techStory&&!/declin/i.test(x.status||'')); console.log(w.number,w.status,w.id||w.ID,'lines',arr.length,'missing tech story',miss.length, arr[0]?Object.keys(arr[0]).filter(k=>/story/i.test(k)).join(','):''); if(miss.length) found++; if(found>=3) break; }
await s.close(); process.exit(0);
