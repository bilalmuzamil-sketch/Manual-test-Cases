import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const PARTS=['3111','66432','66433','66434'];
const PO={'3111':{cost:2.97,qty:10},'66432':{cost:1.34,qty:5},'66433':{cost:2.11,qty:5},'66434':{cost:4.19,qty:5}};
const {b,p}=await boot('/parts/inventory',{width:2200,height:1200});
const out={};
for(const pn of PARTS){
  await p.goto('https://sv9940.qa.shopview.com/parts/inventory?search='+encodeURIComponent(pn),{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(9000);
  const row=await p.evaluate((pn)=>{
    const trs=[...document.querySelectorAll('tr')].filter(t=>t.querySelector('[data-test-id^="button_part_history_"]'));
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    const pi=hs.findIndex(h=>/Part Number/i.test(h)), ai=hs.findIndex(h=>/Average Cost/i.test(h)), qi=hs.findIndex(h=>/Total Quantity/i.test(h));
    for(const tr of trs){ const tds=[...tr.querySelectorAll('td')];
      if((tds[pi]||{}).innerText && tds[pi].innerText.trim()===pn)
        return {pn, avg:tds[ai].innerText.trim(), qty:tds[qi].innerText.trim(),
                btn:tr.querySelector('[data-test-id^="button_part_history_"]').getAttribute('data-test-id')}; }
    return null;},pn);
  if(!row){ console.log(pn,'NOT FOUND'); continue; }
  const h=await p.$(`[data-test-id="${row.btn}"]`); const bb=await h.boundingBox();
  await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(8000);
  const hist=await p.evaluate(()=>document.body.innerText.split('\n').filter(l=>/Received|Average cost|Cycle|Picked|Returned/.test(l)).slice(0,4));
  out[pn]={...row,hist};
  console.log(pn,'| avg',row.avg,'| qty',row.qty);
  hist.forEach(l=>console.log('      ',l.slice(0,150)));
}
fs.writeFileSync('/tmp/sv8447/formula.json',JSON.stringify(out,null,1));
await b.close(); console.log('DONE');
