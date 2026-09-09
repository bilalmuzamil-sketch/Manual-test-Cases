// Drive the inline Add Part route on an EDITABLE (Estimate) work order.
// Covers the route for C44988 (button present) / C44989 (inline row + focus) / C44990 (fields per
// view mode) / C44991 (Edit control on hover+focus) and captures the exact labels.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';   // Estimate WO recorded 2026-09-08
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const out = { build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content),
              identity:{slug:s.templateSlug,n:s.nFePerms,role:s.role} };
log('build', out.build);

await page.goto(`${APP}/workorders/${EST}/lines`, {waitUntil:'domcontentloaded', timeout:60000});
await page.waitForTimeout(10000);
out.url = page.url();
out.header = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return { tabs:[...document.querySelectorAll('[role=tab],.q-tab')].map(t).slice(0,10),
           status:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,220) };
});
log('tabs:', JSON.stringify(out.header.tabs));
await page.screenshot({path:`${DIR}/evidence/02-a-lines.png`, fullPage:true});

// expand the first work line (the Parts section lives inside an expanded line)
const exp = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('.q-expansion-item, [class*=expansion], tr')];
  const cand=rows.filter(r=>/\d{2}\b/.test(t(r)) && t(r).length>10).slice(0,6).map(r=>t(r).slice(0,70));
  const head=[...document.querySelectorAll('.q-expansion-item__toggle-icon, .q-expansion-item')].length;
  return {sampleRows:cand, expansionItems:head};
});
out.beforeExpand = exp;
log('expansion items:', exp.expansionItems, '| sample rows:', JSON.stringify(exp.sampleRows.slice(0,3)));

// click the first expansion item to open a line
const clicked = await page.evaluate(()=>{
  const it=document.querySelector('.q-expansion-item');
  if(!it) return 'no expansion item';
  const hdr=it.querySelector('.q-item, .q-expansion-item__container > .q-item, [role=button]') || it;
  hdr.click(); return 'clicked';
});
log('expand:', clicked);
await page.waitForTimeout(6000);
await page.screenshot({path:`${DIR}/evidence/02-b-line-expanded.png`, fullPage:true});

const afterExpand = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const btns=[...document.querySelectorAll('button,[role=button],a,.q-btn')].map(b=>({l:t(b).slice(0,40),tid:b.getAttribute('data-test-id')})).filter(b=>b.l);
  return { addPart: btns.filter(b=>/add part/i.test(b.l)),
           allButtons: btns.map(b=>b.l).filter((v,i,a)=>a.indexOf(v)===i).slice(0,40),
           partsWord: /\bParts\b/.test(document.body.innerText||''),
           body:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,700) };
});
out.afterExpand = afterExpand;
log('Add Part buttons:', JSON.stringify(afterExpand.addPart));
log('buttons seen:', JSON.stringify(afterExpand.allButtons.slice(0,22)));

// click + Add Part and read the inline row
if (afterExpand.addPart.length) {
  const ok = await page.evaluate(()=>{
    const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,[role=button],a,.q-btn')].find(x=>/add part/i.test(t(x)));
    if(!b) return 'gone'; b.scrollIntoView({block:'center'}); b.click(); return 'clicked';
  });
  log('Add Part click:', ok);
  await page.waitForTimeout(5000);
  await page.screenshot({path:`${DIR}/evidence/02-c-inline-row.png`, fullPage:true});
  out.inlineRow = await page.evaluate(()=>{
    const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const inputs=[...document.querySelectorAll('input,select,textarea')].map(i=>({
      tid:i.getAttribute('data-test-id'), ph:i.placeholder||null, aria:i.getAttribute('aria-label'),
      name:i.name||null, type:i.type, ro:i.readOnly, val:(i.value||'').slice(0,20),
      focused: document.activeElement===i }));
    const labels=[...document.querySelectorAll('label,.q-field__label')].map(t).filter(Boolean).slice(0,20);
    const btns=[...document.querySelectorAll('button,.q-btn')].map(b=>t(b)).filter(Boolean).slice(0,25);
    return { inputs, labels, buttons:btns,
             activeTag:document.activeElement&&document.activeElement.tagName,
             activeTid:document.activeElement&&document.activeElement.getAttribute&&document.activeElement.getAttribute('data-test-id'),
             hint:(document.body.innerText.match(/.{0,90}(Enter|Esc|Tab).{0,90}/g)||[]).slice(0,4) };
  });
  log('inline inputs:', JSON.stringify(out.inlineRow.inputs.slice(0,10)));
  log('inline labels:', JSON.stringify(out.inlineRow.labels));
  log('focused:', out.inlineRow.activeTag, out.inlineRow.activeTid);
  log('hint:', JSON.stringify(out.inlineRow.hint));
}
fs.writeFileSync(`${DIR}/evidence/02-addpart.json`, JSON.stringify(out,null,1));
log('written');
await s.browser.close();
