import {boot} from '/tmp/prod9940/boot.mjs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p,reqs}=await boot('/parts/inventory',{width:2560,height:1200});
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5000); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(7000); }
async function reload(){ await p.reload({waitUntil:'commit'}); await p.waitForTimeout(13000); }
async function avg(){ return await p.evaluate((id)=>{const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
  const tds=[...el.closest('tr').querySelectorAll('td')];
  const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
  return tds[hs.findIndex(h=>/Average Cost/i.test(h))].innerText.trim();},ID); }

const VALUES=['999.99','1000.00','1234.56','3896.04','12345.67'];
let minToggle=4;
for(const v of VALUES){
  await openDlg(); await p.fill('[data-test-id="input_average_cost"]',v); await p.waitForTimeout(600); await save();
  await reload(); const a1=await avg();
  minToggle = minToggle===4?5:4;
  await openDlg(); await p.fill('[data-test-id="input_min"]',String(minToggle)); await p.waitForTimeout(600); await save();
  await reload(); const a2=await avg();
  console.log(`entered ${v.padEnd(9)} -> after save: ${a1.padEnd(12)} | after an UNRELATED save: ${a2.padEnd(12)} | ${a1===a2?'SURVIVES':'*** CHANGED ***'}`);
}
// restore
await openDlg(); await p.fill('[data-test-id="input_average_cost"]','10.00');
await p.fill('[data-test-id="input_min"]','5'); await p.fill('[data-test-id="input_max"]','6'); await p.waitForTimeout(600); await save();
await reload();
await openDlg(); await p.fill('[data-test-id="input_sell_price"]','300.00'); await p.waitForTimeout(600); await save();
await reload();
const fin=await p.evaluate((id)=>{const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
  return [...el.closest('tr').querySelectorAll('td')].map(t=>t.innerText.trim());},ID);
console.log('RESTORED ROW:', JSON.stringify([fin[9],fin[11],fin[12],fin[13]]));
await b.close();
console.log('--- purchasePrice sent on each save ---');
reqs.filter(r=>/parts\/change/.test(r)).forEach((r,i)=>{const m=r.match(/"purchasePrice":("[^"]*"|[^,}]+)/); console.log('  save#'+String(i+1).padStart(2),m?m[1]:'-');});
