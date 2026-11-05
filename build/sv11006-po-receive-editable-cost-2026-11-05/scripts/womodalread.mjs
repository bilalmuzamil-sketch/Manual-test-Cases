// usage: node womodalread.mjs <tag> <shotdir> -> WO Lines > line right-click > Receive parts: per part, is the cost a field? (read only, nothing saved)
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,DIR]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TAG}.json`,'utf8')); const s=await sess(); const p=s.page; const OUT='../ev/'+DIR; fs.mkdirSync(OUT,{recursive:true});
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000); console.log('wo status',(await p.locator('[data-test-id="badge_wo_status"]').innerText().catch(()=>'?')));
const titles=p.locator('[data-test-id="line_title"]'); const n=await titles.count(); let opened=false;
for(let i=n-1;i>=0&&!opened;i--){ await titles.nth(i).click({button:'right'}); await p.waitForTimeout(1000); const m=p.locator(`[data-test-id="menu-item_receive_parts_${S.line}"]`); if(await m.count()){ console.log('menu text',(await m.innerText()).trim()); await m.click(); opened=true; await p.waitForTimeout(3500);} else await p.keyboard.press('Escape'); }
console.log('opened',opened); const items=S.parts.map(x=>x.order.orderItemId);
const r=await p.evaluate(ids=>ids.map(id=>{ const c=document.querySelector(`.q-dialog [data-test-id="input_cost_${id}"]`); const row=c?c.closest('tr,.row,.q-item'):null; return {id:id.slice(0,8),costInput:!!c,value:c?c.value:null,readOnly:c?(c.readOnly||c.disabled):null}; }),items);
console.log('PARTS',JSON.stringify(r)); console.log('DIALOG',(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500));
await p.screenshot({path:OUT+'/modal.png'}); await s.close(); process.exit(0);
