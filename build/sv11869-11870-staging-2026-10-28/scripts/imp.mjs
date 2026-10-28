// Settings → Invoices import: Select CSV File → (preview) → Import Invoices; prints the page messages, pop-ups and the request/response.
// Usage: ENVX=staging|prod node imp.mjs <file.csv> <shotPrefix>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [file,shot]=process.argv.slice(2); const env=process.env.ENVX||'staging'; const LOC=env==='prod'?'b617914c-16e9-4485-8e8b-193cd86aa416':'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env,ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:1000}});
const p=s.page; const resp=[]; p.on('response',async r=>{ if(/\/api\/imports/.test(r.url())&&r.request().method()!=='GET'){ resp.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' => '+(await r.text().catch(()=>'')).slice(0,1500)); } });
await s.go('/administration/settings'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); await s.go('/administration/invoices-import'); await p.waitForTimeout(4000);
await p.locator('input[type=file]').first().setInputFiles(file); await p.waitForTimeout(3000);
const txt=()=>p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,1500));
const toasts=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
const boxes=async()=>p.evaluate(()=>{ const out=[]; const want=/Line Title cannot be empty|InvoiceDate and InvoiceNumber cannot be empty|Invoices Created|Invoices Failed|imported successfully|failed to import|^(Labor|Part|Shop Supplies|Misc|Credit Memo|Sublet|shop supplies)$|Line Title|What are you doing/;
  for(const e of document.querySelectorAll('td,th,div,span,p')){ const t=(e.innerText||'').trim(); if(!t||t.length>90||!want.test(t)) continue; if([...e.children].some(c=>want.test((c.innerText||'').trim()))) continue; const r=e.getBoundingClientRect(); if(r.width<2||r.height<2) continue; out.push({t,x:Math.round(r.x+scrollX),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)}); } return out; });
console.log('AFTER SELECT',await txt()); fs.writeFileSync(shot+'-1-boxes.json',JSON.stringify(await boxes())); await p.screenshot({path:shot+'-1-selected.png',fullPage:true});
const ib=p.locator('[data-test-id="button_import_invoices"]'); console.log('import enabled',await ib.isEnabled());
if(await ib.isEnabled()){ await ib.click(); await p.waitForTimeout(6000); const d=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,800))); console.log('DIALOG',JSON.stringify(d)); console.log('TOASTS',JSON.stringify(await toasts())); console.log('AFTER IMPORT',await txt()); await p.screenshot({path:shot+'-2-after-import.png',fullPage:true}); fs.writeFileSync(shot+'-2-boxes.json',JSON.stringify(await boxes())); }
console.log('REQUESTS\n'+resp.join('\n'));
await s.close(); process.exit(0);
