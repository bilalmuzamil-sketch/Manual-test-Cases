const {boot,APP}=require('/tmp/boot.cjs'); const fs=require('fs');
const R=process.argv[2], MENU=process.argv[3], ITEM=process.argv[4], TAG=process.argv[5];
(async()=>{
  const {browser,page}=await boot();
  await page.goto(APP+'/reports/'+R,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  await page.locator(`[data-test-id="${MENU}"]`).first().click({force:true});
  await page.waitForTimeout(1600);
  const dl=page.waitForEvent('download',{timeout:60000}).catch(()=>null);
  await page.locator(`[data-test-id="${ITEM}"]`).first().click({force:true});
  const d=await dl;
  if(d){ const p='/tmp/dl-'+TAG; await d.saveAs(p); console.log('DOWNLOAD ok filename='+d.suggestedFilename()+' bytes='+fs.statSync(p).size); }
  else { console.log('NO DOWNLOAD EVENT'); }
  await page.waitForTimeout(2500);
  const toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification, .q-notification__message')].map(e=>e.innerText.trim()));
  console.log('TOASTS',JSON.stringify(toast));
  await browser.close(); console.log('EXPORT-DONE');
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
