// usage: node AI.mjs <returnId> '<json: [[partKey, quantityValue], ...]>' <label>
import {os,J,post} from './lib.mjs'; import fs from 'fs';
const P=JSON.parse(fs.readFileSync('parts.json')); P.dec={id:'0e0db6fe-1ce3-4892-8b17-e390eca62181',pn:'SH550045136'};
const RET=process.argv[2], plan=JSON.parse(process.argv[3]), label=process.argv[4]||'run';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const qty=async id=>{ const d=(await s.api('/api/inventory/parts/'+id)).json?.data; return (d?.part||d)?.quantity; };
const hist=async id=>(await s.api(`/api/parts/history/${id}?pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=&pagination[descending]=false&search=`)).json?.data?.collection||[];
const log=[];
for(const [k,q] of plan){ const id=P[k].id; const b=await qty(id); const h0=new Set((await hist(id)).map(x=>x.id));
  const body={return_id:RET,inventory_part_id:id,quantity:q,credits:10}; const t=new Date().toISOString();
  const r=await post(s,'/api/inventory/returns/add-item',body,{'X-Location-ID':'b3c8c820-f815-4cf1-8938-10956c5ee71a'});
  const a=await qty(id); const hn=(await hist(id)).filter(x=>!h0.has(x.id));
  const row={k,pn:P[k].pn,id,sent:q,at:t,status:r.status,resp:J(r.json,300),before:b,after:a,delta:Math.round((+b-+a)*10000)/10000,newHist:hn};
  log.push(row); console.log(`${k} ${P[k].pn} sent ${JSON.stringify(q)} -> HTTP ${r.status} ${J(r.json,160)} | stock ${b} -> ${a} (deducted ${row.delta}) | new history ${hn.length}: ${J(hn.map(x=>[x.eventName,x.quantity??x.qty,x.oldQuantity??x.old_quantity,x.newQuantity??x.new_quantity]),300)}`); }
fs.writeFileSync(`ai-${label}.json`,JSON.stringify(log,null,1));
const rd=(await s.api('/api/inventory/returns/'+RET)).json; fs.writeFileSync(`return-${label}.json`,JSON.stringify(rd,null,1));
let c=rd?.data?.content; try{c=typeof c==='string'?JSON.parse(c):c}catch(e){} console.log('return items',J((c?.items||c?.return_items||c?.parts||[]).map(i=>[i.part_number||i.partNumber,i.quantity,i.credits??i.price??i.total]),900),'| keys',J(Object.keys(c||rd?.data||{}),300));
await s.close();
