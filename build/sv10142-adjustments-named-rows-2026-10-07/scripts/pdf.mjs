import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
for(const L of process.argv.slice(2)){ const W=JSON.parse(fs.readFileSync(`wo-${L}.json`));
  const v=await s.api('/api/work-orders/view/'+W.wo); W.number=v.json?.data?.work_order?.number||v.json?.data?.work_order?.work_order_number; fs.writeFileSync(`wo-${L}.json`,JSON.stringify(W));
  const b64=await s.page.evaluate(async([base,id])=>{const r=await fetch(base+'/api/invoices/preview?invoice_id='+id+'&type=pdf',{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return r.status+'|'+btoa(s);},[s.host.api,W.invoice]);
  const [st,data]=b64.split('|'); fs.writeFileSync(`raw/invoice-${L}.pdf`,Buffer.from(data,'base64')); console.log(L,W.number,'pdf',st,Buffer.from(data,'base64').length); }
await s.close();
