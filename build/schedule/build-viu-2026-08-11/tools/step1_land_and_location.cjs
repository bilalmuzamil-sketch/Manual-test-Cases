const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
(async()=>{
  const {browser,page,apiLog}=await open();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(15000);
  const d=await page.evaluate(DUMP);
  await page.screenshot({path:OUT+'/schedule-page.png'});
  fs.writeFileSync(OUT+'/schedule-dump.json',JSON.stringify({dump:d,api:apiLog.slice(0,120),read_at_utc:new Date().toISOString()},null,2));
  console.log('URL     :',d.url);
  console.log('TITLE   :',d.title);
  console.log('ARM     :',JSON.stringify(d.arm).slice(0,500));
  console.log('TESTIDS :',d.testids.length,'| BUTTONS:',d.buttons.length,'| TEXTS:',d.texts.length);
  console.log('LOCATION HITS:',JSON.stringify(d.texts.filter(t=>/9919|Heavy Duty|Lethbridge|QB Location/i.test(t)).slice(0,10)));
  console.log('BODY    :',d.body_text.replace(/\s+/g,' ').slice(0,900));
  await browser.close();
})();
