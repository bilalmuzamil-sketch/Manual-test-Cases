// node poitem.mjs <env> <poId> [setManufacturer] — open Edit Order Item on the first row; optionally pick a manufacturer and save
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,po,setM]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const posts=[]; p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\//.test(r.url())) posts.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.request().postData()||'').slice(0,250)); });
await s.go('/order/'+po); await p.waitForTimeout(6000);
await p.locator('[data-test-id^="button_edit_order_item_"]').first().click(); await p.waitForTimeout(3000);
const D=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+((e.closest('.q-field')||e).innerText||'').replace(/\s+/g,' ').trim().slice(0,50)).join(' ;; '));
console.log('dialog',await D());
if(setM){ await p.locator('[data-test-id="select_order_item_manufacturer"]').click(); await p.waitForTimeout(1200);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()).slice(0,8)); console.log('options',opts.join(' | '));
  await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(800); console.log('after pick',await D());
  await p.locator('[data-test-id="button_save_order_item"]').click(); await p.waitForTimeout(3500); console.log(posts.join('\n')); }
await p.screenshot({path:'/tmp/s10928/poitem.png'}); await s.close(); process.exit(0);
