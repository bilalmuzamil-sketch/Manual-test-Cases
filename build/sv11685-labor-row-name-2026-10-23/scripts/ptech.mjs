import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const wo=fs.readFileSync('/tmp/qa11685/w/prod-wo.txt','utf8').trim(); const WP='b617914c-16e9-4485-8e8b-193cd86aa416';
const A=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:1000}});
const PA=(u,b)=>A.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const L=(await A.api('/api/staff?limit=200')).json.data; const arr=L.staff||L.collection||L;
const k=Object.keys(arr[0]); console.log('staff keys',k.filter(x=>/work|loc|place/i.test(x)).join(','));
const techs=arr.filter(x=>/^technician$/i.test(x.role_label||'')); const atWp=techs.filter(x=>JSON.stringify(x).includes(WP)); console.log('techs',techs.length,'at location',atWp.length, atWp.slice(0,2).map(t=>t.first_name+' '+t.last_name).join(';'));
const t=atWp[0]||techs[0];
const d0=(await A.api('/api/organizations/invoice-settings/view')).json.data.documentDesign; console.log('design was',d0, 'switch', (await PA('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'})).status);
const inv=(await A.api('/api/work-orders/view/'+wo)).json.data.work_order.invoice_id;
const B=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:1000}});
const PB=(u,b)=>B.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
console.log('switch-user',(await PB('/api/switch-user',{user_id:t.user_id||t.id})).status);
let fp=(await B.api('/api/auth/me/fe-permissions')).json?.data; console.log('as',t.first_name,t.last_name,JSON.stringify({slug:fp?.template_slug,sfd:fp?.cross_toggles?.seeFinancialData}));
const ret=[];
for(let attempt=0;attempt<2;attempt++){
  const e=await PB('/api/work-orders/invoices/estimate',{work_order_id:wo,type:'html',isEstimate:1,includeDeclined:1,issueDate:'2026-10-23',dueDate:'2026-11-22',historyEvent:null});
  const i=await B.api(`/api/invoices/preview?invoice_id=${inv}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  console.log('estimate',e.status,e.text?e.text.length:JSON.stringify(e.json).slice(0,120),'invoice',i.status,i.text?i.text.length:JSON.stringify(i.json).slice(0,120));
  if(e.text){ fs.writeFileSync('/tmp/qa11685/w/ptech-est.html',e.text); if(i.text) fs.writeFileSync('/tmp/qa11685/w/ptech-inv.html',i.text); break; }
  console.log('change-location',(await PB('/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Chicago'})).status);
}
console.log('restore design',(await PA('/api/organizations/invoice-settings/change-design',{documentDesign:d0})).status,(await A.api('/api/organizations/invoice-settings/view')).json.data.documentDesign);
process.exit(0);
