// production: invoices import page text (column list) + template download + location name
import {prod} from '../common.mjs'; import fs from 'fs'; const s=await prod('/tmp/qa73'); const p=s.page;
await s.go('/administration/invoices-import'); await p.waitForTimeout(5000);
const t=await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,2500)); console.log('PAGE',t);
console.log('IDS',(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,25)).filter(x=>/import|template|sample|download|file/i.test(x)))).join(' | '));
await p.screenshot({path:'01-import-page.png',fullPage:true});
const dl=p.locator('[data-test-id*="template"], [data-test-id*="sample"], a:has-text("template"), button:has-text("Template"), a:has-text("Sample"), button:has-text("Download")').first();
if(false&&await dl.count()){ const [d]=await Promise.all([p.waitForEvent('download',{timeout:20000}),dl.click()]); await d.saveAs('template.csv'); console.log('TEMPLATE',d.suggestedFilename()); console.log(fs.readFileSync('template.csv','utf8').split('\n').slice(0,2).join('\n')); }
console.log('LOC',(await p.locator('[data-test-id="profile_menu_button"]').innerText()).replace(/\s+/g,' '));
await s.close(); process.exit(0);
