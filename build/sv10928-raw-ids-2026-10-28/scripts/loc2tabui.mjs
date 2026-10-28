// On screen: tab A has a work order open; tab B switches location via the profile menu; tab A changes the Sales Representative.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,homeWp,homeTz,otherName]=process.argv.slice(2); const out=`/tmp/s10928/${env}-locui`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env,wo};
const sw=(wp,tz)=>A.evaluate(async([api,wp,tz])=>{ const r=await fetch(api+'/api/iam/change-location',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:wp,workplace_timezone:tz})}); return r.status; },[s.host.api,wp,tz]);
await s.go('/workorders'); await A.waitForTimeout(2000); R.home=await sw(homeWp,homeTz); await A.evaluate(w=>localStorage.setItem('location',JSON.stringify(w)),homeWp);
await s.go(`/workorders/${wo}/lines`); await A.waitForTimeout(6000); await A.screenshot({path:out+'/A-start.png'});
A.on('response',async r=>{ if(r.request().method()!=='GET'&&/shopview\.com\/api\/work-orders/.test(r.url())) (R.posts=R.posts||[]).push('loc='+(r.request().headers()['x-location-id']||'').slice(0,8)+' '+r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,220)); });
const B=await s.ctx.newPage(); await B.goto(s.host.app+'/workorders',{waitUntil:'domcontentloaded'}); await B.waitForTimeout(5000);
R.locOptions=null; await B.evaluate(async([api,wp])=>{ await fetch(api+'/api/iam/change-location',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:wp,workplace_timezone:'America/Edmonton'})}); localStorage.setItem('location',JSON.stringify(wp)); },[s.host.api,otherName]); await B.waitForTimeout(2000);
R.lsAfter=await A.evaluate(()=>localStorage.getItem('location')); if(process.env.NAV==='1'){ for(const t of ['parts','lines']){ await A.evaluate(u=>{history.pushState({},'',u); dispatchEvent(new PopStateEvent('popstate'));},`/workorders/${wo}/${t==='parts'?'part-requests':'lines'}`); await A.waitForTimeout(3000);} }
// tab A, no reload: change the Sales Representative on the work order card
await A.keyboard.press('Escape'); await A.waitForTimeout(800); const sr=A.locator('[data-test-id="select_authorizer"]').first(); R.srCount=await sr.count();
await sr.click().catch(e=>R.err1=e.message.slice(0,100)); await A.waitForTimeout(1500);
R.srOptions=await A.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,5));
await A.locator('.q-menu .q-item').filter({hasNotText:/No authorizer/}).first().click().catch(e=>R.err2=e.message.slice(0,100));
const toasts=[]; for(let i=0;i<20;i++){ for(const x of await A.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!toasts.includes(x)) toasts.push(x); if(toasts.length&&i>4) break; await A.waitForTimeout(300);} R.toasts=toasts;
await A.screenshot({path:out+'/A-error.png'});
R.back=await sw(homeWp,homeTz); await A.evaluate(w=>localStorage.setItem('location',JSON.stringify(w)),homeWp);
console.log(JSON.stringify(R,null,1).slice(0,2500)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
