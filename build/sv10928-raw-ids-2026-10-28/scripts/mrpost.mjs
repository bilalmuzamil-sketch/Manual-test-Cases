// Parts → Returns → tick a manual return → Receive Credit → change Vendor to a different one → Post Credit; reads the pop-up.
// Usage: node mrpost.mjs <env> <returnRequestId> [vendorText]
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,id,vtxt]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const out=`ev/messages/${env}-mrvendor`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
await s.go(`/parts/confirm-return?id=${id}&isManualReturn=1`); await p.waitForTimeout(6000);
const val=async t=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); const f=e&&(e.closest('.q-field')||e); return f?f.innerText.replace(/\s+/g,' ').trim():null;},t);
console.log('vendor before',await val('select_vendor')); console.log('table',(await p.evaluate(()=>document.querySelector('[data-test-id="table_confirm_return_items"]')?.innerText.replace(/\s+/g,' ').slice(0,250))));
await p.screenshot({path:out+'/3-confirm-before.png'});
await p.locator('[data-test-id="select_vendor"]').click(); await p.waitForTimeout(800); if(vtxt){ await p.keyboard.type(vtxt,{delay:40}); await p.waitForTimeout(2500); }
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,6)); console.log('options',JSON.stringify(opts));
const cur=await val('select_vendor'); const pick=opts.findIndex(o=>o&&!cur.includes(o)&&!/No results/.test(o)); await p.locator('.q-menu .q-item').nth(pick).click(); await p.waitForTimeout(1500);
console.log('vendor after',await val('select_vendor'));
const fill=async(t,v)=>{ const l=p.locator(`[data-test-id="${t}"]`).first(); if(!(await l.count())) return; await ((await l.evaluate(e=>e.tagName))==='INPUT'?l:l.locator('input')).fill(v); await p.waitForTimeout(400); };
await fill('input_credit_memo_number','ZZCM'+Date.now()%100000);
console.log('post enabled',await p.locator('[data-test-id="button_post_credit"]').isEnabled());
await p.screenshot({path:out+'/4-confirm-other-vendor.png'});
const w0=s.writes.length; await p.locator('[data-test-id="button_post_credit"]').click(); await p.waitForTimeout(1800);
const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))); console.log('POP-UP',JSON.stringify(t));
await p.screenshot({path:out+'/5-popup.png'}); console.log('writes',JSON.stringify(s.writes.slice(w0).map(w=>w.slice(0,300))));
fs.writeFileSync(out+'/post-result.json',JSON.stringify({env,id,popup:t,writes:s.writes.slice(w0)},null,1));
await s.close(); process.exit(0);
