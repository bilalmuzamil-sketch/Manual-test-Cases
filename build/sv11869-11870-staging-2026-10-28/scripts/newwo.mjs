// Work Orders → New → customer (typed) + first asset → Save (+Create on the confirmation) ; prints the new WO id and New Line dialog fields.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const cust=process.argv[2]||'ZZAUTOTEST';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/workorders'); await p.waitForTimeout(4000);
const ids=()=>p.evaluate(()=>[...new Set([...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>')))].join(' ; '));
await p.locator('[data-test-id="button_new_work_order"]').click(); await p.waitForTimeout(2000); console.log('dialog ids',await ids());
const cs=p.locator('.q-dialog [data-test-id*="customer"]').first(); await cs.click(); await p.waitForTimeout(500); await p.keyboard.type(cust,{delay:40}); await p.waitForTimeout(3000);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,6)); console.log('customers',JSON.stringify(opts));
await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(2500);
const as=p.locator('.q-dialog [data-test-id*="vehicle"], .q-dialog [data-test-id*="asset"]').first(); console.log('asset field',await as.count());
await as.click(); await p.waitForTimeout(2000); const ao=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,4)); console.log('assets',JSON.stringify(ao));
if(ao.length&&!/No (results|options)/i.test(ao[0])){ await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(1200); }
await p.locator('.q-dialog button',{hasText:/^\s*Save\s*$/}).first().click(); await p.waitForTimeout(3000);
const cb=p.locator('.q-dialog button',{hasText:/^\s*Create\s*$/}); if(await cb.count()){ await cb.first().click(); await p.waitForTimeout(4000); }
console.log('url',p.url().replace(/^https:\/\/[^/]+/,'')); await p.waitForTimeout(2500); console.log('line dialog ids',await ids());
await p.screenshot({path:'/tmp/qa30/newline.png'});
await s.close(); process.exit(0);
