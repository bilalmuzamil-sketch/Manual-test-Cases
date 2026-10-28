// Work order → Finance tab for an IBS customer → "Request IBS Approval" → read the dialog's message (customer info is fetched on load).
// Usage: node ibsui.mjs <env> <customerName> [workOrderId]
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,cname,woArg]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{headers:{'x-location-id':LOC}}:{};
const out=`ev/messages/${env}-ibs`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const cid=((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname)?.id; console.log('customer',cname,cid);
let wo=woArg; if(!wo){ const got=[]; p.on('response',async r=>{ if(/work-orders\?pagination/.test(r.url())){ try{got.push(await r.json());}catch{} } });
  await s.go(`/customers/${cid}/work-orders`); await p.waitForTimeout(6000);
  const ws=got.flatMap(j=>j?.data?.work_orders||[]).filter(w=>JSON.stringify(w).includes(cid)||JSON.stringify(w).includes(`"${cname}"`)); console.log('customer WOs',ws.map(w=>(w.raw_number||w.number)+':'+(w.status?.value||w.status)).join(' '));
  console.log('cands',ws.map(w=>(w.raw_number||w.number)+':'+JSON.stringify(w.status).slice(0,40)+':'+(w.total_price??w.totalPrice??w.total)).join(' | ')); wo=(ws.filter(w=>!/paid|invoiced|declined/.test(JSON.stringify(w.status))).sort((a,b)=>(b.total_price??b.totalPrice??0)-(a.total_price??a.totalPrice??0))[0]||ws[0])?.id; }
const ibsCalls=[]; p.on('response',async r=>{ if(/invoices\/ibs\//.test(r.url())) ibsCalls.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await s.go(`/workorders/${wo}/finance`); await p.waitForTimeout(8000); console.log('wo',wo,'url',p.url().replace(/^https:\/\/[^/]+/,''));
const btn=p.locator('[data-test-id="button_request_ibs_approval"]'); console.log('Request IBS Approval button',await btn.count());
await p.screenshot({path:out+'/1-finance.png'});
if(await btn.count()){ await btn.click(); await p.waitForTimeout(3000); const d=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,400))); console.log('DIALOG',JSON.stringify(d)); await p.screenshot({path:out+'/2-dialog.png'});
  const rb=p.locator('.q-dialog [data-test-id="button_ibs_request_approval"]'); console.log('Request Approval button',await rb.count(),await rb.count()?await rb.isEnabled():'-');
  const am=p.locator('.q-dialog [data-test-id="input_ibs_amount"]'); console.log('amount field',await am.count()); if(await am.count()){ const i=(await am.evaluate(e=>e.tagName))==='INPUT'?am:am.locator('input'); await i.fill('100'); await p.waitForTimeout(600); }
  if(await rb.count()&&await rb.isEnabled()){ await rb.click(); await p.waitForTimeout(3000); console.log('DIALOG after Request Approval',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,400))))); console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))))); await p.screenshot({path:out+'/3-after-request.png'}); } }
console.log('ibs calls\n'+ibsCalls.join('\n'));
fs.writeFileSync(out+'/result.json',JSON.stringify({env,cname,cid,wo,ibsCalls},null,1));
await s.close(); process.exit(0);
