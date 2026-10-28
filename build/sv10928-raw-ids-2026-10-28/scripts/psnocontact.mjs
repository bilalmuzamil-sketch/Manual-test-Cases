// New Part Sale → Customer for a customer with no contacts: is it offered, what shows, what Save does. Usage: node psnocontact.mjs <env> <customerName>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,cname]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{headers:{'x-location-id':LOC}}:{};
const out=`ev/other/${env}-psnocontact`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const c=((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname); const v=(await s.api('/api/customers/view/'+c.id+'?',H)).json?.data;
console.log('customer',cname,c.id,'contacts',JSON.stringify(v).match(/"contacts?(_count)?":(\[[^\]]{0,80}|\d+)/g));
await s.go('/parts/part-sales'); await p.waitForTimeout(4000); await p.locator('button',{hasText:'New Part Sale'}).first().click(); await p.waitForTimeout(1500);
await p.locator('.q-dialog .q-field').first().click(); await p.waitForTimeout(500); await p.keyboard.type(cname,{delay:40}); await p.waitForTimeout(3000);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,5)); console.log('options',JSON.stringify(opts)); await p.screenshot({path:out+'/1-options.png'});
if(opts.some(o=>o.includes(cname))){ await p.locator('.q-menu .q-item',{hasText:cname}).first().click(); await p.waitForTimeout(1200);
  console.log('field shows',JSON.stringify(await p.evaluate(()=>document.querySelector('.q-dialog .q-field')?.innerText.replace(/\s+/g,' '))));
  const w0=s.writes.length; await p.locator('.q-dialog button',{hasText:'Save'}).first().click(); await p.waitForTimeout(3000);
  console.log('after Save',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')))),p.url().replace(/^https:\/\/[^/]+/,''));
  console.log('writes',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope/.test(w)).map(w=>w.slice(0,250)))); await p.screenshot({path:out+'/2-after-save.png'}); }
await s.close(); process.exit(0);
