// usage: node csv.mjs <outName> -> Sales Tax report > Export, saves download to ../ev/<outName> and prints header + rows (first 8)
import {sess} from './common.mjs'; import fs from 'fs'; const [OUT]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
await p.locator('[data-test-id="export_sales_tax_report"]').click(); await p.waitForTimeout(1500);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [data-test-id]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.trim()).join(' | ')); console.log('MENU',items);
let dl=null; const it=p.locator('.q-menu .q-item').filter({hasText:/csv/i}).first(); if(await it.count()){ [dl]=await Promise.all([p.waitForEvent('download',{timeout:20000}).catch(()=>null), it.click()]); } else { await p.keyboard.press('Escape'); [dl]=await Promise.all([p.waitForEvent('download',{timeout:20000}).catch(()=>null), p.locator('[data-test-id="export_sales_tax_report"]').click()]); } console.log('DIALOG',(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300));
if(dl){ const f='../ev/'+OUT; await dl.saveAs(f); const t=fs.readFileSync(f,'utf8'); console.log('FILE',dl.suggestedFilename(),t.length); console.log(t.split('\n').slice(0,8).join('\n')); } else console.log('no download');
await s.close(); process.exit(0);
