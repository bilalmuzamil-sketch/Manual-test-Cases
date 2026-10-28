// Catalog part deleted in another tab: tab A shows the catalog with the part; tab B deletes it; tab A opens the part -> message
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-catdel`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env};
await s.go('/workorders'); await A.waitForTimeout(2000);
const pn='ZZC'+(Date.now()%1000000); const name='ZZAUTOTEST catalog '+pn;
const c=await s.api('/api/parts-catalogue/add-catalogue-part',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,part_number:pn,tags:[]})}); R.create=c.status; const id=(JSON.stringify(c.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0]; R.id=id; console.log('create',c.status,id);
await s.go('/parts/parts-catalogue'); await A.waitForTimeout(3000);
await A.locator('[data-test-id="page_search_toggle"]').click(); await A.waitForTimeout(600); await A.keyboard.type(pn,{delay:40}); await A.waitForTimeout(3000);
const row=A.locator('tr',{hasText:pn}).first(); R.rowVisible=await row.isVisible(); await A.screenshot({path:out+'/A-list.png'});
// tab B: delete the part (stands in for a user deleting it on screen in another tab)
const B=await s.ctx.newPage(); await B.goto(s.host.app+'/workorders',{waitUntil:'domcontentloaded'}); await B.waitForTimeout(3000);
R.del=await B.evaluate(async([api,id])=>{ const r=await fetch(api+'/api/parts-catalogue/remove-catalogue-part',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({id})}); return r.status+' '+(await r.text()).slice(0,200); },[s.host.api,id]); console.log('delete',R.del);
await row.locator('td').nth(2).click(); await A.waitForTimeout(300);
const t=[]; for(let i=0;i<20;i++){ for(const x of await A.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!t.includes(x)) t.push(x); await A.waitForTimeout(250); }
R.toasts=t; R.dialog=await A.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)); await A.screenshot({path:out+'/A-after-open.png'});
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
