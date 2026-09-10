// Receive via the product's default Receive button (vendor-grouped screen).
import {boot} from './b.mjs';
import {clickId,ids} from './po.mjs';
const env=process.argv[2], PO=process.argv[3], INV=process.argv[4], TAG=process.argv[5];
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page}=await boot(env);
try{
  await page.goto(APP+'/order/'+PO,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4000);
  await clickId(page,'button_receive_order');
  await page.waitForSelector('[data-test-id^="input_invoice_"]',{timeout:30000});
  await page.waitForTimeout(2500);
  const all=await ids(page);
  const inv=all.find(x=>x.startsWith('input_invoice_'));
  const selall=all.find(x=>x.startsWith('checkbox_select_all_'));
  const btn=all.find(x=>x.startsWith('button_receive_po_'));
  const qtys=all.filter(x=>x.startsWith('input_qty_'));
  console.log('controls:',inv,selall,btn,qtys.length+' qty inputs');
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-screen.png`,fullPage:true});
  const h=await page.waitForSelector(`[data-test-id="${inv}"]`); await h.click(); await h.fill(''); await h.type(INV,{delay:25});
  const items=all.filter(x=>x.startsWith('checkbox_item_'));
  for(const it of items){
    await page.locator(`[data-test-id="${it}"]`).click({force:true});
    await page.waitForTimeout(700);
    const on=await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.getAttribute('aria-checked'):null;},it);
    if(on!=='true'){ await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);const c=e.closest('.q-checkbox')||e;c.click();},it); await page.waitForTimeout(700); }
    console.log('  ',it,'aria-checked=',await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.getAttribute('aria-checked'):null;},it));
  }
  await page.waitForTimeout(1000);
  console.log('after select-all, qty values:',JSON.stringify(await page.evaluate(q=>q.map(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?(e.value!==undefined?e.value:e.innerText):null;}),qtys)));
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-filled.png`,fullPage:true});
  const waitAccept=page.waitForResponse(r=>/inventory\/orders\/accept/.test(r.url()),{timeout:40000}).catch(()=>null);
  await page.locator(`[data-test-id="${btn}"]`).click({force:true});
  await page.waitForTimeout(1800);
  const dlg=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].find(x=>x.innerText.includes('Delivery status'));return d?d.innerText.replace(/\n+/g,' | '):null;});
  if(dlg){ console.log('DIALOG:',dlg);
    const c=await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button, .q-dialog .q-item')].find(x=>x.innerText.trim()==='Receive As Order Fulfilled');const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
    await page.mouse.click(c.x,c.y); }
  const resp=await waitAccept; console.log('accept:',resp?resp.status():'NO REQUEST');
  await page.waitForTimeout(4000);
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-after.png`,fullPage:true});
}catch(e){ console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-err.png`,fullPage:true}); }
await browser.close();
