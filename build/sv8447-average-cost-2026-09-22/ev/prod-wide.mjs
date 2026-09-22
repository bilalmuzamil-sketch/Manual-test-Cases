import {boot} from '/tmp/prod9940/boot.mjs';
import fs from 'fs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p,reqs}=await boot('/parts/inventory',{width:2560,height:1200});
const geo=[];
async function snap(tag,file){
  await p.waitForTimeout(1500);
  const r=await p.evaluate((id)=>{
    const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`); if(!el) return null;
    const tr=el.closest('tr'); const tds=[...tr.querySelectorAll('td')];
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    const ai=hs.findIndex(h=>/Average Cost/i.test(h)); const pi=hs.findIndex(h=>/Part Number/i.test(h));
    const bx=e=>{const c=e.getBoundingClientRect();return{x:c.x,y:c.y,w:c.width,h:c.height};};
    const th=[...document.querySelectorAll('th')][ai];
    return {avg:tds[ai].innerText.trim(), pn:tds[pi].innerText.trim(),
            avgbox:bx(tds[ai]), pnbox:bx(tds[pi]), hdrbox:th?bx(th):null,
            cells:tds.map(t=>t.innerText.trim())};
  }, ID);
  console.log(tag,'| Part',r.pn,'| AVERAGE COST =',r.avg);
  await p.screenshot({path:'/tmp/sv8447/'+file});
  geo.push({tag,file,...r}); return r;
}
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5500); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(8000); }
async function reload(){ await p.reload({waitUntil:'commit'}); await p.waitForTimeout(15000); }

await snap('[0] baseline             ','w0-baseline.png');
await openDlg(); await p.fill('[data-test-id="input_average_cost"]','3896.04'); await p.waitForTimeout(700); await save();
await reload(); await snap('[1] entered 3,896.04     ','w1-correct.png');
await openDlg(); await p.fill('[data-test-id="input_min"]','4'); await p.waitForTimeout(700); await save();
await reload(); const bad=await snap('[2] after unrelated save ','w2-broken.png');
// RESTORE immediately in the same run
await openDlg();
await p.fill('[data-test-id="input_average_cost"]','10.00');
await p.fill('[data-test-id="input_min"]','5'); await p.fill('[data-test-id="input_max"]','6');
await p.fill('[data-test-id="input_sell_price"]','300.00');
await p.waitForTimeout(700); await save();
await reload(); await snap('[3] restored             ','w3-restored.png');
await openDlg();
const v=await p.$$eval('input',e=>Object.fromEntries(e.filter(x=>x.getAttribute('data-test-id')).map(x=>[x.getAttribute('data-test-id'),x.value])));
console.log('RESTORE DIALOG:',JSON.stringify({cost:v.input_average_cost,sell:v.input_sell_price,core:v.input_core_charge,min:v.input_min,max:v.input_max}));
fs.writeFileSync('/tmp/sv8447/prod-geo-wide.json', JSON.stringify(geo,null,1));
await b.close();
console.log('--- purchasePrice per save ---');
reqs.filter(r=>/parts\/change/.test(r)).forEach((r,i)=>{const m=r.match(/"purchasePrice":("[^"]*"|[^,}]+)/); console.log('  save#'+(i+1), m?m[1]:'(none)');});
