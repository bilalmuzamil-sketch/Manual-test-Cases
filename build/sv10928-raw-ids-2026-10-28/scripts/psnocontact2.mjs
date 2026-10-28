// New customer (no contacts) → its Part Sales tab → New Part Sale → Customer field + Save. Usage: node psnocontact2.mjs <env>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{'x-location-id':LOC}:{};
const out=`ev/other/${env}-psnocontact`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const name='ZZAUTOTEST SV10928 Empty '+env+' '+Date.now()%100000; const c=await s.api('/api/customers/create',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify({name})}); const cid=c.json?.data?.company_id; console.log('customer',c.status,name,cid);
await s.go(`/customers/${cid}/part-sales`); await p.waitForTimeout(5000); await p.locator('button',{hasText:'New Part Sale'}).first().click(); await p.waitForTimeout(2500);
console.log('field',JSON.stringify(await p.evaluate(()=>document.querySelector('.q-dialog .q-field')?.innerText.replace(/\s+/g,' ')))); await p.screenshot({path:out+'/1-new-part-sale.png'});
const w0=s.writes.length; await p.locator('.q-dialog button',{hasText:'Save'}).first().click(); await p.waitForTimeout(3500);
const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))); console.log('after Save',JSON.stringify(t),p.url().replace(/^https:\/\/[^/]+/,''));
console.log('writes',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope/.test(w)).map(w=>w.slice(0,250)))); await p.screenshot({path:out+'/2-after-save.png'});
await s.close(); process.exit(0);
