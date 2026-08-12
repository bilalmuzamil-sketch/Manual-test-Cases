// C38913: is the Location column OFFERED IN THE COLUMN SELECTOR on Sales By Representative,
// and is it toggleable? Measured in BOTH location states so the answer cannot be an artefact
// of whatever the filter happened to be set to.
const {boot,RENDERED}=require('../../verify-final-2026-08-12/tools/harness.cjs');
const fs=require('fs');

(async()=>{
  const H=await boot({viewport:{width:1680,height:1080}});
  const {page}=H; const out={build:null,steps:[]};
  out.build=await page.evaluate(`(()=>{const m=document.querySelector('meta[name=app-version]');return m&&m.getAttribute('content');})()`);

  await page.goto(H.APP+'/reports/sales-by-representative',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(7000);

  const readState=async(tag)=>{
    const st=await page.evaluate(`(()=>{
      ${RENDERED}
      const loc=document.querySelector('[data-test-id=select_multiple_report_location_filter]');
      return {
        location_control_label: __lab(loc),
        headers:[...document.querySelectorAll('thead th')].map(e=>(e.innerText||'').replace(/\\s*(arrow_drop_(up|down)|keyboard_double_arrow_(down|up))\\s*/g,'').replace(/\\s+/g,' ').trim()).filter(Boolean),
        header_ids:[...document.querySelectorAll('[data-test-id^=header_sbr_]')].map(e=>e.getAttribute('data-test-id'))
      };
    })()`);
    out.steps.push({tag,...st}); return st;
  };

  // ---- state as found -------------------------------------------------------
  await readState('as_found');

  // ---- open the column selector and enumerate EVERY row in it ---------------
  const openSelector=async(tag)=>{
    const before=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);
    let clicked=false;
    try{ await page.click('[data-test-id=button_column_selection]',{timeout:8000}); clicked=true; }
    catch(e){ out.steps.push({tag:tag+'_click_error',err:String(e).slice(0,140)}); }
    await page.waitForTimeout(2200);
    const after=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);
    const panel=await page.evaluate(`(()=>{
      ${RENDERED}
      const surf=[...document.querySelectorAll('.q-menu, .q-dialog, [role=menu], [role=listbox]')];
      const rows=[];
      for(const s of surf){
        for(const e of s.querySelectorAll('.q-item, [role=option], [role=menuitem], label')){
          const t=(e.innerText||'').replace(/\\s+/g,' ').trim();
          if(!t && !e.getAttribute('data-test-id')) continue;
          const cb=e.querySelector('input[type=checkbox], .q-checkbox, .q-toggle');
          rows.push({it:t.slice(0,60), tid:e.getAttribute('data-test-id'),
                     has_checkbox:!!cb,
                     aria_checked:(cb&&cb.getAttribute&&cb.getAttribute('aria-checked'))||e.getAttribute('aria-checked')||null});
        }
      }
      // also: raw text of every open surface, so an unusual layout cannot read as empty
      return {surfaces:surf.length, rows, raw:surf.map(s=>(s.innerText||'').replace(/\\s+/g,' ').trim().slice(0,600))};
    })()`);
    out.steps.push({tag, clicked, testids_before:before, testids_after:after, grew:after>before, ...panel});
    return panel;
  };
  await openSelector('column_selector_as_found');
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);

  // ---- now select ALL locations, then re-read ------------------------------
  try{
    await page.click('[data-test-id=select_multiple_report_location_filter]',{timeout:8000});
    await page.waitForTimeout(2000);
    const opts=await page.evaluate(`(()=>{
      const s=[...document.querySelectorAll('.q-menu .q-item, .q-menu [role=option]')];
      return s.map((e,i)=>({i, it:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,60),
                            tid:e.getAttribute('data-test-id'),
                            sel:e.getAttribute('aria-selected')}));
    })()`);
    out.steps.push({tag:'location_options',opts});
    // click the first row (usually "All locations")
    const all=await page.$$('.q-menu .q-item');
    if(all.length){ await all[0].click(); await page.waitForTimeout(3500); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
  }catch(e){ out.steps.push({tag:'location_open_error',err:String(e).slice(0,160)}); }

  await readState('after_all_locations');
  await openSelector('column_selector_all_locations');
  await page.keyboard.press('Escape');

  out.bridge_errors=H.bridgeErrors.length;
  fs.writeFileSync('/tmp/rs812/verify_loc.json',JSON.stringify(out,null,2));
  console.log('done, bridge_errors=',out.bridge_errors);
  await H.browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
