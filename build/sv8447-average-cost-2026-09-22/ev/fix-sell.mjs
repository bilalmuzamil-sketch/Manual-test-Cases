import {boot} from '/tmp/prod9940/boot.mjs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p,reqs}=await boot('/parts/inventory',{width:2560,height:1200});
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(6000); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(8000); }
async function row(tag){ await p.reload({waitUntil:'commit'}); await p.waitForTimeout(15000);
  const c=await p.evaluate((id)=>{const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
    return [...el.closest('tr').querySelectorAll('td')].map(t=>t.innerText.trim());},ID);
  console.log(tag,'| avgCost',c[9],'| sell',JSON.stringify(c[11])); return c; }
// set sell price back to 300.00 only
await openDlg();
await p.fill('[data-test-id="input_sell_price"]','300.00');
await p.waitForTimeout(700); await save();
await row('AFTER setting sell 300.00 ');
await b.close();
console.log('--- payload ---');
reqs.filter(r=>/parts\/change/.test(r)).forEach(r=>{
  const g=k=>{const m=r.match(new RegExp('"'+k+'":("[^"]*"|[^,}]+)'));return m?m[1]:'-';};
  console.log('  purchasePrice=',g('purchasePrice'),' sellPrice=',g('sellPrice'),' isFixedPrice=',g('isFixedPrice'),g('is_fixed_price'));
});
