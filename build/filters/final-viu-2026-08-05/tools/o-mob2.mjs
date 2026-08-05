// THE PHONE CHECK — 390x844 touch. Settles S12-R6 (deferred apply) + the button's exact label.
import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open({...MOB,settle:20000});
const R={build:'v3.4.2-d00239b',viewport:'390x844 touch iPhone UA',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/mob.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const listQ=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>({s:n.status,q:decodeURIComponent(n.url.split('?')[1]||'').slice(0,240)}));
const chips=()=>page.evaluate(()=>[...document.querySelectorAll('.mobile-chip,[data-test-id^=filter_chip_]')].map(b=>{const r=b.getBoundingClientRect();const cs=getComputedStyle(b);
  return {t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),x:Math.round(r.x),w:Math.round(r.width),bg:cs.backgroundColor,fg:cs.color};}));
const sheet=()=>page.evaluate(()=>{
  const vis=e=>e.offsetParent!==null||['fixed','absolute'].includes(getComputedStyle(e).position);
  const d=[...document.querySelectorAll('[data-test-id=mobile_filter_sheet],.q-dialog__inner,.q-menu')].filter(e=>vis(e)&&e.getBoundingClientRect().height>80);
  if(!d.length) return null; const e=d[d.length-1]; const r=e.getBoundingClientRect();
  const btns=[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id'),disabled:b.disabled}));
  return {cls:e.className.toString().slice(0,110),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),
    text:e.innerText.slice(0,700), buttons:btns.filter(b=>b.t||b.testid),
    applyButtons:[...e.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||''))
      .map(b=>({EXACT_TEXT:JSON.stringify(b.innerText),trimmed:b.innerText.trim(),testid:b.getAttribute('data-test-id')})),
    applyAnywhereInDoc:[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||''))
      .map(b=>({EXACT_TEXT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id')})),
    clearControls:[...e.querySelectorAll('button,a,[class*=clear]')].filter(x=>/clear/i.test(x.innerText||'')).map(x=>({t:x.innerText.trim(),testid:x.getAttribute('data-test-id')})),
    options:[...e.querySelectorAll('[role=checkbox],[data-test-id^=filter_option]')].map(o=>({label:(o.getAttribute('aria-label')||o.innerText).trim().slice(0,44),checked:o.getAttribute('aria-checked'),testid:o.getAttribute('data-test-id')})),
    testIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,70)};});
const cards=()=>page.evaluate(()=>{const el=[...document.querySelectorAll('[class*=work-order-card],[class*=wo-card],.q-card')].filter(e=>e.offsetParent);
  const txt=document.body.innerText;
  const st=(txt.match(/\n(Estimate|Approved|In Progress|Review|Complete|Invoiced|Paid|Declined|Imported)\n/g)||[]).map(s=>s.trim());
  const ids=(txt.match(/S2-\d{4,6}/g)||[]);
  return {cardEls:el.length, statusWords:[...new Set(st)], statusCounts:st.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{}), ids:ids.slice(0,15), nIds:ids.length};});

await H.resetFilters(page); await page.waitForTimeout(3000);
R.startUrl=page.url();
R.chipRow=await chips();
R.scroll=await page.evaluate(()=>{const c=[...document.querySelectorAll('div')].filter(d=>d.querySelector('.mobile-chip')&&d.scrollWidth>d.clientWidth+2)[0];
  return c?{scrollWidth:c.scrollWidth,clientWidth:c.clientWidth,overflowX:getComputedStyle(c).overflowX,cls:c.className.slice(0,80)}:null;});
R.collapseToggle=await page.evaluate(()=>({byTestId:[...document.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).filter(t=>/collapse|filter_toggle|tune/i.test(t)),
  tuneIcon:!!document.querySelector('[data-test-id="button_toggle_filters"]')}));
R.cardsBase=await cards();
await H.shot(page,'mob-01-base'); S('base');
console.log('CHIPS:',R.chipRow.map(c=>`${c.t}[${c.testid}]@${c.x}`).join('  '));
console.log('SCROLLABLE:',JSON.stringify(R.scroll));
console.log('cardsBase:',JSON.stringify(R.cardsBase.statusCounts),'nIds',R.cardsBase.nIds);

// ===== 1) SINGLE-FILTER SHEET: Status =====
{
  const o={}; const n0=listQ().length;
  await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000});
  await page.waitForTimeout(2800);
  o.sheetOnOpen=await sheet(); o.callsOnOpen=listQ().length-n0;
  const ids=(o.sheetOnOpen.testIds||[]).filter(t=>/^filter_option_status_/.test(t));
  o.optionIds=ids;
  o.urlBefore=page.url(); o.cardsBefore=await cards();
  const paid=ids.find(t=>/paid/.test(t))||ids[0]; o.ticked1=paid;
  await page.locator(`[data-test-id="${paid}"]`).first().click({timeout:20000});
  await page.waitForTimeout(500);  o.at500ms={calls:listQ().length-n0,url:page.url()};
  await page.waitForTimeout(4000); const sh=await sheet();
  o.at4_5s={calls:listQ().length-n0,url:page.url(),cards:await cards(),sheetOpen:!!sh};
  o.APPLY_IN_SINGLE_SHEET = sh? sh.applyButtons : null;
  o.APPLIED_ON_TAP = (o.at4_5s.url!==o.urlBefore) || (o.at4_5s.calls>o.callsOnOpen);
  // second value -> multi-select?
  const second=ids.find(t=>/declined/.test(t))||ids.find(t=>t!==paid); o.try2=second;
  try{ await page.locator(`[data-test-id="${second}"]`).first().click({timeout:9000}); await page.waitForTimeout(3500);
    const s2=await sheet();
    o.secondTick={ok:true,sheetOpen:!!s2,checked:(s2&&s2.options||[]).filter(x=>x.checked==='true').map(x=>x.label),url:page.url(),cards:await cards()};
  }catch(e){o.secondTick={ok:false,err:e.message.slice(0,170)};}
  o.clearControls=(await sheet()||{}).clearControls;
  await H.shot(page,'mob-02-status-sheet');
  R.singleSheet=o; S('single');
  console.log('SINGLE-FILTER SHEET  appliedOnTap =',o.APPLIED_ON_TAP,' applyButtons =',JSON.stringify(o.APPLY_IN_SINGLE_SHEET));
  console.log('  urlBefore',o.urlBefore.slice(-60),'-> urlAfter',o.at4_5s.url.slice(-60));
  console.log('  multiSelect:',JSON.stringify(o.secondTick).slice(0,300));
}
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
await H.resetFilters(page); await page.waitForTimeout(3000);

// ===== 2) COMBINED "All Filters" SHEET =====
{
  const o={}; const n0=listQ().length;
  await page.locator('[data-test-id="filter_chip_all_filters"]').first().click({timeout:20000});
  await page.waitForTimeout(3000);
  o.sheetOnOpen=await sheet(); o.callsOnOpen=listQ().length-n0;
  o.APPLY_LABEL=o.sheetOnOpen.applyButtons;
  o.footerButtons=o.sheetOnOpen.buttons;
  o.sheetRows=(o.sheetOnOpen.text||'').split('\n').slice(0,22);
  // expand the Status row
  let via=null;
  for(const t of ['filter_row_status','filter_expand_status','filter_section_status','filter_accordion_status']){
    const l=page.locator(`[data-test-id="${t}"]`).first();
    if(await l.count()){ await l.click({timeout:9000}); via=t; break; }
  }
  if(!via){ const st=page.locator('.q-dialog').last().getByText(/^Status$/).first();
    if(await st.count()){ await st.click({timeout:9000}); via='text:Status'; } }
  o.expandedVia=via; await page.waitForTimeout(2500);
  const sh2=await sheet(); o.sheetExpandedTestIds=sh2.testIds; o.sheetExpandedText=(sh2.text||'').slice(0,500);
  const optIds=(sh2.testIds||[]).filter(t=>/^filter_option_status_/.test(t)); o.optionIds=optIds;
  o.urlBefore=page.url(); o.cardsBefore=await cards();
  if(optIds.length){
    const paid=optIds.find(t=>/paid/.test(t))||optIds[0];
    await page.locator(`[data-test-id="${paid}"]`).first().click({timeout:15000});
    await page.waitForTimeout(4500);
    o.afterTick_NO_APPLY={calls:listQ().length-n0,url:page.url(),urlUnchanged:page.url()===o.urlBefore,
      cards:await cards(), listUnchanged:JSON.stringify((await cards()).ids)===JSON.stringify(o.cardsBefore.ids)};
    const second=optIds.find(t=>/declined/.test(t))||optIds.find(t=>t!==paid);
    if(second){ try{ await page.locator(`[data-test-id="${second}"]`).first().click({timeout:9000}); await page.waitForTimeout(2500);
      const s3=await sheet(); o.secondTickCombined={ok:true,checked:(s3.options||[]).filter(x=>x.checked==='true').map(x=>x.label)};
    }catch(e){o.secondTickCombined={ok:false,err:e.message.slice(0,140)};} } }
  await H.shot(page,'mob-03-allfilters-staged');
  const sh3=await sheet(); const ab=(sh3.applyButtons||[])[0]; o.applyBtn=ab;
  if(ab){ try{
      if(ab.testid) await page.locator(`[data-test-id="${ab.testid}"]`).first().click({timeout:15000});
      else await page.locator('.q-dialog').last().locator('button').filter({hasText:/apply/i}).first().click({timeout:15000});
      await page.waitForTimeout(5000);
      o.afterApply={calls:listQ().length-n0,url:page.url(),cards:await cards(),sheetOpen:!!(await sheet()),chips:await chips()};
    }catch(e){o.afterApply={ok:false,err:e.message.slice(0,200)};} }
  await H.shot(page,'mob-04-allfilters-applied');
  R.combined=o; S('combined');
  console.log('COMBINED SHEET  APPLY LABEL =',JSON.stringify(o.APPLY_LABEL));
  console.log('  staged (no apply):',JSON.stringify(o.afterTick_NO_APPLY).slice(0,320));
  console.log('  secondTick:',JSON.stringify(o.secondTickCombined));
  console.log('  afterApply:',JSON.stringify(o.afterApply).slice(0,360));
}
R.allListCalls=listQ(); R.finalUrl=page.url();
S('done'); await browser.close();
