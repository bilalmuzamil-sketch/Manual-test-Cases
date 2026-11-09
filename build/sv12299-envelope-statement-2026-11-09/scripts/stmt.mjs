// node stmt.mjs -> production: customer page -> invoices/transactions tab -> Statement Download + Send Email; screenshots + file name
import {sess,load} from './common.mjs'; import fs from 'fs';
const S=load(); const CID='164013e0-2148-402e-b0e2-4f9390b72c29';
const s=await sess({acceptDownloads:true}); const p=s.page; await s.go('/customers/'+CID); await p.waitForTimeout(4000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-tab, a.q-tab, [role=tab]')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(Boolean));
console.log('url',p.url(),'tabs',JSON.stringify(tabs));
const t=p.locator('.q-tab, [role=tab]',{hasText:/Invoices|Transactions/}).first(); if(await t.count()){ await t.click(); await p.waitForTimeout(3500); }
console.log('url2',p.url()); const acts=await p.evaluate(()=>[...document.querySelectorAll('button[aria-label]')].map(b=>b.getAttribute('aria-label')).filter(a=>/Download|Send Email|Print/.test(a)));
console.log('actions',JSON.stringify(acts)); await p.screenshot({path:'/tmp/qa12299/S-1-customer-invoices.png'});
const [dl]=await Promise.all([p.waitForEvent('download',{timeout:20000}).catch(()=>null), p.locator('button[aria-label="Download"]').first().click()]);
if(dl){ const n=dl.suggestedFilename(); await dl.saveAs('/tmp/qa12299/S-download.pdf'); console.log('download name',n); }
await p.locator('button[aria-label="Send Email"]').first().click(); await p.waitForTimeout(2500);
console.log('dialog',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,400)));
await p.screenshot({path:'/tmp/qa12299/S-2-send-dialog.png'});
const n0=s.writes.length; const send=p.locator('.q-dialog button',{hasText:'Send Email'}); await send.last().click(); await p.waitForTimeout(5000);
console.log('writes',JSON.stringify(s.writes.slice(n0).map(w=>w.slice(0,160)))); await p.screenshot({path:'/tmp/qa12299/S-3-after-send.png'});
await s.close(); process.exit(0);
