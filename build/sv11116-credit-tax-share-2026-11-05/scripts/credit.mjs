// usage: node credit.mjs <tag> <amount> [outcome=hold|refund] [tickInvoice=0|1] -> Customer > Invoices tab > Issue Credit (goodwill: "Parts are being returned" OFF), amount, reason, Issue Credit; prints dialog + writes
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,AMT,OUT,TICK]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:2}); const p=s.page;
await s.go(`/customers/${S.company}/invoices`); await p.waitForTimeout(5000);
const ids=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+(e.tagName==='INPUT'?'(in)':'')).join(' '));
if(process.env.ALL){ const tg=p.locator('.q-toggle').filter({hasText:'Open only'}).first(); await tg.click(); await p.waitForTimeout(2500); }
if(TICK==='1'){ const cb=p.locator('table tbody tr .q-checkbox').first(); await cb.click(); await p.waitForTimeout(800); }
await p.locator('[data-test-id="button_issue_credit_customer"]').click(); await p.waitForTimeout(2500);
console.log('DLG1',(await p.locator('.q-dialog').last().innerText()).replace(/\s+/g,' ').slice(0,600)); console.log('IDS1',await ids());
const parts=p.locator('[data-test-id="checkbox_credit_memo_type_parts"]'); if(await parts.count()){ const on=await parts.getAttribute('aria-checked'); console.log('parts checkbox',on); if(on==='true'){ await parts.focus(); await p.keyboard.press('Space'); await p.waitForTimeout(800);} }
await p.locator(`[data-test-id="radio_credit_memo_outcome_${OUT==='refund'?'refund':'hold'}"]`).click(); await p.waitForTimeout(600); console.log('confirm label',await p.locator('[data-test-id="button_confirm_dialog"]').innerText());
if(OUT==='refund'){ await p.locator('[data-test-id="select_credit_memo_payment_method"]').click(); await p.waitForTimeout(900); const o=p.locator('.q-menu .q-item').filter({hasText:/cash/i}).first(); console.log('pm',await o.count()); await o.click(); await p.waitForTimeout(700); }
const amt=p.locator('[data-test-id="input_credit_memo_amount"]'); console.log('amount field',await amt.count()); if(await amt.count()){ await amt.fill(String(AMT)); }
await p.locator('[data-test-id="input_credit_memo_reason"]').fill('ZZAUTOTEST goodwill '+TAG); await p.waitForTimeout(800);
console.log('DLG2',(await p.locator('.q-dialog').last().innerText()).replace(/\s+/g,' ').slice(0,700)); console.log('IDS2',await ids()); await p.screenshot({path:`../ev/${TAG}-credit-dialog.png`});
if(process.env.GO){ const n=s.writes.length; await p.locator('[data-test-id="button_confirm_dialog"]').click(); await p.waitForTimeout(3500); console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,500)))); await p.screenshot({path:`../ev/${TAG}-credit-after.png`}); }
await s.close(); process.exit(0);
