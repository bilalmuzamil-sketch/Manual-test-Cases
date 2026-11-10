// production: (1) WO S2-1944 Finance envelope hover tooltip (comparison shot); (2) customer Invoices tab: tick ONLY S2-1945 -> envelope -> dialog -> Send; capture statement requests + PDF text
import {sess,j} from './common.mjs'; import fs from 'fs'; import {execSync} from 'child_process';
const NAME='ZZAUTOTEST SV12299 Charge Account'; const D='/tmp/qa12299/walk/'; const log=[]; const L=x=>{log.push(x);console.log(x);};
const s=await sess(); const p=s.page; const reqs=[];
p.on('request',r=>{const u=r.url(); if(/statement|transactions-mail|customer-account/.test(u)) reqs.push(`${r.method()} ${u.replace('https://api.shopview.com','')} ${(r.postData()||'').slice(0,300)}`);});
L('marker '+JSON.stringify(await s.marker()));
await s.go('/workorders/a53ff202-d342-4f00-85cb-191bf7583c2f/finance'); await p.waitForTimeout(4500);
const env=p.locator('[data-test-id="button_send_email"]').first(); await env.hover(); await p.waitForTimeout(1200);
L('wo tooltip '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText.trim()))));
L('wo envelope box '+j(await env.boundingBox())); await p.screenshot({path:D+'C-01-wo-envelope-hover.png'});
await s.go('/customers'); await p.waitForTimeout(3000); await p.locator('[data-test-id="page_search_toggle"]').first().click(); await p.keyboard.type(NAME,{delay:15}); await p.waitForTimeout(2500);
await p.locator('tr',{hasText:NAME}).first().click(); await p.waitForTimeout(3500); await p.locator('.q-tab',{hasText:/^Invoices/}).first().click(); await p.waitForTimeout(3500);
const row=p.locator('tbody tr',{hasText:'S2-1945'}).first(); await row.locator('.q-checkbox').first().click(); await p.waitForTimeout(800);
L('ticked rows '+await p.locator('tbody .q-checkbox[aria-checked="true"]').count()); await p.screenshot({path:D+'C-02-one-ticked.png'});
reqs.length=0; await p.locator('button[aria-label="Send Email"]').first().click(); await p.waitForTimeout(3000);
L('dialog '+(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)))); await p.screenshot({path:D+'C-03-dialog-one-ticked.png'});
L('requests on open '+j(reqs)); reqs.length=0;
await p.locator('.q-dialog button',{hasText:'Send Email'}).last().click(); await p.waitForTimeout(7000);
L('requests on send '+j(reqs)); L('sent at '+new Date().toISOString());
for(const q of [...new Set(reqs.filter(x=>x.startsWith('GET')&&/statement/.test(x)).map(x=>x.split(' ')[1]))]){
  const r=await p.evaluate(async u=>{const res=await fetch('https://api.shopview.com'+u,{credentials:'include'}); const b=new Uint8Array(await res.arrayBuffer()); return {st:res.status,b:Array.from(b)}},q).catch(e=>({st:'ERR '+e.message,b:[]}));
  L('fetch '+q+' -> '+r.st+' bytes '+r.b.length); if(r.b.length){ fs.writeFileSync(D+'C-statement.pdf',Buffer.from(r.b)); try{ L('pdf text: '+execSync(`pdftotext -layout ${D}C-statement.pdf - | tr -s ' ' | head -40`).toString().replace(/\n/g,' | ')); }catch(e){L('pdftotext err')} }
}
fs.writeFileSync(D+'C-log.txt',log.join('\n')+'\n'); await s.close(); process.exit(0);
