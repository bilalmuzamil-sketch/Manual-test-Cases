const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const surfaces={};
(async()=>{
  const {browser,page}=await open();
  const shot=async n=>{try{await page.screenshot({path:`${OUT}/surface-${n}.png`});}catch(e){}};
  const grab=async n=>{ try{ const d=await page.evaluate(DUMP); surfaces[n]=d; await shot(n);
      console.log(`[${n}] url=${d.url} texts=${d.texts.length} testids=${d.testids.length}`);
    }catch(e){ surfaces[n]={error:String(e).slice(0,200)}; console.log(`[${n}] ERROR ${e}`);} };
  const click=async(sel,n)=>{ try{ const el=await page.$(sel); if(!el){console.log(`[${n}] selector MISSING ${sel}`);return false;}
      const b=await el.boundingBox(); if(!b){console.log(`[${n}] not visible ${sel}`);return false;}
      await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(2500); return true;
    }catch(e){ console.log(`[${n}] click failed ${e}`); return false; } };
  const esc=async()=>{ try{await page.keyboard.press('Escape'); await page.waitForTimeout(1200);}catch(e){} };

  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  await grab('01-day-view');

  // ---- toolbar: Filter & Display menu (settles '&' vs 'and')
  if(await click('[data-test-id=schedule_filter_display_menu]','02')) await grab('02-filter-display-menu');
  await esc();
  // ---- toolbar: View options menu (settles 'View Options', VIN, My Shifts)
  if(await click('[data-test-id=schedule_view_options_menu]','03')) await grab('03-view-options-menu');
  await esc();
  // ---- sidebar Filters panel
  if(await click('[data-test-id=button_sidebar_filters]','04')) await grab('04-sidebar-filters');
  await esc();
  // ---- conflicts pill
  if(await click('[data-test-id=button_schedule_conflicts]','05')) await grab('05-conflicts');
  await esc();
  // ---- sidebar search toggle
  if(await click('[data-test-id=button_schedule_search_toggle]','06')) await grab('06-search-toggle');
  await esc();
  // ---- expand a work-order card (line list, scope controls)
  try{
    const card=await page.$('[data-test-id=sidebar_work_order_card]');
    if(card){ const b=await card.boundingBox();
      await page.mouse.click(b.x+b.width-24,b.y+24); await page.waitForTimeout(3000);
      await grab('07-wo-card-expanded');
      await page.mouse.click(b.x+b.width-24,b.y+24); await page.waitForTimeout(1200); }
  }catch(e){ console.log('[07] '+e); }
  // ---- hover a shift block (tooltip)
  try{
    const sh=await page.$('[data-test-id=schedule_shift_block]');
    if(sh){ const b=await sh.boundingBox();
      await page.mouse.move(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(3500);
      await grab('08-shift-tooltip'); }
  }catch(e){ console.log('[08] '+e); }
  // ---- click a shift block (modal: Adjust / Reassign / series scope)
  if(await click('[data-test-id=schedule_shift_block]','09')){ await page.waitForTimeout(2500); await grab('09-shift-modal'); }
  await esc();
  // ---- click a series-cue shift (Part of a series / Week N of M)
  try{
    const cue=await page.$('[data-test-id=schedule_block_series_cue]');
    if(cue){ const b=await cue.boundingBox(); if(b){ await page.mouse.click(b.x+b.width/2,b.y+b.height/2);
      await page.waitForTimeout(2500); await grab('10-series-block'); } } else console.log('[10] no series cue');
  }catch(e){ console.log('[10] '+e); }
  await esc();
  // ---- click an EVENT block
  if(await click('[data-test-id=schedule_event_block]','11')){ await page.waitForTimeout(2000); await grab('11-event-block'); }
  await esc();
  // ---- empty grid cell: left click then right click (Create Event / New Work Order / View Day / New Shift)
  try{
    const cal=await page.$('[data-test-id=schedule_calendar]');
    if(cal){ const b=await cal.boundingBox();
      const x=b.x+b.width-140, y=b.y+b.height-90;
      await page.mouse.click(x,y); await page.waitForTimeout(2500); await grab('12-cell-leftclick'); await esc();
      await page.mouse.click(x,y,{button:'right'}); await page.waitForTimeout(2500); await grab('13-cell-rightclick'); await esc(); }
  }catch(e){ console.log('[12/13] '+e); }
  // ---- Week then Month view
  for(const [v,tag] of [['Week','14-week-view'],['Month','15-month-view']]){
    try{ const btns=await page.$$('[data-test-id=schedule_view_toggle] button, [data-test-id=schedule_view_toggle] *');
      let hit=false;
      for(const el of btns){ const t=((await el.innerText().catch(()=>''))||'').trim();
        if(t===v){ const b=await el.boundingBox(); if(b){ await page.mouse.click(b.x+b.width/2,b.y+b.height/2); hit=true; break; } } }
      if(!hit){ const el=await page.$(`text="${v}"`); if(el){const b=await el.boundingBox(); if(b){await page.mouse.click(b.x+b.width/2,b.y+b.height/2); hit=true;}} }
      await page.waitForTimeout(6000); await grab(tag);
    }catch(e){ console.log('['+tag+'] '+e); }
  }
  fs.writeFileSync(OUT+'/surfaces-dump.json',JSON.stringify({surfaces,read_at_utc:new Date().toISOString()},null,1));
  console.log('SURFACES CAPTURED:',Object.keys(surfaces).join(', '));
  await browser.close();
})();
