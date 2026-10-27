// node ed2.mjs <tag> <pn> <mode: man|desc> <typed JSON>
import {sess} from './lib.mjs'; import fs from 'fs';
const [tag,pn,mode,typedJ]=process.argv.slice(2); const typed=JSON.parse(typedJ||'""');
const s=await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page; const out={tag,pn,mode,typed};
const list=async()=>Object.values((await s.api('/api/parts-catalogue/manufacturers')).json?.data||{}).find(Array.isArray)||[];
const getPart=async()=>{const p=await s.api(`/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=5&pagination[page]=1&search=${encodeURIComponent(pn)}`); return (Object.values(p.json.data).find(Array.isArray)||[]).find(x=>x.part_number===pn);};
const part=await getPart(); out.before={name:part.name,manufacturer:part.manufacturer_name,mid:part.manufacturer_id}; out.total_before=(await list()).length;
await s.go('/parts-catalogue/'+part.id); await P.waitForTimeout(3000);
const detailText=async()=>P.evaluate(()=>document.querySelector('.q-page, main')?.innerText.replace(/\n+/g,' | ').slice(0,400));
out.detail_before=await detailText(); await P.screenshot({path:`../ev/${tag}-1-detail-before.png`});
let b=await s.box('button_edit_catalogue_part'); await P.mouse.click(b.x,b.y); await s.waitFor('select_catalogue_part_manufacturer'); await P.waitForTimeout(800);
out.dialog_title=await P.evaluate(()=>document.querySelector('[data-test-id="dialog_title"]')?.innerText);
const writes=[]; P.on('request',q=>{if(q.method()!=='GET'&&/parts-catalogue/.test(q.url())) writes.push(q.url().split('/api')[1]+' :: '+q.postData());});
P.on('response',async r=>{if(r.request().method()!=='GET'&&/parts-catalogue/.test(r.url())) writes.push('-> '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,150));});
if(mode==='man'){ const m=P.locator('input[data-test-id="select_catalogue_part_manufacturer"]');
  // clear the current value: click into the field and use the clear icon or backspace
  await m.click(); await P.waitForTimeout(400); await P.keyboard.press('Control+A'); await P.keyboard.press('Backspace'); await P.keyboard.press('Backspace'); await P.waitForTimeout(400);
  out.field_cleared=await P.evaluate(()=>{const i=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]'); return i.closest('.q-field').innerText.replace(/\n/g,' | ')+' || input='+i.value;});
  await P.keyboard.type(typed,{delay:70}); await P.waitForTimeout(1500); await P.keyboard.press('Tab'); await P.waitForTimeout(1200); }
else { const n=P.locator('[data-test-id="input_catalogue_part_name"] input, input[data-test-id="input_catalogue_part_name"]').first(); await n.fill(part.name+' (edited)'); await P.waitForTimeout(400); }
out.field_shows=await P.evaluate(()=>{const i=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]'); return i.closest('.q-field').innerText.replace(/\n/g,' | ')+' || input='+i.value;});
out.field_box=await P.evaluate(()=>{const r=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]').closest('.q-field').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
await P.screenshot({path:`../ev/${tag}-2-dialog.png`});
b=await s.box('button_confirm_dialog'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(3000); out.writes=writes;
await P.reload(); await P.waitForTimeout(3500); out.detail_after=await detailText(); await P.screenshot({path:`../ev/${tag}-3-detail-after.png`});
const p2=await getPart(); out.after={name:p2.name,manufacturer:p2.manufacturer_name,mid:p2.manufacturer_id}; out.total_after=(await list()).length;
console.log(JSON.stringify(out,null,1).slice(0,3000)); fs.writeFileSync(`../data/${tag}.json`,JSON.stringify(out,null,1));
await s.browser.close(); process.exit(0);
