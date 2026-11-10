// Route B re-walk, production, screen only: customer Invoices tab -> Download statement -> WO S2-1944 Notes -> attach that file -> For Customer -> Finance -> envelope -> Include For Customer -> Send
import {sess,j} from './common.mjs'; import fs from 'fs';
const NAME='ZZAUTOTEST SV12299 Charge Account', WON='S2-1944'; const D='/tmp/qa12299/walk/'; const log=[]; const L=x=>{log.push(x);console.log(x);};
const s=await sess({acceptDownloads:true}); const p=s.page; const shot=async n=>p.screenshot({path:D+'B-'+n+'.png'});
const ctl=sel=>p.evaluate(sel=>[...document.querySelectorAll(sel)].filter(e=>e.offsetParent).map(e=>`${e.tagName}|${e.getAttribute('data-test-id')||''}|${e.getAttribute('aria-label')||''}|${(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,50)}`),sel);
L('marker '+JSON.stringify(await s.marker()));
// 1. download statement
await s.go('/customers'); await p.waitForTimeout(3000); await p.locator('[data-test-id="page_search_toggle"]').first().click(); await p.keyboard.type(NAME,{delay:15}); await p.waitForTimeout(2500);
await p.locator('tr',{hasText:NAME}).first().click(); await p.waitForTimeout(3500); await p.locator('.q-tab',{hasText:/^Invoices/}).first().click(); await p.waitForTimeout(3500);
const dlb=p.locator('button[aria-label="Download"]').first(); await dlb.hover(); await p.waitForTimeout(1000); L('download tooltip '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText.trim())))); await shot('01-hover-download');
const [dl]=await Promise.all([p.waitForEvent('download',{timeout:30000}).catch(()=>null), dlb.click()]);
const fname=dl?dl.suggestedFilename():null; L('downloaded file name '+fname); const FILE=D+fname; if(dl) await dl.saveAs(FILE);
await p.waitForTimeout(1500); L('after download dialogs '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)))));
// 2. open work order from the Work Orders list
await s.go('/workorders'); await p.waitForTimeout(3500); await p.locator('[data-test-id="page_search_toggle"]').first().click().catch(()=>{}); await p.keyboard.type(WON,{delay:20}); await p.waitForTimeout(3000); await shot('02-wo-search');
await p.locator('tr, .q-card',{hasText:WON}).first().click(); await p.waitForTimeout(4000); L('wo url '+p.url());
L('wo tabs '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))));
L('wo status text '+j(await p.evaluate(()=>(document.body.innerText.match(/\b(Invoiced|Complete|Paid|Approved|In Progress)\b/g)||[]).slice(0,5))));
await p.locator('[data-test-id="link_notes_tab"]').first().click(); await p.waitForTimeout(3000); await shot('03-notes-tab');
L('notes controls '+j(await ctl('main button, main [data-test-id^="checkbox_attachment"], main .q-checkbox')).slice(0,1500));
L('existing for-customer boxes '+await p.locator('[data-test-id^="checkbox_attachment_for_customer_"]').count());
const ab=p.locator('[data-test-id="button_attach_files"]').first(); await ab.hover(); await p.waitForTimeout(900); L('attach tooltip '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText.trim()))));
const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:15000}), ab.click()]); const n0=s.writes.length; await fc.setFiles(FILE); await p.waitForTimeout(6000);
L('attach writes '+j(s.writes.slice(n0).map(w=>w.slice(0,160)))); await shot('04-attached');
const boxes=p.locator('[data-test-id^="checkbox_attachment_for_customer_"]'); const nb=await boxes.count(); L('for-customer boxes now '+nb);
const lab=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="checkbox_attachment_for_customer_"]')].map(e=>`${e.getAttribute('aria-label')||''}|${(e.innerText||'').trim()}|${e.getAttribute('aria-checked')}|${(e.closest('.q-item,.row,div')?.innerText||'').replace(/\s+/g,' ').slice(0,120)}`)); L('box labels '+j(lab));
const n1=s.writes.length; await boxes.last().click(); await p.waitForTimeout(3000); L('tick writes '+j(s.writes.slice(n1).map(w=>w.slice(0,160)))); await shot('05-for-customer-ticked');
// 3. Finance -> envelope -> include -> send
await p.locator('.q-tab',{hasText:/^Finance/}).first().click(); await p.waitForTimeout(4500); await shot('06-finance');
const env=p.locator('[data-test-id="button_send_email"]').first(); await env.hover(); await p.waitForTimeout(1000); L('envelope tooltip '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText.trim()))));
await env.click(); await p.waitForTimeout(3000); L('dialog '+(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,800))));
L('dialog controls '+j(await ctl('.q-dialog button, .q-dialog .q-checkbox, .q-dialog .q-toggle')).slice(0,1200)); await shot('07-dialog');
const inc=p.locator('.q-dialog [data-test-id="checkbox_include_customer_attachments"]'); L('include box state before '+await inc.getAttribute('aria-checked')); await inc.click(); await p.waitForTimeout(600); L('include box state after '+await inc.getAttribute('aria-checked'));
const ec=p.locator('.q-dialog [data-test-id="input_email_content"]'); if(await ec.count()){ await ec.click(); await p.keyboard.press('End'); await p.keyboard.type(' ZZAUTOTEST SV12299 re-walk route B'); }
await shot('08-include-ticked');
const n2=s.writes.length; await p.locator('.q-dialog [data-test-id="button_send_email"]').last().click(); await p.waitForTimeout(8000);
L('send writes '+j(s.writes.slice(n2).map(w=>w.slice(0,200)))); L('toasts '+j(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim())))); await shot('09-after-send'); L('sent at '+new Date().toISOString());
fs.writeFileSync(D+'B-log.txt',log.join('\n')+'\n'); await s.close(); process.exit(0);
