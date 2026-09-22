import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const ID='000657fe-522f-4c3f-9680-621c5449e2bd';
const {b,p}=await boot('/parts/inventory',{width:2560,height:1200});
const geo=[];
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5500); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(7500); }
async function reload(){ await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(12000); }
async function snap(tag,file){
  const r=await p.evaluate((id)=>{
    const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
    const tr=el.closest('tr'); const tds=[...tr.querySelectorAll('td')];
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    const ai=hs.findIndex(h=>/Average Cost/i.test(h)), pi=hs.findIndex(h=>/Part Number/i.test(h)), mi=hs.findIndex(h=>/^Min$/i.test(h));
    const bx=e=>{const c=e.getBoundingClientRect();return{x:c.x,y:c.y,w:c.width,h:c.height};};
    return {avg:tds[ai].innerText.trim(), pn:tds[pi].innerText.trim(), min:mi>=0?tds[mi].innerText.trim():null, avgbox:bx(tds[ai])};},ID);
  await p.screenshot({path:'/tmp/sv8447/'+file});
  console.log(tag,'| pn',r.pn,'| avg',r.avg,'| min',r.min);
  geo.push({tag,file,...r}); }

await openDlg(); await p.fill('[data-test-id="input_average_cost"]','3896.04'); await p.waitForTimeout(700); await save();
await reload(); await snap('[1] entered 3,896.04    ','x1-branch-correct.png');
await openDlg(); await p.fill('[data-test-id="input_min"]',"3"); await p.waitForTimeout(700); await save();
await reload(); await snap('[2] after unrelated save','x2-branch-still.png');
fs.writeFileSync('/tmp/sv8447/branch-geo2.json',JSON.stringify(geo,null,1));
await b.close(); console.log('DONE');
