// on screen: Lines tab -> tick line 1 -> bulk "more" menu -> "Split work order" clicked twice; prints the new work order
import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const X=S.X[process.env.WO]; const L=X.lines[0].id;
const s=await sess(); const p=s.page; const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/split|work-orders/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' -> '+b);} });
await s.go('/workorders/'+X.id+'/lines'); await p.waitForTimeout(8000);
await p.locator(`[data-test-id="line_number_${L}"]`).hover().catch(()=>{}); await p.waitForTimeout(500); await p.click(`[data-test-id="line_checkbox_${L}"]`); await p.waitForTimeout(1200);
await p.screenshot({path:`../ev/split-${process.env.WO}-ticked.png`});
const more=p.locator('[data-test-id="button_bulk_more"],[data-test-id="button_line_bulk_action"]').first(); await more.click(); await p.waitForTimeout(1200);
const item=p.locator('.q-menu .q-item',{hasText:'Split work order'}).first(); await item.click(); await p.waitForTimeout(1200); await p.screenshot({path:`../ev/split-${process.env.WO}-armed.png`}); await item.click(); await p.waitForTimeout(6000);
console.log('url',p.url()); await p.screenshot({path:`../ev/split-${process.env.WO}-after.png`});
const v=await s.api('/api/work-orders/view/'+p.url().split('/workorders/')[1]?.split('/')[0]); const w=v.json?.data?.work_order||v.json?.data; console.log('new number',w?.display_number||w?.number);
X.splitTo={id:p.url().split('/workorders/')[1]?.split('/')[0],number:w?.display_number||w?.number}; fs.writeFileSync('/tmp/sv12193/seed-branch.json',JSON.stringify(S,null,1));
console.log(caps.filter(c=>/split/i.test(c)).join('\n')||caps.slice(-3).join('\n')); await s.close(); process.exit(0);
