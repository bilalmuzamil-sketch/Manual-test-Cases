import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const ID='000657fe-522f-4c3f-9680-621c5449e2bd';
const {b,p,reqs}=await boot('/parts/inventory',{width:2560,height:1200});
const geo=[];
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5000); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(7000); }
async function reload(){ await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(11000); }
async function cell(){ return await p.evaluate((id)=>{
  const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`); if(!el) return null;
  const tr=el.closest('tr'); const tds=[...tr.querySelectorAll('td')];
  const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
  const ai=hs.findIndex(h=>/Average Cost/i.test(h)); const pi=hs.findIndex(h=>/Part Number/i.test(h));
  const bx=e=>{const c=e.getBoundingClientRect();return{x:c.x,y:c.y,w:c.width,h:c.height};};
  return {avg:tds[ai].innerText.trim(), pn:tds[pi].innerText.trim(), avgbox:bx(tds[ai])};},ID); }

const VALUES=['999.99','1000.00','1234.56','3896.04','12345.67'];
let t=3;
for(const v of VALUES){
  await openDlg(); await p.fill('[data-test-id="input_average_cost"]',v); await p.waitForTimeout(600); await save();
  await reload(); const a1=await cell();
  t = t===3?4:3;
  await openDlg(); await p.fill('[data-test-id="input_min"]',String(t)); await p.waitForTimeout(600); await save();
  await reload(); const a2=await cell();
  console.log(`entered ${v.padEnd(9)} -> after save: ${a1.avg.padEnd(12)} | after an UNRELATED save: ${a2.avg.padEnd(12)} | ${a1.avg===a2.avg?'SURVIVES':'*** CHANGED ***'}`);
  if(v==='3896.04'){ geo.push({tag:'branch-correct',...a1}); await p.screenshot({path:'/tmp/sv8447/b1-correct.png'});
                     geo.push({tag:'branch-after-unrelated',...a2}); await p.screenshot({path:'/tmp/sv8447/b2-still-correct.png'}); }
}
fs.writeFileSync('/tmp/sv8447/branch-geo.json',JSON.stringify(geo,null,1));
await b.close();
console.log('--- purchasePrice sent on each save ---');
reqs.filter(r=>/parts\/change/.test(r)).forEach((r,i)=>{const m=r.match(/"purchasePrice":("[^"]*"|[^,}]+)/); console.log('  save#'+String(i+1).padStart(2),m?m[1]:'-');});
