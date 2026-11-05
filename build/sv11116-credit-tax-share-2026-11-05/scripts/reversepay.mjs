// usage: node reversepay.mjs <tag> -> Customer > Payments tab: first payment row bin (button_remove_payment_*) > dialog > Reverse (button_confirm_dialog), re-reads the dialog for a 2nd confirm (Rule 102); prints dialogs + writes
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:2}); const p=s.page;
await s.go(`/customers/${S.company}/payments`); await p.waitForTimeout(5000); const n=s.writes.length;
await p.locator('[data-test-id^="button_remove_payment_"]').first().click(); await p.waitForTimeout(1500);
for(let k=0;k<3;k++){ const t=(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,250); console.log('DLG',k,t); const c=p.locator('.q-dialog [data-test-id="button_confirm_dialog"], .q-dialog button').filter({hasText:/^(Reverse|Yes|Are You Sure\?|Confirm)$/i}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(2500);} else break; }
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,300)))); await s.close(); process.exit(0);
