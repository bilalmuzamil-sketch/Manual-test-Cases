// production: WO S2-1945 (invoiced, charged to account) -> Notes: attach the saved statement, tick For Customer -> Finance envelope, tick Include 'For Customer' Attachments -> Send
import {sess,load} from './common.mjs'; const S=load(); const WO=S.wo2; const FILE='/tmp/qa12299/ZZAUTOTEST SV12299 Charge Account Statement (1).pdf';
const s=await sess(); const p=s.page; const shot=n=>p.screenshot({path:`/tmp/qa12299/E-${n}.png`});
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(4000);
console.log('status',await p.evaluate(()=>document.body.innerText.match(/\b(Invoiced|Complete|Paid)\b/)?.[0]));
await p.locator('[data-test-id="link_notes_tab"]').first().click(); await p.waitForTimeout(2500);
const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:15000}), p.locator('[data-test-id="button_attach_files"]').first().click()]);
const n0=s.writes.length; await fc.setFiles(FILE); await p.waitForTimeout(5000);
console.log('attach writes',JSON.stringify(s.writes.slice(n0).map(w=>w.slice(0,120))));
const cb=p.locator('[data-test-id^="checkbox_attachment_for_customer_"]').last(); console.log('for-customer boxes',await p.locator('[data-test-id^="checkbox_attachment_for_customer_"]').count());
const n1=s.writes.length; await cb.click(); await p.waitForTimeout(2500); console.log('tick writes',JSON.stringify(s.writes.slice(n1).map(w=>w.slice(0,140))));
await shot('1-note-for-customer');
await p.locator('.q-tab, a, [role=tab]',{hasText:/^Finance$/}).first().click(); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_send_email"]').first().click(); await p.waitForTimeout(2500);
await p.locator('.q-dialog [data-test-id="checkbox_include_customer_attachments"]').click(); await p.waitForTimeout(500);
const ec=p.locator('.q-dialog [data-test-id="input_email_content"]'); if(await ec.count()){ await ec.click(); await ec.fill('ZZAUTOTEST SV12299 E - For Customer attachment ticked'); }
await shot('2-send-dialog');
const n2=s.writes.length; await p.locator('.q-dialog [data-test-id="button_send_email"]').last().click(); await p.waitForTimeout(7000);
console.log('send writes',JSON.stringify(s.writes.slice(n2).map(w=>w.slice(0,140)))); await shot('3-after-send');
await s.close(); process.exit(0);
