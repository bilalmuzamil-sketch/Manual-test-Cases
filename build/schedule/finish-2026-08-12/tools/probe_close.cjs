// probe_close.cjs -- close the three inconclusive results from walk batch 2.
// Read-only.  Non-GET call list printed at exit.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs=require('fs');
const V=`(e)=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;
const out={};
(async()=>{const h=await makeHarness('close');const page=h.page;
 try{
  // --- C43554 : FIRST thing this fresh context does is read the view toggle -----
  await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(7000);
  await page.evaluate(({v})=>{const vis=eval(v);const a=[...document.querySelectorAll('[data-test-id="button_desktop_nav_link"],a,button')].filter(vis).find(e=>(e.innerText||'').trim()==='Schedule');if(a)a.click();},{v:V});
  await page.waitForTimeout(9000);
  out.c43554=await page.evaluate(({v})=>{const vis=eval(v);
    const t=document.querySelector('[data-test-id="schedule_view_toggle"]');
    const btns=t?[...t.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').trim(),pressed:e.getAttribute('aria-pressed')})):null;
    const r=document.querySelector('[data-test-id="text_schedule_range"]');
    const ls=document.querySelector('[data-test-id="schedule_lane_label"]');
    return {buttons:btns,range:r?(r.innerText||'').trim():null,localStorageKeys:Object.keys(localStorage)};},{v:V});
  console.log('C43554 (fresh context, nothing else clicked):',JSON.stringify(out.c43554));

  // --- C29931 : ALL lane labels, in a week that contains an unassigned shift ----
  await page.evaluate(({v})=>{const vis=eval(v);const b=[...document.querySelectorAll('button,.q-btn,div,span')].filter(vis).find(e=>(e.innerText||'').trim()==='Week');if(b)b.click();},{v:V});
  await page.waitForTimeout(3000);
  out.c29931=await page.evaluate(({v})=>{const vis=eval(v);
    const labels=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
    const r=document.querySelector('[data-test-id="text_schedule_range"]');
    const body=(document.querySelector('[data-test-id="schedule_calendar"]')||{}).innerText||'';
    return {range:r?(r.innerText||'').trim():null,total:labels.length,labels,
            unassignedInLabels:labels.filter(l=>/unassign/i.test(l)),
            unassignedInGridText:/unassign/i.test(body)};},{v:V});
  console.log('C29931 range',out.c29931.range,'| lanes',out.c29931.total,
              '| lanes matching unassigned:',JSON.stringify(out.c29931.unassignedInLabels),
              '| word appears in grid text:',out.c29931.unassignedInGridText);
  console.log('   all lane labels:',JSON.stringify(out.c29931.labels));
  await page.screenshot({path:`${OUT}/c-29931.png`,fullPage:true}).catch(()=>{});

  // --- C29942 : apply ONE filter option precisely, then read the button --------
  const before=await page.evaluate(({v})=>{const vis=eval(v);return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length;},{v:V});
  await page.evaluate(({v})=>{const el=document.querySelector('[data-test-id="button_sidebar_filters"]');if(el)el.click();},{v:V});
  await page.waitForTimeout(1600);
  const opts=await page.evaluate(({v})=>{const vis=eval(v);
    const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0];if(!m)return null;
    return [...m.querySelectorAll('.q-item,[role="option"],label')].filter(vis)
      .map((e,i)=>({i,t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)}));},{v:V});
  console.log('C29942 options in the panel:',JSON.stringify(opts));
  const clicked=await page.evaluate(({v})=>{const vis=eval(v);
    const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0];if(!m)return null;
    const it=[...m.querySelectorAll('.q-item,[role="option"],label')].filter(vis)
      .find(e=>/^Unassigned\b/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!it)return null;it.click();return (it.innerText||'').replace(/\s+/g,' ').trim();},{v:V});
  await page.waitForTimeout(2400);
  out.c29942=await page.evaluate(({v,before})=>{const vis=eval(v);
    const b=document.querySelector('[data-test-id="button_sidebar_filters"]');
    return {clickedOption:null,buttonText:b&&vis(b)?(b.innerText||'').replace(/\s+/g,' ').trim():null,
            cardsAfter:[...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length,
            cardsBefore:before};},{v:V,before});
  out.c29942.clickedOption=clicked;
  console.log('C29942',JSON.stringify(out.c29942));
  await page.screenshot({path:`${OUT}/c-29942.png`}).catch(()=>{});
 }catch(e){console.log('FATAL',String(e).slice(0,300));}
 fs.writeFileSync(`${OUT}/close.json`,JSON.stringify({read_at_utc:new Date().toISOString(),results:out,non_get:h.apiLog.filter(a=>a.m!=='GET')},null,1));
 console.log('NON-GET:',JSON.stringify(h.apiLog.filter(a=>a.m!=='GET')));
 await h.browser.close();})();
