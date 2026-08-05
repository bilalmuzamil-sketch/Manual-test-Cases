import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open({...MOB,settle:18000});
const R={build:'v3.4.2-d00239b',viewport:'390x844 touch',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/mob3.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const vis="e=>e.offsetParent!==null||['fixed','absolute'].includes(getComputedStyle(e).position)";
const sheet=()=>page.evaluate(()=>{
  const vis=e=>e.offsetParent!==null||['fixed','absolute'].includes(getComputedStyle(e).position);
  const d=[...document.querySelectorAll('[data-test-id=mobile_filter_sheet]')].filter(e=>vis(e)&&e.getBoundingClientRect().height>80);
  if(!d.length) return null; const e=d[0];
  return {title:(e.innerText||'').split('\n')[0], h:Math.round(e.getBoundingClientRect().height), text:e.innerText.slice(0,600),
   applyInSheet:[...e.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({EXACT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id')})),
   clear:[...e.querySelectorAll('button,a')].filter(x=>/clear/i.test(x.innerText||'')).map(x=>({t:x.innerText.trim(),testid:x.getAttribute('data-test-id')})),
   checked:[...e.querySelectorAll('[data-test-id^=filter_option]')].map(o=>({t:o.innerText.trim().slice(0,26),checked:o.getAttribute('aria-checked'),cls:/(active|selected|checked)/i.test(o.className)?'markedActive':'',testid:o.getAttribute('data-test-id')})),
   testIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id'))};});
const applyAnywhere=()=>page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({EXACT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id'),vis:b.offsetParent!==null})));
const chips=()=>page.evaluate(()=>[...document.querySelectorAll('.mobile-chip,[data-test-id^=filter_chip_]')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),bg:getComputedStyle(b).backgroundColor})));
const clearFiltersCtl=()=>page.evaluate(()=>{
  const byId=document.querySelector('[data-test-id="clear_filters"]');
  const byText=[...document.querySelectorAll('button,a,span,div')].filter(e=>e.offsetParent&&/^clear filters$/i.test((e.innerText||'').trim()));
  return {byTestId:!!byId, byTestIdVisible: byId? byId.offsetParent!==null : false, byTextCount:byText.length,
    byTextSamples:byText.slice(0,3).map(e=>({tag:e.tagName,t:e.innerText.trim(),testid:e.getAttribute('data-test-id')}))};});
const cards=()=>page.evaluate(()=>{const t=document.body.innerText;
  const st=(t.match(/\n(Estimate|Approved|In Progress|In progress|Review|Complete|Invoiced|Paid|Declined|Imported)\n/g)||[]).map(s=>s.trim());
  return {statusCounts:st.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{}), ids:(t.match(/S2-\d{4,6}/g)||[]).slice(0,12), n:(t.match(/S2-\d{4,6}/g)||[]).length,
   emptyText:/No work orders|no results|No results/i.test(t)? t.slice(Math.max(0,t.search(/No work orders|no results|No results/i)-60), t.search(/No work orders|no results|No results/i)+240):null};});
const listQ=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>decodeURIComponent(n.url.split('?')[1]||'').slice(0,200));

// ---- clean slate, proven ----
await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
const cf0=await clearFiltersCtl();
if(cf0.byTestId){ await page.locator('[data-test-id="clear_filters"]').first().click({timeout:15000}); await page.waitForTimeout(4000); }
R.cleanUrl=page.url(); R.cleanChips=await chips(); R.cleanCards=await cards();
R.clearFilters_whenNoFilterActive=cf0;
S('clean'); console.log('clean url',R.cleanUrl,'| cards',JSON.stringify(R.cleanCards.statusCounts));

// ================= A) SINGLE-FILTER SHEET, clean start =================
{
 const o={}; const n0=listQ().length;
 await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000}); await page.waitForTimeout(3000);
 o.onOpen=await sheet(); o.applyAnywhereOnOpen=await applyAnywhere(); o.callsOnOpen=listQ().length-n0;
 o.urlBefore=page.url(); o.cardsBefore=await cards();
 await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:20000});
 await page.waitForTimeout(600); o.at600ms={url:page.url(),calls:listQ().length-n0,sheet:!!(await sheet())};
 await page.waitForTimeout(4400);
 o.at5s={url:page.url(),calls:listQ().length-n0,sheetStillOpen:!!(await sheet()),cards:await cards()};
 o.sheetAfterTick=await sheet(); o.applyAnywhereAfterTick=await applyAnywhere();
 o.APPLIED_ON_TAP = o.at5s.url!==o.urlBefore;
 o.SHEET_CLOSED_ON_TAP = !o.at5s.sheetStillOpen;
 // reopen and try a SECOND value
 if(o.SHEET_CLOSED_ON_TAP){
   await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000}); await page.waitForTimeout(3000);
   o.reopened=await sheet();
   const chk=(o.reopened&&o.reopened.checked||[]).filter(x=>x.checked==='true'||x.cls==='markedActive').map(x=>x.t);
   o.reopened_checkedValues=chk;
   try{ await page.locator('[data-test-id="filter_option_status_declined"]').first().click({timeout:12000}); await page.waitForTimeout(4500);
     o.secondValue={ok:true,url:page.url(),cards:await cards(),sheetOpen:!!(await sheet())};
     await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000}).catch(()=>{}); await page.waitForTimeout(2500);
     const s=await sheet(); o.afterSecond_checked=(s&&s.checked||[]).filter(x=>x.checked==='true'||x.cls==='markedActive').map(x=>x.t);
     o.MULTISELECT_POSSIBLE = (o.afterSecond_checked||[]).length>=2;
   }catch(e){o.secondValue={ok:false,err:e.message.slice(0,150)};}
 }
 R.singleSheet=o; await H.shot(page,'mob3-single'); S('single');
 console.log('SINGLE SHEET: appliedOnTap',o.APPLIED_ON_TAP,'| sheetClosedOnTap',o.SHEET_CLOSED_ON_TAP,'| applyBtn',JSON.stringify(o.applyAnywhereOnOpen));
 console.log('  url',o.urlBefore.slice(-30),'->',o.at5s.url.slice(-40),'| cards',JSON.stringify(o.at5s.cards.statusCounts));
 console.log('  reopened checked:',JSON.stringify(o.reopened_checkedValues),'| after 2nd:',JSON.stringify(o.afterSecond_checked),'| MULTISELECT',o.MULTISELECT_POSSIBLE);
}
// ---- Clear Filters on phone while a filter IS active (SV-8846) ----
R.clearFilters_whileActive=await clearFiltersCtl();
R.chipsWhileActive=await chips();
await H.shot(page,'mob3-clearfilters');
S('clearfilters'); console.log('CLEAR FILTERS while active:',JSON.stringify(R.clearFilters_whileActive));

// ================= B) COMBINED SHEET, clean start =================
await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
if((await clearFiltersCtl()).byTestId){ await page.locator('[data-test-id="clear_filters"]').first().click({timeout:15000}); await page.waitForTimeout(4000); }
{
 const o={}; const n0=listQ().length;
 await page.locator('[data-test-id="filter_chip_all_filters"]').first().click({timeout:20000}); await page.waitForTimeout(3200);
 o.onOpen=await sheet(); o.APPLY_BUTTON=await applyAnywhere(); o.callsOnOpen=listQ().length-n0;
 o.rows=(o.onOpen.text||'').split('\n').slice(0,20);
 let via=null;
 for(const t of ['filter_row_status','filter_expand_status','filter_section_status','filter_accordion_status']){
   const l=page.locator(`[data-test-id="${t}"]`).first(); if(await l.count()){await l.click({timeout:9000}); via=t; break;} }
 if(!via){ const st=page.locator('[data-test-id=mobile_filter_sheet]').getByText(/^Status$/).first();
   if(await st.count()){ await st.click({timeout:9000}); via='text:Status'; } }
 o.expandedVia=via; await page.waitForTimeout(2500);
 o.urlBefore=page.url(); o.cardsBefore=await cards();
 await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000}); await page.waitForTimeout(2500);
 await page.locator('[data-test-id="filter_option_status_declined"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
 const s2=await sheet();
 o.STAGED={calls:listQ().length-n0,url:page.url(),urlUnchanged:page.url()===o.urlBefore,
   cards:await cards(), listUnchanged:JSON.stringify((await cards()).ids)===JSON.stringify(o.cardsBefore.ids),
   bothChecked:(s2&&s2.checked||[]).filter(x=>x.checked==='true'||x.cls==='markedActive').map(x=>x.t)};
 o.MULTISELECT_COMBINED=(o.STAGED.bothChecked||[]).length>=2;
 await H.shot(page,'mob3-combined-staged');
 await page.locator('[data-test-id="apply_filters"]').first().click({timeout:15000}); await page.waitForTimeout(5000);
 o.AFTER_APPLY={calls:listQ().length-n0,url:page.url(),cards:await cards(),sheetOpen:!!(await sheet()),chips:await chips()};
 await H.shot(page,'mob3-combined-applied');
 R.combined=o; S('combined');
 console.log('COMBINED: APPLY BUTTON',JSON.stringify(o.APPLY_BUTTON));
 console.log('  staged: urlUnchanged',o.STAGED.urlUnchanged,'calls',o.STAGED.calls,'bothChecked',JSON.stringify(o.STAGED.bothChecked));
 console.log('  applied: url',o.AFTER_APPLY.url.slice(-56),'cards',JSON.stringify(o.AFTER_APPLY.cards.statusCounts));
 console.log('  chips after apply:',o.AFTER_APPLY.chips.map(c=>c.t).join(' | '));
}
// ================= C) mobile empty state + shared link (SV-8845) =================
await page.goto('https://sv8785.qa.shopview.com/workorders?status=declined&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
R.sharedLink={url:page.url(),chips:await chips(),cards:await cards()};
await H.shot(page,'mob3-sharedlink'); S('sharedlink');
console.log('SHARED LINK ?status=declined -> chips:',R.sharedLink.chips.map(c=>c.t).join(' | '));
console.log('   cards:',JSON.stringify(R.sharedLink.cards.statusCounts));
R.allCalls=listQ(); S('done'); await browser.close();
