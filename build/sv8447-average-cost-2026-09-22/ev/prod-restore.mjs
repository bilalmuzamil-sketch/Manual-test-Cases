import {boot} from '/tmp/prod9940/boot.mjs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p}=await boot('/parts/inventory');
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5500); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(8000); }
async function dlgRead(tag){ const v=await p.$$eval('input',e=>Object.fromEntries(e.filter(x=>x.getAttribute('data-test-id')).map(x=>[x.getAttribute('data-test-id'),x.value])));
  console.log(tag, JSON.stringify({cost:v.input_average_cost,sell:v.input_sell_price,core:v.input_core_charge,min:v.input_min,max:v.input_max})); }
await openDlg();
await p.fill('[data-test-id="input_average_cost"]','10.00');
await p.fill('[data-test-id="input_min"]','5');
await p.fill('[data-test-id="input_max"]','6');
await p.waitForTimeout(700); await save();
await p.reload({waitUntil:'commit'}); await p.waitForTimeout(15000);
const list=await p.evaluate((id)=>{const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
  const tr=el.closest('tr'); return [...tr.querySelectorAll('td')].map(t=>t.innerText.trim());}, ID);
console.log('LIST ROW AFTER RESTORE:', JSON.stringify(list));
await openDlg(); await dlgRead('DIALOG AFTER RESTORE:');
await p.screenshot({path:'/tmp/sv8447/p3-restored.png'});
await b.close();
