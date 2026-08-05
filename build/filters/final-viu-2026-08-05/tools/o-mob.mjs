// THE PHONE CHECK. 390x844 touch. Settles S12-R6 (deferred apply) and the button's exact label.
import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open(MOB);
const R={build:'v3.4.2-d00239b',viewport:'390x844 touch',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/mob.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const sheet=()=>page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog,.q-menu,[class*=bottom-sheet],[class*=sheet]')].filter(e=>e.offsetParent!==null);
  if(!d.length) return null; const e=d[d.length-1]; const r=e.getBoundingClientRect();
  return {cls:e.className.toString().slice(0,120),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),
    text:e.innerText.slice(0,900),
    buttons:[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id'),cls:b.className.slice(0,60),disabled:b.disabled})).filter(b=>b.t||b.testid),
    applyButtons:[...e.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({exactText:b.innerText,trimmed:b.innerText.trim(),testid:b.getAttribute('data-test-id'),html:b.outerHTML.slice(0,300)})),
    options:[...e.querySelectorAll('[role=checkbox],[data-test-id^=filter_option]')].map(o=>({label:(o.getAttribute('aria-label')||o.innerText).trim().slice(0,50),checked:o.getAttribute('aria-checked'),testid:o.getAttribute('data-test-id')})),
    allTestIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,60)};});
const listQ=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>({s:n.status,q:decodeURIComponent(n.url.split('?')[1]||'').slice(0,220)}));
const rowsN=()=>page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>2);
  return {n:tr.length, ids:tr.map(r=>r.innerText.trim().replace(/\n/g,'|').slice(0,60)).slice(0,12),
   cards:[...document.querySelectorAll('[class*=card],[class*=list-item]')].length};});

await H.resetFilters(page); await page.waitForTimeout(2500);
R.startUrl=page.url();
R.chipRow=await page.evaluate(()=>{
  const cont=[...document.querySelectorAll('div')].filter(d=>d.querySelector('button.filter-chip')&&d.scrollWidth>d.clientWidth+2);
  const c=cont[0];
  return {chips:[...document.querySelectorAll('button.filter-chip')].map(b=>{const r=b.getBoundingClientRect();return {t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),x:Math.round(r.x),w:Math.round(r.width)};}),
   horizontallyScrollable: c? {scrollWidth:c.scrollWidth,clientWidth:c.clientWidth,overflowX:getComputedStyle(c).overflowX}:null,
   collapseToggle: !!document.querySelector('[data-test-id*=filter_toggle],[data-test-id*=collapse]')};});
R.rowsBase=await rowsN(); S('base');
console.log('chips:',R.chipRow.chips.map(c=>c.t+' @'+c.x));
console.log('scrollable:',JSON.stringify(R.chipRow.horizontallyScrollable));
console.log('rowsBase',R.rowsBase.n);

// ---------- 1) SINGLE FILTER SHEET: Status ----------
{
  const o={};
  const before=listQ().length;
  const st=page.locator('button.filter-chip').filter({hasText:'Status'}).first();
  o.statusChipPresent=await st.count();
  if(o.statusChipPresent){
    await st.click({timeout:20000}); await page.waitForTimeout(2500);
    o.sheetOnOpen=await sheet();
    o.callsAfterOpen=listQ().length-before;
    // tick ONE value: Paid
    const ids=(o.sheetOnOpen&&o.sheetOnOpen.allTestIds||[]).filter(t=>/^filter_option_status_/.test(t));
    o.optionIds=ids;
    const paid=ids.find(t=>/paid/.test(t))||ids[0];
    o.tickedFirst=paid;
    const urlBefore=page.url(); const nBefore=(await rowsN()).n;
    await page.locator(`[data-test-id="${paid}"]`).first().click({timeout:20000});
    await page.waitForTimeout(400);  o.at400ms={calls:listQ().length-before,url:page.url()};
    await page.waitForTimeout(3600); o.at4s={calls:listQ().length-before,url:page.url(),rows:(await rowsN()).n,sheet:await sheet()};
    o.urlBefore=urlBefore; o.rowsBefore=nBefore;
    o.LIST_CHANGED_ON_TAP = (o.at4s.url!==urlBefore) || (o.at4s.rows!==nBefore) || o.at4s.calls>o.callsAfterOpen;
    o.APPLY_BUTTON_IN_SINGLE_SHEET = (o.at4s.sheet&&o.at4s.sheet.applyButtons)||[];
    // second value -> multi-select?
    const second=ids.find(t=>/declined/.test(t))||ids.find(t=>t!==paid);
    o.trySecond=second;
    try{ await page.locator(`[data-test-id="${second}"]`).first().click({timeout:8000}); await page.waitForTimeout(3000);
      const sh=await sheet();
      o.secondTick={ok:true,sheetStillOpen:!!sh,checked:(sh&&sh.options||[]).filter(x=>x.checked==='true').map(x=>x.label),url:page.url(),rows:(await rowsN()).n};
    }catch(e){o.secondTick={ok:false,err:e.message.slice(0,160)};}
  }
  await H.shot(page,'mob-status-sheet');
  R.singleFilterSheet=o; S('single');
  console.log('SINGLE SHEET: applied-on-tap =',o.LIST_CHANGED_ON_TAP,'| applyButtons =',JSON.stringify(o.APPLY_BUTTON_IN_SINGLE_SHEET));
  console.log('  multi-select:',JSON.stringify(o.secondTick));
}
await page.keyboard.press('Escape'); await page.waitForTimeout(1200); await H.resetFilters(page); await page.waitForTimeout(2500);

// ---------- 2) ALL FILTERS combined sheet ----------
{
  const o={}; const before=listQ().length;
  const af=page.locator('button.filter-chip').filter({hasText:'All Filters'}).first();
  o.allFiltersChipPresent=await af.count();
  if(!o.allFiltersChipPresent){ o.chipTexts=(await H.chips(page)).map(c=>c.text); }
  if(o.allFiltersChipPresent){
    await af.click({timeout:20000}); await page.waitForTimeout(2800);
    o.sheetOnOpen=await sheet();
    o.rows=[...(o.sheetOnOpen.text||'').split('\n')].slice(0,20);
    o.footerButtons=o.sheetOnOpen.buttons;
    o.APPLY_LABEL_EXACT=(o.sheetOnOpen.applyButtons||[]);
    // expand Status row and tick
    const ids0=(o.sheetOnOpen.allTestIds||[]);
    o.testIdsOnOpen=ids0;
    let opened=false;
    for(const t of ['filter_row_status','filter_expand_status','filter_section_status']){
      const l=page.locator(`[data-test-id="${t}"]`).first();
      if(await l.count()){ await l.click({timeout:8000}); opened=t; break; }
    }
    if(!opened){ const st=page.locator('.q-dialog').last().locator('text=/^Status$/').first();
      if(await st.count()){ await st.click({timeout:8000}); opened='text:Status'; } }
    o.expandedVia=opened; await page.waitForTimeout(2200);
    const sh2=await sheet(); o.sheetExpanded=sh2;
    const optIds=(sh2.allTestIds||[]).filter(t=>/^filter_option_status_/.test(t));
    o.optionIds=optIds;
    const urlB=page.url(); const nB=(await rowsN()).n;
    if(optIds.length){
      const paid=optIds.find(t=>/paid/.test(t))||optIds[0];
      await page.locator(`[data-test-id="${paid}"]`).first().click({timeout:15000});
      await page.waitForTimeout(4000);
      o.afterTickNoApply={callsSinceOpen:listQ().length-before,url:page.url(),urlUnchanged:page.url()===urlB,rows:(await rowsN()).n,rowsUnchanged:(await rowsN()).n===nB};
      // second value in the combined sheet
      const second=optIds.find(t=>/declined/.test(t))||optIds.find(t=>t!==paid);
      if(second){ try{ await page.locator(`[data-test-id="${second}"]`).first().click({timeout:8000}); await page.waitForTimeout(2000);
        const s3=await sheet(); o.secondTickCombined={ok:true,checked:(s3.options||[]).filter(x=>x.checked==='true').map(x=>x.label)};
      }catch(e){o.secondTickCombined={ok:false,err:e.message.slice(0,120)};} }
      await H.shot(page,'mob-allfilters-staged');
      // now press Apply
      const sh3=await sheet(); const ab=(sh3.applyButtons||[])[0];
      o.applyButtonBeforePress=ab;
      if(ab){
        const sel = ab.testid? `[data-test-id="${ab.testid}"]` : null;
        try{
          if(sel) await page.locator(sel).first().click({timeout:15000});
          else await page.locator('.q-dialog').last().locator('button',{hasText:/apply/i}).first().click({timeout:15000});
          await page.waitForTimeout(4500);
          o.afterApply={callsSinceOpen:listQ().length-before,url:page.url(),rows:(await rowsN()).n,sheetStillOpen:!!(await sheet()),chips:(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|'))};
        }catch(e){o.afterApply={ok:false,err:e.message.slice(0,200)};}
      }
    }
    o.allListCalls=listQ();
  }
  await H.shot(page,'mob-allfilters-applied');
  R.combinedSheet=o; S('combined');
  console.log('COMBINED: apply label =',JSON.stringify(o.APPLY_LABEL_EXACT));
  console.log('  after tick, no apply:',JSON.stringify(o.afterTickNoApply));
  console.log('  after apply:',JSON.stringify(o.afterApply));
}
R.finalUrl=page.url(); R.netListCalls=listQ();
S('done'); await browser.close();
