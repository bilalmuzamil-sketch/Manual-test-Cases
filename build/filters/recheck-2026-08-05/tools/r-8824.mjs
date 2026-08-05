// SV-8824 RE-CHECK on v3.4.2-d00239b: does a multi-select dropdown stay open after one tick?
// Exhaustive: all five chips, tick 1 -> panel state, tick 2 WITHOUT reopening -> selections.
import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-8824.json',JSON.stringify(R,null,1));console.log('..'+n);};
await H.resetFilters(page);
R.startChips=await H.chips(page); R.startUrl=page.url();
S('reset');

// ---- option-list panels: Status (checkbox list) ----
const OPT={Status:['filter_option_status_estimate','filter_option_status_approved','filter_option_status_paid']};
for(const [chip,opts] of Object.entries(OPT)){
  const o={};
  o.open=await H.openChip(page,chip);
  o.panelBeforeTick=await H.panel(page);
  await page.locator(`[data-test-id="${opts[0]}"]`).first().click({timeout:20000});
  await page.waitForTimeout(700);  o.panelAt700ms=await H.panel(page);
  await page.waitForTimeout(3300);  o.panelAt4s=await H.panel(page);
  o.panelStillOpen=!!o.panelAt4s;
  if(o.panelStillOpen){
    // tick a SECOND value WITHOUT reopening - the exact thing SV-8824 said was impossible
    try{ await page.locator(`[data-test-id="${opts[1]}"]`).first().click({timeout:8000});
      await page.waitForTimeout(3000);
      o.secondTickWithoutReopen={ok:true,panel:await H.panel(page),chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n};
      // and a THIRD, still without reopening
      await page.locator(`[data-test-id="${opts[2]}"]`).first().click({timeout:8000});
      await page.waitForTimeout(3000);
      o.thirdTickWithoutReopen={ok:true,chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n};
    }catch(e){o.secondTickWithoutReopen={ok:false,err:e.message.slice(0,200)};}
  }
  await H.shot(page,'r8824-'+chip.toLowerCase());
  R[chip]=o; S(chip);
  await H.closePanel(page); await H.resetFilters(page);
}
// ---- search-type panels: Customer / Lead Technician / Service Advisor ----
for(const chip of ['Customer','Lead Technician','Service Advisor']){
  const o={};
  o.open=await H.openChip(page,chip);
  const p0=await H.panel(page); o.panelBeforeTick={h:p0&&p0.h,options:(p0&&p0.options||[]).slice(0,3).map(x=>x.label)};
  const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)).slice(0,4));
  o.optionIds=ids;
  if(ids.length>=2){
    await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
    await page.waitForTimeout(700); const pa=await H.panel(page); o.panelAt700ms={open:!!pa,h:pa&&pa.h};
    await page.waitForTimeout(3300); const pb=await H.panel(page); o.panelAt4s={open:!!pb,h:pb&&pb.h,tags:pb&&pb.tags};
    o.panelStillOpen=!!pb;
    if(o.panelStillOpen){
      try{ await page.locator(`[data-test-id="${ids[1]}"]`).first().click({timeout:8000});
        await page.waitForTimeout(3000);
        const pc=await H.panel(page);
        o.secondTickWithoutReopen={ok:true,tags:pc&&pc.tags,chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n};
      }catch(e){o.secondTickWithoutReopen={ok:false,err:e.message.slice(0,200)};}
    }
  }
  await H.shot(page,'r8824-'+chip.replace(/ /g,'').toLowerCase());
  R[chip]=o; S(chip);
  await H.closePanel(page); await H.resetFilters(page);
}
// ---- Asset on Site (yes/no) ----
{
  const o={}; o.open=await H.openChip(page,'Asset on Site');
  const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)));
  o.optionIds=ids;
  if(ids.length){ await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
    await page.waitForTimeout(4000); const p=await H.panel(page);
    o.panelAt4s={open:!!p,h:p&&p.h}; o.panelStillOpen=!!p; o.chips=await H.chips(page); o.url=page.url(); }
  await H.shot(page,'r8824-assetonsite');
  R['Asset on Site']=o; S('assetonsite');
}
R.prefs=H.prefCalls(netlog); R.listCalls=H.listCalls(netlog).slice(-6);
await H.resetFilters(page); S('done');
await browser.close();
