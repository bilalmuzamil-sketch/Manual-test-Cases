// Tab A has the work order open; tab B invoices it; tab A changes the Authorizer -> message
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo]=process.argv.slice(2); const out=`/tmp/s10928/${env}-auth`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env,wo};
const toastsOf=async pg=>{ const t=[]; for(let i=0;i<24;i++){ for(const x of await pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!t.includes(x)) t.push(x); await pg.waitForTimeout(250);} return t; };
A.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) (R.APosts=R.APosts||[]).push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,250)); });
await s.go(`/workorders/${wo}/lines`); await A.waitForTimeout(5000);
R.number=await A.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText);
const B=await s.ctx.newPage(); await B.goto(s.host.app+'/workorders',{waitUntil:'domcontentloaded'}); await B.waitForTimeout(3000);
R.invoice=await B.evaluate(async([api,wo])=>{ const r=await fetch(api+'/api/invoices/create',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo})}); return r.status+' '+(await r.text()).slice(0,160); },[s.host.api,wo]); console.log('invoice in tab B',R.invoice);
await A.locator('[data-test-id="select_authorizer"]').click(); await A.waitForTimeout(1500);
R.options=await A.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,6));
await A.locator('.q-menu .q-item').filter({hasNotText:/No authorizer/}).first().click(); R.toastsA=await toastsOf(A); await A.screenshot({path:out+'/A-error.png'});
console.log(JSON.stringify(R,null,1).slice(0,2500)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
