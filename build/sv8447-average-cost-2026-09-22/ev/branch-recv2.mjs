import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const {b,p}=await boot('/parts/orders',{width:2200,height:1200});
const href=await p.evaluate(()=>{
  for(const tr of [...document.querySelectorAll('tr')]) if(tr.innerText.includes('I9940-1392')){
    const a=[...tr.querySelectorAll('a')]; const r=a.find(x=>/receive/i.test(x.innerText));
    return (r||a[0]||{}).getAttribute? (r||a[0]).getAttribute('href') : null; } return null;});
const out={href};
await p.goto('https://sv9940.qa.shopview.com'+href,{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(12000);
out.url=p.url();
out.form=await p.evaluate(()=>({
  inputs:[...document.querySelectorAll('input')].map(i=>({id:i.getAttribute('data-test-id'),type:i.type,value:i.value,ro:i.readOnly,dis:i.disabled})).filter(x=>x.id),
  buttons:[...document.querySelectorAll('button[data-test-id]')].map(x=>x.getAttribute('data-test-id')),
  costCells:[...document.querySelectorAll('td')].map(t=>t.innerText.trim()).filter(t=>/^\$[\d,]+\.\d{2,5}$/.test(t)).slice(0,8)
}));
fs.writeFileSync('/tmp/sv8447/recv-form.json',JSON.stringify(out,null,1));
await p.screenshot({path:'/tmp/sv8447/branch-receive.png'});
await b.close();
console.log('DONE');
