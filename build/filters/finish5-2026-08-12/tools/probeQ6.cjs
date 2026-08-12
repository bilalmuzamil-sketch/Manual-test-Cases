// probeQ6 — (1) re-run the Sales pick with the CORRECT chip id (my last read used the Work
// Orders id and so could not fail); (2) establish the Reports option markup so "ticked" can
// fail; (3) drive C38882's Custom From/To; (4) drive C43562 collapse / return / shared URL /
// phone.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { probe:'Q6', at:new Date().toISOString() };
  const go = async (p,w=11000)=>{await P.goto(APP+p,{waitUntil:'domcontentloaded',timeout:120000});
    await P.waitForTimeout(w); await L.ensureBarOpen(P);};
  const rows = ()=>P.evaluate(()=>document.querySelectorAll('tbody tr').length);
  const chipTexts = ()=>P.$$eval('[data-test-id^="filter_chip_"]',els=>els.map(e=>
    (e.innerText||'').replace(/\s+/g,' ').replace(/\s*keyboard_arrow_down$/,'').trim()));

  // ---- 1 + 2: Sales, correct id; and the option markup on a Reports page
  {
    const s={};
    await go('/reports/sales');
    s.chips=await chipTexts(); s.startRows=await rows(); s.startUrl=P.url();
    const o=await L.openChip(P,'filter_chip_companyId');
    s.optionCount=o.options.length;
    s.markup = await P.evaluate(()=>{const e=document.querySelector('div[data-test-id^="filter_option_"]');
      return e? e.outerHTML.slice(0,600):null;});
    if(o.options.length){ s.picked=o.options[0].text;
      await L.pickOption(P,o.options[0].id); await P.waitForTimeout(3200);
      s.afterPickMarkup = await P.evaluate(()=>{const els=[...document.querySelectorAll('div[data-test-id^="filter_option_"]')];
        const t=els.find(e=>/check/.test(e.innerText||'')||e.getAttribute('aria-checked')==='true'||e.querySelector('.q-item__section--side'));
        return t? t.outerHTML.slice(0,700):'NONE-LOOKS-SELECTED';});
      s.ticked=await L.tickedCount(P);
    }
    await L.closeMenu(P);
    s.after={rows:await rows(),url:P.url(),chips:await chipTexts()};
    R.salesCorrectId=s;
    console.log('SALES(correct id):',JSON.stringify({o:s.optionCount,picked:s.picked,after:s.after,ticked:s.ticked}).slice(0,500));
    console.log('  OPTION MARKUP:', (s.markup||'').replace(/\s+/g,' ').slice(0,320));
    console.log('  AFTER PICK   :', (s.afterPickMarkup||'').replace(/\s+/g,' ').slice(0,320));
  }

  // ---- 3: C38882 Custom From/To on Timesheet Activities
  {
    const s={};
    await go('/reports/punch-clock-activities');
    s.startUrl=P.url(); s.startRows=await rows(); s.chipBefore=(await chipTexts())[0];
    await L.clickSel(P,'[data-test-id="filter_chip_range"]'); await P.waitForTimeout(2200);
    // pick a ready-made period first (step 3)
    s.pickedPeriod = await P.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return null;
      const t=[...m.querySelectorAll('div,li')].find(e=>/^Today$/.test((e.innerText||'').trim()));
      if(!t) return null; t.click(); return 'Today';});
    await P.waitForTimeout(3200);
    s.afterPeriod={url:P.url(),rows:await rows(),chip:(await chipTexts())[0]};
    // step 4: open again, choose Custom
    await L.clickSel(P,'[data-test-id="filter_chip_range"]'); await P.waitForTimeout(2200);
    s.clickedCustom = await P.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return false;
      const t=[...m.querySelectorAll('div,li,button')].find(e=>/^Custom$/.test((e.innerText||'').trim()));
      if(!t) return false; t.click(); return true;});
    await P.waitForTimeout(2600);
    s.customPanel = await P.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return{menu:false};
      return { menu:true, text:(m.innerText||'').replace(/\s+/g,' ').slice(0,300),
        inputs:[...m.querySelectorAll('input')].map(i=>({ph:i.getAttribute('placeholder'),
          al:i.getAttribute('aria-label'), id:i.getAttribute('data-test-id'), type:i.type, val:i.value})) };});
    // step 5: From only
    if (s.customPanel.menu && s.customPanel.inputs.length) {
      const urlBefore=P.url();
      await P.evaluate(()=>{const m=document.querySelector('.q-menu');const i=m.querySelectorAll('input')[0];
        i.focus();});
      await P.keyboard.type('07/01/2026',{delay:60}); await P.waitForTimeout(3000);
      s.afterFromOnly={url:P.url(),urlChanged:P.url()!==urlBefore,rows:await rows()};
      // step 6: To
      if (s.customPanel.inputs.length>1){
        await P.evaluate(()=>{const m=document.querySelector('.q-menu');const i=m.querySelectorAll('input')[1];
          i.focus();});
        await P.keyboard.type('07/31/2026',{delay:60}); await P.waitForTimeout(3400);
        s.afterTo={url:P.url(),rows:await rows(),chip:(await chipTexts())[0]};
      }
    }
    await L.closeMenu(P);
    R.customRange=s;
    console.log('CUSTOM RANGE:',JSON.stringify(s).slice(0,900));
  }

  // ---- 4: C43562 — collapse / leave-and-return / shared URL, on Parts then a report
  for (const [tag, path, chipId, optHint] of [
      ['parts','/parts/inventory','filter_chip_category',null],
      ['report','/reports/punch-clock-activities','filter_chip_staffId',null]]) {
    const s={};
    await go(path);
    // step 1: set one filter
    const o=await L.openChip(P,chipId);
    s.optionCount=o.options.length;
    if(o.options.length){ const pick=o.options.find(x=>x.text&&!/uncategor/i.test(x.text))||o.options[0];
      s.picked=pick.text; await L.pickOption(P,pick.id); await P.waitForTimeout(3000);}
    await L.closeMenu(P);
    s.filteredUrl=P.url(); s.filteredRows=await rows(); s.chips=await chipTexts();
    // step 2: collapse control
    s.chipCount=s.chips.length;
    s.collapsePresent=!!(await P.$('[data-test-id="toggle_filter_bar"]'));
    if(s.collapsePresent){
      await L.clickSel(P,'[data-test-id="toggle_filter_bar"]'); await P.waitForTimeout(2600);
      s.afterCollapse={chips:(await chipTexts()).length};
      await L.clickSel(P,'[data-test-id="toggle_filter_bar"]'); await P.waitForTimeout(2600);
      s.afterExpand={chips:(await chipTexts()).length};
    }
    // step 3: leave and come back
    await P.goto(APP+'/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:120000});
    await P.waitForTimeout(7000);
    await P.goto(APP+path,{waitUntil:'domcontentloaded',timeout:120000});
    await P.waitForTimeout(10000);
    s.onReturn={url:P.url(),chips:await chipTexts(),
      collapsed:(await P.$$('[data-test-id^="filter_chip_"]')).length===0};
    R['c43562_'+tag]=s;
    console.log(`C43562/${tag}:`,JSON.stringify(s).slice(0,700));
  }
  fs.writeFileSync(`${OUT}/probeQ6.json`,JSON.stringify({...R,bridgeErrors:h.bridgeErrors,
    api4xx:h.apiLog.filter(a=>a.s>=400)},null,2));
  console.log('bridge',h.bridgeErrors.length,'4xx',JSON.stringify(h.apiLog.filter(a=>a.s>=400).slice(0,5)));
  await h.browser.close();
})();
