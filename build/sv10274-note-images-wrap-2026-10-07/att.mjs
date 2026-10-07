import fs from 'fs'; import {ob,j} from './lib.mjs';
// node att.mjs <pagePath> <noteId> <from> <to>
const [path,note,from,to]=process.argv.slice(2);
const s=await ob({vp:{width:1600,height:1000}}); const P=s.page;
await s.go(path); await P.waitForTimeout(1500);
const card=P.locator(`[data-test-id="note_card_${note}"]`); await card.scrollIntoViewIfNeeded();
let bb=await card.locator('[data-test-id="button_note_actions"]').boundingBox(); await P.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await P.waitForTimeout(900);
const files=[]; for(let i=+from;i<=+to;i++) files.push(`/tmp/qa9667b/imgs/zz10274_img${String(i).padStart(2,'0')}.png`);
const [fc]=await Promise.all([P.waitForEvent('filechooser',{timeout:15000}), (async()=>{const m=P.locator('[data-test-id="menu_item_attach_files"]'); const b=await m.boundingBox(); await P.mouse.click(b.x+b.width/2,b.y+b.height/2);})()]);
console.log('chooser multiple',fc.isMultiple());
await fc.setFiles(files); await P.waitForTimeout(2500);
const up=P.locator('.q-dialog button',{hasText:/^Upload$/}).first(); const ub=await up.boundingBox().catch(()=>null); if(ub){ await P.screenshot({path:'/tmp/qa9667b/too-many-files.png'}); console.log('clicked Upload in Too many files'); await P.mouse.click(ub.x+ub.width/2,ub.y+ub.height/2);} await P.waitForTimeout(12000);
const notif=await P.evaluate(()=>[...document.querySelectorAll('.q-notification, .q-dialog')].map(e=>e.innerText.replace(/\n+/g,' | ')).join(' || ')); console.log('notify/dialog',notif.slice(0,400));
console.log(s.writes.filter(w=>/note|attach|upload/.test(w)).map(w=>w.slice(0,140)).join('\n'));
const n=await P.evaluate(id=>document.querySelectorAll(`[data-test-id="note_card_${id}"] [data-test-id^="note_attachment_card_"]`).length,note); console.log('attachment cards on note',n);
await s.close();
