// Harvest 3: use the app's OWN top-bar location switcher (a real tester's path, not a faked seed),
// then reach /schedule and harvest everything needed for the label diff in one run.
const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-verify-2026-08-11/evidence';

const dump=async(page)=>page.evaluate(()=>{
  const texts=new Set();
  document.querySelectorAll('button,a,label,th,td,[role=tab],[role=menuitem],[role=button],[role=option],h1,h2,h3,h4,legend,.q-item__label,.q-toggle__label,.q-tab__label,.q-checkbox__label,.q-btn__content,summary,option,span,div').forEach(e=>{
    const t=(e.innerText||e.textContent||'').trim().replace(/\s+/g,' ');
    if(t && t.length<90 && e.children.length<=2) texts.add(t);
  });
  const tids=[...document.querySelectorAll('[data-test-id]')].map(e=>({
    id:e.getAttribute('data-test-id'),tag:e.tagName.toLowerCase(),
    txt:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,70),
    ap:e.getAttribute('aria-pressed'),al:e.getAttribute('aria-label')}));
  return {texts:[...texts],tids,bodyLen:document.body.innerText.length,body:document.body.innerText.slice(0,8000)};
});

(async()=>{
  const {browser,page,api,APP}=await boot();
  const rec={steps:[]};
  await api('/api/iam/change-location',{method:'POST',body:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}});

  // --- Step 1: open the app's own location switcher in the top bar
  const switcherSels=['[data-test-id*="location"]','[data-test-id*="workplace"]','[data-test-id*="shop"]'];
  let opened=false;
  for(const s of switcherSels){
    const els=await page.$$(s);
    for(const el of els){
      const t=((await el.innerText().catch(()=>''))||'').trim();
      if(/9919|4310|Staging/.test(t)){ try{ await el.click({timeout:6000}); opened=true; rec.steps.push('opened switcher via '+s+' text='+t); break;}catch(e){} }
    }
    if(opened) break;
  }
  if(!opened){ // fall back: click the element whose text is the location name
    const all=await page.$$('div,span,button');
    for(const el of all){
      const t=((await el.innerText().catch(()=>''))||'').trim();
      if(t==='Staging Heavy Duty - 9919'){ try{ await el.click({timeout:6000}); opened=true; rec.steps.push('opened switcher by exact text'); break;}catch(e){} }
    }
  }
  rec.switcher_opened=opened;
  await page.waitForTimeout(2500);
  rec.after_switcher=await page.evaluate(()=>document.body.innerText.slice(0,700));
  console.log('switcher opened:',opened);

  // --- Step 2: pick Heavy Duty from whatever opened
  let picked=false;
  const opts=await page.$$('[role=option],.q-item,.q-menu .q-item,li,div');
  for(const o of opts){
    const t=((await o.innerText().catch(()=>''))||'').trim();
    if(t==='Staging Heavy Duty - 9919'||/Heavy Duty - 9919$/.test(t)){
      try{ await o.click({timeout:5000}); picked=true; rec.steps.push('picked location: '+t); break;}catch(e){}
    }
  }
  rec.picked=picked; console.log('picked:',picked);
  await page.waitForTimeout(6000);

  // --- Step 3: go to Schedule
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  rec.url=page.url();
  rec.on_schedule=/\/schedule/.test(page.url());
  console.log('URL:',rec.url,'ON_SCHEDULE:',rec.on_schedule);

  rec.page=await dump(page);
  console.log('bodyLen',rec.page.bodyLen,'texts',rec.page.texts.length,'tids',rec.page.tids.length);

  if(rec.on_schedule){
    // click-to-arm (SV-8957) — the highest-value single check
    rec.arm={
      testids_arm: rec.page.tids.filter(t=>/arm/i.test(t.id||'')),
      aria_pressed: rec.page.tids.filter(t=>t.ap!==null).slice(0,25),
      aria_label_click: rec.page.tids.filter(t=>/by click/i.test(t.al||'')),
      html_has_arm: await page.evaluate(()=>/sidebar_arm/i.test(document.body.innerHTML)),
      html_by_click: await page.evaluate(()=>/by click/i.test(document.body.innerHTML))
    };
    console.log('ARM:',JSON.stringify(rec.arm).slice(0,400));

    // the grid-toolbar dropdown: settles Filter & Display vs Filter and Display, and VIN vs VIN Number
    rec.toolbar_candidates=rec.page.texts.filter(t=>/filter/i.test(t)).slice(0,40);
    for(const el of await page.$$('button,[role=button],.q-btn,div')){
      const t=((await el.innerText().catch(()=>''))||'').trim();
      if(/^Filter\s*(&|and)\s*Display$/i.test(t)||t==='Filter'||t==='View Options'){
        try{ await el.click({timeout:5000}); rec.steps.push('clicked toolbar: '+JSON.stringify(t)); await page.waitForTimeout(2500); break;}catch(e){}
      }
    }
    rec.after_toolbar=await dump(page);
    await page.screenshot({path:OUT+'/toolbar-open.png'});
  }
  fs.writeFileSync(OUT+'/harvest3.json',JSON.stringify(rec,null,1));
  await page.screenshot({path:OUT+'/schedule3.png'});
  console.log('WROTE harvest3.json');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
