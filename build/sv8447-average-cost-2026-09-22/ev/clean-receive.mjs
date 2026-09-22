import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const {b,p}=await boot('/parts/orders',{width:2200,height:1200});
const ORDNUM='I9940-1390';
const found=await p.evaluate((num)=>{
  for(const tr of [...document.querySelectorAll('tr')]) if(tr.innerText.includes(num)){
    const a=[...tr.querySelectorAll('a')]; const r=a.find(x=>/receive/i.test(x.innerText))||a[0];
    return {href:r?r.getAttribute('href'):null, row:tr.innerText.replace(/\n/g,' | ')};}
  return null;},ORDNUM);
console.log('ORDER ROW:',JSON.stringify(found&&found.row).slice(0,150));
const oid=(found.href.match(/order\/([0-9a-f-]+)/)||[])[1];
await p.goto('https://sv9940.qa.shopview.com'+found.href,{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(12000);
const lines=await p.evaluate(()=>[...document.querySelectorAll('tr')].map(tr=>tr.innerText.replace(/\n/g,' | ')).filter(t=>/\$/.test(t)));
console.log('PO LINES:'); lines.forEach(l=>console.log('   ',l.slice(0,150)));
// capture each part's pre-state from the inventory page
const pns=await p.evaluate(()=>{const out=[];for(const tr of [...document.querySelectorAll('tr')]){
  const c=[...tr.querySelectorAll('td')].map(t=>t.innerText.trim()); if(c.length>3&&/^\$/.test(c[2]||'')) out.push({pn:c[0],cost:c[2],ordered:c[3]});} return out;});
console.log('PARSED LINES:',JSON.stringify(pns));
const pre={};
for(const l of pns){
  await p.goto('https://sv9940.qa.shopview.com/parts/inventory?search='+encodeURIComponent(l.pn),{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(9000);
  const r=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tr')].find(t=>t.querySelector('[data-test-id^="button_part_history_"]'));
    if(!tr) return null; const tds=[...tr.querySelectorAll('td')];
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    return {avg:tds[hs.findIndex(h=>/Average Cost/i.test(h))].innerText.trim(), qty:tds[hs.findIndex(h=>/Total Quantity/i.test(h))].innerText.trim()};});
  pre[l.pn]=r; console.log('PRE ',l.pn,JSON.stringify(r));
}
// receive
await p.goto(`https://sv9940.qa.shopview.com/order/${oid}?receive=1`,{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(12000);
await p.fill(`[data-test-id="input_invoice_${oid}"]`,'ZZAUTOTEST8447B').catch(()=>{});
await p.waitForTimeout(700);
const btn=await p.$(`[data-test-id="button_receive_po_${oid}"]`);
if(btn){const bb=await btn.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(13000);}
const post={};
for(const l of pns){
  await p.goto('https://sv9940.qa.shopview.com/parts/inventory?search='+encodeURIComponent(l.pn),{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(9000);
  const r=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tr')].find(t=>t.querySelector('[data-test-id^="button_part_history_"]'));
    if(!tr) return null; const tds=[...tr.querySelectorAll('td')];
    const hs=[...document.querySelectorAll('th')].map(h=>h.innerText.replace(/arrow_drop_(up|down)/,'').trim());
    return {avg:tds[hs.findIndex(h=>/Average Cost/i.test(h))].innerText.trim(), qty:tds[hs.findIndex(h=>/Total Quantity/i.test(h))].innerText.trim()};});
  post[l.pn]=r; console.log('POST',l.pn,JSON.stringify(r));
}
fs.writeFileSync('/tmp/sv8447/clean-receive.json',JSON.stringify({pns,pre,post},null,1));
await b.close(); console.log('DONE');
