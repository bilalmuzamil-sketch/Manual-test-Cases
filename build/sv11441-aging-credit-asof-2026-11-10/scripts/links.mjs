// screen: open documents from the reports (work order from A/R Collection, bill from A/P Unpaid) to see those pages open as before
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const R={};
await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(7000);
await p.locator('[data-test-id$="_toggle_4255e024-938c-4514-83d9-95f1a0a7f324"]').first().click().catch(e=>R.t1=e.message.slice(0,80)); await p.waitForTimeout(3000);
const wo=p.locator('tbody a',{hasText:'S2-16654'}).first(); R.woLink=await wo.count(); if(R.woLink){ await wo.click(); await p.waitForTimeout(7000); R.woUrl=p.url(); R.woTitle=(await p.evaluate(()=>document.body.innerText)).match(/S2-16654[^\n]*/)?.[0]; await p.screenshot({path:'../ev/link-wo.png'}); }
await s.go('/reports/ap-unpaid-invoices?vendorIds=98c705a1-ba42-42c1-b291-303deb797d3b'); await p.waitForTimeout(7000);
const first=p.locator('[data-test-id$="_toggle_98c705a1-ba42-42c1-b291-303deb797d3b"]').first(); await first.click().catch(()=>{}); await p.waitForTimeout(3000);
const bill=p.locator('tbody a',{hasText:'5956'}).first(); R.billLink=await bill.count(); if(R.billLink){ R.billText=await bill.innerText(); await bill.click(); await p.waitForTimeout(7000); R.billUrl=p.url(); R.billPage=(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,160); await p.screenshot({path:'../ev/link-bill.png'}); }
R.errors=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\n/g,' ')));
console.log(JSON.stringify(R,null,1)); await s.close(); process.exit(0);
