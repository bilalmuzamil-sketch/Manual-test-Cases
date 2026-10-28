// Finds work orders of an IBS customer (from the customer's Work Orders tab traffic) and calls the request the
// Create Invoice button sends (GET invoices/ibs/retrieveIBSApproval). Usage: node ibsprobe.mjs <env> <customerName>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,cname]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{headers:{'x-location-id':LOC}}:{};
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const cid=((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname)?.id; console.log('customer',cname,cid);
const got=[]; p.on('response',async r=>{ if(/\/api\/.*work-orders/.test(r.url())&&r.request().method()==='GET'){ try{ got.push({u:r.url(),j:await r.json()}); }catch{} } });
await s.go(`/customers/${cid}/work-orders`); await p.waitForTimeout(6000);
const lst=got.find(g=>/work-orders\?pagination/.test(g.u)); const coll=lst?.j?.data?.work_orders||[]; console.log('first',JSON.stringify(coll[0]).match(/"(id|status|raw_number|company[a-z_]*|workplace[a-z_]*)":"?[^,]*/g)); const wos=(Array.isArray(coll)?coll:[]).map(w=>[w.id,w.status?.name||w.status?.value||w.status]);
const txt=got.map(g=>JSON.stringify(g.j)).join(' '); const _w=[...txt.matchAll(/\{"id":"([0-9a-f-]{36})"[^{}]*?"status":"([a-z_]+)"/g)].map(m=>[m[1],m[2]]); console.log('lists',got.map(g=>g.u.replace(/^https:\/\/[^/]+/,'').slice(0,90)).join(' , ')); console.log('wos',JSON.stringify(wos.slice(0,10)));
for(const [id,st] of wos.slice(0,4)){ const r=await s.api('/api/invoices/ibs/retrieveIBSApproval?workOrderId='+id,H); console.log('retrieve',st,id,r.status,JSON.stringify(r.json||r.text).slice(0,250)); }
await s.close(); process.exit(0);
