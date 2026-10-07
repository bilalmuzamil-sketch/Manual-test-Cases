import {ob,j} from './lib.mjs';
const [W,H]=process.argv.slice(2);
const s=await ob({vp:{width:+W,height:+H},dpr:2}); const P=s.page;
await s.go('/workorders/9027964a-0ff2-49ff-9838-172c4bb00c61/notes'); await P.waitForTimeout(1500);
const sel='[data-test-id="note_card_3aebdd5b-06fa-4b4e-8afd-935a27248ce1"] [data-test-id^="note_attachment_card_"]';
const th=P.locator(sel).first(); await th.scrollIntoViewIfNeeded(); const b=await th.boundingBox(); await P.mouse.click(b.x+30,b.y+b.height/2);
const t0=Date.now(); let r=null;
for(let i=0;i<60;i++){ r=await P.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); const im=d?.querySelector('img'); return im?{w:im.naturalWidth,complete:im.complete}:null;}); if(r&&r.w>0) break; await P.waitForTimeout(500);}
console.log(W,'viewer image',j(r),'after ms',Date.now()-t0);
await P.screenshot({path:`/tmp/qa9667b/shots/viewer-wait-${W}.png`});
await s.close();
