import {boot} from '/tmp/prod9940/boot.mjs';
import fs from 'fs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p,reqs}=await boot('/parts/inventory');
const geo=[];
async function snap(tag,file){
  await p.waitForTimeout(1500);
  const r=await p.evaluate((id)=>{
    const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`); if(!el) return null;
    const tr=el.closest('tr'); const tds=[...tr.querySelectorAll('td')];
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    const ai=hs.findIndex(h=>/Average Cost/i.test(h));
    const c=tds[ai]?tds[ai].getBoundingClientRect():null;
    return {avg: tds[ai]?tds[ai].innerText.trim():null, cells:tds.map(t=>t.innerText.trim()),
            box: c?{x:c.x,y:c.y,w:c.width,h:c.height}:null,
            rowbox: (()=>{const q=tr.getBoundingClientRect();return{x:q.x,y:q.y,w:q.width,h:q.height};})()};
  }, ID);
  console.log(tag,'AVG COST ON LIST =', r&&r.avg, '| min/max:', r&&r.cells.slice(-3,-1).join('/'));
  await p.screenshot({path:'/tmp/sv8447/'+file});
  geo.push({tag,file,...r});
  return r;
}
async function openDlg(){
  const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5500);
}
async function save(){
  const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(8000);
}
async function reload(){ await p.reload({waitUntil:'commit'}); await p.waitForTimeout(15000); }

await snap('[0] baseline            ','p0-baseline.png');
// step 1: set the reported value
await openDlg(); await p.fill('[data-test-id="input_average_cost"]','3896.04'); await p.waitForTimeout(700); await save();
await reload();
await snap('[1] after setting 3896.04','p1-set.png');
// step 2: one unrelated save (change Min)
await openDlg(); await p.fill('[data-test-id="input_min"]','4'); await p.waitForTimeout(700); await save();
await reload();
await snap('[2] after unrelated save','p2-broken.png');
fs.writeFileSync('/tmp/sv8447/prod-geo.json', JSON.stringify(geo,null,1));
await b.close();
console.log('--- purchasePrice in each save payload ---');
reqs.filter(r=>/parts\/change/.test(r)).forEach((r,i)=>console.log(' save#'+(i+1), (r.match(/"purchasePrice":[^,]+/)||['(none)'])[0]));
