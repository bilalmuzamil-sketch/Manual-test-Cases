// Harvest pass 1: load /schedule, change location, dump page vocabulary + key controls.
const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-verify-2026-08-11/evidence';

(async()=>{
  const {browser,page,api,apiLog,APP}=await boot();
  const rec={};
  // 1. change location via the app's own endpoint (never fake default_workplace)
  const cl=await api('/api/iam/change-location',{method:'POST',body:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}});
  rec.change_location={status:cl.status};
  console.log('change-location',cl.status);

  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForTimeout(12000);
  rec.url_after_nav=page.url();
  console.log('URL:',page.url());

  // retry once if bounced
  if(!/schedule/.test(page.url())){
    await page.waitForTimeout(4000);
    await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:180000});
    await page.waitForTimeout(12000);
    rec.url_after_retry=page.url();
    console.log('URL retry:',page.url());
  }

  const dump=async(tag)=>{
    return await page.evaluate(()=>{
      const texts=new Set();
      document.querySelectorAll('button,a,label,th,[role=tab],[role=menuitem],[role=button],h1,h2,h3,h4,legend,.q-item__label,.q-toggle__label,.q-tab__label,summary,option').forEach(e=>{
        const t=(e.innerText||e.textContent||'').trim().replace(/\s+/g,' ');
        if(t && t.length<90) texts.add(t);
      });
      const tids=[...document.querySelectorAll('[data-test-id]')].map(e=>({
        id:e.getAttribute('data-test-id'),
        tag:e.tagName.toLowerCase(),
        txt:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,70),
        ap:e.getAttribute('aria-pressed'),
        al:e.getAttribute('aria-label')
      }));
      return {texts:[...texts], tids, bodyLen:document.body.innerText.length,
              bodyHead:document.body.innerText.slice(0,1500)};
    });
  };
  rec.page=await dump('base');
  console.log('texts',rec.page.texts.length,'testids',rec.page.tids.length,'bodyLen',rec.page.bodyLen);

  // 2. HIGHEST VALUE: is click-to-arm back? (SV-8957)
  rec.arm={
    testids_arm: rec.page.tids.filter(t=>/arm/i.test(t.id||'')),
    aria_pressed: rec.page.tids.filter(t=>t.ap!==null),
    aria_label_click: rec.page.tids.filter(t=>/by click|click/i.test(t.al||'')),
    html_has_arm: await page.evaluate(()=>/sidebar_arm|by click/i.test(document.body.innerHTML))
  };
  console.log('ARM:',JSON.stringify(rec.arm).slice(0,400));

  rec.apiLog=apiLog.slice(-60);
  fs.writeFileSync(OUT+'/harvest1.json',JSON.stringify(rec,null,1));
  await page.screenshot({path:OUT+'/schedule-base.png',fullPage:false});
  console.log('WROTE harvest1.json');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
