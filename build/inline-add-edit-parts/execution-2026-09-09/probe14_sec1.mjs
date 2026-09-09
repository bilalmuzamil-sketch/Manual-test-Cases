// Section 1 execution: C44988 / C44989 / C44990 / C44991 / C44992 / C44997, in FULL VIEW.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={};
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const vm = await page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;return d.view_mode;});
log('view_mode:', vm, '| build:', await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
R.viewMode=vm;

await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
// expand every line
const nLines = await page.evaluate(()=>{
  const its=[...document.querySelectorAll('.q-expansion-item')];
  its.forEach(i=>{ const h=i.querySelector('.q-item'); if(h) h.click(); });
  return its.length;
});
log('expansion items clicked:', nLines);
await page.waitForTimeout(7000);
await page.screenshot({path:`${DIR}/evidence/14-a-all-lines.png`, fullPage:true});

// ---- C44988: an Add Part control per line, in its Parts section; incl. a line with no parts
R.C44988 = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const btns=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const perBtn = btns.map(b=>{
    // walk up to the panel that also holds a "Parts" heading
    let box=b, partsHeading=null, depth=0;
    while(box.parentElement && depth++<10){ box=box.parentElement;
      const h=[...box.querySelectorAll('*')].find(e=>e.children.length===0 && /^Parts\b/i.test(t(e)));
      if(h){ partsHeading=t(h); break; } }
    const rows=[...box.querySelectorAll('[data-test-id^=button_edit_part_]')].length;
    return { visible:!!b.offsetParent, partsHeading, partRowsInBox:rows };
  });
  return { addPartCount:btns.length, perBtn };
});
log('C44988:', JSON.stringify(R.C44988));

// ---- C44991: Edit control hidden until hover, and revealed on keyboard focus
R.C44991 = await page.evaluate(()=>{
  const e=document.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return {err:'no edit control'};
  const base=getComputedStyle(e).opacity;
  const row=e.closest('tr,[class*=row],div');
  row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
  row&&row.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
  const afterHover=getComputedStyle(e).opacity;
  e.focus();
  const afterFocus=getComputedStyle(e).opacity;
  return { opacityAtRest:base, opacityOnHover:afterHover, opacityOnKeyboardFocus:afterFocus,
           focusable: document.activeElement===e, tabIndex:e.tabIndex };
});
log('C44991:', JSON.stringify(R.C44991));

// ---- C44989 + C44990: open the row; where does it sit, where is the cursor, how many fields
await page.evaluate(()=>{ const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click(); });
await page.waitForTimeout(5000);
await page.screenshot({path:`${DIR}/evidence/14-b-fullview-row.png`, fullPage:true});
R.row = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const desc=document.querySelector('[data-test-id=input_inline_part_description]');
  if(!desc) return {err:'no inline row'};
  let box=desc; for(let i=0;i<9&&box.parentElement;i++){ box=box.parentElement;
    if(box.querySelector('[data-test-id^=button_save_inline]')||/save/i.test(t(box))&&box.querySelectorAll('input').length>=3) break; }
  const fields=[...box.querySelectorAll('input,select')].map(i=>({
    tid:i.getAttribute('data-test-id'), aria:i.getAttribute('aria-label'), type:i.type, ro:i.readOnly,
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    focused:document.activeElement===i }));
  const btns=[...box.querySelectorAll('button,.q-btn')].map(b=>({l:t(b).slice(0,26),tid:b.getAttribute('data-test-id')}));
  // C44989: is the row ABOVE the existing part rows within the same panel?
  const addBtn=document.querySelector('[data-test-id=button_add_part]');
  const editBtns=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  const pos = e => { const r=e.getBoundingClientRect(); return r.top+window.scrollY; };
  const rowTop=pos(desc);
  const partTops=editBtns.map(pos).filter(y=>Math.abs(y-rowTop)<4000);
  return { fieldCount:fields.filter(f=>f.type!=='hidden').length, fields, buttons:btns,
           rowTop, addBtnTop: addBtn?pos(addBtn):null,
           firstPartTop: partTops.length?Math.min(...partTops):null,
           boxText:t(box).slice(0,260) };
});
log('C44989/C44990 row:', JSON.stringify(R.row).slice(0,1200));

// ---- C44992 (Full View): Edit opens the part details modal
await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
await page.evaluate(()=>{ const e=document.querySelector('[data-test-id^=button_edit_part_]'); if(e){e.scrollIntoView({block:'center'}); e.click();} });
await page.waitForTimeout(6000);
R.C44992 = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('.q-dialog');
  const inlineEdit=document.querySelector('[data-test-id=input_inline_part_description]');
  return { modalOpen:!!d, modalTitle: d? t(d.querySelector('.q-card__section,h1,h2,h3,.text-h6')||d).slice(0,80):null,
           inlineEditRowOpen:!!inlineEdit };
});
log('C44992:', JSON.stringify(R.C44992));
await page.screenshot({path:`${DIR}/evidence/14-c-edit-modal.png`, fullPage:true});

fs.writeFileSync(`${DIR}/evidence/14-sec1.json`, JSON.stringify(R,null,1));
await s.browser.close();
