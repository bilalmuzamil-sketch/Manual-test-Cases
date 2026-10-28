// Tab A has a work order open; tab B switches the location; tab A changes the Sales Rep -> message. Switches back after.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,otherWp,tz,homeWp,homeTz]=process.argv.slice(2); const out=`/tmp/s10928/${env}-loc`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env,wo};
const toastsOf=async pg=>{ const t=[]; for(let i=0;i<24;i++){ for(const x of await pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!t.includes(x)) t.push(x); await pg.waitForTimeout(250);} return t; };
A.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())&&!/recent-entities/.test(r.url())) (R.APosts=R.APosts||[]).push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,250)); });
await s.go(`/workorders/${wo}/lines`); await A.waitForTimeout(5000); R.number=await A.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText);
const B=await s.ctx.newPage(); await B.goto(s.host.app+'/workorders',{waitUntil:'domcontentloaded'}); await B.waitForTimeout(3000);
const sw=(wp,tz)=>B.evaluate(async([api,wp,tz])=>{ const r=await fetch(api+'/api/iam/change-location',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:wp,workplace_timezone:tz})}); return r.status; },[s.host.api,wp,tz]);
R.switch=await sw(otherWp,tz); console.log('location switched in tab B',R.switch); await A.waitForTimeout(2500); R.urlAfter=A.url(); await A.screenshot({path:out+'/A-after-switch.png'}); console.log('tab A url',R.urlAfter);
try{
await A.locator('[data-test-id="select_authorizer"]').click(); await A.waitForTimeout(1500);
R.options=await A.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,4));
await A.locator('.q-menu .q-item').filter({hasNotText:/No authorizer/}).first().click(); R.toastsA=await toastsOf(A); await A.screenshot({path:out+'/A-error.png'});
}catch(e){ R.err=e.message.slice(0,150); }
R.switchBack=await sw(homeWp,homeTz);
console.log(JSON.stringify(R,null,1).slice(0,2500)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
