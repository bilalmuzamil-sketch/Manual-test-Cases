// usage: node snap.mjs <label>  -> stock + Part History ids for every part in parts.json (+decimal)
import {os,J,post} from './lib.mjs'; import fs from 'fs';
const P=JSON.parse(fs.readFileSync('parts.json')); P.dec={id:'0e0db6fe-1ce3-4892-8b17-e390eca62181',pn:'SH550045136'};
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const out={};
for(const k in P){ const id=P[k].id; const d=(await s.api('/api/inventory/parts/'+id)).json?.data; const part=d?.part||d;
  const h=(await s.api(`/api/parts/history/${id}?pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=&pagination[descending]=false&search=`)).json?.data?.collection||[];
  out[k]={pn:P[k].pn,qty:part?.quantity,bins:(part?.binLocations||part?.bins||[]).map(b=>[b.name,b.quantity]),hist:h.map(x=>({id:x.id,t:x.eventType,n:x.eventName,q:x.quantity??x.qty,txt:(x.description||x.message||x.text||'').slice(0,120),at:x.created_at||x.date}))};
  console.log(k,P[k].pn,'qty',out[k].qty,'bins',J(out[k].bins,120),'hist',h.length,J(out[k].hist.slice(0,2),400)); }
fs.writeFileSync(`snap-${process.argv[2]}.json`,JSON.stringify(out,null,1)); await s.close();
