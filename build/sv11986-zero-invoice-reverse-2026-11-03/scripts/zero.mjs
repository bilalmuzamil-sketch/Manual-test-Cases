// usage: ENV=branch|prod node zero.mjs <tag>  -> new WO with no lines, complete, invoice ($0). Prints statuses + capture of customer pages' API calls.
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const TAG=process.argv[2]; const OUT=`ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const s=await sess(); const p=s.page; const R={marker:await s.marker(),utc:new Date().toISOString()};
const me=(await s.api('/api/auth/me')).json?.data; R.me=JSON.stringify(me||{}).slice(0,200);
const cs=arr((await s.api('/api/customers?limit=200&search=ZZAUTOTEST')).json?.data); R.nCust=cs.length;
let cust,veh; for(const c of cs){ const vs=arr((await s.api('/api/vehicles?company_id='+c.id)).json?.data); if(vs.length){cust=c;veh=vs[0];break;} }
if(!cust){ const all=arr((await s.api('/api/customers?limit=50')).json?.data); for(const c of all){ const vs=arr((await s.api('/api/vehicles?company_id='+c.id)).json?.data); if(vs.length){cust=c;veh=vs[0];break;} } }
R.customer=[cust.id,cust.name]; const wp=(await s.api('/api/staff/my-workplaces')).json?.data; R.wps=JSON.stringify(wp).slice(0,300);
const today=new Date().toISOString().slice(0,10); if(process.env.CUST){ cust={id:process.env.CUST,name:'given'}; veh=arr((await s.api('/api/vehicles?company_id='+cust.id)).json?.data)[0]; }
const c=await post(s,'/api/work-orders/create',{company_id:cust.id,vehicle_id:veh.id,workplace_id:(arr(wp)[0]||{}).id,start_date:today,is_vehicle_here:true}); R.create=c.t; const WO=c.j?.data?.work_order_id; R.wo=WO;
const ct=await post(s,'/api/contacts/create',{company_id:cust.id,first_name:'ZZAUTOTEST',last_name:'SV11986 '+TAG}); R.contact=ct.t;
R.cc=(await post(s,'/api/work-orders/change-contact',{work_order_id:WO,vehicle_id:veh.id,contact_id:ct.j?.data?.contact_id,update_vehicle:true})).t;
R.mileage=(await post(s,'/api/work-orders/change-mileage',{work_order_id:WO,mileage:'123456'})).t;
const CL=process.env.CANNED||'68d59b05-ac52-4081-a193-1c0ab1fbda1d';
const L=await post(s,`/api/work-orders/${WO}/lines/create-from-canned-line`,{canned_line_id:CL,status:'authorized'}); R.line=L.t; const lid=L.j?.data?.line_id;
R.story=(await post(s,'/api/work-orders/lines/change-story',{line_id:lid,tech_story:'ZZAUTOTEST SV-11986',work_order_id:WO})).st;
R.lineDone=(await post(s,'/api/work-orders/lines/change-status',{line_id:lid,status:'complete'})).t;
if(process.env.DISC){ R.disc=(await post(s,'/api/work-orders/adjustments/add',{workOrderId:WO,kind:'discount',name:'ZZAUTOTEST 100% discount',calculationType:process.env.DISC,amount:Number(process.env.DAMT||100),scope:'whole_wo',targetId:null,taxable:false,templateId:null})).t;
  const v1=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w1=v1?.work_order||v1; R.totalAfterDisc=[w1?.total_cost,w1?.sub_total,w1?.totalAdjustments]; }
R.complete=(await post(s,'/api/work-orders/change-status',{id:WO,status:'complete'})).t;
const I=await post(s,'/api/invoices/create',{work_order_id:WO}); R.invoice=I.t; const ACC=I.j?.data?.customer_account_id; R.acc=ACC;
if(ACC){ const pl=(await s.api(`/api/customer-payment/list?accountId=${ACC}&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=date&pagination%5Bdescending%5D=true`)).json; R.payList=JSON.stringify(pl).slice(0,900); }
const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v; R.wo_after=Object.fromEntries(Object.entries(w||{}).filter(([k])=>/status|number|invoice|total|paid|balance/i.test(k)).map(([k,x])=>[k,typeof x==='object'?JSON.stringify(x).slice(0,120):x]));
const calls=[]; p.on('request',q=>{ if(q.url().includes('/api/')&&q.method()==='GET') calls.push(q.url().replace(/^https:\/\/[^/]+/,'')); });
for(const t of ['payments','invoices']){ await s.go(`/customers/${cust.id}/${t}`); await p.waitForTimeout(6000); R['tab_'+t]=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).slice(0,5)); await p.screenshot({path:`${OUT}/cust-${t}.png`}); }
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); await p.screenshot({path:`${OUT}/finance.png`});
R.financeButtons=await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.trim().slice(0,30)).filter(x=>/invoice|revers|payment|paid/i.test(x)).slice(0,30));
R.calls=[...new Set(calls)].filter(u=>/payment|invoice|credit|deposit/i.test(u)).slice(0,30);
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,5000)); await s.close(); process.exit(0);
