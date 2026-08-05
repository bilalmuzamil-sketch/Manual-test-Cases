import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open({...MOB,settle:18000});
const R={build:'v3.4.2-d00239b',viewport:'390x844 touch',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/mob4.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const sheet=()=>page.evaluate(()=>{
  const vis=e=>e.offsetParent!==null||['fixed','absolute'].includes(getComputedStyle(e).position);
  const d=[...document.querySelectorAll('[data-test-id=mobile_filter_sheet]')].filter(e=>vis(e)&&e.getBoundingClientRect().height>80);
  if(!d.length) return null; const e=d[0];
  return {title:(e.innerText||'').split('\n')[0], text:e.innerText.slice(0,700),
   applyInSheet:[...e.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({EXACT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id')})),
   clear:[...e.querySelectorAll('button,a')].filter(x=>/clear/i.test(x.innerText||'')).map(x=>({t:x.innerText.trim(),testid:x.getAttribute('data-test-id')})),
   checked:[...e.querySelectorAll('[data-test-id^=filter_option]')].map(o=>({t:o.innerText.trim().slice(0,26),checked:o.getAttribute('aria-checked'),cls:/(active|selected|checked)/i.test(o.className)?'markedActive':'',testid:o.getAttribute('data-test-id')})),
   testIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,60)};});
const applyAnywhere=()=>page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({EXACT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id'),vis:b.offsetParent!==null})));
const chips=()=>page.evaluate(()=>[...document.querySelectorAll('.mobile-chip,[data-test-id^=filter_chip_]')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),bg:getComputedStyle(b).backgroundColor})));
const cards=()=>page.evaluate(()=>{const t=document.body.innerText;
  const st=(t.match(/\n(Estimate|Approved|In Progress|In progress|Review|Complete|Invoiced|Paid|Declined|Imported)\n/g)||[]).map(s=>s.trim());
  const m=t.search(/No work orders|no results|No results|nothing/i);
  return {statusCounts:st.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{}), ids:(t.match(/S2-\d{4,6}/g)||[]).slice(0,12), n:(t.match(/S2-\d{4,6}/g)||[]).length,
   emptyText: m>=0? t.slice(Math.max(0,m-80),m+260) : null};});
const listQ=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>decodeURIComponent(n.url.split('?')[1]||'').slice(0,200));
async function openSheet(testid,tries=4){
  for(let i=0;i<tries;i++){
    await page.locator(`[data-test-id="${testid}"]`).first().click({timeout:20000}).catch(()=>{});
    await page.waitForTimeout(2600);
    const s=await sheet(); if(s) return {ok:true,attempt:i+1,sheet:s};
  }
  return {ok:false};
}
async function reset(){
  await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9500);
  const cf=page.locator('[data-test-id="clear_filters"]');
  if(await cf.count()){ await cf.first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(4000); }
}
// ============ COMBINED SHEET ============
await reset();
{
 const o={}; const n0=listQ().length;
 const op=await openSheet('filter_chip_all_filters');
 o.opened=op.ok; o.attempt=op.attempt; o.onOpen=op.sheet;
 o.APPLY_BUTTON=await applyAnywhere(); o.callsOnOpen=listQ().length-n0;
 o.rows=(op.sheet? op.sheet.text:'').split('\n').slice(0,22);
 let via=null;
 for(const t of ['filter_row_status','filter_expand_status','filter_section_status']){
   const l=page.locator(`[data-test-id="${t}"]`).first(); if(await l.count()){await l.click({timeout:9000}).catch(()=>{}); via=t; break;} }
 if(!via){ const st=page.locator('[data-test-id=mobile_filter_sheet]').getByText(/^Status$/).first();
   if(await st.count()){ await st.click({timeout:9000}).catch(()=>{}); via='text:Status'; } }
 o.expandedVia=via; await page.waitForTimeout(2600);
 o.sheetExpandedTestIds=(await sheet()||{}).testIds;
 o.urlBefore=page.url(); o.cardsBefore=await cards();
 for(const v of ['paid','declined']){
   const l=page.locator(`[data-test-id="filter_option_status_${v}"]`).first();
   if(await l.count()){ await l.click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(2600); }
   else o['missing_'+v]=true;
 }
 await page.waitForTimeout(2500);
 const s2=await sheet();
 o.STAGED={calls:listQ().length-n0,url:page.url(),urlUnchanged:page.url()===o.urlBefore,cards:await cards(),
   bothChecked:(s2&&s2.checked||[]).filter(x=>x.checked==='true'||x.cls==='markedActive').map(x=>x.t),
   applyStillThere:(s2&&s2.applyInSheet)||[]};
 o.STAGED.listUnchanged=JSON.stringify(o.STAGED.cards.ids)===JSON.stringify(o.cardsBefore.ids);
 o.MULTISELECT_COMBINED=(o.STAGED.bothChecked||[]).length>=2;
 await H.shot(page,'mob4-combined-staged');
 const ab=page.locator('[data-test-id="apply_filters"]').first();
 o.applyPresent=await ab.count();
 if(o.applyPresent){ await ab.click({timeout:15000}); await page.waitForTimeout(5500);
   o.AFTER_APPLY={calls:listQ().length-n0,url:page.url(),cards:await cards(),sheetOpen:!!(await sheet()),chips:await chips()}; }
 await H.shot(page,'mob4-combined-applied');
 R.combined=o; S('combined');
 console.log('COMBINED opened',o.opened,'attempt',o.attempt);
 console.log('  APPLY BUTTON:',JSON.stringify(o.APPLY_BUTTON));
 console.log('  sheet rows:',JSON.stringify(o.rows));
 console.log('  STAGED urlUnchanged',o.STAGED.urlUnchanged,'listUnchanged',o.STAGED.listUnchanged,'calls',o.STAGED.calls,'bothChecked',JSON.stringify(o.STAGED.bothChecked));
 console.log('  AFTER APPLY:',o.AFTER_APPLY? o.AFTER_APPLY.url.slice(-60)+' cards '+JSON.stringify(o.AFTER_APPLY.cards.statusCounts):'n/a');
 console.log('  chips after apply:',(o.AFTER_APPLY?o.AFTER_APPLY.chips:[]).map(c=>c.t).join(' | '));
}
// ============ mobile Customer sheet (MOB-05) ============
await reset();
{
 const o={}; const op=await openSheet('filter_chip_company_id');
 o.opened=op.ok; o.sheet=op.sheet;
 o.hasSearchInput=await page.evaluate(()=>{const s=document.querySelector('[data-test-id=mobile_filter_sheet]'); return s? [...s.querySelectorAll('input')].map(i=>({ph:i.placeholder,testid:i.getAttribute('data-test-id')})):null;});
 o.applyAnywhere=await applyAnywhere();
 const ids=await page.evaluate(()=>{const s=document.querySelector('[data-test-id=mobile_filter_sheet]'); return s?[...s.querySelectorAll('[data-test-id^=filter_option]')].map(x=>x.getAttribute('data-test-id')).slice(0,4):[];});
 o.optionIds=ids; o.urlBefore=page.url();
 if(ids.length){ await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(4500);
   o.afterTick={url:page.url(),applied:page.url()!==o.urlBefore,sheetOpen:!!(await sheet()),cards:await cards()};
   const s=await sheet(); o.tagsAfter=s? (s.text||'').slice(0,300):null; }
 await H.shot(page,'mob4-customer');
 R.mobileCustomer=o; S('customer');
 console.log('MOBILE CUSTOMER sheet: opened',o.opened,'| searchInputs',JSON.stringify(o.hasSearchInput),'| applyBtn',JSON.stringify(o.applyAnywhere));
 console.log('  afterTick applied=',o.afterTick&&o.afterTick.applied,'sheetOpen',o.afterTick&&o.afterTick.sheetOpen);
}
// ============ mobile Asset on Site (MOB-07) ============
await reset();
{
 const o={}; const op=await openSheet('filter_chip_vehicleHere');
 o.opened=op.ok; o.text=op.sheet&&op.sheet.text; o.clear=op.sheet&&op.sheet.clear; o.applyAnywhere=await applyAnywhere();
 o.optionIds=op.sheet? (op.sheet.testIds||[]).filter(t=>/^filter_option/.test(t)):[];
 await H.shot(page,'mob4-asset'); R.mobileAsset=o; S('asset');
 console.log('MOBILE ASSET sheet:',JSON.stringify(o.text&&o.text.slice(0,120)),'| clear',JSON.stringify(o.clear),'| apply',JSON.stringify(o.applyAnywhere));
}
// ============ mobile empty state (MOB-10) — a filter combination matching nothing ============
await page.goto('https://sv8785.qa.shopview.com/workorders?status=imported&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
R.mobEmptyImported={url:page.url(),cards:await cards(),chips:await chips(),
  clearFilters:await page.evaluate(()=>({byTestId:!!document.querySelector('[data-test-id="clear_filters"]'),
    byText:[...document.querySelectorAll('button,a,span,div')].filter(e=>e.offsetParent&&/clear/i.test((e.innerText||'').trim())&&(e.innerText||'').trim().length<24).map(e=>e.innerText.trim()).slice(0,5)}))};
await H.shot(page,'mob4-empty'); S('empty');
console.log('MOBILE EMPTY (?status=imported):',JSON.stringify(R.mobEmptyImported.cards).slice(0,320));
console.log('  clearFilters on empty:',JSON.stringify(R.mobEmptyImported.clearFilters));
// ============ collapse toggle on mobile (MOB-09) ============
R.mobCollapse=await page.evaluate(()=>({tune:[...document.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).filter(t=>/toggle_filters|collapse/i.test(t)),
  chipRowPresent:!!document.querySelector('.mobile-filter-chip-row')}));
console.log('MOBILE COLLAPSE toggle:',JSON.stringify(R.mobCollapse));
R.allCalls=listQ(); S('done'); await browser.close();
