import fs from 'fs'; import {ob,j} from './lib.mjs';
// usage: node seed.mjs <tag> <vendorId> <wo> <line> <qty> <cost> <sell>
const [tag,vendor,wo,line,qty,cost,sell]=process.argv.slice(2);
const s=await ob(); await s.go('/workorders/'+wo+'/lines');
const pn='ZZ10804-'+tag+'-'+Date.now().toString().slice(-6);
const mr=await s.api('/api/work-orders/part/make-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order:wo,line,description:'ZZAUTOTEST SV-10804 run '+tag,part_number:pn,quantity:+qty,part_source_type:'vendor',is_authorized:false,part_category_id:'0044fbd9-5ce3-4d33-9b27-b2db6a6ba075',cost:+cost,sell_price:+sell,vendor_id:vendor})});
console.log('make-request',mr.status,j(mr.json,300));
const lines=await s.api('/api/work-orders/lines/'+wo); const L=(lines.json.data.collection||lines.json.data).find(l=>l.line_id===line);
const pr=(L.part_requests||[]).find(p=>JSON.stringify(p).includes(pn)); console.log('pr',pr&&(pr.id||pr.part_request_id), pr && Object.keys(pr).join(','));
const prid=pr.id||pr.part_request_id;
const o=await s.api('/api/work-orders/part/perform-request-status-action',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({part_request_id:prid,action:'order'})});
console.log('order',o.status,j(o.json,300));
fs.writeFileSync(`run-${tag}.json`,JSON.stringify({tag,pn,vendor,wo,line,prid,orderId:o.json?.data?.orderId}));
await s.close();
