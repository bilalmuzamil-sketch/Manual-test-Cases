const {boot}=require('./boot.cjs');
(async()=>{
  const {browser,page,APP}=await boot();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForTimeout(9000);
  console.log('URL   :', page.url());
  console.log('TITLE :', await page.title());
  const bodyLen=(await page.evaluate(()=>document.body.innerText||'')).length;
  console.log('bodytext len:', bodyLen);
  console.log('---- first 2500 chars of visible text ----');
  console.log((await page.evaluate(()=>document.body.innerText)).slice(0,2500));
  await page.screenshot({path:'/tmp/sched-bv/shot-schedule.png',fullPage:false});
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
