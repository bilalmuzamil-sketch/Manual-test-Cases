// Harvest pass 2: reach /schedule by the app's OWN navigation, then dump vocabulary.
// NOTE: default_workplace is left exactly as the real account has it (null). No faking.
const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-verify-2026-08-11/evidence';

const dump=async(page)=>page.evaluate(()=>{
  const texts=new Set();
  document.querySelectorAll('button,a,label,th,td,[role=tab],[role=menuitem],[role=button],[role=option],h1,h2,h3,h4,legend,.q-item__label,.q-toggle__label,.q-tab__label,.q-checkbox__label,.q-btn__content,summary,option,span').forEach(e=>{
    const t=(e.innerText||e.textContent||'').trim().replace(/\s+/g,' ');
    if(t && t.length<90) texts.add(t);
  });
  const tids=[...document.querySelectorAll('[data-test-id]')].map(e=>({
    id:e.getAttribute('data-test-id'),tag:e.tagName.toLowerCase(),
    txt:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,70),
    ap:e.getAttribute('aria-pressed'),al:e.getAttribute('aria-label')}));
  return {texts:[...texts],tids,bodyLen:document.body.innerText.length,
          body:document.body.innerText.slice(0,6000)};
});

(async()=>{
  const {browser,page,api,APP}=await boot();
  const rec={};
  await api('/api/iam/change-location',{method:'POST',body:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}});

  console.log('start url:',page.url());
  // In-app navigation: click the Schedule nav item, exactly as a tester would.
  let clicked=false;
  for(const sel of ['a[href="/schedule"]','a[href*="schedule"]','[data-test-id*="schedule"]']){
    const el=await page.$(sel);
    if(el){ try{ await el.click({timeout:8000}); clicked=true; console.log('clicked',sel); break; }catch(e){ console.log('clickfail',sel,e.message.slice(0,60)); } }
  }
  if(!clicked){
    const link=await page.$$('a,div[role=button],span');
    for(const l of link){ const t=(await l.innerText().catch(()=>''))||''; if(t.trim()==='Schedule'){ try{await l.click({timeout:8000});clicked=true;console.log('clicked by text');break;}catch(e){} } }
  }
  rec.clicked=clicked;
  await page.waitForTimeout(12000);
  rec.url=page.url();
  console.log('after click url:',page.url());

  rec.page=await dump(page);
  console.log('bodyLen',rec.page.bodyLen,'texts',rec.page.texts.length,'tids',rec.page.tids.length);

  // click-to-arm check — ONLY meaningful on the schedule page
  rec.on_schedule=/\/schedule/.test(page.url());
  rec.arm={
    testids_arm: rec.page.tids.filter(t=>/arm/i.test(t.id||'')),
    aria_pressed: rec.page.tids.filter(t=>t.ap!==null).slice(0,20),
    aria_label_click: rec.page.tids.filter(t=>/by click/i.test(t.al||'')),
    html_has_arm: await page.evaluate(()=>/sidebar_arm|by click|aria-pressed/i.test(document.body.innerHTML))
  };
  console.log('ON_SCHEDULE',rec.on_schedule,'ARM',JSON.stringify(rec.arm).slice(0,300));

  fs.writeFileSync(OUT+'/harvest2.json',JSON.stringify(rec,null,1));
  await page.screenshot({path:OUT+'/schedule2.png'});
  console.log('WROTE harvest2.json');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
