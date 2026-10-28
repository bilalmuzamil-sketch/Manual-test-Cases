// Back-end probe of the PR's reworded messages (same requests the screens send, with a state built to fail). Prints status + message.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const C={branch:{po:'7d1492a8-a395-4bc0-9413-a28f9721fc28',wo:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prq:'ce3f82ba-d548-4be5-b055-6303b00caf55',inv:'ZZPV590814'},
  prod:{po:'6549c267-041a-4da3-96ca-915b6cb83532',wo:'0ecff689-f076-4b1e-be98-d1fcaf650988',prq:'d899c961-d71c-47a5-a407-a870b6ef5be7',inv:'ZZPV737915'}}[env];
if(process.env.PO) C.po=process.env.PO;
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); if(env==='prod'){ await s.go('/workorders'); await s.page.evaluate(()=>localStorage.setItem('location',JSON.stringify('b617914c-16e9-4485-8e8b-193cd86aa416'))); }
const LH=env==='prod'?{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}:{}; const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},LH),body:JSON.stringify(b)});
const show=(k,r)=>console.log(k.padEnd(22),r.status,JSON.stringify(r.json||r.text).slice(0,260));
const Z='0badf00d-0000-4000-8000-000000010928';
const ord=(await s.api('/api/inventory/orders/'+C.po)).json?.data?.order; const it=ord.items||[]; console.log('PO',ord.number||ord.raw_number,'items',it.length);
const acc=(items)=>post('/api/inventory/orders/accept',{id:C.po,invoiceNumber:'ZZ'+Date.now()%100000,invoiceDate:new Date().toISOString(),note:'',items:JSON.stringify(items),total:0,orderStatus:'fulfilled',tax:0});
show('no-matching-items',await acc([{...it[0],id:Z,order_item_id:Z,item_id:Z,quantity_received:1,total:0}]));
show('item-not-on-order',await acc([{...it[0],quantity_received:0,total:0},{...it[0],id:Z,order_item_id:Z,item_id:Z,part_number:'ZZNOTONPO',quantity_received:1,total:0}]));
if(process.env.ONLY_PO){await s.close();process.exit(0);}
const P=((await s.api('/api/inventory/parts?limit=5&search='+C.inv)).json?.data?.parts||(await s.api('/api/inventory/parts?limit=5&search='+C.inv)).json?.data?.collection||[])[0];
show('bin-gone (cycle count)',await post('/api/inventory/parts/cycle-count',{part_quantities:[{id:P.id,bins:[{id:Z,quantity:1}]}]}));
show('pick vendor part',await post(`/api/work-orders/${C.wo}/pick-inventory-parts`,{part_request_ids:[C.prq]}));
show('fee template gone',await post('/api/work-orders/adjustments/add',{workOrderId:C.wo,kind:'processing_fee',name:'ZZ',calculationType:'pct_grand_total',amount:3,maxCap:null,scope:'whole_wo',targetId:null,taxable:false,templateId:Z,description:null}));
await s.close(); process.exit(0);
