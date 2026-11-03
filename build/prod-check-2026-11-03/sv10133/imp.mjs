// production Settings > Imports > Invoices: Select CSV File -> Import Invoices; prints messages + request/response. node imp.mjs <file> <tag>
import {prod} from '../common.mjs'; import fs from 'fs'; const [file,tag]=process.argv.slice(2); const s=await prod('/tmp/qa73'); const p=s.page; const resp=[];
p.on('response',async r=>{ if(/\/api\/imports/.test(r.url())&&r.request().method()!=='GET') resp.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' => '+(await r.text().catch(()=>'')).slice(0,600)); });
await s.go('/administration/invoices-import'); await p.waitForTimeout(4000);
await p.locator('input[type=file]').first().setInputFiles(file); await p.waitForTimeout(3000);
const txt=()=>p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,900));
const toasts=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
console.log('SELECTED',(await txt()).slice(0,500)); console.log('TOASTS1',JSON.stringify(await toasts())); await p.screenshot({path:`ev-${tag}-1-selected.png`,fullPage:true});
const ib=p.locator('[data-test-id="button_import_invoices"]'); const en=await ib.isEnabled(); console.log('import enabled',en);
if(en){ await ib.click(); await p.waitForTimeout(6000); console.log('TOASTS2',JSON.stringify(await toasts())); console.log('AFTER',(await txt()).slice(0,500)); await p.screenshot({path:`ev-${tag}-2-after.png`,fullPage:true}); }
console.log('REQ '+resp.join(' || ')); await s.close(); process.exit(0);
