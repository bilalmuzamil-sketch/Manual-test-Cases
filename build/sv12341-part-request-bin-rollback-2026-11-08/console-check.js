(async()=>{const API=location.hostname==='app.shopview.com'?'https://api.shopview.com':location.origin.replace(/^https:\/\/(sv\d+)\./,'https://$1api.');
const wo=location.pathname.split('/')[2]; const g=u=>fetch(API+u,{credentials:'include'}).then(r=>r.json());
const line=(await g('/api/work-orders/lines/'+wo)).data.collection[0].line_id;
const count=async()=>(await g('/api/work-orders/lines/'+wo)).data.collection.reduce((n,l)=>n+(l.part_requests||[]).length,0);
const part=(await g('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=20')).data.collection[0];
const before=await count();
const r=await fetch(API+'/api/work-orders/part/make-request',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order:wo,line,description:'ZZAUTOTEST check',part_source_type:'inventory',inventory_part_id:part.id,part_category_id:part.category,sell_price:50,quantity:1,bins:[{id:'11111111-2222-4333-8444-555555555555',name:'Nowhere',quantity:1}]})});
const msg='Server answer: '+r.status+' '+(await r.text())+' | part requests before: '+before+', after: '+(await count()); console.log(msg); return msg;})();
