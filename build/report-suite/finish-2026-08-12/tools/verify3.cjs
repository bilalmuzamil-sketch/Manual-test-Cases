// Verify the THREE prepared changes independently: C30107, C43591 (SBC Product Type
// multi-select) and C38913 (SBR Location column in the column selector).
//
// Designed so the check CAN FAIL: every control is located by exact test-id, the open
// state is PROVEN by counting what appeared, and a control that is not found is
// distinguished from a control that is found and empty.
const {boot,RENDERED}=require('../../verify-final-2026-08-12/tools/harness.cjs');
const fs=require('fs');

const REPORTS={
  sbc:'/reports/sales-by-customer',
  sbr:'/reports/sales-by-representative',
};

(async()=>{
  const H=await boot({viewport:{width:1680,height:1080}});
  const {page}=H;
  const out={build:null,probes:{},bridge_errors:null};

  // ---- build marker as the browser sees it -----------------------------------
  out.build=await page.evaluate(`(()=>{
    const m=document.querySelector('meta[name=app-version]');
    return m?m.getAttribute('content'):null;
  })()`);

  async function go(p){
    await page.goto(H.APP+p,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForTimeout(6500);
  }

  // =========================================================================
  // PROBE 1 — SBC Product Type control
  // =========================================================================
  await go(REPORTS.sbc);
  out.probes.sbc_producttype=await page.evaluate(`(()=>{
    ${RENDERED}
    const r={};
    // every test-id on the page that mentions product/type, so a rename cannot read as absence
    r.candidate_ids=[...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id'))
      .filter(id=>/product|type/i.test(id));
    const el=document.querySelector('[data-test-id=select_sbc_product_type]');
    r.exact_control_found=!!el;
    r.control_label=__lab(el);
    // total controls in the toolbar, to prove the page rendered at all
    r.total_testids=document.querySelectorAll('[data-test-id]').length;
    return r;
  })()`);

  // open it and enumerate EVERYTHING that appears
  const sel='[data-test-id=select_sbc_product_type]';
  const before=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);
  let opened=false;
  try{ await page.click(sel,{timeout:8000}); opened=true; }catch(e){ out.probes.sbc_open_error=String(e).slice(0,160); }
  await page.waitForTimeout(2500);
  const after=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);

  out.probes.sbc_open={clicked:opened, testids_before:before, testids_after:after,
    grew:after>before};

  out.probes.sbc_options=await page.evaluate(`(()=>{
    ${RENDERED}
    const r={};
    // 1. anything that looks like a dropdown surface
    const menus=[...document.querySelectorAll('.q-menu, [role=listbox], .q-select__dialog, .q-dialog')];
    r.menu_count=menus.length;
    // 2. EVERY element inside those surfaces carrying a test-id or visible text
    r.menu_items=[];
    for(const m of menus){
      for(const e of m.querySelectorAll('*')){
        const t=(e.innerText||'').replace(/\\s+/g,' ').trim();
        const tid=e.getAttribute('data-test-id');
        if((t && e.children.length===0) || tid){
          r.menu_items.push({tid, it:t.slice(0,80), tag:e.tagName.toLowerCase(),
            role:e.getAttribute('role'), cls:(e.className||'').toString().slice(0,60)});
        }
      }
    }
    // 3. q-item is Quasar's option row; count them explicitly
    r.q_items=[...document.querySelectorAll('.q-menu .q-item, [role=listbox] [role=option], .q-dialog .q-item')]
      .map(e=>({it:(e.innerText||'').replace(/\\s+/g,' ').trim(),
                tid:e.getAttribute('data-test-id'),
                has_toggle: !!e.querySelector('.q-toggle, .q-checkbox, input[type=checkbox]'),
                aria_selected: e.getAttribute('aria-selected')}));
    // 4. toggles/checkboxes anywhere in an open surface
    r.toggles=[...document.querySelectorAll('.q-menu .q-toggle, .q-menu .q-checkbox, .q-dialog .q-toggle, .q-dialog .q-checkbox')]
      .map(e=>({it:(e.innerText||'').replace(/\\s+/g,' ').trim(), tid:e.getAttribute('data-test-id')}));
    return r;
  })()`);

  await page.keyboard.press('Escape'); await page.waitForTimeout(800);

  // =========================================================================
  // PROBE 2 — SBR column selector: is Location offered in it?
  // =========================================================================
  await go(REPORTS.sbr);
  out.probes.sbr_static=await page.evaluate(`(()=>{
    ${RENDERED}
    const r={};
    r.total_testids=document.querySelectorAll('[data-test-id]').length;
    r.headers=[...document.querySelectorAll('thead th')].map(e=>__lab(e).it);
    // any control that could be a column selector
    r.column_like_ids=[...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id'))
      .filter(id=>/column|col_|display|settings|gear|customi/i.test(id));
    r.all_ids=[...new Set([...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id')))];
    return r;
  })()`);

  out.bridge_errors=H.bridgeErrors;
  out.api_sample=H.apiLog.slice(-25);
  fs.writeFileSync('/tmp/rs812/verify3.json',JSON.stringify(out,null,2));
  console.log(JSON.stringify({build:out.build,
    sbc_control:out.probes.sbc_producttype.exact_control_found,
    sbc_candidates:out.probes.sbc_producttype.candidate_ids,
    sbc_menu_count:out.probes.sbc_options.menu_count,
    sbc_q_items:out.probes.sbc_options.q_items,
    sbc_toggles:out.probes.sbc_options.toggles,
    sbr_headers:out.probes.sbr_static.headers,
    sbr_column_like:out.probes.sbr_static.column_like_ids,
    bridge_errors:out.bridge_errors.length},null,2));
  await H.browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
