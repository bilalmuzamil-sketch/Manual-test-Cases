import {boot} from './b.mjs';
import {clickId,typeId,ids} from './po.mjs';
const env=process.argv[2]||'qa', PO=process.argv[3], INV=process.argv[4], QTYS=(process.argv[5]||'').split(',');
const TAG=process.argv[6]||'recv'; const MODE=process.argv[7]||'partial';
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page,net}=await boot(env);
try{
  await page.goto(APP+'/accept-delivery/'+PO,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(6000);
  console.log('TABLE BEFORE RECEIVE:\n'+await page.evaluate(()=>{const t=document.querySelector('table');return t?t.innerText:document.body.innerText.slice(0,600);}));
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-screen.png`,fullPage:true});
  await typeId(page,'input_invoice_number',INV);
  for(let i=0;i<QTYS.length;i++){ if(QTYS[i]!=='') await typeId(page,`input_delivered_quantity_${i}`,QTYS[i]); }
  await page.waitForTimeout(600);
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-filled.png`,fullPage:true});
  const waitAccept=page.waitForResponse(r=>/inventory\/orders\/accept/.test(r.url()),{timeout:40000}).catch(()=>null);
  await page.locator('[data-test-id="button_receive_delivery"]').click({force:true});
  await page.waitForTimeout(1800);
  // when less than the ordered quantity is entered the app asks how to treat the delivery
  const dlg=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].find(x=>x.innerText.includes('Delivery status'));return d?d.innerText.replace(/\n+/g,' | '):null;});
  if(dlg){
    console.log('DELIVERY STATUS DIALOG:',dlg);
    await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-dialog.png`});
    const label=MODE==='fulfilled'?'Receive As Order Fulfilled':'Receive As Partial Delivery';
    const c=await page.evaluate(l=>{const b=[...document.querySelectorAll('.q-dialog button, .q-dialog .q-item')].find(x=>x.innerText.trim()===l);if(!b)return null;const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},label);
    if(!c) throw new Error('dialog option not found: '+label);
    await page.mouse.click(c.x,c.y);
  }
  const resp=await waitAccept;
  console.log('accept response:',resp?resp.status():'NO REQUEST FIRED');
  await page.waitForTimeout(4000);
  console.log('URL after:',page.url());
  console.log('toast/text:',await page.evaluate(()=>[...document.querySelectorAll('.q-notification__message')].map(n=>n.innerText).join(' // ')||document.body.innerText.slice(0,300)));
  console.log('NET:',JSON.stringify(net.filter(n=>/accept|orders/.test(n.u)).map(n=>({u:n.u,st:n.st,body:(n.body||'').slice(0,600),res:(n.res||'').slice(0,200)})),null,1));
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-after.png`,fullPage:true});
}catch(e){ console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-err.png`,fullPage:true}); }
await browser.close();
