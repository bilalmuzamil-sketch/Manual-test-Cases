// Bin location gone: new bin + inventory part stocked in it, add it to a work order, delete the bin, then Pick -> message.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env];
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const LH=env==='prod'?{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}:{};
const req=(u,b,m='POST')=>s.api(u,{method:m,headers:Object.assign({'Content-Type':'application/json'},LH),body:b?JSON.stringify(b):undefined});
const get=u=>s.api(u,{headers:LH});
const show=(k,r)=>console.log(k.padEnd(18),r.status,JSON.stringify(r.json||r.text).slice(0,230));
const bn='ZZBIN'+Date.now()%100000; const b=await req('/api/inventory/bin-locations',{name:bn}); show('bin create',b); const bid=(JSON.stringify(b.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0];
const pn='ZZBP'+Date.now()%100000; const cp=await req('/api/parts-catalogue/add-catalogue-part',{name:'ZZAUTOTEST bin gone part',part_number:pn,tags:[]}); const cpid=(JSON.stringify(cp.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0];
const P0=((await get('/api/inventory/parts?limit=1&search=')).json?.data?.parts||(await get('/api/inventory/parts?limit=1&search=')).json?.data?.collection||[])[0];
const ip=await req('/api/inventory/parts/create',{catalog_part_id:cpid,category_id:P0.category,quantity:5,cost:10,tags:[],bins:[{id:bid,quantity:5,isDefault:true}]}); show('inventory part',ip); const ipid=ip.json?.data?.part_id;
const lines=(await get(`/api/work-orders/lines/${WO}`)).json?.data?.collection||[]; const L=lines.find(l=>/authori/i.test(l.status||l.line_status||''))||lines[0];
const mk=await req('/api/work-orders/part/make-request',{work_order:WO,line:L.line_id,description:'ZZAUTOTEST bin gone part',part_number:pn,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:P0.category,inventory_part_id:ipid,sell_price:10}); show('add to WO',mk);
const prq=(JSON.stringify(mk.json).match(/"(?:part_request_id|id)":"([0-9a-f-]{36})"/)||[])[1];
show('delete bin',await req(`/api/inventory/bin-locations/${bid}`,null,'DELETE'));
show('pick',await req(`/api/work-orders/${WO}/pick-inventory-parts`,{part_request_ids:[prq]}));
console.log(JSON.stringify({bn,pn,prq}));
await s.close(); process.exit(0);
