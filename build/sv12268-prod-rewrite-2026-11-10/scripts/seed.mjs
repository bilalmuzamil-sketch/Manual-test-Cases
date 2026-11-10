// node seed.mjs <tag> <amt1> <amt2> ... -> new 0%-tax vendor, one stock order + receive per amount (qty1 at that cost). writes ../ev/seed-<tag>.json
import {sess,post} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page; await s.go('/parts/vendors'); await p.waitForTimeout(1500);
const [tag,...amts]=process.argv.slice(2); const show=(n,r)=>{console.log(n,r.status,JSON.stringify(r.json||r.text).slice(0,260)); return r;};
const name=`ZZAUTOTEST SV12268 ${tag}`; const taxes=(await s.api('/api/taxes?pagination%5BrowsPerPage%5D=1000')).json.data.collection; const tz=taxes.find(t=>t.rateTotal===0)||taxes[0]; console.log('tax',tz.name,tz.id);
show('addvendor',await post(s,'/api/parts-catalogue/add-vendor',{name,credit_term:'COD',credit_limit:0,tax_id:tz.id}));
const v=(await s.api('/api/parts-catalogue/vendors?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5&search='+encodeURIComponent(name))).json.data.collection[0]; console.log('vendor',v.id);
const pr=(await s.api('/api/inventory/parts?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5&search=')).json.data.collection; const part=pr[0]; console.log('part',part.id,part.part_number,Object.keys(part).join(','));
const out={vendorId:v.id,name,bills:[]};
for(const a of amts){ const r=show('ord',await post(s,'/api/inventory/orders/create',{vendor_id:v.id,items:[{id:part.id,is_core:false,part_number:part.part_number,quantity:1,price:Number(a),description:'ZZAUTOTEST SV-12268 bill '+a}]}));
  const oid=r.json?.data?.id||r.json?.data?.order_id||r.json?.data?.orderId; out.bills.push({amount:a,orderId:oid}); }
fs.writeFileSync(`../ev/seed-${tag}.json`,JSON.stringify(out,null,1)); console.log(JSON.stringify(out));
await s.close(); process.exit(0);
