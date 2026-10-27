// node np.mjs <tag> <description> <partNumber> <typed text (JSON string)> <how: tab|clickdesc|pick|fasttab|pickexisting>
import {sess} from './lib.mjs'; import {sess2} from './lib2.mjs'; import fs from 'fs';
const [tag,desc,pn,typedJ,how]=process.argv.slice(2); const typed=JSON.parse(typedJ);
const s=process.env.ORG2? await sess2({vp:{width:1400,height:950},dpr:2}) : await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page; const out={tag,desc,pn,typed,how};
const norm=x=>String(x??'').trim().toLowerCase().replace(/\s+/g,' ');
const list=async()=>Object.values((await s.api('/api/parts-catalogue/manufacturers')).json?.data||{}).find(Array.isArray)||[];
const before=await list(); out.before_total=before.length;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(2500);
let b=await s.box('button_new_catalog_part'); await P.mouse.click(b.x,b.y); await s.waitFor('input_catalogue_part_name');
await P.locator('[data-test-id="input_catalogue_part_name"] input, input[data-test-id="input_catalogue_part_name"]').first().fill(desc);
await P.locator('[data-test-id="input_catalogue_part_number"] input, input[data-test-id="input_catalogue_part_number"]').first().fill(pn);
const man=P.locator('input[data-test-id="select_catalogue_part_manufacturer"]').first(); await man.click(); await P.waitForTimeout(500);
const tabAfter=how.startsWith('tabafter:')?+how.split(':')[1]:null; const pasteAfter=how.startsWith('paste:')?+how.split(':')[1]:null;
if(pasteAfter!==null){ await P.keyboard.insertText(typed); if(pasteAfter) await P.waitForTimeout(pasteAfter); await P.keyboard.press('Tab'); } else
await P.keyboard.type(typed,{delay:how==='fasttab'?0:(tabAfter!==null?60:70)});
if(how==='fasttab'){ await P.keyboard.press('Tab'); }
else if(tabAfter!==null){ if(tabAfter) await P.waitForTimeout(tabAfter); await P.keyboard.press('Tab'); }
else { await P.waitForTimeout(1500); out.options=await P.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')).slice(0,6));
  await P.screenshot({path:`../ev/${tag}-1-typed.png`});
  if(how==='tab') await P.keyboard.press('Tab');
  else if(how==='clickdesc') await P.locator('[data-test-id="input_catalogue_part_name"] input, input[data-test-id="input_catalogue_part_name"]').first().click();
  else if(how==='pick'||how==='pickexisting') await P.locator('.q-menu .q-item').filter({hasText:typed.trim()}).first().click(); }
await P.waitForTimeout(1200);
out.field_shows=await P.evaluate(()=>{const i=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]'); const f=i.closest('.q-field'); return (f.innerText||'').replace(/\n/g,' | ')+' || input='+i.value;});
const mb=await P.evaluate(()=>{const r=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]').closest('.q-field').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); out.field_box=mb; await P.screenshot({path:`../ev/${tag}-2-after-leave.png`});
const writes=[]; P.on('request',q=>{if(q.method()!=='GET'&&/parts-catalogue/.test(q.url())) writes.push(q.url().split('/api')[1]+' :: '+q.postData());});
P.on('response',async r=>{if(r.request().method()!=='GET'&&/parts-catalogue/.test(r.url())) writes.push('-> '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,200));});
b=await s.box('button_confirm_dialog'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(3000); out.writes=writes;
out.dialog_open_after_save=await P.evaluate(()=>!!document.querySelector('.q-dialog'));
const after=await list(); out.after_total=after.length;
const k=norm(typed)||'(blank)'; out.matching_after=after.filter(m=>norm(m.label)===norm(typed)).map(m=>m.label+' '+m.value.slice(0,8)); out.blank_after=after.filter(m=>norm(m.label)==='').length;
const p=await s.api(`/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=5&pagination[page]=1&search=${encodeURIComponent(pn)}`); const rows=Object.values(p.json?.data||{}).find(Array.isArray)||[];
out.part=rows.filter(x=>JSON.stringify(x).includes(pn)).map(x=>({pn:x.part_number??x.partNumber, manufacturer:x.manufacturer??x.manufacturer_name??x.manufacturerName, mid:x.manufacturer_id}));
console.log(JSON.stringify(out,null,1).slice(0,2500)); fs.writeFileSync(`../data/${tag}.json`,JSON.stringify(out,null,1));
await s.browser.close(); process.exit(0);
