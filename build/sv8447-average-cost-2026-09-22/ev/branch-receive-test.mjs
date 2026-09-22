import {boot} from '/tmp/sv9940/boot.mjs';
const PART='ecaae871-ee9f-4442-a891-b1443f22db7e';
const ORDER='7d1492a8-a395-4bc0-9413-a28f9721fc28';
const {b,p,reqs}=await boot('/parts/inventory',{width:2400,height:1200});
async function findRow(){ return await p.evaluate((id)=>{
  const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`); if(!el) return null;
  const tr=el.closest('tr'); const tds=[...tr.querySelectorAll('td')];
  const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
  return {avg:tds[hs.findIndex(h=>/Average Cost/i.test(h))].innerText.trim(),
          qty:tds[hs.findIndex(h=>/Total Quantity/i.test(h))].innerText.trim(),
          pn:tds[hs.findIndex(h=>/Part Number/i.test(h))].innerText.trim()};},PART); }
async function search(){ // make sure the part is on screen
  await p.goto('https://sv9940.qa.shopview.com/parts/inventory?search=CS-RB-268',{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(11000); }
async function openDlg(){ const h=await p.$(`[data-test-id="button_part_history_${PART}"]`); const hb=await h.boundingBox();
  await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(5500); }
async function save(){ const s=await p.$('[data-test-id="button_confirm_dialog"]'); const sb=await s.boundingBox();
  await p.mouse.click(sb.x+sb.width/2, sb.y+sb.height/2); await p.waitForTimeout(7000); }

await search(); console.log('BEFORE            :', JSON.stringify(await findRow()));
await openDlg(); await p.fill('[data-test-id="input_average_cost"]','3896.04'); await p.waitForTimeout(700); await save();
await search(); const pre=await findRow(); console.log('AFTER setting cost:', JSON.stringify(pre));
await p.screenshot({path:'/tmp/sv8447/r1-cost-set.png'});

// receive the purchase order
await p.goto(`https://sv9940.qa.shopview.com/order/${ORDER}?receive=1`,{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(12000);
await p.fill(`[data-test-id="input_invoice_${ORDER}"]`,'ZZAUTOTEST8447').catch(e=>console.log('invoice fill err',e.message));
await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/sv8447/r2-receive-screen.png'});
const btn=await p.$(`[data-test-id="button_receive_po_${ORDER}"]`);
if(btn){ const bb=await btn.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(12000);
  console.log('receive clicked; url now', p.url()); } else console.log('NO RECEIVE BUTTON');

await search(); const post=await findRow();
console.log('AFTER RECEIVING   :', JSON.stringify(post));
await p.screenshot({path:'/tmp/sv8447/r3-after-receive.png'});
await b.close();
console.log('--- non-GET calls ---');
reqs.filter(r=>/accept|receive|parts\/change/.test(r)).forEach(r=>console.log('  ',r.slice(0,200)));
