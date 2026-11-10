// Jordan's 80547/80549 order on production, one browser session, in-app navigation only (no reload between steps)
// 1 Customers > customer > Invoices > select invoices > envelope > X   2 WO > Finance > Reverse > Create Invoice > Charge Account > envelope > send
import {sess,load} from './common.mjs'; import fs from 'fs';
const S=load(); const CID=S.cid; const WO=process.env.WO||S.wo; const TAG=process.env.TAG||'J1'; const O='/tmp/qa12299/'+TAG; fs.mkdirSync(O,{recursive:true});
const s=await sess(); const p=s.page; const shot=n=>p.screenshot({path:`${O}/${n}.png`});
const bodies=[]; p.on('request',r=>{ if(/send-email|send-transactions-mail|invoice\/send/.test(r.url())){ const b=r.postDataBuffer(); bodies.push({url:r.url(),len:b?.length}); if(b) fs.writeFileSync(`${O}/req-${bodies.length}.bin`,b);} });
let pdfn=0; p.on('response',async r=>{ const ct=r.headers()['content-type']||''; if(/pdf|preview|estimate|statement|transactions/.test(r.url())&&r.request().method()!=='OPTIONS'){ let b=null; try{b=await r.body();}catch(e){} const n=++pdfn; console.log('RESP',n,r.status(),r.request().method(),r.url().replace(/^https:\/\/[^/]+/,'').slice(0,140),ct,b?.length); if(b&&(ct.includes('pdf')||b.slice(0,4).toString()==='%PDF')) fs.writeFileSync(`${O}/resp-${n}.pdf`,b);} });
await p.route('**/send-email',async rt=>{ const b=rt.request().postDataBuffer(); if(b) fs.writeFileSync(`${O}/send-body.bin`,b); console.log('send body bytes',b?.length); await rt.continue(); });
const nav=async path=>{ await p.evaluate(pth=>document.querySelector('#q-app').__vue_app__.config.globalProperties.$router.push(pth),path); await p.waitForTimeout(4500); };
if(!process.env.SKIP_STMT){
 await s.go('/customers/'+CID); await p.waitForTimeout(4000);
 await p.locator('.q-tab, [role=tab]',{hasText:/Invoices/}).first().click(); await p.waitForTimeout(3500);
 const boxes=p.locator('.q-table tbody .q-checkbox'); console.log('row boxes',await boxes.count()); const nb=Math.min(await boxes.count(),3); for(let i=0;i<nb;i++) await boxes.nth(i).click();
 await shot('1-invoices-selected');
 await p.locator('button[aria-label="Send Email"]').first().click(); await p.waitForTimeout(2500);
 console.log('stmt dialog',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300))); await shot('2-statement-dialog');
 const x=p.locator('.q-dialog button:has(i:text-is("close"))').first(); console.log('X found',await x.count()); await x.click(); await p.waitForTimeout(1500);
 console.log('dialog open after X',await p.locator('.q-dialog').count()); await shot('3-closed');
 await nav(`/workorders/${WO}/lines`);
} else { await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(4000); }
console.log('url',p.url(),'status',await p.evaluate(()=>document.body.innerText.match(/\b(Invoiced|Complete|Paid)\b/)?.[0]));
await p.locator('.q-tab, a, [role=tab]',{hasText:/^Finance$/}).first().click(); await p.waitForTimeout(4000);
if(await p.locator('[data-test-id="button_wo_invoice_menu"]').count()){ await p.locator('[data-test-id="button_wo_invoice_menu"]').first().click(); await p.waitForTimeout(800);
 await p.locator('[data-test-id="menu_item_reverse"]').click(); await p.waitForTimeout(1500); await shot('4-reverse-dialog');
 await p.locator('[data-test-id="button_confirm_reverse_invoice"]').click(); await p.waitForTimeout(4000); }
console.log('after reverse',await p.evaluate(()=>document.body.innerText.match(/\b(Invoiced|Complete|Paid)\b/)?.[0]));
await p.locator('[data-test-id="button_create_invoice"]').first().click(); await p.waitForTimeout(4000); await shot('5-payment-dialog');
await p.locator('[data-test-id="button_charge_account"]').first().click(); await p.waitForTimeout(4000);
console.log('after charge',await p.evaluate(()=>document.body.innerText.match(/\b(Invoiced|Complete|Paid)\b/)?.[0])); await shot('6-invoiced');
await p.locator('[data-test-id="button_send_email"]').first().click(); await p.waitForTimeout(2500);
console.log('send dialog',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,400)));
const ec=p.locator('.q-dialog [data-test-id="input_email_content"]'); if(await ec.count()){ await ec.click(); await ec.fill('ZZAUTOTEST SV12299 '+TAG+' Jordan order'); }
if(process.env.MANUAL){ const cbs=p.locator('.q-dialog .q-checkbox'); const n=await cbs.count(); const labels=[]; for(let i=0;i<n;i++) labels.push(await cbs.nth(i).innerText());
  console.log('dialog checkboxes',JSON.stringify(labels)); for(let i=0;i<n;i++){ const t=labels[i]; if(/sv12299|Inbox/i.test(t)) await cbs.nth(i).click(); }
  const oe=p.locator('.q-dialog input').filter({hasNot:p.locator('[type=checkbox]')}); const ins=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input,.q-dialog textarea')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+(e.getAttribute('aria-label')||'')+'|'+e.type));
  console.log('inputs',JSON.stringify(ins));
  const opt=p.locator('.q-dialog [data-test-id="input_optional_emails"]'); await opt.click(); await opt.fill('bilal.muzamil+sv12299j@shopview.com'); }
await shot('7-send-dialog');
const n2=s.writes.length; await p.locator('.q-dialog [data-test-id="button_send_email"]').last().click(); await p.waitForTimeout(7000);
console.log('send writes',JSON.stringify(s.writes.slice(n2).map(w=>w.slice(0,160)))); console.log('bodies',JSON.stringify(bodies)); await shot('8-after-send');
console.log('at',new Date().toISOString()); await s.close(); process.exit(0);
