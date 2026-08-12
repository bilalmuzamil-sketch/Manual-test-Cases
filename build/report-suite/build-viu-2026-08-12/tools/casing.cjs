const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page}=await boot();
  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  const r=await page.evaluate(()=>{
    const tabs=[...document.querySelectorAll('[data-test-id^=tab_wip_]')];
    return tabs.map(e=>({tid:e.getAttribute('data-test-id'),
      textContent:e.textContent.trim(), innerText:e.innerText.trim(),
      transform:getComputedStyle(e).textTransform,
      innerTransform:(()=>{const c=e.querySelector('.q-tab__label')||e.firstElementChild; return c?getComputedStyle(c).textTransform:'n/a';})()}));
  });
  console.log(JSON.stringify(r,null,1));
  await page.screenshot({path:OUT+'wip-tabs-casing.png',clip:{x:0,y:150,width:1400,height:260}});
  fs.writeFileSync(OUT+'wip-tab-casing.json',JSON.stringify(r,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
