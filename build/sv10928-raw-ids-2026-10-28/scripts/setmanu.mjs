// node setmanu.mjs <env> <catalog|po> [id] — on screen: open Edit Catalog Part / Edit Order Item, pick a manufacturer, Save
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,kind,id0]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const posts=[]; p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\//.test(r.url())) posts.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.request().postData()||'').slice(0,300)+' => '+(await r.text().catch(()=>'')).slice(0,150)); });
let id=id0;
if(kind==='catalog'){ if(!id){ const r=await s.api('/api/parts-catalogue/catalogue-parts?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=1&search='); id=r.json.data.collection[0].id; }
  await s.go('/parts-catalogue/'+id); await p.waitForTimeout(6000); await p.locator('[data-test-id="button_edit_catalogue_part"]').click(); }
else { if(!id){ const r=await s.api('/api/inventory/orders?limit=100'); const L=r.json?.data?.orders||r.json?.data?.collection||r.json?.data; const o=(Array.isArray(L)?L:[]).find(o=>!o.workOrderId&&o.status!=='fulfilled'); id=o.id; }
  await s.go('/order/'+id); await p.waitForTimeout(6000); await p.locator('[data-test-id^="button_edit_order_item_"]').first().click(); }
await p.waitForTimeout(2500);
const sel=kind==='catalog'?p.locator('.q-dialog .q-field',{hasText:'Manufacturer'}).first():p.locator('[data-test-id="select_order_item_manufacturer"]');
await sel.click(); await p.waitForTimeout(1500);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())); console.log('options',opts.length,opts.slice(0,5).join(' | '));
await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(800);
console.log('picked',(await sel.innerText()).replace(/\s+/g,' '));
await p.locator(kind==='catalog'?'.q-dialog button:has-text("Save")':'[data-test-id="button_save_order_item"]').first().click(); await p.waitForTimeout(4000);
console.log('id',id); console.log(posts.join('\n')); await s.close(); process.exit(0);
