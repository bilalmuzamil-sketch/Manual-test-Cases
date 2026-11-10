// Jordan 80549 with the payment steps: pay WO -> statement window X -> delete the payment -> reverse -> Create Invoice -> Charge Account -> envelope (own email) -> send
import {sess,load} from './common.mjs'; import fs from 'fs';
const S=load(); const CID=S.cid; const WO=process.env.WO||S.wo; const TAG=process.env.TAG||'K1'; const O='/tmp/qa12299/'+TAG; fs.mkdirSync(O,{recursive:true});
const s=await sess(); const p=s.page; let n=0; const shot=async t=>p.screenshot({path:`${O}/${String(++n).padStart(2,'0')}-${t}.png`});
const txt=()=>p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,500));
const badge=()=>p.evaluate(()=>document.body.innerText.match(/\b(Invoiced|Complete|Paid|Partially Paid)\b/)?.[0]);
let pdfn=0; p.on('response',async r=>{ if(/invoices\/preview|estimate|statement|transactions|batch/.test(r.url())&&r.request().method()!=='OPTIONS'){ let b=null; try{b=await r.body();}catch(e){} const k=++pdfn; console.log('RESP',k,r.status(),r.request().method(),r.url().replace(/^https:\/\/[^/]+/,'').slice(0,130),b?.length); if(b&&b.slice(0,4).toString()==='%PDF') fs.writeFileSync(`${O}/resp-${k}.pdf`,b);} });
p.on('request',r=>{ if(r.method()==='POST'&&/\/api\//.test(r.url())) console.log('POST',r.url().replace(/^https:\/\/[^/]+/,'')); });
const nav=async path=>{ await p.evaluate(pth=>document.querySelector('#q-app').__vue_app__.config.globalProperties.$router.push(pth),path); await p.waitForTimeout(4500); };
const finance=async()=>{ await p.locator('.q-tab, a, [role=tab]',{hasText:/^Finance$/}).first().click(); await p.waitForTimeout(4000); };
// 1 take a payment on the invoiced WO
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(4000); console.log('start',await badge()); await finance();
await p.locator('[data-test-id="button_new_payment"]').first().click(); await p.waitForTimeout(2500); console.log('pay dialog',await txt());
await p.locator('[data-test-id="select_payment_method"]').click(); await p.waitForTimeout(800);
const opts=p.locator('.q-menu .q-item'); console.log('methods',JSON.stringify(await opts.allInnerTexts())); await opts.filter({hasText:/^Cash$/i}).first().click().catch(async()=>{await opts.first().click();}); await p.waitForTimeout(600);
await shot('payment-dialog'); await p.locator('[data-test-id="button_make_payment"]').click(); await p.waitForTimeout(4000); console.log('after pay',await badge()); await shot('paid');
// 2 statement window opened + X
await nav('/customers/'+CID); await p.locator('.q-tab, [role=tab]',{hasText:/Invoices/}).first().click(); await p.waitForTimeout(3500);
const boxes=p.locator('.q-table tbody .q-checkbox'); const nb=await boxes.count(); console.log('invoice rows',nb); for(let i=0;i<nb;i++) await boxes.nth(i).click();
await p.locator('button[aria-label="Send Email"]').first().click(); await p.waitForTimeout(2500); console.log('stmt dialog',await txt()); await shot('statement-dialog');
await p.locator('.q-dialog button:has(i:text-is("close"))').first().click(); await p.waitForTimeout(1500);
// 3 delete the payment: Payments tab -> bin -> Reverse
await p.locator('.q-tab, [role=tab]',{hasText:/^Payments/}).first().click(); await p.waitForTimeout(3500); await shot('payments-tab');
const bin=p.locator('[data-test-id^="button_remove_payment_"]').first(); console.log('bins',await p.locator('[data-test-id^="button_remove_payment_"]').count()); await bin.click(); await p.waitForTimeout(1500); console.log('rev dialog',await txt());
await p.locator('[data-test-id="button_confirm_dialog"]').click(); await p.waitForTimeout(3000); console.log('after delete dialog',await txt()); await shot('payment-deleted');
// 4 WO: reverse, create invoice, look at the payment dialog, charge account
await nav(`/workorders/${WO}/lines`); console.log('wo',await badge()); await finance();
if(await p.locator('[data-test-id="button_wo_invoice_menu"]').count()){ await p.locator('[data-test-id="button_wo_invoice_menu"]').first().click(); await p.waitForTimeout(800); await p.locator('[data-test-id="menu_item_reverse"]').click(); await p.waitForTimeout(1500); console.log('reverse dialog',await txt());
 if(await p.locator('[data-test-id="button_confirm_reverse_invoice"]').count()) await p.locator('[data-test-id="button_confirm_reverse_invoice"]').click(); else await p.keyboard.press('Escape'); await p.waitForTimeout(4000); }
console.log('after reverse',await badge());
await p.locator('[data-test-id="button_create_invoice"]').first().click(); await p.waitForTimeout(4000); console.log('create-invoice dialog',await txt()); await shot('create-invoice-dialog');
await p.locator('[data-test-id="button_charge_account"]').first().click(); await p.waitForTimeout(4000); console.log('after charge',await badge());
// 5 envelope, own email
await p.locator('[data-test-id="button_send_email"]').first().click(); await p.waitForTimeout(2500); console.log('send dialog',await txt());
const cbs=p.locator('.q-dialog .q-checkbox'); for(let i=0;i<await cbs.count();i++){ if(/Inbox|sv12299/i.test(await cbs.nth(i).innerText())) await cbs.nth(i).click(); }
await p.locator('.q-dialog [data-test-id="input_optional_emails"]').fill('bilal.muzamil+sv12299k@shopview.com');
await p.locator('.q-dialog [data-test-id="input_email_content"]').fill('ZZAUTOTEST SV12299 '+TAG+' Jordan order with payment delete'); await shot('send-dialog');
await p.locator('.q-dialog [data-test-id="button_send_email"]').last().click(); await p.waitForTimeout(7000); await shot('after-send');
console.log('at',new Date().toISOString()); await s.close(); process.exit(0);
